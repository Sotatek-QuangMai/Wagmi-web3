import { useWriteContract } from "wagmi";
import { contractConfig } from "../../config";
import { type SetStateAction, useState } from "react";

export function WriteContract() {
  const { data, isPending, writeContract } = useWriteContract();
  const [inputValue, setInputValue] = useState("");

  const updateContract = () => {
    try {
      writeContract({
        ...contractConfig,
        functionName: "setGreeting",
        args: [inputValue],
      });
    } catch (e) {
      console.error("Error writing contract:", e);
    }
  };

  const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <h2>Write Contract</h2>
      {!isPending ? (
        <>
          <label htmlFor="greetingInput">Enter new greeting:</label>
          <input id="greetingInput" type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={updateContract} type="button">
            Connect
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
      <div>Contract message: {data}</div>
    </div>
  );
}
