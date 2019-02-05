---
title: Azure IoT Hub device streams C quickstart (preview) | Microsoft Docs
description: In this quickstart, you will run a C service-side applications that communicates with an IoT device via a device stream.
author: rezasherafat
manager: briz
ms.service: iot-hub
services: iot-hub
ms.devlang: c
ms.topic: quickstart
ms.custom: mvc
ms.date: 01/15/2019
ms.author: rezas
---

# Quickstart: Communicate to a device application in C via IoT Hub device streams (preview)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. During public preview, the C SDK only supports device streams on the device side. As a result, this quickstart only covers instructions to run the device-side application. You should run an accompanying service-side application, which is available in [C# quickstart](./quickstart-device-streams-echo-csharp.md) or [Node.js quickstart](./quickstart-device-streams-echo-nodejs.md) guides.

The device-side C application in this quickstart has the following functionality:

* Establish a device stream to an IoT device.

* Receive data sent from the service-side and echo it back.

The code will demonstrate the initiation process of a device stream, as well as how to use to send and receive data.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Install [Visual Studio 2017](https://www.visualstudio.com/vs/) with the ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled.
* Install the latest version of [Git](https://git-scm.com/download/).

## Prepare the development environment

For this quickstart, you will be using the [Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md). You will prepare a development environment used to clone and build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) from GitHub. The SDK on GitHub includes the sample code used in this quickstart. 


1. Download version 3.11.4 of the [CMake build system](https://cmake.org/download/). Verify the downloaded binary using the corresponding cryptographic hash value. The following example used Windows PowerShell to verify the cryptographic hash for version 3.11.4 of the x64 MSI distribution:

    ```PowerShell
    PS C:\Downloads> $hash = get-filehash .\cmake-3.11.4-win64-x64.msi
    PS C:\Downloads> $hash.Hash -eq "56e3605b8e49cd446f3487da88fcc38cb9c3e9e99a20f5d4bd63e54b7a35f869"
    True
    ```
    
    The following hash values for version 3.11.4 were listed on the CMake site at the time of this writing:

    ```
    6dab016a6b82082b8bcd0f4d1e53418d6372015dd983d29367b9153f1a376435  cmake-3.11.4-Linux-x86_64.tar.gz
    72b3b82b6d2c2f3a375c0d2799c01819df8669dc55694c8b8daaf6232e873725  cmake-3.11.4-win32-x86.msi
    56e3605b8e49cd446f3487da88fcc38cb9c3e9e99a20f5d4bd63e54b7a35f869  cmake-3.11.4-win64-x64.msi
    ```

2. Open a command prompt or Git Bash shell. Execute the following command to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:
    
    ```
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive -b public-preview
    ```

    The size of this repository is currently around 220 MB.

3. Create a `cmake` subdirectory in the root directory of the git repository, and navigate to that folder. 

    ```
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

4. Run the following command that builds a version of the SDK specific to your development client platform. In Windows, a Visual Studio solution for the simulated device will be generated in the `cmake` directory. 

```
    # In Linux
    cmake ..
    make -j
```

In Windows, run the following commands in Developer Command Prompt for your Visual Studio 2015 or 2017 prompt:

```
    rem In Windows
    rem For VS2015
    cmake .. -G "Visual Studio 15 2015"
    
    rem Or for VS2017
    cmake .. -G "Visual Studio 15 2017"

    rem Then build the project
    cmake --build . -- /m /p:Configuration=Release
```

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub-device-streams.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this section, you will use the Azure Cloud Shell with the [IoT extension](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot?view=azure-cli-latest) to register a simulated device.

1. Run the following commands in Azure Cloud Shell to add the IoT Hub CLI extension and to create the device identity. 

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

   **MyDevice**: This is the name given for the registered device. Use MyDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyDevice --output table
    ```

    Make a note of the device connection string, which looks like the following example:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.


## Communicate between device and service via device streams

### Run the device-side application

To run the device-side application, you need to perform the following steps:
- Set up your development environment by using the instructions in this [article about device streams](https://github.com/Azure/azure-iot-sdk-c-tcpstreaming/blob/master/iothub_client/readme.md#compiling-the-device-sdk-for-c).

- Provide your device credentials by editing the source file `iothub_client/samples/iothub_client_c2d_streaming_sample/iothub_client_c2d_streaming_sample.c` and provide your device connection string.
```C
  /* Paste in the your iothub connection string  */
  static const char* connectionString = "[device connection string]";
```

- Compile the code as follows:

```
  # In Linux
  # Go to the sample's folder cmake/iothub_client/samples/iothub_client_c2d_streaming_sample
  make -j


  # In Windows
  # Go to the cmake folder at the root of repo
  cmake --build . -- /m /p:Configuration=Release
```

- Run the compiled program:

```
  # In Linux
  # Go to sample's folder
  cmake/iothub_client/samples/iothub_client_c2d_streaming_sample
  ./iothub_client_c2d_streaming_sample


  # In Windows
  # Go to sample's release folder
  cmake\iothub_client\samples\iothub_client_c2d_streaming_sample\Release
  iothub_client_c2d_streaming_sample.exe
```

### Run the service-side application

As mentioned earlier, IoT Hub C SDK only supports device streams on the device side. For the service-side application, use the accompanying service programs available in [C# quickstart](./quickstart-device-streams-echo-csharp.md) or [Node.js quickstart](./quickstart-device-streams-echo-nodejs.md) guides.


## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you have set up an IoT hub, registered a device, sent simulated telemetry to the hub using a C application, and read the telemetry from the hub using the Azure Cloud Shell.

Use the links below to learn more about device streams:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md)