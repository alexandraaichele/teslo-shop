'use client';

import { useState } from 'react';

import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './slideshow.css';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
	className?: string;
	images: string[];
	title: string;
}

export const ProductSlideShow = ({ className, images, title }: Props) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
	return (
		<div className={className}>
			<Swiper
				style={
					{
						'--swiper-navigation-color': '#fff',
						'--swiper-pagination-color': '#fff',
					} as React.CSSProperties
				}
				spaceBetween={10}
				navigation={true}
				autoplay={{ delay: 2000 }}
				thumbs={{
					swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
				}}
				modules={[Autoplay, FreeMode, Navigation, Thumbs]}
				className="mySwiper2"
			>
				{images.map((image) => (
					<SwiperSlide key={image}>
						<ProductImage
							width={1024}
							height={800}
							src={image}
							alt={title}
							className="rounded-lg object-fill"
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<Swiper
				onSwiper={setThumbsSwiper}
				spaceBetween={10}
				slidesPerView={4}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[FreeMode, Navigation, Thumbs]}
				className="mySwiper"
			>
				{images.map((image) => (
					<SwiperSlide key={image}>
						<ProductImage
							width={300}
							height={300}
							src={image}
							alt={title}
							className="rounded-lg object-fill"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
