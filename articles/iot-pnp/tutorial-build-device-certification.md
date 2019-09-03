---
title: Build an IoT Plug and Play Preview device that's ready for certification | Microsoft Docs
description: As a device developer, learn about how you can build an IoT Plug and Play Preview device that's ready for certification.
author: tbhagwat3
ms.author: tanmayb
ms.date: 06/28/2019
ms.topic: tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Build an IoT Plug and Play Preview device that's ready for certification

This tutorial describes how, as a device developer, you can build an IoT Plug and Play Preview device that's ready for certification.

The certification tests check that:

- Your IoT Plug and Play device code is installed on your device.
- Your IoT Plug and Play device code is built with Azure IoT SDK.
- Your device code supports the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
- Your device code implements the Device Information interface.
- The capability model and device code work with IoT Central.

## Prerequisites

To complete this tutorial, you need:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

You also need the IoT Plug and Play device that you create in the [Quickstart: Use a device capability model to create a device](quickstart-create-pnp-device.md).

## Store a capability model and interfaces

For IoT Plug and Play devices, you must author a capability model and interfaces that define the capabilities of the device as JSON files.

You can store these JSON files in three different locations:

- The public model repository.
- Your company model repository.
- On your device.

Currently, to certify your device, the files must be stored either in your company model repository, or in the public model repository.

## Include the required interfaces

To pass the certification process, you must include and implement the **Device Information** interface in your capability model. This interface has the following identification:

```json
"@id": "urn:azureiot:DeviceManagement:DeviceInformation:1"
```

> [!NOTE]
> If you completed the [Quickstart: Use a device capability model to create a device](quickstart-create-pnp-device.md), you've already included the **Device Information** interface in your model.

To include the **Device Information** interface in your device model, add the interface ID to the `implements` property of the capability model:

```json
{
  "@id": "urn:yourcompanyname:sample:ThermostatDevice:1",
  "@type": "CapabilityModel",
  "displayName": "Thermostat T-1000",
  "implements": [
    "urn:yourcompanyname:sample:Thermostat:1",
    "urn:azureiot:DeviceManagement:DeviceInformation:1"
  ],
  "@context": "http://azureiot.com/v1/contexts/CapabilityModel.json"
}
```

To view the **Device Information** interface in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug and Play Open Model Repository** command. Choose **Open Public Model Repository**. The public model repository opens in VS Code.

1. In the public model repository, select the **Interfaces** tab, select the filter icon, and enter **Device Information** in the filter field.

1. To create a local copy of the **Device Information** interface, select it in the filtered list, and then select **Download**. VS Code displays the interface file.

## Update device code

### Enable device provisioning through the Azure IoT Device Provisioning Service (DPS)

To certify the device, it must enable provisioning through the [Azure IoT Device Provisioning Service (DPS)](https://docs.microsoft.com/azure/iot-dps/about-iot-dps). To add the ability to use DPS, you can generate the C code stub in VS code. Follow these steps:

1. Open the folder with DCM file in VS Code, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

1. Choose the DCM file you want to use to generate the device code stub.

1. Enter the project name, this is the name of your device application.

1. Choose **ANSI C** as the language.

1. Choose **CMake Project** as your project type.

1. Choose **Via DPS (Device Provisioning Service) symmetric key** as connection method.

1. VS Code opens a new window with generated device code stub files.

1. Open `main.c`, fill the **dpsIdScope**, **sasKey**, and **registrationId** that you prepared. You can get this information from the certification portal. For more information, see [Connect and test your IoT Plug and Play device](tutorial-certification-test.md#connect-and-discover-interfaces).

    ```c
    // TODO: Specify DPS scope ID if you intend on using DPS / IoT Central.
    static const char *dpsIdScope = "[DPS Id Scope]";
    
    // TODO: Specify symmetric keys if you intend on using DPS / IoT Central and symmetric key based auth.
    static const char *sasKey = "[DPS symmetric key]";
    
    // TODO: specify your device registration ID
    static const char *registrationId = "[device registration Id]";
    ```

1. Save the file.

### Implement standard interfaces

#### Implement the Model Information and SDK Information interfaces

The Azure IoT device SDK implements the Model Information and SDK Information interfaces. If you use the code generation function in VS Code, your device code uses the IoT Plug and Play device SDK.

If you chose to not use the Azure IoT device SDK, you can use the SDK source code as reference for your own implementation.

#### Implement the Device Information interface

Implement the **Device Information** interface on your device and provide device-specific information from the device at run time.

You can use an example implementation of the **Device Information** interface for [Linux](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) as reference.

### Implement all the capabilities defined in your model

During certification, your device is tested programmatically to ensure it implements capabilities defined in its interfaces. Use HTTP status code 501 to respond to read-write property and command requests if your device doesn't implement them.

## Next steps

Now that you've built an IoT Plug and Play device ready for certification the suggested next step is to:

> [!div class="nextstepaction"]
> [Learn how to certify your device](tutorial-certification-test.md)
