"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiSolidImageAdd } from 'react-icons/bi'
import Input from '../Input/Input'
import Label from '../Label/Label'
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import MetaDataSection from '../MetaData/MetaDataSection'
import { toast } from 'sonner'

type Inputs = {
  title: string
  content: string
  date: string
}


const AddNews = ({ editMode }: {
  editMode?: boolean
}) => {

  const [imageError, setImageError] = useState<null | string>(null)
  const [imageFile, setImageFile] = useState<null | File>(null)
  const [previewImage, setPreviewImage] = useState<null | string>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metaTitle,setMetaTitle] = useState("")
    const [metaDescription,setMetaDescription] = useState("")

  const router = useRouter()

  const {id} = useParams()

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
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("date",data.date)
    formData.append("metadataTitle",metaTitle);
        formData.append("metadataDesc",metaDescription);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const url = editMode ? `/api/news?id=${id}` : `/api/news`;
      const method = "POST";
      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      const data = await response.json();
      console.log(data);

      if (!data.error) {
        toast.success(data.message)
        router.push('/admin/news')
      } else {
        toast.error(data.error)
      }
      // Redirect to news list page
    } catch (error) {
      console.error("Error adding news:", error);
      alert("Failed to add news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

  useEffect(()=>{
    const fetchNewsData = async() =>{
        try {
            const response = await fetch(`/api/news?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data.news[0])
                if(data.news[0]){
                    setValue("title",data.news[0].title)
                    setValue("content",data.news[0].content)
                    setValue("date",data.news[0].date)
                    setMetaTitle(data.news[0].metadataTitle)
                        setMetaDescription(data.news[0].metadataDesc)
                    if(data.news[0].image){
                        setPreviewImage(data.news[0].image as string);
                      }
                }
            } else {
                console.error("Failed to fetch news data");
            }
        } catch (error) {
            console.error("Error fetching news data:", error);
        }
    }
    
    fetchNewsData()
},[id])

  return (
    <>
      {/* <div className='w-full justify-end flex min-h-10'>
        {!editMode && <Link href={'/admin/contact/edit-contact'} className="inline-flex items-center justify-center rounded-full bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Edit Contact Us</Link>}
    </div> */}
      <div className='w-full h-full flex flex-col mt-5'>
        <div className='w-full h-full flex gap-x-15'>
        <form className='w-3/4 flex flex-col gap-y-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full'>
            <Label content='Title' />
            <input type="text" {...register("title", { required: "Title is required" })} className={'rounded-md pl-4 w-full border-gray-300 border-[1px] py-3 text-black bg-transparent focus:outline-none'} />
            {errors.title && <p className='mt-1 text-sm text-red'>{errors.title.message}</p>}
          </div>
          <div className='w-full'>
            <Label content='Content' />
            <div>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1"/>
                )}
              />
            </div>
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>
          <div className='w-full flex gap-3'>
            <Label content='Date' />
            <input type="date" {...register("date",{required:"Date is required"})} className='bg-transparent border-[1px]'/>
            {errors.date && <p className='mt-1 text-sm text-red'>{errors.date.message}</p>}
          </div>


          {<button
            type='submit'
            className="inline-flex items-center justify-center rounded-full bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-[15%]"
          >
            <button type='submit' disabled={isSubmitting}>{isSubmitting ? "Saving" : "Save"}</button>
          </button>}
        </form>
        <div className='h-full w-1/4 flex justify-center items-center text-center'>
        <div
                        className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
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
      <MetaDataSection editMode={editMode} metaTitle={metaTitle} metaDescription={metaDescription} setMetaTitle={setMetaTitle} setMetaDescription={setMetaDescription}/>
      </div>
    </>
  )
}

export default AddNews