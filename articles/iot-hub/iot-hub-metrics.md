<properties
 pageTitle="IoT Hub diagnostic metrics"
 description="An overview of Azure IoT Hub metrics, enabling users to assess the overall health of their resource"
 services="iot-hub"
 documentationCenter=""
 authors="nberdy"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="08/11/2016"
 ms.author="nberdy"/>

# Introduction to diagnostic metrics

Diagnostic metrics give you better data about the state of the Azure resources in your subscription. Metrics enable you to assess the overall health of the service and the devices connected to it. User-facing statistics are important because they help you see what is going on with your IoT hub and help root-cause issues without needing to contact Azure support.

You can enable diagnostic metrics from the Azure portal.

## How to enable diagnostic metrics

1. Create an IoT hub. You can find instructions on how to create an IoT hub in the [Get Started][lnk-get-started] guide.

2. Open the blade of your IoT hub. From there, click **Diagnostics**.

    ![][1]

3. Configure your diagnostics by setting the status to **On** and selecting a storage account to store the diagnostics data. Check **Metrics**, and then press **Save**. Note that the storage account must be created ahead of time and that you are charged separately for storage. You can also choose to send your diagnostics data to an Event Hubs endpoint.

    ![][2]

4. After you have set up the diagnostics, return to the **Overview** IoT hub blade. Metrics information is populated in the **Monitoring** section of the blade. Clicking the chart opens the metrics pane where you can view a summary of the metrics information for your IoT hub and edit the selection of metrics shown in the chart. You can also configure alerts based on metric values.

    ![][3]

## Metrics and how to use them

IoT Hub provides several metrics to give you an overview of the health of your hub and the total number of devices connected to it. You can combine information from multiple metrics to paint a bigger picture of the state of the IoT hub. The following table describes the metrics each IoT hub tracks, and how each metric relates to the overall status of the IoT hub.

| Metric | Metric description | What the metric is used for |
| ---- | ---- | ---- |
| d2c.telemetry.ingress.allProtocol | The count of messages sent across all devices | Overview data on message sends |
| d2c.telemetry.ingress.success | The count of all successful messages into the hub | Overview of successful message ingress into the hub |
| c2d.commands.egress.complete.success | The count of all command messages completed by the receiving device across all devices | Together with the metrics on abandon and reject, gives an overview of overall C2D command success rate |
| c2d.commands.egress.abandon.success | The count of all messages successfully abandoned by the receiving device across all devices | Highlights potential issues if messages are getting abandoned more often than expected |
| c2d.commands.egress.reject.success | The count of all messages successfully rejected by the receiving device across all devices | Highlights potential issues if messages are getting rejected more often than expected |
| devices.totalDevices | The average, min, and max of the number of devices registered to the IoT hub | The number of devices registered to the hub |
| devices.connectedDevices.allProtocol | The average, min, and max of the number of simultaneous connected devices | Overview of the number of devices connected to the hub |

## Next steps

Now that you’ve seen an overview of diagnostic metrics, follow these links to learn more about managing Azure IoT Hub:

- [Operations monitoring][lnk-monitor]
- [Manage access to IoT Hub][lnk-itpro]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]

<!-- Links and images -->
[1]: media/iot-hub-metrics/enable-metrics-1.png
[2]: media/iot-hub-metrics/enable-metrics-2.png
[3]: media/iot-hub-metrics/enable-metrics-3.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-operations-monitoring]: iot-hub-operations-monitoring.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-dr]: iot-hub-ha-dr.md

[lnk-monitor]: iot-hub-operations-monitoring.md
[lnk-itpro]: iot-hub-itpro-info.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
