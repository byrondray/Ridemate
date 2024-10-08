import { checkAndStoreKindeUser } from "@/utils/checkAndStoreKindeUser";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUsers } from "@/services/users";

export default async function Home() {
  const session = getKindeServerSession();
  const user = await session?.getUser();

  if (!user) {
    return <p>User not logged in</p>;
  }

  await checkAndStoreKindeUser();
  const users = await getUsers();

  return (
    <div className="container">
      {users!.map((item) => (
        <Link key={item.id} href={`/message/${user.id}/${item.id}`}>
          <div key={item.id}>
            <h1>{item.firstName}</h1>
            <p>{item.email}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
