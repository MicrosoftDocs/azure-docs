---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub (Linux) | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample device code on Linux that connects to an IoT hub. Use the Azure CLI to view the information sent by the device to the hub.
author: dominicbetts
ms.author: dobett
ms.date: 12/23/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application running on Linux to IoT Hub (C Linux)

[!INCLUDE [iot-pnp-quickstarts-2-selector.md](../../includes/iot-pnp-quickstarts-2-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application on Linux, connect it to your IoT bub, and use the Azure CLI to view the information it sends to the hub. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution developer can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

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

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```bash
git clone https://github.com/Azure/azure-iot-sdk-c --recursive -b public-preview
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
    cmake --build .
    ```

## Update your model repository

Before you run the sample, add the device capability model and interface definitions to your company model repository:

1. Sign in to the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com) portal with your Microsoft work or school account, or your Microsoft Partner ID if you have one.

1. Select **Company repository** and then **Capability models**.

1. Select **New** and then **Upload**.

1. Select the file `SampleDevice.capabilitymodel.json` in the `digitaltwin_client/samples` folder in the device SDK root folder. Select **Open** and then **Save** to upload the model file to your repository.

1. Select **Company repository** and then **Interfaces**.

1. Select **New** and then **Upload**.

1. Select the file `EnvironmentalSensor.interface.json` in the `digitaltwin_client/samples/digitaltwin_sample_environmental_sensor` folder in the device SDK root folder. Select **Open** and then **Save** to upload the interface file to your repository.

1. Select **Company repository** and then **Connection strings**. Make a note of the first _company model repository connection string_, as you use it later in this quickstart.

## Run the device sample

Run a sample application in the SDK to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. To run the sample application:

1. From the `cmake` folder, navigate to the folder that contains the executable file:

    ```bash
    cd digitaltwin_client/samples/digitaltwin_sample_device
    ```

1. Run the executable file:

    ```bash
    ./digitaltwin_sample_device "<YourDeviceConnectionString>"
    ```

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
[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
