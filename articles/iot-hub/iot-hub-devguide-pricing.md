---
title: Developer guide - Understand device twins | Microsoft Docs
description: Azure IoT Hub developer guide - use device twins to synchronize state and configuration data between IoT Hub and your devices
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

# Pricing information

[Azure IoT Hub pricing][lnk-pricing] provides the general information on different SKUs and pricing for IoT Hub. This article contains additional details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

## Charges per operation

| Operation | Billing information | 
| --------- | ------------------- |
| Identity registry operations <br/> (create, retrieve, list, update, delete) | Not charged. |
| Device-to-cloud messages | Successfully sent messages are charged in 4KB chunks, e.g. a 6KB message is charged 2 messages. |
| Cloud-to-device messages | Successfully sent messages are charged in 4KB chunks, e.g. a 6KB message is charged 2 messages. |
| File uploads | File transfer to Azure Storage is not metered by IoT Hub. File transfer initiation and completion messages are charged as messaged metered in 4KB increments. For instance, transferring a 10MB file is charged two messages in addition to the Azure Storage cost. |
| Direct methods | Successfull method requests are charged in 4KB chunks, responses with non-empty bodies are charged in 4KB as additional messages. Requests to disconnected devices are charged as messages in 4KB chunks. For instance, a method with a 6KB body which results in a response with no body from the device, is charged as two messahes; a method with a 6KB body which results in a 1KB response from the device is charged as two messages for the request plus another message for the response. |
| Twin reads | Twin reads from the device and from the back-end are charged as messages in 512 bytes chunks. For instance, reading a 6KB device twin is charged as 12 messages. |
| Twin updates (tags and properties) | Twin updates from the device and the device are charged as messages in 512 bytes chunks. For instance, reading a 6KB device twin is charged as 12 messages. |
| Twin queries | Queries are charged as messages depending on the result size in 512 bytes chunks. |
| Jobs operations <br/> (create, update, list, delete) | Not charged. |
| Jobs per-device operations | Jobs operations (i.e. twin updates, and methods) are charged as normal. For instance, a job resulting in 1000 method calls with 1KB requests and empty-body responses will be charged 1000 messages. |

> AZURE.NOTE All sizes are computed considering the payload size in bytes (protocol framing is ignored). In case of messages (which have properties and body) the size is computed in a protocol-agnostic way, as described in the [IoT Hub messaging developer's guide][lnk-message-size].

## Example #1 - 

A device sends one 1KB device-to-cloud message per minute to IoT Hub, which is then read by Azure Stream Analytics. The back end invokes a method (with 512 bytes payload) on the device every ten minutes to trigger a specific action. The device responds to the method with a result of 200 bytes.

The device consumes 1 message * 60 minutes * 24 hours = 1440 messages per day for the device-to-cloud messages, and 2 request plus response * 6 times per hour * 24 hours = 288 messages for the methods, for a total of 1728 messages per day.

## Example #2

A device sends one 100KB device-to-cloud messages every hour. It also updates its twin with 1KB payloads every 4 hours. The back-end, once per day, reads the 14KB twin and updates it with 512 bytes payloads to change configurations.

The device consumes 25 (100KB / 4KB) messages * 24 hours for device-to-cloud messages, plus 1 message * 6 times per day for twin updates, for a total of 156 messages per day.
The back end consumes 28 messages (14KB / 0.5KB) to read the twin, plus 1 message to update it, for a total of 29 messages.

In total, the device and the back end consume 185 messages per day.


[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[lnk-message-size]: iot-hub-devguide-messaging.md#message-size