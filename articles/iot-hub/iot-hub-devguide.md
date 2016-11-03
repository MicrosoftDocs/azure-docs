---
title: Developer guide topics for IoT Hub | Microsoft Docs
description: Azure IoT Hub developer guide that includes IoT Hub endpoints, security, device identity registry, device management, and messaging
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/30/2016
ms.author: dobett

---
# Azure IoT Hub developer guide
Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end.

Azure IoT Hub provides you with:

* Secure communications by using per-device security credentials and access control.
* Reliable device-to-cloud and cloud-to-device hyper-scale messaging.
* Easy device connectivity with device libraries for the most popular languages and platforms.

This IoT Hub developer guide includes the following articles:

* [Send and receive messages with IoT Hub][devguide-messaging] describes the messaging features (device-to-cloud and cloud-to-device) that IoT Hub exposes. The article also includes information about topics such as message formats, and the supported communications protocols and the port numbers they use.
* [Upload files from a device][devguide-upload] describes how you can upload files from a device. The article also includes information about topics such as the notifications the uplaod process can send.
* [Manage device identities in IoT Hub][devguide-identities] describes what information each IoT hub's device identity registry stores, and how you can access and modify it.
* [Control access to IoT Hub][devguide-security] describes the security model used to grant access to IoT Hub functionality for both devices and cloud components. The article includes information about using tokens and X.509 certificates, and details of the permissions you can grant.
* [Use device twins to synchronize state and configurations][devguide-device-twins] describes the *device twin* concept and the functionality it exposes such as synchronizing a device with its device twin. The article includes information about the data stored in a device twin.
* [Invoke a direct method on a device][devguide-directmethods] describes the lifecycle of a direct method, information about how to invoke methods on a device from your back-end app and handle the direct method on your device.
* [Schedule jobs on multiple devices][devguide-jobs] describes how you can schedule jobs on multiple devices. The article describes how to submit jobs that perform tasks as executing a direct method, updating a device using a device twin. It also describes how to query the status of a job.
* [Reference - IoT Hub endpoints][devguide-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations. The article also describes how you can use a field gateway to enable some devices to connect to your IoT Hub endpoints.
* [Reference - query language for twins, methods, and jobs][devguide-query] describes that query language that enables to retrieve information from your hub about your device twins and jobs.
* [Reference - quotas and throttling][devguide-quotas] summarizes the quotas set in the IoT Hub service and the throttling behavior you can expect to see when you exceed a quota.
* [Reference - Device and service SDKs][devguide-sdks] lists the SDKs you can use develop both device and service applications that interact with your IoT hub. The article includes links to online API documentation.
* [Reference - IoT Hub MQTT support][devguide-mqtt] provides detailed information about how IoT Hub supports the MQTT protocol. The article describes the support for the MQTT protocol built-in to the SDKs and provides information about using the MQTT protocol directly.
* [Glossary][devguide-glossary] a list of common IoT Hub-related terms.

[devguide-messaging]: iot-hub-devguide-messaging.md
[devguide-upload]: iot-hub-devguide-file-upload.md
[devguide-identities]: iot-hub-devguide-identity-registry.md
[devguide-security]: iot-hub-devguide-security.md
[devguide-device-twins]: iot-hub-devguide-device-twins.md
[devguide-directmethods]: iot-hub-devguide-direct-methods.md
[devguide-jobs]: iot-hub-devguide-jobs.md
[devguide-endpoints]: iot-hub-devguide-endpoints.md
[devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[devguide-query]: iot-hub-devguide-query-language.md
[devguide-sdks]: iot-hub-devguide-sdks.md
[devguide-mqtt]: iot-hub-mqtt-support.md
[devguide-glossary]: iot-hub-devguide-glossary.md

