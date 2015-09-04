<properties
 pageTitle="Azure IoT Hub Developer guide protocols | Microsoft Azure"
 description="Describes the communication protocols you can use with Azure IoT Hub - AMQP, HTTP/1, MQTT"
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

# Choosing your communication protocol
Iot Hub supports both the [AMQP][lnk-amqp] and HTTP/1 protocols for device-side communications. Here is a list of considerations regarding their uses.

* **Cloud-to-device pattern**. HTTP/1 does not have an efficient way to implement server push. It follows that, when using HTTP/1, devices are polling Azure IoT Hub for cloud-to-device messages. This is very inefficient for both the device and IoT Hub. The current guidelines, when using HTTP/1 is to set a polling interval for each device of less than once per 25 minutes. On the other hand, AMQP supports server push when receiving cloud-to-device messages, and does it enables immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, AMQP is the best protocol to use. On the other hand, for scarcely connected devices, HTTP/1 works as well.
* **Field gateways**. Given the HTTP/1 limitations with respect to server push, it is unsuited to be used in [Field gateway scenarios][lnk-azure-gateway-guidance].
* **Low resource devices**. HTTP/1 libraries are significantly smaller than AMQP ones. It follows that is the device has few resources (for example , less than 1Mb RAM), HTTP/1 might be the only protocol implementation available.
* **Network traversal**. AMQP standard listens on port 5672. This could cause problems in networks that are closed to non-HTTP protocols. Note that this limitation is temporary as IoT Hub will implement AMQP over WebSockets.
* **Payload size**. AMQP is a binary protocol, which is significantly more compact than HTTP/1.

At a high level, we recommend to use AMQP whenever possible, and use HTTP/1 if device resources or network configuration does not allow AMQP. Moreover, when using HTTP/1, polling frequency should be set to less than once every 25 minutes for each device. Clearly during development, it is acceptable to have more frequent polling frequencies.

As a final consideration, it is important to refer to [Azure IoT Protocol Gateway][lnk-azure-protocol-gateway], which allows you to deploy a high performance MQTT gateway that interfaces directly with IoT Hub. MQTT supports server push (thus enabling immediate delivery of C2D messages to the device) and is available for very low resource devices. The main disadvantage of this approach is the requirement to self-host and manage a protocol gateway.

[lnk-azure-gateway-guidance]: TBD
[lnk-azure-protocol-gateway]: TBD
[lnk-amqp]: https://www.amqp.org/
