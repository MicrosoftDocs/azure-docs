---
title: Device infrastructure and connectivity
description: An overview of device infrastructure and connectivity in an Azure IoT solution, including gateways and protocols such as MQTT and OPC-UA.
ms.service: iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 03/20/2023
ms.custom: template-overview

# As a solution builder or device developer I want a high-level overview of the issues around device infrastructure and connectivity so that I can easily find relevant content.
---

# Device infrastructure and connectivity

This overview introduces the key concepts around how devices connect to the cloud in a typical Azure IoT solution. The article also introduces optional infrastructure elements such as gateways and bridges. Each section includes links to content that provides further detail and guidance.

IoT Central applications use the IoT Hub and the Device Provisioning Service (DPS) services internally. Therefore, the concepts in this article apply whether you're using IoT Central to explore an IoT scenario or building your solution by using IoT Hub and DPS.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the connectivity between the devices and the IoT cloud services, including gateways and bridges, shown in the diagram.

:::image type="content" source="media/iot-overview-device-connectivity/iot-architecture.svg" lightbox="media/iot-overview-device-connectivity/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting device connectivity areas." border="false":::

## Primitives

Azure IoT devices use the following primitives to exchange data with cloud services. Devices use:

- *Device-to-cloud* messages to send time series telemetry to the cloud. For example, temperature data collected from a sensor attached to the device.
- *Device twins* to share and synchronize state data with the cloud. For example, a device can use the device twin to report the current state of a valve it controls to the cloud and to receive a desired target temperature from the cloud.
- *Digital twins* to represent a device in the digital world. For example, a digital twin can represent a device's physical location, its capabilities, and its relationships with other devices.
- *File uploads* for media files such as captured images and video. Intermittently connected devices can send telemetry batches. Devices can compress uploads to save bandwidth.
- *Direct methods* to receive commands from the cloud. A direct method can have parameters and return a response. For example, the cloud can call a direct method to request the device to reboot.
- *Cloud-to-device* messages receive one-way notifications from the cloud. For example, a notification that an update is ready to download.

To learn more, see [Device-to-cloud communications guidance](../iot-hub/iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

## Device-facing cloud endpoints

An Azure IoT hub exposes a collection of per-device endpoints that let devices exchange data with the cloud. These endpoints include:

- *Send device-to-cloud messages*. A device uses this endpoint to send device-to-cloud messages.
- *Retrieve and update device twin properties*. A device uses this endpoint to access its device twin properties.
- *Receive direct method requests*. A device uses this endpoint to listen for direct method requests.

Every IoT hub has a unique hostname that's used to connect devices to the hub. The hostname is in the format `iothubname.azure-devices.net`. If you use one of the device SDKs, you don't need to know the full names of the individual endpoints because the SDKs provide higher level abstractions. However, the device does need to know the hostname of the IoT hub to which it's connecting.

A device can establish a secure connection to an IoT hub:

- Directly, in which case you must provide the device with a connection string that includes the hostname.
- Indirectly by using DPS, in which case the device connects to a well-known DPS endpoint to retrieve the connection string for the IoT hub it's assigned to.

The advantage of using DPS is that you don't need to configure all of your devices with connection-strings that are specific to your IoT hub. Instead, you configure your devices to connect to a well-known, common DPS endpoint where they discover their connection details. To learn more, see [Device Provisioning Service](../iot-dps/about-iot-dps.md).

To learn more about implementing automatic reconnections to endpoints, see [Manage device reconnections to create resilient applications](../iot-develop/concepts-manage-device-reconnections.md).

## Device connection strings

A device connection string provides a device with the information it needs to connect securely to an IoT hub. The connection string includes the following information:

- The hostname of the IoT hub.
- The device ID that's registered with the IoT hub.
- The security information the device needs to establish a secure connection to the IoT hub.

## Authentication and authorization

Azure IoT devices use TLS to verify the authenticity of the IoT hub or DPS endpoint they're connecting to. The device SDKs include the DigiCert Global Root G2 TLS certificate they currently need to establish a secure connection to the IoT hub. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md) and [TLS support in Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/tls-support.md).

Azure IoT devices can use either shared access signature (SAS) tokens or X.509 certificates to authenticate themselves to an IoT hub. X.509 certificates are recommended in a production environment. To learn more about device authentication, see:

- [Authenticate devices to IoT Hub by using X.509 CA certificates](../iot-hub/iot-hub-x509ca-overview.md)
- [Authenticate devices to IoT Hub by using SAS tokens](../iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device)
- [DPS symmetric key attestation](../iot-dps/concepts-symmetric-key-attestation.md)
- [DPS X.509 certificate attestation](../iot-dps/concepts-x509-attestation.md)
- [DPS trusted platform module attestation](../iot-dps/concepts-tpm-attestation.md)
- [Device authentication concepts in IoT Central](../iot-central/core/concepts-device-authentication.md)

All data exchanged between a device and an IoT hub is encrypted.

To learn more about security in your IoT solution, see [Security architecture for IoT solutions](iot-security-architecture.md).

## Protocols

An IoT device can use one of several network protocols when it connects to an IoT Hub or DPS endpoint:

- [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.pdf)
- MQTT over WebSockets
- [Advanced Message Queuing Protocol (AMQP)](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
- AMQP over WebSockets
- HTTPS

To learn more about how to choose a protocol for your devices to connect to the cloud, see:

- [Protocol support in Azure IoT Hub](../iot-hub/iot-hub-devguide-protocols.md)
- [Communicate with DPS using the MQTT protocol](../iot-dps/iot-dps-mqtt-support.md)
- [Communicate with DPS using the HTTPS protocol (symmetric keys)](../iot-dps/iot-dps-https-sym-key-support.md)
- [Communicate with DPS using the HTTPS protocol (X.509)](../iot-dps/iot-dps-https-x509-support.md)

Industrial IoT scenarios often use the [open platform communications unified architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/) industry standard open interface. To enable connectivity to IoT Hub, use the OPC Publisher that runs as a module on IoT Edge. To learn more, see [What is the OPC Publisher?](../industrial-iot/overview-what-is-opc-publisher.md)

## Connection patterns

There are two broad categories of connection patterns that IoT devices use to connect to the cloud:

### Persistent connections

Persistent connections are required when your solution needs *command and control* capabilities. In command and control scenarios, your IoT solution sends commands to devices to control their behavior in near real time. Persistent connections maintain a network connection to the cloud and reconnect whenever there's a disruption. Use either the MQTT or the AMQP protocol for persistent device connections to an IoT hub. The IoT device SDKs enable both the MQTT and AMQP protocols for creating persistent connections to an IoT hub.

### Ephemeral connections

Ephemeral connections are brief connections for devices to send telemetry to your IoT hub. After a device sends the telemetry, it drops the connection. The device reconnects when it has more telemetry to send. Ephemeral connections aren't suitable for command and control scenarios. A device client can use the HTTP API if all it needs to do is send telemetry.

## Field gateways

Field gateways (sometimes referred to as edge gateways) are typically deployed on-premises and close to your IoT devices. Field gateways handle communication with the cloud on behalf of your IoT devices. Field gateways may:

- Do protocol translation. For example, enabling Bluetooth enabled devices to connect to the cloud.
- Manage offline and disconnected scenarios. For example, buffering telemetry when the cloud endpoint is unreachable.
- Filter, compress, or aggregate telemetry before it's sent to the cloud.
- Run logic at the edge to remove the latency associated with running logic on behalf of devices in the cloud. For example, detecting a spike in temperature and opening a valve in response.

You can use Azure IoT Edge to deploy a field gateway to your on-premises environment. IoT Edge provides a set of features that enable you to deploy and manage field gateways at scale. IoT Edge also provides a set of modules that you can use to implement common gateway scenarios. To learn more, see [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)

An IoT Edge device can maintain a [persistent connection](#persistent-connections) to an IoT hub. The gateway forwards device telemetry to IoT Hub. This option enables command and control of the downstream devices connected to the IoT Edge device.

## Bridges

A device bridge enables devices that are connected to a third-party cloud to connect to your IoT solution. Examples of third-party clouds include [Sigfox](https://www.sigfox.com/), [Particle Device Cloud](https://www.particle.io/), and [The Things Network](https://www.thethingsnetwork.org/).

The open source IoT Central Device Bridge acts as a translator that forwards telemetry to an IoT Central application. To learn more, see [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge). There are third-party bridge solutions, such as [Tartabit IoT Bridge](/shows/internet-of-things-show/onboarding-constrained-devices-into-azure-using-tartabits-iot-bridge), for connecting devices to an IoT hub.

## Next steps

Now that you've seen an overview of device connectivity in Azure IoT solutions, some suggested next steps include

- [IoT device development](iot-overview-device-development.md)
- [Device management and control in IoT solutions](iot-overview-device-management.md)
