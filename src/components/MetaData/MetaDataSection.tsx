import React, { Dispatch, SetStateAction } from 'react'
import Label from '../Label/Label'
import { UseFormRegister } from 'react-hook-form'



const MetaDataSection = ({editMode,metaTitle,metaDescription,setMetaTitle,setMetaDescription}:{
    editMode?:boolean;
    metaTitle:string;
    metaDescription:string;
    setMetaTitle:Dispatch<SetStateAction<string>>
    setMetaDescription:Dispatch<SetStateAction<string>>
}) => {
  return (
    <div className='mt-6 flex flex-col gap-4'>
                    <div className='font-extrabold text-xl'>
                        Seo Section
                    </div>
                    <hr></hr>
                    <div className='w-full flex flex-col gap-2'>
                            <Label content='MetaData:Title' />
                            <input type="text" value={metaTitle} onChange={(e)=>setMetaTitle(e.target.value)} className={'rounded-md pl-4 w-full border-gray-300 border-[1px] py-3 text-black bg-transparent focus:outline-none'} readOnly={!editMode}/>
                            
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <Label content='MetaData:Description' />
                            <input type="text" value={metaDescription} onChange={(e)=>setMetaDescription(e.target.value)} className={'rounded-md pl-4 w-full border-gray-300 border-[1px] py-3 text-black bg-transparent focus:outline-none'} readOnly={!editMode}/>   
                        </div>
            </div>
  )
}

export default MetaDataSection