---
title: Collect and transport Azure IoT Edge metrics
description: Use Azure Monitor to remotely monitor IoT Edge's built-in metrics
author: PatAltimore

ms.author: veyalla
ms.date: 06/07/2023
ms.topic: conceptual
ms.reviewer: veyalla
ms.service: iot-edge 
services: iot-edge
---

# Collect and transport metrics

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

You can remotely monitor your IoT Edge fleet using Azure Monitor and built-in metrics integration. To enable this capability on your device, add the metrics-collector module to your deployment and configure it to collect and transport module metrics to Azure Monitor.

To configure monitoring on your IoT Edge device, follow the [Tutorial: Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md). You learn how to add the metrics-collector module to your device. This article gives you an overview of the monitoring architecture and explains your options on configuring metrics on your device.

> [!VIDEO https://aka.ms/docs/player?id=94a7d988-4a35-4590-9dd8-a511cdd68bee]

<a href="https://aka.ms/docs/player?id=94a7d988-4a35-4590-9dd8-a511cdd68bee" target="_blank">IoT Edge integration with Azure Monitor</a>(4:06)

## Architecture

# [IoT Hub](#tab/iothub)

:::image type="content" source="./media/how-to-collect-and-transport-metrics/arch.png" alt-text="Screenshot of the metrics monitoring architecture with IoT Hub." lightbox="./media/how-to-collect-and-transport-metrics/arch.png":::

| Note | Description |
|-|-|
|  1 | All modules must emit metrics using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). While [built-in metrics](how-to-access-built-in-metrics.md) enable broad workload visibility by default, custom modules can also be used to emit scenario-specific metrics to enhance the monitoring solution. Learn how to instrument custom modules using open-source libraries in the [Add custom metrics](how-to-add-custom-metrics.md) article. |
|  2️ | The [metrics-collector module](https://aka.ms/edgemon-metrics-collector) is a Microsoft-supplied IoT Edge module that collects workload module metrics and transports them off-device. Metrics collection uses a *pull* model. Collection frequency, endpoints, and filters can be configured to control the data egressed from the module. For more information, see [metrics collector configuration section](#metrics-collector-configuration) later in this article. |
|  3️ | You have two options for sending metrics from the metrics-collector module to the cloud. *Option 1* sends the metrics to Log Analytics.<sup>1</sup> The collected metrics are ingested into the specified Log Analytics workspace using a fixed, native table called `InsightsMetrics`. This table's schema is compatible with the Prometheus metrics data model.<br><br> This option requires access to the workspace on outbound port 443. The Log Analytics workspace ID and key must be specified as part  of the module configuration. To enable in restricted networks, see [Enable in restricted network access scenarios](#enable-in-restricted-network-access-scenarios) later in this article.
|  4️ | Each metric entry contains the `ResourceId` that was specified as part of [module configuration](#metrics-collector-configuration). This association automatically  links the metric with the specified resource (for example, IoT Hub). As a result, the [curated IoT Edge workbook templates](how-to-explore-curated-visualizations.md) can retrieve metrics by issuing queries against the resource. <br><br> This approach also allows multiple IoT hubs to safely share a single Log Analytics workspace as a metrics database. |
|  5️ | *Option 2* sends the metrics to IoT Hub.<sup>1</sup> The collector module can be configured to send the collected metrics as UTF-8 encoded JSON [device-to-cloud messages](../iot-hub/iot-hub-devguide-messages-d2c.md) via the `edgeHub` module. This option unlocks monitoring of locked-down IoT Edge devices that are allowed external access to only the  IoT Hub endpoint. It also enables monitoring of child IoT Edge devices in a nested configuration where child devices can only access their parent device. |
|  6️ | When metrics are routed via IoT Hub, a (one-time) cloud workflow needs to be set up. The workflow processes messages arriving from the metrics-collector module and sends them to the Log Analytics workspace. The workflow enables the [curated visualizations](how-to-explore-curated-visualizations.md) and [alerts](how-to-create-alerts.md) functionality even for metrics arriving via this optional path. See the [Route metrics through IoT Hub](#route-metrics) section for details on how to set up this cloud workflow. |

<sup>1</sup> Currently, using *option 1* to directly transport metrics to Log Analytics from the IoT Edge device is the simpler path that requires minimal setup. The first option is preferred unless your specific scenario demands the *option 2* approach so that the IoT Edge device communicates only with IoT Hub.

# [IoT Central](#tab/iotcentral)

:::image type="content" source="./media/how-to-collect-and-transport-metrics/arch-iot-central.png" alt-text="Screenshot of metrics monitoring architecture with IoT Central." lightbox="./media/how-to-collect-and-transport-metrics/arch-iot-central.png":::

| Note | Description |
|-|-|
|  1 | All modules must emit metrics using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). While [built-in metrics](how-to-access-built-in-metrics.md) enable broad workload visibility by default, custom modules can also be used to emit scenario-specific metrics to enhance the monitoring solution. Learn how to instrument custom modules using open-source libraries in the [Add custom metrics](how-to-add-custom-metrics.md) article. |
|  2️ | The [metrics-collector module](https://aka.ms/edgemon-metrics-collector) is a Microsoft-supplied IoT Edge module that collects workload module metrics and transports them off-device. Metrics collection uses a *pull* model. Collection frequency, endpoints, and filters can be configured to control the data egressed from the module. For more information, see [metrics collector configuration section](#metrics-collector-configuration) later in this article. |
|  3️ | You have two options for sending metrics from the metrics-collector module to the cloud. *Option 1* sends the metrics to Log Analytics. The collected metrics are ingested into the specified Log Analytics workspace using a fixed, native table called `InsightsMetrics`. This table's schema is compatible with the Prometheus metrics data model.<br><br> This option requires access to the workspace on outbound port 443. The Log Analytics workspace ID and key must be specified as part  of the module configuration. To enable in restricted networks, see [Enable in restricted network access scenarios](#enable-in-restricted-network-access-scenarios) later in this article.
|  4️ | Each metric entry contains the `ResourceId` that was specified as part of [module configuration](#metrics-collector-configuration). This association automatically  links the metric with the specified resource (for example, IoT Central). As a result, the [curated IoT Edge workbook templates](how-to-explore-curated-visualizations.md) can retrieve metrics by issuing queries against the resource. <br><br> This approach also allows multiple IoT Central applications to safely share a single Log Analytics workspace as a metrics database. |
|  5️ | *Option 2* sends the metrics to IoT Central. This option lets an operator view the metrics and device telemetry in a single location. The collector module can be configured to send the collected metrics as UTF-8 encoded JSON [device-to-cloud messages](../iot-hub/iot-hub-devguide-messages-d2c.md) via the `edgeHub` module. This option unlocks monitoring of locked-down IoT Edge devices that are allowed external access to only the IoT Central endpoint. It also enables monitoring of child IoT Edge devices in a nested configuration where child devices can only access their parent device. |

---

## Metrics collector module

A Microsoft-supplied metrics-collector module can be added to an IoT Edge deployment to collect module metrics and send them to Azure Monitor. The module code is open-source and available in the [IoT Edge GitHub repo](https://github.com/Azure/iotedge/tree/release/1.1/edge-modules/metrics-collector).

The metrics-collector module is provided as a multi-arch Docker container image that supports Linux X64, ARM32, ARM64, and Windows X64 (version 1809). It's publicly available at **[`mcr.microsoft.com/azureiotedge-metrics-collector`](https://aka.ms/edgemon-metrics-collector)**.

It also available in the [IoT Edge Module Marketplace](https://aka.ms/edgemon-module-marketplace).

## Metrics collector configuration

All configuration for the metrics-collector is done using environment variables. Minimally, the variables noted in this table marked as **Required** need to be specified.

# [IoT Hub](#tab/iothub)

| Environment variable name | Description |
|-|-|
| `ResourceId` | Resource ID of the IoT hub that the device communicates with. For more information, see the [Resource ID](#resource-id) section.  <br><br>  **Required** <br><br> Default value: *none* |
| `UploadTarget` |  Controls whether metrics are sent directly to Azure Monitor over HTTPS or to IoT Hub as D2C messages. For more information, see [upload target](#upload-target). <br><br>Can be either **AzureMonitor** or **IoTMessage**  <br><br>  **Not required** <br><br> Default value: *AzureMonitor* |
| `LogAnalyticsWorkspaceId` | [Log Analytics workspace ID](../azure-monitor/agents/agent-windows.md#workspace-id-and-key). <br><br>**Required** only if *UploadTarget* is *AzureMonitor* <br><br>Default value: *none* |
| `LogAnalyticsSharedKey` | [Log Analytics workspace key](../azure-monitor/agents/agent-windows.md#workspace-id-and-key). <br><br>**Required** only if  *UploadTarget*  is  *AzureMonitor*   <br><br> Default value: *none* |
| `ScrapeFrequencyInSecs` | Recurring time interval in seconds at which to collect and transport metrics.<br><br>  Example: *600* <br><br>  **Not required** <br><br> Default value: *300* |
| `MetricsEndpointsCSV` | Comma-separated list of endpoints to collect Prometheus metrics from. All module endpoints to collect metrics from must appear in this list.<br><br>  Example: *http://edgeAgent:9600/metrics, http://edgeHub:9600/metrics, http://MetricsSpewer:9417/metrics* <br><br>  **Not required** <br><br> Default value: *http://edgeHub:9600/metrics, http://edgeAgent:9600/metrics* |
| `AllowedMetrics` | List of metrics to collect, all other metrics are ignored. Set to an empty string to disable. For more information, see [allow and disallow lists](#allow-and-disallow-lists). <br><br>Example: *metricToScrape{quantile=0.99}[endpoint=http://MetricsSpewer:9417/metrics]*<br><br>  **Not required** <br><br> Default value: *empty* |
| `BlockedMetrics` | List of metrics to ignore. Overrides *AllowedMetrics*, so a metric isn't reported if it's included in both lists. For more information, see [allow and disallow lists](#allow-and-disallow-lists). <br><br>   Example: *metricToIgnore{quantile=0.5}[endpoint=http://VeryNoisyModule:9001/metrics], docker_container_disk_write_bytes*<br><br>  **Not required**  <br><br>Default value: *empty* |
| `CompressForUpload` | Controls if compression should be used when uploading metrics. Applies to all upload targets.<br><br>  Example: *true* <br><br>    **Not required** <br><br>  Default value: *true* |
| `AzureDomain` | Specifies the top-level Azure domain to use when ingesting metrics directly to Log Analytics. <br><br>  Example: *azure.us* <br><br>    **Not required** <br><br>  Default value: *azure.com* |

# [IoT Central](#tab/iotcentral)

| Environment variable name | Description |
|-|-|
| `ResourceId` | Resource ID of the IoT Central application that the device communicates with. For more information, see the [Resource ID](#resource-id) section.  <br><br>  **Required** <br><br> Default value: *none* |
| `UploadTarget` |  Controls whether metrics are sent directly to Azure Monitor over HTTPS or to IoT Central as D2C messages. For more information, see [upload target](#upload-target). <br><br>Can be either **AzureMonitor** or **IoTMessage**  <br><br>  **Not required** <br><br> Default value: *AzureMonitor* |
| `LogAnalyticsWorkspaceId` | [Log Analytics workspace ID](../azure-monitor/agents/agent-windows.md#workspace-id-and-key). <br><br>**Required** only if *UploadTarget* is *AzureMonitor* <br><br>Default value: *none* |
| `LogAnalyticsSharedKey` | [Log Analytics workspace key](../azure-monitor/agents/agent-windows.md#workspace-id-and-key). <br><br>**Required** only if  *UploadTarget*  is  *AzureMonitor*   <br><br> Default value: *none* |
| `ScrapeFrequencyInSecs` | Recurring time interval in seconds at which to collect and transport metrics.<br><br>  Example: *600* <br><br>  **Not required** <br><br> Default value: *300* |
| `MetricsEndpointsCSV` | Comma-separated list of endpoints to collect Prometheus metrics from. All module endpoints to collect metrics from must appear in this list.<br><br>  Example: *http://edgeAgent:9600/metrics, http://edgeHub:9600/metrics, http://MetricsSpewer:9417/metrics* <br><br>  **Not required** <br><br> Default value: *http://edgeHub:9600/metrics, http://edgeAgent:9600/metrics* |
| `AllowedMetrics` | List of metrics to collect, all other metrics are ignored. Set to an empty string to disable. For more information, see [allow and disallow lists](#allow-and-disallow-lists). <br><br>Example: *metricToScrape{quantile=0.99}[endpoint=http://MetricsSpewer:9417/metrics]*<br><br>  **Not required** <br><br> Default value: *empty* |
| `BlockedMetrics` | List of metrics to ignore. Overrides *AllowedMetrics*, so a metric is reported if it's included in both lists. For more information, see [allow and disallow lists](#allow-and-disallow-lists). <br><br>   Example: *metricToIgnore{quantile=0.5}[endpoint=http://VeryNoisyModule:9001/metrics], docker_container_disk_write_bytes*<br><br>  **Not required**  <br><br>Default value: *empty* |
| `CompressForUpload` | Controls if compression should be used when uploading metrics. Applies to all upload targets.<br><br>  Example: *true* <br><br>    **Not required** <br><br>  Default value: *true* |
| `AzureDomain` | Specifies the top-level Azure domain to use when ingesting metrics directly to Log Analytics. <br><br>  Example: *azure.us* <br><br>    **Not required** <br><br>  Default value: *azure.com* |

To learn more about IoT Edge and IoT Central, see [Connect Azure IoT Edge devices to an Azure IoT Central application](../iot-central/core/concepts-iot-edge.md).

---

### Resource ID

# [IoT Hub](#tab/iothub)

The metrics-collector module requires the Azure Resource Manager ID of the IoT hub that the IoT Edge device belongs to. Provide this ID as the value of the **ResourceID** environment variable.

The resource ID takes the following format:

```input
/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Devices/IoTHubs/<iot hub name>
```

You can find the resource ID in the **Properties** page of the IoT hub in the Azure portal.

:::image type="content" source="./media/how-to-collect-and-transport-metrics/hub-id.png" alt-text="Screenshot the shows how to retrieve your resource ID from the IoT Hub properties." lightbox="./media/how-to-collect-and-transport-metrics/hub-id.png":::

Or, you retrieve the ID with the [az resource show](/cli/azure/resource#az-resource-show) command:

```azurecli-interactive
az resource show -g <resource group> -n <hub name> --resource-type "Microsoft.Devices/IoTHubs"
```

# [IoT Central](#tab/iotcentral)

The metrics-collector module requires the Azure Resource Manager ID of the IoT Central application that the IoT Edge device belongs to. Provide this ID as the value of the **ResourceID** environment variable.

The resource ID takes the following format:

```input
/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.IoTCentral/IoTApps/<iot central app name>
```

You can find the resource ID in the **Properties** page of the IoT Central application in the Azure portal.

:::image type="content" source="./media/how-to-collect-and-transport-metrics/resource-id-iot-central.png" alt-text="Retrieve resource ID from the IoT Central properties.":::

Or, you retrieve the ID with the [az resource show](/cli/azure/resource#az-resource-show) command:

```azurecli-interactive
az resource show -g <resource group> -n <application name> --resource-type "Microsoft.IoTCentral/IoTApps"
```

---

### Upload target

# [IoT Hub](#tab/iothub)

The **UploadTarget** configuration option controls whether metrics are sent directly to Azure Monitor or to IoT Hub.

If you set **UploadTarget** to **IoTMessage**, then your module metrics are published as IoT messages. These messages are emitted as UTF8-encoded json from the endpoint `/messages/modules/<metrics collector module name>/outputs/metricOutput`. For example, if your IoT Edge Metrics Collector module is named **IoTEdgeMetricsCollector**, the endpoint is `/messages/modules/IoTEdgeMetricsCollector/outputs/metricOutput`. The format is as follows:

```json
[{
    "TimeGeneratedUtc": "<time generated>",
    "Name": "<prometheus metric name>",
    "Value": <decimal value>,
    "Label": {
        "<label name>": "<label value>"
    }
}, {
    "TimeGeneratedUtc": "2020-07-28T20:00:43.2770247Z",
    "Name": "docker_container_disk_write_bytes",
    "Value": 0.0,
    "Label": {
        "name": "AzureMonitorForIotEdgeModule"
    }
}]
```

# [IoT Central](#tab/iotcentral)

The **UploadTarget** configuration option controls whether metrics are sent directly to Azure Monitor or to IoT Central.

If you set **UploadTarget** to **IoTMessage**, then your module metrics are published as IoT messages. These messages are emitted as UTF8-encoded json from the endpoint `/messages/modules/<metrics collector module name>/outputs/metricOutput`. For example, if your IoT Edge Metrics Collector module is named **IoTEdgeMetricsCollector**, the endpoint is `/messages/modules/IoTEdgeMetricsCollector/outputs/metricOutput`. The format is as follows:

```json
[{
    "TimeGeneratedUtc": "<time generated>",
    "Name": "<prometheus metric name>",
    "Value": <decimal value>,
    "Label": {
        "<label name>": "<label value>"
    }
}, {
    "TimeGeneratedUtc": "2020-07-28T20:00:43.2770247Z",
    "Name": "docker_container_disk_write_bytes",
    "Value": 0.0,
    "Label": {
        "name": "AzureMonitorForIotEdgeModule"
    }
}]
```

---

### Allow and disallow lists

The `AllowedMetrics` and `BlockedMetrics` configuration options take space- or comma-separated lists of metric selectors. A metric matches the list and is included or excluded if it matches one or more metrics in either list.

Metric selectors use a format similar to a subset of the [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) query language.

```query
metricToSelect{quantile=0.5,otherLabel=~Re[ge]*|x}[http://VeryNoisyModule:9001/metrics]
```

Metric selectors consist of three parts:

Metric name (`metricToSelect`).

* Wildcards `*` (any characters) and `?` (any single character) can be used in metric names. For example, `*CPU` would match `maxCPU` and `minCPU` but not `CPUMaximum`. `???CPU` would match `maxCPU` and `minCPU` but not `maximumCPU`.
* This component is required in a metrics selector.

Label-based selectors (`{quantile=0.5,otherLabel=~Re[ge]*|x}`).

* Multiple metric values can be included in the curly brackets. The values should be comma-separated.
* A metric is matched if at least all labels in the selector are present and also match.
* Like PromQL, the following matching operators are allowed.
  * `=` Match labels exactly equal to the provided string (case sensitive).
  * `!=` Match labels not exactly equal to the provided string.
  * `=~` Match labels to a provided regex. ex: `label=~CPU|Mem|[0-9]*`
  * `!~` Match labels that don't fit a provided regex.
  * Regex is fully anchored (A `^` and `$` are automatically added to the start and end of each regex)
  * This component is optional in a metrics selector.

Endpoint selector (`[http://VeryNoisyModule:9001/metrics]`).

* The URL should exactly match a URL listed in `MetricsEndpointsCSV`.
* This component is optional in a metrics selector.

A metric must match all parts of a given selector to be selected. It must match the name *and* have all the same labels with matching values *and* come from the given endpoint. For example, `mem{quantile=0.5,otherLabel=foobar}[http://VeryNoisyModule:9001/metrics]` wouldn't match the selector `mem{quantile=0.5,otherLabel=~foo|bar}[http://VeryNoisyModule:9001/metrics]`. Multiple selectors should be used to create or-like behavior instead of and-like behavior.

For example, to allow the custom metric `mem` with any label from a module `module1` but only allow the same metric from `module2` with the label `agg=p99`, the following selector can be added to `AllowedMetrics`:

```query
mem{}[http://module1:9001/metrics] mem{agg="p99"}[http://module2:9001/metrics]
```

Or, to allow the custom metrics `mem` and `cpu` for any labels or endpoint, add the following to `AllowedMetrics`:

```query
mem cpu
```

## Enable in restricted network access scenarios

If you're sending metrics directly to the Log Analytics workspace, allow outbound access to the following URLs:

* `https://<LOG_ANALYTICS_WORKSPACE_ID>.ods.opinsights.azure.com/*`
* `https://<LOG_ANALYTICS_WORKSPACE_ID>.oms.opinsights.azure.com/*`

### Proxy considerations

The metrics-collector module is written in .NET Core. So use the same guidance as for system modules to [allow communication through a proxy server](how-to-configure-proxy-support.md#configure-deployment-manifests).

Metrics collection from local modules uses http protocol. Exclude local communication from going through the proxy server by setting the `NO_PROXY` environment variable.

Set `NO_PROXY` value to a comma-separated list of hostnames that should be excluded. Use module names for hostnames. For example: *edgeHub,edgeAgent,myCustomModule*.

## Route metrics

# [IoT Hub](#tab/iothub)

Sometimes it's necessary to ingest metrics through IoT Hub instead of sending them directly to Log Analytics. For example, when monitoring [IoT Edge devices in a nested configuration](tutorial-nested-iot-edge.md) where child devices have access only to the IoT Edge hub of their parent device. Another example is when deploying an IoT Edge device with *outbound network access only* to IoT Hub.

To enable monitoring in this scenario, the metrics-collector module can be configured to send metrics as device-to-cloud (D2C) messages via the edgeHub module. The capability can be turned on by setting the `UploadTarget` environment variable to `IoTMessage` in the collector [configuration](#metrics-collector-configuration).

>[!TIP]
>Remember to add an edgeHub route to deliver metrics messages from the collector module to IoT Hub. It looks like `FROM /messages/modules/replace-with-collector-module-name/* INTO $upstream`.

This option does require extra setup, a cloud workflow, to deliver metrics messages arriving at IoT Hub to the Log Analytics workspace. Without this set up, the other portions of the integration such as [curated visualizations](how-to-explore-curated-visualizations.md) and [alerts](how-to-create-alerts.md) don't work.

>[!NOTE]
>Be aware of additional costs with this option. Metrics messages will count against your IoT Hub message quota. You will also be charged for Log Analytics ingestion and cloud workflow resources.

### Sample cloud workflow

A cloud workflow that delivers metrics messages from IoT Hub to Log Analytics is available as part of the [IoT Edge logging and monitoring sample](https://github.com/Azure-Samples/iotedge-logging-and-monitoring-solution/blob/main/docs/CloudWorkflow.md). The sample can be deployed on to existing cloud resources or serve as a production deployment reference.

# [IoT Central](#tab/iotcentral)

Sometimes it's necessary to ingest metrics through IoT Central instead of sending them directly to Log Analytics. For example, when monitoring [IoT Edge devices in a nested configuration](tutorial-nested-iot-edge.md) where child devices have access only to the IoT Edge hub of their parent device. Another example is when deploying an IoT Edge device with *outbound network access only* to IoT Central.

To enable monitoring in this scenario, the metrics-collector module can be configured to send metrics as device-to-cloud (D2C) messages via the edgeHub module. The capability can be turned on by setting the `UploadTarget` environment variable to `IoTMessage` in the collector [configuration](#metrics-collector-configuration).

The following example deployment manifest shows the configuration:

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
            // ...
          },
          "edgeHub": {
            // ...
          }
        },
        "modules": {
          "SimulatedTemperatureSensor": {
            // ...
          },
          "AzureMonitorForIotEdgeModule": {
            "settings": {
                "image": "mcr.microsoft.com/azureiotedge-metrics-collector:1.0",
                "createOptions": "{\"HostConfig\":{\"LogConfig\":{\"Type\":\"json-file\",\"Config\":{\"max-size\":\"4m\",\"max-file\":\"7\"}}}}"
            },
            "type": "docker",
            "env": {
              "UploadTarget": {
                "value": "IotMessage"
              },
              "ResourceId": {
                "value": "/subscriptions/{your subscription id}/IOTC/providers/Microsoft.IoTCentral/IoTApps/{your app name}"
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
      // ...
    },
    "AzureMonitorForIotEdgeModule": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "scrapeFrequencySecs": 30,
        "metricsFormat": "Json",
        "syncTarget": "IoTHub"
      }
    }
  }
}
```

>[!TIP]
>Remember to add an edgeHub route to deliver metrics messages from the collector module to IoT Central. It looks like `FROM /messages/modules/replace-with-collector-module-name/* INTO $upstream`.

To view the metrics from your IoT Edge device in your IoT Central application:

* Add the **IoT Edge Metrics standard interface** as an inherited interface to your [device template](../iot-central/core/concepts-device-templates.md):

  :::image type="content" source="media/how-to-collect-and-transport-metrics/add-metrics-interface.png" alt-text="Screenshot that shows how to add the IoT Edge Metrics standard interface." lightbox="media/how-to-collect-and-transport-metrics/add-metrics-interface.png":::

* Use the telemetry values defined in the interface to build any [dashboards](../iot-central/core/howto-manage-dashboards.md) you need to monitor your IoT Edge devices:

  :::image type="content" source="media/how-to-collect-and-transport-metrics/iot-edge-metrics-telemetry.png" alt-text="Screenshot that shows the IoT Edge metrics available as telemetry." lightbox="media/how-to-collect-and-transport-metrics/iot-edge-metrics-telemetry.png":::

>[!NOTE]
>Be aware of additional costs with this option. Metrics messages will count against your IoT Central message quota.

---

## Next steps

Explore the types of [curated visualizations](how-to-explore-curated-visualizations.md) that Azure Monitor enables.
