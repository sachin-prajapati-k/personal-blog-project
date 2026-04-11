import PostCard from "../components/PostCard";
import Container from "../components/container/Container";
import { dataService } from "../appwrite/services/dataService";
import { useState, useEffect } from "react";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {}, []);
  dataService.getPosts().then((posts) => setPosts(posts.documents));
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flew-wrap">
          {posts.map((post) => (
            <div key={post.$id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
