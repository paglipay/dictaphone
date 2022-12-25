import React, { useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const Dictaphone1 = () => {
  const [consolelog, setConsolelog] = useState("");
  const [message, setMessage] = useState("");
  // const [value, setValue] = useState("");
  const { speak, voices } = useSpeechSynthesis();
  // const wakeup_commands = [
  //   {
  //     command: "computer",
  //     callback: async () => {
  //       setMessage("I wasn't talking.");
  //       // await listenStop();
  //       const audio = new Audio("./computerbeep_50.mp3");
  //       await audio.play();
  //       // await speak({ text: "I wasn't talking." });
  //       listenContinuously();
  //     },
  //   },
  // ];

  const commands_temp = [
    {
      command: "reset",
      callback: () => resetTranscript(),
    },
    {
      command: "stop listening",
      callback: async () => {
        setMessage("I wasn't talking.");
        // await listenStop();
        const audio = new Audio("./computerbeep_50.mp3");
        await audio.play();
        await listenStop();
        // await speak({ text: "I wasn't talking." });
        // listenContinuously();
      },
    },
    {
      command: "computer",
      callback: async () => {
        setMessage("I wasn't talking.");
        // await listenStop();
        const audio = new Audio("./computerbeep_50.mp3");
        await audio.play();
        // await speak({ text: "I wasn't talking." });
        listenContinuously();
      },
    },
    {
      command: "Hello",
      callback: () => setMessage("Hi there!"),
    },
    {
      command: "Turn on",
      callback: async () => {
        setMessage("Turning on");
        // await listenStop();
        await speak({
          text: "Turning on",
        });

        const data = {
          "on_off.json": [
            {
              True: [
                {
                  open: {
                    ip: "192.168.1.59",
                  },
                },
              ],
            },
            {
              True: [
                {
                  wait: 3,
                },
                {
                  turn_on: "",
                },
              ],
            },
          ],
          "./start.json": [
            {
              import: "KasaObj",
            },
            "on_off.json",
          ],
          jobs: [
            {
              import: "Key",
            },
            {
              True: "./start.json",
            },
          ],
        };
        axios.post(`http://localhost:5000/start/kasa`, data).then((res) => {
          console.log(res);
          console.log(res.data);
          speak({
            text: "It is on",
          });
        });
      },
    },
    {
      command: "Turn off",
      callback: async () => {
        setMessage("Turning off");
        // await listenStop();
        speak({ text: "Turning off" });
        const data = {
          "on_off.json": [
            {
              True: [
                {
                  open: {
                    ip: "192.168.1.59",
                  },
                },
              ],
            },
            {
              True: [
                {
                  wait: 3,
                },
                {
                  turn_off: "",
                },
              ],
            },
          ],
          "./start.json": [
            {
              import: "KasaObj",
            },
            "on_off.json",
          ],
          jobs: [
            {
              import: "Key",
            },
            {
              True: "./start.json",
            },
          ],
        };
        axios.post(`http://localhost:5000/start/kasa`, data).then((res) => {
          console.log(res);
          console.log(res.data);
          speak({
            text: "It is off",
          });
        });
      },
    },

    {
      command: "which room",
      callback: async () => {
        setMessage("Start with the building name.");
        await listenStop();
        speak({ text: "Start with the building name." });
      },
    },
  ];

  // const myCallback = async (e) => {
  //   setMessage(`Start with the building name. ${e}`);
  //   await listenStop();
  //   speak({ text: `You said ${e}.` });
  // axios
  //   .post(`http://localhost:5000/start/${Number(e)}`, {
  //     jobs: [
  //       {
  //         import: "Key",
  //       },
  //       {
  //         True: `${Number(e) - 1}`,
  //       },
  //     ],
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     speak({
  //       text: res.data["Key"].join(" "),
  //     });
  //     // if (e < 0) {
  //     //   const new_cmds = [`${e+1}`].map((e) => {
  //     //     return createNewCommands(Number(e));
  //     //   });
  //     //   setCommands(new_cmds);
  //     // }
  //   });
  // const audio = new Audio("./computerbeep_50.mp3");
  // await audio.play();
  // await listenStop();
  // await speak({ text: "Answer is." });
  // speak({ text: `You said ${e}.` });
  // };

  // const createNewCommands = (e) => {
  //   return {
  //     command: e,
  //     callback: myCallback(e),
  //   };
  // };

  const [commands, setCommands] = useState([]);

  const start = async (e_ary) => {
    // const e = 0;
    const uuid = uuidv4();
    const new_cmds = await e_ary.map((e) => {
      return {
        command: e,
        callback: async () => {
          if (e === "computer") {
            const audio = new Audio("./computerbeep_50.mp3");
            await audio.play();
          }
          setMessage(`You said ${e}.`);
          // speak({ text: `${e}.` });
          await axios
            .post(`http://localhost:5000/start/${uuid}:${e}`, {
              jobs: [
                {
                  import: "Key",
                },
                {
                  False: `${e + 1}`,
                },
                {
                  True: [`./my_packages/VoiceCmdObj/${e}/_create_list.json`],
                },
                {
                  True: [`./my_packages/VoiceCmdObj/${e}/out.json`],
                },
                {
                  False: [`./my_packages/VoiceCmdObj/VoiceCmdObjTest.json`],
                },
              ],
            })
            .then(async (res) => {
              console.log(res);
              // console.log(res.data);
              // setMessage(res.data["VoiceCmdObj"].join("\n"));
              await listenStop();
              await speak({
                text: res.data["VoiceCmdObj"].join(".\n "),
                voice: voices[4],
              });
              // await listenContinuously();
              // if (
              //   !res.data["VoiceCmdObj"].some(
              //     (e) => e.command === "turn on Bedroom"
              //   ) || !res.data["VoiceCmdObj"].some(
              //     (e) => e.command === "turn off Bedroom"
              //   )
              // ) {
              await start(res.data["VoiceCmdObj"]);

              // }
            });
        },
      };
    });

    setCommands(new_cmds.filter((f) => f["command"] !== ""));
  };

  // console.log("cmds", cmds);
  useEffect(() => {
    // start();1
  }, []);

  useEffect(() => {
    console.log("commands", commands);
    setConsolelog(commands.map((e) => e.command).join("\n"));
  }, [commands]);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Got final result:", finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
  }
  const listenContinuously = async () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-GB",
    });
  };
  const listenStop = async () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <div>
        <span>listening: {listening ? "on" : "off"}</span>
        <div>
          <button type="button" onClick={() => start(40)}>
            Start0
          </button>
          <button
            type="button"
            onClick={() => {
              start(["computer"]);
            }}
          >
            Start1
          </button>
          <button type="button" onClick={resetTranscript}>
            Reset
          </button>
          <button type="button" onClick={listenContinuously}>
            Listen
          </button>
          <button type="button" onClick={SpeechRecognition.stopListening}>
            Stop
          </button>
        </div>
      </div>
      <div>
        <pre>{consolelog}</pre>
      </div>
      <div>{message}</div>
      <div>
        <span>{transcript}</span>
      </div>
    </div>
  );
};

export default Dictaphone1;
