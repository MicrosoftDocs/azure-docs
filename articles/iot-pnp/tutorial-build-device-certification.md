---
title: Build an Azure IoT Plug and Play device that's ready for certification | Microsoft Docs
description: As a device developer, learn about how you can build a Plug and Play device that's ready for certification.
author: tbhagwat3
ms.author: tanmayb
ms.date: 06/21/2019
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
- Your device code implements the **Device Information**, **Model Information**, and **SDK Information** interfaces.
- The device code implements all the capabilities defined in the model.
- The device can be provisioned to an IoT hub using the Azure IoT Device Provisioning Service.

## Prerequisites

To complete this tutorial, you need:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure IoT Workbench extension for VS Code](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/VSCode/README.md#installation)
- Create a Plug and Play device by followin the intructions in [this quickstart](quickstart-create-pnp-device.md).

## Include standard interfaces

To pass the certification process, you must include the **Device Information** interface in your capability model. This interface has the following identification:

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

1. Enter **Plug and Play** and then select the **Azure IoT Plug and Play: Open Model Repository** command. Choose **Global Model Repository**. The global model repository opens in VS Code:

1. In the global model repository, enter **Device Information** in the search field.

1. To create a local copy of the **Device Information** interface, select it in the search results, and then select **Download**:

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

During certification, your device will be tested programmatically to ensure it implements capabilities claimed its interfaces. Use http status code 501 to respond to read-write Properties and Command requests if your device does not implement them. 

## Next steps

Now that you've built an IoT Plug and Play device ready for certification, learn how to [certify your device](tutorial-certification-product.md) and list it in the Certified for Azure IoT device catalog.
