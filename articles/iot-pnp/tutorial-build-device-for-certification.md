---
title: Build an Azure IoT Plug and Play device that's ready for certification | Microsoft Docs
description: As a device developer, learn about how you can build a Plug and Play device that's ready for certification.
author: tbhagwat3
ms.author: tanmayb
ms.date: 05/24/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Build a Plug and Play device that's ready for certification

This tutorial describes how, as a device developer, you can build a Plug and Play device that's ready for certification.

The certification tests check that:

- The device capability model includes the standard **Device Information** interface.
- The device code uses the Azure IoT Plug and Play device SDK.
- The device code implements all the capabilities defined in the model.
- The device can be provisioned to an IoT hub using the Azure IoT Device Provisioning Service.

## Prerequisites

To complete this tutorial, you need:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)

## Model your device

To certify your device you need a device capability model. You use the digital twin definition language to create a device capability model.

To create a device capability model in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette:
<Image to be added>

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Create Capability Model** command:
<Image to be added>

1. Enter a name for your capability model file. A default interface file is created.

1. Copy the contents from [here](GitHub link) into the file you created.

You now have an example model for your device. Edit it to make it your own.

## Include standard interfaces

To pass the certification process, you must include the **Device Information** interface in your model. This interface has the following identification:

```json
   "@id": "http://azureiot.com/interfaces/DeviceInformation/1.0.0"
```

To include the **Device Information** interface in your device's model, add the interface ID to the `implements` property of the capability model:

```json
   {
    "@id": "http://example.com/thermostatDevice/1.0.0",
    "@type": "CapabilityModel",
    "displayName": "Thermostat T-1000",
    "implements": [
        "http://example.com/thermostat/1.0.0",
        "http://azureiot.com/interfaces/DeviceInformation/1.0.0"
    ],
    "@context": "http://azureiot.com/v0/contexts/CapabilityModel.json"
}
```

To view the contents of the **Device Information** interface in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette:
<Image to be added>

1. Enter **Plug and Play** and then select the **Azure IoT Plug and Play: Open Model Repository** command. Choose **Global Model Repository**. The global model repository opens in VS Code:
<Image to be added>

1. In the global model repository, enter **Device Information** in the search field.
<Image to be added>

1. To create a local copy of the **Device Information** interface, select it in the search results, and then select **Download**:
<Image to be added>

## Generate code

Now that you've modeled your device using  the digital twin definition language, generate device code for it in Visual Studio Code:

1. Use **Ctrl+Shift+P** to open the command palette:
<Image to be added>

1. Enter **Plug and Play** and then select the **Azure IoT Plug & Play: Generate Device Code Stub** command:
<Image to be added>

1. Choose your capability model file:
<Image to be added>

1. Choose **ANSI C** as the language:
<Image to be added>

1. Choose **General platform** as the platform:
<Image to be added>

1. Select a folder to save the generated C files:
<Image to be added>

The generated device code includes the following files:
<File structure is in the works>

## Update the generated code

For your device to pass certification tests the code must:

- Use the Azure IoT Plug and Play device SDK.
- Enable device provisioning through the Azure IoT Device Provisioning Service (DPS).
- Implement all the capabilities defined in the model.

If you use the code generation function in VS Code, your device code uses the Azure IoT Plug and Play device SDK.

To add the ability to use DPS, copy [this code](link) to the ***** file in the generated code:
<Image to be added>

Finally, you must implement the **Device Information** interface on your device and provide device-specific information from the device at run time. You can use example implementations of the **Device Information** interface for [Windows IoT Core](link) and [Linux](link) as references.

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to [certify your device](link) and list it in the Certified for Azure IoT device catalog.
