import { useEffect, useState } from "react";
import { useNavigate, useParams,  } from "react-router-dom";
import { dataService } from "../appwrite/services/dataService";
import Container from "../components/container/Container";
import PostForm from "../components/PostForm/PostForm";

export default function EditPost() {
  const [post, setPost] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (slug) {
      dataService.getPost(slug).then((post) => {
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
