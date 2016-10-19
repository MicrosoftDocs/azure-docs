<properties
 pageTitle="Get Azure tools (Mac OS X 10.10) | Microsoft Azure"
 description="Install Python and Azure Command-Line Interface (Azure CLI) on Mac OS X."
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

# 2.1 Get Azure tools (Mac OS X 10.10)

> [AZURE.SELECTOR]
- [Windows 7 +](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-ubuntu.md)
- [OS X 10.10](iot-hub-raspberrypikit-node-lesson2-get-azure-tools-mac.md)

## 2.1.1 What you will do

Install the Azure Command-Line Interface (Azure CLI).

## 2.1.2 What you will learn

- How to install Azure CLI.
- How to add the IoT subgroup of Azure CLI.

## 2.1.3 What you need

- A Mac with Internet connection
- An active Azure subscription. If you don't have an Azure account, create a free Azure trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/)

## 2.1.4 Install Python

Although Mac OS X comes with Python 2.7 out of the box, it is recommended to install Python through Homebrew. See [Installing Python on Mac OS X](http://docs.python-guide.org/en/latest/starting/install/osx/).

Install Python and pip by running the following command:

```bash
brew install python
```

## 2.1.5 Install the Azure CLI

The Azure CLI provides a multiplatform command line experience for Azure, enabling you to work directly from your command line to provision and manage resources. 

To install the latest Azure CLI, follow these steps:

1. Run the following commands in a Terminal window. It might take 5 minutes to install Azure CLI.

  ```bash
  pip install --upgrade azure-cli
  pip install --upgrade azure-cli-iot
  ```

2. Verify installation by running the following command:

  ```bash
  az iot -h
  ```
  
You should see the following output if the installation is successful.

![az iot -h](media/iot-hub-raspberry-pi-lessons/lesson2/az_iot_help_osx.png)

## 2.1.5 Summary

You've installed Azure CLI. Continue to the next section to create your Azure IoT Hub and device identity using the Azure CLI.

## Next Steps

[2.2 Create your Azure IoT Hub and the register your Raspberry Pi 3 device](iot-hub-raspberrypikit-node-lesson2-prepare-azure-iot-hub.md)
