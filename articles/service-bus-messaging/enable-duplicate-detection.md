---
title: Enable duplicate message detection - Azure Service Bus
description: This article explains how to enable duplicate message detection using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 04/19/2021
---

# Enable duplicate message detection for an Azure Service Bus queue or a topic
Enabling duplicate detection helps keep track of the application-controlled message ID of all messages sent into a queue or topic during a specified time window. If any new message is sent with the message ID that was logged during the time window, the message is considered a duplicate. For more information, See [Duplicate detection](duplicate-detection.md). This article shows you how to enable duplicate message detection for a Service Bus queue or a topic. 

> [!NOTE]
> - The basic tier of Service Bus doesn't support duplicate detection. The standard and premium tiers support duplicate detection. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
> - You can't enable or disable duplicate detection after the queue or topic is created. You can only do so at the time of creating the queue or topic. 

## Azure portal
When creating a **queue** in the Azure portal, select **Enable duplicate detection** as shown in the following image. 

:::image type="content" source="./media/duplicate-detection-enable/create-queue.png" alt-text="Enable duplicate detection at the time of the queue creation":::

When creating a topic in the Azure portal, select **Enable duplicate detection** as shown in the following image. 

:::image type="content" source="./media/duplicate-detection-enable/create-topic.png" alt-text="Enable duplicate detection at the time of the topic creation":::

## Azure CLI
To **create a queue with duplicate detection enabled**, use the [`az servicebus queue create`](/cli/azure/servicebus/queue#az_servicebus_queue_create) command with `--enable-duplicate-detection` set to `true`.

```azurecli-interactive
az servicebus queue create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --enable-duplicate-detection true
```

To **create a topic with duplicate detection enabled**, use the [`az servicebus topic create`](/cli/azure/servicebus/topic#az_servicebus_topic_create) command with `--enable-duplicate-detection` set to `true`.

```azurecli-interactive
az servicebus topic create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name mytopic \
    --enable-duplicate-detection true
```

## Azure PowerShell
To **create a queue with duplicate detection enabled**, use the [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-RequiresDuplicateDetection` set to `$True`. 

```azurepowershell-interactive
New-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -RequiresDuplicateDetection $True
```

To **create a topic with message sessions enabled**, use the [`New-AzServiceBusTopic`](/powershell/module/az.servicebus/new-azservicebustopic) command with `-RequiresDuplicateDetection` set to `true`. 

```azurepowershell-interactive
New-AzServiceBusTopic -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -RequiresDuplicateDetection $True
```

## Resource Manager template
To **create a queue with duplicate detection enabled**, set `requiresDuplicateDetection` to `true` in the queue properties section. For more information, see [Microsoft.ServiceBus namespaces/queues template reference](/azure/templates/microsoft.servicebus/namespaces/queues?tabs=json). 

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
            "requiresDuplicateDetection": true
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
            "requiresDuplicateDetection": true
          }
        }
      ]
    }
  ]
}
```


## Next steps

- [Azure.Messaging.ServiceBus samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)
- [Azure Service Bus client library for Java - Samples](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library for Python - Samples](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library for JavaScript - Samples](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library for TypeScript - Samples](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
- [Microsoft.Azure.ServiceBus samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) (Duplicate Detection sample)  
