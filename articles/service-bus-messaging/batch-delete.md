# Batch delete messages in Azure Service Bus

Azure Service Bus is a fully managed enterprise integration message broker that enables you to send and receive messages between decoupled applications and services. You can use queues and subscriptions to store messages until they are processed by the receiver. However, sometimes you may want to delete messages from a queue or subscription without processing them, for example, if they are expired, corrupted, or irrelevant. This article shows you how to delete messages in batches in Azure Service Bus. 

## Scenarios for Batch deletion of messages

There are several scenarios where you may want to use the batch delete messages feature in Azure Service Bus. Some of them are:
- You want to delete messages that have exceeded the time to live (TTL) value and are moved to the dead-letter queue or subscription.
- You want to delete messages that have failed the validation or processing logic and are moved to the dead-letter queue or subscription.
- You want to delete messages that are no longer relevant or needed for your application logic and are still in the active queue or subscription.
- You want to delete messages that are duplicates or have incorrect content and are still in the active queue or subscription.

By using the batch delete messages feature, you can delete multiple messages from a queue or subscription in one operation, instead of deleting them one by one. This can reduce the number of requests to the service, the network latency, and the resource consumption. It can also simplify your code and make it more readable and maintainable.

## How to batch delete messages in Service Bus

TBD : Reference code to delete messages. 

## Next steps

Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

Samples for the older .NET and Java client libraries:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - See the **Prefetch** sample. 
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus) - See the **Prefetch** sample. 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)] 

