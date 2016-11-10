---
title: Developer guide - Device to cloud communications guidance | Microsoft Docs
description: Azure IoT Hub developer guide - guidance on when to use device-to-cloud messages, device twin's reported properties, or file upload. 
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 8a3da072-a5bf-46e5-8de4-24cdbb2a03fa
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/30/2016
ms.author: elioda

---
# Understand device twins - preview
When sending information from the device app to the back-end, IoT Hub exposes three options:

* [Device-to-cloud (D2C) messages][lnk-d2c], for time series telemetry and alerts;
* [Twin's reported properties][lnk-twins], for reporting device state information such as available capabilities, conditions and state of long-running workflows (e.g. configuration and software updates);
* [File uploads][lnk-fileupload], for media files and large telemetry batches uploaded by intermittently connected devices or compressed to save bandwidth.

Here is a detailed comparison of the various device-to-cloud communication options.

|  | D2C messages | Twin's reported properties | File uploads |
| ---- | ------- | ---------- | ---- |
| Scenario | Telemetry time series and alerts, e.g. 256KB sensor data batches sent every 5mins. | Available capabilities and conditions, e.g. device current connectivity mode (cellular or wifi). Synchronizing long-running workflows, such as configuration and software updates. | Media files. Large (usually compressed) telemetry batches. |
| Storage and retrieval | Temporarily stored by IoT Hub, up to 7 days. Only sequential reading. | Stored by IoT Hub in the device twin. Retrievable through [SQL-like query language][lnk-query]. | Stored in user-provided Azure Storage account. |
| Size | Up to 256KB messages. | Maximum reported properties size is 8KB. | Maximum file size supported by Azure Blob Storage. |
| Frequency | High. Refer to [IoT Hub limits][lnk-quotas] for more information. | Medium. Refer to [IoT Hub limits][lnk-quotas] for more information. | Low. Refer to [IoT Hub limits][lnk-quotas] for more information. |
| Protocol | Available on all protocols. | Currently available only when using MQTT. | Available when using any protocol, but requires HTTP on the device. |

> [AZURE.NOTE] It is possible that an application requires to both send information as a telemetry time series or alert and also to make it available in the twin. In those cases, the device app can both send a D2C message and report a property change, or the back end can store the information in the twin's tags when it receives the message. Since D2C messages allow much higher throughput than twin updates, it is sometimes desirable to avoid updating the twin for every D2C message.

[lnk-twins]: iot-hub/iot-hub-devguide-device-twins.md
[lnk-fileupload]: iot-hub/iot-hub-devguide-file-upload.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages