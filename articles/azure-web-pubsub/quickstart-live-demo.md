---
title: Azure Web PubSub service live demo
description: A quickstart for getting started with Azure Web PubSub service live demo.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 04/26/2021
---

# Quickstart: Get started with live demo

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. In this quickstart, learn how to get started easily with a live demo.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Get started with the live demo

### Get client URL with a temp access token

As the first step, you need to get the Client URL from the Azure Web PubSub instance. 

- Go to Azure portal and find out the Azure Web PubSub instance.
- Go to the `Client URL Generator` in `Key` blade. 
- Set proper `Roles`: **Send To Groups** and **Join/Leave Groups**
- Generate and copy the `Client Access URL`. 

### Try the live demo 

With this live demo, you could join or leave a group and send messages to the group members easily. 

- Open [Client Pub/Sub Demo](https://azure.github.io/azure-webpubsub/demos/clientpubsub.html), paste the `Client Access URL` and Connect. 
- Try different groups to join and different groups to send messages to, and see what messages are received.
- You can also try to uncheck `Roles` when generating the `Client Access URL` to see what will happen when join/leave a group or send messages to a group.