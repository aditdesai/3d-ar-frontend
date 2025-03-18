import { Background } from "./components/background";
import Footer from "./components/footer";
import { PricingSection } from "./components/pricing-section";
import { TutorialSection } from "./components/tutorial-section";
import { UploadImageWidget } from "./components/upload-widget";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-white">
      <Background />

      <main className="flex-grow">
        <UploadImageWidget />
        <PricingSection />
        <TutorialSection />
      </main>

      <Footer />
    </div>
  );
}
