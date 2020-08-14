---
title: Connect IoT Plug and Play Preview sample C# component device code to IoT Hub  | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample C# device code that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 07/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect an IoT Plug and Play multiple component device application running on Windows to IoT Hub (C#)

[!INCLUDE [iot-pnp-tutorials-device-selector.md](../../includes/iot-pnp-tutorials-device-selector.md)]

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in C# and is included in the Azure IoT device SDK for C#. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

### Azure IoT explorer

To interact with the sample device in the second part of this tutorial, you use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this tutorial:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT explorer tool to find the IoT hub connection string.

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this tutorial:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```

[!INCLUDE [iot-pnp-download-models.md](../../includes/iot-pnp-download-models.md)]

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C# SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C# SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

## Build the code

Open the **azureiot.sln** solution file in Visual Studio 2019 and set the **TemperatureController** project as the startup project. In **Solution Explorer**, you can find this project file in **iothub > device > samples**.

You can now build the sample in Visual Studio and run it in debug mode.

## Run the device sample

Create an environment variable called **IOTHUB_DEVICE_CONNECTION_STRING** to store the device connection string you made a note of previously.

To trace the code execution in Visual Studio on Windows, add a break point to the `main` function in the program.cs file.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](concepts-components.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

The device code connects to your IoT hub using the standard `CreateFromConnectionString` method. The device sends the model ID of the DTDL model it implements in the connection request. A device that sends a model ID is an IoT Plug and Play device:

```csharp
private static void InitializeDeviceClientAsync()
{
  var options = new ClientOptions
  {
      ModelId = ModelId,
  };
  s_deviceClient = DeviceClient.CreateFromConnectionString(s_deviceConnectionString, TransportType.Mqtt, options);
  s_deviceClient.SetConnectionStatusChangesHandler((status, reason) =>
  {
      s_logger.LogDebug($"Connection status change registered - status={status}, reason={reason}.");
  });
}
```

The model ID is stored in the code as shown in the following snippet:

```csharp
private const string ModelId = "dtmi:com:example:Thermostat;1";
```

After the device connects to your IoT hub, the code registers the command handlers. The `reboot` command is defined in the root interface. The `getMaxMinReport` command is defined in each of the two thermostat components:

```csharp
await s_deviceClient.SetMethodHandlerAsync("reboot", HandleRebootCommandAsync, s_deviceClient);
await s_deviceClient.SetMethodHandlerAsync("thermostat1*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat1);
await s_deviceClient.SetMethodHandlerAsync("thermostat2*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat2);
```

There are separate handlers for the desired property updates on the two thermostat components:

```csharp
s_desiredPropertyUpdateCallbacks.Add(Thermostat1, TargetTemperatureUpdateCallbackAsync);
s_desiredPropertyUpdateCallbacks.Add(Thermostat2, TargetTemperatureUpdateCallbackAsync);
```

The sample code sends telemetry from each thermostat component:

```csharp
await SendTemperatureAsync(Thermostat1);
await SendTemperatureAsync(Thermostat2);
```

The `SendTemperature` method uses the `PnpHhelper` class to create messages for each component:

```csharp
Message msg = PnpHelper.CreateIothubMessageUtf8(telemetryName, JsonConvert.SerializeObject(currentTemperature), componentName);
```

The `PnpHelper` class contains other sample methods that you can use with a multiple component model.

Use the Azure IoT explorer tool to view the telemetry and properties from the two thermostat components:

:::image type="content" source="media/tutorial-multiple-components-csharp/multiple-component.png" alt-text="Multiple component device in Azure IoT explorer":::

You can also use the Azure IoT explorer tool to call commands in either of the two thermostat components, or in the root interface.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
