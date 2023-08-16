---
title: Support for server APIs in Azure Web PubSub for Socket.IO
description: This article lists Socket.IO server APIs that are partially supported or unsupported in Azure Web PubSub for Socket.IO.
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---
# Support for server APIs in Azure Web PubSub for Socket.IO

The Socket.IO library provides a set of [server APIs](https://socket.io/docs/v4/server-api/). Azure Web PubSub for Socket.IO fully supports them, with the following exceptions.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupported  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |
