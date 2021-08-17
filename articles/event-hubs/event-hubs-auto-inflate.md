---
title: Automatically scale up throughput units in Azure Event Hubs
description: Enable Auto-inflate on a namespace to automatically scale up throughput units (standard tier).
ms.topic: article
ms.date: 05/26/2021
---

# Automatically scale up Azure Event Hubs throughput units (standard tier) 
Azure Event Hubs is a highly scalable data streaming platform. As such, Event Hubs usage often increases after starting to use the service. Such usage requires increasing the predetermined [throughput units (TUs)](event-hubs-scalability.md#throughput-units) to scale Event Hubs and handle larger transfer rates. The **Auto-inflate** feature of Event Hubs automatically scales up by increasing the number of TUs, to meet usage needs. Increasing TUs prevents throttling scenarios, in which:

* Data ingress rates exceed set TUs 
* Data egress request rates exceed set TUs

The Event Hubs service increases the throughput when load increases beyond the minimum threshold, without any requests failing with ServerBusy errors.

> [!NOTE]
> To learn more about the **premium** tier, see [Event Hubs Premium](event-hubs-premium-overview.md).

## How Auto-inflate works in standard tier
Event Hubs traffic is controlled by TUs (standard tier). For the limits such as ingress and egress rates per TU, see [Event Hubs quotas and limits](event-hubs-quotas.md). Auto-inflate enables you to start small with the minimum required TUs you choose. The feature then scales automatically to the maximum limit of TUs you need, depending on the increase in your traffic. Auto-inflate provides the following benefits:

- An efficient scaling mechanism to start small and scale up as you grow.
- Automatically scale to the specified upper limit without throttling issues.
- More control over scaling, because you control when and how much to scale.

 ## Enable Auto-inflate on a namespace
You can enable or disable Auto-inflate on a standard tier Event Hubs namespace by using either [Azure portal](https://portal.azure.com) or an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-inflate).

For a premium Event Hubs namespace, the feature is automatically enabled. You can't disable it. 

> [!NOTE]
> Basic tier Event Hubs namespaces do not support Auto-inflate.

## Use Azure portal
In the Azure portal, you can enable the feature when creating a standard Event Hubs namespace or after the namespace is created. You can also set TUs for the namespace and specify maximum limit of TUs 

You can enable the Auto-inflate feature **when creating an Event Hubs namespace**. The follow image shows you how to enable the auto-inflate feature for a standard tier namespace and configure TUs to start with and the maximum number of TUs. 

:::image type="content" source="./media/event-hubs-auto-inflate/event-hubs-auto-inflate.png" alt-text="Screenshot of enabling auto inflate at the time event hub creation for a standard tier namespace":::

With this option enabled, you can start small with your TUs and scale up as your usage needs increase. The upper limit for inflation doesn't immediately affect pricing, which depends on the number of TUs used per hour.

To enable the Auto-inflate feature and modify its settings for an existing, follow these steps:

1. On the **Event Hubs Namespace** page, select **Scale** under **Settings** on the left menu.
2. In the **Scale Settings** page, select the checkbox for **Enable** (if the autoscale feature wasn't enabled).

    :::image type="content" source="./media/event-hubs-auto-inflate/scale-settings.png" alt-text="Screenshot of enabling auto-inflate for an existing standard namespace":::
3. Enter the **maximum** number of throughput units or use the scrollbar to set the value.
4. (optional) Update the **minimum** number of throughput units at the top of this page.

> [!NOTE]
> When you apply the auto-inflate configuration to increase throughput units, the Event Hubs service emits diagnostic logs that give you information about why and when the throughput increased. To enable diagnostic logging for an event hub, select **Diagnostic settings** on the left menu on the Event Hub page in the Azure portal. For more information, see [Set up diagnostic logs for an Azure event hub](monitor-event-hubs-reference.md#resource-logs).


## Use an Azure Resource Manager template

You can enable Auto-inflate during an Azure Resource Manager template deployment. For example, set the
`isAutoInflateEnabled` property to **true** and set `maximumThroughputUnits` to 10. For example:

```json
"resources": [
        {
            "apiVersion": "2017-04-01",
            "name": "[parameters('namespaceName')]",
            "type": "Microsoft.EventHub/Namespaces",
            "location": "[variables('location')]",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {
                "isAutoInflateEnabled": true,
                "maximumThroughputUnits": 10
            },
            "resources": [
                {
                    "apiVersion": "2017-04-01",
                    "name": "[parameters('eventHubName')]",
                    "type": "EventHubs",
                    "dependsOn": [
                        "[concat('Microsoft.EventHub/namespaces/', parameters('namespaceName'))]"
                    ],
                    "properties": {},
                    "resources": [
                        {
                            "apiVersion": "2017-04-01",
                            "name": "[parameters('consumerGroupName')]",
                            "type": "ConsumerGroups",
                            "dependsOn": [
                                "[parameters('eventHubName')]"
                            ],
                            "properties": {}
                        }
                    ]
                }
            ]
        }
    ]
```

For the complete template, see the [Create Event Hubs namespace and enable inflate](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-inflate) template on GitHub.


## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
