---
title: Enable partitioning in Azure Service Bus Premium namespaces
description: This article explains how to enable partitioning in Azure Service Bus Premium namespaces by using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: how-to
ms.date: 10/23/2023 
ms.custom: ignite-2022, ignite-2023, devx-track-arm-template, devx-track-python, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Enable partitioning for an Azure Service Bus Premium namespace
Service Bus partitions enable queues and topics, or messaging entities, to be partitioned across multiple message brokers. Partitioning means that the overall throughput of a partitioned entity is no longer limited by the performance of a single message broker. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions. For more information, see [Partitioned queues and topics](service-bus-partitioning.md). This article shows you different ways to enable partitioning for a Service Bus Premium namespace. All entities in this namespace will be partitioned.

> [!NOTE]
> - Partitioning can be enabled during namespace creation in the Premium SKU.
> - We do not allow creating non-partitioned entities in a partitioned namespace.
> - It's not possible to change the partitioning option on any existing namespace. The number of partitions can only be set during namespace creation.
> - The assigned messaging units are always a multiplier of the amount of partitions in a namespace, and are equally distributed across the partitions. For example, in a namespace with 16MU and 4 partitions, each partition will be assigned 4MU.
> - When creating a partitioned namespace in a region [that supports Availability Zones](service-bus-outages-disasters.md#availability-zones), this will automatically enabled on the namespace.
> - Multiple partitions with lower messaging units (MU) give you a better performance over a single partition with higher MUs.
> - When using the Service Bus [Geo-disaster recovery](service-bus-geo-dr.md) feature, ensure not to pair a partitioned namespace with a non-partitioned namespace.
> - It is not possible to [migrate](service-bus-migrate-standard-premium.md) a standard SKU namespace to a Premium SKU partitioned namespace.
> - JMS is currently not supported on partitioned namespaces.
> - The feature is currently available in the regions noted below. New regions will be added regularly, we will keep this article updated with the latest regions as they become available.
> 
> |  |  |  |  |  |
> |-----------------------|----------------------|------------------|-------------------|-----------------|
> | Australia Central     | Central US           | Italy North      | Poland Central    | UK South        |
> | Australia East        | East Asia            | Japan West       | South Central US  | UK West         |
> | Australia Southeast   | East US              | Malaysia South   | South India       | West Central US |
> | Brazil Southeast      | East US 2 EUAP       | Mexico Central   | Spain Central     | West Europe     |
> | Canada Central        | France Central       | North Central US | Switzerland North | West US         |
> | Canada East           | Germany West Central | North Europe     | Switzerland West  | West US 3       |
> | Central India         | Israel Central       | Norway East      | UAE North         |                 |

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

## Use Azure Resource Manager template
To **create a namespace with partitioning enabled**, set `partitions` to a number larger than 1 in the namespace properties section. In the example below a partitioned namespace is created with 4 partitions, and 1 messaging unit assigned to each partition. For more information, see [Microsoft.ServiceBus namespaces template reference](/azure/templates/microsoft.servicebus/namespaces?tabs=json). 

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
      "apiVersion": "2022-10-01-preview",
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

## Next steps
Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
