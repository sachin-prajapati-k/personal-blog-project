import { useCallback, useEffect } from "react";
import RTE from "../RTE";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import dataservice from "../../appwrite/services/dataService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
    if (post) {
      if (!userData?.$id) {
        alert("You must be logged in to edit a post.");
        return;
      }
      const file = data.image[0]
        ? await dataservice.uploadFile(data.image[0], userData.$id)
        : null;

      if (file) {
        dataservice.deleteFile(post.featuredimage ?? post.featuredImage);
      }

      const dbPost = await dataservice.updatePost(post.$id, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        userId: userData.$id,
        featuredImage: file ? file.$id : post.featuredimage ?? post.featuredImage,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      if (!userData?.$id) {
        alert("You must be logged in to create a post.");
        return;
      }
      const file = await dataservice.uploadFile(
        data.image?.[0],
        userData.$id,
      );
      const dbPost = await dataservice.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: file.$id,
        userId: userData.$id,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    }
    } catch (err) {
      alert(err?.message || "Something went wrong while saving the post.");
    }
  };

  const onInvalid = (formErrors) => {
    const first = Object.values(formErrors)[0];
    const msg = first?.message || first?.type || "Please fill in all required fields.";
    alert(typeof msg === "string" ? msg : "Please fill in all required fields.");
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit, onInvalid)}
      className="flex flex-wrap"
    >
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={dataservice.getFilePreview(post.featuredimage ?? post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        {Object.keys(errors).length > 0 && (
          <p className="text-red-600 text-sm mb-2" role="alert">
            {errors.title && "Title is required. "}
            {errors.slug && "Slug is required. "}
            {errors.content && "Content is required. "}
            {errors.image && "Featured image is required. "}
            {errors.status && "Status is required."}
          </p>
        )}
        <Button
          type="submit"
          bgcolor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
