---
title: Device connectivity and telemetry ingress with Azure Digital Twins | Microsoft Docs
description: Overview of onboarding a device with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# Device connectivity and telemetry ingress

The telemetry data sent by devices and sensors form the backbone of any IoT Solution. As such, representing these disparate resources and managing them within the context of a location is a chief concern in IoT app development. Azure Digital Twins simplifies developing IoT solutions by uniting devices and sensors with a spatial intelligence graph.

To get started, an `IoTHub` resource should be created at the root of the spatial graph, allowing all devices beneath the root space to send messages. Once the IoT Hub has been created, and devices with sensors have been registered within the Digital Twins instance, the devices can start sending data to a Digital Twins service via the [Azure IoT Device SDK](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks#azure-iot-device-sdks).

A step-by-step guide for onboarding devices can be found in the [Tutorial to deploy and configure Digital Twins](tutorial-facilities-setup.md). At a glance, the steps are:

- Deploy an Azure Digital Twins instance from the [Azure portal](https://portal.azure.com)
- Create spaces in your graph
- Create an `IoTHub` resource and assign it to a space in your graph
- Create devices and sensors in your graph, and assign them to the spaces created in the steps above
- Create a matcher to filter telemetry messages based on conditions
- Create a [**user-defined function**](concepts-user-defined-functions.md) and assign it to a space in the graph for custom processing of your telemetry messages
- Assign a role to allow the user-defined function to access the graph data
- Get the IoT Hub device connection string from the Digital Twins Management APIs
- Configure the device connection string on the device with the Azure IoT Device SDK

Below you'll learn how to get the IoT Hub device connection string from the Digital Twins Management API and how to use the IoT Hub telemetry message format to send sensor-based telemetry. Digital Twins requires each piece of telemetry it receives to be associated with a sensor within the spatial graph to ensure the data is processed and routed within the appropriate spatial context.

## Get the IoT Hub device connection string from the Management API

Do a GET call on the Device API with an `includes=ConnectionString` parameter to get the IoT Hub device connection string. You can filter by device GUID or hardware ID to find the given device:

```plaintext
https://yourManagementApiUrl/api/v1.0/devices/yourDeviceGuid?includes=ConnectionString
```

```plaintext
https://yourManagementApiUrl/api/v1.0/devices?hardwareIds=yourDeviceHardwareId&includes=ConnectionString
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API |
| `yourDeviceGuid` | The device ID |
| `yourDeviceHardwareId` | The device hardware ID |

In the response payload, copy the device's `connectionString` property, which you'll use when calling the Azure IoT Device SDK to send data to Azure Digital Twins.

## Device to cloud message

You can customize your device's message format and payload to fit your solution's needs. You can use any data contract that can be serialized into a byte array or stream that is supported by the [Azure IoT Device Client Message class, Message(byte[] byteArray)](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.-ctor?view=azure-dotnet#Microsoft_Azure_Devices_Client_Message__ctor_System_Byte___). The message can be a custom binary format of your choice, as long as you decode the data contract in a corresponding User-Defined Function. The only requirement for a Device-to-Cloud message is to maintain a set of properties (see below) to ensure your message is routed appropriately to the processing engine.

### Telemetry properties

While the payload contents of a `Message` can be arbitrary data up to 256 kb in size, there are few requirements on expected [Message.Properties](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.properties?view=azure-dotnet). The steps outlined below reflect the required and optional properties supported by the system:

| Property Name | Value | Required | Description |
|---|---|---|---|
| DigitalTwins-Telemetry | 1.0 | yes | A constant value that identifies a message to the system |
| DigitalTwins-SensorHardwareId | `string(72)` | yes | A unique identifier of the sensor sending the `Message`. This value must match an object's `HardwareId` property for the system to process it. For example, `00FF0643BE88-CO2` |
| CreationTimeUtc | `string` | no | An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date string identifying the sampling time of the payload. For example, `2018-09-20T07:35:00.8587882-07:00` |
| CorrelationId | `string` | no | A `uuid` that can be used to trace events across the system. For example, `cec16751-ab27-405d-8fe6-c68e1412ce1f`

### Sending your message to Digital Twins

Use the DeviceClient [SendEventAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventasync?view=azure-dotnet) or [SendEventBatchAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventbatchasync?view=azure-dotnet) call to send your message to your Digital Twins service.

## Next steps

To learn about Azure Digital Twins' data processing and User-Defined Functions capabilities, read [Azure Digital Twins data processing and user-defined functions](concepts-user-defined-functions.md).

