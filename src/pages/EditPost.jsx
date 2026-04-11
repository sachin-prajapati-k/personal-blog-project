import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dataservice from "../appwrite/services/dataservice";
import Container from "../components/container/Container";
import PostForm from "../components/PostForm/PostForm";

export default function EditPost() {
  const [post, setPost] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (slug) {
      dataservice.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="w-full py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}
