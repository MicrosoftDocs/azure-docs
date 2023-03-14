---
title: Get notified about issues using alerts - Azure IoT Edge
description: Use Azure Monitor alert rules to monitor at scale
author: veyalla

ms.author: veyalla
ms.date: 06/08/2021
ms.topic: conceptual
ms.reviewer: kgremban
ms.service: iot-edge 
services: iot-edge
---

# Get notified about issues using alerts

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use [Azure Monitor Log alerts](../azure-monitor/alerts/alerts-unified-log.md) to monitor IoT Edge devices at scale. As highlighted in the [solution architecture](how-to-collect-and-transport-metrics.md#architecture), Azure Monitor Log Analytics is used as the metrics database. This integration unlocks powerful and flexible alerting capabilities using resource-centric log alerts.

> [!IMPORTANT]
> This feature is currently only available for IoT Hub and not for IoT Central.

## Create an alert rule

You can [create a log alert rule](../azure-monitor/alerts/alerts-log.md) for monitoring a broad range of conditions across your device fleet.

Sample [KQL](/azure/data-explorer/kusto/query/) alert queries are provided under the IoT Hub resource. Queries that operate on metrics data from edge devices are prefixed with *IoT Edge:* in their title. Use these examples as-is or modify them as needed to create a query for your exact need.

To access the example alert queries, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **Logs** from the **Monitoring** section of the menu.
1. The **Queries** example query browser will automatically open. If this is your first time to **Logs** you may have to close a video tutorial before you can see the query browser. The **Queries** tab can be used to bring up the example query browser again if you don't see it.

:::image type="content" source="./media/how-to-create-alerts/example-alerts.png" alt-text="Screenshot of how to access the example alert queries." lightbox="./media/how-to-create-alerts/example-alerts.png":::

The [metrics-collector module](how-to-collect-and-transport-metrics.md#metrics-collector-module) ingests all data into the standard [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table. You can create alert rules based on metrics data from custom modules by querying the same table.

### Split by device dimension

All the example alert rule queries aggregate values by device ID. This grouping is needed to determine which device caused the alert to fire. You can select specific devices to enable the alert rule on or enable on all devices. Use the preview graph to explore the trend per device before setting the alert logic.

### Choose notification preferences

Configure your notification preferences in an [action group](../azure-monitor/alerts/action-groups.md) and associate it with an alert rule when creating an alert rule.

## Select alert rule scope

Using the guidance in the previous section creates an alert rule scoped to a single IoT hub. However, you might want to create the same rule for multiple IoT hubs. Change the scope to a resource group or an entire subscription to enable the alert rule on all hubs within that scope.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **Logs** from the **Monitoring** section of the menu.
1. Select **Select scope** to change the scope of an alert rule.

:::image type="content" source="./media/how-to-create-alerts/change-scope.png" alt-text="Change alerts scope" lightbox="./media/how-to-create-alerts/change-scope.png":::

Aggregate values by the `_ResourceId` field and choose it as the *Resource ID column* when creating the alert rule. This approach will associate an alert with the correct resource for convenience.

## Viewing alerts

See alerts generated for devices across multiple IoT Hubs in **Alerts** tab of the [IoT Edge fleet view workbook](how-to-explore-curated-visualizations.md#fleet-view-workbook).

Click the alert rule name to see more context about the alert. Clicking the device name link will show you the detailed metrics for the device around the time when the alert fired.

## Next steps

Enhance your monitoring solution with [metrics from custom modules](how-to-add-custom-metrics.md).
