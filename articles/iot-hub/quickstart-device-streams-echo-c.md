---

title: Quickstart - Communicate to device app in C with Azure IoT Hub device streams
description: In this quickstart, you run a C device-side application that communicates with an IoT device via a device stream.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.devlang: c
ms.topic: quickstart
ms.custom: mvc, devx-track-azurecli
ms.date: 08/20/2019
ms.author: robinsh

---

# Quickstart: Communicate to a device application in C via IoT Hub device streams (preview)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

Azure IoT Hub currently supports device streams as a [preview feature](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[IoT Hub device streams](iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. During public preview, the C SDK supports device streams on the device side only. As a result, this quickstart covers instructions to run only the device-side application. To run a corresponding service-side application, see these articles:

* [Communicate to device apps in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md)

* [Communicate to device apps in Node.js via IoT Hub device streams](./quickstart-device-streams-echo-nodejs.md)

The device-side C application in this quickstart has the following functionality:

* Establish a device stream to an IoT device.

* Receive data that's sent from the service-side application and echo it back.

The code demonstrates the initiation process of a device stream, as well as how to use it to send and receive data.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

You need the following prerequisites:

* Install [Visual Studio 2019](https://www.visualstudio.com/vs/) with the **Desktop development with C++** workload enabled.

* Install the latest version of [Git](https://git-scm.com/download/).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

The preview of device streams is currently supported only for IoT hubs that are created in the following regions:

  * Central US
  * Central US EUAP
  * North Europe
  * Southeast Asia

## Prepare the development environment

For this quickstart, you use the [Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md). You prepare a development environment used to clone and build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) from GitHub. The SDK on GitHub includes the sample code that's used in this quickstart.

   > [!NOTE]
   > Before you begin this procedure, be sure that Visual Studio is installed with the **Desktop development with C++** workload.

1. Install the [CMake build system](https://cmake.org/download/) as described on the download page.

1. Open a command prompt or Git Bash shell. Run the following commands to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:

    ```cmd/sh
    git clone -b public-preview https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    This operation should take a few minutes.

1. Create a *cmake* subdirectory in the root directory of the git repository, and navigate to that folder. Run the following commands from the *azure-iot-sdk-c* directory:

    ```cmd/sh
    mkdir cmake
    cd cmake
    ```

1. Run the following commands from the *cmake* directory to build a version of the SDK that's specific to your development client platform.

   * In Linux:

      ```bash
      cmake ..
      make -j
      ```

   * In Windows, open a [Developer Command Prompt for Visual Studio](/dotnet/framework/tools/developer-command-prompt-for-vs). Run the command for your version of Visual Studio. This quickstart uses Visual Studio 2019. These commands create a Visual Studio solution for the simulated device in the *cmake* directory.

      ```cmd
      rem For VS2015
      cmake .. -G "Visual Studio 14 2015"

      rem Or for VS2017
      cmake .. -G "Visual Studio 15 2017"

      rem Or for VS2019
      cmake .. -G "Visual Studio 16 2019"

      rem Then build the project
      cmake --build . -- /m /p:Configuration=Release
      ```

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a device

You must register a device with your IoT hub before it can connect. In this section, you use Azure Cloud Shell with the [IoT Extension](/cli/azure/iot) to register a simulated device.

1. To create the device identity, run the following command in Cloud Shell:

   > [!NOTE]
   > * Replace the *YourIoTHubName* placeholder with the name you chose for your IoT hub.
   > * For the name of the device you're registering, it's recommended to use *MyDevice* as shown. If you choose a different name for your device, use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyDevice
    ```

1. To get the *device connection string* for the device that you just registered, run the following command in Cloud Shell:

   > [!NOTE]
   > Replace the *YourIoTHubName* placeholder with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity connection-string show --hub-name {YourIoTHubName} --device-id MyDevice --output table
    ```

    Note the returned device connection string for later use in this quickstart. It looks like the following example:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`

## Communicate between the device and the service via device streams

In this section, you run both the device-side application and the service-side application and communicate between the two.

### Run the device-side application

To run the device-side application, follow these steps:

1. Provide your device credentials by editing the **iothub_client_c2d_streaming_sample.c** source file in the `iothub_client/samples/iothub_client_c2d_streaming_sample` folder and adding your device connection string.

   ```C
   /* Paste in your iothub connection string  */
   static const char* connectionString = "{DeviceConnectionString}";
   ```

1. Compile the code with the following commands:

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

1. Run the compiled program:

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

As mentioned previously, the IoT Hub C SDK supports device streams on the device side only. To build and run the accompanying service-side application, follow the instructions in one of the following quickstarts:

* [Communicate to a device app in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md)

* [Communicate to a device app in Node.js via IoT Hub device streams](./quickstart-device-streams-echo-nodejs.md)

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources-device-streams](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you set up an IoT hub, registered a device, established a device stream between a C application on the device and another application on the service side, and used the stream to send data back and forth between the applications.

To learn more about device streams, see:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md)
