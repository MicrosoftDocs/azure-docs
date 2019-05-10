---
title: Device connectivity and telemetry ingress with Azure Digital Twins | Microsoft Docs
description: Overview of how to bring a device onboard with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/14/2018
ms.author: alinast
---

# Device connectivity and telemetry ingress

The telemetry data sent by devices and sensors form the backbone of any IoT solution. How to represent these different resources and manage them within the context of a location are chief concerns in IoT app development. Azure Digital Twins simplifies the process of developing IoT solutions by uniting devices and sensors with a spatial intelligence graph.

To get started, create an Azure IoT Hub resource at the root of the spatial graph. The IoT Hub resource allows all devices beneath the root space to send messages. After the IoT Hub is created, register devices with sensors within the Digital Twins instance. The devices can send data to a Digital Twins service via the [Azure IoT device SDK](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks).

For a step-by-step guide on how to bring devices onboard, see the [Tutorial to deploy and configure Digital Twins](tutorial-facilities-setup.md). At a glance, the steps are:

- Deploy a Digital Twins instance from the [Azure portal](https://portal.azure.com).
- Create spaces in your graph.
- Create an IoT Hub resource, and assign it to a space in your graph.
- Create devices and sensors in your graph, and assign them to the spaces created in the previous steps.
- Create a matcher to filter telemetry messages based on conditions.
- Create a [user-defined function](concepts-user-defined-functions.md), and assign it to a space in the graph for custom processing of your telemetry messages.
- Assign a role to allow the user-defined function to access the graph data.
- Get the IoT Hub device connection string from the Digital Twins Management APIs.
- Configure the device connection string on the device with the Azure IoT device SDK.

In the following sections, you learn how to get the IoT Hub device connection string from the Digital Twins Management API. You also learn how to use the IoT Hub telemetry message format to send sensor-based telemetry. Digital Twins requires each piece of telemetry that it receives to be associated with a sensor within the spatial graph. This requirement makes sure the data is processed and routed within the appropriate spatial context.

## Get the IoT Hub device connection string from the Management API

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

Do a GET call on the Device API with an `includes=ConnectionString` parameter to get the IoT Hub device connection string. Filter by the device GUID or the hardware ID to find the given device.

```plaintext
YOUR_MANAGEMENT_API_URL/devices/YOUR_DEVICE_GUID?includes=ConnectionString
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_DEVICE_GUID* | The device ID |

```plaintext
YOUR_MANAGEMENT_API_URL/devices?hardwareIds=YOUR_DEVICE_HARDWARE_ID&includes=ConnectionString
```

| Parameter value | Replace with |
| --- | --- |
| *YOUR_DEVICE_HARDWARE_ID* | The device hardware ID |

In the response payload, copy the device's **connectionString** property. You use it when you call the Azure IoT device SDK to send data to Digital Twins.

## Device-to-cloud message

You can customize your device's message format and payload to fit your solution's needs. Use any data contract that can be serialized into a byte array or stream that's supported by the [Azure IoT Device Client Message class, Message(byte[] byteArray)](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.-ctor?view=azure-dotnet#Microsoft_Azure_Devices_Client_Message__ctor_System_Byte___). The message can be a custom binary format of your choice, as long as you decode the data contract in a corresponding user-defined function. There's only one requirement for a device-to-cloud message. You must maintain a set of properties to make sure your message is routed appropriately to the processing engine.

### Telemetry properties

 The payload contents of a **Message** can be arbitrary data up to 256 KB in size. There are a few requirements expected for properties of the [`Message.Properties`](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.message.properties?view=azure-dotnet) type. The table shows the required and optional properties supported by the system.

| Property name | Value | Required | Description |
|---|---|---|---|
| **DigitalTwins-Telemetry** | 1.0 | Yes | A constant value that identifies a message to the system. |
| **DigitalTwins-SensorHardwareId** | `string(72)` | Yes | A unique identifier of the sensor that sends the **Message**. This value must match an object's **HardwareId** property for the system to process it. For example, `00FF0643BE88-CO2`. |
| **CreationTimeUtc** | `string` | No | An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date string that identifies the sampling time of the payload. For example, `2018-09-20T07:35:00.8587882-07:00`. |
| **CorrelationId** | `string` | No | A UUID that's used to trace events across the system. For example, `cec16751-ab27-405d-8fe6-c68e1412ce1f`.

### Send your message to Digital Twins

Use the DeviceClient [SendEventAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventasync?view=azure-dotnet) or [SendEventBatchAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.sendeventbatchasync?view=azure-dotnet) call to send your message to Digital Twins.

## Next steps

- To learn about Azure Digital Twins data processing and user-defined functions capabilities, read [Azure Digital Twins data processing and user-defined functions](concepts-user-defined-functions.md).
