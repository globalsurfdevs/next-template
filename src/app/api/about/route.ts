import { supabase } from "@/app/lib/initSupabase";
import { uploadToDropbox } from "@/app/lib/uploadToDropbox";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {


    try {

        let { data: about, error } = await supabase
            .from('about')
            .select('*')


        console.log(about);

        if (!about) {
            return NextResponse.json({ error: "About not found" }, { status: 404 });
        }

        return NextResponse.json({ about });
    } catch (error) {
        console.log("error getting about:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const metadataTitle = formData.get("metadataTitle") as string
    const metadataDesc = formData.get("metadataDesc") as string

    const image = formData.get("image") as File | null
    let imagePath;
    if (image) {
        try {
            const filename = `${Date.now()}-${image.name || "image"}`;
            const dropboxPath = `/about/${filename}`;

            imagePath = await uploadToDropbox(image, dropboxPath);
            console.log("New image uploaded to Dropbox:", imagePath);

        } catch (error) {
            console.error("Error uploading new image to Dropbox:", error);
            return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
        }
    }

    try {

        const { data, error } = await supabase
            .from('about')
            .update({ title, description, image: imagePath,metadataTitle,metadataDesc })
            .eq('id', 1)
            .select()

        if (data) {
            return NextResponse.json({ message: "About updated successfully" }, { status: 200 })
        } else if (error) {
            return NextResponse.json({ error: "Updating about failed" }, { status: 400 })
        } else {
            return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
        }

    } catch (error) {
        console.log("Updating about failed", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
    }
}