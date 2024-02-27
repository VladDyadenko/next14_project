import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const initialValues = {
    emailAddress: "",
    username: "",
    firstName: "",
    lastName: "",
  };
  return <SignUp initialValues={initialValues} />;
}
