---
title: Send telemetry to Azure IoT Hub quickstart (C) | Microsoft Docs
description: In this quickstart, you run two sample C applications to send simulated telemetry to an IoT hub and to read telemetry from the IoT hub for processing in the cloud.
author: wesmc7777
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.devlang: c
ms.topic: quickstart
ms.custom: [mvc, mqtt]
ms.date: 04/10/2019
ms.author: wesmc
# As a C developer new to IoT Hub, I need to see how IoT Hub sends telemetry from a device to an IoT hub and how to read that telemetry data from the hub using a back-end application. 
---

# Quickstart: Send telemetry from a device to an IoT hub and read it with a back-end application (C)

[!INCLUDE [iot-hub-quickstarts-1-selector](../../includes/iot-hub-quickstarts-1-selector.md)]

IoT Hub is an Azure service that enables you to ingest high volumes of telemetry from your IoT devices into the cloud for storage or processing. In this quickstart, you send telemetry from a simulated device application, through IoT Hub, to a back-end application for processing.

The quickstart uses a C sample application from the [Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md) to send telemetry to an IoT hub. The Azure IoT device SDKs are written in [ANSI C (C99)](https://wikipedia.org/wiki/C99) for portability and broad platform compatibility. Before running the sample code, you will create an IoT hub and register the simulated device with that hub.

This article is written for Windows, but you can complete this quickstart on Linux as well.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Install [Visual Studio 2019](https://www.visualstudio.com/vs/) with the ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled.

* Install the latest version of [Git](https://git-scm.com/download/).

* Make sure that port 8883 is open in your firewall. The device sample in this quickstart uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).


* Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IoT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

   ```azurecli-interactive
   az extension add --name azure-iot
   ```

[!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

## Prepare the development environment

For this quickstart, you'll be using the [Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md). 

For the following environments, you can use the SDK by installing these packages and libraries:

* **Linux**: apt-get packages are available for Ubuntu 16.04 and 18.04 using the following CPU architectures: amd64, arm64, armhf, and i386. For more information, see [Using apt-get to create a C device client project on Ubuntu](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/ubuntu_apt-get_sample_setup.md).

* **mbed**: For developers creating device applications on the mbed platform, we've published a library and samples that will get you started in minutes witH Azure IoT Hub. For more information, see [Use the mbed library](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md#mbed).

* **Arduino**: If you're developing on Arduino, you can leverage the Azure IoT library available in the Arduino IDE library manager. For more information, see [The Azure IoT Hub library for Arduino](https://github.com/azure/azure-iot-arduino).

* **iOS**: The IoT Hub Device SDK is available as CocoaPods for Mac and iOS device development. For more information, see [iOS Samples for Microsoft Azure IoT](https://cocoapods.org/pods/AzureIoTHubClient).

However, in this quickstart, you'll prepare a development environment used to clone and build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) from GitHub. The SDK on GitHub includes the sample code used in this quickstart.

1. Download the [CMake build system](https://cmake.org/download/).

    It is important that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system.

2. Find the tag name for the [latest release](https://github.com/Azure/azure-iot-sdk-c/releases/latest) of the SDK.

3. Open a command prompt or Git Bash shell. Run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Use the tag you found in the previous step as the value for the `-b` parameter:

    ```cmd/sh
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    You should expect this operation to take several minutes to complete.

4. Create a `cmake` subdirectory in the root directory of the git repository, and navigate to that folder. Run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd/sh
    mkdir cmake
    cd cmake
    ```

5. Run the following command to build a version of the SDK specific to your development client platform. A Visual Studio solution for the simulated device will be generated in the `cmake` directory.

    ```cmd
    cmake ..
    ```

    If `cmake` doesn't find your C++ compiler, you might get build errors while running the above command. If that happens, try running this command in the [Visual Studio command prompt](https://docs.microsoft.com/dotnet/framework/tools/developer-command-prompt-for-vs). 

    Once the build succeeds, the last few output lines will look similar to the following output:

    ```cmd/sh
    $ cmake ..
    -- Building for: Visual Studio 15 2017
    -- Selecting Windows SDK version 10.0.16299.0 to target Windows 10.0.17134.
    -- The C compiler identification is MSVC 19.12.25835.0
    -- The CXX compiler identification is MSVC 19.12.25835.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: E:/IoT Testing/azure-iot-sdk-c/cmake
    ```

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this section, you'll use the Azure Cloud Shell with the [IoT extension](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest) to register a simulated device.

1. Run the following command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

   **MyCDevice**: This is the name of the device you're registering. It's recommended to use **MyCDevice** as shown. If you choose a different name for your device, you'll also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyCDevice
    ```

2. Run the following command in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

   **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyCDevice --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyCDevice;SharedAccessKey={YourSharedAccessKey}`

    You'll use this value later in the quickstart.

## Send simulated telemetry

The simulated device application connects to a device-specific endpoint on your IoT hub and sends a string as simulated telemetry.

1. Using a text editor, open the iothub_convenience_sample.c source file and review the sample code for sending telemetry. The file is located in the following location under the working directory where you cloned the Azure IoT C SDK:

    ```
    azure-iot-sdk-c\iothub_client\samples\iothub_convenience_sample\iothub_convenience_sample.c
    ```

2. Find the declaration of the `connectionString` constant:

    ```C
    /* Paste in your device connection string  */
    static const char* connectionString = "[device connection string]";
    ```

    Replace the value of the `connectionString` constant with the device connection string you made a note of earlier. Then save your changes to **iothub_convenience_sample.c**.

3. In a local terminal window, navigate to the *iothub_convenience_sample* project directory in the CMake directory that you created in the Azure IoT C SDK. Enter the following command from your working directory:

    ```cmd/sh
    cd azure-iot-sdk-c/cmake/iothub_client/samples/iothub_convenience_sample
    ```

4. Run CMake in your local terminal window to build the sample with your updated `connectionString` value:

    ```cmd/sh
    cmake --build . --target iothub_convenience_sample --config Debug
    ```

5. In your local terminal window, run the following command to run the simulated device application:

    ```cmd/sh
    Debug\iothub_convenience_sample.exe
    ```

    The following screenshot shows the output as the simulated device application sends telemetry to the IoT hub:

    ![Run the simulated device](media/quickstart-send-telemetry-c/simulated-device-app.png)

## Read the telemetry from your hub

In this section, you'll use the Azure Cloud Shell with the [IoT extension](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest) to monitor the device messages that are sent by the simulated device.

1. Using the Azure Cloud Shell, run the following command to connect and read messages from your IoT hub:

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub monitor-events --hub-name {YourIoTHubName} --output table
    ```

    ![Read the device messages using the Azure CLI](media/quickstart-send-telemetry-c/read-device-to-cloud-messages-app.png)

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources.md)]

## Next steps

In this quickstart, you set up an IoT hub, registered a device, sent simulated telemetry to the hub using a C application, and read the telemetry from the hub using the Azure Cloud Shell.

To learn more about developing with the Azure IoT Hub C SDK, continue to the following How-to guide:

> [!div class="nextstepaction"]
> [Develop using Azure IoT Hub C SDK](iot-hub-devguide-develop-for-constrained-devices.md)
