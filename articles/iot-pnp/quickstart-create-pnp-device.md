---
title: Create an Azure plug and play device | Microsoft Docs
description: Use a device capability model to generate device code. Then run the device code and see the device connect to your IoT Hub.
author: miagdp
ms.author: miag
ms.date: 06/12/2019
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

### Install the digital twin explorer

Download and install the digital twin explorer tool from the [latest release]().

### Azure IoT Hub

Create a device identity in an Azure IoT Hub. If you don't have one, follow instructions [here](https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-send-telemetry-node#create-an-iot-hub) to create one.

## Create your model

### Create new Plug and Play Interface

To create a new interface in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette, enter **Azure IoT Plug and Play**, and then select **Create Interface**:
    ![Create a PnP interface](media/quickstart-create-pnp-device/create-interface.png)

1. Enter **DeviceInformation.interface.json** as the name of your interface file. A default interface file is created.

1. Copy the contents from the file [here]() into the file you created.
  
1. Make the value of the **@id** property unique, for example:

```json
"@id": "http://yourdomain.com/environmentalsensor/1.0.1"
```

### Create new Plug and Play Device Capability Model

To create a new plug and play DCM in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette, enter **Azure IoT Plug and Play**, and select **Create Capability Model**.

1. Enter **EnvironmentalSensorX4000** as the name of your interface file.

1. Update the JSON file with the following content:

    ```json
    {
      "@id": "http://yourdomain.com/EnvironmentalSensorX4000/1.0.0",
      "@type": "CapabilityModel",
      "displayName": "myCapabilityModel",
      "implements": [
        "http://yourdomain.com/environmentalsensor/1.0.1",
        "http://azureiot.com/interfaces/deviceInformation/1.0.0",
        "http://azureiot.com/interfaces/deviceDiscovery/1.0.0",
        "http://azureiot.com/interfaces/modelDefinitionDiscovery/1.0.0",
        "http://azureiot.com/interfaces/azureSDKInformation/1.0.0"
      ],
      "@context": "http://azureiot.com/v0/contexts/CapabilityModel.json"
    }
    ```

1. Replace http://yourdomain.com/environmentalsensor/1.0.1 with the interface ID you created in the previous section.

### Open the model repository

To open the model repository in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette, enter **Azure IoT Plug and Play**, and select **Open Model Repository**:

   ![Open the model repository](media/quickstart-create-pnp-device/open-model-repo.png)

1. Don't enter a connection string.

The model repository opens in VS Code UI:

![The model repository in VS Code](media/quickstart-create-pnp-device/model-repo-ui.png)

### Submit your interface to the model repository

To submit your interface file to the model repository in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette, enter **Azure IoT Plug and Play**, and select **Submit file to Model Repository**:
   ![Submit an interface to the model repository](media/quickstart-create-pnp-device/submit.png)

1. Select the interface and DCM files you created:
   ![Select files to submit](media/quickstart-create-pnp-device/submit-file.png)

1. In the plug and play model repository UI, select **Refresh** to see the files you submitted files:
   ![Files in the model repository](media/quickstart-create-pnp-device/model-repo-ui-submitted.png)

## Implement the device code

Now you have a device capability model in the repository, you can generate the device code that implements the model.

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

Use the digital twin explorer tool to validate the code:

1. Open the application and connect with your IoT Hub connection string on the landing page.
1. Find the device you're using in your hub, and select it to view the details.
1. Select the **Telemetry** page under **interfaceX** to view the telemetry data being sent by the device.
1. Select the **Properties** page under **interfaceX** to view the reported properties from the device.
1. Select the **Writable Properties** page under **interfaceX**. Under property **X**, update the value to be **Y**.
1. Select **Device Twin**, confirm the change you just made in property **X**.
1. Select the **Command** page under **interfaceX**. Select command **X** and select **Submit**.
1. Go to the device to verify that the command executed as expected.
