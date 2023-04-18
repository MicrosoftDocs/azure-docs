---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This tutorial shows you how to use C# to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

* The latest [.NET SDK](https://dotnet.microsoft.com/download) for your platform.
* [Git](https://git-scm.com/download/).

### Clone the SDK repository with the sample code

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (C#)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Clone the samples from the Azure IoT SDK for C# GitHub repository. Open a command prompt in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

## Build the device code

You can now build the device sample and run it. Run the following commands to build the sample:

```cmd/sh
cd azure-iot-sdk-csharp/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat
dotnet build
```

## Run the device sample

To run the sample, run the following command:

```cmd/sh
dotnet run
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this tutorial, you use a sample IoT solution written in C# to interact with the sample device you just set up and ran.

1. In another terminal window, navigate to the *azure-iot-sdk-csharp/iothub/service/samples/solutions/PnpServiceSamples/Thermostat* folder.

1. Run the following command to build the service sample:

    ```cmd/sh
    dotnet build
    ```

1. Run the following command to run the service sample:

    ```cmd/sh
    dotnet run
    ```

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
