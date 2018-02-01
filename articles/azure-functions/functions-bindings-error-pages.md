---
title: Azure Functions error handling guidance | Microsoft Docs
description: Provides general guidance for handling errors that occur in when your functions execute, and links to binding-specific errors topics.
services: functions
cloud: 
documentationcenter: 
author: ggailey777
manager: cfowler

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: article
ms.date: 02/01/2018
ms.author: glenga; cfowler
---

# Azure Functions error handling

This topic provides general guidance for handling errors that occur when your functions execute. It also provides links to the topics that describes binding-specific errors that may occur. 

## Handing errors in functions
[!INCLUDE [bindings errors intro](../../includes/functions-bindings-errors-intro.md)]

 
## Binding error codes

This section describes error information specific to the various bindings and also links to the error code documentation for the supported services. You will find this same information in the reference topics for the individual triggers and bindings.

### Azure Cosmos DB

[!INCLUDE [cosmos-db-errors](../../includes/functions-bindings-cosmos-db-errors.md)]

### Azure Storage

[!INCLUDE [storage-binding-errors](../../includes/functions-bindings-storage-errors.md)]

### Event Hubs

[!INCLUDE [event-hub-errors](../../includes/functions-bindings-event-hub-errors.md)]

### Notification Hubs

[!INCLUDE [notification-hub-errors](../../includes/functions-bindings-notification-hub-errors.md)]

### Service Bus

[!INCLUDE [service-bus-errors](../../includes/functions-bindings-service-bus-errors.md)]

