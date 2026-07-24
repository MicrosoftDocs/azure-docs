---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 10/14/2025
---

## Permissions

A PubSub WebSocket client can only publish to other clients when it's authorized. The `roles` assigned to the client determine the permissions granted to the client:

| Role | Permission |
|---|---|
| Not specified | The client can send event requests.
| `webpubsub.joinLeaveGroup` | The client can join/leave any group.
| `webpubsub.sendToGroup` | The client can publish messages to any group.
| `webpubsub.joinLeaveGroup.<group>` | The client can join/leave the group `<group>`.
| `webpubsub.sendToGroup.<group>` | The client can publish messages to the group `<group>`.
| `webpubsub.joinLeaveGroups.<pattern>` | The client can join/leave any group whose name matches `<pattern>` (see [Wildcard group role patterns](../concept-wildcard-group-roles.md)).
| `webpubsub.sendToGroups.<pattern>` | The client can publish messages to any group whose name matches `<pattern>` (see [Wildcard group role patterns](../concept-wildcard-group-roles.md)).

The server can dynamically grant or revoke client permissions through REST APIs or server SDKs.

> [!NOTE]
> Wildcard roles (e.g., `webpubsub.sendToGroups.<pattern>`) are not supported in REST APIs or server SDKs during runtime yet.