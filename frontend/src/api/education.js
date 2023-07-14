import { getUserToken } from "../helpers/auth";

export const getCourses = async () => {
  const courses = await fetch(`${import.meta.env.VITE_API_URL}/api/courses?fields[0]=title`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`
    }
  }).then((res) => res.json());

  return courses;
}

export const getCourse = async (id) => {
  const courses = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`
    }
  }).then((res) => res.json());

  return courses;
}