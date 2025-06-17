import { type BaseError, useReadContract } from "wagmi";
import { contractConfig } from "../../config";

export function ReadContract() {
  const { data, error, isPending } = useReadContract({
    ...contractConfig,
    functionName: "greet",
    args: [],
    query: {
      enabled: true,
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {(error as unknown as BaseError).shortMessage || error.message}</div>;

  return (
    <div>
      <h2>Read Contract</h2>
      <div>Contract message: {data}</div>
    </div>
  );
}
