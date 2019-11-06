---
title: Create an IoT Plug and Play Preview device | Microsoft Docs
description: Use a device capability model to generate device code. Then run the device code and see the device connect to your IoT Hub.
author: miagdp
ms.author: miag
ms.date: 08/02/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device builder, I want to try out generating device code from a model so I can understand the purpose of device capability models.
---

# Quickstart: Use a device capability model to create an IoT Plug and Play Preview device (Windows)

A _device capability model_ (DCM) describes the capabilities of an IoT Plug and Play device. A DCM is often associated with a product SKU. The capabilities defined in the DCM are organized into reusable interfaces. You can generate skeleton device code from a DCM. This quickstart shows you how to use VS Code on Windows to create an IoT Plug and Play device using a DCM.

## Prerequisites

To complete this quickstart, you need to install the following software on your local machine:

* [Build Tools for Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16) with **C++ build tools** and **NuGet package manager component** workloads. Or if you already have [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) 2019, 2017 or 2015 with same workloads installed.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).
* [Visual Studio Code](https://code.visualstudio.com/).

### Install Azure IoT Tools

Use the following steps to install the [Azure IoT Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension pack:

1. In VS Code, select the **Extensions** tab.
1. Search for **Azure IoT Tools**.
1. Select **Install**.

### Install the Azure IoT explorer

Download and install the Azure IoT explorer tool from the [latest release](https://github.com/Azure/azure-iot-explorer/releases) page.

### Get the connection string for your company model repository

You can find your _company model repository connection string_ in the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com) portal when you sign in with a Microsoft work or school account, or your Microsoft Partner ID if you have one. After you sign in, select **Company repository** and then **Connection strings**.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare an IoT hub

You also need an Azure IoT hub in your Azure subscription to complete this quickstart. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> During public preview, IoT Plug and Play features are only available on IoT hubs created in the **Central US**, **North Europe**, and **Japan East** regions.

Add the Microsoft Azure IoT Extension for Azure CLI:

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

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

Make a note of the device connection string, which looks like:

```json
HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyCDevice;SharedAccessKey={YourSharedAccessKey}
```

You'll use this value later in the quickstart.

## Prepare the development environment

### Get Azure IoT device SDK for C

In this quickstart, you prepare a development environment by installing the Azure IoT C device SDK via [Vcpkg](https://github.com/microsoft/vcpkg).

1. Open a command prompt. Execute the following command to install Vcpkg:

    ```cmd/sh
    git clone https://github.com/Microsoft/vcpkg.git
    cd vcpkg

    .\bootstrap-vcpkg.bat
    ```

    Then, to hook up user-wide [integration](https://github.com/microsoft/vcpkg/blob/master/docs/users/integration.md), run (note: requires admin on first use):

    ```cmd/sh
    .\vcpkg.exe integrate install
    ```

1. Install Azure IoT C device SDK Vcpkg:

    ```cmd/sh
    .\vcpkg.exe install azure-iot-sdk-c[public-preview,use_prov_client]
    ```

## Author your model

In this quickstart, you use an existing sample device capability model and associated interfaces.

1. Create a `pnp_app` directory in your local drive.

1. Download the [device capability model](https://github.com/Azure/IoTPlugandPlay/blob/master/samples/SampleDevice.capabilitymodel.json) and [interface sample](https://github.com/Azure/IoTPlugandPlay/blob/master/samples/EnvironmentalSensor.interface.json) and save files into `pnp_app` folder.

    > [!TIP]
    > To download a file from GitHub, navigate to the file, right-click on **Raw**, and then select **Save link as**.

1. Open `pnp_app` folder with VS Code. You can view the files with intellisense:

    ![Device capability model](media/quickstart-create-pnp-device/dcm.png)

1. In the files you downloaded, replace `<YOUR_COMPANY_NAME_HERE>` in the `@id` and `schema` fields with a unique value. Use only the characters a-z, A-Z, 0-9, and underscore. For more information, see [Digital Twin identifier format](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL#digital-twin-identifier-format).

## Generate the C code stub

Now you have a DCM and its associated interfaces, you can generate the device code that implements the model. To generate the C code stub in VS code:

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

    > [!NOTE]
    > The first time you use the IoT Plug and Play CodeGen CLI, it takes a few seconds to download and install automatically.

1. Choose the DCM file you want to use to generate the device code stub.

1. Enter the project name **sample_device**, it will be the name of your device application.

1. Choose **ANSI C** as your language.

1. Choose **Via IoT Hub device connection string** as connection method.

1. Choose **CMake Project on Windows** as project template.

1. Choose **Via Vcpkg** as way to include the device SDK.

1. VS Code opens a new window with generated device code stub files.
    ![Device code](media/quickstart-create-pnp-device/device-code.png)

## Build the code

You build the generated device code stub together with the device SDK. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. Create a `cmake` subdirectory in the `sample_device` folder, and navigate to that folder:

    ```cmd\sh
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build generated code stub:

    ```cmd\sh
    cmake .. -G "Visual Studio 16 2019" -A Win32 -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -DCMAKE_TOOLCHAIN_FILE="{directory of your Vcpkg repo}\scripts\buildsystems\vcpkg.cmake"

    cmake --build .
    ```
    
    > [!NOTE]
    > If you are using Visual Studio 2017 or 2015, you need to specify the CMake generator based on the build tools you are using:
    >```cmd\sh
    ># Either
    >cmake .. -G "Visual Studio 15 2017" -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -DCMAKE_TOOLCHAIN_FILE="{directory of your Vcpkg repo}\scripts\buildsystems\vcpkg.cmake"
    ># or
    >cmake .. -G "Visual Studio 14 2015" -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -DCMAKE_TOOLCHAIN_FILE="{directory of your Vcpkg repo}\scripts\buildsystems\vcpkg.cmake"
    >```

    > [!NOTE]
    > If cmake can't find your C++ compiler, you get build errors when you run the previous command. If that happens, try running this command at the [Visual Studio command prompt](https://docs.microsoft.com/dotnet/framework/tools/developer-command-prompt-for-vs).

1. After the build completes successfully, run your application passing the IoT hub device connection string as parameter.

    ```cmd\sh
    .\Debug\sample_device.exe "[IoT Hub device connection string]"
    ```

1. The device application starts sending data to IoT Hub.

    ![Device app running](media/quickstart-create-pnp-device/device-app-running.png)

## Validate the code

### Publish device model files to model repository

To validate the device code with **Azure IoT Explorer**, you need to publish the files to the model repository.

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, type and select **IoT Plug & Play: Submit files to Model Repository**.

1. Select `SampleDevice.capabilitymodel.json` and `EnvironmentalSensor.interface.json` files.

1. Enter your company model repository connection string.

    > [!NOTE]
    > The connection string is only required the first time you connect to the repository.

1. In VS Code output window and notification, you can check the files have been published successfully.

    > [!NOTE]
    > If you get errors on publishing the device model files, you can try use command **IoT Plug and Play: Sign out Model Repository** to sign out and go through the steps again.

### Use the Azure IoT explorer to validate the code

1. Open Azure IoT explorer, you see the **App configurations** page.

1. Enter your IoT Hub connection string and click **Connect**.

1. After you connect, you see the device overview page.

1. To add your company repository, select **Settings**, then **+ New**, and then **Company repository**.

1. Add your company model repository connection string. Select **Connect**.

1. On the device overview page, find the device identity you created previously, and select it to view more details.

1. Expand the interface with ID **urn:azureiot:EnvironmentalSensor:1** to see the IoT Plug and Play primitives - properties, commands, and telemetry.

1. Select the **Telemetry** page to view the telemetry data the device is sending.

1. Select the **Properties(non-writable)** page to view the non-writable properties reported by the device.

1. Select the **Properties(writable)** page to view the writable properties you can update.

1. Expand property **name**, update with a new name and select **update writable property**.

1. To see the new name shows up in the **Reported Property** column, click the **Refresh** button on top of the page.

1. Select the **Command** page to view all the commands the device supports.

1. Expand the **blink** command and set a new blink time interval. Select **Send Command** to call the command on the device.

1. Go to the simulated device to verify that the command executed as expected.

## Next steps

In this quickstart, you learned how to create an IoT Plug and Play device using a DCM.

To learn more about IoT Plug and Play, continue to the tutorial:

> [!div class="nextstepaction"]
> [Create and test a device capability model using Visual Studio Code](tutorial-pnp-visual-studio-code.md)
