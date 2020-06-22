---
title: Dynamically add partitions to an event hub in Azure Event Hubs
description: This article shows you how to dynamically add partitions to an event hub in Azure Event Hubs. 
services: event-hubs
author: spelluru

ms.service: event-hubs
ms.topic: how-to
ms.date: 04/23/2020
ms.author: spelluru 
ms.reviewer: shvija
---

# Dynamically add partitions to an event hub (Apache Kafka topic) in Azure Event Hubs
Event Hubs provides message streaming through a partitioned consumer pattern in which each consumer only reads a specific subset, or partition, of the message stream. This pattern enables horizontal scale for event processing and provides other stream-focused features that are unavailable in queues and topics. A partition is an ordered sequence of events that is held in an event hub. As newer events arrive, they're added to the end of this sequence. For more information about partitions in general, see [Partitions](event-hubs-scalability.md#partitions)

You can specify the number of partitions at the time of creating an event hub. In some scenarios, you may need to add partitions after the event hub has been created. This article describes how to dynamically add partitions to an existing event hub. 

> [!IMPORTANT]
> Dynamic additions of partitions is available only on **Dedicated** Event Hubs clusters.

> [!NOTE]
> For Apache Kafka clients, an **event hub** maps to a **Kafka topic**. For more mappings between Azure Event Hubs and Apache Kafka, see [Kafka and Event Hubs conceptual mapping](event-hubs-for-kafka-ecosystem-overview.md#kafka-and-event-hub-conceptual-mapping)


## Update the partition count
This section shows you how to update partition count of an event hub in different ways (PowerShell, CLI, and so on.).

### PowerShell
Use the [Set-AzureRmEventHub](/powershell/module/azurerm.eventhub/Set-AzureRmEventHub?view=azurermps-6.13.0) PowerShell command to update partitions in an event hub. 

```azurepowershell-interactive
Set-AzureRmEventHub -ResourceGroupName MyResourceGroupName -Namespace MyNamespaceName -Name MyEventHubName -partitionCount 12
```

### CLI
Use the [az eventhubs eventhub update](/cli/azure/eventhubs/eventhub?view=azure-cli-latest#az-eventhubs-eventhub-update) CLI command to update partitions in an event hub. 

```azurecli-interactive
az eventhubs eventhub update --resource-group MyResourceGroupName --namespace-name MyNamespaceName --name MyEventHubName --partition-count 12
```

### Resource Manager template
Update value of the `partitionCount` property in the Resource Manager template and redeploy the template to update the resource. 

```json
    {
        "apiVersion": "2017-04-01",
        "type": "Microsoft.EventHub/namespaces/eventhubs",
        "name": "[concat(parameters('namespaceName'), '/', parameters('eventHubName'))]",
        "location": "[parameters('location')]",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaceName'))]"
        ],
        "properties": {
            "messageRetentionInDays": 7,
            "partitionCount": 12
        }
    }
```

### Apache Kafka
Use the `AlterTopics` API (for example, via **kafka-topics** CLI tool) to increase the partition count. For details, see [Modifying Kafka topics](http://kafka.apache.org/documentation/#basic_ops_modify_topic). 

## Event Hubs clients
Let's look at how Event Hubs clients behave when the partition count is updated on an event hub. 

When you add a partition to an existing even hub, the event hub client receives a “MessagingException” from the service informing the clients that entity metadata (entity is your event hub and metadata is the partition information) has been altered. The clients will automatically reopen the AMQP links, which would then pick up the changed metadata information. The clients then operate normally.

### Sender/producer clients
Event Hubs provides three sender options:

- **Partition sender** – In this scenario, clients send events directly to a partition. Although partitions are identifiable and events can be sent directly to them, we don't recommend this pattern. Adding partitions doesn't impact this scenario. We recommend that you restart applications so that they can detect newly added partitions. 
- **Partition key sender** – in this scenario, clients sends the events with a key so that all events belonging to that key end up in the same partition. In this case, service hashes the key and routes to the corresponding partition. The partition count update can cause out-of-order issues due to hashing change. So, if you care about ordering, ensure that your application consumes all events from existing partitions before you increase the partition count.
- **Round-robin sender (default)** – In this scenario, the Event Hubs service round robins the events across partitions. Event Hubs service is aware of partition count changes and will send to new partitions within seconds of altering partition count.

### Receiver/consumer clients
Event Hubs provides direct receivers and an easy consumer library called the [Event Processor Host (old SDK)](event-hubs-event-processor-host.md)  or [Event Processor (new SDK)](event-processor-balance-partition-load.md).

- **Direct receivers** – The direct receivers listen to specific partitions. Their runtime behavior isn't affected when partitions are scaled out for an event hub. The application that uses direct receivers needs to take care of picking up the new partitions and assigning the receivers accordingly.
- **Event processor host** – This client doesn't automatically refresh the entity metadata. So, it wouldn't pick up on partition count increase. Recreating an event processor instance will cause an entity metadata fetch, which in turn will create new blobs for the newly added partitions. Pre-existing blobs won't be affected. Restarting all event processor instances is recommended to ensure that all instances are aware of the newly added partitions, and load-balancing is handled correctly among consumers.

    If you're using the old version of .NET SDK ([WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/)), the event processor host removes an existing checkpoint upon restart if partition count in the checkpoint doesn't match the partition count fetched from the service. This behavior may have an impact on your application. 

## Apache Kafka clients
This section describes how Apache Kafka clients that use the Kafka endpoint of Azure Event Hubs behave when the partition count is updated for an event hub. 

Kafka clients that use Event Hubs with the Apache Kafka protocol behave differently from event hub clients that use AMQP protocol. Kafka clients update their metadata once every `metadata.max.age.ms` milliseconds. You specify this value in the client configurations. The `librdkafka` libraries also use the same configuration. Metadata updates inform the clients of service changes including the partition count increases. For a list of configurations, see [Apache Kafka configurations for Event Hubs](https://github.com/Azure/azure-event-hubs-for-kafka/blob/master/CONFIGURATION.md)

### Sender/producer clients
Producers always dictate that send requests contain the partition destination for each set of produced records. So, all produce partitioning is done on client-side with producer’s view of broker's metadata. Once the new partitions are added to the producer’s metadata view, they'll be available for producer requests.

### Consumer/receiver clients
When a consumer group member performs a metadata refresh and picks up the newly created partitions, that member initiates a group rebalance. Consumer metadata then will be refreshed for all group members, and the new partitions will be assigned by the allotted rebalance leader.

## Recommendations

- If you use partition key with your producer applications and depend on key hashing to ensure ordering in a partition, dynamically adding partitions isn't recommended. 

    > [!IMPORTANT]
    > While the existing data preserves ordering, partition hashing will be broken for messages hashed after the partition count changes due to addition of partitions.
- Adding partition to an existing topic or event hub instance is recommended in the following cases:
    - When you use the round robin (default) method of sending events
	 - Kafka default partitioning strategies, example – StickyAssignor strategy


## Next steps
For more information about partitions, see [Partitions](event-hubs-scalability.md#partitions).

