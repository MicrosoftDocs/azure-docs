---
title: Create and test a Azure IoT Plug and Play device | Microsoft Docs
description: As a device developer, learn about how to use VS Code to create and test a new device capability model for an IoT Plug and Play device.
author: dominicbetts
ms.author: dobett
ms.date: 06/21/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a device builder, I want to use VS Code to create and test a new device capability model so I can prepare devices that are simple to connect an IoT solution.
---

# Tutorial: Create a test a device capability model using Visual Studio Code

This tutorial shows you how, as a device developer, to use Visual Studio code to create a _device capability model_. You can use the model to generate code to run on a device that connects to an Azure IoT Hub instance in the cloud.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device capability model
> * Generate device code from the model
> * Implement the stubs in the generated code
> * Run the code to test the interactions with an IoT hub

## Prerequisites

To complete this tutorial, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): VS Code is available for multiple platforms
* [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

<!-- TODO what's needed to compile the C code - we'll need to be platform specific? -->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Model your device

You use the _digital twin definition language_ to create a device capability model. A model typically consists of multiple _interface_ definition files and a single model file. The **Azure IoT Workbench extension for VS Code** includes tools to help you create and edit these JSON files.

### Create the interface file

To create an interface file that defines the capabilities of your IoT device in VS Code:

1. Create a folder on your machine called **EnvironmentalSensorDCM**.

1. Start VS Code an open the **EnvironmentalSensorDCM** folder.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Create Interface** command. Then enter **EnvironmentalSensor** as the name of the interface. VS Code creates a sample interface file called **EnvironmentalSensor.interface.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field with a unique value. The interface ID must be unique to be able to save the interface in the repository:

    ```json
    {
      "@id": "http://{your name}.com/EnvironmentalSensor/1.0.0",
      "@type": "Interface",
      "displayName": "Environmental Sensor",
      "description": "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
      "comment": "Requires temperature and humidity sensors.",
      "contents": [
        {
          "@type": "Property",
          "displayName": "Device State",
          "description": "The state of the device. Two states online/offline are available.",
          "name": "state",
          "schema": "boolean"
        },
        {
          "@type": "Property",
          "displayName": "Customer Name",
          "description": "The name of the customer currently operating the device.",
          "name": "name",
          "schema": "string",
          "writable": true
        },
        {
          "@type": "Property",
          "displayName": "Brightness Level",
          "description": "The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)",
          "name": "brightness",
          "writable": true,
          "schema": "long"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Temperature"
          ],
          "description": "Current temperature on the device",
          "displayName": "Temperature",
          "name": "temp",
          "schema": "double",
          "unit": "Units/Temperature/fahrenheit"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Humidity"
          ],
          "description": "Current humidity on the device",
          "displayName": "Humidity",
          "name": "humid",
          "schema": "double",
          "unit": "Units/Humidity/percent"
        },
        {
          "@type": "Command",
          "description": "This command will begin blinking the LED for given time interval.",
          "name": "blink",
          "requestSchema": {
            "@type": "Object",
            "fields": {
              "@type": "SchemaField",
              "name": "interval",
              "schema": "long"
            }
          },
          "responseSchema": "string",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnon",
          "responseSchema": "string",
          "comment": "This Commands will turn-on the LED light on the device.",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnoff",
          "comment": "This Commands will turn-off the LED light on the device.",
          "responseSchema": "string",
          "commandType": "synchronous"
        }
      ],
      "@context": "http://azureiot.com/v0/contexts/Interface.json"
    }
    ```

    This interface defines a number of device properties such as **Customer Name**, a number of telemetry types such as **Temperature**, and a number of commands such as **blink**.

1. Save the file.

### Create the model file

The model file specifies the interfaces that your Plug and Play device implements. There are typically at least two interfaces in a model - one or more that define the specific capabilities of your device, and one standard interface that all Plug and Play devices must implement.

To create a model file that specifies the interfaces your Plug and Play device implements in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Create Capability Model** command. Then enter **EnvironmentalSensorModel** as the name of the model. VS Code creates a sample interface file called **EnvironmentalSensorModel.capabilitymodel.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field and in the `EnvironmentalSensor` interface with the same value you used in the **EnvironmentalSensor.interface.json** file. The interface ID must be unique to be able to save the interface in the repository:

    ```json
    {
      "@id": "http://{your name}.com/EnvironmentalSensorModel/1.0.0",
      "@type": "CapabilityModel",
      "displayName": "Environmental Sensor Model",
      "implements": [
        "http://{your name}.com/interfaces/EnvironmentalSensor/1.0.0",
        "http://azureiot.com/interfaces/DeviceInformation/1.0.0"
      ],
      "@context": "http://azureiot.com/v0/contexts/CapabilityModel.json"
    }
    ```

    The model defines a device that implements your **EnvironmentalSensor** interface and the standard **DeviceInformation** interface.

1. Save the file.

### Add the files to the global model repository

Before you can generate code form the model, you must add the model files to the *global model repository*. The global model repository already contains the **DeviceInformation** interface.

To add the **EnvironmentalSensor.interface.json** file to the global model repository from VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Submit file to Model Repository** command.

<!-- TODO complete steps here. @Liya Do we need to sign in to the global model repository? -->

To add the **EnvironmentalSensorModel.capabilitymodel.json** file to the global model repository from VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Submit file to Model Repository** command.

<!-- TODO complete steps here. @Liya -  Do we need to sign in to the global model repository? -->

## Generate code

You can use the **Azure IoT Workbench extension for VS Code** to generate skeleton C code from your model. To generate the code in VS Code:

1. Use the **Explorer** in VS Code to create a folder called **modelcode** in your workspace.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Submit file to Model Repository** command.

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Generate Device Code Stub** command.

1. Select your **EnvironmentalSensorModel.capabilitymodel.json** capability model file.

<!-- @Liya Are we prompted for a connection string here? -->

1. Choose **ANSI C** as the language.

1. Choose **General Platform** as the target platform.

1. Select the **modelcode** folder in your workspace to save the generated C files.

VS Code generates the the skeleton C code and saves the files in the **modelcode** folder. VS Code opens a new window that contains the generated code files.

## Update the generated code

Before you can build and run the code, you need to implement the stubbed properties, telemetry, and commands.

To provide implementations for the stubbed code in VS Code:

1. Open the **device_model.c** file.

<!-- To do - complete this section -->

### Build the code

## Test the code

When you run the code, it connects to IoT Hub and starts sending sample telemetry and property values. The device also responds to commands sent from IoT Hub. To verify this behavior:

<!-- To do - complete this section -->

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to [certify your device](link) and list it in the Certified for Azure IoT device catalog.
