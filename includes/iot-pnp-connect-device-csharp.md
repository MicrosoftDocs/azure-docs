---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 11/20/2020
---

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written in C# and is included in the Azure IoT Samples for C#. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Samples/device/PnpDeviceSamples/Thermostat)

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this quickstart on Windows, you need the following software installed on your development machine:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).

## Download the code

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Samples for C# repository.

Open a command prompt in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT Samples for C# (.NET)](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository into this location:

```cmd
git clone  https://github.com/Azure-Samples/azure-iot-samples-csharp.git
```

## Build the code

You can now build the sample in Visual Studio and run it in debug mode.

1. Open the *azure-iot-samples-csharp\iot-hub\Samples\device\PnpDeviceSamples\Thermostat\Thermostat.csproj* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | DPS |
    | IOTHUB_DEVICE_DPS_ENDPOINT | global.azure-devices-provisioning.net |
    | IOTHUB_DEVICE_DPS_ID_SCOPE | The value you made a note of when you completed [Set up your environment](../articles/iot-pnp/set-up-environment.md) |
    | IOTHUB_DEVICE_DPS_DEVICE_ID | my-pnp-device |
    | IOTHUB_DEVICE_DPS_DEVICE_KEY | The value you made a note of when you completed [Set up your environment](../articles/iot-pnp/set-up-environment.md) |

You can now build the sample in Visual Studio and run it in debug mode.

## Run the device sample

To trace the code execution in Visual Studio on Windows, add a break point to the `main` function in the program.cs file.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements a simple IoT Plug and Play thermostat device. The model this sample implements doesn't use IoT Plug and Play [components](../articles/iot-pnp/concepts-modeling-guide.md). The [Digital Twins definition language (DTDL) model file for the thermostat device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) defines the telemetry, properties, and commands the device implements.

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

The code that updates properties, handles commands, and sends telemetry is identical to the code for a device that doesn't use the IoT Plug and Play conventions.

The sample uses a JSON library to parse JSON objects in the payloads sent from your IoT hub:

```csharp
using Newtonsoft.Json;

...

DateTime since = JsonConvert.DeserializeObject<DateTime>(request.DataAsJson);
```
