import prisma from '../lib/prisma';
import { initialData } from './seed';
async function main() {
	//1. Borrar registros previos
	// await Promise.all([

	await prisma.orderAddress.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();

	await prisma.userAddress.deleteMany();
	await prisma.user.deleteMany();
	await prisma.country.deleteMany();

	await prisma.productImage.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();
	// ]);

	//2. Generar Categorias
	const { categories, products, users, countries } = initialData;

	await prisma.user.createMany({
		data: users,
	});

	await prisma.country.createMany({
		data: countries,
	});

	const categoriesData = categories.map((category) => ({
		name: category,
	}));
	//console.log(categoriesData);
	await prisma.category.createMany({
		data: categoriesData,
	});

	const categoriesId = await prisma.category.findMany();
	const categoriesMap = categoriesId.reduce((map, category) => {
		map[category.name.toLowerCase()] = category.id;

		return map;
	}, {} as Record<string, string>);

	//3. Productos
	products.forEach(async (product) => {
		const { type, images, ...rest } = product;

		const dbProduct = await prisma.product.create({
			data: {
				...rest,
				categoryId: categoriesMap[type],
			},
		});

		//Images
		const imagesData = images.map((image) => ({
			url: image,
			productId: dbProduct.id,
		}));
		await prisma.productImage.createMany({
			data: imagesData,
		});
	});

	console.log('Seed Ejecutado correctamente');
}

(() => {
	if (process.env.NODE_ENV === 'production') return;

	main();
})();
