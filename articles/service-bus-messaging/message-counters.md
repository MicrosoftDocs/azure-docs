---
title: Azure Service Bus - message count
description: Retrieve the count of messages held in queues and subscriptions by using Azure Resource Manager and the Azure Service Bus NamespaceManager APIs.
ms.topic: article
ms.date: 12/20/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Get message counters
This article shows you different ways of getting message counts for a queue or subscription. Knowing the active message count is useful in determining whether a queue builds up a backlog that requires more resources to process than what has currently been deployed. 

| Counter | Description |
| ----- | ---------- |
| ActiveMessageCount | Number of messages in the queue or subscription that are in the active state and ready for delivery. This includes deferred messages. |
| ScheduledMessageCount	| Number of messages in the scheduled state. |
| DeadLetterMessageCount | Number of messages in the dead-letter queue. |
| TransferMessageCount | Number of messages pending transfer into another queue or topic. |
| TransferDeadLetterMessageCount | Number of messages that failed to transfer into another queue or topic and have been moved into the transfer dead-letter queue. |

If an application wants to scale resources based on the length of the queue, it should do so with a measured pace. The acquisition of the message counters is an expensive operation inside the message broker, and executing it frequently directly and adversely impacts the entity performance.

Another useful metric to consider for scaling is the time between when the latest message was sent and when it was processed, also known as "critical time". This is helpful for scenarios where a queue may have thousands of messages in it, but the processing is fast enough to keep up, giving a "critical time" of only a couple of seconds, which may be more than enough for something like an email sending endpoint. Third-party libraries like [NServiceBus](https://docs.particular.net/nservicebus/operations/opentelemetry#meters-emitted-meters) emit this and other useful metrics via OpenTelemetry.

> [!NOTE]
> The messages that are sent to a Service Bus topic are forwarded to subscriptions for that topic. So, the active message count on the topic itself is 0, as those messages have been successfully forwarded to the subscription. Get the message count at the subscription and verify that it's greater than 0. Even though you see messages at the subscription, they are actually stored in a storage owned by the topic. If you look at the subscriptions, then they would have non-zero message count, which contribute to the storage used by the topic.

## Using Azure portal
Navigate to your namespace, and select the queue. You see message counters on the **Overview** page for the queue.

:::image type="content" source="./media/message-counters/queue-overview.png" alt-text="Screenshot showing the Overview page of a queue with the Message Counts section highlighted.":::

Navigate to your namespace, select the topic, and then select the subscription for the topic. You see message counters on the **Overview** page for the queue.

:::image type="content" source="./media/message-counters/subscription-overview.png" alt-text="Screenshot showing the Overview page of a topic's subscription with the Message Counts section highlighted. ":::

## Using Azure CLI
Use the [`az servicebus queue show`](/cli/azure/servicebus/queue#az-servicebus-queue-show) command to get the message count details for a queue as shown in the following example. 

```azurecli-interactive
az servicebus queue show --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --query countDetails
```

Here's a sample output:

```bash
ActiveMessageCount    DeadLetterMessageCount    ScheduledMessageCount    TransferMessageCount    TransferDeadLetterMessageCount
--------------------  ------------------------  -----------------------  ----------------------  --------------------------------
0                     0                         0                        0                       0
```

Use the [`az servicebus topic subscription show`](/cli/azure/servicebus/topic/subscription#az-servicebus-topic-subscription-show) command to get the message count details for a subscription as shown in the following example. 

```azurecli-interactive
az servicebus topic subscription show --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --topic-name mytopic \
    --name mysub \
    --query countDetails
```

## Using Azure PowerShell
With PowerShell, you can obtain the message count details for a queue as follows:

```azurepowershell-interactive
$queueObj=Get-AzServiceBusQueue -ResourceGroup myresourcegroup `
                    -NamespaceName mynamespace `
                    -QueueName myqueue 

$queueObj.CountDetails
```

Here's the sample output:

```bash
ActiveMessageCount             : 7
DeadLetterMessageCount         : 1
ScheduledMessageCount          : 3
TransferMessageCount           : 0
TransferDeadLetterMessageCount : 0
```

you can obtain the message count details for a subscription as follows:

```azurepowershell-interactive
$topicObj= Get-AzServiceBusSubscription -ResourceGroup myresourcegroup `
                -NamespaceName mynamespace `
                -TopicName mytopic `
                -SubscriptionName mysub

$topicObj.CountDetails
```

The returned `MessageCountDetails` object has the following properties: `ActiveMessageCount`, `DeadLetterMessageCount`, `ScheduledMessageCount`, `TransferDeadLetterMessageCount`, `TransferMessageCount`. 

## Next steps

Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

Find samples for the older .NET and Java client libraries below:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/)
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus)

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]
