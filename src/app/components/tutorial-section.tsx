import { CheckCircle } from "lucide-react"

export const TutorialSection = () => {
  return (
    <section id="tutorial" className="relative z-10 py-16 mt-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Tutorial</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className='p-8 border rounded-lg shadow-lg bg-[hsl(var(--card))] card-highlight text-white transition-transform duration-300 hover:scale-105'>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3 text-lg font-bold">1</span>
                Choose your image
              </h3>
            </div>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">Once signing in and payment is complete, select an image to upload.</span>
              </li>
              <li className="flex items-start mt-2">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-purple-300 font-medium">Tips for Best Results:</span>
              </li>
              <ul className="space-y-3 pl-8 mt-1">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">Ensure the subject is clearly visible against the background</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">Choose images with the subject in focus</span>
                </li>
              </ul>
            </ul>
          </div>

          {/* Step 2 */}
          <div className='p-8 border rounded-lg shadow-lg bg-[hsl(var(--card))] card-highlight text-white transition-transform duration-300 hover:scale-105'>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3 text-lg font-bold">2</span>
                Upload and wait
              </h3>
            </div>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">Upload your image and wait till the 3D generation process is complete</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">Ideally it should take 30-40s</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className='p-8 border rounded-lg shadow-lg bg-[hsl(var(--card))] card-highlight text-white transition-transform duration-300 hover:scale-105'>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3 text-lg font-bold">3</span>
                Download or View in AR
              </h3>
            </div>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">Currently, only iOS devices are supported for AR view. A Download button will popup instead if you are not on an iOS device</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}