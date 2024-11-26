"use client"

import React, { useEffect, useState } from 'react'
import NewsCard from '../NewsCard/NewsCard'
import Link from 'next/link'

const News = () => {

  const [news,setNews] = useState([])
    const [refetch,setRefetch] = useState(false)

    useEffect(()=>{
        const fetchNewsData = async() =>{
            try {
                const response = await fetch(`/api/news`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.news)
                    if(data.news){
                        setNews(data.news)
                    }
                } else {
                    console.error("Failed to fetch news data");
                }
            } catch (error) {
                console.error("Error fetching news data:", error);
            }
        }
        
        fetchNewsData()
    },[refetch])

  return (
    <>
    <div className='flex justify-end mb-6'>
                <Link href={'/admin/news/add-news'} className="inline-flex items-center justify-center rounded-full bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Add News</Link>
            </div>
    <div className='flex w-full justify-center'>

    
    <div className='grid lg:grid-cols-4 gap-5 md:grid-cols-2'>
        {news && news.map((item,index)=>(
            <NewsCard key={index} data={item} setRefetch={setRefetch}/>
        ))}
    </div>
    </div>
    </>
  )
}

export default News