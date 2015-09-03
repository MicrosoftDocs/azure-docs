<properties
 pageTitle="What are the Azure IoT device SDKs? | Microsoft Azure"
 description="A list of the available Azure IoT device SDKs with a summary of their features."
 services="azure-iot"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date=""
 ms.author="dobett"/>

# What are the Azure IoT device SDKs?

The devices and data sources in an Internet of Things (IoT) solution can range from a simple network-connected sensor to a powerful, standalone computing device. Devices may have limited processing capability, memory, communication bandwidth, and communication protocol support. To implement an IoT Hub client application to run on a device, you can choose from the following IoT device SDKs:
- The Azure IoT device SDK for C written in ANSI C (C99) for portability and [broad platform compatibility][lnk-supported-devices].
- The Azure IoT device SDK for Java for portability across the [broad range of platforms][lnk-supported-devices] that support Java.
- The Azure IoT device SDK for Node for portability across the [broad range of platforms][lnk-supported-devices] that support Node.js.
- The Azure IoT service SDK for .NET that includes a **DeviceClient** class. This enables you to develop IoT Hub clients that use the .NET runtime on Windows devices.

## Azure IoT device SDK for C
The [Azure IoT device SDK for C][lnk-c-sdk] includes libraries that enable you to build applications to run on IoT client devices. These devices connect to and are managed by an IoT hub.

The device libraries consist of a set of reusable components with abstract interfaces that enable pluggability between stock and custom modules.

To meet the wide range of device requirements in the IoT space, IoT device SDK for C provides the C libraries as source code to support the multiple form factors, operating systems, tools sets, protocols and communications patterns widely in use today.

### Features
Using the IoT device SDK for C, you can build client applications that:
- Send device-to-cloud telemetry data to IoT Hub.
- Map server commands sent from IoT Hub to device specific functions.
- Buffer data when the network connection is down.
- Batch messages to improve communication efficiency.
- Support pluggable transport protocols. The HTTP and AMQP protocols are available now.
- Supports pluggable message serialization methods. JSON is available now.

## Azure IoT device SDK for Java
The [IoT device SDK for Java][lnk-java-sdk] includes libraries that enable you to build applications to run on IoT client devices. These devices connect to and are managed by an IoT hub.

The device libraries consist of a set of reusable components with abstract interfaces that enable pluggability between stock and custom modules.

### Features
Using the IoT device SDK for Java, you can build client applications that:
- Send device-to-cloud telemetry data to IoT Hub.
- Map server commands sent from IoT Hub to device specific functions.
- Buffer data when the network connection is down.
- Batch messages to improve communication efficiency.
- Support pluggable transport protocols. The HTTP and AMQP protocols are available now.

## Azure IoT device SDK for Node
The [IoT device SDK for Node][lnk-node-sdk] includes libraries that enable you to build applications to run on IoT client devices. These devices connect to and are managed by an IoT hub.

The device libraries consist of a set of reusable components with abstract interfaces that enable pluggability between stock and custom modules.

### Features
Using the IoT device SDK for Node, you can build client applications that:
- Send device-to-cloud telemetry data to IoT Hub.
- Map server commands sent from IoT Hub to device specific functions.
- Buffer data when the network connection is down.
- Batch messages to improve communication efficiency.
- Support pluggable transport protocols. The HTTP and AMQP protocols are available now.

## Azure IoT service SDK for .NET
The IoT service SDK for .NET includes APIs for managing IoT Hub and sending cloud-to-device commands to your IoT devices. The IoT service SDK for .NET also contains APIs that, on a device running a Windows operating system, enable you to:
- Send device-to-cloud telemetry data to IoT Hub from a device.
- Receive cloud-to-device commands sent from IoT Hub.


## Next steps
To get started using these device SDKs, explore these resources:
- [Get started with IoT Hub][lnk-iot-hubs-get-started]

[lnk-c-sdk]: TBD
[lnk-java-sdk]: TBD
[lnk-node-sdk]: TBD
[lnk-supported-devices]: TBD
[lnk-iot-hubs-get-started]: TBD
