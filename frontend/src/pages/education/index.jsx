import { useQuery } from "@tanstack/react-query"

export default function Education() {
  const { data } = useQuery(['educationCourses'])

  return (
    <div>
      List courses: 
    </div>
  )
}