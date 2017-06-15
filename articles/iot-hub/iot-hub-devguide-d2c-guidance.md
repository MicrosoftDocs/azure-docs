---
title: Azure IoT Hub device-to-cloud options | Microsoft Docs
description: Developer guide - guidance on when to use device-to-cloud messages, reported properties, or file upload for cloud-to-device communications. 
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 979136db-c92d-4288-870c-f305e8777bdd
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: elioda

---
# Device-to-cloud communications guidance
When sending information from the device app to the solution back end, IoT Hub exposes three options:

* [Device-to-cloud messages][lnk-d2c] for time series telemetry and alerts.
* [Reported properties][lnk-twins] for reporting device state information such as available capabilities, conditions, or the state of long-running workflows. For example, configuration and software updates.
* [File uploads][lnk-fileupload] for media files and large telemetry batches uploaded by intermittently connected devices or compressed to save bandwidth.

Here is a detailed comparison of the various device-to-cloud communication options.

|  | Device-to-cloud messages | Reported properties | File uploads |
| ---- | ------- | ---------- | ---- |
| Scenario | Telemetry time series and alerts. For example, 256-KB sensor data batches sent every 5 minutes. | Available capabilities and conditions. For example, the current device connectivity mode such as cellular or WiFi. Synchronizing long-running workflows, such as configuration and software updates. | Media files. Large (typically compressed) telemetry batches. |
| Storage and retrieval | Temporarily stored by IoT Hub, up to 7 days. Only sequential reading. | Stored by IoT Hub in the device twin. Retrievable using the [IoT Hub query language][lnk-query]. | Stored in user-provided Azure Storage account. |
| Size | Up to 256-KB messages. | Maximum reported properties size is 8 KB. | Maximum file size supported by Azure Blob Storage. |
| Frequency | High. For more information, see [IoT Hub limits][lnk-quotas]. | Medium. For more information, see [IoT Hub limits][lnk-quotas]. | Low. For more information, see [IoT Hub limits][lnk-quotas]. |
| Protocol | Available on all protocols. | Currently available only when using MQTT. | Available when using any protocol, but requires HTTP on the device. |

It is possible that an application requires to both send information as a telemetry time series or alert and also to make it available in the device twin. In this scenario, you can chose one of the following options:

* The device app sends a device-to-cloud message and reports a property change.
* The solution back end can store the information in the device twin's tags when it receives the message.

Since device-to-cloud messages enable a much higher throughput than device twin updates, it is sometimes desirable to avoid updating the device twin for every device-to-cloud message.


[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-fileupload]: iot-hub-devguide-file-upload.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-d2c]: iot-hub-devguide-messages-d2c.md
