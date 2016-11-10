---
title: Developer guide - Cloud to device communications guidance | Microsoft Docs
description: Azure IoT Hub developer guide - guidance on when to use direct methods, device twin's desired properties, or cloud-to-device messages. 
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
ms.date: 11/09/2016
ms.author: elioda

---
# Cloud to device communications guidance
IoT Hub provides three options for device apps to expose functionalities to a back end:

* [Direct methods][lnk-methods], for communications that require immediate confirmation of their result, usually interactive control of the device, e.g. turn on a fan;
* [Twin's desired properties][lnk-twins], for long-running commands meant to put the device in a certain desired state, e.g. set the telemetry send interval to 30 minutes;
* [Cloud-to-device (C2D) messages][lnk-c2d], for one-way notifications to the device app.

Here is a detailed comparison of the various cloud-to-device communication options.

|  | Direct methods | Twin's desired properties | C2D messages |
| ---- | ------- | ---------- | ---- |
| Scenario | Commands that require immediate confirmation, e.g. turn on a fan. | Long-running commands meant to put the device in a certain desired state, e.g. set the telemetry send interval to 30 minutes. | One-way notifications to the device app. |
| Data flow | Two-way. The device app can respond to the method right away. The back end receives the outcome contextually to the request. | One-way. The device app receives a notification with the property change. | One-way. The device app receives the message
| Durability | Disconnected devices are not contacted. Back end is notified that the device is not connected. | Property values are preserved in the device twin. Device will read it at next reconnection. Property values are retrievable with a [SQL-like query language][lnk-query]. | Messages can retained by IoT Hub for up to 48 hours. |
| Targets | Single device using **deviceId**, or multiple devices using [jobs][lnk-jobs]. | Single device using **deviceId**, or multiple devices using [jobs][lnk-jobs]. | Single device by **deviceId**. |
| Size | Up to 8KB requests and 8KB responses. | Maximum desired properties size is 8KB. | Up to 256KB messages. |
| Frequency | High. Refer to [IoT Hub limits][lnk-quotas] for more information. | Medium. Refer to [IoT Hub limits][lnk-quotas] for more information. | Low. Refer to [IoT Hub limits][lnk-quotas] for more information. |
| Protocol | Available on MQTT and AMQP. | Currently available only when using MQTT. | Available on all protocol. Device has to poll when using HTTP. |

Learn how to use direct methods, desired properties, and cloud-to-device messages in the following tutorials:

* [Use direct methods][lnk-methods-tutorial], for direct methods;
* [Use desired properties to configure devices][lnk-twin-properties], for twin's desired properties; 
* [Send cloud-to-device messages][lnk-c2d-tutorial], for cloud-to-device messages.

[lnk-twins]: iot-hub/iot-hub-devguide-device-twins.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-c2d]: iot-hub-devguide-messaging.md#cloud-to-device-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md