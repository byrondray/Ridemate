import { getDB } from "@/database/client";
import { users } from "@/database/schema/users";
import { checkAndStoreKindeUser } from "@/utils/checkAndStoreKindeUser";
import Link from "next/link";

let db = getDB();

export default async function Home() {
  await checkAndStoreKindeUser();
  return (
    <div className="container">
      <Link href="/dashboard">
        <h1>Hello World</h1>
      </Link>
    </div>
  );
}
