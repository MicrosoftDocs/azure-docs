---
title: Get notified about issues using alerts - Azure IoT Edge
description: Use Azure Monitor alert rules to monitor at scale
author: sethmanheim
ms.author: sethm
ms.date: 09/15/2026
ms.topic: concept-article
ms.reviewer: sonialopez
ms.service: azure-iot-edge
services: iot-edge
---

# Get notified about issues using alerts

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use [Azure Monitor Log alerts](/azure/azure-monitor/alerts/alerts-create-log-alert-rule) to monitor IoT Edge devices at scale. As highlighted in the [solution architecture](how-to-collect-and-transport-metrics.md#architecture), use Azure Monitor Log Analytics as the metrics database. Metrics Collector 2.0 uses a custom table. With this configuration, query the workspace and filter for the intended IoT Hubs.

> [!IMPORTANT]
> This feature is currently only available for IoT Hub and not for IoT Central.

## Prepare a metric query

1. Open **Logs** in the workspace that contains your custom metrics table (default `IoTEdgeMetrics_CL`).
1. Select the metric and device dimensions that your rule needs.
1. Filter ordinary `ResourceId` to the intended IoT Hub ARM IDs.
1. Apply `tolower()` to both stored IDs and selected IDs before matching or grouping.

For a complete query, see [Check custom metrics in the workspace](how-to-add-custom-metrics.md#check-custom-metrics-in-the-workspace). Replace the metric name with the built-in or custom metric that you want to monitor.

The numeric column is `Value`. To reuse legacy query calculations, project `Val = Value`. Device and module dimensions remain in the JSON-string `Tags` column.

Legacy IoT Edge example queries use `InsightsMetrics`. Update their table, resource filter, and value column before using them with Metrics Collector 2.0.

## Create an alert rule

Use [Create Azure Monitor log search alert rules](/azure/azure-monitor/alerts/alerts-create-log-alert-rule) for the rule wizard, permissions, condition configuration, and evaluation behavior.

Apply these IoT Edge choices:

| Rule configuration | IoT Edge guidance |
| --- | --- |
| Query scope | Select the Log Analytics workspace that stores the metrics. |
| Resource filter | Filter the query to the intended IoT Hub IDs. |
| Resource ID column | Return an ARM ID in `ResourceId` and select it as the target-resource column. |
| Device dimension | Extract `edge_device` from `Tags` and include it in the query's grouping. |
| Evaluation window | Include enough collection cycles for the metric and threshold. The default collection interval is five minutes. |
| Notifications | Associate an [action group](/azure/azure-monitor/alerts/action-groups) with the rule. |

These instructions use the pass-through schema in the [migration guide](migrate-metrics-collector.md#understand-resource-matching-and-query-scope). The alert target is separate from the query scope. Check that a fired alert identifies the intended IoT Hub.

### Split by device dimension

Aggregate values by device ID to determine which device caused the alert to fire. To separate devices with the same name in different hubs, preserve the resource ID in the grouping.

The IoT Edge Fleet Alerts workbook reads the first alert dimension as the device ID. Put the device dimension first. If your rule uses another order, update the extraction logic in your saved workbook.

### Choose notification preferences

Configure your notification preferences in an [action group](/azure/azure-monitor/alerts/action-groups) and associate it with an alert rule when creating an alert rule.

### Check rule behavior

1. Check the query results and threshold for representative device data.
1. Check that the rule fires under the intended condition.
1. Check the device dimension and target IoT Hub in the fired alert.
1. Check resolution and each configured notification or action.

Rule creation alone doesn't prove that the condition fires or that notifications arrive. Stateful log alerts don't resolve immediately. At a one-minute evaluation frequency, the condition must remain unmet for 10 minutes. Other frequencies use the resolution periods in [Create Azure Monitor log search alert rules](/azure/azure-monitor/alerts/alerts-create-log-alert-rule#configure-alert-rule-details). For evaluation problems, use [Troubleshoot Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-troubleshoot-log).

## Migrate existing alerts

A collector or workbook upgrade doesn't update alert rules. Review each existing rule separately.

1. Change the query scope to the destination workspace.
1. Change the table and value column to the new schema.
1. Replace the legacy `_ResourceId` filter with a case-normalized ordinary `ResourceId` filter.
1. Preserve device dimensions, thresholds, evaluation windows, and action groups.
1. Check the target-resource column and device dimension order.
1. Check firing, resolution, and delivery before retiring the legacy rule.

Avoid duplicate notifications while legacy and new rules overlap. For queries that span the transition, use the boundary in [Preserve history in custom queries](migrate-metrics-collector.md#preserve-history-in-custom-queries).

## Viewing alerts

See alerts generated for devices across multiple IoT Hubs in **Alerts** tab of the [IoT Edge fleet view workbook](how-to-explore-curated-visualizations.md#fleet-view-workbook).

Click the alert rule name to see more context about the alert. Clicking the device name link will show you the detailed metrics for the device around the time when the alert fired.

The **Alerts** view reads Azure alert records independently of metric ingestion. Select **Device Details metrics workspace** and **Device Details metrics source** for the device link. Set `MetricsTableName` to the custom table for that device, or keep the default `IoTEdgeMetrics_CL`. For combined history, enter **Device Details cutover time (UTC)**.

## Next steps

Enhance your monitoring solution with [metrics from custom modules](how-to-add-custom-metrics.md).
