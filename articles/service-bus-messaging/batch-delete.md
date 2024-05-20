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
> Currently, Batch delete is not supported with partitioned entities. You can delete a maximum of 4000 messages in a batch delete call. However, keep in mind that batch deletion is done on a best-effort basis and doesn’t guarantee the maximum number of messages will be deleted in every call.  

## How to batch delete messages in Service Bus

You can delete messages by calling [DeleteMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deletemessagesasync?view=azure-dotnet-preview) on Service Bus Receiver object. From service side, both messageCount and beforeEnqueueTime are required parameters. In case you are using Azure SDKs, beforeEnqueueTime takes DateTime.UtcNow() as default value. Ensure to pass in the correct values to avoid unexpected deletion of messages.

Additionally, you can call [PurgeMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deletemessagesasync?view=azure-dotnet-preview) to purge all messages from entity. If you're calling Purge using Azure SDKs, beforeEnqueueTime takes DateTime.UtcNow() as default value. Ensure to pass in the correct values to avoid unexpected deletion of messages. 

>[!NOTE]
> Since Purge would make multiple API calls under the hood, this could cause high CPU consumption.During Purge, locked messages are not eligible for removal and will remain in the entity.


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

