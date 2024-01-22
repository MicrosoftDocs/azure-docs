---
title: Use log compaction
description: Learn how to use log compaction. 
ms.topic: how-to
ms.custom: log-compaction
ms.date: 06/19/2023
---

# Use log compaction
This article shows you how to use log compaction feature in Event Hubs. To understand the details of log compaction, see [Log Compaction](log-compaction.md).

In this article you'll, follow these key steps:
- Create a compacted event hub/Kafka topic.
- Publish events to a compacted event hub. 
- Consume events from a compacted event hub. 

> [!NOTE] 
> Log compaction feature isn't supported in the **Basic** tier.

## Create a compacted event hub/Kafka topic
This section shows you how to create a compacted event hub using Azure portal and an Azure Resource Manager (ARM) template.

### [Azure portal](#tab/portal)
You can create a compacted event hub using the Azure portal by following these steps.

1. Navigate to your Event Hubs namespace.
1. On the Event Hubs Namespace page, select Event Hubs in the left menu.
1. At the top of the window, select + Event Hubs.
    :::image type="content" source="./media/event-hubs-quickstart-portal/create-event-hub4.png" alt-text="Screenshot of event hub creation UI.":::
1. Type a *name* for your event hub, and specify the *partition count*. Since we're creating a compacted event hub, select *compaction policy* as *compaction* and provide the desired value for *tombstone retention time*. 
    :::image type="content" source="./media/event-hubs-log-compaction/enabling-compaction.png" alt-text="Screenshot of the event hubs creation UI with compaction related attributes.":::
1. Select *create* and create the compacted event hub. 

### [ARM template](#tab/arm)
The following example shows how to create a compacted event hub/Kafka topic using an ARM template.

```json
"resources": [
  {
    "apiVersion": "2017-04-01",
    "name": "[parameters('eventHubName')]",
    "type": "eventhubs",
    "dependsOn": [
      "[resourceId('Microsoft.EventHub/namespaces/', parameters('eventHubNamespaceName'))]"
    ],
    "properties": {
      "partitionCount": "[parameters('partitionCount')]",
      "retentionDescription": {
        "cleanupPolicy": "compact",
        "tombstoneRetentionTimeInHours": "24"
      }
    }
  }
]
```

---

## Triggering compaction 
Event Hubs service determines when the compaction job of a given compacted event hub should be executed. Compacted event hub reaches the compaction threshold when there are considerable number of events or the total size of a given event log grows significantly. 

## Publish event to a compacted topic
Publishing events to a compacted event hub is the same as publishing events to a regular event hub. As the client application you only need to determine the compaction key, which you set using partition key.

### Using Event Hubs SDK(AMQP)
With Event Hubs SDK, you can set partition key and publish events as shown below:

```csharp
var enqueueOptions = new EnqueueEventOptions
{
    PartitionKey = "Key-1"
    
};
await producer.EnqueueEventAsync(eventData, enqueueOptions);
```

### Using Kafka
With Kafka you can set the partition key when you create the `ProducerRecord` as shown below: 
```java
ProducerRecord<String, String> record = new ProducerRecord<String, String>(TOPIC, "Key-1" , "Value-1");
```

## Quotas and limits
| Limit | Basic | Standard | Premium |  Dedicated |
| ----- | ----- | -------- | -------- | --------- | 
| Size of compacted event hub  | N/A | 1 GB per partition | 250 GB per partition | 250 GB per partition |

For other quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## Consuming events from a compacted topic
There are no changes required at the consumer side to consume events from a compacted event hub. So, you can use any of the existing consumer applications to consume data from a compacted event hub. 

## Next steps

- For conceptual information on how log compaction work, see [Log compaction](log-compaction.md). 