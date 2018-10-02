---
title: Understand Azure IoT Hub pricing | Microsoft Docs
description: Developer guide - information about how metering and pricing works with IoT Hub including worked examples.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.author: dobett
---

# Azure IoT Hub pricing information

[Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) provides the general information on different SKUs and pricing for IoT Hub. This article contains additional details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Charges per operation

| Operation | Billing information | 
| --------- | ------------------- |
| Identity registry operations <br/> (create, retrieve, list, update, delete) | Not charged. |
| Device-to-cloud messages | Successfully sent messages are charged in 4-KB chunks on ingress into IoT Hub. For example, a 6-KB message is charged 2 messages. |
| Cloud-to-device messages | Successfully sent messages are charged in 4-KB chunks, for example a 6-KB message is charged 2 messages. |
| File uploads | File transfer to Azure Storage is not metered by IoT Hub. File transfer initiation and completion messages are charged as messaged metered in 4-KB increments. For example, transferring a 10-MB file is charged two messages in addition to the Azure Storage cost. |
| Direct methods | Successful method requests are charged in 4-KB chunks, responses with non-empty bodies are charged in 4-KB chunks as additional messages. Requests to disconnected devices are charged as messages in 4-KB chunks. For example, a method with a 6-KB body that results in a response with no body from the device, is charged as two messages. A method with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the request plus another message for the response. |
| Device and module twin reads | Twin reads from the device or module and from the solution back end are charged as messages in 512-byte chunks. For example, reading a 6-KB twin is charged as 12 messages. |
| Device and module twin updates (tags and properties) | Twin updates from the device or module and from the solution back end are charged as messages in 512-byte chunks. For example, reading a 6-KB twin is charged as 12 messages. |
| Device and module twin queries | Queries are charged as messages depending on the result size in 512-byte chunks. |
| Jobs operations <br/> (create, update, list, delete) | Not charged. |
| Jobs per-device operations | Jobs operations (such as twin updates, and methods) are charged as normal. For example, a job resulting in 1000 method calls with 1-KB requests and empty-body responses is charged 1000 messages. |

> [!NOTE]
> All sizes are computed considering the payload size in bytes (protocol framing is ignored). For messages, which have properties and body, the size is computed in a protocol-agnostic way. For more information, see [IoT Hub message format](iot-hub-devguide-messages-construct.md).

## Example #1

A device sends one 1-KB device-to-cloud message per minute to IoT Hub, which is then read by Azure Stream Analytics. The solution back end invokes a method (with 512-byte payload) on the device every 10 minutes to trigger a specific action. The device responds to the method with a result of 200 bytes.

The device consumes:

* One message * 60 minutes * 24 hours = 1440 messages per day for the device-to-cloud messages.
* Two request plus response * 6 times per hour * 24 hours = 288 messages for the methods.

This calculation gives a total of 1728 messages per day.

## Example #2

A device sends one 100-KB device-to-cloud message every hour. It also updates its device twin with 1-KB payloads every four hours. The solution back end, once per day, reads the 14-KB device twin and updates it with 512-byte payloads to change configurations.

The device consumes:

* 25 (100 KB / 4 KB) messages * 24 hours for device-to-cloud messages.
* Two messages (1 KB / 0.5 KB) * six times per day for device twin updates.

This calculation gives a total of 612 messages per day.

The solution back end consumes 28 messages (14 KB / 0.5 KB) to read the device twin, plus one message to update it, for a total of 29 messages.

In total, the device and the solution back end consume 641 messages per day.