---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 08/06/2021
---

## Permissions

You may have noticed that when we describe the PubSub WebSocket clients, a client can publish to other clients only when it's *authorized* to. The `role`s of the client determines the *initial* permissions the client have:

| Role | Permission |
|---|---|
| Not specified | The client can send event requests.
| `webpubsub.joinLeaveGroup` | The client can join/leave any group.
| `webpubsub.sendToGroup` | The client can publish messages to any group.
| `webpubsub.joinLeaveGroup.<group>` | The client can join/leave group `<group>`.
| `webpubsub.sendToGroup.<group>` | The client can publish messages to group `<group>`.

The server-side can also grant or revoke permissions of the client dynamically through REST APIs or server SDKs.