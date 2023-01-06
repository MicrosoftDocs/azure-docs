---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 08/06/2021
---

## Permissions

A Web PubSub WebSocket client can only publish to other clients when it's authorized to. The `roles` assigned to the client determine the initial permissions granted to the client:

| Role | Permission |
|---|---|
| Not specified | The client can send event requests.
| `webpubsub.joinLeaveGroup` | The client can join/leave any group.
| `webpubsub.sendToGroup` | The client can publish messages to any group.
| `webpubsub.joinLeaveGroup.<group>` | The client can join/leave the group `<group>`.
| `webpubsub.sendToGroup.<group>` | The client can publish messages to the group `<group>`.

The server can also dynamically grant or revoke permissions from the client through REST APIs or server SDKs.