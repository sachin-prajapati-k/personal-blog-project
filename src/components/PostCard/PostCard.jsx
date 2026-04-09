import { useCallback } from "react"
import RTE from "../RTE"
import Button from "../Button"
import Input from "../Input"
import Select from "../Select"
import dataService from "../../appwrite/services/dataService"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
export default function PostCard({post}){
const navigate=useNavigate();
const userData=useSelector(state=>state.auth.userData);


const {register,handleSubmit,watch,setValue,control,getValue}=useForm({
    defaultValues:{
        title:post?.title || "",
        slug:post?.slug || "",
        content:post?.content || "",
        status:post?.status || 'active'

    }
});

    return(

    )
}