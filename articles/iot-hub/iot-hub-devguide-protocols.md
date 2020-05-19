---
title: Azure IoT Hub communication protocols and ports | Microsoft Docs
description: Developer guide - describes the supported communication protocols for device-to-cloud and cloud-to-device communications and the port numbers that must be open.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.custom: [amqp, mqtt]
---

# Reference - choose a communication protocol

IoT Hub allows devices to use the following protocols for device-side communications:

* [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.pdf)
* MQTT over WebSockets
* [AMQP](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
* AMQP over WebSockets
* HTTPS

For information about how these protocols support specific IoT Hub features, see [Device-to-cloud communications guidance](iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communications guidance](iot-hub-devguide-c2d-guidance.md).

The following table provides the high-level recommendations for your choice of protocol:

| Protocol | When you should choose this protocol |
| --- | --- |
| MQTT <br> MQTT over WebSocket |Use on all devices that do not require to connect multiple devices (each with its own per-device credentials) over the same TLS connection. |
| AMQP <br> AMQP over WebSocket |Use on field and cloud gateways to take advantage of connection multiplexing across devices. |
| HTTPS |Use for devices that cannot support other protocols. |

Consider the following points when you choose your protocol for device-side communications:

* **Cloud-to-device pattern**. HTTPS does not have an efficient way to implement server push. As such, when you are using HTTPS, devices poll IoT Hub for cloud-to-device messages. This approach is inefficient for both the device and IoT Hub. Under current HTTPS guidelines, each device should poll for messages every 25 minutes or more. MQTT and AMQP support server push when receiving cloud-to-device messages. They enable immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, MQTT or AMQP are the best protocols to use. For rarely connected devices, HTTPS works as well.

* **Field gateways**. MQTT and HTTPS support only a single device identity (device ID plus credentials) per TLS connection. For this reason, these protocols are not supported for [field gateway scenarios](iot-hub-devguide-endpoints.md#field-gateways) that require multiplexing messages using multiple device identities across a single or a pool of upstream connections to IoT Hub. Such gateways can use a protocol that supports multiple device identities per connection, like AMQP, for their upstream traffic.

* **Low resource devices**. The MQTT and HTTPS libraries have a smaller footprint than the AMQP libraries. As such, if the device has limited resources (for example, less than 1-MB RAM), these protocols might be the only protocol implementation available.

* **Network traversal**. The standard AMQP protocol uses port 5671, and MQTT listens on port 8883. Use of these ports could cause problems in networks that are closed to non-HTTPS protocols. Use MQTT over WebSockets, AMQP over WebSockets, or HTTPS in this scenario.

* **Payload size**. MQTT and AMQP are binary protocols, which result in more compact payloads than HTTPS.

> [!WARNING]
> When using HTTPS, each device should poll for cloud-to-device messages no more than once every 25 minutes. In development, each device can poll more frequently, if desired.

## Port numbers

Devices can communicate with IoT Hub in Azure using various protocols. Typically, the choice of protocol is driven by the specific requirements of the solution. The following table lists the outbound ports that must be open for a device to be able to use a specific protocol:

| Protocol | Port |
| --- | --- |
| MQTT |8883 |
| MQTT over WebSockets |443 |
| AMQP |5671 |
| AMQP over WebSockets |443 |
| HTTPS |443 |

Once you have created an IoT hub in an Azure region, the IoT hub keeps the same IP address for the lifetime of that IoT hub. However, if Microsoft moves the IoT hub to a different scale unit to maintain quality of service,  then it is assigned a new IP address.

## Next steps

To learn more about how IoT Hub implements the MQTT protocol, see [Communicate with your IoT hub using the MQTT protocol](iot-hub-mqtt-support.md).
