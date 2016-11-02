<properties
 pageTitle="Get Azure tools (Ubuntu 16.04) | Microsoft Azure"
 description="Install Python and the Azure command-line interface (Azure CLI) on Ubuntu."
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
 ms.date="10/21/2016"
 ms.author="xshi"/>

# Get Azure tools (Ubuntu 16.04)

> [AZURE.SELECTOR]
- [Windows 7 and later](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-ubuntu.md)
- [macOS 10.10](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-mac.md)

## What you will do

Install the Azure command-line interface (Azure CLI). If you have any problems, seek solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn

- How to install Azure CLI
- How to add an IoT subgroup of Azure CLI

## What you need

- An Ubuntu computer with an Internet connection.
- An active Azure subscription. If you don't have an account, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

## Install Azure CLI

Azure CLI provides a multiplatform command-line experience for Azure. You work directly from your command line to provision and manage resources.

To install the latest Azure CLI, follow these steps:

1. Run the following commands in a terminal window. It might take five minutes to install Azure CLI.

    ```bash
    sudo apt-get update
    sudo apt-get install -y libssl-dev libffi-dev
    sudo apt-get install -y python-dev
    sudo apt-get install -y build-essential
    sudo apt-get install -y python-pip
    sudo pip install azure-cli-core==0.1.0b7 azure-cli-vm==0.1.0b7 azure-cli-storage==0.1.0b7 azure-cli-role==0.1.0b7 azure-cli-resource==0.1.0b7 azure-cli-profile==0.1.0b7 azure-cli-network==0.1.0b7 azure-cli-iot==0.1.0b7 azure-cli-feedback==0.1.0b7 azure-cli-configure==0.1.0b7 azure-cli-component==0.1.0b7 azure-cli==0.1.0b7
    ```

2. Verify the installation by running the following command:

    ```bash
    az iot -h
    ```

You should see the following output if the installation is successful.

![Output that indicates success](media/iot-hub-raspberry-pi-lessons/lesson2/az_iot_help_ubuntu.png)

## Summary

You've installed Azure CLI. Your next task is to create your Azure IoT hub and device identity by using Azure CLI.

## Next steps

[Create your IoT hub and register Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-lesson2-prepare-azure-iot-hub.md)
