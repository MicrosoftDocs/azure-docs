---
title: Bring your own storage for Chat threads
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services Chat service with your own storage solution.
author: kaperla
manager: sundraman
services: Azure Communication Services

ms.author: anjulgarg
ms.date: 03/24/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Bring your own storage for chat threads

In this tutorial, we talk about how to move chat threads into your own storage once conversations are complete. Customers are able to do analysis on 
conversations, maintain an archive for compliance reasons and/or enable copilot with ChatGPT to make your agents lives easier.

# Prerequisites 

- A storage account, for example, [Azure Blob Storage] (https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview)

You have a couple of options in going about archiving chat threads.

# Option 1

If your preference is to archive chat messages in real-time, then subscribe to Event Grid messages (events) as conversations are taking place.  
Please note: you would have to pay for [events](https://azure.microsoft.com/en-us/pricing/details/event-grid/). 

# Option 2 

Backend application to perform jobs to move chat threads into your own storage, we recommend archiving when the thread is no longer active, i.e the conversation with the customer is complete. 

The backend application would run a job to do the following steps: 

1. [List](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/chat/get-started?tabs=windows&pivots=platform-azcli#list-chat-messages-in-a-chat-thread) the messages in the chat thread you wish to archive 
2. Write it in the desired format you wish to store it in i.e JSON, CSV
3. Copy the thread in the format as a blob into Azure Blob storage 

 
