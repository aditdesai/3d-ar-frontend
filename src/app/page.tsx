import { Background } from "./components/background";
import Footer from "./components/footer";
import GallerySection from "./components/gallery-section";
import { PricingSection } from "./components/pricing-section";
import { UploadImageWidget } from "./components/upload-widget";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-white">
      <Background />

      <main className="flex-grow">
        <UploadImageWidget />
        <PricingSection />
        <GallerySection />
      </main>

      <Footer />
    </div>
  );
}
