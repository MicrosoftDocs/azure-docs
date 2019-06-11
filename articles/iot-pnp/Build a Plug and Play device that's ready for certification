---
title: Build a Plug and Play device that's ready for certification | Microsoft Docs
description: As a device developer, learn about how you can build a Plug an Play device that's ready for certification.
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

This article describes how, as a device developer, you can build a Plug and Play device that's ready for certification.

## Before you begin

Before getting started:

1. Read about {IoT Plug and Play](link) to understand how you can express your device's capabilities in the Digital Twin Definition Language.
1. Install Visual Studio Code and the Azure IoT Workbench extension. [Learn more](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation).

## Model your device with the Digital Twin Definition Language
To get started, launch Visual Studio Code and close any open project folders.

Follow these steps to get started with modelling you device:
1. In VS Code press `F1` to launch the VS Code command palette.
<Image to be added>
1. Type **Plug and Play** and then select the **Azure IoT Plug & Play: Create Capability Model** command.
<Image to be added>
1. Provide a name for your capability model file and then press `Enter`. A default interface file will be created.
1. Copy the contents from [here](Github link) into the file you just created.

You now have an example model for your device. Edit it to make it your own.

### Include standard interfaces
The next step is including interfaces that are required for certification.

For your device to pass certification tests, the model for your device in the Digital Twin Definition Language must include the DeviceInformaation interface with the id:
```json
   "@id": "http://azureiot.com/interfaces/DeviceInformation/1.0.0"
```

To include the Device Information interface in your device's model, add the interface id to the "implements" property of the capability model.
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

You can obtain the DeviceInformation interface to read it and understand more by following these steps:
1. In VS Code press `F1` to launch the VS Code command palette.
<Image to be added>
1. Type **Plug and Play** and then select the **Azure IoT Plug and Play: Open Model Repository** command. Choose the Global Model Repository option. This will open the Global Model Repository in VS Code.
<Image to be added>
1. In the Global Model Repository, type **Device Information** in the search field.
<Image to be added>
1. Select the Device Information interface from the search results and click the download button to get a copy.
<Image to be added>

## Generate code for your device's interfaces
Now that you've modelled your device appropriately in the Digital Twin Definition Language, generate device code for it in Visual Studio Code. [Learn more](link).

Follow these steps to do so: 
1. Press `F1` to launch the VS Code command palette.
<Image to be added>
1. Type in **Plug and Play** and then select the **Azure IoT Plug & Play:Generate Device Code Stub**.
<Image to be added>
1. When prompted for a capability model, select your capability model file. 
<Image to be added>
1. When prompted a language, select ANSI C.
<Image to be added>
1. When prompted a platform, select General platform. 
<Image to be added>
1. Select the folder where you would like the C files to be outputed to.
<Image to be added>

After you generate device code you will get the following files:
<File structure is in the works>

## Update the generated code to make your device ready for certification
For your device to pass certification tests it must: 
1. Use the Azure IoT Plug and Play device SDK
1. Be capable of provisioning through the Azure IoT Device Provisioning Service.
1. Implement all the capabilities it claims in it's model.

By using the Code generation function in VS Code, your device code is already based on the Azure IoT Plug and Play device SDK. [Learn more](link) to use other SDK functionality for the rest of your device code.

Copy [this code](link) to the ***** file in the generated code to enable your device to be provisioned with the Device Provisioning Service.
<Image to be added>

Finally, you will need to implement the Device Information interface on your device and provide device specific information from the device at run time. You can use example implementations of the Device Information interface for [Windows IoT Core](link) and [Linux](link) as references.

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how you can [certify your device](link) and list it in the Certified for Azure IoT device catalog.
