import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { useState, useEffect } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MTgzOSwiZXhwIjoxOTU4ODU3ODM5fQ.9-osDgPWEW4KDpBDM-FrO-lVm30Vi8eeGX6zv3yheI8";
const SUPABASE_URL = "https://glibahffxrnjwnvehuzb.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log(data);
        setMessageList(data);
      });
  }, []);
  //Usuário
  /**
   * Usuário digita no campo textarea
   * Aperta enter para enviar
   * Tem que adicionar o texto na listagem
   */

  //Dev
  /**
   * [X] Campo criado
   * [X] Vamos usar o onChange usa o useState (ter if para verificar caso seja um enter para limpar a variavel)
   * [] Lista de mensagens
   */

  function handleNewMessage(newMessage) {
    const message = {
      //id: messageList.length + 1,
      from: "vanessa",
      body: newMessage,
    };

    supabaseClient
      .from("messages")
      .insert([
        //Deve ser um objeto com os mesmos campos utilizados no supabase
        message,
      ])
      .then(({ data }) => {
        console.log("Criando a mensagem: ", data);
        setMessageList([data[0], ...messageList]);
      });
    setMessage("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[200],
        backgroundImage: `url(https://images3.alphacoders.com/251/251305.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList messages={messageList} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "80%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              type="submit"
              label="Enviar"
              onClick={(event) => {
                event.preventDefault();
                handleNewMessage(message);
              }}
              styleSheet={{
                width: "20%",
                height: "80%",
                marginRight: "12px",
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text tag="strong">{message.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {message.body}
          </Text>
        );
      })}
    </Box>
  );
}

export default ChatPage;
