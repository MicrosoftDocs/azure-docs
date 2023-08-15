---
title: Supported server APIs of Socket.IO
description: This article lists Socket.IO server APIs that are partially supported or unsupported by Web PubSub for Socekt.IO.
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---
# Server APIs supported by Web PubSub for Socket.IO

The Socket.IO library provides a set of [server APIs](https://socket.io/docs/v4/server-api/). The following server APIs are partially supported or unsupported by Azure Web PubSub for Socket.IO.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupported  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |

Apart from the mentioned server APIs, all other server APIs from Socket.IO are fully supported.
