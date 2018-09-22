---
title: Device Connectivity and Telemetry Ingress with Azure Digital Twins | Microsoft Docs
description: Overview of Onboarding a Device with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: alinast
---

# Onboarding a Device with Digital Twins

An IoT solution relies on data from devices and sensors on which to operate. An `IoTHub` ingress resource should be created within the spatial graph to allow devices to send messages to Azure Digital Twins. Once IoTHub resource has been created, and device and sensors have been registered within the service, those devices can start sending data to Digital Twins service via the [Azure IoT Device SDK](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks#azure-iot-device-sdks). 

Device onboarding process involves the following high-level steps. For step details and end to end scenario-based flow, please refer to Facility Management Tutorial.

* Deploy Azure Digital Twins instance from Azure Portal
* Provision graph of spaces
* Create an IoTHub Ingress resource and assign it to a space in the graph
* Provision devices, and sensors and assign them to spaces
* Create a User-Defined Function and assign it to a space in the graph for processing of telemetry messages
* Get IoT Hub device connection string from Digital Twins Management APIs
    >[!NOTE]
    >This step will get removed once we support integration with [IoT Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/) 
* Provision the device connection string to the device
* Device is ready to send data from multiple sensors to Digital Twins instance
* Digital Twins is ready for telemetry processing evaluating the User-Defined Function logic

This article focuses on how to get IoT Hub device connection string from Digital Twins Management API and how to change telemetry message to send sensor unique identifier. Digital Twins requires that each piece of telemetry it receives be associated with a sensor within the graph; this is how Digital Twins ensures it can process and route the data in the proper way.

# Get IoT Hub device connection string from Management API

Query device management API with `includes=ConnectionString` parameter to get the IoT Hub device connection string
```
GET https://{{endpoint-management}}/api/v1.0/devices/device-guid?includes=ConnectionString
```
    
In the response payload, get the device `connectionString` property. Example of device connection string:
```
"connectionString": "HostName=ih-8324e8f5-91e3-492a-8b8d-b096a970ec0d-2.azure-devices.net;DeviceId=45a0be1a-2bb8-498f-9b39-5725ef4cc4d3;SharedAccessKey=7ZrJDKxaY6m0y0RVwtRACzxIHIrzUNoqh677Clt0Uy4="
```

## Device-to-Cloud Telemetry Message 

You can customize the message format as well as the payload to your own needs. You can use any data contract that can be serialized into a byte array or stream that is supported by the [Azure IoT Device Client Message class Message(byte[] byteArray)](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.-ctor?view=azure-dotnet#Microsoft_Azure_Devices_Client_Message__ctor_System_Byte___). This can even be a custom binary format of your own choice, as long as you decode the data contract in the User-Defined Function. The only requirement on a Device-to-Cloud message is to maintain a set of properties to ensure your message is routed appropriately to the Data Processor responsible of invoking you user-defined function.

### Telemetry Properties

While the payload contents of a `Message` can be arbitrary data, up to 256kb in size, there are a few requirements on expected [Message.Properties](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.properties?view=azure-dotnet). The following is the list of required and optional properties supported by the system:

| Property Name | Value | Required | Description |
|---------------|-------|----------|-------------|
| DigitalTwins-Telemetry | 1.0 | yes | A constant value that identifies a message to the system |
| DigitalTwins-SensorHardwareId | `string(72)` | yes | A unique identifier pointing to a sensor in the graph for which the `Message` is meant for. This value must match an object's `HardwareId` property for the system to process it. E.g.: `00FF0643BE88-CO2` |
| CreationTimeUtc | `string` | no | An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date string identifying the sampling time of the payload. E.g.: `2018-09-20T07:35:00.8587882-07:00` |
| CorrelationId | `string` | no | A `uuid` formatted as a string that can be used to trace events across the system. E.g.: `cec16751-ab27-405d-8fe6-c68e1412ce1f`

### Sending your message to Digital Twins

Use the DeviceClient [SendEventAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventasync?view=azure-dotnet) call to send your message to Digital Twins service.

Alternatively, you could use [SendEventBatchAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventbatchasync?view=azure-dotnet) call to send a batch of events to Digital Twins service.

