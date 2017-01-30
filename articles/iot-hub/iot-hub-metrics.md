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
ms.date: 11/16/2016
ms.author: nberdy

---
# IoT Hub metrics
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

| Metric | Metric description | What the metric is used for |
| --- | --- | --- |
| d2c.telemetry.ingress.allProtocol | The count of messages sent across all devices | Overview data on message sends |
| d2c.telemetry.ingress.success | The count of all successful messages into the hub | Overview of successful message ingress into the hub |
| d2c.telemetry.egress.success | The count of all successful writes to an endpoint | Overview of message fan-out based on a user's routes |
| d2c.telemetry.egress.invalid | The count of messages not delivered due to incompatibility with the endpoint | Overview of how many failures there are writing to the user's set of endpoints. High values may indicate improperly configured endpoints. |
| d2c.telemetry.egress.dropped | The count of messages dropped because an endpoint was unhealthy | Overview of how many messages have been dropped given the current configuration of the IoT hub |
| d2c.telemetry.egress.fallback | The count of messages matching the fallback route | For users who pipe all messages to other endpoints than the built-in endpoint, this metric shows gaps in the routing setup |
| d2c.telemetry.egress.orphaned | The count of messages not matching any routes including the fallback route | Overview of how many messages are orphaned given the current configuration of the IoT Hub |
| d2c.endpoints.latency.eventHubs | The average latency between message ingress to the IoT hub and message ingress into an Event Hub endpoint, in milliseconds | The spread helps users identify poor endpoint configuration |
| d2c.endpoints.latency.serviceBusQueues | The average latency between message ingress to the IoT hub and message ingress into a Service Bus Queue endpoint, in milliseconds | The spread helps users identify poor endpoint configuration |
| d2c.endpoints.latency.serviceBusTopic | The average latency between message ingress to the IoT hub and message ingress into a Service Bus Topic endpoint, in milliseconds | The spread helps users identify poor endpoint configuration |
| d2c.endpoints.latency.builtIn.events | The average latency between message ingress to the IoT hub and message ingress into the built-in endpoint (messages/events), in milliseconds | The spread helps users identify poor endpoint configuration |
| c2d.commands.egress.complete.success | The count of all command messages completed by the receiving device across all devices |Together with the metrics on abandon and reject, gives an overview of overall cloud-to-device command success rate |
| c2d.commands.egress.abandon.success | The count of all messages successfully abandoned by the receiving device across all devices |Highlights potential issues if messages are getting abandoned more often than expected |
| c2d.commands.egress.reject.success | The count of all messages successfully rejected by the receiving device across all devices |Highlights potential issues if messages are getting rejected more often than expected |
| devices.totalDevices | The count of the number of devices registered to the IoT hub |The number of devices registered to the hub |
| devices.connectedDevices.allProtocol | The count of the number of simultaneous connected devices |Overview of the number of devices connected to the hub |

## Next steps
Now that you’ve seen an overview of IoT Hub metrics, follow this link to learn more about managing Azure IoT Hub:

* [Operations monitoring][lnk-monitor]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

<!-- Links and images -->
[1]: media/iot-hub-metrics/enable-metrics-1.png
[2]: media/iot-hub-metrics/enable-metrics-2.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-operations-monitoring]: iot-hub-operations-monitoring.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-dr]: iot-hub-ha-dr.md

[lnk-monitor]: iot-hub-operations-monitoring.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
