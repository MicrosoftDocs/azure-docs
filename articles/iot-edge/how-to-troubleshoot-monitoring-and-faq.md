---
title: Monitoring troubleshooting and FAQ - Azure IoT Edge
description: Troubleshooting Azure Monitor integration and FAQ
author: sethmanheim
ms.author: sethm
ms.date: 09/15/2026
ms.topic: concept-article
ms.reviewer: sonialopez
ms.service: azure-iot-edge
services: iot-edge
zone_pivot_groups: how-to-troubleshoot-monitoring-and-faq-zpg

#- id: how-to-troubleshoot-monitoring-and-faq-zpg
## Owner: veyalla
#  title: What does your question relate to?
#  prompt: What does your question relate to?
#  pivots:
#  - id: metrics-collection
#    title: Metrics collection
#  - id: custom-metrics
#    title: Custom metrics
#  - id: alerts
#    title: Alerts
#  - id: workbooks
#    title: Workbooks
---

# FAQ and troubleshooting

This article covers Metrics Collector 2.0 and the IoT Edge monitoring workbooks. For an upgrade from collector 1.x, use [Migrate the metrics collector](migrate-metrics-collector.md).

:::zone pivot="metrics-collection"

## Collector module is unable to collect metrics from built-in endpoints

### Check if modules are on the same Docker network

The metrics-collector module relies on Docker's embedded DNS resolver for user-defined networks. The DNS resolver provides the IP address for metrics endpoints that include module name. For example, *http://**edgeHub**:9600/metrics*.

When modules aren't running in the same network namespace, this mechanism will fail. For instance, some scenarios require running modules on the host network. Collection fails in such scenarios if metrics-collector module is on a different network.

### Verify that *httpSettings__enabled* environment variable isn't set to *false*

The built-in metrics endpoints exposed by IoT Edge system modules use http protocol. They won't be available, even within the module network, if http is explicitly disabled via the environment variable setting on Edge Hub or Edge Agent modules.

### Set *NO_PROXY* environment variable if using http proxy server

For more information, see [proxy considerations](how-to-collect-and-transport-metrics.md#proxy-considerations).

### Update Moby-engine

On Linux hosts, ensure you're using a recent version of the container engine. We recommend updating to the latest version by following the [installation instructions](how-to-provision-single-device-linux-symmetric.md#install-iot-edge).

## The collector can't upload metrics

Check the following configuration:

- `DataCollectionEndpoint` is the HTTPS ingestion base endpoint, not a request URL or ARM ID.
- `DataCollectionRuleId` is the DCR immutable ID.
- `DataCollectionStreamName` matches an input stream in the DCR.
- The selected identity has **Monitoring Metrics Publisher** on the DCR.
- The container can reach its ingestion and authentication endpoints.

For certificate authentication, check the path inside the container and the process user's read permission. Remove unused identity environment variables. A host Azure CLI authentication doesn't authenticate the collector.

Use [Check new ingestion](migrate-metrics-collector.md#check-new-ingestion) to check rows in the destination workspace. Don't assume that failed upload intervals are replayed after recovery.

## Some summary metrics are missing

Metrics Collector 2.0 omits `NaN` and infinity values from direct uploads. Check finite `_sum` and `_count` samples before treating an absent summary value as a collection failure.

## How do I collect logs along with metrics?

You can use [built-in log pull features](how-to-retrieve-iot-edge-logs.md).

## Why can't I see device metrics in the metrics page in Azure portal?

The use of Log Analytics as the metrics database is the reason why metrics appear in the **Logs** page in Azure portal rather than **Metrics**.

Metrics Collector 2.0 writes to the custom table configured in its DCR. Curated workbooks default to `IoTEdgeMetrics_CL`. For another table with the [collector schema](migrate-metrics-collector.md#configure-the-collector-schema), set the workbook's `MetricsTableName` parameter. Use [KQL](/kusto/query/) for queries, visualizations, and log search alerts.

## How do I configure metrics-collector in a layered deployment?

The metrics collector doesn't have any service discovery functionality. We recommend including the module in the base or *lower* deployment layer. Include all metrics endpoints that the module might be deployed with in the module's configuration. If a module doesn't appear in a final deployment but its endpoint appears in the collection list, the collector will try to collect, fail, and move on.

:::zone-end

:::zone pivot="custom-metrics"

## How do I augment the monitoring solution with custom metrics?

See the [custom metrics](how-to-add-custom-metrics.md) article.

## How can I tell which device a particular metric belongs to?

Encode device information in the metric labels. For more information, see [Naming conventions](how-to-add-custom-metrics.md#naming-conventions).

:::zone-end

:::zone pivot="alerts"

## How do I create a alert rule that spans devices from multiple IoT hubs?

Query the destination workspace and filter for all intended IoT Hub ARM IDs. Normalize both selected and stored resource IDs by using `tolower()`.

Keep the resource ID and device ID in the result grouping. Configure the alert target separately from query scope. See [Create alerts](how-to-create-alerts.md).

## Alerts aren't firing when they should

When creating an alert rule, verify the alert logic will trigger by checking the preview graph.

If you aren't able to find the problem, create a [technical support incident](https://azure.microsoft.com/support/create-ticket/) for the **Log Analytics** service.

:::zone-end

:::zone pivot="workbooks"

## My device isn't showing up in the monitoring workbook

1. Check that the destination workspace contains rows with `Origin == "iot.azm.ms"`.
1. Select that workspace in the workbook.
1. For Metrics Collector 2.0, select **New only** under **Metrics source**.
1. Set `MetricsTableName` to the destination table in the DCR. The default is `IoTEdgeMetrics_CL`.
1. Select the IoT resource identified by the module's `ResourceId` configuration.
1. Select a time range that contains uploads.

The updated gallery templates default to **New only**, which reads the new custom table and doesn't require a cutover time. Existing saved copies keep their saved settings, so select **New only** if a saved copy opens in **Legacy only**.

For **Combine legacy and new history**, enter the actual **Cutover time (UTC)**. An incorrect boundary can exclude valid rows.

For a customized workbook with this guide's pass-through schema, check workspace scope and the `Value` column mapping. Update device-selection queries and no-data checks as well as charts.

Using metrics-collector module logs, confirm that the device sent metrics during the selected time range.

Keep in mind, there can be an ingestion delay of a few minutes before metrics show up.

## One IoT resource appears in multiple groups

Legacy platform `_ResourceId` can use different casing from the configured ARM ID. New ordinary `ResourceId` preserves the case supplied in `ResourceId`.

Apply `tolower()` to the selected ID and both resource columns before filtering or grouping. Keep the existing ARM ID in the module configuration.

## Historical charts contain data, but health is Unknown

Health status depends on metric freshness as well as thresholds. A historical time range can contain samples that are too old for a current health assessment.

Check the last event time and the collector's current upload status before changing health thresholds.

## I found a bug or have a question about metrics being shown in the workbook

Open an issue on the [Azure IoT Edge GitHub repo](https://github.com/azure/iotedge/issues) with '[monitor-workbook]' in the title.

The template for the workbooks is [publicly available on GitHub](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks/IoTHub). Pull requests with improvements or fixes are very welcome!

Updates to public templates don't update customer-saved customized copies. A saved copy must separately update its table-existence gate, workspace selection, value projection, declared cutover, and ordinary `ResourceId` filter. Don't raw-union overlapping `InsightsMetrics` and custom-table history. Existing alert rules also remain unchanged.

## I cannot see the workbooks in the public templates

Ensure that you're looking at the **Workbooks** page in your IoT hub or IoT Central application page in the portal, not in your Log Analytics workspace.

If the gallery is empty, check your access to the selected IoT resource. Reopen its **Workbooks** page. To report a missing template, use the [IoT Edge issue tracker](https://github.com/Azure/iotedge/issues).

:::zone-end