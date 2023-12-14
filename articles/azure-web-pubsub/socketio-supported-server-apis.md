---
title: Supported server APIs of Socket.IO
description: This article lists Socket.IO server APIs that are partially supported or unsupported in Web PubSub for Socket.IO.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, Socket.IO APIs, socketio, azure socketio
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---
# Supported server APIs of Socket.IO

The Socket.IO library provides a set of [server APIs](https://socket.io/docs/v4/server-api/). The following server APIs are partially supported or unsupported by Web PubSub for Socket.IO.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupported  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |
