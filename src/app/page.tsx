import Link from "next/link";

export default async function Home() {
  return (
    <div className="container">
      <Link href={`/users`}>Find Users</Link>
    </div>
  );
}
