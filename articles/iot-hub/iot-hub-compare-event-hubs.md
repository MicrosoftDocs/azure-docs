---
title: Compare Azure IoT Hub to Azure Event Hubs
description: A comparison of the IoT Hub and Event Hubs Azure services highlighting functional differences and use cases. The comparison includes supported protocols, device management, monitoring, and file uploads.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: product-comparison
ms.date: 11/21/2022
ms.custom:  [amqp, mqtt, 'Role: Cloud Development', 'Role: System Architecture']
---

# Connecting IoT Devices to Azure: IoT Hub and Event Hubs

Azure provides services developed for diverse types of connectivity and communication to help you connect your data to the power of the cloud. Both Azure IoT Hub and Azure Event Hubs are cloud services that can ingest large amounts of data and process or store that data for business insights. The two services are similar in that they both support ingestion of data with low latency and high reliability, but they're designed for different purposes. IoT Hub was developed to address the unique requirements of connecting IoT devices to the Azure cloud while Event Hubs was designed for big data streaming. Microsoft recommends using Azure IoT Hub to connect IoT devices to Azure

Azure IoT Hub is the cloud gateway that connects IoT devices to gather data and drive business insights and automation. In addition, IoT Hub includes features that enrich the relationship between your devices and your backend systems. Bi-directional communication capabilities mean that while you receive data from devices you can also send commands and policies back to devices. For example, use cloud-to-device messaging to update properties or invoke device management actions. Cloud-to-device communication also enables you to send cloud intelligence to your edge devices with Azure IoT Edge. The unique device-level identity provided by IoT Hub helps better secure your IoT solution from potential attacks. 

[Azure Event Hubs](../event-hubs/event-hubs-about.md) is the big data streaming service of Azure. It's designed for high throughput data streaming scenarios where customers may send billions of requests per day, and uses a partitioned consumer model to scale out your stream. Event Hubs is integrated into the big data and analytics services of Azure, including Databricks, Stream Analytics, ADLS, and HDInsight. With features like Event Hubs Capture and Auto-Inflate, this service is designed to support your big data apps and solutions. Additionally, IoT Hub uses Event Hubs for its telemetry flow path, so your IoT solution also benefits from the tremendous power of Event Hubs.

To summarize, both solutions are designed for data ingestion at a massive scale. Only IoT Hub provides the rich IoT-specific capabilities that are designed for you to maximize the business value of connecting your IoT devices to the Azure cloud.  If your IoT journey is just beginning, starting with IoT Hub to support your data ingestion scenarios assures that you'll have instant access to full-featured IoT capabilities, once your business and technical needs require them.

The following table provides details about how the two tiers of IoT Hub compare to Event Hubs when you're evaluating them for IoT capabilities. For more information about the standard and basic tiers of IoT Hub, see [Choose the right IoT Hub tier for your solution](iot-hub-scaling.md).

| IoT capability | IoT Hub standard tier | IoT Hub basic tier | Event Hubs |
| --- | --- | --- | --- |
| Device-to-cloud messaging | ![Check][checkmark] | ![Check][checkmark] | ![Check][checkmark] |
| Protocols: HTTPS, AMQP, AMQP over WebSockets | ![Check][checkmark] | ![Check][checkmark] | ![Check][checkmark] |
| Protocols: MQTT, MQTT over WebSockets | ![Check][checkmark] | ![Check][checkmark] |  |
| Per-device identity | ![Check][checkmark] | ![Check][checkmark] |  |
| File upload from devices | ![Check][checkmark] | ![Check][checkmark] |  |
| Device Provisioning Service | ![Check][checkmark] | ![Check][checkmark] |  |
| Cloud-to-device messaging | ![Check][checkmark] |  |  |
| Device twin and device management | ![Check][checkmark] |  |  |
| Device streams (preview) | ![Check][checkmark] |  |  |
| IoT Edge | ![Check][checkmark] |  |  |

Even if the only use case is device-to-cloud data ingestion, we highly recommend using IoT Hub as it provides a service that is designed for IoT device connectivity. 

[checkmark]: ./media/iot-hub-compare-event-hubs/ic195031.png