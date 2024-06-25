---
title: Monitoring data reference for Azure IoT Hub
description: This article contains important reference material you need when you monitor the Azure IoT Hub service.
ms.date: 06/26/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: kgremban
ms.author: kgremban
ms.service: iot-hub
---

<!-- 
IMPORTANT 
According to the Content Pattern guidelines all comments must be removed before publication!!!
To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.
Your service should have the following two articles:
1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Azure IoT Hub monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure IoT](monitor-iot-hub.md) for details on the data you can collect for IoT Hub and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Devices/IoTHubs

The following table lists the metrics available for the Microsoft.Devices/IoTHubs resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Devices/IoTHubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-devices-iothubs-metrics-include.md)]

### Supported aggregations

The **Aggregation Type** column in each table corresponds to the default aggregation that is used when the metric is selected for a chart or alert.

:::image type="content" source="./media/monitor-iot-hub-reference/aggregation-type.png" alt-text="Screenshot showing aggregation for metrics.":::

For most metrics, all aggregation types are valid. For count metrics with a **Unit** column value of **Count**, only some aggregations are valid. Count metrics can be one of two types:

- For **Single-point** count metrics, IoT Hub registers a single data point (essentially a 1) every time the measured operation occurs. Azure Monitor then sums these data points over the specified granularity. Examples of **Single-point** metrics are *Telemetry messages sent* and *C2D message deliveries completed*. For these metrics, the only relevant aggregation type is Total (Sum). The portal allows you to choose minimum, maximum, and average; however, these values will always be 1.

- For **Snapshot** count metrics, IoT Hub registers a total count when the measured operation occurs. Currently, there are three **Snapshot** metrics emitted by IoT Hub: *Total number of messages used*, *Total devices*, and *Connected devices*. Because these metrics present a "total" quantity every time they're emitted, summing them over the specified granularity makes no sense. Azure Monitor limits you to selecting average, minimum, and maximum for the aggregation type for these metrics.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

| Dimension Name | Description |
|:---------------|:------------|
| EndpointName   | The endpoint name |
| EndpointType   | `eventHubs`, `serviceBusQueues`, `cosmosDB`, `serviceBusTopics`, `builtin`, or `blobStorage` |
| EventType      | `Microsoft.Devices.DeviceCreated`, `Microsoft.Devices.DeviceDeleted`, `Microsoft.Devices.DeviceConnected`, `Microsoft.Devices.DeviceDisconnected`, or `Microsoft.Devices.DeviceTelemetry` <br>For more information, see [Event types](iot-hub-event-grid.md#event-types). |
| FailureReasonCategory | One of the following: `invalid`, `dropped`, `orphaned`, or `null`. |
| Result         | Either `success` or `failure` |
| RoutingSource  | `Device Messages`, `Twin Change Events`, `Device Lifecycle Events` |

### Metrics display name and aggregation

The following tables provide more information about the metrics described in the preceding table. They show the IoT Hub platform metrics by general category and list metrics by their display name as assigned in the Azure portal.

Cloud to device command metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| C2D Messages Expired | C2DMessagesExpired | Count | Number of expired cloud-to-device messages |
| C2D message deliveries completed | c2d.commands.egress.complete.success | Count | Number of cloud-to-device message deliveries completed successfully by the device |
| C2D messages abandoned | c2d.commands.egress.abandon.success | Count | Number of cloud-to-device messages abandoned by the device |
| C2D messages rejected | c2d.commands.egress.reject.success | Count | Number of cloud-to-device messages rejected by the device |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Cloud to device direct methods metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed direct method invocations | c2d.methods.failure | Count | The count of all failed direct method calls. |
| Request size of direct method invocations | c2d.methods.requestSize | Bytes | The count of all successful direct method requests. |
| Response size of direct method invocations | c2d.methods.responseSize | Bytes | The count of all successful direct method responses.|
| Successful direct method invocations | c2d.methods.success | Count | The count of all successful direct method calls. |

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Cloud to device twin operations metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin reads from back end | c2d.twin.read.failure | Count | The count of all failed back-end-initiated twin reads. |
| Failed twin updates from back end | c2d.twin.update.failure | Count | The count of all failed back-end-initiated twin updates. |
| Response size of twin reads from back end | c2d.twin.read.size | Bytes | The count of all successful back-end-initiated twin reads. |
| Size of twin updates from back end | c2d.twin.update.size | Bytes | The total size of all successful back-end-initiated twin updates. |
| Successful twin reads from back end | c2d.twin.read.success | Count | The count of all successful back-end-initiated twin reads. |
| Successful twin updates from back end | c2d.twin.update.success | Count | The count of all successful back-end-initiated twin updates. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Configurations metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Configuration Metrics | configurations | Count | Number of total CRUD operations performed for device configuration and IoT Edge deployment, on a set of target devices. Included are the number of operations that modify the device twin or module twin because of these configurations. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Daily quota metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Total device data usage | deviceDataUsage | Bytes | Bytes transferred to and from any devices connected to IotHub |
| Total device data usage (preview) | deviceDataUsageV2 | Total|Bytes transferred to and from any devices connected to IotHub |
| Total number of messages used | dailyMessageQuotaUsed | Count | Number of total messages used today. A cumulative value that is reset to zero at 00:00 UTC every day. |

For *Total number of messages used*, only minimum, maximum, and average aggregations are supported. For more information, see [Supported aggregations](#supported-aggregations).

Device metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Total devices (deprecated) | devices.totalDevices | Count | Number of devices registered to your IoT hub |
| Connected devices (deprecated) | devices.connectedDevices.allProtocol | Count | Number of devices connected to your IoT hub |
| Total devices | totalDeviceCount | Count | Number of devices registered to your IoT hub |
| Connected devices | connectedDeviceCount | Count | Number of devices connected to your IoT hub |

For *Total devices (deprecated)* and *Connected devices (deprecated)*, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

For *Total devices* and *Connected devices*, only minimum, maximum, and average aggregations are valid. For more information, see [Supported aggregations](#supported-aggregations).

*Total devices* and *Connected devices* aren't exportable via diagnostic settings.

Device telemetry metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Number of throttling errors | d2c.telemetry.ingress.sendThrottle | Count | Number of throttling errors due to device throughput throttles |
| Telemetry 'message send' attempts | d2c.telemetry.ingress.allProtocol | Count | Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub |
| Telemetry messages sent | d2c.telemetry.ingress.success | Count | Number of device-to-cloud telemetry messages sent successfully to your IoT hub |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Device to cloud twin operations metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin reads from devices | d2c.twin.read.failure | Count |The count of all failed device-initiated twin reads. |
| Failed twin updates from devices | d2c.twin.update.failure|Count | The count of all failed device-initiated twin updates. |
| Response size of twin reads from devices | d2c.twin.read.size | Bytes | The number of all successful device-initiated twin reads. |
| Size of twin updates from devices | d2c.twin.update.size | Bytes | The total size of all successful device-initiated twin updates. |
| Successful twin reads from devices | d2c.twin.read.success | Count | The count of all successful device-initiated twin reads. |
| Successful twin updates from devices | d2c.twin.update.success | Count | The count of all successful device-initiated twin updates. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Event Grid metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Event Grid deliveries | EventGridDeliveries | Count | The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid). |
| Event Grid latency | EventGridLatency | Milliseconds | The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Jobs metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Completed jobs | jobs.completed | Count | The count of all completed jobs. |
| Failed calls to list jobs | jobs.listJobs.failure | Count | The count of all failed calls to list jobs. |
| Failed creations of method invocation jobs | jobs.createDirectMethodJob.failure | Count | The count of all failed creation of direct method invocation jobs. |
| Failed creations of twin update jobs | jobs.createTwinUpdateJob.failure | Count | The count of all failed creation of twin update jobs. |
| Failed job cancellations | jobs.cancelJob.failure | Count | The count of all failed calls to cancel a job. |
| Failed job queries | jobs.queryJobs.failure | Count | The count of all failed calls to query jobs. |
| Failed jobs | jobs.failed | Count | The count of all failed jobs. |
| Successful calls to list jobs|jobs.listJobs.success | Count | The count of all successful calls to list jobs. |
| Successful creations of method invocation jobs | jobs.createDirectMethodJob.success | Count | The count of all successful creation of direct method invocation jobs. |
| Successful creations of twin update jobs | jobs.createTwinUpdateJob.<br>success | Count | The count of all successful creation of twin update jobs. |
| Successful job cancellations | jobs.cancelJob.success | Count | The count of all successful calls to cancel a job. |
| Successful job queries | jobs.queryJobs.success | Count | The count of all successful calls to query jobs. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Routing metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Routing Deliveries (preview) | RoutingDeliveries | Count | The routing delivery metric. Use the dimensions to identify the delivery status for a specific endpoint or for a specific routing source. |
| Routing Delivery Message Size In Bytes (preview) | RoutingDataSizeInBytesDelivered | Bytes | The total number of bytes routed by IoT Hub to custom endpoint and built-in endpoint. Use the dimensions to identify data size routed to a specific endpoint or for a specific routing source. |
| Routing Delivery Latency (preview) | RoutingDeliveryLatency | Milliseconds | The routing delivery latency metric. Use the dimensions to identify the latency for a specific endpoint or for a specific routing source. |
| Routing: blobs delivered to storage | d2c.endpoints.egress.storage.blobs | Count | The number of times IoT Hub routing delivered blobs to storage endpoints. |
| Routing: data delivered to storage | d2c.endpoints.egress.storage.bytes | Bytes | The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|
| Routing: message latency for Event Hubs | d2c.endpoints.latency.eventHubs | Milliseconds | The average latency (milliseconds) between message ingress to IoT Hub and message ingress into custom endpoints of type Event Hubs. Messages routes to built-in endpoint (events) aren't included. |
| Routing: message latency for Service Bus Queue | d2c.endpoints.latency.serviceBusQueues | Milliseconds | The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus queue endpoint. |
| Routing: message latency for Service Bus Topic | d2c.endpoints.latency.serviceBusTopics | Milliseconds | The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus topic endpoint. |
| Routing: message latency for messages/events | d2c.endpoints.latency.builtIn.events | Milliseconds | The average latency (milliseconds) between message ingress to IoT Hub and message ingress into the built-in endpoint (messages/events) and fallback route. |
| Routing: message latency for storage | d2c.endpoints.latency.storage | Milliseconds | The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a storage endpoint. |
| Routing: messages delivered to Event Hubs | d2c.endpoints.egress.eventHubs | Count|Total|The number of times IoT Hub routing successfully delivered messages to custom endpoints of type Event Hubs. Messages routes to built-in endpoint (events) aren't included.|None|
| Routing: messages delivered to Service Bus Queue | d2c.endpoints.egress.serviceBusQueues | Count | The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints. |
| Routing: messages delivered to Service Bus Topic | d2c.endpoints.egress.serviceBusTopics | Count | The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints. |
| Routing: messages delivered to fallback | d2c.telemetry.egress.fallback | Count | The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route. |
| Routing: messages delivered to messages/events | d2c.endpoints.egress.builtIn.events | Count | The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events) and fallback route. |
| Routing: messages delivered to storage | d2c.endpoints.egress.storage | Count | The number of times IoT Hub routing successfully delivered messages to storage endpoints. |
| Routing: telemetry messages delivered | d2c.telemetry.egress.success | Count | The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery. |
| Routing: telemetry messages dropped | d2c.telemetry.egress.dropped | Count | The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value doesn't count messages delivered to fallback route as dropped messages aren't delivered there. |
| Routing: telemetry messages incompatible | d2c.telemetry.egress.invalid | Count | The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. A message is incompatible with an endpoint when Iot Hub attempts to deliver the message to an endpoint and it fails with a non-transient error. Invalid messages aren't retried. This value doesn't include retries. |
| Routing: telemetry messages orphaned | d2c.telemetry.egress.orphaned | Count | The number of times messages were orphaned by IoT Hub routing because they didn't match any routing query, when fallback route is disabled. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Twin query metrics:

| Metric Display Name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin queries | twinQueries.failure | Count | The count of all failed twin queries. |
| Successful twin queries | twinQueries.success | Count | The count of all successful twin queries. |
| Twin queries result size | twinQueries.resultSize | Bytes | The total of the result size of all successful twin queries. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Devices/IotHubs

[!INCLUDE [Microsoft.Devices/IotHubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-devices-iothubs-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### IoT Hub Microsoft.Devices/IotHubs

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)
- [IoTHubDistributedTracing](/azure/azure-monitor/reference/tables/iothubdistributedtracing#columns)
- [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Devices resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftdevices)

## Related content

- See [Monitor Azure IoT Hub](monitor-iot-hub.md) for a description of monitoring IoT Hub.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
