import { Footer, Sidebar, TopMenu } from '@/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: {
		template: '%s - Teslo | Shop',
		default: 'Home - Teslo | Shop',
	},
	description: 'Una tienda virtual de productos',
};

export default function ShopLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen">
			<TopMenu />
			<Sidebar />
			<div className="px-0 sm:px-10">{children}</div>
			<Footer />
		</main>
	);
}
