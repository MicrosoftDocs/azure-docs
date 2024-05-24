---
title: Delete messages from Azure Service Bus
description: This article explains how to delete messages in Azure Service Bus programmatically. 
ms.topic: article
ms.date: 05/20/2024
---

# Batch delete messages in Azure Service Bus (Preview)

Azure Service Bus is a fully managed enterprise integration message broker that enables you to send and receive messages between decoupled applications and services. However, sometimes you may want to delete messages from a queue or subscription without processing them, for example, if they're expired, corrupted, or irrelevant. This article shows you how to delete messages in batches in Azure Service Bus. 

## Scenarios for Batch deletion of messages

There are several scenarios where you may want to use the batch delete messages feature in Azure Service Bus. Some of them are:

- Expired Messages: Delete messages that exceed their "time to live" (TTL) value and are in the dead-letter queue.
- Failed Validation or Processing: Remove messages that failed validation or processing logic and are in the dead-letter queue.
- Irrelevant Messages: Delete messages no longer relevant for your application logic from the active queue.
- Handling Duplicates or Incorrect Content: Remove duplicate or incorrect messages from the active queue.

By using the batch delete messages feature, you can delete multiple messages from a queue or subscription in one operation, instead of deleting them one by one. Since deletion is done at service side, you don't need to receive the messages before deleting them. This method minimizes both the number of service requests and network latency.

>[!IMPORTANT]
> Currently, Batch delete is not supported with partitioned entities. You can delete a maximum of 4000 messages in a batch delete call. Batch deletion is done on a best-effort basis and doesn’t guarantee the exact messageCount  will be deleted in single API call.  

## How to batch delete messages in Service Bus

You can delete messages by calling [DeleteMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deletemessagesasync?view=azure-dotnet-preview) on Service Bus Receiver object. On the server side, DeleteMessagesAsync requires two parameters: messageCount and beforeEnqueueTime as described below:

- messageCount : The desired number of messages to delete.The service may delete fewer messages than this limit.
- beforeEnqueueTime : An optional DateTimeOffset, in UTC, representing the cutoff time for deletion. Only messages that were enqueued before this time will be deleted. 

Additionally, you can call [PurgeMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deletemessagesasync?view=azure-dotnet-preview) to purge all messages from entity. 

When using Azure SDKs to perform these operations, the beforeEnqueueTime parameter defaults to the current UTC time (DateTime.UtcNow()). It’s important to ensure you provide the correct values to prevent unintended message deletion.

>[!NOTE]
> The purge operation could lead to increased CPU usage as it involves multiple API calls. During purge, locked messages are not eligible for removal and will remain in the entity.


## Next steps

To explore Azure Service Bus features, try the samples in language of your choice: 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

Samples for the older .NET and Java client libraries:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - See the **Prefetch** sample. 
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus) - See the **Prefetch** sample. 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)] 

