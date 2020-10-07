---
title: Interact with an IoT Plug and Play device connected to your Azure IoT solution (C#) | Microsoft Docs
description: Use C# to connect to and interact with an IoT Plug and Play device that's connected to your Azure IoT solution.
author: ericmitt
ms.author: ericmitt
ms.date: 09/21/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution builder, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play device that's connected to your solution (C#)

[!INCLUDE [iot-pnp-quickstarts-service-selector.md](../../includes/iot-pnp-quickstarts-service-selector.md)]

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use C# to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this quickstart on Windows, you need the following software installed on your development machine:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).

### Clone the SDK repository with the sample code

If you completed [Quickstart: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (C#)](quickstart-connect-device-csharp.md), you've already cloned the repository.

Clone the samples from the Microsoft Azure IoT SDK for .NET GitHub repository. Open a command prompt in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT Samples for .NET](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository:

```cmd
git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
```

## Run the sample device

In this quickstart, you use a sample thermostat device that's written in C# as the IoT Plug and Play device. To run the sample device:

1. Open the *azure-iot-samples-csharp\iot-hub\Samples\device\PnpDeviceSamples\Thermostat\Thermostat.csproj* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | DPS |
    | IOTHUB_DEVICE_DPS_ENDPOINT | global.azure-devices-provisioning.net |
    | IOTHUB_DEVICE_DPS_ID_SCOPE | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |
    | IOTHUB_DEVICE_DPS_DEVICE_ID | my-pnp-device |
    | IOTHUB_DEVICE_DPS_DEVICE_KEY | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |


1. You can now build the sample in Visual Studio and run it in debug mode.

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this instance of Visual Studio, you need it to confirm the service sample is working.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub and device:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this quickstart, you use a sample IoT solution in C# to interact with the sample device you just set up.

1. In another instance of Visual Studio, open the *azure-iot-samples-csharp\iot-hub\Samples\service\PnpServiceSamples\Thermostat\Thermostat.csproj* project.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_ID | my-pnp-device |
    | IOTHUB_CONNECTION_STRING | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |

1. You can now build the sample in Visual Studio and run it in debug mode.

### Get digital twin

The following code snippet shows how the service application retrieves the digital twin:

```C#
// Get a Twin and retrieves model Id set by Device client
Twin twin = await s_registryManager.GetTwinAsync(s_deviceId);
s_logger.LogDebug($"Model Id of this Twin is: {twin.ModelId}");
```

> [!NOTE]
> This sample uses the **Microsoft.Azure.Devices.Client;** namespace from the **IoT Hub service client**. To learn more about how to retrieve the model ID, see the [developer guide](concepts-developer-guide-service.md).

This code generates the following output:

```cmd
[09/21/2020 11:26:04]dbug: Thermostat.Program[0]
      Model Id of this Twin is: dtmi:com:example:Thermostat;1
```

The following code snippet shows how to use a *patch* to update properties through the digital twin:

```C#
// Update the twin
var twinPatch = new Twin();
twinPatch.Properties.Desired[PropertyName] = PropertyValue;
await s_registryManager.UpdateTwinAsync(s_deviceId, twinPatch, twin.ETag);
```

This code generates the following output from the device when the service updates the `targetTemperature` property:

```cmd
[09/21/2020 11:26:05]dbug: Thermostat.ThermostatSample[0]
      Property: Received - { "targetTemperature": 60°C }.
[09/21/2020 11:26:05]dbug: Thermostat.ThermostatSample[0]
      Property: Update - {"targetTemperature": 60°C } is InProgress.

...

[09/21/2020 11:26:17]dbug: Thermostat.ThermostatSample[0]
      Property: Update - {"targetTemperature": 60°C } is Completed.
```

### Invoke a command

The following code snippet shows how to call a command:

```csharp
private static async Task InvokeCommandAsync()
{
    var commandInvocation = new CloudToDeviceMethod(CommandName) { ResponseTimeout = TimeSpan.FromSeconds(30) };

    // Set command payload
    string componentCommandPayload = JsonConvert.SerializeObject(s_dateTime);
    commandInvocation.SetPayloadJson(componentCommandPayload);

    CloudToDeviceMethodResult result = await s_serviceClient.InvokeDeviceMethodAsync(s_deviceId, commandInvocation);

    if (result == null)
    {
        throw new Exception($"Command {CommandName} invocation returned null");
    }

    s_logger.LogDebug($"Command {CommandName} invocation result status is: {result.Status}");
}
```

This code generates the following output from the device when the service calls the `getMaxMinReport` command:

```cmd
[09/21/2020 11:26:05]dbug: Thermostat.ThermostatSample[0]
      Command: Received - Generating max, min and avg temperature report since 21/09/2020 11:25:58.
[09/21/2020 11:26:05]dbug: Thermostat.ThermostatSample[0]
      Command: MaxMinReport since 21/09/2020 11:25:58: maxTemp=32, minTemp=32, avgTemp=32, startTime=21/09/2020 11:25:59, endTime=21/09/2020 11:26:04
```

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play modeling developer guide](concepts-developer-guide-device-csharp.md)
