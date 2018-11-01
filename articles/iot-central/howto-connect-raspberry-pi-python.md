---
title: Connnect a Raspberry Pi to your Azure IoT Central application (Python) | Microsoft Docs
description: As an device developer, how to connect a Raspberry Pi to your Azure IoT Central application using Python.
author: dominicbetts
ms.author: dobett
ms.date: 01/23/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: timlt
---

# Connect a Raspberry Pi to your Azure IoT Central application (Python)

[!INCLUDE [howto-raspberrypi-selector](../../includes/iot-central-howto-raspberrypi-selector.md)]

This article describes how, as a device developer, to connect a Raspberry Pi to your Microsoft Azure IoT Central application using the Python programming language.

## Before you begin

To complete the steps in this article, you need the following:

* An Azure IoT Central application created from the **Sample Devkits** application template. For more information, see [Create your Azure IoT Central Application](howto-create-application.md).
* A Raspberry Pi device running the Raspbian operating system. You need a monitor, keyboard, and mouse connected to your Raspberry Pi to access the GUI environment. The Raspberry Pi must be able to [connect to the internet](https://www.raspberrypi.org/learning/software-guide/wifi/).
* Optionally, a [Sense Hat](https://www.raspberrypi.org/products/sense-hat/) add-on board for the Raspberry Pi. This board collects telemetry data from various sensors to send to your Azure IoT Central application. If you don't have a **Sense Hat** board, you can use an emulator instead (available as part of Raspberry Pi image).

## **Sample Devkits** application

An application created from the **Sample Devkits** application template includes a **Raspberry Pi** device template with the following characteristics: 

- Telemetry which contains the measurements for the device **Humidity**, **Temperature**, **Pressure**, **Magnometer** (measured along X, Y, Z axis), **Accelorometer** (measured along X, Y, Z axis), and **Gyroscope** (measured along X, Y, Z axis).
- Settings showing **Voltage**, **Current**,**Fan Speed** and an **IR** toggle.
- Properties containing device property **die number** and **location** cloud property.


For full details on the configuration of the device template refer to [Raspberry PI Device template details](howto-connect-raspberry-pi-python.md#raspberry-pi-device-template-details)
    

## Add a real device

In your Azure IoT Central application, add a real device from the **Raspberry Pi** device template and make a note of the device connection details(**Scope ID, Device ID, Primary key**). For more information, see [Add a real device to your Azure IoT Central application](tutorial-add-device.md).


### Configure the Raspberry Pi

The following steps describe how to download and configure the sample Python application from GitHub. This sample application:

* Sends telemetry and property values to Azure IoT Central.
* Responds to setting changes made in Azure IoT Central.

To configure the device [follow the step-by-step instructions on GitHub.](http://aka.ms/iotcentral-docs-Raspi-releases)


> [!NOTE]
> For more information about the Raspberry Pi Python sample, see the [Readme](http://aka.ms/iotcentral-docs-Raspi-releases) file on GitHub.


1. Once the device is configured, your device should start sending data to Azure IoT Central momentarily.
1. In your Azure IoT Central application, you see how the code running on the Raspberry Pi interacts with the application:

    * On the **Measurements** page for your real device, you can see the telemetry sent from the Raspberry Pi. If you are using the **Sense HAT Emulator**, you can modify the telemetry values in the GUI on the Raspberry Pi.
    * On the **Properties** page, you can see the value of the reported **Die Number** property.
    * On the **Settings** page, you can change various settings on the Raspberry Pi such as voltage and fan speed. When the Raspberry Pi acknowledges the change, the setting shows as **synced** in Azure IoT Central.


## Raspberry PI Device template details

An application created from the **Sample Devkits** application template includes a **Raspberry Pi** device template with the following characteristics:

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

### Settings

Numeric settings

| Display name | Field name | Units | Decimal places | Minimum | Maximum | Initial |
| ------------ | ---------- | ----- | -------------- | ------- | ------- | ------- |
| Voltage      | setVoltage | Volts | 0              | 0       | 240     | 0       |
| Current      | setCurrent | Amps  | 0              | 0       | 100     | 0       |
| Fan Speed    | fanSpeed   | RPM   | 0              | 0       | 1000    | 0       |

Toggle settings

| Display name | Field name | On text | Off text | Initial |
| ------------ | ---------- | ------- | -------- | ------- |
| IR           | activateIR | ON      | OFF      | Off     |

### Properties

| Type            | Display name | Field name | Data type |
| --------------- | ------------ | ---------- | --------- |
| Device property | Die number   | dieNumber  | number    |
| Text            | Location     | location   | N/A       |

## Next steps

Now that you have learned how to connect a Raspberry Pi to your Azure IoT Central application, here are the suggested next steps:

* [Connect a generic Node.js client application to Azure IoT Central](howto-connect-nodejs.md)
