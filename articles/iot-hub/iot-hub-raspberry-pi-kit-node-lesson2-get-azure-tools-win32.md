---
title: Get Azure tools (Windows 7 and later) | Microsoft Docs
description: Install Python and the Azure command-line interface (Azure CLI) on Windows 7 and later versions.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timlt
tags: ''
keywords: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/21/2016
ms.author: xshi

---
# Get Azure tools (Windows 7 and later)
> [!div class="op_single_selector"]
> * [Windows 7 and later](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-win32.md)
> * [Ubuntu 16.04](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-ubuntu.md)
> * [macOS 10.10](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-mac.md)
> 
> 

## What you will do
Install Python and the Azure command-line interface (Azure CLI). If you have any problems, seek solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn
* How to install Python
* How to install Azure CLI

## What you need
* A Windows computer with an Internet connection.
* An active Azure subscription. If you don't have an account, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

## Install Python
[Install Python](https://www.python.org/downloads/) on your Windows computer. You can install Python 2.7, 3.4, or 3.5. This tutorial is based on Python 2.7. If you've already installed Python, go to the next section and install Azure CLI.

You also need to add the path of the folders where python.exe and pip.exe are installed to the system `PATH` environment variable. By default, python.exe is installed in `C:\Python27` and pip.exe is installed in `C:\Python27\Scripts`.

## Install Azure CLI
Azure CLI provides a multiplatform command-line experience for Azure. You work directly from your command line to provision and manage resources.

To install Azure CLI, follow these steps:

1. Open a Command Prompt window as an administrator.
2. Run the following commands:
   
    ```bash
    pip install azure-cli-core==0.1.0b7 azure-cli-vm==0.1.0b7 azure-cli-storage==0.1.0b7 azure-cli-role==0.1.0b7 azure-cli-resource==0.1.0b7 azure-cli-profile==0.1.0b7 azure-cli-network==0.1.0b7 azure-cli-iot==0.1.0b7 azure-cli-feedback==0.1.0b7 azure-cli-configure==0.1.0b7 azure-cli-component==0.1.0b7 azure-cli==0.1.0b7
    ```
3. Verify the installation by running the following command:
   
    ```bash
    az iot -h
    ```

You see the following output if the installation is successful.

![Output that indicates success](media/iot-hub-raspberry-pi-lessons/lesson2/az_iot_help_win.png)

## Summary
You've installed Azure CLI. Your next task is to create your Azure IoT hub and device identity by using Azure CLI.

## Next steps
[Create your IoT hub and register Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-lesson2-prepare-azure-iot-hub.md)

