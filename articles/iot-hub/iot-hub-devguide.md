---
title: Developer guide for Azure IoT Hub | Microsoft Docs
description: The Azure IoT Hub developer guide includes discussions of endpoints, security, the identity registry, device management, direct methods, device twins, file uploads, jobs, the IoT Hub query language, and messaging.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.author: dobett
---

# Azure IoT Hub developer guide

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of devices and a solution back end.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Azure IoT Hub provides you with:

* Secure communications by using per-device security credentials and access control.

* Multiple device-to-cloud and cloud-to-device hyper-scale communication options.

* Queryable storage of per-device state information and meta-data.

* Easy device connectivity with device libraries for the most popular languages and platforms.

This IoT Hub developer guide includes the following articles:

* [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md) helps you choose between device-to-cloud messages, device twin's reported properties, and file upload.

* [Cloud-to-device communication guidance](iot-hub-devguide-c2d-guidance.md) helps you choose between direct methods, device twin's desired properties, and cloud-to-device messages.

* [Device-to-cloud and cloud-to-device messaging with IoT Hub](iot-hub-devguide-messaging.md) describes the messaging features (device-to-cloud and cloud-to-device) that IoT Hub exposes.

  * [Send device-to-cloud messages to IoT Hub](iot-hub-devguide-messages-d2c.md).

  * [Read device-to-cloud messages from the built-in endpoint](iot-hub-devguide-messages-read-builtin.md).

  * [Use custom endpoints and routing rules for device-to-cloud messages](iot-hub-devguide-messages-read-custom.md).

  * [Send cloud-to-device messages from IoT Hub](iot-hub-devguide-messages-c2d.md).

  * [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).

* [Upload files from a device](iot-hub-devguide-file-upload.md) describes how you can upload files from a device. The article also includes information about topics such as the notifications the upload process can send.

* [Manage device identities in IoT Hub](iot-hub-devguide-identity-registry.md)describes what information each IoT hub's identity registry stores. The article also describes how you can access and modify it.

* [Control access to IoT Hub](iot-hub-devguide-security.md) describes the security model used to grant access to IoT Hub functionality for both devices and cloud components. The article includes information about using tokens and X.509 certificates, and details of the permissions you can grant.

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md) describes the *device twin* concept. The article also descibes the functionality device twins expose, such as synchronizing a device with its device twin. The article includes information about the data stored in a device twin.

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md) describes the lifecycle of a direct method. The article describes how to invoke methods on a device from your back-end app and handle the direct method on your device.

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md) describes how you can schedule jobs on multiple devices. The article describes how to submit jobs that perform tasks as executing a direct method, updating a device using a device twin. It also describes how to query the status of a job.

* [Reference - choose a communication protocol](iot-hub-devguide-protocols.md) describes the communication protocols that IoT Hub supports for device communication and lists the ports that should be open.

* [Reference - IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for runtime and management operations. The article also describes how you can create additional endpoints in your IoT hub, and how to use a field gateway to enable connectivity to your IoT Hub endpoints in non-standard scenarios.

* [Reference - IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md) describes that IoT Hub query language that enables you to retrieve information from your hub about your device twins and jobs.

* [Reference - quotas and throttling](iot-hub-devguide-quotas-throttling.md) summarizes the quotas set in the IoT Hub service and the throttling that occurs when you exceed a quota.

* [Reference - pricing](iot-hub-devguide-pricing.md) provides general information on different SKUs and pricing for IoT Hub and details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

* [Reference - Device and service SDKs](iot-hub-devguide-sdks.md) lists the Azure IoT SDKs for developing device and service apps that interact with your IoT hub. The article includes links to online API documentation.

* [Reference - IoT Hub MQTT support](iot-hub-mqtt-support.md) provides detailed information about how IoT Hub supports the MQTT protocol. The article describes the support for the MQTT protocol built-in to the Azure IoT SDKs and provides information about using the MQTT protocol directly.

* [Glossary](iot-hub-devguide-glossary.md) a list of common IoT Hub-related terms.