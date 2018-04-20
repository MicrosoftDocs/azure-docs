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
# Comparison of Azure IoT Hub and Azure Event Hubs

Both Azure IoT Hub and Azure Event Hubs are cloud services that can ingest large amounts of data and process or store that data for business insights. The two services are similar in that they both support process event and telemetry data with low latency and high reliability. However, only IoT Hub was developed with the specific capabilities needed to support at-scale internet of things scenarios. 

Azure IoT Hub is the cloud gateway that connects devices and gathers data for business insights and automation. It makes it easy to stream data to the cloud and manage your devices at scale. An important differentiator between IoT Hub and other data ingestion services is that IoT Hub includes features that enrich the relationship between your devices and your backend systems. Bi-directional communication capabilities mean that while you receive data from devices you can also send messages back to devices to update properties or invoke an action. Device-level identity helps to secure your system. Distributed computing moves cloud service logic onto edge devices.

[Azure Event Hubs][Azure Event Hubs] is an event ingestion service that can process and store large amounts of data and telemetry. Event Hubs is designed for event ingestion at a massive scale, both in the context of inter-datacenter and intra-datacenter scenarios but doesn’t provide the rich IoT-specific capabilities that are available with IoT Hub. For that reason, we do not recommend Event Hubs for your IoT solutions. 

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