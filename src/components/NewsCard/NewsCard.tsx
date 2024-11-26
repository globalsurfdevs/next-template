import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Link from 'next/link';
import Swal from 'sweetalert2'
import { toast } from 'sonner';

type News = {
  title:string;
  content:string;
  id:number;
  image:string;
}

export default function NewsCard({data,setRefetch}:{
  data:News
  setRefetch:React.Dispatch<React.SetStateAction<boolean>>
}) {

  const handleDeleteNews = async(id:number)=>{
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
          const response = await fetch(`/api/news?id=${id}`,{
            method:"DELETE"
          })
    
          if(response.ok){
            toast.success("Successfully deleted news")
            setRefetch((prev)=>!prev)
          }
          else{
            toast.error("Failed")
          }
        }
      });
      

    } catch (error) {
      console.log("Error deleting news",error)
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={data.image}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <div className='text-white flex w-full'>
        <div className='w-full flex text-2xl'>
          <div className='bg-black w-1/2 items-center flex justify-center'>
            <Link href={`/admin/news/edit-news/${data.id}`}><FaRegEdit/></Link>
          </div>
          <div className='bg-red w-1/2 items-center flex justify-center'>
            <MdDelete className='text-2xl' onClick={()=>handleDeleteNews(data.id)}/>
          </div>
          </div>
      </div>
    </Card>
  );
}
