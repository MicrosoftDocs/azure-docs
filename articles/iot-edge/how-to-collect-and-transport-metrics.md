---
title: Collect and transport Azure IoT Edge metrics
description: Use Azure Monitor to remotely monitor IoT Edge's built-in metrics. Learn how to add and configure the metrics-collector module to send metrics to Azure Monitor.
author: sethmanheim
ms.author: sethm
ms.date: 09/15/2026
ms.topic: concept-article
ms.reviewer: veyalla
ms.service: azure-iot-edge
services: iot-edge
ms.custom: sfi-image-nochange
---

# Collect and transport metrics

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

You can remotely monitor your IoT Edge fleet by using Azure Monitor and built-in metrics integration. To enable this capability on your device, add the metrics-collector module to your deployment and configure it to collect and transport module metrics to Azure Monitor.

Metrics Collector 2.0 sends direct uploads to a Log Analytics custom table by using a DCR and Microsoft Entra authentication. To upgrade from workspace-key authentication, see [Migrate the metrics collector](migrate-metrics-collector.md).

To configure monitoring on your IoT Edge device, follow the [tutorial for monitoring IoT Edge devices](tutorial-monitor-with-workbooks.md). You learn how to add the metrics-collector module to your device. This article gives you an overview of the monitoring architecture and explains your options for configuring metrics on your device.

> [!VIDEO https://aka.ms/docs/player?id=94a7d988-4a35-4590-9dd8-a511cdd68bee]

<a href="https://aka.ms/docs/player?id=94a7d988-4a35-4590-9dd8-a511cdd68bee" target="_blank">Azure Monitor for IoT Edge</a>(4:06)

## Architecture

# [IoT Hub](#tab/iothub)

:::image type="content" source="./media/how-to-collect-and-transport-metrics/arch.png" alt-text="Screenshot of the metrics monitoring architecture with IoT Hub." lightbox="./media/how-to-collect-and-transport-metrics/arch.png":::

| Note | Description |
|-|-|
|  1 | All modules must emit metrics by using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). While [built-in metrics](how-to-access-built-in-metrics.md) enable broad workload visibility by default, custom modules can also emit scenario-specific metrics to enhance the monitoring solution. Learn how to instrument custom modules by using open-source libraries in the [Add custom metrics](how-to-add-custom-metrics.md) article. |
|  2️ | The [metrics-collector module](https://aka.ms/edgemon-metrics-collector) is a Microsoft-supplied IoT Edge module that collects workload module metrics and transports them off-device. Metrics collection uses a *pull* model. You can configure collection frequency, endpoints, and filters to control the data egressed from the module. For more information, see the [Metrics collector configuration](#metrics-collector-configuration) section in this article. |
|  3️ | **Option 1** sends metrics directly to a Log Analytics custom table.<sup>1</sup> Configure a DCR and Microsoft Entra identity. |
|  4️ | `ResourceId` identifies the IoT hub. The collector stores this value in ordinary `ResourceId`. The workbooks query the workspace and filter this column for the intended resources. |
|  5️ | *Option 2* sends the metrics to IoT Hub.<sup>1</sup> You can configure the collector module to send the collected metrics as UTF-8 encoded JSON [device-to-cloud messages](../iot-hub/iot-hub-devguide-messages-d2c.md) via the `edgeHub` module. This option unlocks monitoring of locked-down IoT Edge devices that are allowed external access to only the  IoT Hub endpoint. It also enables monitoring of child IoT Edge devices in a nested configuration where child devices can only access their parent device. |
|  6️ | When metrics are routed via IoT Hub, a (one-time) cloud workflow needs to be set up. The workflow processes messages arriving from the metrics-collector module and sends them to the Log Analytics workspace. The workflow enables the [curated visualizations](how-to-explore-curated-visualizations.md) and [alerts](how-to-create-alerts.md) functionality even for metrics arriving via this optional path. For more information about how to set up this cloud workflow, see the [Route metrics](#route-metrics) section in this article. |

<sup>1</sup> Currently, using **option 1** to directly transport metrics to Log Analytics from the IoT Edge device is the simpler path that requires minimal setup. The first option is preferred unless your specific scenario demands the **option 2** approach so that the IoT Edge device communicates only with IoT Hub.

# [IoT Central](#tab/iotcentral)

:::image type="content" source="./media/how-to-collect-and-transport-metrics/arch-iot-central.png" alt-text="Screenshot of metrics monitoring architecture with IoT Central." lightbox="./media/how-to-collect-and-transport-metrics/arch-iot-central.png":::

| Note | Description |
|-|-|
|  1 | All modules must emit metrics by using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). While [built-in metrics](how-to-access-built-in-metrics.md) enable broad workload visibility by default, custom modules can also emit scenario-specific metrics to enhance the monitoring solution. Learn how to instrument custom modules by using open-source libraries in the [Add custom metrics](how-to-add-custom-metrics.md) article. |
|  2️ | The [metrics-collector module](https://aka.ms/edgemon-metrics-collector) is a Microsoft-supplied IoT Edge module that collects workload module metrics and transports them off-device. Metrics collection uses a *pull* model. You can configure collection frequency, endpoints, and filters to control the data egressed from the module. For more information, see the [Metrics collector configuration](#metrics-collector-configuration) section in this article. |
|  3️ | **Option 1** sends metrics directly to a Log Analytics custom table. Configure a DCR and Microsoft Entra identity. |
|  4️ | `ResourceId` identifies the IoT Central application. The collector stores this value in ordinary `ResourceId`. The workbooks query the workspace and filter this column for the intended resources. |
|  5️ | *Option 2* sends the metrics to IoT Central. This option lets an operator view the metrics and device telemetry in a single location. You can configure the collector module to send the collected metrics as UTF-8 encoded JSON [device-to-cloud messages](../iot-hub/iot-hub-devguide-messages-d2c.md) via the `edgeHub` module. This option unlocks monitoring of locked-down IoT Edge devices that are allowed external access to only the IoT Central endpoint. It also enables monitoring of child IoT Edge devices in a nested configuration where child devices can only access their parent device. |

---

## Metrics collector module

You can add a Microsoft-supplied metrics-collector module to an IoT Edge deployment to collect module metrics and send them to Azure Monitor. The module code is open source and available in the [IoT Edge GitHub repo](https://github.com/Azure/iotedge/tree/main/edge-modules/metrics-collector).

Use the image `mcr.microsoft.com/azureiotedge-metrics-collector:2.0.0`. For available image tags and architectures, see [Microsoft Artifact Registry](https://mcr.microsoft.com/artifact/mar/azureiotedge-metrics-collector/tags).

## Transport options

| `UploadTarget` | Destination | Requirements |
| --- | --- | --- |
| `AzureMonitor` (default) | Log Analytics custom table | DCR, HTTPS ingestion endpoint, custom table, and Microsoft Entra identity. |
| `IotMessage` | IoT Hub or IoT Central through edgeHub | An edgeHub route for `metricOutput`. Forwarding to Log Analytics requires a separate cloud workflow. |

An upgrade doesn't migrate existing history, saved workbooks, or alert rules. To upgrade, see [Migrate the metrics collector](migrate-metrics-collector.md).

## Metrics collector configuration

Configure Metrics Collector 2.0 by using environment variables. At a minimum, specify the variables marked as **Required** in this table.

# [IoT Hub](#tab/iothub)

| Environment variable name | Description |
|-|-|
| `ResourceId` | Resource ID of the IoT hub that the device communicates with. For more information, see [Resource ID](#resource-id).  <br><br>  **Required** <br><br> Default value: **none** |
| `UploadTarget` |  Controls whether metrics are sent directly to Azure Monitor over HTTPS or to IoT Hub as D2C messages. For more information, see [Upload target](#upload-target). <br><br>Can be either **AzureMonitor** or **IoTMessage**  <br><br>  Not required <br><br> Default value: **AzureMonitor** |
| `DataCollectionEndpoint` | HTTPS logs-ingestion base endpoint from the DCR or DCE. Required for **AzureMonitor**. Default value: **none** |
| `DataCollectionRuleId` | DCR immutable ID, starting with `dcr-`, not its name or ARM ID. Required for **AzureMonitor**. Default value: **none** |
| `DataCollectionStreamName` | Exact DCR input-stream name, not the destination table name. Required for **AzureMonitor**. Default value: **none** |
| `ScrapeFrequencyInSecs` | Recurring time interval in seconds in which to collect and transport metrics.<br><br>  Example: **600** <br><br> Not required <br><br> Default value: **300** |
| `MetricsEndpointsCSV` | Comma-separated list (without spaces) of endpoints to collect Prometheus metrics from. All module endpoints to collect metrics from must appear in this list.<br><br>  Example: **http://edgeAgent:9600/metrics,http://edgeHub:9600/metrics,http://MetricsSpewer:9417/metrics** <br><br>  Not required <br><br> Default value: **http://edgeHub:9600/metrics,http://edgeAgent:9600/metrics** |
| `AllowedMetrics` | List of metrics to collect, all other metrics are ignored. Set to an empty string to disable. For more information, see [Allow and block lists](#allow-and-block-lists). <br><br>Example: **metricToScrape{quantile="0.99"}[http://MetricsSpewer:9417/metrics]**<br><br> Not required <br><br> Default value: **empty** |
| `BlockedMetrics` | List of metrics to ignore. Overrides **AllowedMetrics**, so a metric isn't reported if it's included in both lists. For more information, see [Allow and block lists](#allow-and-block-lists). <br><br>   Example: **metricToIgnore{quantile="0.5"}[http://VeryNoisyModule:9001/metrics], docker_container_disk_write_bytes**<br><br>  Not required  <br><br>Default value: **empty** |
| `CompressForUpload` | Controls compression for **IotMessage**. The Logs Ingestion SDK manages direct-upload compression independently.<br><br>  Example: **true** <br><br>  Not required <br><br>  Default value: **true** |
| `AzureDomain` | Selects the authentication authority and ingestion audience: `azure.com`, `azure.us`, or `azure.cn` (`azure.com.cn` is also accepted). The ingestion endpoint must match this cloud. <br><br>  Example: **azure.us** <br><br> Not required <br><br>  Default value: **azure.com** |

# [IoT Central](#tab/iotcentral)

| Environment variable name | Description |
|-|-|
| `ResourceId` | Resource ID of the IoT Central application that the device communicates with. For more information, see [Resource ID](#resource-id).  <br><br>  **Required** <br><br> Default value: **none** |
| `UploadTarget` |  Controls whether metrics are sent directly to Azure Monitor over HTTPS or to IoT Central as D2C messages. For more information, see [Upload target](#upload-target). <br><br>Can be either **AzureMonitor** or **IoTMessage**  <br><br>  Not required <br><br> Default value: **AzureMonitor** |
| `DataCollectionEndpoint` | HTTPS logs-ingestion base endpoint from the DCR or DCE. Required for **AzureMonitor**. Default value: **none** |
| `DataCollectionRuleId` | DCR immutable ID, starting with `dcr-`, not its name or ARM ID. Required for **AzureMonitor**. Default value: **none** |
| `DataCollectionStreamName` | Exact DCR input-stream name, not the destination table name. Required for **AzureMonitor**. Default value: **none** |
| `ScrapeFrequencyInSecs` | Recurring time interval in seconds in which to collect and transport metrics.<br><br>  Example: **600** <br><br>  Not required <br><br> Default value: **300** |
| `MetricsEndpointsCSV` | Comma-separated list (without spaces) of endpoints to collect Prometheus metrics from. All module endpoints to collect metrics from must appear in this list.<br><br>  Example: **http://edgeAgent:9600/metrics,http://edgeHub:9600/metrics,http://MetricsSpewer:9417/metrics** <br><br>  Not required <br><br> Default value: **http://edgeHub:9600/metrics,http://edgeAgent:9600/metrics** |
| `AllowedMetrics` | List of metrics to collect, all other metrics are ignored. Set to an empty string to disable. For more information, see [Allow and block lists](#allow-and-block-lists). <br><br>Example: **metricToScrape{quantile="0.99"}[http://MetricsSpewer:9417/metrics]** <br><br> Not required <br><br> Default value: **empty** |
| `BlockedMetrics` | List of metrics to ignore. Overrides **AllowedMetrics**, so a metric isn't reported if it's included in both lists. For more information, see [Allow and block lists](#allow-and-block-lists). <br><br>   Example: **metricToIgnore{quantile="0.5"}[http://VeryNoisyModule:9001/metrics], docker_container_disk_write_bytes** <br><br>  Not required  <br><br>Default value: **empty** |
| `CompressForUpload` | Controls compression for **IotMessage**. The Logs Ingestion SDK manages direct-upload compression independently.<br><br>  Example: **true** <br><br>  Not required <br><br>  Default value: **true** |
| `AzureDomain` | Selects the authentication authority and ingestion audience: `azure.com`, `azure.us`, or `azure.cn` (`azure.com.cn` is also accepted). The ingestion endpoint must match this cloud. <br><br>  Example: **azure.us** <br><br> Not required <br><br>  Default value: **azure.com** |

For more information about IoT Edge and IoT Central, see [Connect Azure IoT Edge devices to an Azure IoT Central application](../iot-central/core/concepts-iot-edge.md).

---

`ScrapeFrequencyInSecs` must be at least `1`. `TransformForIoTCentral` defaults to `false` and applies only to `IotMessage`. `IotHubConnectFrequency` defaults to one day (`1.00:00:00`).

For `AzureMonitor`, the endpoint must match the selected cloud. `LogAnalyticsWorkspaceId` and `LogAnalyticsSharedKey` aren't used by Metrics Collector 2.0.

### Authentication and table configuration

Use [Configure authentication](migrate-metrics-collector.md#configure-authentication) to choose a certificate, managed identity, or federated identity. The identity needs **Monitoring Metrics Publisher** on the DCR.

The collector tries environment credentials, workload identity, and managed identity in that order. It doesn't use developer sign-ins on the host.

Use [Configure the collector schema](migrate-metrics-collector.md#configure-the-collector-schema) for the seven input-stream and table columns. Curated workbooks default to `IoTEdgeMetrics_CL`, with numeric `Value`, JSON-string `Tags`, and ordinary `ResourceId`. For another table with the same schema, set the workbook's `MetricsTableName` parameter.

For generic table, DCR, endpoint, and permission setup, use the [Logs Ingestion portal tutorial](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal).

### Resource ID

# [IoT Hub](#tab/iothub)

The metrics-collector module needs the Azure Resource Manager ID of the IoT hub that the IoT Edge device belongs to. Enter this ID as the value for the **ResourceId** environment variable. The collector stores it in the ordinary `ResourceId` column, preserving its case. Query the workspace and apply `tolower()` to both the stored and selected IDs before matching. This guide uses the pass-through schema described in [Resource matching and query scope](migrate-metrics-collector.md#understand-resource-matching-and-query-scope).

The resource ID uses the following format: `/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Devices/IoTHubs/<iot hub name>`. You can find the resource ID in the **Properties** page of the IoT hub in the Azure portal.

:::image type="content" source="./media/how-to-collect-and-transport-metrics/hub-id.png" alt-text="Screenshot the shows how to retrieve your resource ID from the IoT Hub properties." lightbox="./media/how-to-collect-and-transport-metrics/hub-id.png":::

Or, you can use the [az resource show](/cli/azure/resource#az-resource-show) command to get the ID:

```azurecli
az resource show -g <resource group> -n <hub name> --resource-type "Microsoft.Devices/IoTHubs"
```

# [IoT Central](#tab/iotcentral)

The metrics-collector module needs the Azure Resource Manager ID of the IoT Central application that the IoT Edge device belongs to. Enter this ID as the value for the **ResourceId** environment variable. The collector stores it in the ordinary `ResourceId` column, preserving its case. Query the workspace and apply `tolower()` to both the stored and selected IDs before matching. This guide uses the pass-through schema described in [Resource matching and query scope](migrate-metrics-collector.md#understand-resource-matching-and-query-scope).

The resource ID uses the following format: `/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.IoTCentral/IoTApps/<iot central app name>`. You can find the resource ID in the **Properties** page of the IoT Central application in the Azure portal.

:::image type="content" source="./media/how-to-collect-and-transport-metrics/resource-id-iot-central.png" alt-text="Retrieve resource ID from the IoT Central properties.":::

Or, you can use the [az resource show](/cli/azure/resource#az-resource-show) command to get the ID:

```azurecli
az resource show -g <resource group> -n <application name> --resource-type "Microsoft.IoTCentral/IoTApps"
```

---

### Upload target

# [IoT Hub](#tab/iothub)

The **UploadTarget** configuration option controls whether metrics are sent directly to Azure Monitor or to IoT Hub.

If you set **UploadTarget** to **IotMessage**, the module publishes your metrics as IoT messages. The endpoint `/messages/modules/<metrics collector module name>/outputs/metricOutput` emits these messages as UTF8-encoded JSON. For example, if your IoT Edge Metrics Collector module is named **IoTEdgeMetricsCollector**, the endpoint is `/messages/modules/IoTEdgeMetricsCollector/outputs/metricOutput`. The uncompressed message format is as follows:

```json
[{
    "TimeGeneratedUtc": "<time generated>",
    "Name": "<prometheus metric name>",
    "Value": 1.0,
    "Labels": {
        "<label name>": "<label value>"
    }
}, {
    "TimeGeneratedUtc": "2020-07-28T20:00:43.2770247Z",
    "Name": "docker_container_disk_write_bytes",
    "Value": 0.0,
    "Labels": {
        "name": "AzureMonitorForIotEdgeModule"
    }
}]
```

# [IoT Central](#tab/iotcentral)

The **UploadTarget** configuration option controls whether metrics are sent directly to Azure Monitor or to IoT Central.

If you set **UploadTarget** to **IotMessage**, the module publishes your metrics as IoT messages. The endpoint `/messages/modules/<metrics collector module name>/outputs/metricOutput` emits these messages as UTF8-encoded JSON. For example, if your IoT Edge Metrics Collector module is named **IoTEdgeMetricsCollector**, the endpoint is `/messages/modules/IoTEdgeMetricsCollector/outputs/metricOutput`. The uncompressed message format is as follows:

```json
[{
    "TimeGeneratedUtc": "<time generated>",
    "Name": "<prometheus metric name>",
    "Value": 1.0,
    "Labels": {
        "<label name>": "<label value>"
    }
}, {
    "TimeGeneratedUtc": "2020-07-28T20:00:43.2770247Z",
    "Name": "docker_container_disk_write_bytes",
    "Value": 0.0,
    "Labels": {
        "name": "AzureMonitorForIotEdgeModule"
    }
}]
```

---

### Allow and block lists

The `AllowedMetrics` and `BlockedMetrics` configuration options accept space- or comma-separated lists of metric selectors. A metric matches the list and is included or excluded if it matches one or more metrics in either list.

Metric selectors use a format similar to a subset of the [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) query language.

```bash
metricToSelect{quantile="0.5",otherLabel=~"(Re[ge]*|x)"}[http://VeryNoisyModule:9001/metrics]
```

Metric selectors consist of three parts:

Metric name (`metricToSelect`).

* You can use wildcards `*` (any characters) and `?` (any single character) in metric names. For example, `*CPU` matches `maxCPU` and `minCPU` but not `CPUMaximum`. `???CPU` matches `maxCPU` and `minCPU` but not `maximumCPU`.
* This component is required in a metrics selector.

Label-based selectors (`{quantile="0.5",otherLabel=~"(Re[ge]*|x)"}`).

* Include multiple metric values in the curly brackets. Separate the label expressions with commas and enclose each value in double quotes.
* A metric is matched if at least all labels in the selector are present and also match.
* Like PromQL, the following matching operators are allowed.
  * `=` Match labels exactly equal to the provided string (case sensitive).
  * `!=` Match labels not exactly equal to the provided string.
  * `=~` Match labels to a provided regex. ex: `label=~"(CPU|Mem|[0-9]*)"`
  * `!~` Match labels that don't fit a provided regex.
  * The collector adds `^` and `$` to the regex. Group alternatives in parentheses to match the entire value.
  * This component is optional in a metrics selector.

Endpoint selector (`[http://VeryNoisyModule:9001/metrics]`).

* The URL should exactly match a URL listed in `MetricsEndpointsCSV`.
* This component is optional in a metrics selector.

A metric must match all parts of a given selector to be selected. It must match the name and have all the same labels with matching values and come from the given endpoint. For example, `mem{quantile="0.5",otherLabel="foobar"}[http://VeryNoisyModule:9001/metrics]` doesn't match the selector `mem{quantile="0.5",otherLabel=~"foo"}[http://VeryNoisyModule:9001/metrics]`. Use multiple selectors to create OR-like behavior instead of AND-like behavior.

For example, to allow the custom metric `mem` with any label from a module `module1` but only allow the same metric from `module2` with the label `agg=p99`, add the following selector to `AllowedMetrics`:

```bash
mem{}[http://module1:9001/metrics] mem{agg="p99"}[http://module2:9001/metrics]
```

Or, to allow the custom metrics `mem` and `cpu` for any labels or endpoint, add the following to `AllowedMetrics`:

```bash
mem cpu
```

## Enable in restricted network access scenarios

For direct upload, allow outbound HTTPS access to the configured logs-ingestion endpoint. Allow the identity endpoints required by your authentication method.

Use [Azure Monitor endpoint guidance](/azure/azure-monitor/logs/logs-ingestion-api-overview#endpoint) for DCR, DCE, and private network requirements. The legacy workspace `ods.opinsights` and `oms.opinsights` endpoints don't replace these requirements.

### Proxy considerations

The metrics-collector module is written in .NET Core. Use the same guidance as for system modules to [allow communication through a proxy server](how-to-configure-proxy-support.md#configure-deployment-manifests).

Metrics collection from local modules uses the `http` protocol. Exclude local communication from going through the proxy server by setting the `NO_PROXY` environment variable. Set `NO_PROXY` value to a comma-separated list of hostnames that should be excluded. Use module names for hostnames. For example: **edgeHub,edgeAgent,myCustomModule**.

## Route metrics

# [IoT Hub](#tab/iothub)

Sometimes you need to ingest metrics through IoT Hub instead of sending them directly to Log Analytics. For example, when monitoring [IoT Edge devices in a nested configuration](tutorial-nested-iot-edge.md) where child devices have access only to the IoT Edge hub of their parent device. Another example is deploying an IoT Edge device with outbound network access only to IoT Hub.

To enable monitoring in this scenario, configure the metrics-collector module to send metrics as device-to-cloud (D2C) messages via the edgeHub module. Turn on the capability by setting the `UploadTarget` environment variable to `IotMessage` in the collector [configuration](#metrics-collector-configuration).

> [!TIP]
> Remember to add an edgeHub route to deliver metrics messages from the collector module to IoT Hub. The route looks like `FROM /messages/modules/replace-with-collector-module-name/* INTO $upstream`.

This option requires extra setup, a cloud workflow setup, to deliver metrics messages arriving at IoT Hub to the Log Analytics workspace. Without this setup, the other portions of the integration such as [curated visualizations](how-to-explore-curated-visualizations.md) and [alerts](how-to-create-alerts.md) don't work.

> [!NOTE]
> Be aware of extra costs with this option. Metrics messages count against your IoT Hub message quota. You're also charged for Log Analytics ingestion and cloud workflow resources.

# [IoT Central](#tab/iotcentral)

Sometimes, you need to ingest metrics through IoT Central instead of sending them directly to Log Analytics. For example, when monitoring [IoT Edge devices in a nested configuration](tutorial-nested-iot-edge.md) where child devices have access only to the IoT Edge hub of their parent device. Another example is deploying an IoT Edge device with outbound network access only to IoT Central.

To enable monitoring in this scenario, configure the metrics-collector module to send metrics as device-to-cloud (D2C) messages via the edgeHub module. Turn on the capability by setting the `UploadTarget` environment variable to `IotMessage` in the collector [configuration](#metrics-collector-configuration).

The following example shows the collector and routing configuration. Merge it into your deployment manifest and retain your complete system-module configuration:

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "runtime": {
          "type": "docker",
          "settings": {
            "minDockerVersion": "v1.25",
            "loggingOptions": "",
            "registryCredentials": {}
          }
        },
        "systemModules": {
          "edgeAgent": {
          },
          "edgeHub": {
          }
        },
        "modules": {
          "SimulatedTemperatureSensor": {
          },
          "AzureMonitorForIotEdgeModule": {
            "settings": {
                "image": "mcr.microsoft.com/azureiotedge-metrics-collector:2.0.0",
                "createOptions": "{\"HostConfig\":{\"LogConfig\":{\"Type\":\"json-file\",\"Config\":{\"max-size\":\"4m\",\"max-file\":\"7\"}}}}"
            },
            "type": "docker",
            "env": {
              "UploadTarget": {
                "value": "IotMessage"
              },
              "ResourceId": {
                "value": "/subscriptions/{your subscription id}/resourceGroups/{your resource group}/providers/Microsoft.IoTCentral/IoTApps/{your app name}"
              },
              "MetricsEndpointsCSV": {
                "value": "http://edgeHub:9600/metrics,http://edgeAgent:9600/metrics"
              },
              "ScrapeFrequencyInSecs": {
                "value": "30"
              },
              "AllowedMetrics": {
                "value": ""
              },
              "BlockedMetrics": {
                "value": ""
              },
              "CompressForUpload": {
                "value": "false"
              },
              "TransformForIoTCentral": {
                "value": "true"
              }
            },
            "status": "running",
            "restartPolicy": "always",
            "version": "1.0"
          }
        }
      }
    },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {
          "temperatureupload": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO $upstream",
          "metricupload": "FROM /messages/modules/AzureMonitorForIotEdgeModule/outputs/metricOutput INTO $upstream"
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 7200
        }
      }
    },
    "SimulatedTemperatureSensor": {
    },
    "AzureMonitorForIotEdgeModule": {}
  }
}
```

> [!TIP]
> Remember to add an edgeHub route to deliver metrics messages from the collector module to IoT Central. The route looks similar to `FROM /messages/modules/replace-with-collector-module-name/* INTO $upstream`.

To view the metrics from your IoT Edge device in your IoT Central application:

* Add the **IoT Edge Metrics standard interface** as an inherited interface to your [device template](../iot-central/core/concepts-device-templates.md):

  :::image type="content" source="media/how-to-collect-and-transport-metrics/add-metrics-interface.png" alt-text="Screenshot that shows how to add the IoT Edge Metrics standard interface." lightbox="media/how-to-collect-and-transport-metrics/add-metrics-interface.png":::

* Use the telemetry values defined in the interface to build any [dashboards](../iot-central/core/howto-manage-dashboards.md) you need to monitor your IoT Edge devices:

  :::image type="content" source="media/how-to-collect-and-transport-metrics/iot-edge-metrics-telemetry.png" alt-text="Screenshot that shows the IoT Edge metrics available as telemetry." lightbox="media/how-to-collect-and-transport-metrics/iot-edge-metrics-telemetry.png":::

> [!NOTE]
> Be aware of extra costs with this option. Metrics messages count against your IoT Central message quota.

---

## Next steps

Explore the types of [curated visualizations](how-to-explore-curated-visualizations.md) that Azure Monitor provides.
