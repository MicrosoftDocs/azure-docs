---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub  | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample device code on  Windows that connects to an IoT hub. Use the Azure CLI to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 04/23/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect an IoT Plug and Play Multiple component device application running on Windows to IoT Hub (C#)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a component-les sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure CLI to view the telemetry it sends. The sample application is written in CSharp and is included in the Azure IoT device SDK for C#. A solution developer can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites for Windows

To complete this quickstart on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](https://docs.microsoft.com/cpp/build/vscpp-step-0-installation?view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

### Azure IoT explorer

To interact with the sample device in the second part of this quickstart, you use the **Azure IoT explorer** tool. [Download and install the latest release of **Azure IoT explorer**](./howto-install-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT Explorer tool to find the IoT hub connection string.

## Download the code

### Code slope
In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C# SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C# SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository into this location:

```cmd\bash
git clone https://github.com/Azure/azure-iot-sdk-c.git
```

You should expect this operation to take several minutes to complete.

## Build the code

 On Windows, you can open the solution **azureiot.sln** in Visual Studio 2019 and set the **TemperatureController** project as the startup project in the solution.(see it under iothub|device|samples|Thermostat.csproj)

You can now build the sample in Visual Studio and run it in debug mode.

## Run the device sample

First create an environment variable and store in it, this application's connection string: **IOTHUB_DEVICE_CONNECTION_STRING**

To trace the code execution in Visual Studio on Windows, add a break point to the `main` function in the program.cs file.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Review the code

This code sample implement a simple temperature controller defined in this [DTDL file](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json)

In this sample we are going to implement a simple PnP device. As explained in <See concept article about PnP> the multiple component  sample will have a DTDL document with different component, each of them will have their specific telemetry twin properties and command the device implement. See the DTDL model above.

In this case the device code will connect the IoT hub 'as usual' via

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

As you see the ModelID is transmitted as an option, the device is now a PnP device!

The ModelId is stored in the code as:

```csharp
private const string ModelId = "dtmi:com:example:Thermostat;1";
```
After connecting, the code register method hadler, we can see the split for differents components (thermostat1, thermost2* or reboot at the root):

```csharp
await s_deviceClient.SetMethodHandlerAsync("reboot", HandleRebootCommandAsync, s_deviceClient);
await s_deviceClient.SetMethodHandlerAsync("thermostat1*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat1);
await s_deviceClient.SetMethodHandlerAsync("thermostat2*getMaxMinReport", HandleMaxMinReportCommandAsync, Thermostat2);
```
Same for the desired properties:

```csharp
s_desiredPropertyUpdateCallbacks.Add(Thermostat1, TargetTemperatureUpdateCallbackAsync);
s_desiredPropertyUpdateCallbacks.Add(Thermostat2, TargetTemperatureUpdateCallbackAsync);
```

Then the code is sending the temperatures measure, one for Thermosta1 one for thermostat2:

```csharp
await SendTemperatureAsync(Thermostat1);
await SendTemperatureAsync(Thermostat2);
```

In SendTemperture function, we can see the usage of PnpHhelper class and method (in PnpHelpers.cs file), to create message for a specific component:

```csharp
Message msg = PnpHelper.CreateIothubMessageUtf8(telemetryName, JsonConvert.SerializeObject(currentTemperature), componentName);
```

This class PnpHelper contains 8 sample methods, to use for multiple compoments model. Easy to reuse for your own devices.

As a result of executtion you can see the differents compoments, follow telemetry for thermostat1 or thermostat2, same for propertis and commands:

![Default component](iotexplorerMultipleComponent.JPG)


[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
