---
title: Monitoring troubleshooting and FAQ - Azure IoT Edge
description: Troubleshooting Azure Monitor integration and FAQ
author: veyalla

ms.author: veyalla
ms.date: 06/09/2021
ms.topic: conceptual
ms.reviewer: kgremban
ms.service: iot-edge 
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

## How do I collect logs along with metrics?

You could use [built-in log pull features](how-to-retrieve-iot-edge-logs.md). A sample solution that uses the built-in log retrieval features is available at [**https://aka.ms/iot-elms**](https://aka.ms/iot-elms).

## Why can't I see device metrics in the metrics page in Azure portal?

Azure Monitor's [native metrics](../azure-monitor/essentials/data-platform-metrics.md) technology doesn't yet support Prometheus data format directly. Log-based metrics are currently better suited for IoT Edge metrics because of:

* Native support for Prometheus metrics format via the standard *InsightsMetrics* table.
* Advanced data processing via [KQL](/azure/data-explorer/kusto/query/) for visualizations and alerts.

The use of Log Analytics as the metrics database is the reason why metrics appear in the **Logs** page in Azure portal rather than **Metrics**.

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

When [creating an alert rule](how-to-create-alerts.md#create-an-alert-rule), you can [change its scope](how-to-create-alerts.md#select-alert-rule-scope) to a resource group or subscription. The alert rule will then apply to all IoT hubs in that scope.

## Alerts aren't firing when they should

When creating an alert rule, verify the alert logic will trigger by checking the preview graph.

If you aren't able to find the problem, create a [technical support incident](https://azure.microsoft.com/support/create-ticket/) for the **Log Analytics** service.

:::zone-end

:::zone pivot="workbooks"

## My device isn't showing up in the monitoring workbook

The workbook relies on device metrics being linked to the correct IoT hub or IoT Central application using *ResourceId*. Confirm that the metrics-collector is [configured](how-to-collect-and-transport-metrics.md#metrics-collector-configuration) with the correct *ResourceId*.

Using metrics-collector module logs, confirm that the device sent metrics during the selected time range.

Keep in mind, there can be an ingestion delay of a few minutes before metrics show up.

## I found a bug or have a question about metrics being shown in the workbook

Open an issue on the [Azure IoT Edge GitHub repo](https://github.com/azure/iotedge/issues) with '[monitor-workbook]' in the title.

The template for the workbooks is [publicly available on GitHub](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks/IoTHub). Pull requests with improvements or fixes are very welcome!

## I cannot see the workbooks in the public templates

Ensure that you're looking at the **Workbooks** page in your IoT hub or IoT Central application page in the portal, not in your Log Analytics workspace.

If you still can't see the workbooks, try using the pre-production Azure portal environment: [`https://portal.azure.com`](https://portal.azure.com). Sometimes workbook updates take additional time to show up in the production environment, but will be available in pre-production.

:::zone-end