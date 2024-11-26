import { supabase } from "@/app/lib/initSupabase";
import { uploadToDropbox } from "@/app/lib/uploadToDropbox";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {

            let { data: news, error } = await supabase
                .from('news')
                .select('*')


            console.log(news);

            if (!news) {
                return NextResponse.json({ error: "News not found" }, { status: 404 });
            }

            return NextResponse.json({ news });
        } else {

            let { data: news, error } = await supabase
                .from('news')
                .select("*")
                .eq('id', id)

            if (!news) {
                return NextResponse.json({ error: "News not found" }, { status: 404 });
            }

            return NextResponse.json({ news });
        }

    } catch (error) {
        console.log("error getting team members:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    const formData = await req.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const date = formData.get("date") as string

    const image = formData.get("image") as File | null
    let imagePath;
    if (image) {
        try {
            const filename = `${Date.now()}-${image.name || "image"}`;
            const dropboxPath = `/news/${filename}`;

            imagePath = await uploadToDropbox(image, dropboxPath);
            console.log("New image uploaded to Dropbox:", imagePath);

        } catch (error) {
            console.error("Error uploading new image to Dropbox:", error);
            return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
        }
    }

    try {

        if (!id) {
            const { data, error } = await supabase
                .from('news')
                .insert([
                    { title, content, date:new Date(date), image: imagePath },
                ])
                .select()


            if (data) {
                return NextResponse.json({ message: "News added successfully" }, { status: 200 })
            } else if (error) {
                return NextResponse.json({ error: "Adding news failed" }, { status: 400 })
            } else {
                return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
            }
        } else {

            const { data, error } = await supabase
                .from('news')
                .update({ title, content, date:new Date(date), image: imagePath })
                .eq('id', id)
                .select()

            if (data) {
                return NextResponse.json({ message: "News updated successfully" }, { status: 200 })
            } else if (error) {
                return NextResponse.json({ error: "Updating news failed" }, { status: 400 })
            } else {
                return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
            }
        }


    } catch (error) {
        console.log("Adding/Updating news failed", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "News not found" }, { status: 400 })
        }


        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id)

            if(error){
                return NextResponse.json({error:"Deleting news failed"},{status:400})
            }

            return NextResponse.json({message:"news deleted successfully"},{status:200})

    } catch (error) {
        console.log("error getting news:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}