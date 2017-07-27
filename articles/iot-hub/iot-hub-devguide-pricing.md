---
title: Understand Azure IoT Hub pricing | Microsoft Docs
description: Developer guide - information about how metering and pricing works with IoT Hub including worked examples.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 1ac90923-1edf-4134-bbd4-77fee9b68d24
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/12/2016
ms.author: elioda

---

# Azure IoT Hub pricing information

[Azure IoT Hub pricing][lnk-pricing] provides the general information on different SKUs and pricing for IoT Hub. This article contains additional details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

## Charges per operation

| Operation | Billing information | 
| --------- | ------------------- |
| Identity registry operations <br/> (create, retrieve, list, update, delete) | Not charged. |
| Device-to-cloud messages | Successfully sent messages are charged in 4-KB chunks on ingress into IoT Hub, for example a 6-KB message is charged 2 messages. |
| Cloud-to-device messages | Successfully sent messages are charged in 4-KB chunks, for example a 6-KB message is charged 2 messages. |
| File uploads | File transfer to Azure Storage is not metered by IoT Hub. File transfer initiation and completion messages are charged as messaged metered in 4-KB increments. For instance, transferring a 10-MB file is charged two messages in addition to the Azure Storage cost. |
| Direct methods | Successful method requests are charged in 4-KB chunks, responses with non-empty bodies are charged in 4-KB as additional messages. Requests to disconnected devices are charged as messages in 4-KB chunks. For instance, a method with a 6-KB body that results in a response with no body from the device, is charged as two messages; a method with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the request plus another message for the response. |
| Device twin reads | Device twin reads from the device and from the solution back end are charged as messages in 512-byte chunks. For instance, reading a 6-KB device twin is charged as 12 messages. |
| Device twin updates (tags and properties) | Device twin updates from the device and the device are charged as messages in 512-byte chunks. For instance, reading a 6-KB device twin is charged as 12 messages. |
| Device twin queries | Queries are charged as messages depending on the result size in 512-byte chunks. |
| Jobs operations <br/> (create, update, list, delete) | Not charged. |
| Jobs per-device operations | Jobs operations (such as device twin updates, and methods) are charged as normal. For instance, a job resulting in 1000 method calls with 1-KB requests and empty-body responses is charged 1000 messages. |

> [!NOTE]
> All sizes are computed considering the payload size in bytes (protocol framing is ignored). In case of messages (which have properties and body) the size is computed in a protocol-agnostic way, as described in the [IoT Hub messaging developer's guide][lnk-message-size].

## Example #1

A device sends one 1-KB device-to-cloud message per minute to IoT Hub, which is then read by Azure Stream Analytics. The solution back end invokes a method (with 512-byte payload) on the device every ten minutes to trigger a specific action. The device responds to the method with a result of 200 bytes.

The device consumes 1 message * 60 minutes * 24 hours = 1440 messages per day for the device-to-cloud messages, and 2 request plus response * 6 times per hour * 24 hours = 288 messages for the methods, for a total of 1728 messages per day.

## Example #2

A device sends one 100-KB device-to-cloud message every hour. It also updates its device twin with 1-KB payloads every 4 hours. The solution back end, once per day, reads the 14-KB device twin and updates it with 512-byte payloads to change configurations.

The device consumes 25 (100KB / 4KB) messages * 24 hours for device-to-cloud messages, plus 1 message * 6 times per day for device twin updates, for a total of 156 messages per day.
The solution back end consumes 28 messages (14KB / 0.5KB) to read the device twin, plus 1 message to update it, for a total of 29 messages.

In total, the device and the solution back end consume 185 messages per day.


[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[lnk-message-size]: iot-hub-devguide-messages-construct.md
