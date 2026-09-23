---
title: Azure Web PubSub chat SDKs and REST API
titleSuffix: Azure Web PubSub
description: Choose among the client SDK, service SDKs, and data-plane REST API for Azure Web PubSub Chat.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 09/16/2026
---

# Chat SDKs and REST API

Azure Web PubSub Chat provides three development surfaces. Choose one based on where your code runs and the operations it performs.

| Surface | Runs in | Use it to |
| --- | --- | --- |
| Client SDK | Client applications | Connect over WebSockets, create rooms, manage room members, exchange messages, read history, and handle real-time events. |
| Service SDK | Server applications | Manage roles, users, rooms, members, conversations, and persisted messages, and generate client access URLs. |
| REST API | Server applications | Perform the same administrative operations directly over HTTP. |

## Client SDK

The JavaScript client SDK is published as the [`@azure/web-pubsub-chat-client`](https://www.npmjs.com/package/@azure/web-pubsub-chat-client) npm package. It exposes a `ChatClient` that connects with a client access URL, creates rooms, sends and reads messages, and raises real-time events.

For a walkthrough, see [Get started with Azure Web PubSub Chat](chat-quickstart.md). For the full API, source, and samples, see the [Chat client SDK source repository](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-chat-client).

> [!NOTE]
> The client package `@azure/web-pubsub-chat-client` is different from the server-side JavaScript service package `@azure/web-pubsub-chat`.

## Service SDKs

Chat service SDKs wrap the data-plane REST API in language-specific clients. They run in a trusted server environment and can authenticate with a connection string, an access key, or Microsoft Entra ID.

> [!IMPORTANT]
> Azure Web PubSub Chat and the available Chat service SDKs are in preview. Beta SDK APIs can change before general availability.

| Language | Package | Status | Reference |
| --- | --- | --- | --- |
| Java | [`com.azure:azure-messaging-webpubsub-chat`](https://central.sonatype.com/artifact/com.azure/azure-messaging-webpubsub-chat) | Preview | [Chat service SDK for Java](chat-reference-service-sdk-java.md) |
| JavaScript | [`@azure/web-pubsub-chat`](https://www.npmjs.com/package/@azure/web-pubsub-chat) | Preview | [Chat service SDK for JavaScript](chat-reference-service-sdk-javascript.md) |
| .NET | To be announced | **In progress** | Not available |
| Python | To be announced | **In progress** | Not available |

The standard Web PubSub service SDKs don't expose Chat-specific resources. Use a Chat service SDK or the Chat REST API when you work with roles, users, rooms, members, conversations, or persisted messages.

## REST API

The Azure Web PubSub Chat data-plane REST API manages Chat resources from your server. Use it directly when a Chat service SDK isn't available for your language.

The Chat REST API uses the same resource endpoint and hub route as the Web PubSub data-plane REST API (`{endpoint}/api/hubs/{hub}/chat/...`). Authenticate with an access key or a Microsoft Entra ID token. For information about getting a token and signing each request, see [Using the REST API](reference-rest-api-data-plane.md#using-rest-api).

> [!NOTE]
> For the detailed REST API specification, see the [Web PubSub Chat REST API reference](/rest/api/webpubsub/dataplane/webpubsubchat/web-pub-sub-chat-service).

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
