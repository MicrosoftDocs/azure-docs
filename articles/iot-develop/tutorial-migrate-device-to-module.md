---
title: Tutorial - Connect a generic Azure IoT Plug and Play module | Microsoft Docs
description: Tutorial - Use sample C# IoT Plug and Play device code in a generic module.
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: tutorial
ms.service: iot-develop
services: iot-develop

#Customer intent: As a device builder, I want to learn how to implement a module that works with IoT Plug and Play.
---

# Tutorial: Connect an IoT Plug and Play module (C#)

This tutorial shows you how to connect a generic IoT Plug and Play [module](../iot-hub/iot-hub-devguide-module-twins.md).

A device is an IoT Plug and Play device if it:

* Publishes its model ID when it connects to an IoT hub.
* Implements the properties and methods described in the Digital Twins Definition Language (DTDL) model identified by the model ID.

To learn more about how devices use a DTDL and model ID, see [IoT Plug and Play developer guide](./concepts-developer-guide-device.md). Modules use model IDs and DTDL models in the same way.

To demonstrate how to implement an IoT Plug and Play module, this tutorial shows you how to:

> [!div class="checklist"]
> * Add a device with a module to your IoT hub.
> * Convert the thermostat C# device sample into a generic module.
> * Use the service SDK to interact with the module.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this tutorial, install the following software in your local development environment:

* Install the latest .NET for your operating system from [https://dot.net](https://dot.net).
* [Git](https://git-scm.com/download/).

Use the Azure IoT explorer tool to add a new device called **my-module-device** to your IoT hub.

Add a module called **my-module** to the **my-module-device**:

1. In the Azure IoT explorer tool, navigate to the **my-module-device** device.

1. Select **Module identity**, and then select **+ Add**.

1. Enter **my-module** as the module identity name and select **Save**.

1. In the list of module identities, select **my-module**. Then copy the primary connection string. You use this module connection string later in this tutorial.

1. Select the **Module twin** tab and notice that there are no desired or reported properties:

    ```json
    {
      "deviceId": "my-module-device",
      "moduleId": "my-module",
      "etag": "AAAAAAAAAAE=",
      "deviceEtag": "NjgzMzQ1MzQ1",
      "status": "enabled",
      "statusUpdateTime": "0001-01-01T00:00:00Z",
      "connectionState": "Disconnected",
      "lastActivityTime": "0001-01-01T00:00:00Z",
      "cloudToDeviceMessageCount": 0,
      "authenticationType": "sas",
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      },
      "modelId": "",
      "version": 2,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "0001-01-01T00:00:00Z"
          },
          "$version": 1
          },
          "reported": {
            "$metadata": {
              "$lastUpdated": "0001-01-01T00:00:00Z"
          },
          "$version": 1
        }
      }
    }
    ```

## Download the code

If you haven't already done so, clone the Azure IoT Hub Device C# SDK GitHub repository to your local machine:

Open a command prompt in a folder of your choice. Use the following command to clone the [Azure IoT C# SDK](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

## Prepare the project

To open and prepare the sample project:

1. Navigate to the *azure-iot-sdk-csharp/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat* folder.

1. Add the following environment variables to your shell environment:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | connectionString |
    | IOTHUB_MODULE_CONNECTION_STRING | The module connection string you made a note of previously |

    To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples#readme).

## Modify the code

To modify the code to work as a module instead of a device:

1. In your text editor or IDE, open *Parameter.cs* and modify the line that sets the **PrimaryConnectionString** variable as follows:

    ```csharp
    public string PrimaryConnectionString { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_MODULE_CONNECTION_STRING");
    ```

1. In your text editor or IDE, open *Program.cs* and replace the nine instances of the `DeviceClient` class with the `ModuleClient` class.

    > [!TIP]
    > Use the Visual Studio search and replace feature with **Match case** and **Match whole word** enabled to replace `DeviceClient` with `ModuleClient`.

1. In your text editor or IDE, open *Thermostat.cs* and replace both instances of the `DeviceClient` class with the `ModuleClient` class.

1. Save the changes to the files you modified.

1. To run the sample in your shell environment, make sure you're in the *azure-iot-sdk-csharp/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat* folder and that the environment variables are set. Then run:

    ```cmd/sh
    dotnet build
    dotnet run
    ```

If you run the code and then use the Azure IoT explorer to view the updated module twin, you see the updated device twin with the model ID and module reported property:

```json
{
  "deviceId": "my-module-device",
  "moduleId": "my-module",
  "etag": "AAAAAAAAAAE=",
  "deviceEtag": "MTk0ODMyMjI4",
  "status": "enabled",
  "statusUpdateTime": "0001-01-01T00:00:00Z",
  "connectionState": "Connected",
  "lastActivityTime": "2022-11-16T13:56:43.1711257Z",
  "cloudToDeviceMessageCount": 0,
  "authenticationType": "sas",
  "x509Thumbprint": {
    "primaryThumbprint": null,
    "secondaryThumbprint": null
  },
  "modelId": "dtmi:com:example:Thermostat;1",
  "version": 5,
  "properties": {
    "desired": {
      "$metadata": {
        "$lastUpdated": "0001-01-01T00:00:00Z"
      },
      "$version": 1
    },
    "reported": {
      "targetTemperature": {
        "value": 0,
        "ac": 203,
        "av": 0,
        "ad": "Initialized with default value"
      },
      "maxTempSinceLastReboot": 23.4,
      "$metadata": {
        "$lastUpdated": "2022-11-16T14:06:59.4376422Z",
        "targetTemperature": {
          "$lastUpdated": "2022-11-16T13:55:55.6688872Z",
          "value": {
            "$lastUpdated": "2022-11-16T13:55:55.6688872Z"
          },
          "ac": {
            "$lastUpdated": "2022-11-16T13:55:55.6688872Z"
          },
          "av": {
            "$lastUpdated": "2022-11-16T13:55:55.6688872Z"
          },
          "ad": {
            "$lastUpdated": "2022-11-16T13:55:55.6688872Z"
          }
        },
        "maxTempSinceLastReboot": {
          "$lastUpdated": "2022-11-16T14:06:59.4376422Z"
        }
      },
      "$version": 2
    }
  }
}
```

## Interact with a device module

The service SDKs let you retrieve the model ID of connected IoT Plug and Play devices and modules. You can use the service SDKs to set writable properties and call commands:

1. In another shell environment, navigate to the *azure-iot-sdk-csharp\iothub\service\samples\solutions\PnpServiceSamples\Thermostat* folder.

1. Add the following environment variables to your shell environment:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_ID | my-module-device |
    | IOTHUB_CONNECTION_STRING | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |

    > [!TIP]
    > You can also find your IoT hub connection string in the Azure IoT explorer tool.

1. In your text editor or IDE, open the *ThermostatSample.cs* file and modify the line that calls a command as follows:

    ```csharp
    CloudToDeviceMethodResult result = await _serviceClient.InvokeDeviceMethodAsync(_deviceId, "my-module", commandInvocation);
    ```

1. In the *ThermostatSample.cs* file, modify the line that retrieves the device twin as follows:

    ```csharp
    Twin twin = await s_registryManager.GetTwinAsync(s_deviceId, "my-module");
    ```

1. Save your changes.

1. Make sure the module client sample is still running, and then run this service sample:

    ```cmd/sh
    dotnet build
    dotnet run
    ```

The output from the service sample shows the model ID from the device twin and the command call:

```cmd
[11/16/2022 14:27:56]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  Get the my-module-device device twin.
...
[11/16/2022 14:27:58]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  The my-module-device device twin has a model with ID dtmi:com:example:Thermostat;1.
[11/16/2022 14:27:58]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  Update the targetTemperature property on the my-module-device device twin to 44.
[11/16/2022 14:27:58]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  Get the my-module-device device twin.
...
[11/16/2022 14:27:58]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  Invoke the getMaxMinReport command on my-module-device device twin.
[11/16/2022 14:27:59]dbug: Microsoft.Azure.Devices.Samples.ThermostatSample[0]
  Command getMaxMinReport was invoked on device twin my-module-device.
Device returned status: 200.
Report: {"maxTemp":23.4,"minTemp":23.4,"avgTemp":23.39999999999999,"startTime":"2022-11-16T14:26:00.7446533+00:00","endTime":"2022-11-16T14:27:54.3102604+00:00"}
```

The output from the module client shows the command handler's response:

```cmd
[11/16/2022 14:27:59]Microsoft.Azure.Devices.Client.Samples.ThermostatSample[0] Command: Received - Generating max, min and avg temperature report since 16/11/2022 14:25:58.
[11/16/2022 14:27:59]Microsoft.Azure.Devices.Client.Samples.ThermostatSample[0] Command: MaxMinReport since 16/11/2022 14:25:58: maxTemp=23.4, minTemp=23.4, avgTemp=23.39999999999999, startTime=16/11/2022 14:26:00, endTime=16/11/2022 14:27:54
```

## Convert to an IoT Edge module

To convert this sample to work as an IoT Plug and Play IoT Edge module, you must containerize the application. You don't need to make any further code changes. The connection string environment variable is injected by the IoT Edge runtime at startup. To learn more, see [Use Visual Studio 2019 to develop and debug modules for Azure IoT Edge](../iot-edge/how-to-visual-studio-develop-module.md).

To learn how to deploy your containerized module, see:

* [Run Azure IoT Edge on Ubuntu Virtual Machines](../iot-edge/how-to-install-iot-edge-ubuntuvm.md).
* [Install the Azure IoT Edge runtime on Debian-based Linux systems](../iot-edge/how-to-provision-single-device-linux-symmetric.md).

You can use the Azure IoT Explorer tool to see:

* The model ID of your IoT Edge device in the module twin.
* Telemetry from the IoT Edge device.
* IoT Edge module twin property updates triggering IoT Plug and Play notifications.
* The IoT Edge module reacts to your IoT Plug and Play commands.

## Clean up resources

[!INCLUDE [iot-pnp-clean-resources](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with modules to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play modeling developer guide](./concepts-developer-guide-device.md)