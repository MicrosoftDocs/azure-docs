---
title: Configure storage and enable Azure Web PubSub chat
titleSuffix: Azure Web PubSub
description: Attach Azure Storage to an Azure Web PubSub resource and enable the Chat feature on a hub.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/29/2026
---

# Configure storage and enable Chat

Before you can use Chat, you need two things: an **Azure Storage account** where your chat data lives,
and the **chat feature** turned on for a hub that points at that storage. This article walks through
both.

## Prerequisites

- An Azure subscription.
- An Azure Web PubSub resource. If you don't have one, [create a resource](howto-develop-create-instance.md).

## Step 1: Configure storage

Chat reaches your storage through the resource's **managed identity**, so there are no connection
strings or keys to manage. Enable a managed identity on the resource first; see
[Use a managed identity](howto-use-managed-identity.md). Then configure storage:

1. In your Web PubSub resource, go to **Persistent Storages** and select **Add** to link an existing
   storage account.
1. Select **Save**. The linked persistent storage is added, and your resource's managed identity is
   granted the **Contributor** role on the storage account so Chat can read and write its tables.

:::image type="content" source="media/chat-howto-enable/configure-storage.png" alt-text="Screenshot of adding a persistent storage account to an Azure Web PubSub resource in the portal.":::

## Step 2: Add a chat hub

After your storage is linked, create a **Chat hub** and point it at that storage.

1. In your Web PubSub resource, go to **Settings** and select **Add Chat Hub**.

   :::image type="content" source="media/chat-howto-enable/add-chat-hub.png" alt-text="Screenshot of adding a Chat hub to an Azure Web PubSub resource in the portal.":::

1. Enter a **Hub name**, select the **Persistent Storage** you linked in Step 1, and then select **Save**.

   :::image type="content" source="media/chat-howto-enable/configure-chat-hub-settings.png" alt-text="Screenshot of configuring a Chat hub with a name and persistent storage in the portal.":::

## What gets stored

When Chat is enabled, it creates a set of tables in your storage account, all named with the prefix
of your hub. A subset of what they hold:

- Messages and conversation history
- Rooms and their members
- Users
- Roles and permissions

Your data stays in your storage account. The service keeps **no copy**.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Chat](chat-quickstart.md)
