---
title: Use Azure IoT Edge devices as gateways | Microsoft Docs 
description: Use Azure IoT Edge to create a transparent, opaque or proxy gateway device that sends data from multiple downstream devices to the cloud or processes it locally.
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 09/21/2017
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# How an IoT Edge device can be used as a gateway

The purpose of gateways in IoT solutions is specific to the solution and combine device connectivity with edge analytics. Azure IoT Edge can be used to satisfy all needs for an IoT gateway regardless of whether they are related to connectivity, identity, or edge analytics. Gateway patterns in this article only refer to characteristics of downstream device connectivity and device identity, not how device data is processed on the gateway.

## Patterns
There are three patterns for using an IoT Edge device as a gateway: transparent, protocol translation, and identity translation:
* **Transparent** – Devices that theoretically could connect to IoT Hub can connect to a gateway device instead. This implies that the downstream devices have their own IoT Hub identities and are using any of the  MQTT, AMQP, or HTTP protocols. The gateway simply passes communications between the devices and IoT Hub. The devices are  unaware that they are communicating with the cloud via a gateway and a user interacting with the devices in IoT Hub is unaware of the intermediate gateway device. Thus, the gateway is transparent. Refer to the [Create a transparent gateway][lnk-iot-edge-as-transparent-gateway] how-to for specifics on using an IoT Edge device as a transparent gateway.
* **Protocol translation** – Also known as opaque gateway pattern, devices that do not support MQTT, AMQP, or HTTP use a gateway device to send data to IoT Hub. The gateway is smart enough to understand that protocol used by the downstream devices; however it is the only device that has identity in IoT Hub. All information looks like it is coming from one device, the gateway. This implies that downstream devices must embed additional identifying information in their messages if cloud applications want to reason about the data on a per device basis. Additionally, IoT Hub primitives like twin and methods are only available for the gateway device, not downstream devices.
* **Identity translation** - Devices that cannot connect to IoT Hub connect to a gateway device which provides IoT Hub identity and protocol translation on behalf of the downstream devices. The gateway is smart enough to understand the protocol used by the downstream devices, provide them identity, and translate IoT Hub primitives. Downstream devices appear in IoT Hub as first-class devices with twins and methods. A user can interact with the devices in IoT Hub and is unaware of the intermediate gateway device.

![Diagrams of gateway patterns][1]

## Use cases
All gateway patterns provide the following benefits:
* **Edge analytics** – Use AI services locally to process data coming from downstream devices without sending full fidelity telemetry to the cloud. Find and react to insights locally and only send a subset of data to IoT Hub. 
* **Downstream device isolation** – The gateway device can shield all downstream devices from exposure to the internet. It can sit in between an OT network which does not have connectivity and an IT network which provides access to the web. 
* **Connection multiplexing** - All devices connecting to IoT Hub through an IoT Edge device will use the same underlying connection.
* **Traffic smoothing** - The IoT Edge device will automatically implement exponential backoff in case of IoT Hub throttling, while persisting the messages locally. This will make your solution resilient to spikes in traffic.
* **Limited offline support** - The gateway device will store locally messages and twin updates that cannot be delivered to IoT Hub.

A gateway does protocol translation can also perform edge analytics, device isolation, traffic smoothing, and offline support to existing devices and new devices that are resource constrained. Many existing devices are producing data that can power business insights; however they were not designed with cloud connectivity in mind. Opaque gateways allow this data to be unlocked and utilized in an end to end IoT solution.

A gateway that does identity translation provide the benefits of protocol translation and additionally allow for full manageability of downstream devices from the cloud. All devices in your IoT solution show up in IoT Hub regardless of the protocol with they speak.

## Cheat sheet
Here is a quick cheat sheet that compares IoT Hub primitives when using transparent, opaque (protocol), and proxy gateways.

| &nbsp; | Transparent gateway | Protocol translation | Identity translation |
|--------|-------------|--------|--------|
| Identities stored in the IoT Hub identity registry | Identities of all connected devices | Only the identity of the gateway device | Identities of all connected devices |
| Device twin | Each connected device has its own device twin | Only the gateway has a device and module twins | Each connected device has its own device twin |
| Direct methods and cloud-to-device messages | The cloud can address each connected device individually | The cloud can only address the gateway device | The cloud can address each connected device individually |
| [IoT Hub throttles and quotas][lnk-iothub-throttles-quotas] | Apply to each device | Apply to the gateway device | Apply to each device |

When using an opaque gateway (protocol translation) pattern, all devices connecting through that gateway share the same cloud-to-device queue, which can contain at most 50 messages. It follows that the opaque gateway pattern should be used only when very few devices are connecting through each field gateway, and their cloud-to-device traffic is low.

## Next steps
Use an IoT Edge device as a [transparent gateway][lnk-iot-edge-as-transparent-gateway] 

[lnk-iot-edge-as-transparent-gateway]: ./how-to-create-transparent-gateway-linux.md
[lnk-iothub-throttles-quotas]: ../iot-hub/iot-hub-devguide-quotas-throttling.md

[1]: ./media/iot-edge-as-gateway/edge-as-gateway.png
