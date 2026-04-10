import PostForm from "../components/PostForm/PostForm";
import Container from "../components/container/Container";
export default function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}
