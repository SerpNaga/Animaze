import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Button, Spinner } from "flowbite-react";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState({});
  const [popularPosts, setPopularPosts] = useState({});
  const [recentLoading, setRecentLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchRecentPosts = async () => {
    setRecentLoading(true);
    const res = await fetch(`/api/post/getPosts?limit=9`);
    const data = await res.json();
    if (!res.ok) {
      setRecentLoading(false);
      return;
    }
    if (res.ok) {
      setRecentPosts(data.posts);
      setRecentLoading(false);
    }
  };
  const fetchPopularPosts = async () => {
    setPopularLoading(true);
    const res = await fetch("/api/post/getPosts?sort=desc-likes&limit=9");
    const data = await res.json();
    if (!res.ok) {
      setPopularLoading(false);
      return;
    }
    if (res.ok) {
      setPopularPosts(data.posts);
      setPopularLoading(false);
    }
  };
  const fetchCategories = async () => {
    setCategoryLoading(true);
    const res = await fetch("/api/category/getCategories");
    const data = await res.json();
    if (!res.ok) {
      setCategoryLoading(false);
      return;
    }
    if (res.ok) {
      setCategories(data.categories);
      setCategoryLoading(false);
      // console.log(data.categories)
    }
  };
  useEffect(() => {
    try {
      fetchPopularPosts();
      fetchRecentPosts();
      fetchCategories();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 pt-24 pb-12 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Добро пожаловать!</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          У нас ты найдёшь всё о японском языке и Японии ʕ●ᴥ●ʔノ
        </p>
      </div>
      {/* <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div> */}
      <div className="max-w-6xl mx-auto p-3 pb-6 flex flex-wrap gap-4">
        {categoryLoading && (
          <p className="text-xl text-gray-500">Загрузка...</p>
        )}
        {!categoryLoading &&
          categories &&
          categories.map((category) => ( 
            <Link
              to={`/search?category=${category.name}`}
              className="self-center mt-5"
            >
              <Button color="gray" pill size="xs">
                {category.name}
              </Button>
            </Link>
          ))}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold text-center">Новые статьи</h2>
          {recentLoading && (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          )}
          {!recentLoading && (
            <>
              <div className="flex flex-wrap gap-4 sm:w-[360px] md:w-[736px] xl:w-[1112px]">
                {!recentLoading && recentPosts.length === 0 && (
                  <p className="text-xl text-gray-500">Ничего не найдено.</p>
                )}
                {!recentLoading &&
                  recentPosts &&
                  recentPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
              </div>
              <Link
                to={"/search"}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                Читать еще
              </Link>
            </>
          )}
          <h2 className="text-2xl font-semibold text-center">
            Популярные статьи
          </h2>
          {popularLoading && (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          )}
          {!popularLoading && (
            <>
              <div className="flex flex-wrap gap-4 sm:w-[360px] md:w-[736px] xl:w-[1112px]">
                {!popularLoading && popularPosts.length === 0 && (
                  <p className="text-xl text-gray-500">Ничего не найдено.</p>
                )}
                {!popularLoading &&
                  popularPosts &&
                  popularPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
              </div>
              <Link
                to={"/search?sort=desc-likes"}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                Читать еще
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
