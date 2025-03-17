'use client';

import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const UploadImageWidget = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`/api/image-to-3d`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const fileExtension = "glb";
                const modelFile = new File([blob], `output.${fileExtension}`, { type: blob.type });
                const url = URL.createObjectURL(modelFile);
                setModelUrl(url);
            } else {
                const errorResponse = await response.json();
                throw new Error(`Failed to process image: ${errorResponse.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 flex flex-col items-center justify-center mt-20 px-4 md:px-6">
            <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mt-8 md:mt-12 gradient-text leading-normal text-center">
                Create AR Models from Images
            </h1>
            <p className="text-base sm:text-lg md:text-xl m-1 text-gray-400 text-center max-w-2xl">
                Upload an image and we&apos;ll turn it into a 3D AR model instantly!
            </p>

            <SignedIn>
                <div className="rounded-lg w-full max-w-md sm:max-w-lg space-y-2 mx-auto md:mt-12 p-4 md:p-6 bg-[hsl(var(--card))] card-highlight">
                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                id="fileUpload"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="flex items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-[hsl(var(--primary))]/30 rounded-lg cursor-pointer hover:border-[hsl(var(--primary))]/60 transition-colors"
                            >
                                <div className="text-center">
                                    {file ? (
                                        <>
                                            <Upload className="mx-auto mb-2 text-[hsl(var(--primary))]" size={24} />
                                            <span className="text-sm sm:text-base truncate max-w-xs">{file.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto mb-2 text-[hsl(var(--primary))]/70" size={24} />
                                            <span className="text-sm sm:text-base">Click to upload an image</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg shadow-md transition-all duration-300 
                                ${!file || isLoading || !!modelUrl ? "opacity-50 cursor-not-allowed" : "hover:bg-[hsl(var(--primary))]/80 hover:shadow-lg hover:cursor-pointer"}`}
                            disabled={!file || isLoading || !!modelUrl}
                        >
                            {isLoading ? "Creating 3D Model..." : "Create 3D Model"}
                        </button>
                    </form>

                    {modelUrl && (
                        <div className="mt-4 text-center">
                            <a
                                href={modelUrl}
                                rel="ar"
                                className="inline-block bg-[hsl(var(--accent))]/10 text-white/70 px-4 py-3 rounded-lg hover:bg-[hsl(var(--accent))]/20 transition-colors font-semibold text-sm sm:text-base"
                            >
                                View in AR
                            </a>
                        </div>
                    )}
                </div>
            </SignedIn>

            <SignedOut>
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold mt-8">You must be signed in to use this feature.</p>
                </div>
            </SignedOut>
        </div>
    );
};
