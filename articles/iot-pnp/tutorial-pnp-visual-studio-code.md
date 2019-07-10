---
title: Create and test an Azure IoT Plug and Play device | Microsoft Docs
description: As a device developer, learn about how to use VS Code to create and test a new device capability model for an IoT Plug and Play device.
author: dominicbetts
ms.author: dobett
ms.date: 07/10/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a device builder, I want to use VS Code to create and test a new device capability model so I can prepare devices that are simple to connect an IoT solution.
---

# Tutorial: Create a test a device capability model using Visual Studio Code

This tutorial shows you how, as a device developer, to use Visual Studio code to create a _device capability model_. You can use the model to generate code to run on a device that connects to an Azure IoT Hub instance in the cloud.

The section in this tutorial that describes how to build the generated code assumes you're using Windows.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device capability model
> * Generate device code from the model
> * Implement the stubs in the generated code
> * Run the code to test the interactions with an IoT hub

## Prerequisites

To work with the device capability model in this tutorial, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): VS Code is available for multiple platforms
* [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

To build the generated C code on Windows in this tutorial, you need:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.
* [Git](https://git-scm.com/download)
* [CMake](https://cmake.org/download/)

To test your device code in this tutorial, you need:

* [Plug and Play Device Explorer](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/PnP-DeviceExplorer/README.md)
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Model your device

You use the _digital twin definition language_ to create a device capability model. A model typically consists of multiple _interface_ definition files and a single model file. The **Azure IoT Workbench extension for VS Code** includes tools to help you create and edit these JSON files.

### Create the interface file

To create an interface file that defines the capabilities of your IoT device in VS Code:

1. Create a folder on your machine called **EnvironmentalSensorDCM**.

1. Start VS Code and open the **EnvironmentalSensorDCM** folder.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Create Interface** command. Then enter **EnvironmentalSensor** as the name of the interface. VS Code creates a sample interface file called **EnvironmentalSensor.interface.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field with a unique value. The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:{your name}:EnvironmentalSensor:1",
      "@type": "Interface",
      "displayName": "Environmental Sensor",
      "description": "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
      "comment": "Requires temperature and humidity sensors.",
      "contents": [
        {
          "@type": "Property",
          "displayName": "Device State",
          "description": "The state of the device. Two states online/offline are available.",
          "name": "state",
          "schema": "boolean"
        },
        {
          "@type": "Property",
          "displayName": "Customer Name",
          "description": "The name of the customer currently operating the device.",
          "name": "name",
          "schema": "string",
          "writable": true
        },
        {
          "@type": "Property",
          "displayName": "Brightness Level",
          "description": "The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)",
          "name": "brightness",
          "writable": true,
          "schema": "long"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Temperature"
          ],
          "description": "Current temperature on the device",
          "displayName": "Temperature",
          "name": "temp",
          "schema": "double",
          "unit": "Units/Temperature/fahrenheit"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Humidity"
          ],
          "description": "Current humidity on the device",
          "displayName": "Humidity",
          "name": "humid",
          "schema": "double",
          "unit": "Units/Humidity/percent"
        },
        {
          "@type": "Command",
          "description": "This command will begin blinking the LED for given time interval.",
          "name": "blink",
          "requestSchema": {
            "@type": "Object",
            "fields": {
              "@type": "SchemaField",
              "name": "interval",
              "schema": "long"
            }
          },
          "responseSchema": "string",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnon",
          "responseSchema": "string",
          "comment": "This Commands will turn-on the LED light on the device.",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnoff",
          "comment": "This Commands will turn-off the LED light on the device.",
          "responseSchema": "string",
          "commandType": "synchronous"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/Interface.json"
    }
    ```

    This interface defines device properties such as **Customer Name**, telemetry types such as **Temperature**, and commands such as **blink**.

1. Save the file.

### Create the model file

The model file specifies the interfaces that your Plug and Play device implements. There are typically at least two interfaces in a model - one or more that define the specific capabilities of your device, and one standard interface that all Plug and Play devices must implement.

To create a model file that specifies the interfaces your Plug and Play device implements in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Create Capability Model** command. Then enter **EnvironmentalSensorModel** as the name of the model. VS Code creates a sample interface file called **EnvironmentalSensorModel.capabilitymodel.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field and in the `EnvironmentalSensor` interface with the same value you used in the **EnvironmentalSensor.interface.json** file. The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:dominicbetts:EnvironmentalSensorModel:1",
      "@type": "CapabilityModel",
      "displayName": "Environmental Sensor Model",
      "implements": [
        {
          "schema": "urn:dominincbetts:EnvironmentalSensor:1",
          "name": "environmentalSensor"
        },
        {
          "schema": "urn:azureiot:DeviceManagement:DeviceInformation:1",
          "name": "deviceinfo"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/CapabilityModel.json"
    }
    ```

    The model defines a device that implements your **EnvironmentalSensor** interface and the standard **DeviceInformation** interface.

1. Save the file.

### Download the DeviceInformation interface

Before you can generate code from the model, you must create a local copy of the **DeviceInformation** from the *public model repository*. The public model repository already contains the **DeviceInformation** interface.

To download the **DeviceInformation** interface from the public model repository using VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play**, select the **Open Model Repository** command, and then select **Open Public Model Repository**.

1. Select **Interfaces**, then select the device information interface with ID `http://azureiot.com/interfaces/DeviceInformation/1.0.0`, and then select **Download**.

You now have the three files that make up your device capability model:

* DeviceInformation.interface.json
* EnvironmentalSensor.interface.json
* EnvironmentalSensorModel.capabilitymodel.json

## Generate code

> [!NOTE]
> Bug bash: Skip this section - currently it's not possible to use the extension to generate code from local files.
> Use pre-prepared code instead of generating the code. You can view the pre-prepared code at [https://github.com/Azure/azure-iot-sdk-c-pnp/tree/public-preview-utopia/digitaltwin_client/samples](https://github.com/Azure/azure-iot-sdk-c-pnp/tree/public-preview-utopia/digitaltwin_client/samples).

You can use the **Azure IoT Workbench extension for VS Code** to generate skeleton C code from your model. To generate the code in VS Code:

1. Use the **Explorer** in VS Code to create a folder called `modelcode` in your workspace. You use this folder to save the C code generated from your model.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Generate Device Code Stub** command.

1. Select your **EnvironmentalSensorModel.capabilitymodel.json** capability model file.

1. Choose **ANSI C** as the language.

1. Choose **General Platform** as the target platform.

1. Select the **modelcode** folder in your workspace to save the generated C files.

VS Code generates the skeleton C code and saves the files in the **modelcode** folder. VS Code opens a new window that contains the generated code files.

## Update the generated code

> [!NOTE]
> Bug bash: Skip this step - the pre-prepared code already contains the implementation code.

Before you can build and run the code, you need to implement the stubbed properties, telemetry, and commands.

To provide implementations for the stubbed code in VS Code:

1. Open the **device_model.c** file.

1. Add code to implement the stubbed functions.

1. Save your changes.

## Build the code

Before you run the code to test your plug and play device with an Azure IoT hub, you need to compile the code. The following steps show you how to compile the code on Windows:

1. Clone the Azure IoT C SDK:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-c-pnp.git --recursive -b public-preview
    ```

    This command downloads the SDK to folder called **azure-iot-sdk-c-pnp** on your local machine.

<!-- Commenting out for bugbash
1. Copy the **modelcode** folder that contains the C files you generated in VS Code to the **azure-iot-sdk-c-pnp** folder.

1. In the **azure-iot-sdk-c-pnp\modelcode** folder, create a file called **main.c**. Add the following C code to this file:

    ```c
    #ifdef WIN32
    #include <windows.h>
    #elif _POSIX_C_SOURCE >= 199309L
    #include <time.h>   // for nanosleep
    #else
    #include <unistd.h> // for usleep
    #endif

    #include "application.h"

    void sleep_ms(int milliseconds) // cross-platform sleep function
    {
    #ifdef WIN32
        Sleep(milliseconds);
    #elif _POSIX_C_SOURCE >= 199309L
        struct timespec ts;
        ts.tv_sec = milliseconds / 1000;
        ts.tv_nsec = (milliseconds % 1000) * 1000000;
        nanosleep(&ts, NULL);
    #else
        usleep(milliseconds * 1000);
    #endif
    }

    int main(int argc, char *argv[])
    {
        if (argc != 2)
        {
            LogError("USAGE: pnp_app [IoTHub device connection string]");
        }

        application_initialize(argv[1], NULL);

        while (1)
        {
            application_run();
            sleep_ms(100);
        }
        return 0;
    }
    ```

1. In the **azure-iot-sdk-c-pnp\modelcode** folder, create a file called **CMakeList.txt**. Add the following content to this file:

    ```txt
    #Copyright (c) Microsoft. All rights reserved.
    #Licensed under the MIT license. See LICENSE file in the project root for full license information.

    #this is CMakeLists.txt for pnp_app

    compileAsC99()

    cmake_minimum_required(VERSION 2.8)

    file(GLOB pnp_app_src
        "*.c"
        "./utilities/*.c"
    )

    include_directories(.)
    include_directories(./utilities)
    include_directories(../deps/parson)
    include_directories(${SHARED_UTIL_INC_FOLDER})
    include_directories(${IOTHUB_CLIENT_INC_FOLDER})
    include_directories(${PNP_CLIENT_INC_FOLDER})

    add_executable(pnp_app ${pnp_app_src})

    target_link_libraries(pnp_app parson iothub_client pnp_client)
    ```

1. Add the following line at the end of the **CMakeList.txt** file in the **azure-iot-sdk-c-pnp** folder:

    ```txt
    add_subdirectory(modelcode)
    ```

End commented section -->

1. At the command prompt, navigate to the **azure-iot-sdk-c-pnp** folder. Then run the following commands to build the entire SDK folder:

    ```cmd
    mkdir cmake
    cd cmake
    cmake .. -G "Visual Studio 16 2019"
    cmake --build . -- /m /p:Configuration=Release
    ```

## Test the code

> [!NOTE]
> Bug bash: Use the provided IoT hub instances.

When you run the code, it connects to IoT Hub and starts sending sample telemetry and property values. The device also responds to commands sent from IoT Hub. To verify this behavior:

1. To create an IoT hub:

    ```azurecli-interactive
    az group create --name environmentalsensorresources --location eastus
    az iot hub create --name {your iot hub name} \
      --resource-group environmentalsensorresources --sku F1
    ```

1. Add a device to your IoT hub and retrieve its connection string:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {your iot hub name} --device-id MyPnPDevice
    az iot hub device-identity show-connection-string --hub-name {your iot hub name} --device-id MyPnPDevice --output table
    ```

    Make a note of the connection string.

1. At a command prompt, navigate to the **azure-iot-sdk-c-pnp** folder where you built the SDK and samples. Then navigate to the **cmake\\digitaltwin_client\\samples\\digitaltwin_sample_device\\Release** folder.

1. Run the following command:

    ```cmd
    digitaltwin_sample_device.exe {your device connection string}
    ```

1. Use the Plug and Play Device Explorer to interact with the device.

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to [build a device that's ready for certification](tutorial-build-device-certification.md) and list it in the Certified for Azure IoT device catalog.
