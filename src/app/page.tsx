import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Link href="/dashboard">
        <h1>Hello World</h1>
      </Link>
    </div>
  );
}
