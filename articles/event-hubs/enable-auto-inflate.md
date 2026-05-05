---
title: Enable Auto inflate for an Event Hubs namespace
description: Learn how to enable the Auto inflate feature for an Azure Event Hubs namespace using the Azure portal or an Azure Resource Manager template.
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 05/04/2026
#customer intent: As an administrator or developer, I want to enable Auto inflate on my Event Hubs namespace so that throughput units scale automatically based on my workload.
---

# Enable Auto inflate for an Event Hubs namespace

The Auto inflate feature automatically scales throughput units (TUs) for your Event Hubs namespace based on traffic demand. This article shows you how to enable Auto inflate using the Azure portal or an Azure Resource Manager (ARM) template.

For information about how Auto inflate works, see [Auto inflate in Azure Event Hubs](event-hubs-auto-inflate.md).

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- A standard tier Event Hubs namespace (Auto inflate isn't supported in the basic tier).

## Enable Auto inflate using the Azure portal

You can enable Auto inflate when you create a namespace or on an existing namespace.

### Enable Auto inflate during namespace creation

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Integration** > **Event Hubs**.
1. On the **Create Namespace** page, enter the namespace details and select **Standard** for the pricing tier.
1. Under **Throughput units**, select the **Enable** checkbox for Auto inflate.
1. Set the initial number of throughput units and the maximum limit.

    :::image type="content" source="./media/event-hubs-auto-inflate/event-hubs-auto-inflate.png" alt-text="Screenshot of enabling Auto inflate at the time event hub creation for a standard tier namespace.":::

1. Select **Review + create**, and then select **Create**.

### Enable Auto inflate on an existing namespace

1. In the [Azure portal](https://portal.azure.com), go to your Event Hubs namespace.
1. Under **Settings** in the left menu, select **Scale**.
1. In the **Scale Settings** page, select the **Enable** checkbox (if Auto inflate isn't already enabled).

    :::image type="content" source="./media/event-hubs-auto-inflate/scale-settings.png" alt-text="Screenshot of enabling Auto inflate for an existing standard namespace.":::

1. Enter the **maximum** number of throughput units or use the scrollbar to set the value.
1. (Optional) Update the **minimum** number of throughput units at the top of this page.
1. Select **Save**.

> [!NOTE]
> When you apply the Auto inflate configuration, the Event Hubs service emits diagnostic logs that provide information about why and when the throughput increased. To enable diagnostic logging, select **Diagnostic settings** in the left menu of the Event Hub page. For more information, see [Set up diagnostic logs for an Azure event hub](monitor-event-hubs-reference.md#resource-logs).

## Enable Auto inflate using an ARM template

You can enable Auto inflate during an ARM template deployment by setting the `isAutoInflateEnabled` property to `true` and specifying the `maximumThroughputUnits` value.

The following example template creates a standard tier namespace with Auto inflate enabled and a maximum of 10 throughput units:

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

## Related content

- [Auto inflate in Azure Event Hubs](event-hubs-auto-inflate.md)
- [Event Hubs quotas and limits](event-hubs-quotas.md)
- [Event Hubs overview](event-hubs-about.md)
