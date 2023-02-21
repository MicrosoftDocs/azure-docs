---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp)

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

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

To complete this tutorial on Windows, install the following software in your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](/cpp/build/vscpp-step-0-installation?preserve-view=true&view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-c.git
cd azure-iot-sdk-c
git submodule update --init
```

Expect this operation to take several minutes to complete.

## Build the code

You can build and run the code using Visual Studio or `cmake` at the command line.

### Use Visual Studio

1. Open the root folder of the cloned repository. After a couple of seconds, the **CMake** support in Visual Studio creates all you need to run and debug the project.
1. When Visual Studio is ready, in **Solution Explorer**, navigate to the sample *iothub_client/samples/pnp/pnp_simple_thermostat/*.
1. Right-click on the *pnp_simple_thermostat.c* file and select **Add Debug Configuration**. Select **Default**.
1. Visual Studio opens the *launch.vs.json* file. Edit this file as shown in the following snippet to set the required environment variables. You made a note of the scope ID and enrollment primary key when you completed [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md):

    ```json
    {
      "version": "0.2.1",
      "defaults": {},
      "configurations": [
        {
          "type": "default",
          "project": "iothub_client\\samples\\pnp\\pnp_simple_thermostat\\pnp_pnp_simple_thermostat.c",
          "projectTarget": "",
          "name": "pnp_simple_thermostat.c",
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

1. Right-click on the *pnp_simple_thermostat.c* file and select **Set as Startup Item**.
1. To trace the code execution in Visual Studio, add a breakpoint to the `main` function in the *pnp_simple_thermostat.c* file.
1. You can now run and debug the sample from the **Debug** menu.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use cmake to build the code

You use the cmake command-line utility to build the code:

1. Create a _cmake_ subdirectory in the root folder of the device SDK, and navigate to that folder:

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build the SDK and samples:

    ```cmd/sh
    cmake -Duse_prov_client=ON -Dhsm_type_symm_key=ON -Drun_e2e_tests=OFF ..
    cmake --build .
    ```

## Run the device sample

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/samples/pnp/readme.md).

To run the sample application in the SDK that simulates an IoT Plug and Play device sending telemetry to your IoT hub:

From the _cmake_ folder, navigate to the folder that contains the executable file and run it:

```bash
# Bash
cd iothub_client/samples/pnp/pnp_simple_thermostat/
./pnp_simple_thermostat
```

```cmd
REM Windows
cd iothub_client\samples\pnp\pnp_simple_thermostat\Debug
.\pnp_simple_thermostat.exe
```

> [!TIP]
> To trace the code execution in Visual Studio on Windows, add a break point to the `main` function in the _pnp_simple_thermostat.c_ file.

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements a simple IoT Plug and Play thermostat device. The thermostat model doesn't use IoT Plug and Play [components](../articles/iot-develop/concepts-modeling-guide.md). The [DTDL model file for the thermostat device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) defines the telemetry, properties, and commands the device implements.

The device code uses the standard function to connect to your IoT hub:

```c
deviceHandle = IoTHubDeviceClient_CreateFromConnectionString(connectionString, MQTT_Protocol)
```

The device sends the model ID of the DTDL model it implements in the connection request. A device that sends a model ID is an IoT Plug and Play device:

```c
static const char g_ModelId[] = "dtmi:com:example:Thermostat;1";

...

IoTHubDeviceClient_SetOption(deviceHandle, OPTION_MODEL_ID, modelId)
```

The code that updates properties, handles commands, and sends telemetry is identical to the code for a device that doesn't use the IoT Plug and Play conventions.

The code uses the Parson library to parse JSON objects in the payloads sent from your IoT hub:

```c
// JSON parser
#include "parson.h"
```
