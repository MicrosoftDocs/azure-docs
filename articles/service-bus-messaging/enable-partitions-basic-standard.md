---
title: Enable partitioning in Azure Service Bus basic or standard
description: This article explains how to enable partitioning in Azure Service Bus queues and topics by using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 10/12/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2022, devx-track-arm-template, devx-track-python
ms.devlang: azurecli
---

# Enable partitioning in Azure Service Bus basic or standard

Service Bus partitions enable queues and topics, or messaging entities, to be partitioned across multiple message brokers. Partitioning means that the overall throughput of a partitioned entity is no longer limited by the performance of a single message broker. In addition, a temporary outage of a message broker, for example during an upgrade, doesn't render a partitioned queue or topic unavailable. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions. For more information, see [Partitioned queues and topics](service-bus-partitioning.md). This article shows you different ways to enable duplicate message detection for a Service Bus queue or a topic. 

> [!IMPORTANT]
> - Partitioning is available at entity creation for all queues and topics in **Basic** or **Standard** SKUs.
> - It's not possible to change the partitioning option on any existing queue or topic. You can only set the option when you create a queue or a topic. 
> - In a **Standard** tier namespace, you can create Service Bus queues and topics in 1, 2, 3, 4, or 5-GB sizes (the default is 1 GB). With partitioning enabled, Service Bus creates 16 copies (16 partitions) of the entity, each of the same size specified. As such, if you create a queue that's 5 GB in size, with 16 partitions the maximum queue size becomes (5 \* 16) = 80 GB. 

## Use Azure portal
When creating a **queue** in the Azure portal, select **Enable partitioning** as shown in the following image. 

:::image type="content" source="./media/enable-partitions/create-queue.png" alt-text="Enable partitioning at the time of the queue creation":::

When creating a topic in the Azure portal, select **Enable partitioning** as shown in the following image. 

:::image type="content" source="./media/enable-partitions/create-topic.png" alt-text="Enable partitioning at the time of the topic creation":::

## Use Azure CLI
To **create a queue with partitioning enabled**, use the [`az servicebus queue create`](/cli/azure/servicebus/queue#az-servicebus-queue-create) command with `--enable-partitioning` set to `true`.

```azurecli-interactive
az servicebus queue create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --enable-partitioning true
```

To **create a topic with partitioning enabled**, use the [`az servicebus topic create`](/cli/azure/servicebus/topic#az-servicebus-topic-create) command with `--enable-partitioning` set to `true`.

```azurecli-interactive
az servicebus topic create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name mytopic \
    --enable-partitioning true
```

## Use Azure PowerShell
To **create a queue with partitioning enabled**, use the [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-EnablePartitioning` set to `$True`. 

```azurepowershell-interactive
New-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -EnablePartitioning $True
```

To **create a topic with partitioning enabled**, use the [`New-AzServiceBusTopic`](/powershell/module/az.servicebus/new-azservicebustopic) command with `-EnablePartitioning` set to `true`. 

```azurepowershell-interactive
New-AzServiceBusTopic -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -EnablePartitioning $True
```

## Use Azure Resource Manager template
To **create a queue with partitioning enabled**, set `enablePartitioning` to `true` in the queue properties section. For more information, see [Microsoft.ServiceBus namespaces/queues template reference](/azure/templates/microsoft.servicebus/namespaces/queues?tabs=json). 

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
            "enablePartitioning": true
          }
        }
      ]
    }
  ]
}
```

To **create a topic with duplicate detection enabled**, set `enablePartitioning` to `true` in the topic properties section. For more information, see [Microsoft.ServiceBus namespaces/topics template reference](/azure/templates/microsoft.servicebus/namespaces/topics?tabs=json). 

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
            "enablePartitioning": true
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
