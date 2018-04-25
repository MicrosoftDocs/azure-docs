---
title: Compare Azure IoT Hub to Azure Event Hubs | Microsoft Docs
description: A comparison of the IoT Hub and Event Hubs Azure services highlighting functional differences and use cases. The comparison includes supported protocols, device management, monitoring, and file uploads.
services: iot-hub
documentationcenter: ''
author: kgremban
manager: timlt
editor: ''

ms.assetid: aeddea62-8302-48e2-9aad-c5a0e5f5abe9
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/01/2018
ms.author: kgremban

---
# Connecting IoT Devices to Azure: IoT Hub and Event Hubs

Azure provides services specifically developed for diverse types of connectivity and communication to help you connect your data to the power of the cloud. Both Azure IoT Hub and Azure Event Hubs are cloud services that can ingest large amounts of data and process or store that data for business insights. The two services are similar in that they both support ingestion of data with low latency and high reliability, but they are designed for different purposes. IoT Hub was developed specifically to address the unique requirements of connecting IoT devices, at-scale, to the Azure Cloud while Event Hubs was designed for big data streaming. This is why Microsoft recommends using Azure IoT Hub to connect IoT devices to Azure

Azure IoT Hub is the cloud gateway that connects IoT devices to gather data to drive business insights and automation. In addition, IoT Hub includes features that enrich the relationship between your devices and your backend systems. Bi-directional communication capabilities mean that while you receive data from devices you can also send commands and policies back to devices, for example, to update properties or invoke device management actions.  This cloud-to-device connectivity also powers the important capability of delivering cloud intelligence to your edge devices with Azure IoT Edge. The unique device-level identity provided by IoT Hub helps better secure your IoT solution from potential attacks. 

[Azure Event Hubs][Azure Event Hubs] is the big data streaming service of Azure. It is designed for high throughput data streaming scenarios where customers may send billions of requests per day. Event Hubs uses a partitioned consumer model to scale out your stream and is integrated into the big data and analytics services of Azure including Databricks, Stream Analytics, ADLS and HDInsight. With features like Event Hubs Capture and Auto-Inflate, this service is designed to support your big data apps and solutions. Additionally, IoT Hub leverages Event Hubs for its telemetry flow path, so your IoT solution also benefits from the tremendous power of Event Hubs.

To summarize, while both solutions are designed for data ingestion at a massive scale, only IoT Hub provides the rich IoT-specific capabilities that are designed for you to maximize the business value of connecting your IoT devices to the Azure cloud.  If your IoT journey is just beginning, starting with IoT Hub to support your data ingestion scenarios will assure that you have instant access to the full-featured IoT capabilities once your business and technical needs require them.

The following table provides details about how the two tiers of IoT Hub compare to Event Hubs when you're evaluating them for IoT capabilities. For more information about the standard and basic tiers of IoT Hub, see [How to choose the right IoT Hub tier][lnk-scaling].

| IoT Capability | IoT Hub standard tier | IoT Hub basic tier | Event Hubs |
| --- | --- | --- | --- |
| Device-to-cloud messaging | ![Check][1] | ![Check][1] | ![Check][1] |
| Protocols: HTTPS, AMQP, AMQP over websockets | ![Check][1] | ![Check][1] | ![Check][1] |
| Protocols: MQTT, MQTT over websockets | ![Check][1] | ![Check][1] |  |
| Per-device identity | ![Check][1] | ![Check][1] |  |
| File upload from devices | ![Check][1] | ![Check][1] |  |
| Device Provisioning Service | ![Check][1] | ![Check][1] |  |
| Cloud-to-device messaging | ![Check][1] |  |  |
| Device twin and device management | ![Check][1] |  |  |
| IoT Edge | ![Check][1] |  |  |

Even if the only use case is device-to-cloud data ingestion, we highly recommend using IoT Hub as it provides a service that is designed for IoT device connectivity. 

### Next steps

To further explore the capabilities of IoT Hub, see the [IoT Hub developer guide][lnk-devguide]


[Azure Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md

<!--Image references-->
[1]: ./media/iot-hub-compare-event-hubs/ic195031.png
