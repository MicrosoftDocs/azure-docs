---
title: Create an Azure plug and play device | Microsoft Docs
description: Use a device capability model to generate device code. Then run the device code and see the device connect to your IoT Hub.
author: miagdp
ms.author: miag
ms.date: 06/21/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device builder, I want to try out generating device code from a model so I can understand the purpose of device capability models.​
---

# Quickstart: Use a device capability model to create a device

A _device capability model_ (DCM) describes the capabilities of a plug and play device. A DCM is often associated with a product SKU. The capabilities defined in the DCM are organized into reusable interfaces. You can generate skeleton device code from a DCM. This quickstart shows you how to use VS Code to create a plug and play device using a DCM.

## Prerequisites

### Install Visual Studio Code

Install the newest version of Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/).

### Install Azure IoT Device Workbench

Install the Azure IoT Device Workbench extension from a .vsix file. Use the following steps to install the extension in VS Code. The extension can't be installed from Windows Explorer:

1. Download the .vsix file from [https://aka.ms/iot-workbench-pnp-pr](https://aka.ms/iot-workbench-pnp-pr).
1. In VS Code, select **Extensions**.
1. Select the **...** menu dropdown.
1. Select **Install from VSIX**.
1. Select the .vsix file you downloaded.
1. Select **Install**.

    ![Install Azure IoT Device Workbench extension](media/quickstart-create-pnp-device/install-vsix.png)

### Install the Azure IoT explorer

Download and install the Azure IoT explorer from the [latest release](https://github.com/Azure/azure-iot-explorer/releases).

### Azure IoT Hub

1. Create a device identity in an Azure IoT Hub. If you don't have one, follow instructions [here](../iot-hub/quickstart-send-telemetry-node.md#create-an-iot-hub) to create one. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
1. Retrieve your hub connection string and make a note of it. This will be used later in this article.

## Author your model

In this quickstart, we are going to use existing sample device capability model and associated interfaces. Please download the device capability model and interface samples [here](). For detailed instructions on how to create your own new interfaces and device capability model in Visual Studio code, please go [here](https://review.docs.microsoft.com/en-us/azure/iot-pnp/tutorial-pnp-visual-studio-code?branch=pr-en-us-79370).


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

1. Open Azure IoT explorer, you will land on a connect page. 
1. Provide your IoT Hub connection string and click **Connect**.
1. After connect, you will land on a device overview page. Find the device identity you're using earlier, and select it to view more details.
1. Expand the interface with ID **urn:azureiot:EnvironmentalSensor:1** to see the plug and play primitives - properties, commands and telemetry.
1. Select the **Telemetry** to view the telemetry data being sent by the device.
1. Select the **Properties(non-writable)** to view the non-writable properties.
1. Select the **Properties(writable)** to view the writable properties. 
1. Expand property **name**, update with a new name and click **update writable property** button. You will see the status of the update under **Status** column. Once the update is done, the new name will show up under the **Reported Property** column.
1. Select the **Command** page to view all the commands. 
1. Expand command **blink** and give a new blink time interval. Click **Send Command** button.
1. Go to the simulated device to verify that the command executed as expected.

## Next steps

In this quickstart, you learned how to create a Plug and Play device using a DCM.

To learn more about DCMs and how to create your own models, continue to the tutorial:

> [!div class="nextstepaction"]
> > [Tutorial: Create a test a device capability model using Visual Studio Code](tutorial-pnp-visual-studio-code.md)
