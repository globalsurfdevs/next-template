"use client"
import React, { useState } from 'react'

const Input = ({
    type = "text",
    className,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
      <input
        type={type}
        {...props} // Spread all props passed from react-hook-form, such as value, onChange, ref, etc.
        className={className ? className : 'w-full border py-1 text-black bg-transparent'}
      />
    );
  };
  
  export default Input;