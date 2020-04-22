---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub  | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample device code on Linux or Windows that connects to an IoT hub. Use the Azure CLI to view the information sent by the device to the hub.
author: dominicbetts/ericmitt
ms.author: dobett/ericmitt
ms.date: 04/22/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application running on Linux or Windows to IoT Hub (C)

[!INCLUDE [iot-pnp-quickstarts-2-selector.md](../../includes/iot-pnp-quickstarts-2-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT bub, and use the Azure CLI to view the information it sends to the hub. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution developer can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites for Linux

This quickstart assumes you're using Ubuntu Linux. The steps in this tutorial were tested using Ubuntu 18.04.

To complete this quickstart, you need to install the following software on your local Linux machine:

Install **GCC**, **Git**, **cmake**, and all dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

```sh
cmake --version
gcc --version
```
## Prerequisites for Windows

To complete this quickstart, you need to install the following software on your local machine:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```cmd\bash
git clone -b public-preview-pnp https://github.com/Azure/azure-iot-sdk-c.git 
cd azure-iot-sdk-c
git submodule update --init
```

You should expect this operation to take several minutes to complete.

## Build the code

You use the device SDK to build the included sample code. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. Create a `cmake` subdirectory in the device SDK root folder, and navigate to that folder:

    ```bash
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build the device SDK and the generated code stub:

    ```bash
    cmake ..
    ```

At this stage 2 options for building the code:
1. From the command line, build the SDK and all the samples:
    ```bash
    cmake --build .
    ```
2. On Windows you can open the CMake generated solution into Visual Studio 2019: ALL_BUILD.vcxproj (in the cmake directory created above) and make the digitalTwin_client project at startup project. You can now build it from Visual Studio and run in debug mode.

## Run the device sample

Run a sample application in the SDK to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. 

To run the sample application 2 options:

1. From the `cmake` folder, navigate to the folder that contains the executable file:

    ```bash
    cd digitaltwin_client/samples/digitaltwin_sample_device
    ```
    Run the executable file:

    ```bash
    ./digitaltwin_sample_device "<YourDeviceConnectionString>"
    ```
2. On Windows, you can also run it from Visual Studio in debug mode
Open the project in Visual Studio by opening the project digitaltwin_sample_device.vcxproj (if not already open) or just by opening the folder containing the CMakeLit.txt file. Put a break point on the main function (in digitaltwin_sample_device.c) to be able to trace the execution of the code. Add the device connection string to the debuger parameter (Debug|digitaltwin_sample_device Properties|Configuration Properties|Debugging|Command Arguments)

The device is now ready to receive commands and property updates, and has begun sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use the Azure IoT CLI to validate the code

After the device client sample starts, verify it's working with the Azure CLI.

Use the following command to view the telemetry the sample device is sending. You may need to wait a minute or two before you see any telemetry in the output:

```azurecli-interactive
az iot dt monitor-events --hub-name <YourIoTHubName> --device-id <YourDeviceID>
```

Use the following command to view the properties sent by the device:

```azurecli-interactive
az iot dt list-properties --hub-name <YourIoTHubName> --device-id <YourDeviceID> --interface sensor --source private --repo-login "<YourCompanyModelRepositoryConnectionString>"
```

### Use the Azure IoT explorer on Windows to validate the code

[!INCLUDE [iot-pnp-iot-explorer-1.md](../../includes/iot-pnp-iot-explorer-1.md)]

4. To ensure the tool can read the interface model definitions from your device, select **Settings**. In the Settings menu, **On the connected device** may already appear in the Plug and Play configurations; if it does not, select **+ Add module definition source** and then **On the connected device** to add it.

1. Back on the **Devices** overview page, find the device identity you created previously. With the device application still running in the command prompt, check that the device's **Connection state** in Azure IoT explorer is reporting as _Connected_ (if not, hit **Refresh** until it is). Select the device to view more details.

1. Expand the interface with ID **urn:YOUR_COMPANY_NAME_HERE:EnvironmentalSensor:1** to reveal the interface and IoT Plug and Play primitives—properties, commands, and telemetry.

[!INCLUDE [iot-pnp-iot-explorer-2.md](../../includes/iot-pnp-iot-explorer-2.md)]


[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Code comments
Navigate to /digitaltwin_client/samples
You will find the model for the environmental sensor in the json file: digitaltwin_sample_environmental_sensor/EnvironmentalSensor.interface.json
From this json model, we can create a set of C functions to model the sensor, with functions like:
```
DigitalTwinSampleEnvironmentalSensor_CreateInterface
DigitalTwinSampleEnvironmentalSensor_SendTelemetryMessagesAsync
DigitalTwinSampleEnvironmentalSensor_ProcessDiagnosticIfNecessaryAsync
DigitalTwinSampleEnvironmentalSensor_Close
```
Once done, you’ll need to create code for SDK Information Interface functions:
```
DigitalTwinSampleSdkInfo_CreateInterface
DigitalTwinSampleSdkInfo_Close
```
Same for the Digital Twin DeviceInformation interface:
```
DigitalTwinSampleDeviceInfo_CreateInterface
DigitalTwinSampleDeviceInfo_Close
```
So in your code you will deal with high level function defined in:
```
#include <../digitaltwin_sample_device_info/digitaltwin_sample_device_info.h>
#include <../digitaltwin_sample_environmental_sensor/digitaltwin_sample_environmental_sensor.h>
#include <../digitaltwin_sample_sdk_info/digitaltwin_sample_sdk_info.h>
```
Main code:
You define the Model ID to work with:

```
#define DIGITALTWIN_SAMPLE_ROOT_INTERFACE_ID "dtmi:YOUR_COMPANY_NAME_HERE:sample_device;1"
```
Once done you can create the deviceclient, from your device handle (no change with PPR on getting it)
```
DigitalTwin_DeviceClient_CreateFromDeviceHandle(deviceHandle, DIGITALTWIN_SAMPLE_DEVICE_CAPABILITY_MODEL_ID, &dtDeviceClientHandle)
```
Now it is time to call to create Interfaces on DeviceInfo, SDKInfo and our EnvironementalSensor with the following code call:
```
DigitalTwinSampleDeviceInfo_CreateInterface()
DigitalTwinSampleSdkInfo_CreateInterface()
DigitalTwinSampleEnvironmentalSensor_CreateInterface()
```
Once every interface are created, we should register them:
```
DigitalTwin_DeviceClient_RegisterInterfaces(...) 
```

Now, we can use the environmental sensor Twin, to report properties or send commands with:
```
DigitalTwinSampleEnvironmentalSensor_SendTelemetryMessagesAsync
```

Note that to be able to work with digital twin you need to include several headers:
```
#include <digitaltwin_device_client.h>
#include <digitaltwin_interface_client.h>
```
Under the cover these headers defined function used during Twin work:
```
DigitalTwin_InterfaceClient_Create
DigitalTwin_InterfaceClient_SetPropertiesUpdatedCallback
DigitalTwin_InterfaceClient_SetCommandsCallback
DigitalTwin_InterfaceClient_SendTelemetryAsync
DigitalTwin_InterfaceClient_ReportPropertyAsync
DigitalTwin_InterfaceClient_UpdateAsyncCommandStatusAsync
DigitalTwin_InterfaceClient_Destroy

DigitalTwin_DeviceClient_CreateFromDeviceHandle
DigitalTwin_DeviceClient_RegisterInterfaces
DigitalTwin_DeviceClient_Destroy

DigitalTwin_Client_GetVersionString
```

You can see the mapping between these ‘primitives’ and the one customized for our solution:
```
DigitalTwinSampleDeviceInfo_
DigitalTwinSampleSdkInfo_
DigitalTwinSampleEnvironmentalSensor_
```

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
