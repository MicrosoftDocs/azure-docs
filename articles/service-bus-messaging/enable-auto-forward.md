---
title: Enable auto forwarding for Azure Service Bus queues and subscriptions
description: This article explains how to enable auto forwarding for queues and subscriptions by using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 04/19/2021
---

# Enable auto forwarding for Azure Service Bus queues and subscriptions
The Service Bus auto forwarding feature enables you to chain a queue or subscription to another queue or topic that is part of the same namespace. When auto forwarding is enabled, Service Bus automatically removes messages that are placed in the first queue or subscription (source) and puts them in the second queue or topic (destination). It's still possible to send a message to the destination entity directly. For more information, See [Chaining Service Bus entities with auto forwarding](service-bus-auto-forwarding.md). This article shows you different ways to enable auto forwarding for Service Bus queues and subscriptions. 

> [!IMPORTANT]
> The basic tier of Service Bus doesn't support the auto forwarding feature. The standard and premium tiers support the feature. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

## Using Azure portal
When creating a **queue** or a **subscription** for a topic in the Azure portal, select **Forward messages to queue/topic** as shown in the following examples. Then, specify whether you want messages to be forwarded to a queue or a topic. In this example, the **Queue** option is selected and a queue from the same namespace is selected.

### Create a queue with auto forwarding enabled
:::image type="content" source="./media/enable-auto-forward/create-queue.png" alt-text="Enable auto forward at the time of the queue creation":::

### Create a subscription for a topic with auto forwarding enabled
:::image type="content" source="./media/enable-auto-forward/create-subscription.png" alt-text="Enable auto forward at the time of the subscription creation":::

### Update the auto forward setting for an existing queue
On the **Overview** page for your Service Bus queue, select the current value for the **Forward messages to** setting. In the following example, the current value is **Disabled**. In the **Forward messages to queue/topic** window, you can select the queue or topic where you want the messages to be forwarded. 

:::image type="content" source="./media/enable-auto-forward/queue-auto-forward.png" alt-text="Enable auto forward for an existing queue":::

### Update the auto forward setting for an existing subscription
On the **Overview** page for your Service Bus subscription, select the current value for the **Forward messages to** setting. In the following example, the current value is **Disabled**. In the **Forward messages to queue/topic** window, you can select the queue or topic where you want the messages to be forwarded. 

:::image type="content" source="./media/enable-auto-forward/subscription-auto-forward.png" alt-text="Enable auto forward for an existing subscription":::

## Using Azure CLI
To **create a queue with auto forwarding enabled**, use the [`az servicebus queue create`](/cli/azure/servicebus/queue#az_servicebus_queue_create) command with `--forward-to` set to the name of queue or topic to which you want the messages to be forwarded. 

```azurecli-interactive
az servicebus queue create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --forward-to myqueue2
```

To **update the auto forward setting for an existing queue**, use the [`az servicebus queue update`](/cli/azure/servicebus/queue#az_servicebus_queue_update) command with `--forward-to` set to the name of the queue or topic to which you want the messages to be forwarded. 

```azurecli-interactive
az servicebus queue update \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --name myqueue \
    --forward-to myqueue2
```


To **create a subscription to a topic with auto forwarding enabled**, use the [`az servicebus topic subscription create`](/cli/azure/servicebus/topic/subscription#az_servicebus_topic_subscription_create) command with `--forward-to` set to the name of queue or topic to which you want the messages to be forwarded.

```azurecli-interactive
az servicebus topic subscription create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --topic-name mytopic \
    --name mysubscription \
    --forward-to myqueue2
```

To **update the auto forward setting for a subscription to a topic**, use the [`az servicebus topic subscription update`](/cli/azure/servicebus/topic/subscription#az_servicebus_topic_subscription_update) command with `--forward-to` set to the name of queue or topic to which you want the messages to be forwarded.

```azurecli-interactive
az servicebus topic subscription create \
    --resource-group myresourcegroup \
    --namespace-name mynamespace \
    --topic-name mytopic \
    --name mysubscription \
    --forward-to myqueue2
```

## Using Azure PowerShell
To **create a queue with auto forwarding enabled**, use the [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-ForwardTo` set to the name of queue or topic to which you want the messages to be forwarded. 

```azurepowershell-interactive
New-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -ForwardTo myqueue2
```

To **update the auto forward setting for an existing queue**, use the [`Set-AzServiceBusQueue`](/powershell/module/az.servicebus/set-azservicebusqueue) command as shown in the following example.

```azurepowershell-interactive
$queue=Get-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue 

$queue.ForwardTo='myqueue2'

Set-AzServiceBusQueue -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -QueueName myqueue `
    -QueueObj $queue
``` 

To **create a subscription for a topic with auto forwarding enabled**, use the [`New-AzServiceBusSubscription`](/powershell/module/az.servicebus/new-azservicebussubscription) command with `-ForwardTo` set to the name of queue or topic to which you want the messages to be forwarded.

```azurepowershell-interactive
New-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -TopicName mytopic `
    -SubscriptionName mysubscription `
    -ForwardTo myqueue2
```

To **update the auto forward setting for an existing subscription**, see the following example.

```azurepowershell-interactive
$subscription=Get-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -TopicName mytopic `
    -SubscriptionName mysub

$subscription.ForwardTo='mytopic2'

Set-AzServiceBusSubscription -ResourceGroup myresourcegroup `
    -NamespaceName mynamespace `
    -Name mytopic `
    -SubscriptionName mysub `
    -SubscriptionObj $subscription 
```

## Using Azure Resource Manager template
To **create a queue with auto forwarding enabled**, set `forwardTo` in the queue properties section to the name of queue or topic to which you want the messages to be forwarded. For more information, see [Microsoft.ServiceBus namespaces/queues template reference](/azure/templates/microsoft.servicebus/namespaces/queues?tabs=json). 

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
            "forwardTo": "myqueue2"
          }
        }
      ]
    }
  ]
}

```

To **create a subscription for a topic with auto forwarding enabled**, set `forwardTo` in the queue properties section to the name of queue or topic to which you want the messages to be forwarded. For more information, see [Microsoft.ServiceBus namespaces/topics/subscriptions template reference](/azure/templates/microsoft.servicebus/namespaces/topics/subscriptions?tabs=json). 

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
                "forwardTo": "myqueue2"
              }
            }
          ]
        }
      ]
    }
  ]
}
```


## Next steps
Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for Java](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
- [Azure.Messaging.ServiceBus samples for .NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)

Find samples for the older .NET and Java client libraries below:
- [Microsoft.Azure.ServiceBus samples for .NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/)
- [azure-servicebus samples for Java](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus/MessageBrowse)