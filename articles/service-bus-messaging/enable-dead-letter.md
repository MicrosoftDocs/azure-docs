---
title: Enable dead lettering for Azure Service Bus queues and subscriptions
description: This article explains how to enable dead lettering for queues and subscriptions by using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template, devx-track-python
ms.date: 11/09/2022 
---

# Enable dead lettering on message expiration for Azure Service Bus queues and subscriptions
Azure Service Bus queues and subscriptions for topics provide a secondary subqueue, called a dead-letter queue (DLQ). The dead-letter queue doesn't need to be explicitly created and can't be deleted or managed independent of the main entity. The purpose of the dead-letter queue is to hold messages that can't be delivered to any receiver, or messages that couldn't be processed. For more information, See [Overview of Service Bus dead-letter queues](service-bus-dead-letter-queues.md). This article shows you different ways to enable dead lettering for Service Bus queues and subscriptions. 

## Using Azure portal
When creating a **queue** or a **subscription** for a topic in the Azure portal, select **Enable dead lettering on message expiration** as shown in the following examples. 

### Create a queue with dead lettering enabled
:::image type="content" source="./media/enable-dead-letter/create-queue.png" alt-text="Enable dead lettering at the time of the queue creation":::

### Create a subscription with dead lettering enabled
:::image type="content" source="./media/enable-dead-letter/create-subscription.png" alt-text="Enable dead lettering at the time of the subscription creation":::

### Update the dead lettering on message expiration setting for an existing queue
On the **Overview** page for your Service Bus queue, select the current value for the **Dead lettering** on message expiration setting. In the following example, the current value is **Disabled**. You can enable or disable dead lettering on message expiration in the popup window. 

:::image type="content" source="./media/enable-dead-letter/queue-configuration.png" alt-text="Enable dead-lettering on message expiration for an existing queue":::

### Update the dead lettering on message expiration setting for an existing subscription
On the **Overview** page for your Service Bus subscription, select the current value for the **Dead lettering** on message expiration setting. In the following example, the current value is **Disabled**. You can enable or disable dead lettering on message expiration in the popup window. 

:::image type="content" source="./media/enable-dead-letter/subscription-configuration.png" alt-text="Enable dead-lettering on message expiration for an existing subscription":::

## Using Azure CLI
To **create a queue with dead lettering on message expiration enabled**, use the [`az servicebus queue create`](/cli/azure/servicebus/queue#az-servicebus-queue-create) command with `--enable-dead-lettering-on-message-expiration` set to `true`. 

```azurecli-interactive
az servicebus queue create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --enable-dead-lettering-on-message-expiration true
```

To **enable the dead lettering on message expiration setting for an existing queue**, use the [`az servicebus queue update`](/cli/azure/servicebus/queue#az-servicebus-queue-update) command with `--enable-dead-lettering-on-message-expiration` set to `true`. 

```azurecli-interactive
az servicebus queue update \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --enable-dead-lettering-on-message-expiration true
```


To **create a subscription to a topic with dead lettering on message expiration enabled**, use the [`az servicebus topic subscription create`](/cli/azure/servicebus/topic/subscription#az-servicebus-topic-subscription-create) command with `--enable-dead-lettering-on-message-expiration` set to `true`.

```azurecli-interactive
az servicebus topic subscription create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --topic-name mytopic \
    --name mysubscription \
    --enable-dead-lettering-on-message-expiration true
```

To **enable the dead lettering on message expiration setting for a subscription to a topic**, use the [`az servicebus topic subscription update`](/cli/azure/servicebus/topic/subscription#az-servicebus-topic-subscription-update) command with `--enable-dead-lettering-on-message-expiration` set `true`.

```azurecli-interactive
az servicebus topic subscription update \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --topic-name mytopic \
    --name mysubscription \
    --enable-dead-lettering-on-message-expiration true
```

> [!NOTE]
> If you specify a queue or topic by using the `--forward-dead-lettered-messages-to` parameter, Event Grid automatically forwards dead-lettered messages to that queue or topic. Here's an example: `az servicebus queue create --resource-group mysbusrg --namespace-name mysbusns --name myqueue --enable-dead-lettering-on-message-expiration true --forward-dead-lettered-messages-to myqueue2`.

## Using Azure PowerShell
To **create a queue with dead lettering on message expiration enabled**, use the [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-DeadLetteringOnMessageExpiration` set to `$True`. 

```azurepowershell-interactive
New-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -DeadLetteringOnMessageExpiration $True
```

To **enable the dead lettering on message expiration setting for an existing queue**, use the [`Set-AzServiceBusQueue`](/powershell/module/az.servicebus/set-azservicebusqueue) command as shown in the following example.

```azurepowershell-interactive
$queue=Get-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue 

$queue.DeadLetteringOnMessageExpiration=$True

Set-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -QueueObj $queue
``` 

To **create a subscription for a topic with dead lettering on message expiration enabled**, use the [`New-AzServiceBusSubscription`](/powershell/module/az.servicebus/new-azservicebussubscription) command with `-DeadLetteringOnMessageExpiration` set to `$True`. 

```azurepowershell-interactive
New-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -TopicName mytopic `
    -SubscriptionName mysubscription `
    -DeadLetteringOnMessageExpiration $True
```

To **enable the dead lettering on message expiration setting for an existing subscription**, see the following example.

```azurepowershell-interactive
$subscription=Get-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -TopicName mytopic `
    -SubscriptionName mysub

$subscription.DeadLetteringOnMessageExpiration=$True

Set-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -SubscriptionName mysub `
    -SubscriptionObj $subscription 
```

> [!NOTE]
> If you specify a queue or topic by using the `-ForwardDeadLetteredMessagesTo` parameter, Event Grid automatically forwards dead-lettered messages to that queue or topic. 

## Using Azure Resource Manager template
To **create a queue with dead lettering on message expiration enabled**, set `deadLetteringOnMessageExpiration` in the queue properties section to `true`. For more information, see [Microsoft.ServiceBus namespaces/queues template reference](/azure/templates/microsoft.servicebus/namespaces/queues?tabs=json). 

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
            "deadLetteringOnMessageExpiration": true
          }
        }
      ]
    }
  ]
}

```

To **create a subscription for a topic with dead lettering on message expiration enabled**, set `deadLetteringOnMessageExpiration` in the queue properties section to `true`. For more information, see [Microsoft.ServiceBus namespaces/topics/subscriptions template reference](/azure/templates/microsoft.servicebus/namespaces/topics/subscriptions?tabs=json). 

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
    "serviceBusSubscriptionName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Subscription"
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
            "maxSizeInMegabytes": 1024
          },
          "resources": [
            {
              "apiVersion": "2017-04-01",
              "name": "[parameters('serviceBusSubscriptionName')]",
              "type": "Subscriptions",
              "dependsOn": [
                "[parameters('serviceBusTopicName')]"
              ],
              "properties": {
                "deadLetteringOnMessageExpiration": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

> [!NOTE]
> If you specify a queue or topic for the `forwardDeadLetteredMessagesTo` property, Event Grid automatically forwards dead-lettered messages to that queue or topic. 

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
