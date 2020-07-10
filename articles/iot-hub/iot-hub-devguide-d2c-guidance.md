---
title: Azure IoT Hub device-to-cloud options | Microsoft Docs
description: Developer guide - guidance on when to use device-to-cloud messages, reported properties, or file upload for cloud-to-device communications. 
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.custom: [amqp, mqtt]
---

# Device-to-cloud communications guidance

When sending information from the device app to the solution back end, IoT Hub exposes three options:

* [Device-to-cloud messages](iot-hub-devguide-messages-d2c.md) for time series telemetry and alerts.

* [Device twin's reported properties](iot-hub-devguide-device-twins.md) for reporting device state information such as available capabilities, conditions, or the state of long-running workflows. For example, configuration and software updates.

* [File uploads](iot-hub-devguide-file-upload.md) for media files and large telemetry batches uploaded by intermittently connected devices or compressed to save bandwidth.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Here is a detailed comparison of the various device-to-cloud communication options.

|  | Device-to-cloud messages | Device twin's reported properties | File uploads |
| ---- | ------- | ---------- | ---- |
| Scenario | Telemetry time series and alerts. For example, 256-KB sensor data batches sent every 5 minutes. | Available capabilities and conditions. For example, the current device connectivity mode such as cellular or WiFi. Synchronizing long-running workflows, such as configuration and software updates. | Media files. Large (typically compressed) telemetry batches. |
| Storage and retrieval | Temporarily stored by IoT Hub, up to 7 days. Only sequential reading. | Stored by IoT Hub in the device twin. Retrievable using the [IoT Hub query language](iot-hub-devguide-query-language.md). | Stored in user-provided Azure Storage account. |
| Size | Up to 256-KB messages. | Maximum reported properties size is 32 KB. | Maximum file size supported by Azure Blob Storage. |
| Frequency | High. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). | Medium. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). | Low. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). |
| Protocol | Available on all protocols. | Available using MQTT or AMQP. | Available when using any protocol, but requires HTTPS on the device. |

An application may need to send information both as a telemetry time series or alert and make it available in the device twin. In this scenario, you can choose one of the following options:

* The device app sends a device-to-cloud message and reports a property change.
* The solution back end can store the information in the device twin's tags when it receives the message.

Since device-to-cloud messages enable a much higher throughput than device twin updates, it is sometimes desirable to avoid updating the device twin for every device-to-cloud message.
