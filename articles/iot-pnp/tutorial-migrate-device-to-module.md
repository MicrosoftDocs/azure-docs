---
title: Convert an IoT Plug and Play device to a Generic Module | Microsoft Docs
description: Use C# PnP device code and convert it to a module.
author: ericmitt
ms.author: ericmitt
ms.date: 9/22/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to learn how to implement a module that works with IoT Plug and Play.
---

# Tutorial: How to convert an IoT Plug and Play device to a module (C#)

This tutorial shows you how to convert IoT Plug and Play device code to run as a generic module.

A device is an IoT Plug and Play device if it publishes its model ID when it connects to an IoT hub and implements the properties and methods described in the Digital Twins Definition Language (DTDL) model identified by the model ID. To learn more about how devices use a DTDL and model ID, see [IoT Plug and Play developer guide](concepts-developer-guide.md). Modules use model IDs and DTDL models in the same way.

To demonstrate how to implement an IoT Plug and Play module, this tutorial shows you how to convert the thermostat C# device sample into a generic module.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/).
* [Git](https://git-scm.com/download/).

## Download the code

If you haven't already done so, clone the Azure IoT Hub Device C# SDK GitHub repository to your local machine:

Open a command prompt in a folder of your choice. Use the following command to clone the [Azure IoT C# SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

## Prepare the project

To open and prepare the sample project:

1. Open the *azure-iot-sdk-csharp\iothub\device\samples\DigitalTwinDeviceSamples\Thermostat\Thermostat.csproj"* project file in Visual Studio 2019.

1. In Visual Studio, navigate to **Project > Thermostat Properties > Debug**. Then add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | DPS |
    | IOTHUB_DEVICE_DPS_ENDPOINT | global.azure-devices-provisioning.net |
    | IOTHUB_DEVICE_DPS_ID_SCOPE | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |
    | IOTHUB_DEVICE_DPS_DEVICE_ID | my-pnp-device |
    | IOTHUB_DEVICE_DPS_DEVICE_KEY | The value you made a note of when you completed [Set up your environment](set-up-environment.md) |

    To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/samples/readme.md).

## Modify the code

To modify the code to work as a module instead of a device:

1. In Visual Studio, open *Program.cs* and find the `InitializeDeviceClient` method.

1. Change the code to use the **ModuleClient** class instead of the **DeviceClient** class as follows:

    ```csharp
    private static ModuleClient InitializeDeviceClient(string deviceConnectionString)
    {
        ...
        var deviceClient = ModuleClient.CreateFromConnectionString(deviceConnectionString, TransportType.Mqtt, options);
        ...
    }
    ```

1. Find the `SetupDeviceClientAsync` method and modify the code as follows:

    ```csharp
    
    ```

- change the deviceclient to ModuleClient as type (Ideally we should rename this variable, but let this sample short as possible):

```csharp
private static ModuleClient s_deviceClient;
```
- in the **InitializeDeviceClientAsync** method change the connection instruction to include the modelId as option to the connection:

```csharp
//s_deviceClient = DeviceClient.CreateFromConnectionString(s_deviceConnectionString, TransportType.Mqtt, options);

s_deviceClient = ModuleClient.CreateFromConnectionString(s_deviceConnectionString, TransportType.Mqtt, options);
```

Voila, your PnP module code is ready! We need now to configure the environment to run the sample.

## Running the PnP Module

Go in IoTExplorer, open the Hub and Device you want your module be hosted by. You can add a module to any device you created before (Of course on real devices you need to have enough resources, like memory to be able to create module)

Create a module identity for the device, name it, select the add hoc security settings. (Symetric key work well for this sample)

Open the module just created, copy the Primary connection string. Create the env variable **IOTHUB_MODULE_CONN_STRING** with the module connection string just copied.

Look at the Module Twin tab, who display the Json for the twin. Note the absence of modelId.

Switch back to Visual Studio, and run the project.

Look in IoT Explorer for:

- The module twin json now contains the modelId declared
- Telemetry passing at the device level (not at the pnp component level)
- Module twin property updates triggering PnP notifications

You can also send commands to your module.

## Interacting with a device module, from your solution

With the Service SDK, you can retrieve the modelId of a PnP device. It is the same for a module.
For example you can run the sample created for Service SDK [thermostat](Article link will be ready once service sample c# ready)...

Open the <yourclone>\azure-iot-sdk-csharp\iothub\service\samples\PnpServiceSamples\Thermostat

Open the **Program.cs**

Change the invoke method adding the moduleId as second parameter:

```csharp
CloudToDeviceMethodResult result = await s_serviceClient.InvokeDeviceMethodAsync(s_deviceId,"<ModuleName>" ,commandInvocation);

```
Let the device code running and sending telemetry, run this modified service sample from Visual Studio.
Note that the command in called in the device console:

```bash
[09/21/2020 17:13:01]dbug: Thermostat.Program[0]
      Telemetry: Sent - { "temperature": 42.8°C }.
[09/21/2020 17:13:02]dbug: Thermostat.Program[0]
      Command: Received - Generating max, min and avg temperature report since 9/21/2020 5:13:01 PM.
[09/21/2020 17:13:02]dbug: Thermostat.Program[0]
      Command: MaxMinReport since 9/21/2020 5:13:01 PM: maxTemp=42.8, minTemp=42.8, avgTemp=42.8, startTime=9/21/2020 5:13:01 PM, endTime=9/21/2020 5:13:01 PM
[09/21/2020 17:13:06]dbug: Thermostat.Program[0]
      Telemetry: Sent - { "temperature": 42.8°C }.
[09/21/2020 17:13:11]dbug: Thermostat.Program[0]
      Telemetry: Sent - { "temperature": 42.8°C }.
[09/21/2020 17:13:16]dbug: Thermostat.Program[0]
      Telemetry: Sent - { "temperature": 42.8°C }.
```

In the service console the return code is OK: 

```bash
[09/21/2020 17:13:01]dbug: Thermostat.Program[0]
      Initialize the service client.
[09/21/2020 17:13:01]dbug: Thermostat.Program[0]
      Get Twin model Id and Update Twin
[09/21/2020 17:13:01]dbug: Thermostat.Program[0]
      Model Id of this Twin is:
[09/21/2020 17:13:02]dbug: Thermostat.Program[0]
      Invoke a command
[09/21/2020 17:13:02]dbug: Thermostat.Program[0]
      Command getMaxMinReport invocation result status is: 200
```

## Make this a PnP IoT Edge Module

To make this a PnP IoT Edge module, we only need to containerize this application. The code does not need to be changed. The connection string environment variable will be injected by the IoT Edge runtime on startup.

To containerize your module, the easiest is to start from an empty C# IoT Edge module template by following [this tutorial](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-visual-studio-develop-module) and update the `Program.cs` code to the one created above.

Once your module has been containerized, deploy it on an IoT Edge device by following [this tutorial to simulate an IoT Edge device in Azure](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-ubuntuvm) or [this tutorial if you have a physical device](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux).

You can now again look in IoT Explorer to see:

- The module twin json of your IoT Edge device now contains the modelId declared
- Telemetry passing at the device level
- IoT Edge module twin property updates triggering PnP notifications
- The IoT Edge module reacting to your PnP commands

