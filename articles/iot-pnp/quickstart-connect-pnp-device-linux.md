---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub (Linux) | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample device code on Linux that connects to an IoT hub. Use the Azure CLI to view the information sent by the device to the hub.
author: dominicbetts
ms.author: dobett
ms.date: 09/10/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application running on Linux to IoT Hub

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

## Prepare an IoT hub

You also need an Azure IoT hub in your Azure subscription to complete this quickstart. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> During public preview, IoT Plug and Play features are only available on IoT hubs created in the **Central US**, **North Europe**, and **Japan East** regions.

If you're using the Azure CLI locally, the `az` version should be **2.0.73** or later, the Azure Cloud Shell uses the latest version. Use the `az --version` command to check the version installed on your machine.

Add the Microsoft Azure IoT Extension for Azure CLI:

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

The steps in this quickstart require version **0.8.5** or later of the extension. Use the `az extension list` command to check the version you have installed, and the `az extension update` command to update if necessary.

If you're using CLI locally, sign in to your Azure subscription with the following command:

```bash
az login
```

If you're using Azure Cloud Shell, you're already automatically signed in.

If you don't have an IoT Hub, follow [these instructions to create one](../iot-hub/iot-hub-create-using-cli.md). During public preview, IoT Plug and Play is available in the North Europe, Central US, and Japan East regions. Please make sure you create your hub in one of these regions.

Run the following command to create the device identity in your IoT hub. Replace the **YourIoTHubName** placeholder with your actual IoT hub name:

```azurecli-interactive
az iot hub device-identity create --hub-name [YourIoTHubName] --device-id mydevice
```

Run the following commands to get the _device connection string_ for the device you just registered:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id mydevice --output table
```

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT C device SDK.

Open a command prompt. Execute the following command to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:

```bash
git clone https://github.com/Azure/azure-iot-sdk-c --recursive -b public-preview
```

This command takes several minutes to complete.

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

1. Select **Company repository** and then **Connection strings**. Make a note of the first company model repository connection string, you use it later in this quickstart.

## Run the sample

Run a sample application in the SDK to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. To run the sample application:

1. From the `cmake` folder, navigate to the folder that contains the executable file:

    ```bash
    cd digitaltwin_client/samples/digitaltwin_sample_device
    ```

1. Run the executable file:

    ```bash
    ./digitaltwin_sample_device "{your device connection string}"
    ```

The simulated device starts sending telemetry, listening for commands, and listening for property updates.

### Use the Azure IoT CLI to validate the code

After the device client sample starts, verify it's working with the Azure CLI.

Use the following command to view the telemetry the sample device is sending. You may need to wait a minute or two before you see any telemetry in the output:

```azurecli-interactive
az iot dt monitor-events --hub-name {your IoT hub} --device-id mydevice
```

Use the following command to view the properties sent by the device:

```azurecli-interactive
az iot dt list-properties --hub-name {your IoT hub} --device-id mydevice --interface sensor --source private --repo-login "{your company model repository connection string}"
```

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
