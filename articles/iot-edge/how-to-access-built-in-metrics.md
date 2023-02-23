---
title: Access built-in metrics - Azure IoT Edge
description: Remote access to built-in metrics from the IoT Edge runtime components
author: PatAltimore

ms.author: patricka
ms.date: 06/25/2021
ms.topic: conceptual
ms.reviewer: veyalla
ms.service: iot-edge 
services: iot-edge
---

# Access built-in metrics

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The IoT Edge runtime components, IoT Edge hub and IoT Edge agent, produce built-in metrics in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). Access these metrics remotely to monitor and understand the health of an IoT Edge device.

You can use your own solution to access these metrics. Or, you can use the [metrics-collector module](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot_edge.metrics-collector) which handles collecting the built-in metrics and sending them to Azure Monitor or Azure IoT Hub. For more information, see [Collect and transport metrics](how-to-collect-and-transport-metrics.md).

As of release 1.0.10, metrics are automatically exposed by default on **port 9600** of the **edgeHub** and **edgeAgent** modules (`http://edgeHub:9600/metrics` and `http://edgeAgent:9600/metrics`). They aren't port mapped to the host by default.

Access metrics from the host by exposing and mapping the metrics port from the module's `createOptions`. The example below maps the default metrics port to port 9601 on the host:

```json
{
  "ExposedPorts": {
    "9600/tcp": {}
  },
  "HostConfig": {
    "PortBindings": {
      "9600/tcp": [
        {
          "HostPort": "9601"
        }
      ]
    }
  }
}
```

Choose different and unique host port numbers if you are mapping both the edgeHub and edgeAgent's metrics endpoints.

> [!NOTE]
> The environment variable `httpSettings__enabled` should not be set to `false` for built-in metrics to be available for collection.
>
> Environment variables that can be used to disable metrics are listed in the [azure/iotedge repo doc](https://github.com/Azure/iotedge/blob/master/doc/EnvironmentVariables.md).

## Available metrics

Metrics contain tags to help identify the nature of the metric being collected. All metrics contain the following tags:

| Tag | Description |
|-|-|
| iothub | The hub the device is talking to |
| edge_device | The ID of the current device |
| instance_number | A GUID representing the current runtime. On restart, all metrics will be reset. This GUID makes it easier to reconcile restarts. |

In the Prometheus exposition format, there are four core metric types: counter, gauge, histogram, and summary. For more information about the different metric types, see the [Prometheus metric types documentation](https://prometheus.io/docs/concepts/metric_types/).

The quantiles provided for the built-in histogram and summary metrics are 0.1, 0.5, 0.9 and 0.99.

The **edgeHub** module produces the following metrics:

| Name | Dimensions | Description |
|-|-|-|
| `edgehub_gettwin_total` | `source` (operation source)<br> `id` (module ID) | Type: counter<br> Total number of GetTwin calls |
| `edgehub_messages_received_total` | `route_output` (output that sent message)<br> `id` | Type: counter<br> Total number of messages received from clients |
| `edgehub_messages_sent_total` | `from` (message source)<br> `to` (message destination)<br>`from_route_output`<br> `to_route_input` (message destination input)<br> `priority` (message priority to destination) | Type: counter<br> Total number of messages sent to clients or upstream<br> `to_route_input` is empty when `to` is $upstream |
| `edgehub_reported_properties_total` | `target`(update target)<br> `id` | Type: counter<br> Total reported property updates calls |
| `edgehub_message_size_bytes` | `id`<br> | Type: summary<br> Message size from clients<br> Values may be reported as `NaN` if no new measurements are reported for a certain period of time (currently 10 minutes); for `summary` type, corresponding `_count` and `_sum` counters will be emitted. |
| `edgehub_gettwin_duration_seconds` | `source` <br> `id` | Type: summary<br> Time taken for get twin operations |
| `edgehub_message_send_duration_seconds` | `from`<br> `to`<br> `from_route_output`<br> `to_route_input` | Type: summary<br> Time taken to send a message |
| `edgehub_message_process_duration_seconds` | `from` <br> `to` <br> `priority` | Type: summary<br> Time taken to process a message from the queue |
| `edgehub_reported_properties_update_duration_seconds` | `target`<br> `id` | Type: summary<br> Time taken to update reported properties |
| `edgehub_direct_method_duration_seconds` | `from` (caller)<br> `to` (receiver) | Type: summary<br> Time taken to resolve a direct message |
| `edgehub_direct_methods_total` | `from`<br> `to` | Type: counter<br> Total number of direct messages sent |
| `edgehub_queue_length` | `endpoint` (message source)<br> `priority` (queue priority) | Type: gauge<br> Current length of edgeHub's queue for a given priority |
| `edgehub_messages_dropped_total` | `reason` (no_route, ttl_expiry)<br> `from` <br> `from_route_output` | Type: counter<br> Total number of messages removed because of reason |
| `edgehub_messages_unack_total` | `reason` (storage_failure)<br> `from`<br> `from_route_output` | Type: counter<br> Total number of messages unacknowledged because storage failure |
| `edgehub_offline_count_total` | `id` | Type: counter<br> Total number of times edgeHub went offline |
| `edgehub_offline_duration_seconds`| `id` | Type: summary<br> Time edge hub was offline |
| `edgehub_operation_retry_total` | `id`<br> `operation` (operation name) | Type: counter<br> Total number of times edgeHub operations were retried |
| `edgehub_client_connect_failed_total` | `id` <br> `reason` (not authenticated)<br> | Type: counter<br> Total number of times clients failed to connect to edgeHub |

The **edgeAgent** module produces the following metrics:

| Name | Dimensions | Description |
|-|-|-|
| `edgeAgent_total_time_running_correctly_seconds` | `module_name` | Type: gauge<br> The amount of time the module was specified in the deployment and was in the running state |
| `edgeAgent_total_time_expected_running_seconds` | `module_name` | Type: gauge<br> The amount of time the module was specified in the deployment |
| `edgeAgent_module_start_total` | `module_name`, `module_version` | Type: counter<br> Number of times edgeAgent asked docker to start the module |
| `edgeAgent_module_stop_total` | `module_name`, `module_version` | Type: counter<br> Number of times edgeAgent asked docker to stop the module |
| `edgeAgent_command_latency_seconds` | `command` | Type: gauge<br> How long it took docker to execute the given command. Possible commands are: create, update, remove, start, stop, restart |
| `edgeAgent_iothub_syncs_total` | | Type: counter<br> Number of times edgeAgent attempted to sync its twin with iotHub, both successful and unsuccessful. This number includes both Agent requesting a twin and Hub notifying of a twin update |
| `edgeAgent_unsuccessful_iothub_syncs_total` | | Type: counter<br> Number of times edgeAgent failed to sync its twin with iotHub. |
| `edgeAgent_deployment_time_seconds` | | Type: counter<br> The amount of time it took to complete a new deployment after receiving a change. |
| `edgeagent_direct_method_invocations_count` | `method_name` | Type: counter<br> Number of times a built-in edgeAgent direct method is called, such as Ping or Restart. |
| `edgeAgent_host_uptime_seconds` | | Type: gauge<br> How long the host has been on |
| `edgeAgent_iotedged_uptime_seconds` | | Type: gauge<br> How long iotedged has been running |
| `edgeAgent_available_disk_space_bytes` | `disk_name`, `disk_filesystem`, `disk_filetype` | Type: gauge<br> Amount of space left on the disk |
| `edgeAgent_total_disk_space_bytes` | `disk_name`, `disk_filesystem`, `disk_filetype`| Type: gauge<br> Size of the disk |
| `edgeAgent_used_memory_bytes` | `module_name` | Type: gauge<br> Amount of RAM used by all processes |
| `edgeAgent_total_memory_bytes` | `module_name` | Type: gauge<br> RAM available |
| `edgeAgent_used_cpu_percent` | `module_name` | Type: histogram<br> Percent of cpu used by all processes |
| `edgeAgent_created_pids_total` | `module_name` | Type: gauge<br> The number of processes or threads the container has created |
| `edgeAgent_total_network_in_bytes` | `module_name` | Type: gauge<br> The number of bytes received from the network |
| `edgeAgent_total_network_out_bytes` | `module_name` | Type: gauge<br> The number of bytes sent to network |
| `edgeAgent_total_disk_read_bytes` | `module_name` | Type: gauge<br> The number of bytes read from the disk |
| `edgeAgent_total_disk_write_bytes` | `module_name` | Type: gauge<br> The number of bytes written to disk |
| `edgeAgent_metadata` | `edge_agent_version`, `experimental_features`, `host_information` | Type: gauge<br> General metadata about the device. The value is always 0, information is encoded in the tags. Note `experimental_features` and `host_information` are json objects. `host_information` looks like ```{"OperatingSystemType": "linux", "Architecture": "x86_64", "Version": "1.2.7", "Provisioning": {"Type": "dps.tpm", "DynamicReprovisioning": false, "AlwaysReprovisionOnStartup": false}, "ServerVersion": "20.10.11+azure-3", "KernelVersion": "5.11.0-1027-azure", "OperatingSystem": "Ubuntu 20.04.4 LTS", "NumCpus": 2, "Virtualized": "yes"}```. Note `ServerVersion` is the Docker version and `Version` is the IoT Edge security daemon version. |

## Next steps

* [Collect and transport metrics](how-to-collect-and-transport-metrics.md)
* [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md)
* [Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md)
