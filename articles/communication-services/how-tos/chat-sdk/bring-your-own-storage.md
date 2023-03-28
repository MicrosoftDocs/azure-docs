---
title: Bring your own storage for Chat threads
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services Chat service with your own storage solution.
author: kperla97
manager: sundraman
services: Azure Communication Services

ms.author: kperla97
ms.date: 03/24/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Bring your own storage for chat threads

In this tutorial, we talk about how to move chat threads into your own storage once conversations are complete. Customers are able to do analysis on 
conversations, maintain an archive for compliance reasons and/or integrate with Azure OpenAI to make your agents lives easier.

## Prerequisites 

- An Azure account with an active subscription. Create an account for free.
- An active Communication Services resource and connection string. Create a Communication Services resource.
- A storage account, for example, [Azure Blob Storage](../azure/storage/blobs/storage-blobs-overview). You can use the portal to set up an (account)[https://learn.microsoft.com/en-us/azure/event-grid/blob-event-quickstart-portal].
- Enable Azure Event Grid (only if you want to archive messages in real-time).

You have a couple of options in going about archiving chat threads.

## Option 1 Archive chat messages in real-time

[Architecture diagram here]

To do this you need to use [Azure Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/overview). 

Follow these steps for archiving messages:

- Subscribe to Event Grid events, Chat supports the following [events](https://learn.microsoft.com/en-us/azure/communication-services/concepts/chat/concepts#real-time-notifications) for real-time notifications. The following events are recommended: Message Recieved [event](../../../event-grid/communication-services-chat-events#microsoftcommunicationchatmessagereceived-event), Message Edited [event](../../../../communication-services-chat-events#microsoftcommunicationchatmessageedited-event), and Message Deleted [event](../../../../communication-services-chat-events#microsoftcommunicationchatmessagedeleted-event).
- Validate the [events](https://learn.microsoft.com/en-us/azure/communication-services/how-tos/event-grid/view-events-request-bin#configure-your-azure-communication-services-resource-to-send-events-to-your-endpoint) by configuring your resource to recive these events
- Test your Event Grid handler [locally](https://learn.microsoft.com/en-us/azure/communication-services/how-tos/event-grid/local-testing-event-grid)

Please note: you would have to pay for [events](../azure.microsoft.com/pricing/details/event-grid/). 

## Option 2 

Backend application to perform jobs to move chat threads into your own storage, we recommend archiving when the thread is no longer active, i.e the conversation with the customer is complete. 

The backend application would run a job to do the following steps: 

1. [List](../quickstarts/chat/get-started?tabs=windows&pivots=platform-azcli#list-chat-messages-in-a-chat-thread) the messages in the chat thread you wish to archive 
2. Write it in the desired format you wish to store it in i.e JSON, CSV
3. Copy the thread in the format as a blob into Azure Blob storage 

 
