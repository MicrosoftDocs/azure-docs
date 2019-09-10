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

# Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Linux)

This quickstart shows you how to build a sample IoT Plug and Play device application on Linux, connect it to your IoT bub, and use the Azure CLI to view the information it sends to the hub. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution developer can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

This quickstart assumes you're using Ubuntu Linux - if you're using a different distribution you may need to adjust some of the steps.

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

> [!NOTE]
> During public preview, IoT Plug and Play features are only available on IoT hubs created in the **Central US**, **North Europe**, and **Japan East** regions.

Add the Microsoft Azure IoT Extension for Azure CLI:

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

If you're using CLI locally, sign in to your Azure subscription with the following command:

```bash
az login
```

If you're using Azure Cloud Shell, you're already automatically signed in.

Run the following command to create the device identity in your IoT hub. Replace the **YourIoTHubName** and **YourDevice** placeholders with your actual names. If you don't have an IoT Hub, follow [these instructions to create one](../iot-hub/iot-hub-create-using-cli.md):

```azurecli-interactive
az iot hub device-identity create --hub-name [YourIoTHubName] --device-id [YourDevice]
```

Run the following commands to get the _device connection string_ for the device you just registered:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
```

Run the following commands to get the _IoT hub connection string_ for your hub:

```azurecli-interactive
az iot hub show-connection-string --hub-name [YourIoTHubName] --output table
```

## Prepare the development environment

### Get Azure IoT device SDK for C

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT C device SDK.

Open a command prompt. Execute the following command to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:

```bash
git clone https://github.com/Azure/azure-iot-sdk-c --recursive -b public-preview
```

This command takes several minutes to complete.

## Build the code

You use the device SDK to build the generated device code stub. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

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

## Run the sample

Run a sample application in the SDK to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. To run the sample application:

1. From the `cmake` folder, navigate to the folder that contains the executable file:

    ```bash
    cd digitaltwin_client/samples/digitaltwin_sample_device
    ```

1. Run the executable file:

    ```bash
    ./digitaltwin_sample_device {your device connection string}
    ```

The simulated device starts sending telemetry, listening for commands, and listening for property updates.

### Use the Azure IoT CLI to validate the code

After the device client sample starts, verify it's working with the Azure CLI. If you're using the CLI locally, you need to sign in with the `az login` command.

Use the following command to view the telemetry the sample device is sending:

```azurecli-interactive
az iot dt monitor-events --interface environmentalSensor --device-id {your device ID}
```

Use the following command to view the properties sent by the device:

```azurecli-interactive
az iot dt list-properties --device-id {your device ID}
```

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
