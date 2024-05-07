# Batch delete messages in Azure Service Bus

Azure Service Bus is a fully managed enterprise integration message broker that enables you to send and receive messages between decoupled applications and services.However, sometimes you may want to delete messages from a queue or subscription without processing them, for example, if they're expired, corrupted, or irrelevant. This article shows you how to delete messages in batches in Azure Service Bus. 

## Scenarios for Batch deletion of messages

There are several scenarios where you may want to use the batch delete messages feature in Azure Service Bus. Some of them are:

- Expired Messages: Delete messages that exceed their "time to live" (TTL) value and are in the dead-letter queue or subscription.
- Failed Validation or Processing: Remove messages that failed validation or processing logic and are in the dead-letter queue or subscription.
- Irrelevant Messages: Delete messages no longer relevant for your application logic from the active queue or subscription.
- Handling Duplicates or Incorrect Content: Remove duplicate or incorrect messages from the active queue or subscription.

By using the batch delete messages feature, you can delete multiple messages from a queue or subscription in one operation, instead of deleting them one by one. This operation can reduce the number of requests to the service, the network latency, and the resource consumption.

>[!IMPORTANT]
> You can delete a maximum of 4000 messages in a batch delete call. However, keep in mind that batch deletion is done on a best-effort basis and doesn’t guarantee the maximum number of messages will be deleted in every call.  

## How to batch delete messages in Service Bus

Since there could be multiple messages in the entity, we recommend running batch delete call in loop to ensure all of the messages can be deleted. Here's the reference code to delete messages in batch from Service Bus:

```

```
>[!CAUTION]
> From service side, both Maximummessagecount and EnqueuedTimeutc are required parameters. In case you are using Azure SDKs, EnqueuedTimeUtc takes Utc.now() as default value. Ensure to pass in the correct values to avoid unexpected deletion of messages.


## Next steps

To explore Azure Service Bus features.try the samples in language of your choice: 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

Samples for the older .NET and Java client libraries:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - See the **Prefetch** sample. 
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus) - See the **Prefetch** sample. 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)] 

