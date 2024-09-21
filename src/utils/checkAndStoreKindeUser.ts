import { createUser, getUserById } from "@/services/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getUser } = getKindeServerSession();

export const checkAndStoreKindeUser = async () => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("No user found in Kinde session.");
    }

    let storedUser = await getUserById(user.id);

    if (!storedUser) {
      await createUser({
        id: user.id,
        firstName: user.given_name || "",
        lastName: user.family_name || null,
        email: user.email || "",
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error checking or storing Kinde user:", error);
  }
};
