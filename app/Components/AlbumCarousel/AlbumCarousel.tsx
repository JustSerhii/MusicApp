"use client";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";

/** Тип для даних альбому */
interface Album {
  img: string;
  title: string;
  artist: string;
}

/** Пропси для AlbumCarousel */
interface AlbumCarouselProps {
  albums: Album[];
}

export default function AlbumCarousel({ albums }: AlbumCarouselProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <Swiper
        modules={[Autoplay, EffectCoverflow, Navigation]}
        effect="coverflow"
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        }}
        centeredSlides={true}
        slidesPerView={1.3}
        loop={true}
        navigation={true}
        autoplay={{
          delay: 2700,
          disableOnInteraction: false,
        }}
        speed={1000}
        spaceBetween={0}
        className="mySwiper"
      >
        {albums.map((album, i) => (
          <SwiperSlide key={i}>
            <div
              className="
                relative
                bg-[#1f1f1f]
                rounded-xl
                overflow-hidden
                shadow-lg
                text-white
                flex
                flex-col
                items-center
                justify-center
                p-4
              "
            >
              <img
                src={album.img}
                alt={album.title}
                className="
                  w-52
                  h-52
                  object-cover
                  rounded-lg
                  mb-3
                  transition
                  duration-300
                  ease-in-out
                  transform
                  hover:scale-105
                  shadow-md
                "
              />
              <h3 className="text-lg font-semibold">{album.title}</h3>
              <p className="text-sm text-gray-300">{album.artist}</p>
              <button
                className="
                  absolute
                  right-4
                  bottom-4
                  bg-[#ff7043]
                  text-white
                  rounded-full
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  shadow-md
                  hover:bg-[#ff8f66]
                  transition
                "
              >
                ►
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
