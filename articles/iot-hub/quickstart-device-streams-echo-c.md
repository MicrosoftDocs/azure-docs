---
title: Communicate to a device app in C via Azure IoT Hub device streams (preview) | Microsoft Docs
description: In this quickstart, you run a C device-side application that communicates with an IoT device via a device stream.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.devlang: c
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/14/2019
ms.author: robinsh
---

# Quickstart: Communicate to a device application in C via IoT Hub device streams (preview)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

Azure IoT Hub currently supports device streams as a [preview feature](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[IoT Hub device streams](iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. During public preview, the C SDK supports device streams on the device side only. As a result, this quickstart covers instructions to run only the device-side application. To run an accompanying service-side application, see:
 
   * [Communicate to device apps in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md)
   * [Communicate to device apps in Node.js via IoT Hub device streams](./quickstart-device-streams-echo-nodejs.md)

The device-side C application in this quickstart has the following functionality:

* Establish a device stream to an IoT device.
* Receive data that's sent from the service-side application and echo it back.

The code demonstrates the initiation process of a device stream, as well as how to use it to send and receive data.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* The preview of device streams is currently supported only for IoT hubs that are created in the following regions:

  * Central US
  * Central US EUAP

* Install [Visual Studio 2017](https://www.visualstudio.com/vs/) with the [Desktop development with C++](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled.

* Install the latest version of [Git](https://git-scm.com/download/).

* Run the following command to add the Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS)-specific commands to the Azure CLI.

   ```azurecli-interactive
   az extension add --name azure-cli-iot-ext
   ```

## Prepare the development environment

For this quickstart, you use the [Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md). You prepare a development environment used to clone and build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) from GitHub. The SDK on GitHub includes the sample code that's used in this quickstart.

1. Download the [CMake build system](https://cmake.org/download/).

    Before you start the CMake installation, it's important that the Visual Studio prerequisites (Visual Studio and the *Desktop development with C++* workload) are installed on your machine. After the prerequisites are in place and you've verified the download, you can install the CMake build system.

2. Open a command prompt or Git Bash shell. Execute the following command to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:

    ```
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive -b public-preview
    ```

    This operation should take a few minutes.

3. Create a *cmake* subdirectory in the root directory of the Git repository, as shown in the following command, and then go to that folder.

    ```
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

4. Run the following commands from the *cmake* directory to build a version of the SDK that's specific to your development client platform.

   * In Linux:

      ```bash
      cmake ..
      make -j
      ```

   * In Windows, run the following commands in Developer Command Prompt for Visual Studio 2015 or 2017. A Visual Studio solution for the simulated device will be generated in the *cmake* directory.

      ```cmd
      rem For VS2015
      cmake .. -G "Visual Studio 14 2015"

      rem Or for VS2017
      cmake .. -G "Visual Studio 15 2017"

      rem Then build the project
      cmake --build . -- /m /p:Configuration=Release
      ```

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub-device-streams](../../includes/iot-hub-include-create-hub-device-streams.md)]

## Register a device

You must register a device with your IoT hub before it can connect. In this section, you use Azure Cloud Shell with the [IoT Extension](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot?view=azure-cli-latest) to register a simulated device.

1. To create the device identity, run the following command in Cloud Shell:

   > [!NOTE]
   > * Replace the *YourIoTHubName* placeholder with the name you choose for your IoT hub.
   > * Use *MyDevice*, as shown. It's the name given for the registered device. If you choose a different name for your device, use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. To get the *device connection string* for the device that you just registered, run the following commands in Cloud Shell:

   > [!NOTE]
   > Replace the *YourIoTHubName* placeholder with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyDevice --output table
    ```

    Note the device connection string for later use in this quickstart. It looks like the following example:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`

## Communicate between the device and the service via device streams

In this section, you run both the device-side application and the service-side application and communicate between the two.

### Run the device-side application

To run the device-side application, do the following:

1. Provide your device credentials by editing the *iothub_client_c2d_streaming_sample.c* source file in the *iothub_client/samples/iothub_client_c2d_streaming_sample* folder and then providing your device connection string.

   ```C
   /* Paste in your iothub connection string  */
   static const char* connectionString = "[device connection string]";
   ```

2. Compile the code as follows:

   ```bash
   # In Linux
   # Go to the sample's folder cmake/iothub_client/samples/iothub_client_c2d_streaming_sample
   make -j
   ```

   ```cmd
   rem In Windows
   rem Go to the cmake folder at the root of repo
   cmake --build . -- /m /p:Configuration=Release
   ```

3. Run the compiled program:

   ```bash
   # In Linux
   # Go to the sample's folder cmake/iothub_client/samples/iothub_client_c2d_streaming_sample
   ./iothub_client_c2d_streaming_sample
   ```

   ```cmd
   rem In Windows
   rem Go to the sample's release folder cmake\iothub_client\samples\iothub_client_c2d_streaming_sample\Release
   iothub_client_c2d_streaming_sample.exe
   ```

### Run the service-side application

As mentioned previously, the IoT Hub C SDK supports device streams on the device side only. To build and run the service-side application, follow the instructions in one of the following quickstarts:

* [Communicate to a device app in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md)
* [Communicate to a device app in Node.js via IoT Hub device streams](./quickstart-device-streams-echo-nodejs.md)

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources-device-streams](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you've set up an IoT hub, registered a device, established a device stream between a C application on the device and another application on the service side, and used the stream to send data back and forth between the applications.

To learn more about device streams, see:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md)
