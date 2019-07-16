---
title: Build an Azure IoT Plug and Play device that's ready for certification | Microsoft Docs
description: As a device developer, learn about how you can build a Plug and Play device that's ready for certification.
author: tbhagwat3
ms.author: tanmayb
ms.date: 06/28/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Build a Plug and Play device that's ready for certification

This tutorial describes how, as a device developer, you can build a Plug and Play device that's ready for certification.

The certification tests check that:
* Your IoT Plug and Play device code must be installed on your device.
* Your IoT Plug and Play device code are built with Azure IoT SDK
* Your device code must support the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
* Your device code must implement [Device Information Interface](concepts-common-interfaces.md)
* The capability model and device code work with IoT Central 

## Prerequisites

To complete this tutorial, you need:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

You also need the Plug and Play device that you create when you follow [Quickstart: Use a device capability model to create a device](quickstart-create-pnp-device.md).

## Options for storing capability model and interfaces

For Plug and Play devices you must author a capability model and interfaces that define the capabilities of the device as JSON files. 

It's possible to store those JSON files in three different locations:
- The global model repository. [Learn more]().
- Your organizational model repository. [Learn more]().
- You can store them on your device. [Learn more]().

At this time, for certifying your device, they must be stored either in the organizational model repository or the global model repository.

## Include the Device Information interface

To pass the certification process, you must include the **Device Information** interface in your capability model and implement it. This interface has the following identification:

```json
   "@id": "urn:azureiot:DeviceManagement:DeviceInformation:1"
```

To include the **Device Information** interface in your device's model, add the interface ID to the `implements` property of the capability model:

```json
   {
    "@id": "urn:azureiot:sample:ThermostatDevice:1",
    "@type": "CapabilityModel",
    "displayName": "Thermostat T-1000",
    "implements": [
        "urn:azureiot:sample:Thermostat:1",
        "urn:azureiot:DeviceManagement:DeviceInformation:1"
    ],
    "@context": "http://azureiot.com/v1/contexts/CapabilityModel.json"
}
```

To view the contents of the **Device Information** interface in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **Azure IoT Plug and Play: Open Model Repository** command. Choose **Global Model Repository**. The global model repository opens in VS Code.

1. In the global model repository, enter **Device Information** in the search field.

1. To create a local copy of the **Device Information** interface, select it in the search results, and then select **Download**.

To view the contents of the **Device Information** interface through the Azure CLI:

1. Install the Azure IoT CLI extension by following the instructions [here](https://review.docs.microsoft.com/en-us/azure/iot-pnp/howto-install-pnp-cli?branch=pr-en-us-81533).

1. Use the cmdlet to show an interface with the id of the Device Information interface to see it. See instructions on managing interfaces in a model repository through the Azure IoT CLI [here](https://review.docs.microsoft.com/en-us/azure/iot-pnp/howto-install-pnp-cli?branch=pr-en-us-81533#manage-interfaces-in-a-model-repository).

## Update device code

### Enable device provisioning through the Azure IoT Device Provisioning Service (DPS)

To certify the device, it has to enable device provisioning through the [Azure IoT Device Provisioning Service (DPS)](https://docs.microsoft.com/en-us/azure/iot-dps/about-iot-dps). To add the ability to use DPS, you can generate the C code stub in VS code. Follow these steps to do so:

1. Open the folder with DCM file in VS Code, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

1. Choose the DCM file you want to use to generate the device code stub.

1. Enter the project name, it will be the name of your device application.

1. Choose **ANSI C** as the language.

1. Choose **CMake Project** as your project type.

1. Choose **Via DPS (Device Provisioning Service) symmetric key** as connection method.

1. VS Code opens a new window with generated device code stub files.
    ![Device code](media/tutorial-build-device-certification/device-code.png)

1. Open `main.c`, fill the **dpsIdScope**, **sasKey** and **registrationId** that you prepared. You can get this information from the certification portal. [Learn more](https://review.docs.microsoft.com/en-us/azure/iot-pnp/tutorial-certification-test?branch=pr-en-us-81533#connect-and-discover-interfaces).

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

The Azure IoT device SDK implements the Model Information and SDK Information interfaces. If you use the code generation function in VS Code, your device code uses the Azure IoT Plug and Play device SDK.

If you chose to not use the Azure IoT device SDK, you can use the SDK source code as reference for your own implementation.

#### Implement the Device Information interface

You must implement the **Device Information** interface on your device and provide device-specific information from the device at run time.

You can use an example implementation of the **Device Information** interface for [Linux](https://github.com/Azure/azure-iot-sdk-c-pnp/) as reference.

### Implement all the capabilities defined in your model

During certification, your device is tested programmatically to ensure it implements capabilities defined in its interfaces. Use HTTP status code 501 to respond to read-write property and command requests if your device doesn't implement them.

## Next steps

Now that you've built an IoT Plug and Play device ready for certification the suggested next step is to:

> [!div class="nextstepaction"]
> [Learn how to certify your device](tutorial-certification-product.md)
