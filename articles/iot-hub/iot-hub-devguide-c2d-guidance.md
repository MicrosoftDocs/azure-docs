---
title: Azure IoT Hub cloud-to-device options | Microsoft Docs
description: Developer guide - guidance on when to use direct methods, device twin's desired properties, or cloud-to-device messages for cloud-to-device communications. 
author: fsautomata
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.author: elioda
---

# Cloud-to-device communications guidance

IoT Hub provides three options for device apps to expose functionality to a back-end app:

* [Direct methods](iot-hub-devguide-direct-methods.md) for communications that require immediate confirmation of the result. Direct methods are often used for interactive control of devices such as turning on a fan.

* [Twin's desired properties](iot-hub-devguide-device-twins.md) for long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes.

* [Cloud-to-device messages](iot-hub-devguide-messages-c2d.md) for one-way notifications to the device app.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Here is a detailed comparison of the various cloud-to-device communication options.

|  | Direct methods | Twin's desired properties | Cloud-to-device messages |
| ---- | ------- | ---------- | ---- |
| Scenario | Commands that require immediate confirmation, such as turning on a fan. | Long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes. | One-way notifications to the device app. |
| Data flow | Two-way. The device app can respond to the method right away. The solution back end receives the outcome contextually to the request. | One-way. The device app receives a notification with the property change. | One-way. The device app receives the message
| Durability | Disconnected devices are not contacted. The solution back end is notified that the device is not connected. | Property values are preserved in the device twin. Device will read it at next reconnection. Property values are retrievable with the [IoT Hub query language](iot-hub-devguide-query-language.md). | Messages can be retained by IoT Hub for up to 48 hours. |
| Targets | Single device using **deviceId**, or multiple devices using [jobs](iot-hub-devguide-jobs.md). | Single device using **deviceId**, or multiple devices using [jobs](iot-hub-devguide-jobs.md). | Single device by **deviceId**. |
| Size | Maximum direct method payload size is 128 KB. | Maximum desired properties size is 8 KB. | Up to 64 KB messages. |
| Frequency | High. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). | Medium. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). | Low. For more information, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md). |
| Protocol | Available using MQTT or AMQP. | Available using MQTT or AMQP. | Available on all protocols. Device must poll when using HTTPS. |

Learn how to use direct methods, desired properties, and cloud-to-device messages in the following tutorials:

* [Use direct methods](quickstart-control-device-node.md)
* [Use desired properties to configure devices](tutorial-device-twins.md) 
* [Send cloud-to-device messages](iot-hub-node-node-c2d.md)