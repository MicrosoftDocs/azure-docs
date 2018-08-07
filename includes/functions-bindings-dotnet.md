---
title: include file
description: include file
services: functions
author: tdykstra
manager: cfowler
ms.service: functions
ms.topic: include
ms.date: 05/23/2018
ms.author: tdykstra
ms.custom: include file
---
The following table lists the trigger and binding attributes that are available in an Azure Functions class library project. All attributes are in the namespace `Microsoft.Azure.WebJobs`.

| Trigger | Input | Output|
|------   | ------    | ------  |
| [BlobTrigger](../articles/azure-functions/functions-bindings-storage-blob.md#trigger---attributes)| [Blob](../articles/azure-functions/functions-bindings-storage-blob.md#input---attributes)| [Blob](../articles/azure-functions/functions-bindings-storage-blob.md#output---attributes)|
| [CosmosDBTrigger](../articles/azure-functions/functions-bindings-cosmosdb.md#trigger---attributes)| [DocumentDB](../articles/azure-functions/functions-bindings-cosmosdb.md#input---attributes)| [DocumentDB](../articles/azure-functions/functions-bindings-cosmosdb.md#output---attributes) |
| [EventHubTrigger](../articles/azure-functions/functions-bindings-event-hubs.md#trigger---attributes)|| [EventHub](../articles/azure-functions/functions-bindings-event-hubs.md#output---attributes) |
| [HTTPTrigger](../articles/azure-functions/functions-bindings-http-webhook.md#trigger---attributes)|||
| [QueueTrigger](../articles/azure-functions/functions-bindings-storage-queue.md#trigger---attributes)|| [Queue](../articles/azure-functions/functions-bindings-storage-queue.md#output---attributes) |
| [ServiceBusTrigger](../articles/azure-functions/functions-bindings-service-bus.md#trigger---attributes)|| [ServiceBus](../articles/azure-functions/functions-bindings-service-bus.md#output---attributes) |
| [TimerTrigger](../articles/azure-functions/functions-bindings-timer.md#attributes) | ||
| |[ApiHubFile](../articles/azure-functions/functions-bindings-external-file.md)| [ApiHubFile](../articles/azure-functions/functions-bindings-external-file.md)|
| |[MobileTable](../articles/azure-functions/functions-bindings-mobile-apps.md#input---attributes)| [MobileTable](../articles/azure-functions/functions-bindings-mobile-apps.md#output---attributes) | 
| |[Table](../articles/azure-functions/functions-bindings-storage-table.md#input---attributes)| [Table](../articles/azure-functions/functions-bindings-storage-table.md#output---attributes)  | 
| ||[NotificationHub](../articles/azure-functions/functions-bindings-notification-hubs.md#attributes) |
| ||[SendGrid](../articles/azure-functions/functions-bindings-sendgrid.md#attributes) |
| ||[Twilio](../articles/azure-functions/functions-bindings-twilio.md#attributes)| 