---
title: Connect a Plug and Play device to IoT Central | Microsoft Docs
description: As a device developer, learn about how to use VS Code to create and test an IoT Plug and Play device that connects to IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 07/10/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As, an operator, I want to configure a real device to connect to my IoT Central application. As a device developer, I want to use VS Code to create and test an IoT Plug and Play device that connects to my IoT Central application.
---

# Use Visual Studio Code to create a Plug and Play device that connects to IoT Central

This how-to guide shows you how:

* As an operator, to add and configure a real device in your Azure IoT Central application.

* As a device developer, to use Visual Studio Code to create an IoT Plug and Play device that connects to your IoT Central application.

You use a _device capability model_ to define the device that connects to IoT Central. In this guide, you use a model that defines an environmental sensor device.

The device developer uses the model to generate device client code and the operator uses the model to create a device template in IoT Central. The model acts as a contract between your device and your IoT Central application.

The section in this guide that describes how to build the generated code assumes you're using Windows.

In this guide, you learn how to:

* Import a device capability model into a device template in IoT Central
* Add a dashboard to the template that displays device telemetry
* A real device from the template
* Import a device capability model into VS Code
* Generate a C device client application from the model
* Build the C device client application and connect it to IoT Central

## Prerequisites

To test your device code in this guide, you need an IoT Central application created from the Plug and Play application template. If you don't already have an IoT Central application to use, complete the quickstart [Create an Azure IoT Central application (Feature preview)](./quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json):

To work with the device capability model in this guide, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): VS Code is available for multiple platforms
* Azure IoT Device Workbench extension for VS Code:
    1. Download the .vsix file from [https://aka.ms/iot-workbench-pnp-pr](https://aka.ms/iot-workbench-pnp-pr).
    1. In VS Code, select **Extensions** tab.
    1. Select **Install from VSIX**.
    1. Select the .vsix file you downloaded.
    1. Select **Install**.

        > [!NOTE]
        > Bugbash: This is currently the only way to install the extension.

To build the generated C code on Windows in this guide, you need:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.
* [Git](https://git-scm.com/download)
* [CMake](https://cmake.org/download/)
* A local copy of the Azure IoT C SDK:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-c-pnp.git --recursive -b public-preview-utopia
    ```

## Create device template

Create folder called **pnp_app** in the **azure-iot-sdk-c-pnp** folder that contains the Azure IoT C SDK you cloned. Save the following device capability model in the **pnp_app** folder as a file called **EnvironmentalSensor.capabilitymodel.json** and replace the two instances of `{yourname}` with your name. Use only the characters a-z, A-Z, 0-9, and underscore. Make a note of the full value of the `"@id"` field that uniquely identifies your device capability model, you need it later. This model includes two interfaces:

```json
{
  "@id": "urn:{yourname}:sample_device:1",
  "@type": "CapabilityModel",
  "displayName": "Environment Sensor Capability Model",
  "implements": [
    {
      "@type": "InterfaceInstance",
      "name": "deviceinfo",
      "schema": {
        "@id": "urn:azureiot:DeviceManagement:DeviceInformation:1",
        "@type": "Interface",
        "displayName": "Device Information",
        "@context": "http://azureiot.com/v1/contexts/Interface.json",
        "contents": [
          {
              "@type": "Property",
              "name": "manufacturer",
              "displayName": "Manufacturer",
              "schema": "string",
              "comment": "Company name of the device manufacturer. This could be the same as the name of the original equipment manufacturer (OEM). Ex. Contoso."
          },
          {
              "@type": "Property",
              "name": "model",
              "displayName": "Device model",
              "schema": "string",
              "comment": "Device model name or ID. Ex. Surface Book 2."
          },
          {
              "@type": "Property",
              "name": "swVersion",
              "displayName": "Software version",
              "schema": "string",
              "comment": "Version of the software on your device. This could be the version of your firmware. Ex. 1.3.45"
          },
          {
              "@type": "Property",
              "name": "osName",
              "displayName": "Operating system name",
              "schema": "string",
              "comment": "Name of the operating system on the device. Ex. Windows 10 IoT Core."
          },
          {
              "@type": "Property",
              "name": "processorArchitecture",
              "displayName": "Processor architecture",
              "schema": "string",
              "comment": "Architecture of the processor on the device. Ex. x64 or ARM."
          },
          {
              "@type": "Property",
              "name": "processorManufacturer",
              "displayName": "Processor manufacturer",
              "schema": "string",
              "comment": "Name of the manufacturer of the processor on the device. Ex. Intel."
          },
          {
              "@type": "Property",
              "name": "totalStorage",
              "displayName": "Total storage",
              "schema": "long",
              "displayUnit": "kilobytes",
              "comment": "Total available storage on the device in kilobytes. Ex. 2048000 kilobytes."
          },
          {
              "@type": "Property",
              "name": "totalMemory",
              "displayName": "Total memory",
              "schema": "long",
              "displayUnit": "kilobytes",
              "comment": "Total available memory on the device in kilobytes. Ex. 256000 kilobytes."
          }
        ]
      }
    },
    {
      "@type": "InterfaceInstance",
      "name": "sensor",
      "schema": {
        "@id": "urn:{yourname}:EnvironmentalSensor:1",
        "@type": "Interface",
        "displayName": "Environmental Sensor",
        "@context": "http://azureiot.com/v1/contexts/Interface.json",
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
            "commandType": "synchronous",
            "request": {
              "name": "interval",
              "schema": "long"
            },
            "response": {
              "name": "blinkResponse",
              "schema": {
                "@type": "Object",
                "fields": [
                  {
                    "name": "description",
                    "schema": "string"
                  }
                ]
              }
            }
          },
          {
            "@type": "Command",
            "name": "turnon",
            "comment": "This Commands will turn-on the LED light on the device.",
            "commandType": "synchronous"
          },
          {
            "@type": "Command",
            "name": "turnoff",
            "comment": "This Commands will turn-off the LED light on the device.",
            "commandType": "synchronous"
          },
          {
            "@type": "Command",
            "name": "rundiagnostics",
            "comment": "This command initiates a diagnostics run.  This will take time and is implemented as an asynchronous command",
            "commandType": "asynchronous"
          }
        ]
      }
    }
  ],
  "@context": "http://azureiot.com/v1/contexts/CapabilityModel.json"
}
```

To create a device template for the environmental sensor device in IoT Central:

1. Go to the **Device templates** page and select **+ New**. Then choose **Custom**.

1. Enter **Environmental Sensor** as the device template name.

1. Choose **Import Capability Model**. Then locate the **EnvironmentalSensor.capabilitymodel.json** you created, and select **Open**. The two interfaces, **Device Information** and **Environmental Sensor**, are displayed in the **Environmental Sensor Capability Model**.

1. Select **Views** and then **Visualizing the Device**.

1. In the list of fields you can add to the dashboard, select the two **Telemetry** values, **Humidity** and **Temperature** and select **Combine**. Then choose **Save**.

You now have a device template that uses the **Environmental Sensor** model and that has a simple dashboard to display telemetry from a device.

## Publish the template and add a real device

To publish the template and add a real device:

1. On the **Environmental Sensor** device template, select **Publish**. Review the information and select **Publish**.

1. Go to the **Devices** page and select **Environmental Sensor**.

1. To add a real device, choose **+ New**, change the device ID to **sensor01**, and select **Create**. Make sure that **Simulated** is **Off**.

You need the connection information to use when you create the client application:

1. In the list of devices, click your **Environmental Sensor** device. Then select **Connect**.

1. Make a note of the **Scope ID**, **Device ID**, and **Primary Key**. Then select **Close**.

## Generate a device client application

You use VS Code to generate a skeleton device client application from the device capability model:

1. Launch VS Code and open the **pnp_app** folder.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select **Generate Device Code Stub**.

1. Select the **EnvironmentalSensor.capabilitymodel.json** device capability model file.

1. Enter **sensor_app** as the project name.

1. Choose **ANSI C** as the language.

1. Choose **CMake Project** as the target.

1. Choose **Via DPS (Device Provisioning Service) symmetric key** as the connection method.

VS Code opens a new window with the generated C code in the **sensor_app** folder.

## Add connection details to the device client

To add the connection information to your device client, open **main.c** in the folder that contains your generated code:

1. Replace `[DPS Id Scope]` with the **Scope ID** value you made a note of previously.

1. Replace `[DPS symmetric key]` with the **Primary Key** value you made a note of previously.

1. Replace `[device registration Id]` with the **Device ID** value you made a note of previously.

1. Replace `[your capabilityModel Id]` with the unique capability model ID you made a note of previously. This value is the `"@id"` field in the **EnvironmentalSensor.capabilitymodel.json** file.

1. Save the changes.

## Build and run the client

To build and run the client, you need to customize the build for the Azure IoT C SDK:

1. Open the file **CMakeLists.txt** in the root of the **azure-iot-sdk-c-pnp** folder.

1. Add the following line at the end of this file to include the new client app in the build:

    ```txt
    add_subdirectory(pnp_app/sensor_app)
    ```

1. Save the changes.

1. Open a command prompt and navigate to the **azure-iot-sdk-c-pnp** folder.

1. To build the application, run the following commands:

    ```cmd
    mkdir cmake
    cd cmake
    cmake .. -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -Dskip_samples:BOOL=ON
    cmake --build . -- /m /p:Configuration=Release
    ```

1. To run the application, run the following command form the same command prompt:

    ```cmd
    pnp_app\sensor_app\Release\sensor_app.exe
    ```

## View the telemetry

After a few minutes, you can see the telemetry from the device on the device dashboard in your IoT Central application.

## Next steps

Now that you've learned how to connect a real device to IoT Central, a suggested next step is to learn more about device templates in [Set up a device template](howto-set-up-template-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
