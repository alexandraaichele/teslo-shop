'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';

export const TopMenu = () => {
	const openMenu = useUIStore((state) => state.openSideMenu);
	const totalItemsInCart = useCartStore((state) => state.getTotalItems());
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setLoaded(true);
	}, []);

	return (
		<nav className="flex px-5 justify-between items-center w-full">
			<div>
				<Link href={'/'}>
					<span className={`${titleFont.className} antialiased font-bold`}>
						Teslo
					</span>
					<span> | Shop</span>
				</Link>
			</div>
			{/* Center Menu*/}
			<div className="hidden sm:block">
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
					href="/gender/men"
				>
					Hombres
				</Link>
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
					href="/gender/women"
				>
					Mujeres
				</Link>
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
					href="/gender/kid"
				>
					Niños
				</Link>
			</div>
			{/* Search, Cart, Menu*/}
			<div className="flex items-center">
				<Link href="/search" className="mx-2">
					<IoSearchOutline className="w-5 h-5" />
				</Link>
				<Link
					href={totalItemsInCart === 0 && loaded ? '/empty' : '/cart'}
					className="mx-2"
				>
					<div className="relative">
						{loaded && totalItemsInCart > 0 && (
							<span className="absolute fade-in text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
								{totalItemsInCart}
							</span>
						)}
						<IoCartOutline />
					</div>
				</Link>
				<button
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
					onClick={openMenu}
				>
					Menú
				</button>
			</div>
		</nav>
	);
};