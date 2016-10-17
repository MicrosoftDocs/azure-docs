<properties
 pageTitle="Get Azure tools (Windows 7 +) | Microsoft Azure"
 description="Install Python and Azure Command-Line Interface (Azure CLI) on Windows 7 and later versions."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# 2.1 Get Azure tools (Windows 7 +)

> [AZURE.SELECTOR]
- [Windows 7 +](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-ubuntu.md)
- [OS X 10.10](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-mac.md)

## 2.1.1 What will you do

Install Python and the Azure Command-Line Interface (Azure CLI).

## 2.1.2 What will you learn

- How to install Python.
- How to install Azure CLI.

## 2.1.3 What do you need

- A Windows computer with Internet connection
- An active Azure subscription. If you don't have an Azure account, create a free Azure trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/)

## 2.1.4 Install Python

Install Python on your Windows computer. You can install Python 2.7, 3.4 or 3.5. This tutorial is based on Python 2.7. If you've already installed Python, go to section 2.1.5.

[Get Python for Windows](https://www.python.org/downloads/)

You also need to add the path of the folders where python.exe and pip.exe are installed to the system `PATH` environment variable. By default, python.exe is installed in `C:\Python27` and pip.exe is installed in `C:\Python27\Scripts`.

## 2.1.5 Install the Azure CLI

The Azure CLI provides a multiplatform command line experience for Azure, enabling you to work directly from your command line to provision and manage resources.

To install Azure CLI, follow these steps:

1. Open a command prompt window as an administrator.
2. Run the following commands:

  ```bash
  pip install --upgrade azure-cli
  pip install --upgrade azure-cli-iot
  ```
3. Verify the installation by running the following command:

  ```bash
  az iot -h
  ```

You see the following output if the installation is successful.

![az iot -h](media/iot-hub-raspberry-pi-lessons/lesson2/az_iot_help_win.png)

## 2.1.6 Summary

You've installed Azure CLI. Continue to the next section to create your Azure IoT Hub and device identity using the Azure CLI.

## Next Steps

[2.2 Create your Azure IoT Hub and the register your Raspberry Pi 3 device](iot-hub-raspberrypikit-node-lesson2-prepare-azure-iot-hub.md)
