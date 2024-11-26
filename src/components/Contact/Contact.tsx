"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Label from '../Label/Label';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toast } from 'sonner';

type Inputs = {
    pageHeading: string
    email: string
    phone: string
    address: string
}

const Contact = ({ editMode }: {
    editMode?: boolean
}) => {

    const editorModule = {
        toolbar: editMode ? editMode : false
    }

    const [imageError, setImageError] = useState<null | string>(null)
    const [imageFile, setImageFile] = useState<null | File>(null)
    const [previewImage, setPreviewImage] = useState<null | string>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("pageHeading", data.pageHeading);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("address", data.address);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const url = `/api/contact`;
            const method = "POST";
            const response = await fetch(url, {
                method: method,
                body: formData,
            });
            const data = await response.json();
            console.log(data);

            if (!data.error) {
                toast.success(data.message)
                router.push('/admin/contact')
            } else {
                toast.error(data.error)
            }
            // Redirect to news list page
        } catch (error) {
            console.error("Error updating contact:", error);
            toast.error("Failed to updated contact. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`/api/contact`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.contact[0])
                    if (data.contact[0]) {
                        setValue("pageHeading", data.contact[0].pageHeading)
                        setValue("email", data.contact[0].email)
                        setValue("phone", data.contact[0].phone)
                        setValue("address", data.contact[0].address)

                        if (data.contact[0].image) {
                            setPreviewImage(data.contact[0].image as string);
                        }
                    }
                } else {
                    console.error("Failed to fetch contact data");
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
            }
        }

        fetchContactData()
    }, [])


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate the image file type
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                setImageError("Please select an image file (JPEG, PNG, or GIF)");
                return;
            }

            // Validate the image file size
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setImageError("Image file size must not exceed 10MB");
                return;
            }

            setImageFile(file);

            setImageError(null); // Reset error message if there was one

            // Generate the preview image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
            setImageFile(null);
        }
    };

    return (
        <>
            <div className='w-full justify-end flex min-h-10'>
                {!editMode && <Link href={'/admin/contact/edit-contact'} className="inline-flex items-center justify-center rounded-full bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Edit Contact Us</Link>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full h-full flex gap-x-15 mt-5'>
                <div className='w-3/4 flex flex-col gap-5'>
                    <div className='w-full flex flex-col gap-2'>
                        <Label content='Page Heading' />
                        <input type="text" {...register("pageHeading", { required: "Page heading is required" })} className={'pl-2 w-full border py-1 text-black bg-transparent'} readOnly={!editMode} />
                        {errors.pageHeading && <p className='mt-1 text-sm text-red'>{errors.pageHeading.message}</p>}
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <Label content='Email' />
                        <input type="text" {...register("email", { required: "Title is required" })} className={'pl-2 w-full border py-1 text-black bg-transparent'} readOnly={!editMode} />
                        {errors.email && <p className='mt-1 text-sm text-red'>{errors.email.message}</p>}
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <Label content='Phone' />
                        <input type="text" {...register("phone", { required: "Title is required" })} className={'pl-2 w-full border py-1 text-black bg-transparent'} readOnly={!editMode} />
                        {errors.phone && <p className='mt-1 text-sm text-red'>{errors.phone.message}</p>}
                    </div>
                    <div>
                    <div className='w-full flex flex-col gap-2'>
                        <Label content='Address' />
                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: "Content is required" }}
                            render={({ field }) => (
                                <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1" readOnly={!editMode} modules={editorModule} />
                            )}
                        />
                    </div>
                    </div>
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    <div>
                    {editMode && <button
                        type='submit'
                        className="inline-flex items-center justify-center rounded-full bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-[15%]"
                    >
                        <button type='submit' disabled={isSubmitting}>{isSubmitting ? "Saving" : "Save"}</button>
                    </button>}
                    </div>
                </div>
                <div className='h-1/2 w-1/3'>
                <div
                        className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document?.getElementById("image")?.click()}
                    >
                        {previewImage ? (
                            <div className="relative w-full h-full">
                                <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" />
                                {editMode && <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewImage(null); // Clear the preview image
                                        setImageFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>}
                            </div>
                        ) : (
                            <>
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
                            </>
                        )}
                        <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}

                </div>
            </div>
            </form>
        </>
    )
}

export default Contact