import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFetchBlogsQuery } from "../../../redux/feature/blogs/blogsApi";
import { useGetUserQuery } from "../../../redux/feature/auth/authApi";
import { useGetCommentsQuery } from "../../../redux/feature/comments/commentApi";
import BlogsChart from "./BlogsChart";

function Dashboard() {
    const [query, setQuery] = useState({ search: '', category: '' });
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);
  const { data: users = [] } = useGetUserQuery();
  const { data: comments = [] } = useGetCommentsQuery();
//   console.log(comments.totalComments)
  const { user } = useSelector((state) => state.auth);
  // Calculate the number of "admin" role
  const adminCount = users.users?.filter(user => user.role === "admin").length;

  return (
    // {isLoading && (<div> Loading...</div> )}
    <div className="space-y-6">
    <div className="bg-bgPrimary p-5">
      <h1>Hi, {user.username}!</h1>
      <p>Welcome to the admin dashboard</p>
      <p>
        Here you can manage your hotel's posts, manage rooms, and other
        administrative tasks.
      </p>
    </div>
     {/* cards grid */}
     <div className="flex flex-col md:flex-row justify-between gap-8 pt-8">
          {/* certain grid to calculate total blogs, users */}
          <div className="bg-indigo-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <i class="fa-solid fa-users"></i>
          <p>{users.length} 2 Users</p>
          </div>
          <div className="bg-red-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <i class="fa-solid fa-blog"></i>
           <p>{blogs.length} Blogs</p>
          </div>
          <div className="bg-lime-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <i class="fa-solid fa-user-tie"></i>
          <p>{adminCount} Admin {adminCount!== 1?'s':''}</p>
          </div>
          <div className="bg-orange-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <i class="fa-solid fa-comment"></i>
          <p>{comments.totalComments} 3 Comments</p>
          </div>
        </div>
 {/* graph charts */}
 <div className="pt-5 pb-5">
          <BlogsChart blogs={blogs}/>
        </div>
      </div>
  )
}

export default Dashboard
