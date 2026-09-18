---
title: How to add custom metrics - Azure IoT Edge
description: Augment built-in metrics with scenario-specific metrics from custom modules
author: sethmanheim
ms.author: sethm
ms.date: 09/11/2026
ms.topic: concept-article
ms.reviewer: sonialopez
ms.service: azure-iot-edge
services: iot-edge
---

# Add custom metrics

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Gather custom metrics from your IoT Edge modules in addition to the built-in metrics that the system modules provide. The [built-in metrics](how-to-access-built-in-metrics.md) provide great baseline visibility into your deployment health. However, you may require additional information from custom modules to complete the picture. Custom modules can be integrated into your monitoring solution by using the appropriate [Prometheus client library](https://prometheus.io/docs/instrumenting/clientlibs/) to emit metrics. This additional information can enable new views or alerts specialized to your requirements.

Metrics Collector 2.0 sends custom metrics to the same DCR-based table as built-in metrics. To upgrade existing collection, see [Migrate the metrics collector](migrate-metrics-collector.md).

## Sample modules repository

See the [azure-samples repo](https://github.com/Azure-Samples/iotedge-module-prom-custom-metrics) for examples of custom modules instrumented to emit metrics. Even if a sample in your language of choice isn't yet available, the general approach may help you.

## Naming conventions

Consult the [best practices](https://prometheus.io/docs/practices/naming/) from Prometheus docs for general guidance. The following additional recommendations can be helpful for IoT Edge scenarios.

* Include the module name at the beginning of metric name to make clear which module has emitted the metric.

* Include the IoT hub name or IoT Central application name, IoT Edge device ID, and module ID as labels (also called *tags*/*dimensions*) in every metric. This information is available as environment variables to every module started by the IoT Edge agent. The approach is [demonstrated](https://github.com/Azure-Samples/iotedge-module-prom-custom-metrics/blob/b6b8501adb484521b76e6f317fefee57128834a6/csharp/Program.cs#L49) by the example in samples repo. Without this context, it's impossible to associate a given metric value to a particular device.

* Include an instance ID in the labels. An instance ID can be any unique ID like a [GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) that is generated during module startup. Instance ID information can help reconcile module restarts when processing a module's metrics in the backend.

## Configure the metrics collector to collect custom metrics

Once a custom module is emitting metrics, the next step is to configure the [metrics-collector module](how-to-collect-and-transport-metrics.md#metrics-collector-module) to collect and transport custom metrics.

The environment variable `MetricsEndpointsCSV` must be updated to include the URL of the custom module's metrics endpoint. When updating the environment variable, be sure to include the system module endpoints as shown in the [metric collector configuration](how-to-collect-and-transport-metrics.md#metrics-collector-configuration) example.

>[!NOTE]
>By default, a custom module's metrics endpoint does not need to be mapped to a host port to allow the metrics collector to access it. Unless explicitly overridden, on Linux, both modules are started on a [user-defined Docker bridge network](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge) named *azure-iot-edge*.
>
>User-defined Docker networks include a default DNS resolver that allows inter-module communication using module (container) names. For example, if a custom module named *module1* is emitting metrics on http port *9600* at path */metrics*, the collector should be configured to collect from endpoint *http://module1:9600/metrics*.

Check endpoint access from the collector container network, where the custom module name resolves. Replace both module names in this command:

```bash
sudo docker exec replace-with-metrics-collector-module-name wget -q -O - http://replace-with-custom-module-name:9600/metrics
```

If your image doesn't include `wget`, use your approved container-network diagnostics process. Don't install diagnostic packages into a running production module.

## Add custom visualizations

Once you're receiving custom metrics in Log Analytics, you can create custom visualizations and alerts. The monitoring workbooks can be augmented to add query-backed visualizations.

### Check custom metrics in the workspace

Open **Logs** in the destination Log Analytics workspace. Replace the ARM ID and metric name in this query. If you use a different table name, replace `IoTEdgeMetrics_CL`.

```kusto
let SelectedResourceId = tolower("/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub");
IoTEdgeMetrics_CL
| where TimeGenerated > ago(15m) and Origin == "iot.azm.ms"
| where Name == "replace-with-custom-metric-name"
| extend ResourceId = tolower(ResourceId), Dimensions = parse_json(Tags)
| where ResourceId == SelectedResourceId
| project TimeGenerated, Name, Val = Value, Tags, Dimensions, ResourceId
| order by TimeGenerated desc
```

The query lowercases both the selected ARM ID and stored `ResourceId`. This approach avoids case-sensitive mismatches without changing the module's ARM ID.

This example uses workspace scope with the pass-through schema in the [migration guide](migrate-metrics-collector.md#understand-resource-matching-and-query-scope). Check that `Value` is numeric and `Tags` contains the expected device, module, and instance dimensions.

Once you have confirmed ingestion, you can either create a new workbook or augment an existing workbook. Use [workbooks docs](/azure/azure-monitor/visualize/workbooks-overview) and queries from the curated [IoT Edge workbooks](how-to-explore-curated-visualizations.md) as a guide.

Public template updates don't update previously saved or customized workbooks. For a cutover workbook, project `Val = Value` in new-table queries. Normalize both resource columns and the selected IDs with `tolower()`. Use a UTC boundary to select history from each table. Replace legacy-only table gates. Preserve all dimension-based series identity, event-time ordering, counter-reset handling, and histogram `_sum` and `_count` pairs. Test legacy-only, new-only, and transition behavior before replacing a saved copy.

Alert rules are separate resources. Review and test their table, workspace scope, ordinary resource filter, dimensions, thresholds, action groups, firing, resolution, and notification delivery.

When happy with the results, you can [share the workbook](/azure/azure-monitor/visualize/workbooks-overview#access-control) with your team or [deploy them programmatically](/azure/azure-monitor/visualize/workbooks-automate) as part of your organization's resource deployments.

## Next steps

Explore additional metrics visualization options with [curated workbooks](how-to-explore-curated-visualizations.md).
