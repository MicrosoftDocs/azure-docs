---
title: Create an Azure IoT Plug and Play Preview device | Microsoft Docs
description: Use a device capability model to generate device code. Then run the device code and see the device connect to your IoT Hub.
author: miagdp
ms.author: miag
ms.date: 07/11/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device builder, I want to try out generating device code from a model so I can understand the purpose of device capability models.
---

# Quickstart: Use a device capability model to create a device

A _device capability model_ (DCM) describes the capabilities of an IoT Plug and Play device. A DCM is often associated with a product SKU. The capabilities defined in the DCM are organized into reusable interfaces. You can generate skeleton device code from a DCM. This quickstart shows you how to use VS Code to create an IoT Plug and Play device using a DCM.

## Prerequisites

To complete this quickstart, you need to install the following software on your local machine:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).
* [Visual Studio Code](https://code.visualstudio.com/).

### Install Azure IoT Device Workbench

Use the following steps to install the Azure IoT Device Workbench extension in VS Code:

1. In VS Code, select the **Extensions** tab.
1. Search for **Azure IoT Device Workbench**.
1. Select **Install**.

### Install the Azure IoT explorer

Download and install the Azure IoT explorer tool from the [latest release](https://github.com/Azure/azure-iot-explorer/releases) page.

### Create an IoT hub and register a device

You also need an Azure IoT hub with at least one registered device in your Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. You can [Create an IoT hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md) or [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md).
1. Create a device identity in an Azure IoT Hub. If you don't have one, follow these instructions to [register a device](../iot-hub/quickstart-send-telemetry-node.md#create-an-iot-hub).
1. Retrieve your hub connection string and make a note of it. You use this connection string later in this quickstart.

## Prepare the development environment

### Get Azure IoT device SDK for C

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT C device SDK.

1. Open a command prompt. Execute the following command to clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-c --recursive -b public-preview
    ```

    You should expect this operation to take several minutes to complete.

1. Create a `pnp_app` subdirectory in the root of the local clone of the repository. This is the folder you use for the device model files and device code stub.

    ```cmd/sh
    cd azure-iot-sdk-c-pnp
    mkdir pnp_app
    ```

## Author your model

In this quickstart, you use an existing sample device capability model and associated interfaces.

1. Download the [device capability model](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/digitaltwin_client/samples/SampleDevice.capabilitymodel.json) and [interface sample](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/digitaltwin_client/samples/digitaltwin_sample_environmental_sensor/EnvironmentalSensor.interface.json) and save files into `pnp_app` folder.

    > [!TIP]
    > To download a file from GitHub, navigate to the file, right-click on **Raw**, and then select **Save link as**.

1. Open `pnp_app` folder with VS Code. You can view the files with intellisense:

    ![Device capability model](media/quickstart-create-pnp-device/dcm.png)

1. In the files you downloaded, replace `<YOUR_COMPANY_NAME_HERE>` in the `@id` and `schema` fields with a unique value. Use only the characters a-z, A-Z, 0-9, and underscore. For more information, see [Digital Twin identifier format](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL#digital-twin-identifier-format).

## Generate the C code stub

Now you have a DCM and its associated interfaces, you can generate the device code that implements the model. To generate the C code stub in VS code:

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

    > [!NOTE]
    > The first time you use the IoT Plug and Play Code Generator utility, it takes a few seconds to download.

1. Choose the DCM file you want to use to generate the device code stub.

1. Enter the project name **sample_device**, it will be the name of your device application.

1. Choose **ANSI C** as your language.

1. Choose **CMake Project** as your project type.

1. Choose **Via IoT Hub device connection string** as connection method.

1. VS Code opens a new window with generated device code stub files.
    ![Device code](media/quickstart-create-pnp-device/device-code.png)

## Build the code

You use the device SDK to build the generated device code stub. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In VS Code, open `CMakeLists.txt` in the device SDK root folder.

1. Add the line below at the bottom of the `CMakeLists.txt` file to include the device code stub folder when compiling:

    ```txt
    add_subdirectory(pnp_app/sample_device)
    ```

1. Create a cmake subdirectory in the device SDK root folder, and navigate to that folder:

    ```cmd\sh
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build the device SDK and the generated code stub:

    ```cmd\sh
    cmake .. -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -Dskip_samples:BOOL=ON
    cmake --build . -- /m /p:Configuration=Release
    ```

    > [!NOTE]
    > If cmake can't find your C++ compiler, you get build errors when you run the previous command. If that happens, try running this command at the [Visual Studio command prompt](https://docs.microsoft.com/dotnet/framework/tools/developer-command-prompt-for-vs).

1. After the build completes successfully, run your application passing the IoT hub device connection string as parameter.

    ```cmd\sh
    cd azure-iot-sdk-c-pnp\cmake\pnp_app\sample_device\Release\
    sample_device.exe "[IoT Hub device connection string]"
    ```

1. The device application starts sending data to IoT Hub.

    ![Device app running](media/quickstart-create-pnp-device/device-app-running.png)

## Validate the code

### Publish device model files to model repository

In order to validate the device code with **Azure IoT Explorer**, you need to publish the files to the model repository.

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, type and select **IoT Plug & Play: Submit files to Model Repository**.

1. Select `SampleDevice.capabilitymodel.json` and `EnvironmentalSensor.interface.json` files.

1. Enter your organizational Model Repository connection string, which you can get from [Azure Device Builder](https://aka.ms/adbtest) portal with signed in with a Microsoft work or school account, or your Microsoft Partner ID if you have one.

    > [!NOTE]
    > The connection string is required for the first time.

1. In VS Code output window and notification, you can check the files have been published successfully.

    > [!NOTE]
    > If you get errors on publishing the device model files, you can try use command **IoT Plug and Play: Sign out Model Repository** to sign out and go through the steps again.

### Use the Azure IoT explorer to validate the code

1. Open Azure IoT explorer, you see the **App configurations** page.

1. Enter your IoT Hub connection string and click **Connect**.

1. After you connect, you see the device overview page.

1. To add your company repository, select **Settings**, then **+ New**, and then **Organization repository**.

1. Add the connection string for your company repository. You can find this on the connection strings page for your company repository in the [Azure Certified for IoT](https://aka.ms/adbtest) portal. Select **Connect**.

1. On the device overview page, find the device identity you created previously, and select it to view more details.

1. Expand the interface with ID **urn:azureiot:EnvironmentalSensor:1** to see the IoT Plug and Play primitives - properties, commands and telemetry.

1. Select the **Telemetry** page to view the telemetry data the device is sending.

1. Select the **Properties(non-writable)** page to view the non-writable properties reported by the device.

1. Select the **Properties(writable)** page to view the writable properties you can update.

1. Expand property **name**, update with a new name and select **update writable property**. The status of the update is shown in the **Status** column. When the update is done, the new name shows up in the **Reported Property** column.

1. Select the **Command** page to view all the commands the device supports.

1. Expand the **blink** command and set a new blink time interval. Select **Send Command** to call the command on the device.

1. Go to the simulated device to verify that the command executed as expected.

## Next steps

In this quickstart, you learned how to create an IoT Plug and Play device using a DCM.

To learn more about DCMs and how to create your own models, continue to the tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Create a test a device capability model using Visual Studio Code](tutorial-pnp-visual-studio-code.md)
