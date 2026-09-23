---
title: Tutorial - Run a chat app with Azure Web PubSub Chat
description: Run and explore a browser chat sample built with Azure Web PubSub Chat and the JavaScript Chat client SDK.
author: xingsy97
ms.author: siyuanxing
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 08/10/2026
---

# Tutorial: Run a chat app with Azure Web PubSub Chat

In this tutorial, you run a browser chat application that uses Azure Web PubSub Chat. Chat provides rooms, membership, real-time messages, and persistent message history. The application doesn't implement Web PubSub event handlers or message fan-out.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure persistent storage and a Chat hub
> - Issue client access URLs from a trusted application server
> - Connect with the JavaScript Chat client SDK
> - Create a room, invite another user, and exchange messages
> - Load persistent message history

## Prerequisites

- An Azure subscription
- [Azure CLI](/cli/azure/install-azure-cli) version 2.22.0 or later
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) version 20 or later

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Create and configure Azure Web PubSub

Create a resource group, a Web PubSub resource, and a storage account. Replace the placeholders with your own values. The storage account name must be globally unique.

```azurecli
az login
az extension add --upgrade --name webpubsub
az group create --name <resource-group> --location <location>
az webpubsub create --name <web-pubsub-name> --resource-group <resource-group> --location <location> --sku Free_F1
az storage account create --name <storage-account-name> --resource-group <resource-group> --location <location> --sku Standard_LRS
```

Chat stores rooms, members, and messages in your Azure Storage account. To configure persistent storage and add a Chat hub named `chat`, see [Configure storage and enable Chat](chat-howto-enable-chat.md).

> [!IMPORTANT]
> A regular Web PubSub hub without Chat enabled doesn't support the Chat client SDK. The application hub name must exactly match the Chat-enabled hub name.

Get the connection string used by the application server.

[!INCLUDE [Connection string security](includes/web-pubsub-connection-string-security.md)]

```azurecli
az webpubsub key show --name <web-pubsub-name> --resource-group <resource-group> --query primaryConnectionString --output tsv
```

## Get the sample

Clone the Azure Web PubSub repository and go to the Chat client example.

```bash
git clone https://github.com/Azure/azure-webpubsub.git
cd azure-webpubsub/sdk/webpubsub-chat-client/examples/chatapp
npm install
```

The project contains the complete responsive web interface and its styling. The following sections focus on the code that integrates the application with Web PubSub Chat.

## Issue a client access URL

The Express server in `server.js` keeps the Web PubSub connection string out of the browser. Its `/negotiate` endpoint maps an application user to a Chat user ID and returns a short-lived client access URL.

```javascript
const serviceClient = new WebPubSubServiceClient(connectionString, hubName);

app.get("/negotiate", async (request, response) => {
  const userId = request.query.userId;
  if (typeof userId !== "string" || !userId.trim()) {
    return response.status(400).json({ error: "userId is required" });
  }

  const token = await serviceClient.getClientAccessToken({
    userId: userId.trim(),
  });
  return response.json({ url: token.url });
});
```

> [!IMPORTANT]
> The sample accepts a user ID from the browser so you can test multiple users locally. A production application must authenticate the request and derive the user ID from a trusted server-side identity. For more information, see [Authenticate and connect clients](chat-howto-authenticate.md).

No Web PubSub event handler is required. After negotiation, the browser communicates with the Chat hub for room and message operations.

## Use the Chat client SDK

The browser code in `src/client.js` imports the Chat client through its npm package and supplies a callback that requests a new client access URL when needed.

```javascript
import { ChatClient } from "@azure/web-pubsub-chat-client";

client = await ChatClient.start({
  getClientAccessUrl: async () => {
    const response = await fetch(
      `/negotiate?userId=${encodeURIComponent(userId)}`,
    );
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()).url;
  },
});
```

Rooms are private and there isn't an API to browse or join arbitrary rooms. The room creator therefore supplies the second user's ID when creating the room. The invited client receives a `room-joined` event.

```javascript
client.on("room-joined", ({ room }) => {
  addRoom(room);
  selectRoom(room.roomId);
});

const room = await client.createRoom(title, [inviteeUserId]);
await client.sendToRoom(room.roomId, "Hello!");
```

Use `listRoomMessages` to read messages persisted in the storage configured for the Chat hub.

```javascript
for await (const message of client.listRoomMessages(roomId)) {
  addLine(`${message.createdBy}: ${message.content.text}`);
}
```

## Run and test the application

Set the connection string in the terminal where you run the application. The sample uses the `chat` hub by default.

# [Bash](#tab/bash)

```bash
export WebPubSubConnectionString="<connection-string>"
npm start
```

# [PowerShell](#tab/powershell)

```powershell
$env:WebPubSubConnectionString = "<connection-string>"
npm start
```

---

Open `http://localhost:3000` in two different browsers or two independent browser profiles.

1. Connect as two different users.
1. In the second window, select **Copy user ID**.
1. In the first window, paste the copied ID into **Invite user**, and create a room.
1. Exchange messages in the room.
1. Select **Load history** to read the persisted messages.

The `room-joined` event makes the invitation appear in the second user's room list. The `message` event updates both browsers without an application WebSocket server or Web PubSub event handler.

## What you built

You ran a complete browser chat application in which:

- The Express server keeps the service connection string private and issues short-lived client access URLs.
- The browser communicates directly with Azure Web PubSub Chat after negotiation.
- Azure Web PubSub Chat manages private rooms, invitations, real-time messages, and persistent history.
- The application doesn't host a WebSocket server or process each chat message.

## Clean up resources

If you don't plan to continue using the resources, delete the resource group.

```azurecli
az group delete --name <resource-group> --yes --no-wait
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy a serverless chat app with Azure Functions](tutorial-serverless-chat.md)

> [!div class="nextstepaction"]
> [Manage Chat rooms](chat-howto-manage-rooms.md)
