<properties
 pageTitle="Get Azure tools (Mac OS X 10.10)"
 description="Install Azure Command-Line Interface (Azure CLI). You might need 10 minutes to complete this section."
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
- [Windows 7 +](iot-hub-raspberry-pi-node-lesson2-get-azure-tools-win32.md)
- [OS X 10.10](iot-hub-raspberry-pi-node-lesson2-get-azure-tools-mac.md)
- [Ubuntu 16.04](iot-hub-raspberry-pi-node-lesson2-get-azure-tools-ubuntu.md)

## 2.1.1 What you will do
Install Azure Command-Line Interface (Azure CLI). You might need 10 minutes to complete this section.

## 2.1.2 What you will learn
In this section, you will learn:
- How to install Azure CLI
- How to add IoT subgroup of Azure CLI

## 2.1.3 What you need
- A Mac with Internet connection
- An active Azure subscription. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/)

## 2.1.4 Install Python
Although Mac OS X comes with Python 2.7 out of the box, it is recommended to install Python through Homebrew. You can read more at [here](http://docs.python-guide.org/en/latest/starting/install/osx/).

Run following command to install Python and pip.

```bash
brew install python
```

## 2.1.5 Install the Azure Command-Line Interface (CLI)
The Azure CLI provides a multiplatform command line experience for Azure, enabling you to work directly from your command line to provision and manage resources. 

To install the latest Azure CLI, run the following commands in the your terminal window. It might take 5 minutes to install Azure CLI.

```bash
sudo pip install azure-cli
sudo pip install azure-cli-iot
```
Try below command to verify installation is successful.

```bash
az iot -h
```

You should see the following output if installation is successful.

![az iot -h](media/iot-hub-raspberry-pi-lessons/lesson2/az_iot_help_osx.png)

## 2.1.5 Summary
You have now installed Azure CLI. Continue to the next section to create your Azure IoT Hub and device identity using the Azure CLI. 

## Next Steps
[2.2 Create your Azure IoT Hub and the register your Raspberry Pi 3 device](iot-hub-raspberry-pi-node-lesson2-prepare_azure_iot_hub.md)
