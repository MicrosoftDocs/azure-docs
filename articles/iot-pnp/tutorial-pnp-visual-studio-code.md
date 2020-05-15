---
title: Create and test an IoT Plug and Play Preview device | Microsoft Docs
description: As a device developer, learn about how to use VS Code to create and test a new device capability model for an IoT Plug and Play Preview device.
author: dominicbetts
ms.author: dobett
ms.date: 12/30/2019
ms.topic: tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a device builder, I want to use VS Code to create and test a new device capability model so I can prepare devices that are simple to connect an IoT solution.
---

# Tutorial: Create and test a device capability model using Visual Studio Code

This tutorial shows you how, as a device developer, to use Visual Studio Code to create a _device capability model_. You can use the model to generate skeleton code to run on a device that connects to an Azure IoT Hub instance in the cloud.

The section in this tutorial that describes how to build the generated skeleton code assumes you're using Windows.

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

To build the generated C code on Windows in this tutorial, you need:

* [Build Tools for Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16) with **C++ build tools** and **NuGet package manager component** workloads. Or if you already have [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) 2019, 2017 or 2015 with same workloads installed.
* [Git](https://git-scm.com/download)
* [CMake](https://cmake.org/download/)

To test your device code in this tutorial, you need:

* The [Azure IoT explorer](https://github.com/Azure/azure-iot-explorer/releases).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Model your device

You use the _digital twin definition language_ to create a device capability model. A model typically consists of multiple _interface_ definition files and a single model file. The **Azure IoT Tools for VS Code** includes tools to help you create and edit these JSON files.

### Create the interface file

To create an interface file that defines the capabilities of your IoT device in VS Code:

1. Create a folder called **devicemodel**.

1. Launch VS Code and use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Create Interface** command.

1. Browse to and select the **devicemodel** folder you created.

1. Then enter **EnvironmentalSensor** as the name of the interface and press **Enter**. VS Code creates a sample interface file called **EnvironmentalSensor.interface.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field with a unique value. Use only the characters a-z, A-Z, 0-9, and underscore. For more information, see [Digital Twin identifier format](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL#digital-twin-identifier-format). The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:{your name}:EnvironmentalSensor:1",
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
          "@type": "Telemetry",
          "name": "magnetometer",
          "displayName": "Magnetometer",
          "comment": "This shows a complex telemetry that contains a magnetometer reading.",
          "schema": {
            "@type": "Object",
            "fields": [
              {
                "name": "x",
                "schema": "integer"
              },
              {
                "name": "y",
                "schema": "integer"
              },
              {
                "name": "z",
                "schema": "integer"
              }
            ]
          }
        },
        {
          "@type": "Command",
          "name": "turnon",
          "response": {
            "name": "turnon",
            "schema": "string"
          },
          "comment": "This Commands will turn-on the LED light on the device.",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnoff",
          "comment": "This Commands will turn-off the LED light on the device.",
          "response": {
            "name": "turnoff",
            "schema": "string"
          },
          "commandType": "synchronous"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
    }
    ```

    This interface defines device properties such as **Customer Name**, telemetry types such as **Temperature**, and commands such as **turnon**.

1. Add a command capability called **blink** at the end of this interface file. Be sure to add a comma before you add the command. Try typing the definition to see how intellisense, autocomplete, and validation can help you edit an interface definition:

    ```json
    {
      "@type": "Command",
      "description": "This command will begin blinking the LED for given time interval.",
      "name": "blink",
      "request": {
        "name": "blinkRequest",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "interval",
              "schema": "long"
            }
          ]
        }
      },
      "response": {
        "name": "blinkResponse",
        "schema": "string"
      },
      "commandType": "synchronous"
    }
    ```

1. Save the file.

### Create the model file

The model file specifies the interfaces that your IoT Plug and Play device implements. There are typically at least two interfaces in a model - one or more that define the specific capabilities of your device, and a standard interface that all IoT Plug and Play devices must implement.

To create a model file that specifies the interfaces your IoT Plug and Play device implements in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Create Capability Model** command. Then enter **SensorboxModel** as the name of the model. VS Code creates a sample interface file called **SensorboxModel.capabilitymodel.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field and in the `EnvironmentalSensor` interface with the same value you used in the **EnvironmentalSensor.interface.json** file. The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:{your name}:SensorboxModel:1",
      "@type": "CapabilityModel",
      "displayName": "Environmental Sensorbox Model",
      "implements": [
        {
          "schema": "urn:{your name}:EnvironmentalSensor:1",
          "name": "environmentalSensor"
        },
        {
          "schema": "urn:azureiot:DeviceManagement:DeviceInformation:1",
          "name": "deviceinfo"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
    }
    ```

    The model defines a device that implements your **EnvironmentalSensor** interface and the standard **DeviceInformation** interface.

1. Save the file.

### Download the DeviceInformation interface

Before you can generate skeleton code from the model, you must create a local copy of the **DeviceInformation** from the *public model repository*. The public model repository already contains the **DeviceInformation** interface.

To download the **DeviceInformation** interface from the public model repository using VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play**, select the **Open Model Repository** command, and then select **Open Public Model Repository**.

1. Select **Interfaces**, then select the device information interface with ID `urn:azureiot:DeviceManagement:DeviceInformation:1`, and then select **Download**.

You now have the three files that make up your device capability model:

* urn_azureiot_DeviceManagement_DeviceInformation_1.interface.json
* EnvironmentalSensor.interface.json
* SensorboxModel.capabilitymodel.json

## Publish the model

For the Azure IoT explorer tool to read your device capability model, you need to publish it in your company repository. To publish from VS Code, you need the connection string for the company repository:

1. Navigate to the [Azure Certified for IoT portal](https://aka.ms/ACFI).

1. Use your Microsoft _work account_ to sign in to the portal.

1. Select **Company repository** and then **Connection strings**.

1. Copy the connection string.

To open your company repository in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Open Model Repository** command.

1. Select **Open Organizational Model Repository** and paste in your connection string.

1. Press **Enter** to open your company repository.

To publish your device capability model and interfaces to your company repository:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Submit files to Model Repository** command.

1. Select the **EnvironmentalSensor.interface.json** and **SensorboxModel.capabilitymodel.json** files and select **OK**.

Your files are now stored in your company repository.

## Generate code

You can use the **Azure IoT Tools for VS Code** to generate skeleton C code from your model. To generate the skeleton code in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Generate Device Code Stub** command.

1. Select your **SensorboxModel.capabilitymodel.json** capability model file.

1. Enter **sensorbox_app** as the project name.

1. Choose **ANSI C** as the language.

1. Choose **Via IoT Hub device connection string** as the way to connect.

1. Choose **CMake Project on Windows** as project template.

1. Choose **Via Vcpkg** as way to include the device SDK.

VS Code generates the skeleton C code and saves the files in the **sensorbox_app** folder in the **modelcode** folder. VS Code opens a new window that contains the generated code files.

## Update the generated code

Before you can build and run the code, you need to implement the stubbed properties, telemetry, and commands.

To provide implementations for the stubbed code in VS Code:

1. Open the **SensorboxModel_impl.c** file.

1. Add code to implement the stubbed functions.

1. Save your changes.

## Build the code

Before you run the code to test your IoT Plug and Play device with an Azure IoT hub, you need to compile the code.

Follow the instructions in the **Readme.md** file in the **sensorbox_app** folder to build and run the code on Windows. The following section includes instructions for retrieving a device connection string to use when you run the device code.

## Test the code

When you run the code, it connects to IoT Hub and starts sending sample telemetry and property values. The device also responds to commands sent from IoT Hub. To verify this behavior:

1. To create an IoT hub:

    ```azurecli-interactive
    az group create --name environmentalsensorresources --location centralus
    az iot hub create --name {your iot hub name} \
      --resource-group environmentalsensorresources --sku F1
    ```

1. Add a device to your IoT hub and retrieve its connection string:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {your iot hub name} --device-id MyPnPDevice
    az iot hub device-identity show-connection-string --hub-name {your iot hub name} --device-id MyPnPDevice --output table
    ```

    Make a note of the connection string.

1. At a command prompt, navigate to the **azure-iot-sdk-c** folder where you built the SDK and samples. Then navigate to the **cmake\\sensorbox_app\\Release** folder.

1. Run the following command:

    ```cmd
    sensorbox_app.exe {your device connection string}
    ```

1. Use the Azure IoT explorer tool to interact with the IoT Plug and Play device connected to your IoT hub. For more information, see [Install and use Azure IoT explorer](./howto-install-iot-explorer.md).

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to:

> [!div class="nextstepaction"]
> [Build a device that's ready for certification](tutorial-build-device-certification.md)
