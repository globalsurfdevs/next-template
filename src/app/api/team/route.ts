import { supabase } from "@/app/lib/initSupabase"
import { uploadToDropbox } from "@/app/lib/uploadToDropbox"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            let { data: team, error } = await supabase
                .from('team')
                .select('*')

            console.log(team);

            if (!team) {
                return NextResponse.json({ error: "Team members not found" }, { status: 404 });
            }

            return NextResponse.json({ team });
        } else {

            let { data: team, error } = await supabase
                .from('team')
                .select("*")
                .eq('id', id)

            if (!team) {
                return NextResponse.json({ error: "Team member not found" }, { status: 404 });
            }

            return NextResponse.json({ team });
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
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const email = formData.get("email") as string
    const description = formData.get("description") as string

    const image = formData.get("image") as File | null
    let imagePath;
    if (image) {
        try {
            const filename = `${Date.now()}-${image.name || "image"}`;
            const dropboxPath = `/team-member/${filename}`;

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
                .from('team')
                .insert([
                    { name, position, email, description, image: imagePath },
                ])
                .select()


            if (data) {
                return NextResponse.json({ message: "Team member added successfully" }, { status: 200 })
            } else if (error) {
                return NextResponse.json({ error: "Adding team member failed" }, { status: 400 })
            } else {
                return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
            }
        } else {

            const { data, error } = await supabase
                .from('team')
                .update({ name, position, email, description, image: imagePath })
                .eq('id', id)
                .select()

            if (data) {
                return NextResponse.json({ message: "Team member updated successfully" }, { status: 200 })
            } else if (error) {
                return NextResponse.json({ error: "Updating team member failed" }, { status: 400 })
            } else {
                return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
            }
        }


    } catch (error) {
        console.log("Adding/Updating team member failed", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
    }
}


export async function DELETE(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Member not found" }, { status: 400 })
        }


        const { error } = await supabase
            .from('team')
            .delete()
            .eq('id', id)

            if(error){
                return NextResponse.json({error:"Deleting member failed"},{status:400})
            }

            return NextResponse.json({message:"Member deleted successfully"},{status:200})

    } catch (error) {
        console.log("error getting team members:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}