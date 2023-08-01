---
title: How to troubleshoot Socket.IO common issues
description: Learn how to troubleshooting Socket.IO common issues
author: xingsy97
ms.author: xingsy97
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# Troubleshooting guide for common issues

## Preparation for troubleshooting
As a Socket.IO application with Azure Web PubSub, its issues have two sources: the Socket.IO application itself and Azure Web PubSub Service.

The first step to troubleshoot is to identify whether the issus come from Socket.IO application itself. The simplest way is to make your Socket.IO application fully self-hosted and exclude Azure Web PubSub in your architecture, which is the reversion of [How to migrate self-hosted Socket.IO application](./socketio-migrate-from-self-hosted.md). If the application works well after the reversion, the root cause is related with Azure Web PubSub with high possibility.

## Server side: `useAzureSocketIO is not a function`

### Possible error
- `TypeError: (intermediate value).useAzureSocketIO is not a function`

### Root cause
Using Azure Socket.IO server SDK in typescript incorrectly will lead to this error.
Bad sample:
```typescript
import * as wpsExt from "@azure/web-pubsub-socket.io"
import { Server } from "socket.io";
const io = await (new Server(3000) as any).useAzureSocketIO(wpsOptions);
```

Typescipt compiler has an default feature to ignore importing package which is not used explicitly. In the complied `.js` file, there will be no `require` for SDK package.

### Solution
Use `import "@azure/web-pubsub-socket.io"` to [force load](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit) the SDK package. Example:
```typescript
import "@azure/web-pubsub-socket.io"
import { Server } from "socket.io";
const io = await (new Server(3000) as any).useAzureSocketIO(wpsOptions);
```

## Client side: 404 Not Found in client side with AWPS endpoint
### Possible Error
 `GET <web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

### Root cause
Client is created without a correct `path` option.
```javascript
var socket = io(endpoint)
```

### Solution 
Add the correct `path` option with value `/clients/socketio/hubs/eio_hub`
```javascript
var socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

## Client side: 404 Not Found in client side with non-AWPS endpoint
### Possible Error
 `GET <non-web-pubsub-endpoint>/socket.io/?EIO=4&transport=polling&t=OcmE4Ni` 404 Not Found

### Root cause
Client is created without correct Azure Web PubSub Service endpoint. For example, it's created with the original Socket.IO server endpoint:

```javascript
const endpoint = "socketio-server.com";
var socket = io(endpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

### Solution
Let client use the Azure Web PubSub endpoint as its endpoint:

```javascript
const webPubSubEndpoint = "<web-pubsub-endpoint>";
var socket = io(webPubSubEndpoint, {
    path: "/clients/socketio/hubs/eio_hub",
});
```

## See also
- [How to troubleshoot Azure Web PubSub common issues](./howto-troubleshoot-common-issues.md)
- [Troubleshooting Socket.IO connection issues](https://socket.io/docs/v4/troubleshooting-connection-issues/)