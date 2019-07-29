---
title: Connect a Raspberry Pi to your Azure IoT Central application (Python) | Microsoft Docs
description: As a device developer, how to connect a Raspberry Pi to your Azure IoT Central application using Python.
author: dominicbetts
ms.author: dobett
ms.date: 04/05/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: timlt
---

# Connect a Raspberry Pi to your Azure IoT Central application (Python) (preview features)

[!INCLUDE [howto-raspberrypi-selector](../../includes/iot-central-howto-raspberrypi-selector.md)]

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

This article describes how, as a device developer, to connect a Raspberry Pi to your Microsoft Azure IoT Central application using the Python programming language.

## Before you begin

To complete the steps in this article, you need the following components:

* An Azure IoT Central application. For more information, see the [create an application quickstart](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
* A Raspberry Pi device running the Raspbian operating system. The Raspberry Pi must be able to connect to the internet. For more information, see [Setting up your Raspberry Pi](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/3).

> [!NOTE]
> This is a device sample for a device that is not IoT Plug and Play compliant. You will need to model the device template in IoT Central as outlined below. 

## Raspberry Pi Device template details

Begin by using a custom device template and modeling the device capability model to reflect the below:

### Telemetry measurements

| Field name     | Units  | Minimum | Maximum | Decimal places |
| -------------- | ------ | ------- | ------- | -------------- |
| humidity       | %      | 0       | 100     | 0              |
| temp           | °C     | -40     | 120     | 0              |
| pressure       | hPa    | 260     | 1260    | 0              |
| magnetometerX  | mgauss | -1000   | 1000    | 0              |
| magnetometerY  | mgauss | -1000   | 1000    | 0              |
| magnetometerZ  | mgauss | -1000   | 1000    | 0              |
| accelerometerX | mg     | -2000   | 2000    | 0              |
| accelerometerY | mg     | -2000   | 2000    | 0              |
| accelerometerZ | mg     | -2000   | 2000    | 0              |
| gyroscopeX     | mdps   | -2000   | 2000    | 0              |
| gyroscopeY     | mdps   | -2000   | 2000    | 0              |
| gyroscopeZ     | mdps   | -2000   | 2000    | 0              |

### Writeable properties

Numeric writeable properties

| Display name | Field name | Units | Decimal places | Minimum | Maximum | Initial |
| ------------ | ---------- | ----- | -------------- | ------- | ------- | ------- |
| Voltage      | setVoltage | Volts | 0              | 0       | 240     | 0       |
| Current      | setCurrent | Amps  | 0              | 0       | 100     | 0       |
| Fan Speed    | fanSpeed   | RPM   | 0              | 0       | 1000    | 0       |

Toggle writeable properties

| Display name | Field name | On text | Off text | Initial |
| ------------ | ---------- | ------- | -------- | ------- |
| IR           | activateIR | ON      | OFF      | Off     |

### Properties

| Type            | Display name | Field name | Data type |
| --------------- | ------------ | ---------- | --------- |
| Device property | Die number   | dieNumber  | number    |
| Text            | Location     | location   | N/A       |

## Add a real device

In your Azure IoT Central application, add a real device from the **Raspberry Pi** device template. Make a note of the device connection details (**Scope ID**, **Device ID**, and **Primary key**). For more information, see [Add a real device to your Azure IoT Central application](tutorial-add-device-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

### Configure the Raspberry Pi

The following steps describe how to download and configure the sample Python application from GitHub. This sample application:

* Sends telemetry and property values to Azure IoT Central.
* Responds to setting changes made in Azure IoT Central.

To configure the device, [follow the step-by-step instructions on GitHub](https://github.com/Azure/iot-central-firmware/blob/master/RaspberryPi/README.md).

1. When the device is configured, your device starts sending telemetry measurements to Azure IoT Central.
1. In your Azure IoT Central application, you can see how the code running on the Raspberry Pi interacts with the application with data flowing through to your views.

## Next steps

Now that you've learned how to connect a Raspberry Pi to your Azure IoT Central application, the suggested next step is to learn how to [set up a custom device template](howto-set-up-template-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) for your own IoT device.
