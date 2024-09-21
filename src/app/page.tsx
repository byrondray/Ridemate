import { checkAndStoreKindeUser } from "@/utils/checkAndStoreKindeUser";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { get } from "http";
import { getUsers } from "@/services/users";
const { getUser } = getKindeServerSession();

export default async function Home() {
  await checkAndStoreKindeUser();
  const user = await getUser();
  const users = await getUsers();
  return (
    <div className="container">
      {users!.map((item) => (
        <Link key={item.id} href={`/message/${user!.id}/${item.id}`}>
          <div key={item.id}>
            <h1>{item.firstName}</h1>
            <p>{item.email}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
