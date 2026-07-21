---
title: Azure Web PubSub chat SDKs and REST API
titleSuffix: Azure Web PubSub
description: The two ways to build with Azure Web PubSub chat - the client SDK and the data-plane REST API.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 06/30/2026
---

# Chat SDKs and REST API

Chat gives you two ways to build, depending on where your code runs:

- **Client SDK** runs in your client app. Clients use it to connect, join rooms, send and read
  messages, and listen for events.
- **REST API** runs on your server. Use it for server-side and administrative tasks, such as managing
  rooms, members, users, and roles.

## Client SDK

The JavaScript client SDK is published as the `@azure/web-pubsub-chat-client` npm package. It exposes
a `ChatClient` that connects with a client access URL, then creates rooms, sends and reads messages,
and raises events. For a walkthrough, see [Get started with Azure Web PubSub chat](chat-quickstart.md).

For the full API, source, and samples, [see the SDK repo on GitHub](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-chat-client).

## REST API

Azure Web PubSub chat data-plane REST API manages chat resources from your server: rooms, members, messages, users,
and roles. There's no dedicated Chat REST client yet, so you call these endpoints with any HTTP client.

The chat REST API lives on the same resource endpoint and hub route as the Web PubSub data-plane REST
API (`{endpoint}/api/hubs/{hub}/chat/...`), and it authenticates the same way as that API: with an
access key or a Microsoft Entra ID token. For how to get the token and sign each request, see
[Using the REST API](reference-rest-api-data-plane.md#using-rest-api).

> [!NOTE]
> For the detailed REST API specification, see the [Web PubSub chat rest api definition](/rest/api/webpubsub/dataplane/webpubsubchat/web-pub-sub-chat-service).

With a bearer token from either method, you call a chat endpoint with any HTTP client. For example:

```javascript
const endpoint = process.env.WebPubSubEndpoint; // https://contoso.webpubsub.azure.com
const hub = "chat";
const token = "<bearer token>"; // from Microsoft Entra ID or an access key, as described above

async function chatRequest(method, path, body) {
  const res = await fetch(`${endpoint}/api/hubs/${hub}/chat/${path}?api-version=2026-02-01-preview`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Chat API ${method} ${path} failed: ${res.status}`);
  }
  return res.status === 204 ? undefined : res.json();
}

// Example: create a room, then add a member
await chatRequest("PUT", "rooms/falcon", { title: "Project Falcon" });
await chatRequest("PUT", "rooms/falcon/members/bob", { roleName: "room.member" });
```

## Next steps

> [!div class="nextstepaction"]
> [Chat error codes](chat-reference-errors.md)
