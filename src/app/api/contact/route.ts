import { supabase } from "@/app/lib/initSupabase";
import { uploadToDropbox } from "@/app/lib/uploadToDropbox";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        let { data: contact, error } = await supabase
            .from('contact')
            .select('*')

        console.log(contact);

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ contact });
    } catch (error) {
        console.log("error getting about:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    
    const formData = await req.formData()
    const pageHeading = formData.get("pageHeading") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    const image = formData.get("image") as File | null

    let imagePath;
    if (image) {
        try {
            const filename = `${Date.now()}-${image.name || "image"}`;
            const dropboxPath = `/contact/${filename}`;

            imagePath = await uploadToDropbox(image, dropboxPath);
            console.log("New image uploaded to Dropbox:", imagePath);

        } catch (error) {
            console.error("Error uploading new image to Dropbox:", error);
            return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
        }
    }

    try {

        const { data, error } = await supabase
            .from('contact')
            .update({ pageHeading, email,phone,address, image: imagePath })
            .eq('id', 1)
            .select()

        if (data) {
            return NextResponse.json({ message: "Contact updated successfully" }, { status: 200 })
        } else if (error) {
            return NextResponse.json({ error: "Updating contact failed" }, { status: 400 })
        } else {
            return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
        }

    } catch (error) {
        console.log("Updating about failed", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
    }
}