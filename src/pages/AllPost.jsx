import PostCard from "../components/PostCard";
import Container from "../components/container/Container";
import dataservice from "../appwrite/services/dataService";
import { useState, useEffect } from "react";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    dataservice.getPosts().then((res) => {
      setPosts(Array.isArray(res?.documents) ? res.documents : []);
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {(posts ?? []).map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
