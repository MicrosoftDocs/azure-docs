---
title: Use metrics to monitor Azure IoT Hub | Microsoft Docs
description: How to use Azure IoT Hub metrics to assess and monitor the overall health of your IoT hubs.
author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/24/2019
ms.author: jlian
---
<!--for build: for each metric, if you understand what it is, it's ok. otw add more info.  -->
# Understand IoT Hub metrics

IoT Hub metrics give you information about the state of the Azure IoT resources in your Azure subscription. IoT Hub metrics help you assess the overall health of the IoT Hub service and the devices connected to it. These user-facing statistics help you see what is going on with your IoT hub and help perform root-cause analysis on issues without needing to contact Azure support.

Metrics are enabled by default. You can view IoT Hub metrics from the Azure portal.

> [!NOTE]
> You can use IoT Hub metrics to view information about IoT Plug and Play devices connected to your IoT Hub. IoT Plug and Play devices are part of the [IoT Plug and Play public preview](../iot-pnp/overview-iot-plug-and-play.md).

## How to view IoT Hub metrics

1. Create an IoT hub. You can find instructions on how to create an IoT hub in the [Send telemetry from a device to IoT Hub](quickstart-send-telemetry-dotnet.md) guide.

2. Open the blade of your IoT hub. From there, click **Metrics**.
   
    ![Screenshot showing where the metrics option is in IoT Hub resource page](./media/iot-hub-metrics/enable-metrics-1.png)

3. From the metrics blade, you can view the metrics for your IoT hub and create custom views of your metrics. 
   
    ![Screenshot showing the metrics page for IoT Hub](./media/iot-hub-metrics/enable-metrics-2.png)
    
4. You can choose to send your metrics data to an Event Hubs endpoint or an Azure Storage account by clicking **Diagnostics settings**, then **Add diagnostic setting**.

   ![Screenshot showing where diagnostic settings button is](./media/iot-hub-metrics/enable-metrics-3.png)

## IoT Hub metrics and how to use them

IoT Hub provides several metrics to give you an overview of the health of your hub and the total number of connected devices. You can combine information from multiple metrics to paint a bigger picture of the state of the IoT hub. The following table describes the metrics each IoT hub tracks, and how each metric relates to the overall status of the IoT hub.

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RoutingDeliveries | Routing Delivery Attempts (preview) | Count | Total |This is the routing delivery metric. Use the dimensions to identify the delivery status for a specific endpoint or for a specific routing source.| ResourceID,<br>Result,<br>RoutingSource,<br>EndpointType,<br>FailureReasonCategory,<br>EndpointName<br>*More details on dimensions [**here**](#dimensions)*. |
|RoutingDeliveryLatency| Routing Latency (preview) | Milliseconds | Average |This is the routing delivery latency metric. Use the dimensions to identify the latency for a specific endpoint or for a specific routing source.| ResourceID,<br>RoutingSource,<br>EndpointType,<br>EndpointName<br>*More details on dimensions [**here**](#dimensions)*.|
|RoutingDataSizeInBytesDelivered| Routing Delivery Data Size In Bytes (preview)| Bytes | Total |The total number of bytes routed by IoT Hub to custom endpoint and built-in endpoint. Use the dimensions to identify data size routed to a specific endpoint or for a specific routing source.| ResourceID,<br>RoutingSource,<br>EndpointType<br>EndpointName<br>*More details on dimensions [**here**](#dimensions)*.|
|d2c.telemetry.ingress.<br>allProtocol|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|None|
|d2c.telemetry.ingress.<br>success|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|None|
|c2d.commands.egress.<br>complete.success|C2D message deliveries completed|Count|Total|Number of cloud-to-device message deliveries completed successfully by the device|None|
|c2d.commands.egress.<br>abandon.success|C2D messages abandoned|Count|Total|Number of cloud-to-device messages abandoned by the device|None|
|c2d.commands.egress.<br>reject.success|C2D messages rejected|Count|Total|Number of cloud-to-device messages rejected by the device|None|
|C2DMessagesExpired|C2D Messages Expired (preview)|Count|Total|Number of expired cloud-to-device messages|None|
|devices.totalDevices|Total devices (deprecated)|Count|Total|Number of devices registered to your IoT hub|None|
|devices.connectedDevices.<br>allProtocol|Connected devices (deprecated) |Count|Total|Number of devices connected to your IoT hub|None|
|d2c.telemetry.egress.<br>success|Routing: telemetry messages delivered|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|None|
|d2c.telemetry.egress.<br>dropped|Routing: telemetry messages dropped |Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|None|
|d2c.telemetry.egress.<br>orphaned|Routing: telemetry messages orphaned |Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing query, when fallback route is disabled.|None|
|d2c.telemetry.egress.<br>invalid|Routing: telemetry messages incompatible|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. A message is incompatible with an endpoint when Iot Hub attempts to deliver the message to an endpoint and it fails with an non transient error. Invalid messages are not retried. This value does not include retries.|None|
|d2c.telemetry.egress.<br>fallback|Routing: messages delivered to fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|None|
|d2c.endpoints.egress.<br>eventHubs|Routing: messages delivered to Event Hub|Count|Total|The number of times IoT Hub routing successfully delivered messages to custom endpoints of type Event Hub. This does not include messages routes to built-in endpoint (events).|None|
|d2c.endpoints.latency.<br>eventHubs|Routing: message latency for Event Hub|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into custom endpoints of type Event Hub. This does not include messages routes to built-in endpoint (events).|None|
|d2c.endpoints.egress.<br>serviceBusQueues|Routing: messages delivered to Service Bus Queue|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|None|
|d2c.endpoints.latency.<br>serviceBusQueues|Routing: message latency for Service Bus Queue|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus queue endpoint.|None|
|d2c.endpoints.egress.<br>serviceBusTopics|Routing: messages delivered to Service Bus Topic|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|None|
|d2c.endpoints.latency.<br>serviceBusTopics|Routing: message latency for Service Bus Topic|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus topic endpoint.|None|
|d2c.endpoints.egress.<br>builtIn.events|Routing: messages delivered to messages/events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events) and fallback route.|None|
|d2c.endpoints.latency.<br>builtIn.events|Routing: message latency for messages/events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into the built-in endpoint (messages/events) and fallback route.|None|
|d2c.endpoints.egress.<br>storage|Routing: messages delivered to storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|None|
|d2c.endpoints.latency.<br>storage|Routing: message latency for storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a storage endpoint.|None|
|d2c.endpoints.egress.<br>storage.bytes|Routing: data delivered to storage|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|None|
|d2c.endpoints.egress.<br>storage.blobs|Routing: blobs delivered to storage|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|None|
|EventGridDeliveries|Event Grid deliveries(preview)|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|ResourceId,<br/>Result,<br/>EventType|
|EventGridLatency|Event Grid latency (preview)|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|ResourceId,<br/>EventType|
|d2c.twin.read.success|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|None|
|d2c.twin.read.failure|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|None|
|d2c.twin.read.size|Response size of twin reads from devices|Bytes|Average|The number of all successful device-initiated twin reads.|None|
|d2c.twin.update.success|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|None|
|d2c.twin.update.failure|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|None|
|d2c.twin.update.size|Size of twin updates from devices|Bytes|Average|The total size of all successful device-initiated twin updates.|None|
|c2d.methods.success|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|None|
|c2d.methods.failure|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|None|
|c2d.methods.requestSize|Request size of direct method invocations|Bytes|Average|The count of all successful direct method requests.|None|
|c2d.methods.responseSize|Response size of direct method invocations|Bytes|Average|The count of all successful direct method responses.|None|
|c2d.twin.read.success|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|None|
|c2d.twin.read.failure|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|None|
|c2d.twin.read.size|Response size of twin reads from back end|Bytes|Average|The count of all successful back-end-initiated twin reads.|None|
|c2d.twin.update.success|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|None|
|c2d.twin.update.failure|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|None|
|c2d.twin.update.size|Size of twin updates from back end|Bytes|Average|The total size of all successful back-end-initiated twin updates.|None|
|twinQueries.success|Successful twin queries|Count|Total|The count of all successful twin queries.|None|
|twinQueries.failure|Failed twin queries|Count|Total|The count of all failed twin queries.|None|
|twinQueries.resultSize|Twin queries result size|Bytes|Average|The total of the result size of all successful twin queries.|None|
|jobs.createTwinUpdateJob.<br>success|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|None|
|jobs.createTwinUpdateJob.<br>failure|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|None|
|jobs.createDirectMethodJob.<br>success|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|None|
|jobs.createDirectMethodJob.<br>failure|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|None|
|jobs.listJobs.success|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|None|
|jobs.listJobs.failure|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|None|
|jobs.cancelJob.success|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|None|
|jobs.cancelJob.failure|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|None|
|jobs.queryJobs.success|Successful job queries|Count|Total|The count of all successful calls to query jobs.|None|
|jobs.queryJobs.failure|Failed job queries|Count|Total|The count of all failed calls to query jobs.|None|
|jobs.completed|Completed jobs|Count|Total|The count of all completed jobs.|None|
|jobs.failed|Failed jobs|Count|Total|The count of all failed jobs.|None|
|d2c.telemetry.ingress.<br>sendThrottle|Number of throttling errors|Count|Total|Number of throttling errors due to device throughput throttles|None|
|dailyMessageQuotaUsed|Total number of messages used|Count|Average|Number of total messages used today. This is a cumulative value that is reset to zero at 00:00 UTC every day.|None|
|deviceDataUsage|Total device data usage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|deviceDataUsageV2|Total device data usage (preview)|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|totalDeviceCount|Total devices (preview)|Count|Average|Number of devices registered to your IoT hub|None|
|connectedDeviceCount|Connected devices (preview)|Count|Average|Number of devices connected to your IoT hub|None|
|configurations|Configuration Metrics|Count|Total|Number of total CRUD operations performed for device configuration and IoT Edge deployment, on a set of target devices. This also includes the number of operations that modify the device twin or module twin because of these configurations.|None|

### Dimensions
Dimensions help identify more details about the metrics. Some of the routing metrics provide information per endpoint. Table below lists possible values for these dimensions.

|Dimension|Values|
|---|---|
|ResourceID|your IoT Hub resource|
|Result|success<br>failure|
|RoutingSource|Device Messages<br>Twin Change Events<br>Device Lifecycle Events|
|EndpointType|eventHubs<br>serviceBusQueues<br>cosmosDB<br>serviceBusTopics<br>builtin<br>blobStorage|
|FailureReasonCategory|invalid<br>dropped<br>orphaned<br>null|
|EndpointName|endpoint name|

## Next steps

Now that you’ve seen an overview of IoT Hub metrics, follow this link to learn more about managing Azure IoT Hub:

* [Set up diagnostic logs](iot-hub-monitor-resource-health.md)

* [Learn how to troubleshoot message routing](troubleshoot-message-routing.md)

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide](iot-hub-devguide.md)

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)
