<properties
 pageTitle="Developer guide - quotas and throttling | Microsoft Azure"
 description="Azure IoT Hub developer guide - description of quotas that apply to IoT Hub and expected throttling behavior"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Reference - Quotas and throttling

## Quotas and throttling

Each Azure subscription can have at most 10 IoT hubs.

Each IoT hub is provisioned with a certain number of units in a specific SKU (for more information, see [Azure IoT Hub Pricing][lnk-pricing]). The SKU and number of units determine the maximum daily quota of messages that you can send.

The SKU also determines the throttling limits that IoT Hub enforces on all operations.

## Operation throttles

Operation throttles are rate limitations that are applied in the minute ranges, and are intended to avoid abuse. IoT Hub tries to avoid returning errors whenever possible, but it starts returning exceptions if the throttle is violated for too long.

The following is the list of enforced throttles. Values refer to an individual hub.

| Throttle | Per-hub value |
| -------- | ------------- |
| Identity registry operations (create, retrieve, list, update, delete) | 5000/min/unit (for S3) <br/> 100/min/unit (for S1 and S2). |
| Device connections | 6000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. <br/> For example, two S1 units are 2\*12 = 24/sec, but you have at least 100/sec across your units. With nine S1 units, you have 108/sec (9\*12) across your units. |
| Device-to-cloud sends | 6000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. <br/> For example, two S1 units are 2\*12 = 24/sec, but you have at least 100/sec across your units. With nine S1 units, you have 108/sec (9\*12) across your units. |
| Cloud-to-device sends | 5000/min/unit (for S3), 100/min/unit (for S1 and S2). |
| Cloud-to-device receives | 50000/min/unit (for S3), 1000/min/unit (for S1 and S2). |
| File upload operations | 5000 file upload notifications/min/unit (for S3), 100 file upload notifications/min/unit (for S1 and S2). <br/> 10000 SAS URIs can be out for a storage account at one time.<br/> 10 SAS URIs/device can be out at one time. | 

It is important to clarify that the *device connections* throttle governs the rate at which new device connections can be established with an IoT hub, and not the maximum number of simultaneously connected devices. The throttle depends on the number of units that are provisioned for the hub.

For example, if you buy a single S1 unit, you get a throttle of 100 connections per second. This means that to connect 100,000 devices, it takes at least 1000 seconds (approximately 16 minutes). However, you can have as many simultaneously connected devices as you have devices registered in your device identity registry.

For an in-depth discussion of IoT Hub throttling behavior, see the blog post [IoT Hub throttling and you][lnk-throttle-blog].

>[AZURE.NOTE] At any given time, it is possible to increase quotas or throttle limits by increasing the number of provisioned units in an IoT hub.

>[AZURE.IMPORTANT] Identity registry operations are intended for run-time use in device management and provisioning scenarios. Reading or updating a large number of device identities is supported through [import and export jobs][lnk-importexport].

## Next steps

Other reference topics in this IoT Hub developer guide include:

- [IoT Hub endpoints][lnk-devguide-endpoints]
- [Query language for twins, methods, and jobs][lnk-devguide-query]
- [IoT Hub MQTT support][lnk-devguide-mqtt]

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[lnk-throttle-blog]: https://azure.microsoft.com/blog/iot-hub-throttling-and-you/
[lnk-importexport]: iot-hub-devguide-identity-registry.md#import-and-export-device-identities

[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md