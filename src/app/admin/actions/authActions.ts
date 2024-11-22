"use server"

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";


type SignInType = {
    username:string,
    password:string
}

export const signInWithCredentials = async({username,password}:SignInType) =>{
    console.log("Here")
    try {
        const user = await signIn("credentials",{username,password,redirect:false})
        
        if(user.error){
            return {success:false,message:user.error}
        }

        return {success:true,message:"Successfully signed in"}

    } catch (err) {
        console.log("Error in sign action:",err)
        return {success:false,message:"Invalid Credentials"}
    }
}

export const signOutAdmin = async() =>{
    let redirectPath;
    try {
       await signOut({redirectTo:'/admin/auth/signin'})
       redirectPath = '/admin/auth/signin'
       return {success:true,message:"Successfully signed off"}
       
    } catch (err) {
        redirectPath = '/'
        console.log("Error in signout action:",err)
    }finally{
        if(redirectPath){
            redirect(redirectPath)
        }
    }
}