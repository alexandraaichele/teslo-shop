'use server';

import { auth } from '@/auth.config';
import type { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
	productId: string;
	quantity: number;
	size: Size;
}

export const placeOrder = async (
	productIds: ProductToOrder[],
	address: Address
) => {
	const session = await auth();
	const userId = session?.user.id;

	//Verificar sesión de usuario
	if (!userId) {
		return {
			ok: false,
			message: 'No hay sesión de usuario',
		};
	}

	//Obtener la ionformación de los prodcutos
	//Nota: podemos llevar 2+ productos con el mismo id

	const products = await prisma.product.findMany({
		where: {
			id: {
				in: productIds.map((p) => p.productId),
			},
		},
	});

	//Calcular los montos
	const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

	//Totales de tax, subtotal y total
	const { subtotal, tax, total } = productIds.reduce(
		(totals, item) => {
			const productQuantity = item.quantity;
			const product = products.find((product) => product.id === item.productId);

			if (!product) throw new Error(`${item.productId} no existe - 500`);

			const subTotal = product.price * productQuantity;

			totals.subtotal += subTotal;
			totals.tax += subTotal * 0.15;
			totals.total += subTotal * 1.15;

			return totals;
		},
		{
			subtotal: 0,
			tax: 0,
			total: 0,
		}
	);

	try {
		//Crear la transacción de base de datos
		const prismaTx = await prisma.$transaction(async (tx) => {
			//1. Actulizar el stock de los productos
			const updatedProductsPromises = products.map(async (product) => {
				//Acumular los valores
				const productQuantity = productIds
					.filter((p) => p.productId === product.id)
					.reduce((acc, item) => item.quantity + acc, 0);

				if (productQuantity === 0) {
					throw new Error(`${product.id} no tiene stock definido`);
				}

				return tx.product.update({
					where: { id: product.id },
					data: {
						//inStock: product.inStock - productQuantity //ESTO NO SE DEBE HACER
						inStock: {
							decrement: productQuantity,
						},
					},
				});
			});

			const updatedProducts = await Promise.all(updatedProductsPromises);

			//Verificar valores negativos en las existencias = NO hay stock
			updatedProducts.forEach((product) => {
				if (product.inStock < 0) {
					throw new Error(`${product.title} no tiene inventario suficiente`);
				}
			});

			//2. Crear la orden - Encabezado - Detalles
			const order = await tx.order.create({
				data: {
					userId: userId,
					itemsInOrder: itemsInOrder,
					subTotal: subtotal,
					tax: tax,
					total: total,

					OrderItem: {
						createMany: {
							data: productIds.map((p) => ({
								quantity: p.quantity,
								size: p.size,
								productId: p.productId,
								price:
									products.find((product) => product.id === p.productId)
										?.price ?? 0,
							})),
						},
					},
				},
			});

			//3. Crear la dirección de la orden

			const { country } = address;
			const addressUser = await tx.orderAddress.create({
				data: {
					firstName: address.firstName,
					lastName: address.lastName,
					address: address.address,
					address2: address.address2,
					postalCode: address.postalCode,
					city: address.city,
					phone: address.phone,
					countryId: country,
					orderId: order.id,
				},
			});

			return {
				updatedProducts: updatedProducts,
				order: order,
				address: addressUser,
			};
		});
		return {
			ok: true,
			order: prismaTx.order,
			prismaTx: prismaTx,
		};
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				ok: false,
				message: error.message,
			};
		}
	}
};
