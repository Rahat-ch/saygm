import { useState, useEffect } from "react";

export default function GmForm({ address, gmContract }) {
  const [answer, setAnswer] = useState("");
  const [prompt, setPrompt] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [answerList, setAnswerList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("answering");
      const answerTrx = await gmContract.answer(answer);
      console.log("waiting for transaction");
      await answerTrx.wait();
      console.log("transaction complete");
      console.log(answerTrx);
      console.log("answered");
      setAnswer("");
    } catch (error) {
        console.log(error)
    }
  };

  const handleUpdatePrompt = async (e) => {
    e.preventDefault();
    try {
      const updateTrx = await gmContract.setPrompt(newPrompt);
      console.log("updating");
      await updateTrx.wait();
      console.log("updated");
      setPrompt("");
      setAnswerList([])
      const getPrompt = await gmContract.getPrompt();
      setPrompt(getPrompt);
    } catch (error) {
      console.log(error);
    }
  };

  const listener = (from, answer) => {
    console.log("new action emited");
    setAnswerList([...answerList, { from, answer }]);
  };

  useEffect(() => {
    const getPromptandAnswers = async () => {
      const getPrompt = await gmContract.getPrompt();
      setPrompt(getPrompt);
      const getAnswers = await gmContract.getAnswers();
      setAnswerList(getAnswers);
    };
    getPromptandAnswers();
    gmContract.on("NewAnswer", listener);
    return () => {
      gmContract.off("NewAnswer", listener);
    };
  }, [gmContract]);
  return (
    <div>
      <h1>hello {address}</h1>
      <h2>{prompt}</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Answer</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          type="text"
          name="answer"
          required
        />
        <button type="submit">Say GM</button>
      </form>
      {answerList.length > 0 &&
        answerList.map((a) => (
          <>
            <p>Message: {a.answer}</p>
            <p>From: {a.from}</p>
          </>
        ))}
      <form onSubmit={(e) => handleUpdatePrompt(e)}>
        <label>New Prompt</label>
        <input
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          type="text"
          name="prompt"
          required
        />
        <button type="submit">Update prompt</button>
      </form>
    </div>
  );
}
