---
title: Basic Concepts for new IoT Hub Users | Microsoft Docs
description: This article shows the basic concepts for new users of Azure IoT Hub
author: robinsh
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/16/2021
#Customer intent: As a developer new to IoT Hub, learn the basic concepts and how to set up and use an IoT Hub.
---

# IoT Concepts

*Tejas: I stole these 3 paragraphs from the beginning of the About IoT Hub article; I was kind of thinking we needed an introduction to Iot Hub. Feel free to remove it or change it.*

IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communications in both directions between an IoT application and its attached devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT Hub. 

Several messaging patterns are supported, including device-to-cloud telemetry, uploading files from devices, and request-reply methods to control your devices from the cloud. IoT Hub also supports monitoring to help you track creating devices, connecting devices, and device failures.

With IoT Hub's capabilities, you can build scalable, full-featured IoT solutions such as managing industrial equipment used in manufacturing, tracking valuable assets in healthcare, and monitoring office building usage.

IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. The [device SDKs](iot-hub-devguide-sdks.md) help you address the challenges of connecting devices securely and reliably to your back-end service. 

Specifically, IoT devices:

- Are often embedded systems with no human operator (unlike a phone).
- Can be deployed in remote locations where physical access is expensive.
- May only be reachable through the solution back end.
- May have limited power and processing resources.
- May have intermittent, slow, or expensive network connectivity.
- May need to use proprietary, custom, or industry-specific application protocols.

## Connect and securely connect

Per-device authentication enables each device to connect securely to IoT Hub and for each device to be managed securely. You have complete control over device access and can control connections at the per-device level.

### Devices have a secure identity

Every device that connects to an IoT Hub has a device ID that's used to track cloud-to-device or device-to-cloud commuications. You configure a device with its connection information, which includes the IoT Hub hostname, the device ID, and the information the device uses to authenticate to IoT Hub. You can use a process called manual provisioning, in which you connect a single device to its IoT hub. For manual provisioning, you have two options for authenticating IoT Edge devices:

* symmetric key: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating. This method is faster to get started, but not as secure.

* X.509 Self-signed: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

*note: find corresponding info for iot hub? or take this out and use the info below? It feels like it's duplicate info.*

If you have many devices to set up and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub Device Provisioning Service:

*  [Create and provision IoT Edge devices using X.509 certificates](../iot-edge/how-to-auto-provision-x509-certs.md)

*  [Create and provision IoT Edge devices with a TPM](../iot-edge/how-to-auto-provision-simulated-device-linux.md)

*  [Create and provision IoT Edge devices using symmetric keys](../iot-edge/how-to-auto-provision-symmetric-keys.md)

The security token method provides authentication for each call made by the device to IoT Hub by associating the symmetric key to each call. X.509-based authentication allows authentication of an IoT device at the physical layer as part of the TLS connection establishment. The security-token-based method can be used without the X.509 authentication, which is a less secure pattern. The choice between the two methods is primarily dictated by how secure the device authentication needs to be, and availability of secure storage on the device (to store the private key securely).

### Devices can securely communicate with an IoT Hub

 IoT Hub uses security tokens to authenticate devices and services to avoid sending keys on the network. Additionally, security tokens are limited in time validity and scope. Azure IoT SDKs automatically generate tokens without requiring any special configuration. Some scenarios, however, require the user to generate and use security tokens directly. These scenarios include the direct use of the MQTT, AMQP, or HTTP surfaces, or the implementation of the token service pattern.

The internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports TLS 1.2, TLS 1.1, and TLS 1.0, in that order. Support for TLS 1.0 is provided for backward compatibility only. Check [TLS support in IoT Hub](iot-hub-tls-support.md) to see how to configure your hub to use TLS 1.2, which provides the most security.

## Communication patterns with a device

Typically, IoT devices send telemetry from the sensors to back-end services in the cloud. However, other types of communication are possible, such as a back-end service sending commands to your devices. Some examples of different types of communication include the following: 

*  A refrigeration truck sending temperature every 5 minutes to an IoT Hub
*  A back-end service sending a command to a device to change the frequency at which it sends telemetry to help diagnose a problem
*  A device monitoring a batch reactor in a chemical plant, sending an alert when the temperature exceeds a certain value

### Telemetry - Receive information back from the device such as data collected by a sensor

What is telemetry? Telemetry is data that a device sends to an IoT Hub. IoT Devices send events (notifications, acknowledgements, telemetry) to an application to gain insights. Applications may require specific subsets of events for processing or storage at different endpoints.

### Properties are state values or data that applications can access. 

*Tejas add some stuff here*

For example, the current firmware version of the device, or writable properties that can be updated, such a temperature, are properties.

Properties can be read or set from the IoT Hub, and can be used to send notifications when an action has completed. An example of a specific property on a device is temperature. This can be a writable property that can be updated on the device or read from a temperature sensor attached to the device. 

The way you can model properties in IoT Hub is through Device Twins or P&P.

### Commands can be used to execute methods directly on connected devices. An example of a command is rebooting the device.

IoT Hub implements commands by allowing you to invoke direct methods on devices from the cloud. [Direct methods](iot-hub-devguide-direct-methods.md) represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond.

## View and act on data collected from your devices

### Built-in endpoint collects data from your device by default

A built-in endpoint collects data from your device by default. The data is collected using a request-response pattern over dedicated IoT device endpoints, is available for a max of 7 days, and can be used to take actions on a device. 

For more information about IoT Hub endpoints, see [IoT Hub Dev Guide Endpoints](
iot-hub-devguide-endpoints#list-of-built-in-iot-hub-endpoints)

### Use Message Routing to send data to other endpoints for processing

These events may also need to be routed to different services for further processing. As the IoT solution scales out, the number of devices, volume of events, variety of events, and different services also varies. A flexible, scalable, consistent, and reliable method to route events is necessary to serve this pattern. 

You can also filter the data that is sent to different services. 

You can also use Message Routing to send data to other endpoints for further processing. As the IoT solution scales out, the number of devices, volume of events, variety of events, and different services, also varies. A flexible, scalable, consistent, and reliable method to route events is necessary to serve this pattern. For a tutorial showing multiple uses of message routing, see the [Routing Tutorial](tutorial-routing.md).

Event Grid is a fully managed event service that enables you to easily manage events across many different Azure services and applications. Made for performance and scale, it simplifies building event-driven applications and serverless archictures. Learn more about [Event Grid](https://azure.microsoft.com/services/event-grid/). 