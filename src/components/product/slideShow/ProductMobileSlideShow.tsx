'use client';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './slideshow.css';

interface Props {
	className?: string;
	images: string[];
	title: string;
}

export const ProductMobileSlideShow = ({ className, images, title }: Props) => {
	return (
		<div className={className}>
			<Swiper
				style={{
					width: '100vw',
					height: '500px',
				}}
				pagination
				navigation={true}
				autoplay={{ delay: 2000 }}
				modules={[Autoplay, FreeMode, Pagination]}
				className="mySwiper2"
			>
				{images.map((image) => (
					<SwiperSlide key={image}>
						<Image
							width={600}
							height={500}
							src={`/products/${image}`}
							alt={title}
							className="object-fill"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
