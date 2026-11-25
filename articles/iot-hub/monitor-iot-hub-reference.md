---
title: Monitoring data reference for Azure IoT Hub
description: This article contains important reference material you need when you monitor the Azure IoT Hub service.
ms.date: 11/11/2026
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
---

# Azure IoT Hub monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure IoT](monitor-iot-hub.md) for details on the data you can collect for IoT Hub and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Devices/IoTHubs

The following table lists the metrics available for the Microsoft.Devices/IoTHubs resource type.

> [!IMPORTANT]
> The resource-type catalog isn't a feature-support matrix for every connection
> profile. For hubs with the MQTT v5 connection profile, read the profile
> callouts in this article and check [MQTT v5 capabilities](mqtt-v5-capabilities.md).
> Built-in endpoint routing, fallback routing, jobs, automatic device
> configurations, and queued cloud-to-device messages aren't supported in this
> preview. Their metrics aren't applicable, even if definitions or values appear.
> Direct methods and twin operations are separate from queued cloud-to-device messages.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Devices/IoTHubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-devices-iothubs-metrics-include.md)]

### Investigate routing and throttling together

Use **Number of throttled requests** (`throttledRequests`) with its
**Throttle Type** (`ThrottleType`) dimension to identify which operations are
being throttled. Filter or split this metric by throttle type, then correlate
the results with routing and destination evidence over the same UTC window.
The dimension identifies the operation category, not a routing destination or
an error code.

The metric and its **Throttle Type** dimension are available for both
classic-profile IoT hubs and hubs using the MQTT v5 connection profile.

> [!NOTE]
> **MQTT v5:** Select a `ThrottleType` for an operation supported by the
> connection profile. Correlate the metric with service responses, SDK errors,
> and resource logs over the same UTC window. A missing series isn't evidence
> that no throttling occurred, and a request-throttling count isn't a measure
> of the hub's throughput entitlement.

| Metric property | Value |
| --- | --- |
| API name | `throttledRequests` |
| Display name | Number of throttled requests |
| Unit | Count |
| Default aggregation | Total |
| Supported aggregations | Average, Minimum, Maximum, Total |
| Dimension API name | `ThrottleType` |
| Dimension display name | Throttle Type |

Use **Total** to investigate the number of throttled requests during the selected
window. The metric includes supported request-throttling failures, not only
telemetry ingress throttling. Successfully delayed requests aren't counted
merely because they waited for capacity.

The reported operation categories include:

| `ThrottleType` value | Operation category |
| --- | --- |
| `DeviceEvent` | Device-to-cloud telemetry sends |
| `C2DSend`, `C2DReceive` | Cloud-to-device message sends and receives |
| `Crud` | Device identity registry operations |
| `AmqpLinkOpen`, `MqttConnect` | AMQP link opens and MQTT connection attempts |
| `JobCrud` | Job management operations |
| `FileUpload`, `FileUploadCompletion` | File upload requests and completion notifications |
| `TwinGet`, `TwinWrite` | Twin reads and writes |
| `TwinDeviceMethod` | Direct method invocations |
| `Query` | Queries |
| `DeviceStreams` | Device stream requests |
| `CredentialManagement` | Credential management operations |

Each hub reports throttle types for the operations supported by its connection
profile.

Use the metric's API name, unit, supported aggregation and dimensions rather
than inferring behavior from its display name. The following signals already
appear in this reference and provide complementary evidence; they aren't a list
of new metrics for this release:

| Metric API name | Unit | Investigation |
| --- | --- | --- |
| `d2c.telemetry.ingress.sendThrottle` | Count | Correlate telemetry-throttling signals with SDK errors and attempted publish rate. See [MQTT v5 telemetry interpretation](#mqtt-v5-telemetry-interpretation). |
| `RoutingDeliveries` | Count | What delivery outcomes are reported for the selected destination and routing source? For MQTT v5 counting caveats, see [MQTT v5 routing interpretation](#mqtt-v5-routing-interpretation). |
| `RoutingDataSizeInBytesDelivered` | Bytes | How much routed data is delivered? Don't equate routed bytes with a count of unique device messages. |
| `RoutingDeliveryLatency` | Milliseconds | Is delivery latency increasing for the relevant endpoint or source? Don't sum latency samples. |

Discover the definitions for the actual hub before configuring a query or alert:

```powershell
$hubId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Devices/IotHubs/<hub-name>"
az monitor metrics list-definitions --resource $hubId --output json
```

Select dimensions returned for that metric, such as an endpoint or routing source
where supported. Don't assume every metric supports every dimension in the
service-wide list. Compare ingress, delivery outcomes and destination observations
over the same UTC window.

Ingress throttling and a destination delivery failure aren't interchangeable.
Likewise, a metric aggregated across all endpoints can hide a failure at one
endpoint. Check the receiving application for a uniquely identified message
before declaring end-to-end success.

A missing series isn't a zero value. Check support for the operation/profile,
time range, filters, permissions and ingestion delay. For MQTT v5, use the
[connection-profile considerations](monitor-iot-hub.md#monitoring-the-mqtt-v5-connection-profile) rather
than assuming that the complete general metric catalog applies.

For an evidence-driven investigation with supported tools, see
[Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md).

### Supported aggregations

The **Aggregation Type** column in the table corresponds to the default aggregation that is used when the metric is selected for a chart or alert.

:::image type="content" source="./media/monitor-iot-hub-reference/aggregation-type.png" alt-text="Screenshot showing aggregation for metrics.":::

For most metrics, all aggregation types are valid. For count metrics with a **Unit** column value of **Count**, only some aggregations are valid. Count metrics can be one of two types:

- For **Single-point** count metrics, IoT Hub registers a single data point (essentially a 1) every time the measured operation occurs. Azure Monitor then sums these data points over the specified granularity. Examples of **Single-point** metrics are *Telemetry messages sent* and *C2D message deliveries completed*. For these metrics, the only relevant aggregation type is Total (Sum). The portal allows you to choose minimum, maximum, and average. These values are always 1.

- For **Snapshot** count metrics, IoT Hub registers a total count when the measured operation occurs. Currently, there are three **Snapshot** metrics emitted by IoT Hub: *Total number of messages used*, *Total devices*, and *Connected devices*. Because these metrics present a "total" quantity every time, summing them over the specified granularity makes no sense. Azure Monitor limits you to selecting average, minimum, and maximum for the aggregation type for these metrics.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

| Dimension Name | Description |
| :--- | :--- |
| EndpointName | The endpoint name |
| EndpointType | `eventHubs`, `serviceBusQueues`, `cosmosDB`, `serviceBusTopics`, `builtin`, or `blobStorage` |
| EventType | `Microsoft.Devices.DeviceCreated`, `Microsoft.Devices.DeviceDeleted`, `Microsoft.Devices.DeviceConnected`, `Microsoft.Devices.DeviceDisconnected`, or `Microsoft.Devices.DeviceTelemetry` <br>For more information, see [Event types](iot-hub-event-grid.md#event-types). |
| FailureReasonCategory | One of the following values: `invalid`, `dropped`, `orphaned`, or `null`. |
| Result | Either `success` or `failure` |
| RoutingSource | `Device Messages`, `Twin Change Events`, `Device Lifecycle Events` |
| ThrottleType | The operation category for the `throttledRequests` metric, such as `DeviceEvent`, `MqttConnect`, `TwinGet`, or `TwinWrite`. Available values depend on the operations supported by the hub's connection profile. For the operation categories, see [Investigate routing and throttling together](#investigate-routing-and-throttling-together). |

<a name="device-telemetry-metrics"></a><a name="routing-metrics"></a><a name="device-metrics"></a>
### Metrics display name and aggregation

The following tables provide more information about the metrics described in the preceding table. They show the IoT Hub platform metrics by general category and list metrics by their display name as assigned in the Azure portal.

Cloud to device command metrics:

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| C2D Messages Expired | C2DMessagesExpired | Count | Number of expired cloud-to-device messages |
| C2D message deliveries completed | c2d.commands.egress.complete.success | Count | Number of cloud-to-device message deliveries completed successfully by the device |
| C2D messages abandoned | c2d.commands.egress.abandon.success | Count | Number of cloud-to-device messages abandoned by the device |
| C2D messages rejected | c2d.commands.egress.reject.success | Count | Number of cloud-to-device messages rejected by the device |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Cloud to device direct methods metrics:

> [!NOTE]
> **MQTT v5:** The `c2d.methods.success` and `c2d.methods.failure` counters
> describe direct-method invocations, not queued cloud-to-device delivery.
> Correlate them with the service invocation result and the device response.
> `c2d.methods.requestSize` and `c2d.methods.responseSize` describe sizes in
> bytes, not invocation counts; use the aggregation exposed for each metric.

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed direct method invocations | c2d.methods.failure | Count | The count of all failed direct method calls. |
| Request size of direct method invocations | c2d.methods.requestSize | Bytes | The count of all successful direct method requests. |
| Response size of direct method invocations | c2d.methods.responseSize | Bytes | The count of all successful direct method responses.|
| Successful direct method invocations | c2d.methods.success | Count | The count of all successful direct method calls. |

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Cloud to device twin operations metrics:

> [!NOTE]
> **MQTT v5:** The `c2d.twin.read.*` and `c2d.twin.update.*` metrics describe
> service-initiated twin operations. Don't use them to count device-initiated
> MQTT twin requests. Correlate success and failure counters with the service
> HTTP response, and verify the resulting twin state separately. The `.size`
> metrics measure bytes, not the number of operations.

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin reads from back end | c2d.twin.read.failure | Count | The count of all failed back-end-initiated twin reads. |
| Failed twin updates from back end | c2d.twin.update.failure | Count | The count of all failed back-end-initiated twin updates. |
| Response size of twin reads from back end | c2d.twin.read.size | Bytes | The count of all successful back-end-initiated twin reads. |
| Size of twin updates from back end | c2d.twin.update.size | Bytes | The total size of all successful back-end-initiated twin updates. |
| Successful twin reads from back end | c2d.twin.read.success | Count | The count of all successful back-end-initiated twin reads. |
| Successful twin updates from back end | c2d.twin.update.success | Count | The count of all successful back-end-initiated twin updates. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Configurations metrics:

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Configuration Metrics | configurations | Count | Number of total CRUD operations performed for device configuration and IoT Edge deployment, on a set of target devices. Included are the number of operations that modify the device twin or module twin because of these configurations. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Daily quota metrics:

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Total device data usage | deviceDataUsage | Bytes | Bytes transferred to and from any devices connected to IotHub |
| Total device data usage (preview) | deviceDataUsageV2 | Total|Bytes transferred to and from any devices connected to IotHub |
| Total number of messages used | dailyMessageQuotaUsed | Count | Number of total messages used today. A cumulative value that is reset to zero at 00:00 UTC every day. |

For *Total number of messages used*, only minimum, maximum, and average aggregations are supported. For more information, see [Supported aggregations](#supported-aggregations).

> [!NOTE]
> **MQTT v5:** Populated `deviceDataUsage` or `deviceDataUsageV2` values don't
> establish per-operation billing attribution or an invoice amount.
> `dailyMessageQuotaUsed` is the legacy daily-message quota gauge, not a
> validation of an MQTT v5 consumption-billing meter. Don't derive MQTT v5
> billing, throughput entitlements, or supported scale limits from these values.

Device metrics:

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Total devices (deprecated) | devices.totalDevices | Count | Number of devices registered to your IoT hub |
| Connected devices (deprecated) | devices.connectedDevices.allProtocol | Count | Number of devices connected to your IoT hub |
| Total devices | totalDeviceCount | Count | Number of devices registered to your IoT hub |
| Connected devices | connectedDeviceCount | Count | Number of devices connected to your IoT hub |

For *Total devices (deprecated)* and *Connected devices (deprecated)*, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

For *Total devices* and *Connected devices*, only minimum, maximum, and average aggregations are valid. For more information, see [Supported aggregations](#supported-aggregations).

*Total devices* and *Connected devices* aren't exportable via diagnostic settings.

#### MQTT v5 connection and inventory interpretation

| Metric API name | MQTT v5 interpretation |
| --- | --- |
| `connect.success` | Inspect the operation and protocol dimensions before treating an aggregate as a device-connect count. Service HTTP activity and device MQTT connection events aren't interchangeable. Correlate the selected series with device SDK session state. |
| `connectedDeviceCount` | A window average can be fractional when a device is connected for only part of the window. It isn't a fractional device, the current count, or the peak. Inspect the time series and supported aggregation, and correlate with SDK session state. |
| `totalDeviceCount` | A window average can fall between inventory counts when devices are created or deleted during the interval. Use the registry to verify current inventory; don't interpret the chart summary as an exact current count. |
| `devices.connectedDevices.allProtocol`, `devices.totalDevices` | These are deprecated variants. Prefer `connectedDeviceCount` and `totalDeviceCount` for new monitoring. Don't transfer aggregation assumptions between the deprecated and current metrics or use a chart-window summary as current inventory. |

Device telemetry metrics:

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Number of throttling errors | d2c.telemetry.ingress.sendThrottle | Count | Number of throttling errors due to device throughput throttles |
| Telemetry 'message send' attempts | d2c.telemetry.ingress.allProtocol | Count | Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub |
| Telemetry messages sent | d2c.telemetry.ingress.success | Count | Number of device-to-cloud telemetry messages sent successfully to your IoT hub |

#### MQTT v5 telemetry interpretation

| Metric API name | MQTT v5 callout |
| --- | --- |
| `d2c.telemetry.ingress.allProtocol` | Distinguish attempted publishes from accepted publishes and delivered messages. Correlate the metric with the device's attempted publish rate and SDK outcomes rather than using a chart value alone to determine device activity. |
| `d2c.telemetry.ingress.success` | Ingress success isn't proof of routing or application receipt. Compare publish outcomes, routing results, and independently identified messages at the destination over the same interval. |
| `d2c.telemetry.ingress.sendThrottle` | Distinguish telemetry-send throttling from authentication, topic authorization, and routing failures. Correlate with SDK responses; don't infer a broker enforcement threshold from a zero count or a successful bounded publishing test. |

For an end-to-end check, see [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run).

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Device to cloud twin operations metrics:

> [!NOTE]
> **MQTT v5:** Use `d2c.twin.read.success` and `d2c.twin.read.failure` for
> device-initiated reads, and `d2c.twin.update.success` and
> `d2c.twin.update.failure` for device-initiated reported-property updates.
> A failed read can be recorded by the service without a corresponding device
> error response. Correlate SDK timeouts or missing responses with resource logs;
> don't assume that no error response means success.
> `d2c.twin.read.size` and `d2c.twin.update.size` measure bytes, not operation
> counts. Verify resulting twin state when testing an update.

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin reads from devices | d2c.twin.read.failure | Count |The count of all failed device-initiated twin reads. |
| Failed twin updates from devices | d2c.twin.update.failure|Count | The count of all failed device-initiated twin updates. |
| Response size of twin reads from devices | d2c.twin.read.size | Bytes | The number of all successful device-initiated twin reads. |
| Size of twin updates from devices | d2c.twin.update.size | Bytes | The total size of all successful device-initiated twin updates. |
| Successful twin reads from devices | d2c.twin.read.success | Count | The count of all successful device-initiated twin reads. |
| Successful twin updates from devices | d2c.twin.update.success | Count | The count of all successful device-initiated twin updates. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Event Grid metrics:

> [!NOTE]
> **MQTT v5:** `EventGridDeliveries` and `EventGridLatency` describe the separate
> IoT Hub Event Grid integration, not MQTT broker publishes. Without an applicable
> event subscription, no data is expected. Don't interpret that absence as
> missing MQTT v5 telemetry, or infer support for an Event Grid scenario from
> the metric definition alone.

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Event Grid deliveries | EventGridDeliveries | Count | The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid). |
| Event Grid latency | EventGridLatency | Milliseconds | The average latency (milliseconds) from when the IoT Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Jobs metrics:

| Metric display name | Metric | Unit | Description |
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

> [!NOTE]
> **MQTT v5:** Built-in endpoint and fallback routing metrics in the shared
> table aren't applicable to this profile. Use explicitly configured supported
> destinations. The following interpretation notes don't change those support
> boundaries.

| Metric display name | Metric | Unit | Description |
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
| Routing: messages delivered to Event Hubs | d2c.endpoints.egress.eventHubs | Count | The number of times IoT Hub routing successfully delivered messages to custom endpoints of type Event Hubs. Messages routes to built-in endpoint (events) aren't included. |
| Routing: messages delivered to Service Bus Queue | d2c.endpoints.egress.serviceBusQueues | Count | The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints. |
| Routing: messages delivered to Service Bus Topic | d2c.endpoints.egress.serviceBusTopics | Count | The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints. |
| Routing: messages delivered to fallback | d2c.telemetry.egress.fallback | Count | The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route. |
| Routing: messages delivered to messages/events | d2c.endpoints.egress.builtIn.events | Count | The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events) and fallback route. |
| Routing: messages delivered to storage | d2c.endpoints.egress.storage | Count | The number of times IoT Hub routing successfully delivered messages to storage endpoints. |
| Routing: telemetry messages delivered | d2c.telemetry.egress.success | Count | The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery. |
| Routing: telemetry messages dropped | d2c.telemetry.egress.dropped | Count | The number of times IoT Hub routing drops messages due to dead endpoints. This value doesn't count messages delivered to fallback route as dropped messages aren't delivered there. |
| Routing: telemetry messages incompatible | d2c.telemetry.egress.invalid | Count | The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. A message is incompatible with an endpoint when IoT Hub attempts to deliver the message to an endpoint and it fails with a nontransient error. Invalid messages aren't retried. This value doesn't include retries. |
| Routing: telemetry messages orphaned | d2c.telemetry.egress.orphaned | Count | The number of times IoT Hub routing orphans messages because they didn't match any routing query, when fallback route is disabled. |

#### MQTT v5 routing interpretation

| Metric API name | MQTT v5 callout |
| --- | --- |
| `d2c.telemetry.egress.success`, `RoutingDeliveries` | Count endpoint delivery outcomes, not unique device publishes. A publish routed to multiple destinations can contribute multiple copies. Split by the available endpoint, source, result, and failure dimensions so that one destination's success doesn't hide another's failure. |
| `RoutingDeliveryLatency` | Interpret latency for the selected endpoint and routing source. Don't sum latency samples or compare a mixed-destination aggregate with a single endpoint's latency. |
| `RoutingDataSizeInBytesDelivered` | Measures delivered bytes across the selected delivery paths. Fan-out can increase this value without increasing unique device publishes; don't use it as an ingress-message count or billing amount. |
| `d2c.telemetry.egress.invalid` | A broker-accepted publish can still be incompatible with a destination. One publish can produce an invalid outcome for each affected endpoint copy. Check destination limits and routing logs rather than classifying this as a broker rejection. |
| `d2c.telemetry.egress.dropped` | Describes routing drops associated with an endpoint failure, not rejected broker publishes. Inspect endpoint health and destination errors; a failing endpoint doesn't imply that every other destination failed. |
| `d2c.telemetry.egress.orphaned`, `RoutingDeliveries` with an orphaned failure outcome | Investigate messages that don't match an enabled route. MQTT v5 has no fallback route. Compare saved route conditions with identifiable test messages and independent receipt evidence; don't use an aggregate alone to account for every message. |
| `d2c.endpoints.egress.eventHubs`, `d2c.endpoints.latency.eventHubs` | Describe delivery to custom Event Hubs endpoints. These aren't MQTT broker ingress metrics or evidence of built-in endpoint support. Correlate with receipt in the configured Event Hubs destination. |
| `d2c.endpoints.egress.serviceBusQueues`, `d2c.endpoints.latency.serviceBusQueues` | Describe delivery to configured Service Bus queue endpoints. Correlate with the receiving queue; broker acceptance doesn't guarantee compatibility with that queue's configuration. |
| `d2c.endpoints.egress.serviceBusTopics`, `d2c.endpoints.latency.serviceBusTopics` | Describe delivery to configured Service Bus topic endpoints. Verify receipt through the intended subscription, accounting for its filters; topic delivery isn't proof of application processing. |
| `d2c.endpoints.egress.storage`, `d2c.endpoints.egress.storage.bytes`, `d2c.endpoints.egress.storage.blobs`, `d2c.endpoints.latency.storage` | Storage metrics reflect committed output, not each intermediate block upload. Allow for batching and commit delay. Distinguish committed message copies, bytes, blob counts, and latency; inspect stored data before declaring delivery complete. |

For exact validation, use a known set of message identifiers and a bounded
test interval. Account for fan-out and retries when comparing destination
records with device publishes. Use the destination-specific guidance when
interpreting delivery to other endpoint types.

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

Twin query metrics:

> [!NOTE]
> **MQTT v5:** `twinQueries.success` and `twinQueries.failure` describe
> service-side twin query operations, not device MQTT twin GET requests.
> A successful query can return no matching devices. Inspect the response
> before interpreting `twinQueries.resultSize`; result bytes aren't a device
> inventory count.

| Metric display name | Metric | Unit | Description |
|:---|:---|:---|:---|
| Failed twin queries | twinQueries.failure | Count | The count of all failed twin queries. |
| Successful twin queries | twinQueries.success | Count | The count of all successful twin queries. |
| Twin queries result size | twinQueries.resultSize | Bytes | The total of the result size of all successful twin queries. |

For metrics with a **Unit** value of **Count**, only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Devices/IotHubs

[!INCLUDE [Microsoft.Devices/IotHubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-devices-iothubs-logs-include.md)]

The following sections list the resource log category types and schemas collected for Azure IoT Hub. Events are emitted only for errors in some categories.

### Cloud-to-device commands category

The cloud-to-device commands category tracks errors that occur at the IoT hub and are related to the cloud-to-device message pipeline. This category includes errors that occur from:

- Sending cloud-to-device messages (like unauthorized sender errors),
- Receiving cloud-to-device messages (like delivery count exceeded errors), and
- Receiving cloud-to-device message feedback (like feedback expired errors).

This category doesn't catch errors when the cloud-to-device message is delivered successfully but then improperly handled by the device.

```json
{
    "records":
    [
        {
            "time": " UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "messageExpired",
            "category": "C2DCommands",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"deviceId\":\"<deviceId>\",\"messageId\":\"<messageId>\",\"messageSizeInBytes\":\"<messageSize>\",\"protocol\":\"Amqp\",\"deliveryAcknowledgement\":\"<None, NegativeOnly, PositiveOnly, Full>\",\"deliveryCount\":\"0\",\"expiryTime\":\"<timestamp>\",\"timeInSystem\":\"<timeInSystem>\",\"ttl\":<ttl>, \"EventProcessedUtcTime\":\"<UTC timestamp>\",\"EventEnqueuedUtcTime\":\"<UTC timestamp>\", \"maskedIpAddress\": \"<maskedIpAddress>\", \"statusCode\": \"4XX\"}",
            "location": "Resource location"
        }
    ]
}
```

### Cloud-to-device twin operations category

The cloud-to-device twin operations category tracks service-initiated events on device twins. These operations can include get twin, update or replace tags, and update or replace desired properties.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "read",
            "category": "C2DTwinOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"sdkVersion\":\"<sdkVersion>\",\"messageSize\":\"<messageSize>\"}",
            "location": "Resource location"
        }
    ]
}
```

### Device-to-cloud twin operations category

The device-to-cloud twin operations category tracks device-initiated events on device twins. These operations can include **get twin**, **update reported properties**, and **subscribe to desired properties**.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "update",
            "category": "D2CTwinOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"protocol\":\"<protocol>\",\"authenticationType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\"}",
            "location": "Resource location"
        }
    ]
}
```

### Configurations category

IoT Hub configuration logs track events and error for the Automatic Device Management feature set.

```json
{
    "records":
    [
         {
             "time": "2019-09-24T17:21:52Z",
             "resourceId": "Resource Id",
             "operationName": "ReadManyConfigurations",
             "category": "Configurations",
             "resultType": "",
             "resultDescription": "",
             "level": "Information",
             "durationMs": "17",
             "properties": "{\"configurationId\":\"\",\"sdkVersion\":\"2018-06-30\",\"messageSize\":\"0\",\"statusCode\":null}",
             "location": "southcentralus"
         }
    ]
}
```

### Connections category

The connections category tracks device connect and disconnect events from an IoT hub and errors. This category is useful for identifying unauthorized connection attempts and or alerting when you lose connection to devices.

For reliable connection status of devices, see [Monitor device connection status](monitor-device-connection-state.md).

```json
{
   "records":
   [
        {
            "time": " UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "deviceConnect",
            "category": "Connections",
            "level": "Information",
            "properties": "{\"deviceId\":\"<deviceId>\",\"sdkVersion\":\"<sdkVersion>\",\"protocol\":\"<protocol>\",\"authType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\",\"maskedIpAddress\":\"<maskedIpAddress>\"}",
            "location": "Resource location"
        }
    ]
}
```

For detailed information about using connections logs to monitor device connectivity, see [Monitor, diagnose, and troubleshoot device connectivity to Azure IoT Hub](iot-hub-troubleshoot-connectivity.md).

### Device identity operations category

The device identity operations category tracks errors that occur when you attempt to create, update, or delete an entry in your IoT hub's identity registry. Tracking this category is useful for provisioning scenarios.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "get",
            "category": "DeviceIdentityOperations",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"maskedIpAddress\":\"<maskedIpAddress>\",\"deviceId\":\"<deviceId>\", \"statusCode\":\"4XX\"}",
            "location": "Resource location"
        }
    ]
}
```

### Device streams category (preview)

The device streams category tracks request-response interactions sent to individual devices.

```json
{
    "records":
    [
         {
             "time": "2019-09-19T11:12:04Z",
             "resourceId": "Resource Id",
             "operationName": "invoke",
             "category": "DeviceStreams",
             "resultType": "",
             "resultDescription": "",    
             "level": "Information",
             "durationMs": "74",
             "properties": "{\"deviceId\":\"myDevice\",\"moduleId\":\"myModule\",\"sdkVersion\":\"2019-05-01-preview\",\"requestSize\":\"3\",\"responseSize\":\"5\",\"statusCode\":null,\"requestName\":\"myRequest\",\"direction\":\"c2d\"}",
             "location": "Central US"
         }
    ]
}
```

### Device telemetry category

The device telemetry category tracks errors that occur at the IoT hub and are related to the telemetry pipeline. This category includes errors that occur when sending telemetry events (such as throttling) and receiving telemetry events (such as unauthorized reader). This category can't catch errors caused by code running on the device itself.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "ingress",
            "category": "DeviceTelemetry",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"deviceId\":\"<deviceId>\",\"batching\":\"0\",\"messageSizeInBytes\":\"<messageSizeInBytes>\",\"EventProcessedUtcTime\":\"<UTC timestamp>\",\"EventEnqueuedUtcTime\":\"<UTC timestamp>\",\"partitionId\":\"1\"}", 
            "location": "Resource location"
        }
    ]
}
```

### Direct methods category

The direct methods category tracks request-response interactions sent to individual devices. These requests are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "send",
            "category": "DirectMethods",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":<messageSize>, \"RequestSize\": 1, \"ResponseSize\": 1, \"sdkVersion\": \"2017-07-11\"}",
            "location": "Resource location"
        }
    ]
}
```

### Distributed tracing category (preview)

The distributed tracing category tracks the correlation IDs for messages that carry the trace context header.

The `correlationId` conforms to the [W3C Trace Context](https://github.com/w3c/trace-context) proposal, where it contains a `trace-id` and a `span-id`.

#### IoT Hub D2C (device-to-cloud) logs

IoT Hub records this log when a message containing valid trace properties arrives at IoT Hub.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubD2C",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-0144d2590aacd909-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Receive message success",
            "durationMs": "",
            "properties": "{\"messageSize\": 1, \"deviceId\":\"<deviceId>\", \"callerLocalTimeUtc\": : \"2017-02-22T03:27:28.633Z\", \"calleeLocalTimeUtc\": \"2017-02-22T03:27:28.687Z\"}",
            "location": "Resource location"
        }
    ]
}
```

> [!NOTE]
> Here, `durationMs` isn't calculated as IoT Hub's clock might not be in sync with the device clock, and thus a duration calculation can be misleading. We recommend writing logic using the timestamps in the `properties` section to capture spikes in device-to-cloud latency.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **messageSize** | Integer | The size of device-to-cloud message in bytes |
| **deviceId** | String of ASCII 7-bit alphanumeric characters | The identity of the device |
| **callerLocalTimeUtc** | UTC timestamp | The creation time of the message as reported by the device local clock |
| **calleeLocalTimeUtc** | UTC timestamp | The time of message arrival at the IoT Hub's gateway as reported by IoT Hub service side clock |

#### IoT Hub ingress logs

IoT Hub records this log when message containing valid trace properties writes to internal or built-in Event Hubs.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubIngress",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-349810a9bbd28730-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Ingress message success",
            "durationMs": "10",
            "properties": "{\"isRoutingEnabled\": \"true\", \"parentSpanId\":\"0144d2590aacd909\"}",
            "location": "Resource location"
        }
    ]
}
```

In the `properties` section, this log contains additional information about message ingress.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **isRoutingEnabled** | String | Either true or false, indicates whether or not message routing is enabled in the IoT Hub |
| **parentSpanId** | String | The [span-id](https://w3c.github.io/trace-context/#parent-id) of the parent message, which would be the D2C message trace in this case |

#### IoT Hub egress logs

IoT Hub records this log when [routing](iot-hub-devguide-messages-d2c.md) is enabled and the message is written to an [endpoint](iot-hub-devguide-endpoints.md). If routing isn't enabled, IoT Hub doesn't record this log.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubEgress",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-98ac3578922acd26-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Egress message success",
            "durationMs": "10",
            "properties": "{\"endpointType\": \"EventHub\", \"endpointName\": \"myEventHub\", \"parentSpanId\":\"349810a9bbd28730\"}",
            "location": "Resource location"
        }
    ]
}
```

In the `properties` section, this log contains additional information about message ingress.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **endpointName** | String | The name of the routing endpoint |
| **endpointType** | String | The type of the routing endpoint |
| **parentSpanId** | String | The [span-id](https://w3c.github.io/trace-context/#parent-id) of the parent message, which would be the IoT Hub ingress message trace in this case |

### File upload operations category

The file upload category tracks errors that occur at the IoT hub and are related to file upload functionality. This category includes:

- Errors that occur with the SAS URI, such as when it expires before a device notifies the hub of a completed upload.
- Failed uploads reported by the device.
- Errors that occur when a file isn't found in storage during IoT Hub notification message creation.

This category can't catch errors that directly occur while the device is uploading a file to storage.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "ingress",
            "category": "FileUploadOperations",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"protocol\":\"<protocol>\",\"authType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\",\"blobUri\":\"http//bloburi.com\"}",
            "location": "Resource location"
        }
    ]
}
```

### Jobs operations category

The jobs operations category reports on job requests to update device twins or invoke direct methods on multiple devices. These requests are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "jobCompleted",
            "category": "JobsOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"jobId\":\"<jobId>\", \"sdkVersion\": \"<sdkVersion>\",\"messageSize\": <messageSize>,\"filter\":\"DeviceId IN ['1414ded9-b445-414d-89b9-e48e8c6285d5']\",\"startTimeUtc\":\"Wednesday, September 13, 2017\",\"duration\":\"0\"}",
            "location": "Resource location"
        }
    ]
}
```

### Routes category

The [message routing](./iot-hub-devguide-messages-d2c.md) category tracks errors that occur during message route evaluation and endpoint health as perceived by IoT Hub. This category includes events such as:

- A rule evaluates to "undefined"
- IoT Hub marks an endpoint as dead
- Any errors received from an endpoint

This category doesn't include specific errors about the messages themselves (like device throttling errors), which are reported under the "device telemetry" category.

```json
{
    "records":
    [
        {
            "time":"2019-12-12T03:25:14Z",
            "resourceId":"/SUBSCRIPTIONS/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1/RESOURCEGROUPS/ANON-TEST/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/ANONHUB1",
            "operationName":"endpointUnhealthy",
            "category":"Routes",
            "level":"Error",
            "resultType":"403004",
            "resultDescription":"DeviceMaximumQueueDepthExceeded",
            "properties":"{\"deviceId\":null,\"endpointName\":\"anon-sb-1\",\"messageId\":null,\"details\":\"DeviceMaximumQueueDepthExceeded\",\"routeName\":null,\"statusCode\":\"403\"}",
            "location":"westus"
        }
    ]
}
```

Here are more details on routing resource logs:

- [List of routing resource log error codes](troubleshoot-message-routing.md#diagnostics-error-codes)
- [List of routing resource logs operationNames](troubleshoot-message-routing.md#diagnostics-operation-names)

### Twin queries category

The twin queries category reports on query requests for device twins that are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "query",
            "category": "TwinQueries",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"query\":\"<twin query>\",\"sdkVersion\":\"<sdkVersion>\",\"messageSize\":\"<messageSize>\",\"pageSize\":\"<pageSize>\", \"continuation\":\"<true, false>\", \"resultSize\":\"<resultSize>\"}",
            "location": "Resource location"
        }
    ]
}
```

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
