---
title: Use VS Code IoT Plug and Play Preview tools (Linux) | Microsoft Docs
description: As a device developer, learn about how to use VS Code to create and test a new device capability model for an IoT Plug and Play Preview device on a Linux machine.
author: dominicbetts
ms.author: dobett
ms.date: 03/17/2020
ms.topic: tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: eliotgra

# As a device builder, I want to use VS Code on Linux to create and test a new device capability model so I can prepare devices that are simple to connect an IoT solution.
---

# Tutorial: Tutorial: Use Visual Studio Code modeling and code generation tools  (Linux)

[!INCLUDE [iot-pnp-vs-code-selector.md](../../includes/iot-pnp-vs-code-selector.md)]

This tutorial shows you how, as a device developer, to use Visual Studio Code on Linux to create a _device capability model_. You can use the model to generate skeleton code to run on a device that connects to an Azure IoT Hub instance in the cloud.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device capability model
> * Generate skeleton device code from the model
> * Implement the stubs in the generated code
> * Run the code to test the interactions with an IoT hub

## Prerequisites

To work with the device capability model in this tutorial, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): VS Code is available for multiple platforms
* [Azure IoT Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension pack. Use the following steps to install the extension pack in VS Code:

    1. In VS Code, select the **Extensions** tab.
    1. Search for **Azure IoT Tools**.
    1. Select **Install**.

To build the generated C code on Linux in this tutorial, use the following commands to install the required packages:

```bash
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify that **CMake** is at least version **2.8.12** and **gcc** is at least version **4.4.7**:

```bash
cmake --version
gcc --version
```

To test your device code in this tutorial, you need:

* The [Azure IoT explorer](https://github.com/Azure/azure-iot-explorer/releases).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare the development environment

In this tutorial, you use the [Vcpkg](https://github.com/microsoft/vcpkg) library manager to install the Azure IoT C device SDK in your development environment.

Open a command prompt. Execute the following commands to install Vcpkg and the SDK:

```bash
git clone https://github.com/Microsoft/vcpkg
cd vcpkg

./vcpkg install azure-iot-sdk-c[public-preview,use_prov_client]
```

[!INCLUDE [iot-pnp-vs-code-model.md](../../includes/iot-pnp-vs-code-model.md)]

## Generate code

You can use the **Azure IoT Tools for VS Code** to generate skeleton C code from your model. To generate the skeleton code in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Generate Device Code Stub** command.

1. Select your **SensorboxModel.capabilitymodel.json** capability model file.

1. Enter **sensorbox_app** as the project name.

1. Choose **ANSI C** as the language.

1. Choose **Via IoT Hub device connection string** as the way to connect.

1. Choose **CMake Project on Linux** as project template.

1. Choose **Via Vcpkg** as way to include the device SDK.

VS Code generates the skeleton C code and saves the files in the `sensorbox_app` folder in the `modelcode` folder. VS Code opens a new window that contains the generated code files.

## Update the generated code

Before you can build and run the code, you need to implement the stubbed properties, telemetry, and commands.

To provide implementations for the stubbed code in VS Code:

1. Open the **SensorboxModel_impl.c** file.

1. Add code to implement the stubbed functions.

1. Save your changes.

## Build the code

You use the Vcpkg package to build the generated device code stub. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. Create a `cmake` subdirectory in the `sensorbox_app` folder, and navigate to that folder:

    ```bash
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build the generated code stub (replacing the placeholder with the directory of your Vcpkg repo):

    ```bash
    cmake .. -DCMAKE_TOOLCHAIN_FILE=<directory of your Vcpkg repo>/scripts/buildsystems/vcpkg.cmake -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON

    cmake --build .
    ```

## Test the code

When you run the code, it connects to IoT Hub and starts sending sample telemetry and property values. The device also responds to commands sent from IoT Hub. To verify this behavior:

1. Create an IoT hub:

    ```azurecli-interactive
    az group create --name environmentalsensorresources --location centralus
    az iot hub create --name {your iot hub name} \
      --resource-group environmentalsensorresources --sku F1
    az iot hub show-connection-string --name {your iot hub name}
   ```

    Make a note of the _IoT hub connection string_.

1. Add a device to your IoT hub and retrieve its connection string:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {your iot hub name} --device-id MyPnPDevice
    az iot hub device-identity show-connection-string --hub-name {your iot hub name} --device-id MyPnPDevice --output table
    ```

    Make a note of the _device connection string_.

1. At a command prompt, navigate to the **devicemodel** folder where you created the interface and capability model.  Then navigate to the **sensorbox_app/cmake** folder.

1. Run the following command:

    ```bash
    ./sensorbox_app {your device connection string}
    ```

[!INCLUDE [iot-pnp-vs-code-validate.md](../../includes/iot-pnp-vs-code-validate.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

Now that you've learned how to use the VS Code tools to author and publish models, and generate code, the next step is to learn how to:

> [!div class="nextstepaction"]
> [Build a device that's ready for certification](tutorial-build-device-certification.md)
