import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router";

import { getCourse } from "../../api/education";

export default function EducationCourse() {
  const { id } = useParams();
  const { data, isInitialLoading } = useQuery(['educationCourseDetail'], () => getCourse(id));

  if(isInitialLoading) return <>Loading...</>;

  return (
    <div>
      <h1>{data.data.attributes.Title}</h1>
      <p dangerouslySetInnerHTML={{ __html: data.data.attributes.Content}} />
    </div>
  )
}