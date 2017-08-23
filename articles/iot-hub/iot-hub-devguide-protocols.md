---
title: Azure IoT Hub communication protocols and ports | Microsoft Docs
description: Developer guide - describes the supported communication protocols for device-to-cloud and cloud-to-device communications and the port numbers that must be open.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 3fc5f1a3-3711-4611-9897-d4db079b4250
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: dobett

---
# Reference - choose a communication protocol

IoT Hub allows devices to use [MQTT][lnk-mqtt], MQTT over WebSockets, [AMQP][lnk-amqp], AMQP over WebSockets, and HTTP protocols for device-side communications. For information about how these protocols support specific IoT Hub features, see [Device-to-cloud communications guidance][lnk-d2c-guidance] and [Cloud-to-device communications guidance][lnk-c2d-guidance].

The following table provides the high-level recommendations for your choice of protocol:

| Protocol | When you should choose this protocol |
| --- | --- |
| MQTT <br> MQTT over WebSocket |Use on all devices that do not require to connect multiple devices (each with its own per-device credentials) over the same TLS connection. |
| AMQP <br> AMQP over WebSocket |Use on field and cloud gateways to take advantage of connection multiplexing across devices. |
| HTTP |Use for devices that cannot support other protocols. |

Consider the following points when you choose your protocol for device-side communications:

* **Cloud-to-device pattern**. HTTP does not have an efficient way to implement server push. As such, when you are using HTTP, devices poll IoT Hub for cloud-to-device messages. This approach is inefficient for both the device and IoT Hub. Under current HTTP guidelines, each device should poll for messages every 25 minutes or more. On the other hand, MQTT and AMQP support server push when receiving cloud-to-device messages. They enable immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, MQTT or AMQP are the best protocols to use. For rarely connected devices, HTTP works as well.
* **Field gateways**. When using MQTT and HTTP, you cannot connect multiple devices (each with its own per-device credentials) using the same TLS connection. Thus, for [Field gateway scenarios][lnk-azure-gateway-guidance], these protocols are suboptimal because they require one TLS connection between the field gateway and IoT Hub for each device connected to the field gateway.
* **Low resource devices**. The MQTT and HTTP libraries have a smaller footprint than the AMQP libraries. As such, if the device has limited resources (for example, less than 1 MB RAM), these protocols might be the only protocol implementation available.
* **Network traversal**. The standard AMQP protocol uses port 5671, while MQTT listens on port 8883, which could cause problems in networks that are closed to non-HTTP protocols. MQTT over WebSockets, AMQP over WebSockets, and HTTP are available to be used in this scenario.
* **Payload size**. MQTT and AMQP are binary protocols, which result in more compact payloads than HTTP.

> [!WARNING]
> When using HTTP, each device should poll for cloud-to-device messages every 25 minutes or more. However, during development, it is acceptable to poll more frequently than every 25 minutes.

## Port numbers

Devices can communicate with IoT Hub in Azure using various protocols. Typically, the choice of protocol is driven by the specific requirements of the solution. The following table lists the outbound ports that must be open for a device to be able to use a specific protocol:

| Protocol | Port |
| --- | --- |
| MQTT |8883 |
| MQTT over WebSockets |443 |
| AMQP |5671 |
| AMQP over WebSockets |443 |
| HTTP |443 |

Once you have created an IoT hub in an Azure region, the IoT hub keeps the same IP address for the lifetime of that IoT hub. However, to maintain quality of service, if Microsoft moves the IoT hub to a different scale unit then it is assigned a new IP address.


## Next steps

To learn more about how IoT Hub implements the MQTT protocol, see [Communicate with your IoT hub using the MQTT protocol][lnk-mqtt-support].

[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md
[lnk-c2d-guidance]: iot-hub-devguide-c2d-guidance.md
[lnk-mqtt-support]: iot-hub-mqtt-support.md
[lnk-amqp]: http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf
[lnk-mqtt]: http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.pdf
[lnk-azure-gateway-guidance]: iot-hub-devguide-endpoints.md#field-gateways
