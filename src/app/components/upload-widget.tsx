'use client';

import { Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Sample gallery items
const galleryItems = [
  { name: "Statue", image: "/character1.png", width: 512, height: 512 },
  { name: "Chair", image: "/chair1.png", width: 512, height: 512 },
  { name: "Racoon", image: "/raccoon_wizard.png", width: 512, height: 512 },
  { name: "Fox", image: "/animal_character_2.png", width: 512, height: 512 },
];

export const UploadImageWidget = () => {
    const { user } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [selectedSampleName, setSelectedSampleName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isIosDevice, setIsIosDevice] = useState(false);
    const [generationsLeft, setGenerationsLeft] = useState<number>(-1); // Using -1 instead of null
    const [isCheckingUser, setIsCheckingUser] = useState(true);

    useEffect(() => {
        // Check if device is iOS (iPhone or iPad)
        const checkIosDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };

        setIsIosDevice(checkIosDevice());
    }, []);

    useEffect(() => {
        const checkOrCreateUser = async () => {
            if (!user) return;
            
            setIsCheckingUser(true);
            
            try {
                const userEmail = user.primaryEmailAddress?.emailAddress;
                const userName = user.fullName || user.firstName || "User";
                
                if (!userEmail) {
                    console.error("User email not available");
                    return;
                }
                
                // Reference to the user document
                const userRef = doc(db, "users", userEmail);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    // User exists, get generations_left
                    const userData = userDoc.data();
                    setGenerationsLeft(userData.generations_left);
                } else {
                    // User does not exist, create new document
                    await setDoc(userRef, {
                        name: userName,
                        email: userEmail,
                        generations_left: 1
                    });
                    setGenerationsLeft(1);
                }
            } catch (error) {
                console.error("Error checking/creating user:", error);
            } finally {
                setIsCheckingUser(false);
            }
        };
        
        checkOrCreateUser();
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setSelectedSampleName(null); // Clear sample selection when user uploads their own
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure generationsLeft is greater than 0 (not checking for -1 as it's the loading state)
        if (!file || !user || generationsLeft <= 0) return;

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
                
                // Decrement generations_left
                const userEmail = user.primaryEmailAddress?.emailAddress;
                if (userEmail) {
                    const userRef = doc(db, "users", userEmail);
                    const newGenerationsLeft = generationsLeft - 1;
                    await updateDoc(userRef, {
                        generations_left: newGenerationsLeft
                    });
                    setGenerationsLeft(newGenerationsLeft);
                }
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

    // Function to handle sample image selection from the gallery
    const handleSelectSampleImage = async (imageName: string, imagePath: string) => {
        try {
            // Fetch the sample image from the public directory
            const response = await fetch(imagePath);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch sample image: ${imagePath}`);
            }
            
            const blob = await response.blob();
            // Create a file from the blob
            const imageFile = new File([blob], `${imageName.toLowerCase()}.png`, { type: blob.type || 'image/png' });
            
            setFile(imageFile);
            setSelectedSampleName(imageName);
            setModelUrl(null); // Reset any previous model
            
        } catch (error) {
            console.error("Error selecting sample image:", error);
        }
    };

    // Helper function to handle the disabled state of the upload button
    const isUploadButtonDisabled = () => {
        return !file || isLoading || !!modelUrl || generationsLeft <= 0;
    };

    // Helper function to get the button text
    const getButtonText = () => {
        if (isLoading) return "Creating 3D Model...";
        if (generationsLeft <= 0) return "No Generations Left";
        return "Create 3D Model";
    };

    return (
        <div className="relative z-10 flex flex-col items-center justify-center mt-10 px-4 md:px-6">
            <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mt-8 md:mt-12 gradient-text leading-normal text-center">
                Create 3D Models for AR from Images
            </h1>
            <p className="text-base sm:text-lg md:text-xl m-1 text-gray-400 text-center max-w-2xl">
                Upload an image and we&apos;ll turn it into a 3D model that can be viewed in AR!
            </p>

            <SignedIn>
                {isCheckingUser ? (
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">Loading user data...</p>
                    </div>
                ) : (
                    <>
                        {generationsLeft >= 0 && (
                            <div className="mt-4 mb-6 text-center">
                                <p className="text-lg font-medium">
                                    You have <span className="text-[hsl(var(--primary))] font-bold">{generationsLeft}</span> generation{generationsLeft !== 1 ? 's' : ''} left
                                </p>
                            </div>
                        )}
                        
                        <div className="rounded-lg w-full max-w-md sm:max-w-lg space-y-2 mx-auto md:mt-4 p-4 md:p-6 bg-[hsl(var(--card))] card-highlight">
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
                                                    <span className="text-sm sm:text-base truncate max-w-xs">
                                                        {selectedSampleName ? `Sample: ${selectedSampleName}` : file.name}
                                                    </span>
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
                                        ${isUploadButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:bg-[hsl(var(--primary))]/80 hover:shadow-lg hover:cursor-pointer"}`}
                                    disabled={isUploadButtonDisabled()}
                                >
                                    {getButtonText()}
                                </button>
                            </form>

                            {modelUrl && (
                                <div className="mt-4 text-center">
                                    <a
                                        href={modelUrl}
                                        rel="ar"
                                        className="inline-block bg-[hsl(var(--accent))]/10 text-white/70 px-4 py-3 rounded-lg hover:bg-[hsl(var(--accent))]/20 transition-colors font-semibold text-sm sm:text-base"
                                    >
                                        {isIosDevice ? "View in AR" : "Download"}
                                    </a>
                                </div>
                            )}
                        </div>
                    </>
                )}
                
                {/* Integrated Gallery Section */}
                <section className="relative z-10 py-6 text-center w-full" id='gallery'>
                    <p className="text-base sm:text-lg mt-10 mb-8 text-gray-400 text-center max-w-2xl mx-auto">
                        Or select one of our sample images to try it out
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center place-items-center mx-4 md:mx-20">
                        {galleryItems.map((item, index) => (
                            <div 
                                key={index} 
                                className="relative group w-full h-80 overflow-hidden rounded-lg card-highlight cursor-pointer transform transition-transform hover:scale-105"
                                onClick={() => handleSelectSampleImage(item.name, item.image)}
                            >
                                <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    width={item.width} 
                                    height={item.height} 
                                    className="w-full h-full object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-lg font-medium">{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </SignedIn>

            <SignedOut>
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold mt-8">You must be signed in to use this feature.</p>
                </div>
            </SignedOut>
        </div>
    );
};