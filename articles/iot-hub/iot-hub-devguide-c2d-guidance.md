---
title: Azure IoT Hub cloud-to-device options | Microsoft Docs
description: Developer guide - guidance on when to use direct methods, device twin's desired properties, or cloud-to-device messages for cloud-to-device communications. 
services: iot-hub
documentationcenter: ''
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 1ac90923-1edf-4134-bbd4-77fee9b68d24
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: elioda

---
# Cloud-to-device communications guidance
IoT Hub provides three options for device apps to expose functionality to a back-end app:

* [Direct methods][lnk-methods] for communications that require immediate confirmation of the result. Direct methods are often used for interactive control of devices such as turning on a fan.
* [Twin's desired properties][lnk-twins] for long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes.
* [Cloud-to-device messages][lnk-c2d] for one-way notifications to the device app.

Here is a detailed comparison of the various cloud-to-device communication options.

|  | Direct methods | Twin's desired properties | Cloud-to-device messages |
| ---- | ------- | ---------- | ---- |
| Scenario | Commands that require immediate confirmation, such as turning on a fan. | Long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes. | One-way notifications to the device app. |
| Data flow | Two-way. The device app can respond to the method right away. The solution back end receives the outcome contextually to the request. | One-way. The device app receives a notification with the property change. | One-way. The device app receives the message
| Durability | Disconnected devices are not contacted. The solution back end is notified that the device is not connected. | Property values are preserved in the device twin. Device will read it at next reconnection. Property values are retrievable with the [IoT Hub query language][lnk-query]. | Messages can be retained by IoT Hub for up to 48 hours. |
| Targets | Single device using **deviceId**, or multiple devices using [jobs][lnk-jobs]. | Single device using **deviceId**, or multiple devices using [jobs][lnk-jobs]. | Single device by **deviceId**. |
| Size | Up to 8KB requests and 8KB responses. | Maximum desired properties size is 8KB. | Up to 64KB messages. |
| Frequency | High. For more information, see [IoT Hub limits][lnk-quotas]. | Medium. For more information, see [IoT Hub limits][lnk-quotas]. | Low. For more information, see [IoT Hub limits][lnk-quotas]. |
| Protocol | Currently available only when using MQTT. | Currently available only when using MQTT. | Available on all protocols. Device must poll when using HTTP. |

Learn how to use direct methods, desired properties, and cloud-to-device messages in the following tutorials:

* [Use direct methods][lnk-methods-tutorial], for direct methods;
* [Use desired properties to configure devices][lnk-twin-properties], for device twin's desired properties; 
* [Send cloud-to-device messages][lnk-c2d-tutorial], for cloud-to-device messages.

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-c2d]: iot-hub-devguide-messages-c2d.md
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-methods-tutorial]: iot-hub-node-node-direct-methods.md
[lnk-twin-properties]: iot-hub-node-node-twin-how-to-configure.md
[lnk-c2d-tutorial]: iot-hub-node-node-c2d.md
