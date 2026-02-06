import Link from "next/link";

export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is an about page</p>
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Home
      </Link>
    </div>
  );
}
