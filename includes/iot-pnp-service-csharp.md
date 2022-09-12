---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/20/2020
---

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use C# to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this quickstart on Windows, you need the following software installed on your development machine:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).

### Clone the SDK repository with the sample code

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (C#)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Clone the samples from the Azure IoT SDK for C# GitHub repository. Open a command prompt in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

## Run the sample device

In this quickstart, you use a sample thermostat device that's written in C# as the IoT Plug and Play device. To run the sample device:

1. Open the *azure-iot-sdk-csharp\iothub\device\samples\solutions\PnpDeviceSamples\Thermostat\Thermostat.csproj* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | DPS |
    | IOTHUB_DEVICE_DPS_ENDPOINT | global.azure-devices-provisioning.net |
    | IOTHUB_DEVICE_DPS_ID_SCOPE | The value you made a note of when you completed [Set up your environment](../articles/iot-develop/set-up-environment.md) |
    | IOTHUB_DEVICE_DPS_DEVICE_ID | my-pnp-device |
    | IOTHUB_DEVICE_DPS_DEVICE_KEY | The value you made a note of when you completed [Set up your environment](../articles/iot-develop/set-up-environment.md) |

1. You can now build the sample in Visual Studio and run it in debug mode.

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this instance of Visual Studio, you need it to confirm the service sample is working.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub and device:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this quickstart, you use a sample IoT solution in C# to interact with the sample device you just set up.

1. In another instance of Visual Studio, open the *azure-iot-samples-csharp\iot-hub\Samples\service\PnpServiceSamples\Thermostat\Thermostat.csproj* project.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_ID | my-pnp-device |
    | IOTHUB_CONNECTION_STRING | The value you made a note of when you completed [Set up your environment](../articles/iot-develop/set-up-environment.md) |

1. You can now build the sample in Visual Studio and run it in debug mode.

### Get device twin

The following code snippet shows how the service application retrieves the device twin:

```C#
// Get a Twin and retrieves model Id set by Device client
Twin twin = await s_registryManager.GetTwinAsync(s_deviceId);
s_logger.LogDebug($"Model Id of this Twin is: {twin.ModelId}");
```

> [!NOTE]
> This sample uses the **Microsoft.Azure.Devices.Client** namespace from the **IoT Hub service client**. To learn more about the APIs, including the digital twins API, see the [service developer guide](../articles/iot-develop/concepts-developer-guide-service.md).

This code generates the following output:

```cmd
[09/21/2020 11:26:04]dbug: Thermostat.Program[0]
      Model Id of this Twin is: dtmi:com:example:Thermostat;1
```

The following code snippet shows how to use a *patch* to update properties through the device twin:

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
