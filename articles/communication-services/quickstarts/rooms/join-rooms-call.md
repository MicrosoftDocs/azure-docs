---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 01/26/2022
ms.topic: include
ms.custom: include file
ms.author: radubulboaca
---

## Join a room call

To join a room call, set up your web application using the [Add voice calling to your client app](../../voice-video-calling/getting-started-with-calling.md) guide. Once you have an initialized and authenticated `callAgent`, you may specify a context object with the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the context instance.

```js

const context = { roomId: '<RoomId>' }

const call = callAgent.join(context);

```
