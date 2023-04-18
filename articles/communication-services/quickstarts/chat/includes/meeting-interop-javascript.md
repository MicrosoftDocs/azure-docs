---
title: Quickstart - Join a Teams meeting
author: askaur
ms.author: askaur
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to chat in a Teams meeting using the Azure Communication Services Chat SDK for JavaScript.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites 

* A [Teams deployment](/deployoffice/teams-install). 
* A working [chat app](../get-started.md). 

## Joining the meeting chat 

A Communication Services user can join a Teams meeting as an anonymous user using the Calling SDK. Joining the meeting adds them as a participant to the meeting chat as well, where they can send and receive messages with other users in the meeting. The user won't have access to chat messages that were sent before they joined the meeting and they won't be able to send or receive messages after the meeting ends. To join the meeting and start chatting, you can follow the next steps.

## Create a new Node.js application

Open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir chat-interop-quickstart && cd chat-interop-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

## Install the chat packages

Use the `npm install` command to install the necessary Communication Services SDKs for JavaScript.

```console
npm install @azure/communication-common --save

npm install @azure/communication-identity --save

npm install @azure/communication-signaling --save

npm install @azure/communication-chat --save

npm install @azure/communication-calling --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Set up the app framework

This quickstart uses Webpack to bundle the application assets. Run the following command to install the Webpack, webpack-cli and webpack-dev-server npm packages and list them as development dependencies in your **package.json**:

```console
npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev
```

Create an **index.html** file in the root directory of your project. We use this file to configure a basic layout that will allow the user to join a meeting and start chatting.

## Add the Teams UI controls

Replace the code in index.html with the following snippet.
The text boxes at the top of the page will be used to enter the Teams meeting context and meeting thread ID. The 'Join Teams Meeting' button is used to join the specified meeting.
A chat pop-up appears at the bottom of the page. It can be used to send messages on the meeting thread, and it displays in real time any messages sent on the thread while the Communication Services user is a member.

```html
<!DOCTYPE html>
<html>
   <head>
      <title>Communication Client - Calling and Chat Sample</title>
      <style>
         body {box-sizing: border-box;}
         /* The popup chat - hidden by default */
         .chat-popup {
         display: none;
         position: fixed;
         bottom: 0;
         left: 15px;
         border: 3px solid #f1f1f1;
         z-index: 9;
         }
         .message-box {
         display: none;
         position: fixed;
         bottom: 0;
         left: 15px;
         border: 3px solid #FFFACD;
         z-index: 9;
         }
         .form-container {
         max-width: 300px;
         padding: 10px;
         background-color: white;
         }
         .form-container textarea {
         width: 90%;
         padding: 15px;
         margin: 5px 0 22px 0;
         border: none;
         background: #e1e1e1;
         resize: none;
         min-height: 50px;
         }
         .form-container .btn {
         background-color: #4CAF40;
         color: white;
         padding: 14px 18px;
         margin-bottom:10px;
         opacity: 0.6;
         border: none;
         cursor: pointer;
         width: 100%;
         }
         .container {
         border: 1px solid #dedede;
         background-color: #F1F1F1;
         border-radius: 3px;
         padding: 8px;
         margin: 8px 0;
         }
         .darker {
         border-color: #ccc;
         background-color: #ffdab9;
         margin-left: 25px;
         margin-right: 3px;
         }
         .lighter {
         margin-right: 20px;
         margin-left: 3px;
         }
         .container::after {
         content: "";
         clear: both;
         display: table;
         }
      </style>
   </head>
   <body>
      <h4>Azure Communication Services</h4>
      <h1>Calling and Chat Quickstart</h1>
          <input id="teams-link-input" type="text" placeholder="Teams meeting link"
        style="margin-bottom:1em; width: 300px;" />
          <input id="thread-id-input" type="text" placeholder="Chat thread id"
        style="margin-bottom:1em; width: 300px;" />
        <p>Call state <span style="font-weight: bold" id="call-state">-</span></p>
      <div>
        <button id="join-meeting-button" type="button">
            Join Teams Meeting
        </button>
        <button id="hang-up-button" type="button" disabled="true">
            Hang Up
        </button>
      </div>
      <div class="chat-popup" id="chat-box">
         <div id="messages-container"></div>
         <form class="form-container">
            <textarea placeholder="Type message.." name="msg" id="message-box" required></textarea>
            <button type="button" class="btn" id="send-message">Send</button>
         </form>
      </div>
      <script src="./bundle.js"></script>
   </body>
</html>
```

## Enable the Teams UI controls

Replace the content of the client.js file with the following snippet.

Within the snippet, replace 
- `SECRET_CONNECTION_STRING` with your Communication Service's connection string 
- `ENDPOINT_URL` with your Communication Service's endpoint url

```javascript
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient } from "@azure/communication-chat";

let call;
let callAgent;
let chatClient;
let chatThreadClient;

const meetingLinkInput = document.getElementById('teams-link-input');
const threadIdInput = document.getElementById('thread-id-input');
const callButton = document.getElementById("join-meeting-button");
const hangUpButton = document.getElementById("hang-up-button");
const callStateElement = document.getElementById('call-state');

const messagesContainer = document.getElementById("messages-container");
const chatBox = document.getElementById("chat-box");
const sendMessageButton = document.getElementById("send-message");
const messagebox = document.getElementById("message-box");

var userId = '';
var lastMessage = '';
var previousMessage = '';

async function init() {
  const connectionString = "<SECRET_CONNECTION_STRING>";
  const endpointUrl = "<ENDPOINT_URL>";

  const identityClient = new CommunicationIdentityClient(connectionString);

  let identityResponse = await identityClient.createUser();
  userId = identityResponse.communicationUserId;
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

  let tokenResponse = await identityClient.getToken(identityResponse, [
    "voip",
    "chat",
  ]);

  const { token, expiresOn } = tokenResponse;
  console.log(`\nIssued an access token that expires at: ${expiresOn}`);
  console.log(token);

  const callClient = new CallClient();
  const tokenCredential = new AzureCommunicationTokenCredential(token);
  callAgent = await callClient.createCallAgent(tokenCredential);
  callButton.disabled = false;

  chatClient = new ChatClient(
    endpointUrl,
    new AzureCommunicationTokenCredential(token)
  );

  console.log('Azure Communication Chat client created!');
}

init();

callButton.addEventListener("click", async () => {
  // join with meeting link
  call = callAgent.join({meetingLink: meetingLinkInput.value}, {});

  call.on('stateChanged', () => {
      callStateElement.innerText = call.state;
  })
  // toggle button and chat box states
  chatBox.style.display = "block";
  hangUpButton.disabled = false;
  callButton.disabled = true;

  messagesContainer.innerHTML = "";

  console.log(call);

  // open notifications channel
  await chatClient.startRealtimeNotifications();

  // subscribe to new message notifications
  chatClient.on("chatMessageReceived", (e) => {
    console.log("Notification chatMessageReceived!");

      // check whether the notification is intended for the current thread
    if (threadIdInput.value != e.threadId) {
      return;
    }

    if (e.sender.communicationUserId != userId) {
       renderReceivedMessage(e.message);
    }
    else {
       renderSentMessage(e.message);
    }
  });

  chatThreadClient = await chatClient.getChatThreadClient(threadIdInput.value);
});

async function renderReceivedMessage(message) {
  previousMessage = lastMessage;
  lastMessage = '<div class="container lighter">' + message + '</div>';
  messagesContainer.innerHTML = previousMessage + lastMessage;
}

async function renderSentMessage(message) {
  previousMessage = lastMessage;
  lastMessage = '<div class="container darker">' + message + '</div>';
  messagesContainer.innerHTML = previousMessage + lastMessage;
}

hangUpButton.addEventListener("click", async () => 
  {
    // end the current call
    await call.hangUp();

    // toggle button states
    hangUpButton.disabled = true;
    callButton.disabled = false;
    callStateElement.innerText = '-';

    // toggle chat states
    chatBox.style.display = "none";
    messages = "";
  });

sendMessageButton.addEventListener("click", async () =>
  {
    let message = messagebox.value;

    let sendMessageRequest = { content: message };
    let sendMessageOptions = { senderDisplayName : 'Jack' };
    let sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    let messageId = sendChatMessageResult.id;

    messagebox.value = '';
    console.log(`Message sent!, message id:${messageId}`);
  });
```

Display names of the chat thread participants aren't set by the Teams client. The names are returned as null in the API for listing participants, in the `participantsAdded` event and in the `participantsRemoved` event. The display names of the chat participants can be retrieved from the `remoteParticipants` field of the `call` object. On receiving a notification about a roster change, you can use this code to retrieve the name of the user that was added or removed:

```
var displayName = call.remoteParticipants.find(p => p.identifier.communicationUserId == '<REMOTE_USER_ID>').displayName;
```

## Get a Teams meeting chat thread for a Communication Services user

The Teams meeting details can be retrieved using Graph APIs, detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true). The Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They're returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)

With the [Graph APIs](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true), you can also obtain the `threadID`. The response contains a `chatInfo` object with the `threadID`. 

You can also get the required meeting information and thread ID from the **Join Meeting** URL in the Teams meeting invite itself.
A Teams meeting link looks like this: `https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here`. The `threadId` is where `meeting_chat_thread_id` is in the link. Ensure that the `meeting_chat_thread_id` is unescaped before use. It should be in the following format: `19:meeting_ZWRhZDY4ZGUtYmRlNS00OWZaLTlkZTgtZWRiYjIxOWI2NTQ4@thread.v2`


## Run the code

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to `http://localhost:8080/`. You should see app launched as shown in the following screenshot:

:::image type="content" source="../join-teams-meeting-chat-quickstart.png" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams meeting link and thread ID into the text boxes. Press *Join Teams Meeting* to join the Teams meeting. After the Communication Services user has been admitted into the meeting, you can chat from within your Communication Services application. Navigate to the box at the bottom of the page to start chatting. For simplicity, the application only shows the last two messages in the chat.

> [!NOTE] 
> Certain features are currently not supported for interoperability scenarios with Teams. Learn more about the supported features, please see [Teams meeting capabilities for Teams external users](../../../concepts/interop/guest/capabilities.md)
