---
title: Archive your chat threads
titleSuffix: An Azure Communication Services tutorial
description: Learn how to archive chat threads and messages with your own storage.
author: kperla97
manager: sundraman
services: Azure Communication Services

ms.author: kaperla
ms.date: 03/24/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

#  Archiving chat threads into your preferred storage solution

In this guide, learn how to move chat messages into your own storage in real-time or chat threads once conversations are complete. Developers are able to maintain an archive of chat threads or messages for compliance reasons or to integrate with Azure OpenAI or both.

## Prerequisites 

- An Azure account with an active subscription. Create an account for free.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A storage account, in this guide we will take an example of Azure Blob Storage. You can use the portal to set up an [account](../../event-grid/blob-event-quickstart-portal). You can use any other storage option that you prefer.
- If you would like to archive messages in real time, enable Azure Event Grid which is a paid service (this prerequisite is only if you want to archive messages in real-time).

There are two methods for archiving chat threads. You can choose to archive messages when the thread is inactive or in real time.

## Option 1: Archiving inactive conversations using a back end application

This option is suited when your chat volume is high and multiple parties are involved.

Create a backend application to perform jobs to move chat threads into your own storage, we recommend archiving when the thread is no longer active, i.e the conversation with the customer is complete. 

The backend application would run a job to do the following steps: 

1. [List](../../quickstarts/chat/get-started?tabs=windows&pivots=platform-azcli#list-chat-messages-in-a-chat-thread) the messages in the chat thread you wish to archive 
2. Write the chat thread in the desired format you wish to store it in i.e JSON, CSV
3. Copy the thread in the format as a blob into Azure Blob storage 

## Option 2: Archiving chat messages in real-time

This option is suited if the chat volume is low as conversations are happening in real time.

:::image type="content" source="../../media/BYOS_work_flow.jpg" alt-text="Architecture diagram showing how you can use events and archive messages to your own storage account":::

To do this, you need to use [Azure Event Grid](../../../event-grid/overview). 

Follow these steps for archiving messages:

- Subscribe to Event Grid events which come with Azure Event grid. Azure Communications Chat service supports the following [events](../../../../concepts/chat/concepts#real-time-notifications) for real-time notifications. The following events are recommended: Message Received [event](../../../event-grid/communication-services-chat-events#microsoftcommunicationchatmessagereceived-event), Message Edited [event](../../../event-grid/communication-services-chat-events#microsoftcommunicationchatmessageedited-event), and Message Deleted [event](../../../event-grid/communication-services-chat-events#microsoftcommunicationchatmessagedeleted-event).
- Validate the [events](../../event-grid/view-events-request-bin#configure-your-azure-communication-services-resource-to-send-events-to-your-endpoint) by configuring your resource to receive these events
- Test your Event Grid handler [locally](../../how-tos/event-grid/local-testing-event-grid) to ensure that you are receiving events that you need for archiving.

Note: you would have to pay for [events](https://azure.microsoft.com/pricing/details/event-grid/). 

## Next Steps

Service Limits (../../quickstarts/chat/service-limits)
Troubleshooting (../../quickstarts/chat/troubleshooting-info)
Help and support options (../../quickstarts/chat/support)



 
