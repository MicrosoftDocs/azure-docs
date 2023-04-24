---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application with components, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp)

In this tutorial, you:

> [!div class="checklist"]
> * Download the sample code.
> * Build the sample code.
> * Run the sample device application and validate that it connects to your IoT hub.
> * Review the source code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

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

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](/cpp/build/vscpp-step-0-installation?preserve-view=true&view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

## Download the code

If you completed the [Tutorial: Connect a sample IoT Plug and Play device application running on Linux or Windows to IoT Hub (C)](../articles/iot-develop/tutorial-connect-device.md) you've already downloaded the code.

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in a folder of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-c.git
cd azure-iot-sdk-c
git submodule update --init
```

Expect this operation to take several minutes to complete.

## Build and run the code

You can build and run the code using Visual Studio or `cmake` at the command line.

### Use Visual Studio

1. Open the root folder of the cloned repository. After a couple of seconds, the **CMake** support in Visual Studio creates all you need to run and debug the project.
1. When Visual Studio is ready, in **Solution Explorer**, navigate to the sample *iothub_client/samples/pnp/pnp_temperature_controller/*.
1. Right-click on the *pnp_temperature_controller.c* file and select **Add Debug Configuration**. Select **Default**.
1. Visual Studio opens the *launch.vs.json* file. Edit this file as shown in the following snippet to set the required environment variables. You made a note of the scope ID and enrollment primary key when you completed [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md):

    ```json
    {
      "version": "0.2.1",
      "defaults": {},
      "configurations": [
        {
          "type": "default",
          "project": "iothub_client\\samples\\pnp\\pnp_temperature_controller\\pnp_temperature_controller.c",
          "projectTarget": "",
          "name": "pnp_temperature_controller.c",
          "env": {
            "IOTHUB_DEVICE_SECURITY_TYPE": "DPS",
            "IOTHUB_DEVICE_DPS_ID_SCOPE": "<Your ID scope>",
            "IOTHUB_DEVICE_DPS_DEVICE_ID": "my-pnp-device",
            "IOTHUB_DEVICE_DPS_DEVICE_KEY": "<Your enrollment primary key>"
          }
        }
      ]
    }
    ```

1. Right-click on the *pnp_temperature_controller.c* file and select **Set as Startup Item**.
1. To trace the code execution in Visual Studio, add a breakpoint to the `main` function in the *pnp_temperature_controller.c* file.
1. You can now run and debug the sample from the **Debug** menu.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use `cmake` at the command line

To build the sample:

1. Create a _cmake_ subfolder in the root folder of the cloned device SDK, and navigate to that folder:

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to generate and build the project files for SDK and samples:

    ```cmd/sh
    cmake ..
    cmake --build .
    ```

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/samples/pnp/readme.md).

To run the sample:

1. From the _cmake_ folder, navigate to the folder that contains the executable file and run it:

    ```bash
    # Bash
    cd iothub_client/samples/pnp/pnp_temperature_controller
    ./pnp_temperature_controller
    ```

    ```cmd
    REM Windows
    cd iothub_client\samples\pnp\pnp_temperature_controller\Debug
    pnp_temperature_controller.exe
    ```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. This sample implements a model with [multiple components](../articles/iot-develop/concepts-modeling-guide.md). The [Digital Twins Definition Language (DTDL) V2 model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

### IoT Plug and Play helper functions

For this sample, the code uses some helper functions from the */common* folder:

*pnp_device_client_ll* contains the connect method for IoT Plug and Play with the `model-id` included as a parameter: `PnP_CreateDeviceClientLLHandle`.

*pnp_protocol*: contains the IoT Plug and Play helper functions:

* `PnP_CreateReportedProperty`
* `PnP_CreateReportedPropertyWithStatus`
* `PnP_ParseCommandName`
* `PnP_CreateTelemetryMessageHandle`
* `PnP_ProcessTwinData`
* `PnP_CopyPayloadToString`
* `PnP_CreateDeviceClientLLHandle_ViaDps`

These helper functions are generic enough to use in your own project. This sample uses them in the three files that correspond to each component in the model:

* *pnp_deviceinfo_component*
* *pnp_temperature_controller*
* *pnp_thermostat_component*

For example, in the *pnp_deviceinfo_component* file, the `SendReportedPropertyForDeviceInformation` function uses two of the helper functions:

```c
if ((jsonToSend = PnP_CreateReportedProperty(componentName, propertyName, propertyValue)) == NULL)
{
    LogError("Unable to build reported property response for propertyName=%s, propertyValue=%s", propertyName, propertyValue);
}
else
{
    const char* jsonToSendStr = STRING_c_str(jsonToSend);
    size_t jsonToSendStrLen = strlen(jsonToSendStr);

    if ((iothubClientResult = IoTHubDeviceClient_LL_SendReportedState(deviceClientLL, (const unsigned char*)jsonToSendStr, jsonToSendStrLen, NULL, NULL)) != IOTHUB_CLIENT_OK)
    {
        LogError("Unable to send reported state for property=%s, error=%d", propertyName, iothubClientResult);
    }
    else
    {
        LogInfo("Sending device information property to IoTHub.  propertyName=%s, propertyValue=%s", propertyName, propertyValue);
    }
}
```

Each component in the sample follows this pattern.

### Code flow

The `main` function initializes the connection and sends the model ID:

```c
deviceClient = CreateDeviceClientAndAllocateComponents();
```

The code uses `PnP_CreateDeviceClientLLHandle` to connect to the IoT hub, set `modelId` as an option, and set up the device method and device twin callback handlers for direct methods and device twin updates:

```c
g_pnpDeviceConfiguration.deviceMethodCallback = PnP_TempControlComponent_DeviceMethodCallback;
g_pnpDeviceConfiguration.deviceTwinCallback = PnP_TempControlComponent_DeviceTwinCallback;
g_pnpDeviceConfiguration.modelId = g_temperatureControllerModelId;
...

deviceClient = PnP_CreateDeviceClientLLHandle(&g_pnpDeviceConfiguration);
```

`&g_pnpDeviceConfiguration` also contains the connection information. The environment variable **IOTHUB_DEVICE_SECURITY_TYPE** determines whether the sample uses a connection string or the device provisioning service to connect to the IoT hub.

When the device sends a model ID, it becomes an IoT Plug and Play device.

With the callback handlers in place, the device reacts to twin updates and direct method calls:

* For the device twin callback, the `PnP_TempControlComponent_DeviceTwinCallback` calls the `PnP_ProcessTwinData` function to process the data. `PnP_ProcessTwinData` uses the *visitor pattern* to parse the JSON and then visit each property, calling `PnP_TempControlComponent_ApplicationPropertyCallback` on each element.

* For the commands callback, the `PnP_TempControlComponent_DeviceMethodCallback` function uses the helper function to parse the command and component names:

    ```c
    PnP_ParseCommandName(methodName, &componentName, &componentNameSize, &pnpCommandName);
    ```

    The `PnP_TempControlComponent_DeviceMethodCallback` function then calls the command on the component:

    ```c
    LogInfo("Received PnP command for component=%.*s, command=%s", (int)componentNameSize, componentName, pnpCommandName);
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
}
```

The `PnP_ThermostatComponent_SendTelemetry` function shows you how to use the `PNP_THERMOSTAT_COMPONENT` struct. The sample uses this struct to store information about the two thermostats in the temperature controller. The code uses the `PnP_CreateTelemetryMessageHandle` function to prepare the message and send it:

```c
messageHandle = PnP_CreateTelemetryMessageHandle(pnpThermostatComponent->componentName, temperatureStringBuffer);
...
iothubResult = IoTHubDeviceClient_LL_SendEventAsync(deviceClientLL, messageHandle, NULL, NULL);
```

The `main` function finally destroys the different components and closes the connection to the hub.
