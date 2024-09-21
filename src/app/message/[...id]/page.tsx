import Chat from "./websocket";

export default function CombinedChat({
  params,
}: {
  params: { id: [string, string] };
}) {
  const [userId, recipientId] = params.id; // Destructure the array to extract userId and recipientId

  return (
    <div>
      <Chat userId={userId} recipientId={recipientId} />
    </div>
  );
}
