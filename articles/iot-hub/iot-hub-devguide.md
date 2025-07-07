---
title: Concepts overview for Azure IoT Hub
description: The Azure IoT Hub conceptual documentation includes discussions of endpoints, security, the identity registry, device management, direct methods, device twins, file uploads, jobs, the IoT Hub query language, messaging, and many other features.
author: SoniaLopezBravo

ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 01/13/2025
ms.custom:
  - mqtt
  - ignite-2023
---

# Azure IoT Hub concepts overview

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of devices and a solution back end.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Azure IoT Hub provides many features, including:

* Secure communications by using per-device security credentials and access control.

* Device-to-cloud and cloud-to-device hyper-scale communication options.

* Queryable storage of per-device state information and meta-data.

* Easy device connectivity with device libraries for the most popular languages and platforms.

The following sections can help you start exploring IoT Hub features in more depth.

## Manage

* [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md) summarizes the quotas set in the IoT Hub service and the throttling that occurs when you exceed a quota.

* [IoT Hub pricing](iot-hub-devguide-pricing.md) provides general information on different SKUs and pricing for IoT Hub and details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

## Develop

* [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md) compares the options for sending messages from your devices to IoT Hub: device-to-cloud messages, device twin's reported properties, and file upload.

* [Cloud-to-device communication guidance](iot-hub-devguide-c2d-guidance.md) compares the options for sending updates and instructions from IoT Hub to your devices: direct methods, device twin's desired properties, and cloud-to-device messages.

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md) describes the *device twin* concept. The article also describes the functionality device twins expose, such as synchronizing a device with its device twin. The article includes information about the data stored in a device twin.

* [Upload files from a device](iot-hub-devguide-file-upload.md) describes how you can upload files from a device. The article also includes information about concepts such as the notifications the upload process can send.

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md) describes the lifecycle of a direct method. The article describes how to invoke methods on a device from your back-end app and handle the direct method on your device.

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md) describes how you can schedule jobs on multiple devices. The article describes how to submit jobs that perform tasks as executing a direct method, updating a device using a device twin. It also describes how to query the status of a job.

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for runtime and management operations. The article also describes how you can create other endpoints in your IoT hub, and how to use a field gateway to enable connectivity to your IoT Hub endpoints in nonstandard scenarios.

## Messaging

* [Device-to-cloud and cloud-to-device messaging with IoT Hub](iot-hub-devguide-messaging.md) describes the messaging features (device-to-cloud and cloud-to-device) that IoT Hub exposes.

* [Read device-to-cloud messages from the built-in endpoint](iot-hub-devguide-messages-read-builtin.md) describes the scenarios that use the default messaging endpoint to access device messages.

* [Send cloud-to-device messages from IoT Hub](iot-hub-devguide-messages-c2d.md) describes the process and lifecycle for cloud-to-device messaging.

* [Choose a device communication protocol](iot-hub-devguide-protocols.md) describes the communication protocols that IoT Hub supports for device communication and lists the ports that should be open.

## Message routing

* [Route device-to-cloud messages to Azure services](iot-hub-devguide-messages-d2c.md) describes how to use IoT Hub to filter and forward device messages to other Azure services for storage or analysis.

## Device management

* [Manage device identities in IoT Hub](iot-hub-devguide-identity-registry.md) describes what information each IoT hub's identity registry stores. The article also describes how you can access and modify it.

## Authentication and authorization

* [Control access to IoT Hub by using Microsoft Entra Id](authenticate-authorize-azure-ad.md) describes the security model used to grant access to IoT Hub services APIs.

* [Authenticate identities with X.509 certificates](authenticate-authorize-x509.md) describes the role of X.509 certificates for authenticating devices to create secure connections between your devices and IoT Hub.

## Protocol support

* [IoT Hub MQTT support](../iot/iot-mqtt-connect-to-iot-hub.md) provides detailed information about how IoT Hub supports the MQTT protocol. The article describes the support for the MQTT protocol built in to the Azure IoT SDKs and provides information about using the MQTT protocol directly.
