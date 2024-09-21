import { createUser, getUserById } from "@/services/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getUser } = getKindeServerSession();

export const checkAndStoreKindeUser = async () => {
  const user = await getUser();

  let storedUser;

  if (user) {
    storedUser = await getUserById(user.id);
  }

  if (!storedUser && user) {
    await createUser({
      id: user.id,
      firstName: user.given_name || "",
      lastName: user.family_name || null,
      email: user.email || "",
      createdAt: new Date().toISOString(),
    });
  }
};
