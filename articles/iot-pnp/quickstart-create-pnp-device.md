---
title: Create an Azure plug and play device | Microsoft Docs
description: Use a device capability model to generate device code. Then run the device code and see the device connect to your IoT Hub.
author: miagdp
ms.author: miag
ms.date: 07/11/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device builder, I want to try out generating device code from a model so I can understand the purpose of device capability models.​
---

# Quickstart: Use a device capability model to create a device

A _device capability model_ (DCM) describes the capabilities of a plug and play device. A DCM is often associated with a product SKU. The capabilities defined in the DCM are organized into reusable interfaces. You can generate skeleton device code from a DCM. This quickstart shows you how to use VS Code to create a plug and play device using a DCM.

## Prerequisites

To complete this quickstart, you need to install the following software on your local machine:

### Install Visual Studio Code

Install the latest version of Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/).

### Install Azure IoT Device Workbench

Install the Azure IoT Device Workbench extension from a VSIX file. Use the following steps to install the extension in VS Code. The extension can't be installed from Windows Explorer:

1. Download the VSIX file from [https://aka.ms/iot-workbench-pnp-pr](https://aka.ms/iot-workbench-pnp-pr).
1. In VS Code, select **Extensions**.
1. Select the **...** menu dropdown.
1. Select **Install from VSIX**.
1. Select the .vsix file you downloaded.
1. Select **Install**.

    ![Install Azure IoT Device Workbench extension](media/quickstart-create-pnp-device/install-vsix.png)

### Install the Azure IoT explorer

Download and install the Azure IoT explorer tool from the [latest release](https://github.com/Azure/azure-iot-explorer/releases) page.

### Azure IoT Hub

You also need an Azure IoT hub with at least one registered device in your Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. You can [Create an IoT hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md) or [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md).
1. Create a device identity in an Azure IoT Hub. If you don't have one, follow these instructions to [register a device](../iot-hub/quickstart-send-telemetry-node.md#create-an-iot-hub).
1. Retrieve your hub connection string and make a note of it. You use this connection string later in this quickstart.

## Author your model

In this quickstart, you use an existing sample device capability model and associated interfaces. Download the [device capability model and interface samples](https://github.com/Azure/azure-iot-sdk-c-pnp/tree/public-preview-utopia/digitaltwin_client/samples).

## Implement the device code

Now you have a device capability model, you can generate the device code that implements the model.

### Generate the C code stub

To generate the C code stub in VS code:

1. Use **Ctrl+Shift+P** to open the command palette, enter **Azure IoT Plug and Play**, and select **Generate Device Code Stub**.
    ![Select device code stub generator](media/quickstart-create-pnp-device/command-generate-device-code.png)

1. Choose the **EnvironmentalSensorX4000.capabilitymodel.json** DCM file you added the repository:
    ![Choose your DCM](media/quickstart-create-pnp-device/select-dcm.png)

1. Choose **ANSI C** as your language:
    ![Choose language](media/quickstart-create-pnp-device/device-lang.png)

1. Choose **General platform** as your platform:
   ![Choose the target platform](media/quickstart-create-pnp-device/reveal-in-folder.png)

1. Choose a folder to store the generated the C source files.

### Implement the stubbed functions

Implement the stubbed functions in VS Code:

1. Open the generated **device_model.c** file.
1. Update the code as shown in the following snippet:

    ```c
    implementations of functions
    ```

### Build the code

### Run the device app using command `the command`

## Validate the code

Use the Azure IoT explorer to validate the code:

1. Open Azure IoT explorer, you see the connect page.
1. Enter your IoT Hub connection string and click **Connect**.
1. After you connect, you see the device overview page. Find the device identity you created previously, and select it to view more details.
1. Expand the interface with ID **urn:azureiot:EnvironmentalSensor:1** to see the plug and play primitives - properties, commands and telemetry.
1. Select the **Telemetry** page to view the telemetry data the device is sending.
1. Select the **Properties(non-writable)** page to view the non-writable properties reported by the device.
1. Select the **Properties(writable)** page to view the writable properties you can update.
1. Expand property **name**, update with a new name and select **update writable property**. The status of the update is shown in the **Status** column. When the update is done, the new name shows up in the **Reported Property** column.
1. Select the **Command** page to view all the commands the device supports.
1. Expand the **blink** command and set a new blink time interval. Select **Send Command** to call the command on the device.
1. Go to the simulated device to verify that the command executed as expected.

## Next steps

In this quickstart, you learned how to create a Plug and Play device using a DCM.

To learn more about DCMs and how to create your own models, continue to the tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Create a test a device capability model using Visual Studio Code](tutorial-pnp-visual-studio-code.md)
