---
title: 'Connect Intel Edison (Node) to Azure IoT - Lesson 2: Azure tools (macOS) | Microsoft Docs'
description: Install Python and Azure command-line interface (Azure CLI) on macOS.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'azure cli, iot cloud service, arduino cloud'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-intel-edison-kit-node-get-started

ms.assetid: 8a2a8031-b1a6-4219-b17d-2825550c35e1
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Get Azure tools (macOS 10.10)
> [!div class="op_single_selector"]
> * [Windows 7 and later][windows]
> * [Ubuntu 16.04][ubuntu]
> * [macOS 10.10][macos]

## What you will do
Install the Azure command-line interface (Azure CLI). If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will learn
In this article, you will learn:
* How to install Azure CLI.
* How to add an IoT subgroup of the Azure CLI.

## What you need
* A Mac with an Internet connection.
* An active Azure subscription. If you don't have an Azure account, you can create a [free Azure trial account](http://azure.microsoft.com/pricing/free-trial/) in just a few minutes.

## Install Python
Although macOS comes with Python 2.7 out of the box, we recommend that you install Python through Homebrew. See [Installing Python on macOS](http://docs.python-guide.org/en/latest/starting/install/osx/).

Install Python and pip by running the following command:

```bash
brew install python
```

## Install the Azure CLI
The Azure CLI provides a multiplatform command-line experience for Azure. You work directly from your command line to provision and manage resources. 

To install the latest Azure CLI, follow these steps:

1. Run the following commands in a terminal window. It might take five minutes to install the Azure CLI.

   ```bash
   pip install --upgrade azure-cli
   pip install --upgrade azure-cli-iot
   ```
2. Verify the installation by running the following command:

   ```bash
   az iot -h
   ```

You should see the following output if the installation is successful.

![Output that indicates success](media/iot-hub-intel-edison-lessons/lesson2/az_iot_help_osx.png)

## Summary
You've installed the Azure CLI. Your next task is to create your Azure IoT hub and device identity by using the Azure CLI.

## Next steps
[Create your IoT hub and register Intel Edison][create-your-iot-hub-and-register-intel-edison]
<!-- Images and links -->

[troubleshooting]: iot-hub-intel-edison-kit-node-troubleshooting.md
[create-your-iot-hub-and-register-intel-edison]: iot-hub-intel-edison-kit-node-lesson2-prepare-azure-iot-hub.md
[windows]: iot-hub-intel-edison-kit-node-lesson2-get-azure-tools-win32.md
[ubuntu]: iot-hub-intel-edison-kit-node-lesson2-get-azure-tools-ubuntu.md
[macos]: iot-hub-intel-edison-kit-node-lesson2-get-azure-tools-mac.md
