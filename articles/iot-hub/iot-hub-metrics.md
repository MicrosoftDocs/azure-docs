---
title: Use metrics to monitor Azure IoT Hub | Microsoft Docs
description: How to use Azure IoT Hub metrics to assess and monitor the overall health of your IoT hubs.
services: iot-hub
documentationcenter: ''
author: nberdy
manager: timlt
editor: ''

ms.assetid: a47108fd-f994-4105-b21d-5b8f697b699c
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/22/2017
ms.author: nberdy
ms.custom: H1Hack27Feb2017

---
# Understand IoT Hub metrics
IoT Hub metrics give you better data about the state of the Azure IoT resources in your Azure subscription. IoT Hub metrics enable you to assess the overall health of the IoT Hub service and the devices connected to it. User-facing statistics are important because they help you see what is going on with your IoT hub and help root-cause issues without needing to contact Azure support.

Metrics are enabled by default. You can view IoT Hub metrics from the Azure portal.

## How to view IoT Hub metrics
1. Create an IoT hub. You can find instructions on how to create an IoT hub in the [Get Started][lnk-get-started] guide.
2. Open the blade of your IoT hub. From there, click **Metrics**.
   
    ![][1]
3. From the metrics blade, you can view the metrics for your IoT hub and create custom views of your metrics. You can choose to send your metrics data to an Event Hubs endpoint or an Azure Storage account by clicking **Diagnostics settings**.
   
    ![][2]

## IoT Hub metrics and how to use them
IoT Hub provides several metrics to give you an overview of the health of your hub and the total number of connected devices. You can combine information from multiple metrics to paint a bigger picture of the state of the IoT hub. The following table describes the metrics each IoT hub tracks, and how each metric relates to the overall status of the IoT hub.

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|d2c.telemetry.ingress.allProtocol|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|
|d2c.telemetry.ingress.success|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|
|c2d.commands.egress.complete.success|Commands completed|Count|Total|Number of cloud-to-device commands completed successfully by the device|
|c2d.commands.egress.abandon.success|Commands abandoned|Count|Total|Number of cloud-to-device commands abandoned by the device|
|c2d.commands.egress.reject.success|Commands rejected|Count|Total|Number of cloud-to-device commands rejected by the device|
|devices.totalDevices|Total devices|Count|Total|Number of devices registered to your IoT hub|
|devices.connectedDevices.allProtocol|Connected devices|Count|Total|Number of devices connected to your IoT hub|
|d2c.telemetry.egress.success|Telemetry messages delivered|Count|Total|Number of times messages were successfully written to endpoints (total)|
|d2c.telemetry.egress.dropped|Dropped messages|Count|Total|Number of messages dropped because they did not match any routes and the fallback route was disabled|
|d2c.telemetry.egress.orphaned|Orphaned messages|Count|Total|The count of messages not matching any routes including the fallback route|
|d2c.telemetry.egress.invalid|Invalid messages|Count|Total|The count of messages not delivered due to incompatibility with the endpoint|
|d2c.telemetry.egress.fallback|Messages matching fallback condition|Count|Total|Number of messages written to the fallback endpoint|
|d2c.endpoints.egress.eventHubs|Messages delivered to Event Hub endpoints|Count|Total|Number of times messages were successfully written to Event Hub endpoints|
|d2c.endpoints.latency.eventHubs|Message latency for Event Hub endpoints|Milliseconds|Average|The average latency between message ingress to the IoT hub and message ingress into an Event Hub endpoint, in milliseconds|
|d2c.endpoints.egress.serviceBusQueues|Messages delivered to Service Bus Queue endpoints|Count|Total|Number of times messages were successfully written to Service Bus Queue endpoints|
|d2c.endpoints.latency.serviceBusQueues|Message latency for Service Bus Queue endpoints|Milliseconds|Average|The average latency between message ingress to the IoT hub and message ingress into a Service Bus Queue endpoint, in milliseconds|
|d2c.endpoints.egress.serviceBusTopics|Messages delivered to Service Bus Topic endpoints|Count|Total|Number of times messages were successfully written to Service Bus Topic endpoints|
|d2c.endpoints.latency.serviceBusTopics|Message latency for Service Bus Topic endpoints|Milliseconds|Average|The average latency between message ingress to the IoT hub and message ingress into a Service Bus Topic endpoint, in milliseconds|
|d2c.endpoints.egress.builtIn.events|Messages delivered to the built-in endpoint (messages/events)|Count|Total|Number of times messages were successfully written to the built-in endpoint (messages/events)|
|d2c.endpoints.latency.builtIn.events|Message latency for the built-in endpoint (messages/events)|Milliseconds|Average|The average latency between message ingress to the IoT hub and message ingress into the built-in endpoint (messages/events), in milliseconds |
|d2c.twin.read.success|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|
|d2c.twin.read.failure|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|
|d2c.twin.read.size|Response size of twin reads from devices|Bytes|Average|The average, min, and max of all successful device-initiated twin reads.|
|d2c.twin.update.success|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|
|d2c.twin.update.failure|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|
|d2c.twin.update.size|Size of twin updates from devices|Bytes|Average|The average, min, and max size of all successful device-initiated twin updates.|
|c2d.methods.success|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|
|c2d.methods.failure|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|
|c2d.methods.requestSize|Request size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method requests.|
|c2d.methods.responseSize|Response size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method responses.|
|c2d.twin.read.success|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|
|c2d.twin.read.failure|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|
|c2d.twin.read.size|Response size of twin reads from back end|Bytes|Average|The average, min, and max of all successful back-end-initiated twin reads.|
|c2d.twin.update.success|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|
|c2d.twin.update.failure|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|
|c2d.twin.update.size|Size of twin updates from back end|Bytes|Average|The average, min, and max size of all successful back-end-initiated twin updates.|
|twinQueries.success|Successful twin queries|Count|Total|The count of all successful twin queries.|
|twinQueries.failure|Failed twin queries|Count|Total|The count of all failed twin queries.|
|twinQueries.resultSize|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|
|jobs.createTwinUpdateJob.success|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|
|jobs.createTwinUpdateJob.failure|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|
|jobs.createDirectMethodJob.success|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|
|jobs.createDirectMethodJob.failure|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|
|jobs.listJobs.success|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|
|jobs.listJobs.failure|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|
|jobs.cancelJob.success|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|
|jobs.cancelJob.failure|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|
|jobs.queryJobs.success|Successful job queries|Count|Total|The count of all successful calls to query jobs.|
|jobs.queryJobs.failure|Failed job queries|Count|Total|The count of all failed calls to query jobs.|
|jobs.completed|Completed jobs|Count|Total|The count of all completed jobs.|
|jobs.failed|Failed jobs|Count|Total|The count of all failed jobs.|

## Next steps
Now that you’ve seen an overview of IoT Hub metrics, follow this link to learn more about managing Azure IoT Hub:

* [Operations monitoring][lnk-monitor]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with Azure IoT Edge][lnk-iotedge]

<!-- Links and images -->
[1]: media/iot-hub-metrics/enable-metrics-1.png
[2]: media/iot-hub-metrics/enable-metrics-2.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-operations-monitoring]: iot-hub-operations-monitoring.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-dr]: iot-hub-ha-dr.md

[lnk-monitor]: iot-hub-operations-monitoring.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: iot-hub-linux-iot-edge-simulated-device.md
