import React from 'react'

const Label = ({content,className}:{
    content:string;
    className?:string;
}) => {
  return (
    <label htmlFor="" className={className ? className : 'font-bold'}>{content}</label>
  )
}

export default Label