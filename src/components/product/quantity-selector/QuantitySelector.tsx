'use client';

import { IoRemoveCircleOutline, IoAddCircleOutline } from 'react-icons/io5';

interface Props {
	quantity: number;
	onQuantityChanged: (quantity: number) => void;
}
export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
	const onValueChaged = (value: number) => {
		if (quantity + value < 1) return;

		onQuantityChanged(quantity + value);
	};
	return (
		<div className="flex">
			<button onClick={() => onValueChaged(-1)}>
				{' '}
				<IoRemoveCircleOutline size={30} />
			</button>
			<span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded pt-1">
				{quantity}
			</span>
			<button onClick={() => onValueChaged(+1)}>
				{' '}
				<IoAddCircleOutline size={30} />
			</button>
		</div>
	);
};
