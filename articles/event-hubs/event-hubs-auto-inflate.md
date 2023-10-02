---
title: Automatically scale up throughput units in Azure Event Hubs
description: Enable Auto-inflate on a namespace to automatically scale up throughput units (standard tier).
ms.topic: article
ms.custom: devx-track-arm-template
ms.date: 07/28/2023
---

# Automatically scale up Azure Event Hubs throughput units (standard tier) 

When you create a standard tier Event Hubs namespace, you specify the number of [throughput units (TUs)](event-hubs-scalability.md#throughput-units). These TUs may not be enough when the usage goes up later. When that happens, you could manually increase the number of TUs assigned to the namespace. However, it's better to have Event Hubs automatically increase (inflate) TUs based on the workload. 

The **Auto-inflate** feature of Event Hubs automatically scales up by increasing the number of TUs, to meet usage needs. Increasing TUs prevents throttling scenarios where data ingress or data egress rates exceed the rates allowed by the TUs assigned to the namespace. The Event Hubs service increases the throughput when load increases beyond the minimum threshold, without any requests failing with ServerBusy errors.

> [!NOTE]
> The auto-inflate feature is currently supported only in the standard tier. 

## How Auto-inflate works in standard tier

Event Hubs traffic is controlled by TUs (standard tier). For the limits such as ingress and egress rates per TU, see [Event Hubs quotas and limits](event-hubs-quotas.md). Auto-inflate enables you to start small with the minimum required TUs you choose. The feature then scales automatically to the maximum limit of TUs you need, depending on the increase in your traffic. Auto-inflate provides the following benefits:

- An efficient scaling mechanism to start small and scale up as you grow.
- Automatically scale to the specified upper limit without throttling issues.
- More control over scaling, because you control when and how much to scale.

> [!NOTE]
> Auto-inflate doesn't **automatically scale down** the number of TUs when ingress or egress rates drop below the limits. 

 ## Enable Auto-inflate on a namespace

You can enable or disable Auto-inflate on a standard tier Event Hubs namespace by using either [Azure portal](https://portal.azure.com) or an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-inflate).

## Use Azure portal

In the Azure portal, you can enable the feature when creating a standard Event Hubs namespace or after the namespace is created. You can also set TUs for the namespace and specify maximum limit of TUs 

You can enable the Auto-inflate feature **when creating an Event Hubs namespace**. The following image shows you how to enable the auto-inflate feature for a standard tier namespace and configure TUs to start with and the maximum number of TUs. 

:::image type="content" source="./media/event-hubs-auto-inflate/event-hubs-auto-inflate.png" alt-text="Screenshot of enabling auto inflate at the time event hub creation for a standard tier namespace.":::

With this option enabled, you can start small with your TUs and scale up as your usage needs increase. The upper limit for inflation doesn't immediately affect pricing, which depends on the number of TUs used per hour.

To enable the Auto-inflate feature and modify its settings for an existing namespace, follow these steps:

1. On the **Event Hubs Namespace** page, select **Scale** under **Settings** on the left menu.
2. In the **Scale Settings** page, select the checkbox for **Enable** (if the autoscale feature wasn't enabled).

    :::image type="content" source="./media/event-hubs-auto-inflate/scale-settings.png" alt-text="Screenshot of enabling auto-inflate for an existing standard namespace":::
3. Enter the **maximum** number of throughput units or use the scrollbar to set the value.
4. (optional) Update the **minimum** number of throughput units at the top of this page.

> [!NOTE]
> When you apply the auto-inflate configuration to increase throughput units, the Event Hubs service emits diagnostic logs that give you information about why and when the throughput increased. To enable diagnostic logging for an event hub, select **Diagnostic settings** on the left menu on the Event Hub page in the Azure portal. For more information, see [Set up diagnostic logs for an Azure event hub](monitor-event-hubs-reference.md#resource-logs).


## Use an Azure Resource Manager template

You can enable the Auto-inflate feature during an Azure Resource Manager template deployment. For example, set the
`isAutoInflateEnabled` property to **true** and set `maximumThroughputUnits` to 10. For example:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaceName": {
            "defaultValue": "fabrikamehubns",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.EventHub/namespaces",
            "apiVersion": "2022-10-01-preview",
            "name": "[parameters('namespaceName')]",
            "location": "East US",
            "sku": {
                "name": "Standard",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "minimumTlsVersion": "1.2",
                "publicNetworkAccess": "Enabled",
                "disableLocalAuth": false,
                "zoneRedundant": true,
                "isAutoInflateEnabled": true,
                "maximumThroughputUnits": 10,
                "kafkaEnabled": true
            }
        }
	]
}
```

For the complete template, see the [Create Event Hubs namespace and enable inflate](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-inflate) template on GitHub.


## Next steps

To learn more about Event Hubs, see [Event Hubs overview](./event-hubs-about.md)
