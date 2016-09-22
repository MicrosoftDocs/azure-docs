<properties
 pageTitle="Developer guide topics for IoT Hub | Microsoft Azure"
 description="Azure IoT Hub developer guide that includes IoT Hub endpoints, security, device identity registry, device management, and messaging"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Azure IoT Hub developer guide

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end.

Azure IoT Hub provides you with:

* Secure communications by using per-device security credentials and access control.
* Reliable device-to-cloud and cloud-to-device hyper-scale messaging.
* Easy device connectivity with device libraries for the most popular languages and platforms.

## Next steps

This IoT Hub developer guide includes the following articles:

- [Send and receive messages with IoT Hub][devguide-messaging] describes the messaging features (device-to-cloud and cloud-to-device) that IoT Hub exposes.
- [Upload files from a device][devguide-upload] describes how you can upload files from a device.
- [Manage device identities in IoT Hub][devguide-identities] describes what information each IoT hub's device identity registry stores, and how you can access and modify it.
- [Control access to IoT Hub][devguide-security] describes the security model used to grant access to IoT Hub functionality for both devices and cloud components.
- [Use device twins to synchronize state and configurations][devguide-device-twins] describes the *device twin* concept and the functionality it exposes.
- [Invoke a direct method on a device][devguide-directmethods] describes how to invoke methods on a device.
- [Schedule jobs on multiple devices][devguide-jobs] describes how you can schedule jobs on multiple devices.
- [Reference - IoT Hub endpoints][devguide-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Reference - query language for twins, methods, and jobs][devguide-query] describes that query language that enables to retrieve information from your hub about your devices.
- [Reference - quotas and throttling][devguide-quotas] summarizes the quotas set in the IoT Hub service and the expected throttling behavior.
- [Reference - Device and service SDKs][devguide-sdks] lists the SDKs you can use develop both device and service applications that interact with your hub.
- [Reference - IoT Hub MQTT support][devguide-mqtt] provides detailed information about how IoT Hub supports the MQTT protocol.
- [Glossary][devguide-glossary] a list of common IoT Hub-related terms.



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

