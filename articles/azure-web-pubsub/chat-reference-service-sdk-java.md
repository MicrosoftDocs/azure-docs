---
title: Azure Web PubSub Chat service SDK for Java
titleSuffix: Azure Web PubSub
description: Find the package, reference, source, and samples for the Azure Web PubSub Chat service SDK for Java.
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 09/16/2026
ms.custom: devx-track-extended-java
---

# Azure Web PubSub Chat service SDK for Java

The Azure Web PubSub Chat service SDK for Java lets trusted server applications manage Chat roles, users, rooms, room members, conversations, and persisted messages. It can also generate access URLs for Chat WebSocket clients.

The service SDK doesn't maintain an end-user WebSocket connection or send messages as a connected user. For real-time client operations, see [Get started with Azure Web PubSub Chat](chat-quickstart.md).

> [!IMPORTANT]
> Azure Web PubSub Chat and the Java Chat service SDK are in preview. The beta SDK API can change before general availability.

## SDK resources

Use the SDK README as the source of truth for installation, authentication, examples, and troubleshooting:

- [Java SDK README](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/webpubsub/azure-messaging-webpubsub-chat/README.md)
- [Maven package](https://central.sonatype.com/artifact/com.azure/azure-messaging-webpubsub-chat)
- [Source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/webpubsub/azure-messaging-webpubsub-chat/src)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/webpubsub/azure-messaging-webpubsub-chat/src/samples)
- [Changelog](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/webpubsub/azure-messaging-webpubsub-chat/CHANGELOG.md)

Before using the SDK, create an [Azure Web PubSub resource](howto-develop-create-instance.md) and [enable Chat on a hub](chat-howto-enable-chat.md).

## Next steps

- [Chat SDKs and REST API](chat-reference-sdk-and-rest.md)
- [Create and manage rooms](chat-howto-manage-rooms.md)
- [Configure roles and permissions](chat-howto-roles-permissions.md)
- [Chat REST API](/rest/api/webpubsub/dataplane/webpubsubchat/web-pub-sub-chat-service)