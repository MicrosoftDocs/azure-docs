<properties
 pageTitle="Azure IoT Hub Developer guide introduction | Microsoft Azure"
 description="An overview of the content of the Azure IoT Developer guide outling the key sections covering endpoints, device identity registry, messaging and security"
 services="azure-iot"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="dobett"/>

# Azure IoT Hub developer guide - introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back-end.

Azure IoT Hub enables:

* Secure communications using per-device security credentials and access control,
* Reliable device-to-cloud and cloud-to-device hyper-scale messaging, and
* Includes device libraries for the most popular languages and platforms.

*[TBD Expand this intro with a simple diagram that includes at least endpoints, messaging, resistry, and if possible annotations about security. Use to reference other sections of dev guide]*

## Quotas and throttling
Each Azure subscription can have at most 10 IoT hubs.

Each IoT hub is provisioned with a certain number of units in a specific SKU (for more information refer to [Azure IoT Hub Pricing][lnk-pricing]). The SKU and number of units determine the maximum daily quota of messages that can be sent, and the maximum number of device identities in the identity registry. The number of simultaneously connected devices is limited by the number of identities in the registry.

They also determine throttling limits that IoT Hub will enforce on operations.

### Device identity registry quota
IoT Hub will allow at most 1100 device updates (create, update, delete) per unit (irrespective of SKU) per day.

### Operation throttles <a id="throttling"></a>
Operation throttles are rate limitations that are applied in the minute ranges, and are intended to avoid abuse. IoT Hub tries to avoid returning errors whenever possible, but it will start returning exception if the throttle is violated for too long.
Here is the list of enforced throttles. Values refer to an individual hub.

| Throttle | Per-hub value |
| -------- | ------------- |
| Identity registry operations (create, retrieve, list, update, delete), individual or bulk import/export | 100/min/unit, up to 5000/min |
| Device connections | 100/sec/unit |
| D2C sends | 2000/min/unit (for S2), 60/min/unit (for S1). Minimum of 100/sec. |
| C2D operations (sends, receive, feedback) | 100/min/unit |

**Note**. At any given time, it is possible to increase quotas or throttle limits by increasing the provisioned units in an IoT hub.

## Next steps
*[TBD links to the next sections in the devguide]*

[lnk-pricing]: TBD
