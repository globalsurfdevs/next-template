"use client"

import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Link from 'next/link';
import Swal from 'sweetalert2'

import { toast } from 'sonner';

type TeamMember = {
  name:string;
  id:number;
  image:string;
}

export default function MediaCard({data,setRefetch}:{
  data:TeamMember
  setRefetch:React.Dispatch<React.SetStateAction<boolean>>
}) {

  const handleDeleteMember = async(id:number)=>{
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#000000",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
          const response = await fetch(`/api/team?id=${id}`,{
            method:"DELETE"
          })
    
          if(response.ok){
            toast.success("Successfully deleted member")
            setRefetch((prev)=>!prev)
          }
          else{
            toast.error("Failed")
          }
        }
      });
      

    } catch (error) {
      console.log("Error deleting member",error)
    }
  }

  return (
    <div className='border rounded-xl'>
      <CardMedia className='rounded-t-xl'
        sx={{ height: 230 }}
        image={data.image}
        title="green iguana"
      />
      <div className='flex justify-between max-h-10'>
      <CardContent className='flex justify-center w-full items-center'>
        <div className='text-md'>
          {data.name}
        </div>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
      </CardContent>
      <div className='flex justify-around w-1/2 text-white'>
      <Link href={`/admin/team/edit-member/${data.id}`} className='bg-black w-1/2 flex justify-center items-center'>
        <div>
        <FaRegEdit className='text-2xl'/>
        </div>
        </Link>
        <div className='bg-red w-1/2 flex justify-center items-center rounded-br-xl cursor-pointer' onClick={()=>handleDeleteMember(data.id)}>
        <MdDelete className='text-2xl'/>
        </div>
      </div>
      </div>
      
      
    </div>
  );
}