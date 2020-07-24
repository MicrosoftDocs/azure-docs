---
title: Connect IoT Plug and Play Preview sample C device code to IoT Hub  | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample C device code that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 07/22/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect an IoT Plug and Play multiple component device application running on Linux or Windows to IoT Hub (C)

[!INCLUDE [iot-pnp-tutorials-device-selector.md](../../includes/iot-pnp-tutorials-device-selector.md)]

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

You can complete this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

The prerequisites differ by operating system:

### Linux

This tutorial assumes you're using Ubuntu Linux. The steps in this tutorial were tested using Ubuntu 18.04.

To complete this tutorial on Linux, install the following software on your local Linux environment:

Install **GCC**, **Git**, **cmake**, and all the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

```sh
cmake --version
gcc --version
```

### Windows

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](https://docs.microsoft.com/cpp/build/vscpp-step-0-installation?view=vs-2019) Visual Studio.
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

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```cmd/bash
git clone --depth 1 --recurse-submodules https://github.com/Azure/azure-iot-sdk-c.git
```

You should expect this operation to take several minutes to complete.

## Build the code

With Visual Studio 2019:

1. Open the root folder of the cloned repository. After a couple of seconds, the **CMake** support in Visual Studio creates all you need to run and debug the project.
1. When Visual Studio is ready, navigate to the sample *azure-iot-sdk-c/iothub_client/samples/pnp/pnp_temperature_controller/*.
1. The following section describes how to set the required environment variable before you run the sample. When you're ready, right-click on the *pnp_simple_thermostat* folder in **Solution Explorer** to debug or run the sample.

Or you can use the device SDK to build the included sample code:

1. Create a _cmake_ subdirectory in the root folder of the cloned device SDK, and navigate to that folder:

    ```cmd/bash
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to generate the project files for SDK and samples:

    ```cmd/bash
    cmake ..
    ```

    > [!TIP]
    > On Windows, you can open the solution generated by the `cmake` after running the command cmake .. above in Visual Studio 2019. Open the **azure_iot_sdks.sln** project file in the _cmake_ directory and set the **pnp_temperature_controller** project as the startup project in the solution. You can now build the sample in Visual Studio and run it in debug mode.

1. If you're not using Visual Studio, build the code:

    ```cmd/bash
    cmake --build .
    ```

## Run the device sample

Create an environment variable called **IOTHUB_DEVICE_CONNECTION_STRING** to store the device connection string you made a note of previously.

To trace the code execution in Visual Studio on Windows, add a break point to the `main` function in the *pnp_temperature_controller.c* file.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. This sample implements a model with [multiple components](concepts-components.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

### Helper functions

For this sample, the code use some helpers function from the */common* folder:

*pnp_device_client_helpers* contains the connect method for IoT Plug and Play with `model-id` as a parameter: `PnPHelper_CreateDeviceClientHandle`.

*pnp_protocol_helpers*: contains the IoT Plug and Play helper functions:

- `PnPHelperPropertyCallbackFunction`
- `PnPHelper_CreateReportedProperty`
- `PnPHelper_CreateReportedPropertyWithStatus`
- `PnPHelper_ParseCommandName`
- `PnPHelper_CreateTelemetryMessageHandle`
- `PnPHelper_ProcessTwinData`
- `PnPHelper_CopyPayloadToString`

These helper functions are generic enough to use in your own project. This sample uses them in the three files that correspond to each component in the model:

- *pnp_deviceinfo_component*
- *pnp_temperature_controller*
- *pnp_thermostat_component*

For example, in the *pnp_deviceinfo_component* find, the `SendReportedPropertyForDeviceInformation` function uses one of the helper functions:

```c
 if ((jsonToSend = PnPHelper_CreateReportedProperty(componentName, propertyName, propertyValue)) == NULL)
```

Each component in the sample follows this pattern.

### Code flow

The `main` function initializes the connection and sends the model ID:

```c
deviceClient = CreateDeviceClientAndAllocateComponents()
```

The code uses `PnPHelper_CreateDeviceClientHandle` to connect to the IoT hub and sets `modelId` as an option:

```c
deviceHandle = IoTHubDeviceClient_CreateFromConnectionString(connectionString, MQTT_Protocol)
...
iothubResult = IoTHubDeviceClient_SetOption(deviceHandle, OPTION_MODEL_ID, modelId)
```

When the device sends a model ID, it becomes an IoT Plug and Play device.

After connecting, the `PnPHelper_CreateDeviceClientHandle` function also registers the handlers:

```c
    iothubResult = IoTHubDeviceClient_SetDeviceMethodCallback(deviceHandle, deviceMethodCallback, NULL)
...
    iothubResult = IoTHubDeviceClient_SetDeviceTwinCallback(deviceHandle, deviceTwinCallback, (void*)deviceHandle)
```

With these handlers in place the device now can react to twin updates and direct method calls:

- For the device twin callback, the code uses the `PnP_TempControlComponent_DeviceTwinCallback` and calls `PnPHelper_ProcessTwinData` to process the data.  `PnPHelper_ProcessTwinData` uses the *visitor pattern* to parse the JSON and then visit each property, calling `PnP_TempControlComponent_ApplicationPropertyCallback` on each element.

- For commands the `PnP_TempControlComponent_DeviceMethodCallback` function filters on the name of the component:

    ```c
    if (strncmp((const char*)componentName, g_thermostatComponent1Name, g_thermostatComponent1Size) == 0)
    {
        result = PnP_ThermostatComponent_ProcessCommand(g_thermostatHandle1, pnpCommandName, rootValue, response, responseSize);
    }
    else if (strncmp((const char*)componentName, g_thermostatComponent2Name, g_thermostatComponent2Size) == 0)
    {
        result = PnP_ThermostatComponent_ProcessCommand(g_thermostatHandle2, pnpCommandName, rootValue, response, responseSize);
    }
    else
    {
        LogError("PnP component=%.*s is not supported by TemperatureController", (int)componentNameSize, componentName);
        result = PNP_STATUS_NOT_FOUND;
    }
    ```

The `main` function initializes the read-only properties sent to the IoT hub:

```c
PnP_TempControlComponent_ReportSerialNumber_Property(deviceClient);
PnP_DeviceInfoComponent_Report_All_Properties(g_deviceInfoComponentName, deviceClient);
PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(g_thermostatHandle1, deviceClient);
PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(g_thermostatHandle2, deviceClient);
```

The `main` function enters a loop to update event and telemetry data for each component:

```c
while (true)
{
    PnP_TempControlComponent_SendWorkingSet(deviceClient);
    PnP_ThermostatComponent_SendTelemetry(g_thermostatHandle1, deviceClient);
    PnP_ThermostatComponent_SendTelemetry(g_thermostatHandle2, deviceClient);
    ThreadAPI_Sleep(g_sleepBetweenTelemetrySends);
}
```

The `PnP_ThermostatComponent_SendTelemetry` function shows you how to use the `PNP_THERMOSTAT_COMPONENT`struct. The sample uses this struct to store information about the two thermostats in the temperature controller. The code uses the `PnPHelper_CreateTelemetryMessageHandle` function to prepare the message and send it:

```c
messageHandle = PnPHelper_CreateTelemetryMessageHandle(pnpThermostatComponent->componentName, temperatureStringBuffer)
...
iothubResult = IoTHubDeviceClient_SendEventAsync(deviceClient, messageHandle, NULL, NULL)
```

The `main` function finally destroys the different components and closes the connection to the hub.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
