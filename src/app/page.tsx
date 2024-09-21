import { checkAndStoreKindeUser } from "@/utils/checkAndStoreKindeUser";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const { getUser } = getKindeServerSession();

export default async function Home() {
  await checkAndStoreKindeUser();
  const user = await getUser();
  return (
    <div className="container">
      <Link href={`/message/${user!.id}/kp_b20575f122824fe5b0099f12948a4912`}>
        <h1>Hello World</h1>
      </Link>
    </div>
  );
}
