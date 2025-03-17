"use client"

import Image from "next/image";
import { useInView } from "react-intersection-observer";

const galleryItems = [
  { name: "Chair", image: "/placeholder.svg", width: 200, height: 200 },
  { name: "Table", image: "/placeholder.svg", width: 200, height: 200 },
  { name: "Lamp", image: "/placeholder.svg", width: 200, height: 200 },
  { name: "Vase", image: "/placeholder.svg", width: 200, height: 200 },
];

export default function GallerySection() {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative z-10 py-12 text-center" id='gallery'>
      <h2 className="gradient-text text-4xl font-bold mb-12">Example Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center place-items-center mx-20">
        {galleryItems.map((item, index) => (
          <div key={index} className="relative group w-full h-48 overflow-hidden rounded-lg card-highlight">
            <Image 
              src={item.image} 
              alt={item.name} 
              width={item.width} 
              height={item.height} 
              className="w-full h-full object-cover"
              priority // Loads images faster
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-lg font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
