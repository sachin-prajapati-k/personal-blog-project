import { Link } from "react-router-dom";
import dataService from "../appwrite/services/dataService";

export default function PostCard({ $id, featuredimage, featuredImage, title }) {
  const imageId = featuredimage ?? featuredImage;
  return (
    <>
      <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4 ">
          <div className="w-full justify-center mb-4">
            <img
              key={imageId}
              src={dataService.getFilePreview(imageId)}
              alt={title}
              className="rounded-xl "
            />
          </div>
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        </div>
      </Link>
    </>
  );
}
