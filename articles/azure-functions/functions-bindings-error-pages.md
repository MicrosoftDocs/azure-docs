---
title: Azure Functions error handling guidance | Microsoft Docs
description: Provides general guidance for handling errors that occur in when your functions execute, and links to binding-specific errors topics.
services: functions
cloud: 
documentationcenter: 
author: craigshoemaker
manager: gwallace

ms.assetid:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 02/01/2018
ms.author: cshoe
---

# Azure Functions error handling

This topic provides general guidance for handling errors that occur when your functions execute. It also provides links to the topics that describe binding-specific errors that may occur. 

## Handing errors in functions
[!INCLUDE [bindings errors intro](../../includes/functions-bindings-errors-intro.md)]

 
## Binding error codes

When integrating with Azure services, you may have errors raised that originate from the APIs of the underlying services. Links to the error code documentation for these services can be found in the **Exceptions and return codes** section of the following trigger and binding reference topics:

+ [Azure Cosmos DB](functions-bindings-cosmosdb.md#exceptions-and-return-codes)

+ [Blob storage](functions-bindings-storage-blob.md#exceptions-and-return-codes)

+ [Event Hubs](functions-bindings-event-hubs.md#exceptions-and-return-codes)

+ [Notification Hubs](functions-bindings-notification-hubs.md#exceptions-and-return-codes)

+ [Queue storage](functions-bindings-storage-queue.md#exceptions-and-return-codes)

+ [Service Bus](functions-bindings-service-bus.md#exceptions-and-return-codes)

+ [Table storage](functions-bindings-storage-table.md#exceptions-and-return-codes)
