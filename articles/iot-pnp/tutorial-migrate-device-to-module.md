---
title: Connect a generic IoT Plug and Play module | Microsoft Docs
description: Use sample C# IoT Plug and Play device code in a generic module.
author: ericmitt
ms.author: ericmitt
ms.date: 9/22/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to learn how to implement a module that works with IoT Plug and Play.
---

# Tutorial: Connect an IoT Plug and Play module (C#)

This tutorial shows you how to connect a generic IoT Plug and Play [module](../iot-hub/iot-hub-devguide-module-twins.md).

A device is an IoT Plug and Play device if it publishes its model ID when it connects to an IoT hub and implements the properties and methods described in the Digital Twins Definition Language (DTDL) model identified by the model ID. To learn more about how devices use a DTDL and model ID, see [IoT Plug and Play developer guide](./concepts-developer-guide-device-csharp.md). Modules use model IDs and DTDL models in the same way.

To demonstrate how to implement an IoT Plug and Play module, this tutorial shows you how to convert the thermostat C# device sample into a generic module.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
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

Open a command prompt in a folder of your choice. Use the following command to clone the [Azure IoT C# Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository into this location:

```cmd
git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
```

## Prepare the project

To open and prepare the sample project:

1. Open the *azure-iot-sdk-csharp\iot-hub\Samples\device\PnpDeviceSamples\Thermostat\Thermostat.csproj* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | connectionString |
    | IOTHUB_MODULE_CONNECTION_STRING | The module connection string you made a note of previously |

    To learn more about the sample configuration, see the [sample readme](https://github.com/Azure-Samples/azure-iot-samples-csharp/blob/master/iot-hub/Samples/device/PnpDeviceSamples/readme.md).

## Modify the code

To modify the code to work as a module instead of a device:

1. In Visual Studio, open *Parameter.cs* and modify the line that sets the **PrimaryConnectionString** variable as follows:

    ```csharp
    public string PrimaryConnectionString { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_MODULE_CONNECTION_STRING");
    ```

1. In Visual Studio, open *Program.cs* and replace the seven instances of the `DeviceClient` class with the `ModuleClient` class.

    > [!TIP]
    > Use the Visual Studio search and replace feature with **Match case** and **Match whole word** enabled to replace `DeviceClient` with `ModuleClient`.

1. In Visual Studio, open *Thermostat.cs* and replace both instances of the `DeviceClient` class with the `ModuleClient` class as follows.

1. Save the changes to the files you modified.

If you run the code and then use the Azure IoT explorer to view the updated module twin, you see the updated device twin with the model ID and module reported property:

```json
{
  "deviceId": "my-module-device",
  "moduleId": "my-mod",
  "etag": "AAAAAAAAAAE=",
  "deviceEtag": "NjgzMzQ1MzQ1",
  "status": "enabled",
  "statusUpdateTime": "0001-01-01T00:00:00Z",
  "connectionState": "Connected",
  "lastActivityTime": "0001-01-01T00:00:00Z",
  "cloudToDeviceMessageCount": 0,
  "authenticationType": "sas",
  "x509Thumbprint": {
    "primaryThumbprint": null,
    "secondaryThumbprint": null
  },
  "modelId": "dtmi:com:example:Thermostat;1",
  "version": 3,
  "properties": {
    "desired": {
      "$metadata": {
        "$lastUpdated": "0001-01-01T00:00:00Z"
      },
      "$version": 1
    },
    "reported": {
      "maxTempSinceLastReboot": 5,
      "$metadata": {
        "$lastUpdated": "2020-09-28T08:53:45.9956637Z",
        "maxTempSinceLastReboot": {
          "$lastUpdated": "2020-09-28T08:53:45.9956637Z"
        }
      },
      "$version": 2
    }
  }
}
```

## Interact with a device module

The service SDKs let you retrieve the model ID of connected IoT Plug and Play devices and modules. You can use the service SDKs to set writable properties and call commands:

1. In another instance of Visual Studio, open the *azure-iot-sdk-csharp\iot-hub\Samples\service\PnpServiceSamples\Thermostat\Thermostat.csproj* project.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_ID | my-module-device |
    | IOTHUB_CONNECTION_STRING | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |

    > [!TIP]
    > You can also find your IoT hub connection string in the Azure IoT explorer tool.

1. Open the *Program.cs* file and modify the line that calls a command as follows:

    ```csharp
    CloudToDeviceMethodResult result = await s_serviceClient.InvokeDeviceMethodAsync(s_deviceId, "my-module", commandInvocation);
    ```

1. In the *Program.cs* file, modify the line that retrieves the device twin as follows:

    ```csharp
    Twin twin = await s_registryManager.GetTwinAsync(s_deviceId, "my-module");
    ```

1. Make sure the module client sample is still running, and then run this service sample. The output from the service sample shows the model ID from the device twin and the command call:

    ```cmd
    [09/28/2020 10:52:55]dbug: Thermostat.Program[0]
      Initialize the service client.
    [09/28/2020 10:52:55]dbug: Thermostat.Program[0]
      Get Twin model Id and Update Twin
    [09/28/2020 10:52:59]dbug: Thermostat.Program[0]
      Model Id of this Twin is: dtmi:com:example:Thermostat;1
    [09/28/2020 10:52:59]dbug: Thermostat.Program[0]
      Invoke a command
    [09/28/2020 10:53:00]dbug: Thermostat.Program[0]
      Command getMaxMinReport invocation result status is: 200
    ```

    The output from the module client shows the command handler's response:

    ```cmd
    [09/28/2020 10:53:00]dbug: Thermostat.ThermostatSample[0]
      Command: Received - Generating max, min and avg temperature report since 28/09/2020 10:52:55.
    [09/28/2020 10:53:00]dbug: Thermostat.ThermostatSample[0]
      Command: MaxMinReport since 28/09/2020 10:52:55: maxTemp=25.4, minTemp=25.4, avgTemp=25.4, startTime=28/09/2020 10:52:56, endTime=28/09/2020 10:52:56
    ```

## Convert to an IoT Edge module

To convert this sample to work as an IoT Plug and Play IoT Edge module, you must containerize the application. You don't need to make any further code changes. The connection string environment variable is injected by the IoT Edge runtime at startup. To learn more, see [Use Visual Studio 2019 to develop and debug modules for Azure IoT Edge](../iot-edge/how-to-visual-studio-develop-module.md).

To learn how to deploy your containerized module, see:

* [Run Azure IoT Edge on Ubuntu Virtual Machines](../iot-edge/how-to-install-iot-edge-ubuntuvm.md).
* [Install the Azure IoT Edge runtime on Debian-based Linux systems](../iot-edge/how-to-install-iot-edge.md).

You can use the Azure IoT Explorer tool to see:

* The model ID of your IoT Edge device in the module twin.
* Telemetry from the IoT Edge device.
* IoT Edge module twin property updates triggering IoT Plug and Play notifications.
* The IoT Edge module react to your IoT Plug and Play commands.

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with modules to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play modeling developer guide](./concepts-developer-guide-device-csharp.md)