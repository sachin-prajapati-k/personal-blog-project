import { Link } from "react-router-dom";
import dataService from "../appwrite/services/dataService";

export default function PostCard({ $id, featuredimage, featuredImage, title }) {
  const imageId = featuredimage ?? featuredImage;
  const imageSrc = dataService.getFilePreview(imageId);
  return (
    <>
      <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4 ">
          <div className="w-full justify-center mb-4">
            {imageSrc ? (
              <img
                key={imageId}
                src={imageSrc}
                alt={title}
                className="rounded-xl w-full object-cover aspect-video"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="rounded-xl w-full aspect-video bg-gray-200"
                aria-hidden
              />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        </div>
      </Link>
    </>
  );
}
