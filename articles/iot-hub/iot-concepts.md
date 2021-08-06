---
title: Basic concepts for new Azure IoT Hub users | Microsoft Docs
description: This article shows the basic concepts for new users of Azure IoT Hub
author: robinsh
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/07/2021
#Customer intent: As a developer new to IoT Hub, learn the basic concepts and how to set up and use an IoT Hub.
---

# IoT concepts

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

## Securely connect and communicate

Per-device authentication enables each device to connect securely to IoT Hub and for each device to be managed securely. You have complete control over device access and can control connections at the per-device level.

### Devices have a secure identity

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to the IoT hub. Before a device or module can connect to an IoT hub, there must be an entry for that device or module in the IoT hub's identity registry. A device or module must also authenticate with the IoT hub based on credentials stored in the identity registry.

We support two methods of authentication between the device and the IoT Hub. In one case, you can use an SAS token-based authentication. The other method supported uses X.509 certificate authentication.

The SAS-based token method provides authentication for each call made by the device to IoT Hub by associating the symmetric key to each call. X.509-based authentication allows authentication of an IoT device at the physical layer as part of the Transport Layer Security (TLS) standard connection establishment. The security-token-based method can be used without the X.509 authentication, which is a less secure pattern. The choice between the two methods is primarily dictated by how secure the device authentication needs to be, and availability of secure storage on the device (to store the private key securely).

Azure IoT SDKs automatically generate tokens without requiring any special configuration. If you don't use the SDK, you'll have to generate the security tokens.

You can set up and provision many devices at a time using the [IoT Hub Device Provisioning Service](/azure/iot-dps).

### Devices can securely communicate with an IoT Hub

After selecting your Authentication method, the internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports TLS 1.2, TLS 1.1, and TLS 1.0, in that order. Support for TLS 1.0 is provided for backward compatibility only. Check TLS support in IoT Hub to see how to configure your hub to use TLS 1.2, which provides the most security.

## Communication patterns with a device

Typically, IoT devices send telemetry from the sensors to back-end services in the cloud. However, other types of communication are possible, such as a back-end service sending commands to your devices. Some examples of different types of communication include the following examples: 

*  A refrigeration truck sending temperature every 5 minutes to an IoT Hub
*  A back-end service sending a command to a device to change the frequency at which it sends telemetry to help diagnose a problem
*  A device monitoring a batch reactor in a chemical plant, sending an alert when the temperature exceeds a certain value

### Telemetry is data emitted by a device 

Examples of telemetry received from a device can include sensor data such as speed or temperature, an error message such as missed event, or an information message to indicate the device is in good health. IoT Devices send events (notifications, acknowledgments, telemetry) to an application to gain insights. Applications may require specific subsets of events for processing or storage at different endpoints.

### Properties are state values or data that applications can access. 

For example, the current firmware version of the device, or writable properties that can be updated, such a temperature, are properties. Properties can be read or set from the IoT Hub, and can be used to send notifications when an action has completed. An example of a specific property on a device is temperature. This can be a writable property that can be updated on the device or read from a temperature sensor attached to the device. 

You can enable properties in IoT Hub using [Device Twins](iot-hub-devguide-device-twins.md) or [Plug and Play](../iot-develop/overview-iot-plug-and-play.md).

    
To learn more about the differences between device twins and Plug and Play, see [Plug and Play](../iot-develop/concepts-digital-twin.md#device-twins-and-digital-twins).

### Commands can be used to execute methods directly on connected devices. 

An example of a command is rebooting the device. IoT Hub implements commands by allowing you to invoke direct methods on devices from the cloud. [Direct methods](iot-hub-devguide-direct-methods.md) represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond.

## View and act on data collected from your devices

IoT Hub gives you the ability to unlock the value of your device data with other Azure services so you can shift to predictive problem-solving, rather than reactive management. Connect your IoT Hub with other Azure services to do machine learning, analytics and AI to act on real-time data, optimize processing, and gain deeper insights.

### Built-in endpoint collects data from your devices by default

A built-in endpoint collects data from your device by default. The data is collected using a request-response pattern over dedicated IoT device endpoints, is available for a max of seven days, and can be used to take actions on a device. Here is the data accepted by the device endpoint:

*    Send device-to-cloud messages. A device uses this endpoint to send device-to-cloud messages.

*    Receive cloud-to-device messages. A device uses this endpoint to receive targeted cloud-to-device messages.

*    Initiate file uploads. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub to upload a file.

*    Retrieve and update device twin properties. A device uses this endpoint to access its device twin's properties. 

*    Receive direct method requests. A device uses this endpoint to listen for direct method's requests. 

For more information about IoT Hub endpoints, see [IoT Hub Dev Guide Endpoints](
iot-hub-devguide-endpoints.md#list-of-built-in-iot-hub-endpoints)

### Use Message Routing to send data to other endpoints for processing

Data can also be routed to different services for further processing. As the IoT solution scales out, the number of devices, volume of events, variety of events, and different services also varies. A flexible, scalable, consistent, and reliable method to route events is necessary to serve this pattern. Data can also be filtered to send to different services. Once a message route has been created, data stops flowing to the built-in-endpoint unless a fallback route has been configured. For a tutorial showing multiple uses of message routing, see the [Routing Tutorial](tutorial-routing.md).

IoT Hub also integrates with Event Grid which enables you to fan out data to multiple subscribers. Event Grid is a fully managed event service that enables you to easily manage events across many different Azure services and applications. Made for performance and scale, it simplifies building event-driven applications and serverless architectures. Learn more about Event Grid. The differences between message routing and using Event Grid are explained in the [Message Routing and Event Grid Comparison](iot-hub-event-grid-routing-comparison.md)
