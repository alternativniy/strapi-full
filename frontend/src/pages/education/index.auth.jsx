import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getCourses } from "../../api/education"

export default function Education() {
  const { data, isInitialLoading } = useQuery(['educationCourses'], getCourses)

  return (
    <div>
      {isInitialLoading &&
        <>Loading...</>
      }
      {!isInitialLoading &&
        <ul>
          List courses:
          {data?.data?.map((course) =>
            <li key={`EducationCourseLink_${course.id}`}>
              <Link to={`/education/${course.id}`} >
                {course.attributes.Title}
              </Link>
            </li>
          )}
        </ul>
      }
    </div>
  )
}