---
title: Connect an IoT Plug and Play device to IoT Central | Microsoft Docs
description: As a device developer, learn about how to use Visual Studio Code to create and test an IoT Plug and Play device that connects to IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 07/10/2019
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-central
services: iot-central
manager: philmea

# As, an operator, I want to configure a real device to connect to my IoT Central application. As a device developer, I want to use Visual Studio Code to create and test an IoT Plug and Play device that connects to my IoT Central application.
---

# Use Visual Studio Code to create an IoT Plug and Play device that connects to IoT Central

This how-to guide shows you how:

* As an operator, to add and configure a real device in your Azure IoT Central application.

* As a device developer, to use Visual Studio Code to create an [IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md) device that connects to your IoT Central application.

You use a [device capability model](./concepts-architecture-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) to define the device that connects to IoT Central. In this guide, you use a model that defines an environmental sensor device.

The device developer uses the model to generate device client code and the builder uses the model to [create a device template](./howto-set-up-template-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) in IoT Central. The model acts as a contract between your device and your IoT Central application.

The section in this guide that describes how to build the generated code assumes you're using Windows.

In this guide, you learn how to:

* Import a device capability model into a device template in IoT Central
* Add a dashboard to the template that displays device telemetry
* Add a real device from the template
* Import a device capability model into Visual Studio Code
* Generate a C device client application from the model
* Build the C device client application and connect it to IoT Central

## Prerequisites

To test your device code in this guide, you need an IoT Central application created from the **Preview** application template. If you don't already have an IoT Central application to use, complete the quickstart [Create an Azure IoT Central application (preview features)](./quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json):

To work with the device capability model in this guide, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): Visual Studio Code is available for multiple platforms
* Azure IoT Device Workbench extension for Visual Studio Code. Use the following steps to install the Azure IoT Device Workbench extension in VS Code:

    1. In VS Code, select the **Extensions** tab.
    1. Search for **Azure IoT Device Workbench**.
    1. Select **Install**.

    > [!NOTE]
    > The current version of the code generator in the extension doesn't support the **Geopoint** and **Vector** schema types or the **Acceleration**, **Velocity**, and **Location** semantic types. These schema and semantic types are supported by IoT Central.

    > [!NOTE]
    > To work with IoT Central, the device capability model must have all the interfaces defined inline in the same file.

To build the generated C code on Windows in this guide, you need:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.
* [Git](https://git-scm.com/download)
* [CMake](https://cmake.org/download/) - when you install **CMake**, select the option **Add CMake to the system PATH**.
* A local copy of the Azure IoT C SDK:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive -b public-preview
    ```

To follow the device-first instructions at the end of this how-to, you also need to install:

* [Node.js](https://nodejs.org)
* The [dps-keygen tool](https://www.npmjs.com/package/dps-keygen):

    ```cmd/sh
    npm i -g dps-keygen
    ```

## Create device template

Create folder called **pnp_app** in the **azure-iot-sdk-c** folder that contains the Azure IoT C SDK you cloned. Download the [EnvironmentalSensor.capabilitymodel.json](https://raw.githubusercontent.com/Azure/IoTPlugandPlay/master/samples/EnvironmentalSensorInline.capabilitymodel.json) device capability model from GitHub and save the file in the **pnp_app** folder. Replace the two instances of `<YOUR_COMPANY_NAME_HERE>` with your name. Use only the characters a-z, A-Z, 0-9, and underscore. Make a note of the full value of the `"@id"` field that uniquely identifies your device capability model, you need it later. This model includes two interfaces:

* The **DeviceManagement** common interface.
* the **EnvironmentalSensor** custom interface.

To create a device template for the environmental sensor device in IoT Central:

1. Go to the **Device templates** page and select **+ New**. Then choose **Custom**.

1. Enter **Environmental Sensor** as the device template name.

1. Choose **Import Capability Model**. Then locate the **EnvironmentalSensor.capabilitymodel.json** you created, and select **Open**. The two interfaces, **Device Information** and **Environmental Sensor**, are displayed in the **Environmental Sensor Capability Model**.

1. Select **Views** and then **Visualizing the Device**.

1. In the list of fields you can add to the dashboard, select the two **Telemetry** values, **Humidity** and **Temperature** and select **Combine**. Then choose **Save**.

You now have a device template that uses the **Environmental Sensor** model and that has a simple dashboard to display telemetry from a device.

## Publish the template and add a real device

To publish the template and add a real device, go to the **Device templates** page and select the **Environmental Sensor** device template. Select **Publish**, review the information, and select **Publish**.

Before you connect a client application, you need to add a device on the **Devices** page and get its connection information:

1. Go to the **Devices** page and select **Environmental Sensor**. The **Devices** page lets you manage the devices that can connect to your application.

1. To add a real device, choose **+ New**, change the device ID to **sensor01**, and select **Create**. Make sure that **Simulated** is **Off**.

1. In the list of devices, select your **Environmental Sensor** device. Then select **Connect**.

1. Make a note of the **Scope ID**, **Device ID**, and **Primary Key**. Then select **Close**.

## Generate a device client application

You use Visual Studio Code to generate a skeleton device client application from the device capability model:

1. Launch Visual Studio Code and open the **pnp_app** folder.

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select **Generate Device Code Stub**.

1. Select the **EnvironmentalSensor.capabilitymodel.json** device capability model file.

1. Enter **sensor_app** as the project name.

1. Choose **ANSI C** as the language.

1. Choose **CMake Project** as the target.

1. Choose **Via DPS (Device Provisioning Service) symmetric key** as the connection method.

Visual Studio Code opens a new window with the generated C code in the **sensor_app** folder.

## Add connection details to the device client

To add the connection information to your device client, open **main.c** in the folder that contains your generated code:

1. Replace `[DPS Id Scope]` with the **Scope ID** value you made a note of previously.

1. Replace `[DPS symmetric key]` with the **Primary Key** value you made a note of previously.

1. Replace `[device registration Id]` with the **Device ID** value you made a note of previously.

1. Save the changes.

## Build and run the client

To build and run the client, you need to customize the build for the Azure IoT C SDK:

1. Open the file **CMakeLists.txt** in the root of the **azure-iot-sdk-c** folder.

1. Add the following line at the end of this file to include the new client app in the build:

    ```txt
    add_subdirectory(pnp_app/sensor_app)
    ```

1. Save the changes.

1. Open a command prompt and navigate to the **azure-iot-sdk-c** folder.

1. To build the application, run the following commands:

    ```cmd
    mkdir cmake
    cd cmake
    cmake .. -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -Dskip_samples:BOOL=ON
    cmake --build . -- /m /p:Configuration=Release
    ```

1. To run the application, run the following command from the same command prompt:

    ```cmd
    pnp_app\sensor_app\Release\sensor_app.exe
    ```

## View the telemetry

After a few minutes, you can see the telemetry from the device on the device dashboard in your IoT Central application.

## Connect device-first

You can connect an IoT Plug and Play device through a device-first connection as described in [Connectivity](concepts-connectivity-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json). The discovery process follows this order:

1. Associates with the device template if it's already published in the IoT Central application.

1. Fetches the capability model from the [public repository](https://aka.ms/ACFI) of published and certified capability models.

Using Visual Studio Code and the **Generate Device Code Stub** command referenced above, you can follow these steps to connect device-first and automatically bring in your published device capability model from the public repository into IoT Central:

1. Use an existing device capability model that has been published in the public repository. You need the full device capability model and to note down the URN of this model.

1. Follow the steps above to [Generate a device client application](#generate-a-device-client-application) to use Visual Studio Code and generate the device code.

1. From your IoT Central application, go to the **Administration** tab and select the **Device Connection** section. Make a note of the **Scope ID** and **Primary Key** values for your application.

    > [!NOTE]
    > The **Primary Key** shown on this page is a group shared access signature that you can use to generate multiple device keys for your application.

1. Use the [DPS keygen](https://www.npmjs.com/package/dps-keygen) tool to generate a device key from the primary key you made a note of previously. To generate the device key, run the following command:

    ```cmd/sh
    dps-keygen -mk:<Primary_Key> -di:<device_id>
    ```

1. Follow the steps in the previous section [Add connection details to the device client](#add-connection-details-to-the-device-client) to add the **Scope ID**, **Primary Key**, and **Device ID**.

1. Follow the steps in the previous section to [Build and run the client](#build-and-run-the-client).

1. Now you see the device connect to your IoT Central application and automatically bring in the device capability model from the public repository as a device template.

## Next steps

Now that you've learned how to connect a real device to IoT Central, a suggested next step is to learn more about device templates in [Set up a device template](howto-set-up-template-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
