---
title: Enable duplicate message detection - Azure Service Bus
description: This article explains how to enable duplicate message detection using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 04/19/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template, devx-track-python
ms.devlang: azurecli
---

# Enable duplicate message detection for an Azure Service Bus queue or a topic
When you enable duplicate detection for a queue or topic, Azure Service Bus keeps a history of all messages sent to the queue or topic for a configure amount of time. During that interval, your queue or topic won't store any duplicate messages. Enabling this property guarantees exactly once delivery over a user-defined span of time. For more information, See [Duplicate detection](duplicate-detection.md). This article shows you different ways to enable duplicate message detection for a Service Bus queue or a topic. 


> [!NOTE]
> - The basic tier of Service Bus doesn't support duplicate detection. The standard and premium tiers support duplicate detection. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
> - You can't enable or disable duplicate detection after the queue or topic is created. You can only do so at the time of creating the queue or topic. 

## Using Azure portal
When creating a **queue** in the Azure portal, select **Enable duplicate detection** as shown in the following image. You can configure the size of the duplicate detection window when creating a queue or topic. 

:::image type="content" source="./media/enable-duplicate-detection/create-queue.png" alt-text="Enable duplicate detection at the time of the queue creation":::

When creating a topic in the Azure portal, select **Enable duplicate detection** as shown in the following image. 

:::image type="content" source="./media/enable-duplicate-detection/create-topic.png" alt-text="Enable duplicate detection at the time of the topic creation":::

You can also configure this setting for an existing queue or topic, if you had enabled duplicate detection at the time of creation. 

### Update duplicate detection window size for an existing queue or a topic
To change the duplicate detection window size for an existing queue or a topic, on the **Overview** page, select **Change** for **Duplicate detection window**.  

#### Queue
:::image type="content" source="./media/enable-duplicate-detection/window-size.png" alt-text="Set duplicate detection window size for a queue":::

#### Topic
:::image type="content" source="./media/enable-duplicate-detection/window-size-topic.png" alt-text="Set duplicate detection window size for a topic":::


## Using Azure CLI
To **create a queue with duplicate detection enabled**, use the [`az servicebus queue create`](/cli/azure/servicebus/queue#az-servicebus-queue-create) command with `--enable-duplicate-detection` set to `true`. 

```azurecli-interactive
az servicebus queue create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --enable-duplicate-detection true \
    --duplicate-detection-history-time-window P1D
```

To **create a topic with duplicate detection enabled**, use the [`az servicebus topic create`](/cli/azure/servicebus/topic#az-servicebus-topic-create) command with `--enable-duplicate-detection` set to `true`.

```azurecli-interactive
az servicebus topic create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name mytopic \
    --enable-duplicate-detection true \
    --duplicate-detection-history-time-window P1D
```

The above examples also set the size of the duplicate detection window by using the `--duplicate-detection-history-time-window` parameter. The window size is set to one day. The default value is 10 minutes and the maximum allowed value is seven days.

To **update a queue with a new detection window size**, use the [`az servicebus queue update`](/cli/azure/servicebus/queue#az-servicebus-queue-update) command with the `--duplicate-detection-history-time-window` parameter. In this example, the window size is updated to seven days. 

```azurecli-interactive
az servicebus queue update \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --duplicate-detection-history-time-window P7D
```

Similarly, to **update a topic with a new detection window size**, use the [`az servicebus topic update`](/cli/azure/servicebus/topic#az-servicebus-topic-update) command with the `--duplicate-detection-history-time-window` parameter. In this example, the window size is updated to seven days.

```azurecli-interactive
az servicebus topic update \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --duplicate-detection-history-time-window P7D
```
 
## Using Azure PowerShell
To **create a queue with duplicate detection enabled**, use the [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-RequiresDuplicateDetection` set to `$True`. 

```azurepowershell-interactive
New-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -RequiresDuplicateDetection $True `
    -DuplicateDetectionHistoryTimeWindow P1D
```

To **create a topic with duplicate detection enabled**, use the [`New-AzServiceBusTopic`](/powershell/module/az.servicebus/new-azservicebustopic) command with `-RequiresDuplicateDetection` set to `true`. 

```azurepowershell-interactive
New-AzServiceBusTopic -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -RequiresDuplicateDetection $True
    -DuplicateDetectionHistoryTimeWindow P1D
```

The above examples also set the size of the duplicate detection window by using the `-DuplicateDetectionHistoryTimeWindow` parameter. The window size is set to one day. The default value is 10 minutes and the maximum allowed value is seven days.

To **update a queue with a new detection window size**, see the following example.  In this example, the window size is updated to seven days.

```azurepowershell-interactive
$queue=Get-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue 

$queue.DuplicateDetectionHistoryTimeWindow='P7D'

Set-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -QueueObj $queue
```

To **update a topic with a new detection window size**, see the following example. In this example, the window size is updated to seven days.

```azurepowershell-interactive
$topic=Get-AzServiceBusTopic -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic

$topic.DuplicateDetectionHistoryTimeWindow='P7D'

Set-AzServiceBusTopic -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -TopicObj $topic
```

## Using Azure Resource Manager template
To **create a queue with duplicate detection enabled**, set `requiresDuplicateDetection` to `true` in the queue properties section. For more information, see [Microsoft.ServiceBus namespaces/queues template reference](/azure/templates/microsoft.servicebus/namespaces/queues?tabs=json). Specify a value for the `duplicateDetectionHistoryTimeWindow` property to set the size of the duplicate detection window. In the following example, it's set to one day.  

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceBusNamespaceName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Service Bus namespace"
      }
    },
    "serviceBusQueueName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Queue"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ServiceBus/namespaces",
      "apiVersion": "2018-01-01-preview",
      "name": "[parameters('serviceBusNamespaceName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard"
      },
      "properties": {},
      "resources": [
        {
          "type": "Queues",
          "apiVersion": "2017-04-01",
          "name": "[parameters('serviceBusQueueName')]",
          "dependsOn": [
            "[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]"
          ],
          "properties": {
            "requiresDuplicateDetection": true,
            "duplicateDetectionHistoryTimeWindow": "P1D"
          }
        }
      ]
    }
  ]
}

```

To **create a topic with duplicate detection enabled**, set `requiresDuplicateDetection` to `true` in the topic properties section. For more information, see [Microsoft.ServiceBus namespaces/topics template reference](/azure/templates/microsoft.servicebus/namespaces/topics?tabs=json). 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "service_BusNamespace_Name": {
      "type": "string",
      "metadata": {
        "description": "Name of the Service Bus namespace"
      }
    },
    "serviceBusTopicName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Topic"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "resources": [
    {
      "apiVersion": "2018-01-01-preview",
      "name": "[parameters('service_BusNamespace_Name')]",
      "type": "Microsoft.ServiceBus/namespaces",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard"
      },
      "properties": {},
      "resources": [
        {
          "apiVersion": "2017-04-01",
          "name": "[parameters('serviceBusTopicName')]",
          "type": "topics",
          "dependsOn": [
            "[resourceId('Microsoft.ServiceBus/namespaces/', parameters('service_BusNamespace_Name'))]"
          ],
          "properties": {
            "requiresDuplicateDetection": true,
            "duplicateDetectionHistoryTimeWindow": "P1D"
          }
        }
      ]
    }
  ]
}
```


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
