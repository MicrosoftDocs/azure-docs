---
title: Enable partitioning in Azure Service Bus Premium namespaces
description: This article explains how to enable partitioning in Azure Service Bus Premium namespaces by using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 10/23/2023
ms.custom: ignite-2023, devx-track-arm-template, devx-track-python, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Enable partitioning for an Azure Service Bus Premium namespace
Service Bus partitions enable queues and topics, or messaging entities, to be partitioned across multiple message brokers. Partitioning means that the overall throughput of a partitioned entity is no longer limited by the performance of a single message broker. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions. For more information, see [Partitioned queues and topics](service-bus-partitioning.md). This article shows you different ways to enable partitioning for a Service Bus Premium namespace. All entities in this namespace are partitioned.

> [!NOTE]
> - JMS isn't currently supported on partitioned namespaces.
> - You can enable partitioning during namespace creation in the Premium tier.
> - You can't create non-partitioned entities in a partitioned namespace.
> - You can't change the partitioning option on any existing namespace. You set the number of partitions during namespace creation.
> - The number of assigned messaging units is always a multiplier of the number of partitions in a namespace, and is equally distributed across the partitions. For example, in a namespace with 16 MU and 4 partitions, each partition is assigned 4 MU.
> - Using multiple partitions with lower messaging units (MU) gives you better performance over a single partition with higher MUs.
> - When using the Service Bus [Geo-disaster recovery](service-bus-geo-dr.md) feature, don't pair a partitioned namespace with a non-partitioned namespace.
> - You can't [migrate](service-bus-migrate-standard-premium.md) a Standard tier namespace to a Premium tier partitioned namespace.
> - Batching messages with distinct SessionId or PartitionKey isn't supported on partitioned namespaces.
> - This feature is currently available in all regions except West India, Qatar Central, and Austria East.

## Use Azure portal
When creating a **namespace** in the Azure portal, set the **Partitioning** to **Enabled** and choose the number of partitions, as shown in the following image. 
:::image type="content" source="./media/enable-partitions/create-namespace.png" alt-text="Screenshot of screen where partitioning is enabled at the time of the namespace creation.":::

## Use Azure CLI
To **create a namespace with partitioning enabled**, use the [`az servicebus namespace create`](/cli/azure/servicebus/namespace#az-servicebus-namespace-create) command with `--premium-messaging-partitions` set to a number larger than 1.

```azurecli-interactive
az servicebus namespace create \
    --resource-group myresourcegroup \
    --name mynamespace \
    --location westus 
    --sku Premium
    --premium-messaging-partitions 4
```

## Use Azure PowerShell
To **create a namespace with partitioning enabled**, use the [`New-AzServiceBusNamespace`](/powershell/module/az.servicebus/new-azservicebusnamespace) command with `-PremiumMessagingPartition` set to a number larger than 1. 

```azurepowershell-interactive
New-AzServiceBusNamespace -ResourceGroupName myresourcegroup `
    -Name mynamespace `
    -Location westus `
    -PremiumMessagingPartition 4
```

## Use a template
To **create a namespace with partitioning enabled**, set `premiumMessagingPartitions` to a number larger than 1 in the namespace properties section. In the following example, a partitioned namespace is created with 4 partitions, and 1 messaging unit assigned to each partition. For more information, see [Microsoft.ServiceBus namespaces template reference](/azure/templates/microsoft.servicebus/namespaces?tabs=json). 

# [Bicep](#tab/bicep)

```bicep
@description('Name of the Service Bus namespace')
param serviceBusNamespaceName string

@description('Location for all resources.')
param location string = resourceGroup().location

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: serviceBusNamespaceName
  location: location
  sku: {
    name: 'Premium'
    capacity: 4
  }
  properties: {
    premiumMessagingPartitions: 4
  }
}
```

# [ARM template](#tab/arm)

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
      "apiVersion": "2024-01-01",
      "name": "[parameters('serviceBusNamespaceName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Premium",
        "capacity": 4
      },
      "properties": {
        "premiumMessagingPartitions": 4
      }
    }
  ]
}
```

---

## Next steps
Explore Azure Service Bus features by using the samples in the language of your choice. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
