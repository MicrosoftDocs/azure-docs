---
title: Device Connectivity and Telemetry Ingress with Azure Digital Twins | Microsoft Docs
description: Overview of onboarding a device with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: alinast
---

# Device Connectivity and Telemetry Ingress

An IoT solution's backbone is the telemetry data sent by devices and sensors. An `IoTHub` resource should be created at the root of the the spatial graph, allowing all devices beneath it to send messages. Once the IoTHub resource has been created, and devices with sensors have been registered within the service, the devices can start sending data to Digital Twins service via the [Azure IoT Device SDK](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks#azure-iot-device-sdks). 

A step-by-step guide for on-boarding devices can be found in the [Facility Management Tutorial](tutorial-facilities-app.md). At a glance, the steps are:

- Deploy Azure Digital Twins instance from [Azure portal](http://portal.azure.com)
- Create spaces in the graph
- Create an IoTHub resource and assign it to a space in the graph
- Create devices and sensors, and assign them to the spaces created
- Create a matcher to filter telemetry message based on conditions
- Create a [**User-Defined Function**](concepts-user-defined-functions.md) and assign it to a space in the graph for custom processing of telemetry message
- Assign a role to the User-Defined Function to be able to access the graph data
- Get IoT Hub device connection string from Digital Twins Management APIs
- Configure the device connection string on the device

Below you'll learn how to get IoT Hub device connection string from Digital Twins the Management API and how to adapt IoT Hub telemetry message format to send sensor-based telemetry. Digital Twins requires each piece of telemetry it receives is associated with a sensor within the graph. This is how Digital Twins ensures it can process and route the data in the proper way.

## Get the IoT Hub device connection string from the Management API

Do a GET call on device API with `includes=ConnectionString` parameter to get the IoT Hub device connection string; filter by `device-guid` or `hardware-id`

```
https://{{endpoint-management}}/api/v1.0/devices/<device-guid>?includes=ConnectionString or

https://{{endpoint-management}}/api/v1.0/devices?hardwareIds=<hardware-id>&includes=ConnectionString
```
    
In the response payload, get the device's `connectionString` property.

## Device-to-Cloud Telemetry Message 

You can customize the message format as well as the payload to your own needs. You can use any data contract that can be serialized into a byte array or stream that is supported by the [Azure IoT Device Client Message class Message(byte[] byteArray)](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.-ctor?view=azure-dotnet#Microsoft_Azure_Devices_Client_Message__ctor_System_Byte___). The message can be a custom binary format of your choice, as long as you decode the data contract in the User-Defined Function. The only requirement on a Device-to-Cloud message is to maintain a set of properties to ensure your message is routed appropriately to the processing engine.

### Telemetry Properties

While the payload contents of a `Message` can be arbitrary data up to 256 kb in size, there are few requirements on expected [Message.Properties](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.properties?view=azure-dotnet). The steps outlined below are reflecting the required and optional properties supported by the system:


| Property Name | Value | Required | Description |
|---|---|---|---|
| DigitalTwins-Telemetry | 1.0 | yes | A constant value that identifies a message to the system |
| DigitalTwins-SensorHardwareId | `string(72)` | yes | A unique identifier of the sensor sending the `Message`. This value must match an object's `HardwareId` property for the system to process it. For example `00FF0643BE88-CO2` |
| CreationTimeUtc | `string` | no | An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date string identifying the sampling time of the payload. For example `2018-09-20T07:35:00.8587882-07:00` |
| CorrelationId | `string` | no | A `uuid` that can be used to trace events across the system. For example `cec16751-ab27-405d-8fe6-c68e1412ce1f`

### Sending your message to Digital Twins

Use the DeviceClient [SendEventAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventasync?view=azure-dotnet) or [SendEventBatchAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventbatchasync?view=azure-dotnet) call to send your message to Digital Twins service.


## Next steps

Read more about Azure Digital Twins data processing and user-defined functions:

> [!div class="nextstepaction"]
> [Azure Digital Twins Data Processing and User-Defined Functions] (concepts-user-defined-functions.md)