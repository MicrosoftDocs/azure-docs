---
title: limitation...()
description: 
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Different between self-hosted Socket.IO app and fully managed


## Server APIs supported by Web PubSub for Socket.IO

Socket.IO library provides a set of [server API](https://socket.io/docs/v4/server-api/). 
Please note the following server APIs that are partially supported or unsupported by Web PubSub for Socket.IO.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupported  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |

Apart from the mentioned server APIs, all other server APIs from Socket.IO are fully supported.