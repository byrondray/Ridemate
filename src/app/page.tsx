import { getDB } from "@/database/client";
import { users } from "@/database/schema/users";
import Link from "next/link";

let db = getDB();

export default async function Home() {
  const allUsers = await db.select().from(users);
  console.log(allUsers);
  return (
    <div className="container">
      <Link href="/dashboard">
        <h1>Hello World</h1>
      </Link>
    </div>
  );
}
