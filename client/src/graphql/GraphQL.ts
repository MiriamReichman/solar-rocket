import { object } from "yup";

const fetchGraphQL = async (text: String, variables: any) => {
  const response : Response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: text,
      variables }),
   
  });

  if(response.ok)
    return await response.json();

  throw(await response.json());
};
const fetchGraphQLCreateMission = async (text: String) => {
  const response : Response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Mutation: text,
      
    }),
  });

  if(response.ok)
    return await response.json();

  throw(await response.json());
};



export default fetchGraphQL;
