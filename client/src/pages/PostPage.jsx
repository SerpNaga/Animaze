import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ruEnds } from "../../../api/utils/text";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarPosts, setSimilarPosts] = useState(null);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState(null);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleLike = async (postId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const res = await fetch(`/api/post/likePost/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setPost({
          ...post,
          likes: data.likes,
          numberOfLikes: data.likes.length,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchSimilarPosts = async (post) => {
      setSimilarLoading(true);
      const res = await fetch(
        `/api/post/getposts?sort=desc-likes&category=${post.category}&limit=3`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setSimilarLoading(false);
      }
      if (res.ok) {
        setSimilarPosts(data.posts.filter((el) => el._id != post._id));
        setSimilarLoading(false);
      }
    };
    const fetchRecentPosts = async (post) => {
      setRecentLoading(true);
      const res = await fetch(
        `/api/post/getposts?limit=3`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setRecentLoading(false);
      }
      if (res.ok) {
        setRecentPosts(data.posts.filter((el) => el._id != post._id));
        setRecentLoading(false);
      }
    };
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
          fetchSimilarPosts(data.posts[0]);
          fetchRecentPosts(data.posts[0]);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          займет {post && (post.content.length / 1000).toFixed(0)}{" "}
          {(post.content.length / 1000).toFixed(0) == 1
            ? "минуту"
            : (post.content.length / 1000).toFixed(0) <= 4 &&
              (post.content.length / 1000).toFixed(0) != 0
            ? "минуты"
            : "минут"}
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      {/* <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div> */}
      <div className="flex flex-row justify-end gap-2 max-w-2xl mx-auto w-full">
        <button
          type="button"
          onClick={() => handleLike(post._id)}
          className={`text-gray-400 hover:text-blue-500 ${
            currentUser &&
            post.likes.includes(currentUser._id) &&
            "!text-blue-500"
          }`}
        >
          <FaThumbsUp className="text-sm" />
        </button>
        <p className="text-gray-400">
          {post.numberOfLikes > 0 &&
            post.numberOfLikes + " " + ruEnds(post.numberOfLikes)}
        </p>
      </div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        {!similarLoading && similarPosts.length > 0 && (
          <>
            <h1 className="text-xl mt-5">Похожие статьи</h1>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
              {similarPosts.map((post) => (
                <PostCard key={post._id} post={post} />
                ))}
            </div>
          </>
        )}
        {similarLoading || recentLoading && (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="lg" />
          </div>
        )}
        {!recentLoading && recentPosts.length > 0 && (
          <>
            <h1 className="text-xl mt-5">Похожие статьи</h1>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
