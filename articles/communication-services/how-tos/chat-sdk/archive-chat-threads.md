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

- An Azure account with an active subscription. 
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A storage account, in this guide we take an example of Azure Blob Storage. You can use the portal to set up an [account](../../../event-grid/blob-event-quickstart-portal.md). You can use any other storage option that you prefer.
- If you would like to archive messages in near real time, enable Azure Event Grid, which is a paid service (this prerequisite is only for option 2).

## About Event Grid

[Event Grid](../../../event-grid/overview.md) is a cloud-based eventing service. You need to subscribe to [communication service events](../../../event-grid/event-schema-communication-services.md), and trigger an event in order to archive the messages in near real time. Typically, you send events to an endpoint that processes the event data and takes actions. 

## Set up the environment

To set up the environment that you use to generate and receive events, take the steps in the following sections.

### Register an Event Grid resource provider

If you haven't previously used Event Grid in your Azure subscription, you might need to register your Event Grid resource provider. To register the provider, follow these steps:

1. Go to the Azure portal.
1. On the left menu, select **Subscriptions**.
1. Select the subscription that you use for Event Grid.
1. On the left menu, under **Settings**, select **Resource providers**.
1. Find **Microsoft.EventGrid**.
1. If your resource provider isn't registered, select **Register**.

It might take a moment for the registration to finish. Select **Refresh** to update the status. When **Registered** appears under **Status**, you're ready to continue.

### Deploy the Event Grid viewer

You need to use an Event Grid viewer to view events in near-real time. The viewer provides the user with the experience of a real-time feed. 

There are two methods for archiving chat threads. You can choose to archive messages when the thread is inactive or in near real time.

## Option 1: Archiving inactive conversations using a back end application

This option is suited when your chat volume is high and multiple parties are involved.

Create a backend application to perform jobs to move chat threads into your own storage, we recommend archiving when the thread is no longer active, i.e the conversation with the customer is complete. 

The backend application would run a job to do the following steps: 

1. [List](../../quickstarts/chat/get-started.md?tabs=windows&pivots=platform-azcli#list-chat-messages-in-a-chat-thread) the messages in the chat thread you wish to archive 
2. Write the chat thread in the desired format you wish to store it in i.e JSON, CSV
3. Copy the thread in the format as a blob into Azure Blob storage 

## Option 2: Archiving chat messages in real-time

This option is suited if the chat volume is low as conversations are happening in real time.

:::image type="content" source="../../media/storage-work-flow.jpg" alt-text="Architecture diagram showing how you can use events and archive messages to your own storage account.":::

Follow these steps for archiving messages:

- Subscribe to Event Grid events which come with Azure Event Grid through web hooks. Azure Communications Chat service supports the following [events](../../concepts/chat/concepts.md#real-time-notifications) for real-time notifications. The following events are recommended: Message Received [event](../../../event-grid/communication-services-chat-events.md#microsoftcommunicationchatmessagereceived-event), Message Edited [event](../../../event-grid/communication-services-chat-events.md#microsoftcommunicationchatmessageedited-event), and Message Deleted [event](../../../event-grid/communication-services-chat-events.md#microsoftcommunicationchatmessagedeleted-event).
- Validate the [events](../../how-tos/event-grid/view-events-request-bin.md) by configuring your resource to receive these events
- Test your Event Grid handler [locally](../../how-tos/event-grid/local-testing-event-grid.md) to ensure that you are receiving events that you need for archiving.

> [!Note]
> You would have to pay for [events](https://azure.microsoft.com/pricing/details/event-grid/). 

## Next steps

* For an introduction to Azure Event Grid Concepts, see [Concepts in Event Grid](../../../event-grid/concepts.md)
* Service [Limits](../../concepts/service-limits.md)
* [Troubleshooting](../../concepts/troubleshooting-info.md)
* Help and support [options](../../support.md)



 
