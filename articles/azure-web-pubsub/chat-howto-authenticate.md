---
title: Authenticate and connect clients
titleSuffix: Azure Web PubSub
description: Issue client access tokens for Chat in Azure Web PubSub from the portal or from your own server.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/26/2026
---

# Authenticate and connect clients

A client connects to Chat with a **client access URL** that carries its user identity. Whoever issues the token decides the user ID, so the token is where you tie a chat user to a real
identity in your app.

This article shows two ways to get a token: a quick one from the **Azure portal** for experimenting,
and **server-issued** tokens for production.

## Option 1: Get a token from the portal (quick try)

For quick tests, generate a client access URL in the portal. It needs no code, but the URL is static
and expires, so use it only for experimenting. For the step-by-step portal instructions, see
[Get a client access token from the portal](chat-quickstart.md#get-a-client-access-token-from-the-portal).

## Option 2: Issue a token from your server (production)

In production, your own server issues tokens. This keeps your Web PubSub keys on the server and lets
you set each client's user ID from the signed-in user instead of from client input.

### Add a negotiate endpoint

The server exposes an endpoint that returns a client access URL. This example uses Node.js with
Express and the [Web PubSub server SDK](https://www.npmjs.com/package/@azure/web-pubsub).

Choose how the server authenticates to Web PubSub:

# [Connection string](#tab/connection-string)

```bash
npm install express @azure/web-pubsub
```

```javascript
import express from "express";
import { WebPubSubServiceClient } from "@azure/web-pubsub";

// Keep your connection string safe.
const connectionString = process.env.WebPubSubConnectionString;
const hubName = "chat"; // the hub where you enabled Chat

const app = express();
const serviceClient = new WebPubSubServiceClient(connectionString, hubName);

app.get("/negotiate", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const token = await serviceClient.getClientAccessToken({ userId });
  res.json({ url: token.url });
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

# [Managed identity](#tab/managed-identity)

A managed identity lets your server authenticate through Microsoft Entra ID, so there's no access key
or connection string to store or rotate. Before you run this:

1. Enable a managed identity on the Azure host that runs your server, such as App Service, Azure
   Functions, or a virtual machine. For local development, `DefaultAzureCredential` falls back to
   your Azure CLI sign-in (`az login`).
1. Assign the **Web PubSub Service Owner** role to that identity on your Web PubSub resource. This
   role grants the auth API that issues client access tokens. See
   [Authorize from a managed identity](howto-authorize-from-managed-identity.md).

```bash
npm install express @azure/web-pubsub @azure/identity
```

```javascript
import express from "express";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { DefaultAzureCredential } from "@azure/identity";

// Your resource endpoint, for example https://contoso.webpubsub.azure.com
const endpoint = process.env.WebPubSubEndpoint;
const hubName = "chat"; // the hub where you enabled Chat

const app = express();
const serviceClient = new WebPubSubServiceClient(endpoint, new DefaultAzureCredential(), hubName);

app.get("/negotiate", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const token = await serviceClient.getClientAccessToken({ userId });
  res.json({ url: token.url });
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

---

> [!IMPORTANT]
> This example reads the user ID from the query string to keep it short. In production, set the user
> ID from the authenticated user (for example, from their session), never from client input.
> Otherwise a caller could request a token for any user ID.

### Connect the client

Give the client SDK a callback that fetches a URL from your endpoint. The SDK calls it again whenever
it needs a fresh token, such as after a reconnect.

```javascript
const client = await ChatClient.start({
  getClientAccessUrl: async () => {
    const res = await fetch("/negotiate?userId=alice");
    const data = await res.json();
    return data.url;
  },
});
```

## Token lifetime and refresh

Client access tokens expire. A portal URL and a URL from `getClientAccessToken` both last 60 minutes
by default.

- With a **static URL** (Option 1), the client can't reconnect after the token expires. That's fine
  for quick tests.
- With a **callback** (Option 2), the SDK requests a new URL from your server whenever it reconnects,
  so long-lived clients keep working without you tracking expiry.

To change the lifetime, set `expirationTimeInMinutes` when you call `getClientAccessToken`.

## Next steps

> [!div class="nextstepaction"]
> [Create and manage rooms](chat-howto-manage-rooms.md)
