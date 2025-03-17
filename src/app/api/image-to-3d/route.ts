import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
        }

        const DEVICE_TYPE = "ios";
        const API_URL = process.env.API_URL!;
        const API_KEY = process.env.API_KEY!;

        const apiResponse = await fetch(`${API_URL}?device_type=${DEVICE_TYPE}`, {
            method: "POST",
            headers: {
                "X-API-Key": API_KEY,
            },
            body: formData,
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            return NextResponse.json({ error: errorData }, { status: apiResponse.status });
        }

        const blob = await apiResponse.blob();
        return new Response(blob, {
            headers: { "Content-Type": blob.type },
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
