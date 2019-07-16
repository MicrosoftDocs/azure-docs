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
- Your IoT Plug and Play device code must be installed on your device.
- Your device code must support the Azure IoT Hub Device Provisioning Service.
- Your device code must implement Device Information Interface.

## Prerequisites

To complete this tutorial, you need:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

You also need the Plug and Play device that you create when you follow [Quickstart: Use a device capability model to create a device](quickstart-create-pnp-device.md).

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

To add the ability to use DPS, copy this code to the **file name to be specified** source file in the generated code.

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
