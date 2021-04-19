---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 11/20/2020
---

This tutorial shows you how to build a sample IoT Plug and Play device application with components, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in C# and is included in the Azure IoT device SDK for C#. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

In this tutorial, you:

> [!div class="checklist"]
> * Download the sample code.
> * Build the sample code.
> * Run the sample device application and validate that it connects to your IoT hub.
> * Review the source code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).

### Clone the SDK repository with the sample code

If you completed [Quickstart: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (C#)](../articles/iot-pnp/quickstart-connect-device.md), you've already cloned the repository.

Clone the samples from the Azure IoT Samples for C# GitHub repository. Open a command prompt in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT samples for .NET](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository:

```cmd
git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
```

## Run the sample device

In this quickstart, you use a sample temperature controller device that's written in C# as the IoT Plug and Play device. To run the sample device:

1. Open the *azure-iot-samples-csharp\iot-hub\Samples\device\PnpDeviceSamples\TemperatureController\TemperatureController.csproj* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > TemperatureController Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | DPS |
    | IOTHUB_DEVICE_DPS_ENDPOINT | global.azure-devices-provisioning.net |
    | IOTHUB_DEVICE_DPS_ID_SCOPE | The value you made a note of when you completed [Set up your environment](../articles/iot-pnp/set-up-environment.md) |
    | IOTHUB_DEVICE_DPS_DEVICE_ID | my-pnp-device |
    | IOTHUB_DEVICE_DPS_DEVICE_KEY | The value you made a note of when you completed [Set up your environment](../articles/iot-pnp/set-up-environment.md) |


1. You can now build the sample in Visual Studio and run it in debug mode.

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this instance of Visual Studio, you need it to confirm the service sample is working.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](../articles/iot-pnp/concepts-modeling-guide.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

The device code connects to your IoT hub using the standard `CreateFromConnectionString` method. The device sends the model ID of the DTDL model it implements in the connection request. A device that sends a model ID is an IoT Plug and Play device:

```csharp
private static DeviceClient InitializeDeviceClient(string hostname, IAuthenticationMethod authenticationMethod)
{
    var options = new ClientOptions
    {
        ModelId = ModelId,
    };

    var deviceClient = DeviceClient.Create(hostname, authenticationMethod, TransportType.Mqtt, options);
    deviceClient.SetConnectionStatusChangesHandler((status, reason) =>
    {
        s_logger.LogDebug($"Connection status change registered - status={status}, reason={reason}.");
    });

    return deviceClient;
}
```

The model ID is stored in the code as shown in the following snippet:

```csharp
private const string ModelId = "dtmi:com:example:TemperatureController;1";
```

After the device connects to your IoT hub, the code registers the command handlers. The `reboot` command is defined in the default component. The `getMaxMinReport` command is defined in each of the two thermostat components:

```csharp
await _deviceClient.SetMethodHandlerAsync("reboot", HandleRebootCommandAsync, _deviceClient, cancellationToken);
await _deviceClient.SetMethodHandlerAsync("thermostat1*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat1, cancellationToken);
await _deviceClient.SetMethodHandlerAsync("thermostat2*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat2, cancellationToken);

```

There are separate handlers for the desired property updates on the two thermostat components:

```csharp
_desiredPropertyUpdateCallbacks.Add(Thermostat1, TargetTemperatureUpdateCallbackAsync);
_desiredPropertyUpdateCallbacks.Add(Thermostat2, TargetTemperatureUpdateCallbackAsync);

```

The sample code sends telemetry from each thermostat component:

```csharp
await SendTemperatureAsync(Thermostat1, cancellationToken);
await SendTemperatureAsync(Thermostat2, cancellationToken);
```

The `SendTemperatureTelemetryAsync` method uses the `PnpHhelper` class to create messages for each component:

```csharp
using Message msg = PnpHelper.CreateIothubMessageUtf8(telemetryName, JsonConvert.SerializeObject(currentTemperature), componentName);
```

The `PnpHelper` class contains other sample methods that you can use with a multiple component model.

Use the Azure IoT explorer tool to view the telemetry and properties from the two thermostat components:

:::image type="content" source="media/iot-pnp-multiple-components-csharp/multiple-component.png" alt-text="Multiple component device in Azure IoT explorer":::

You can also use the Azure IoT explorer tool to call commands in either of the two thermostat components, or in the default component.
