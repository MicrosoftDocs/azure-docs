---
title: Develop your first module - Azure IoT Edge | Microsoft Docs
description: This tutorial walks through the process of setting up your development machine and cloud resources to develop IoT Edge modules
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 03/26/2019
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Develop an IoT Edge module

In the quickstart articles, you created an IoT Edge device and deployed a pre-built module from the Azure Marketplace. This tutorial walks through what it takes to develop and deploy your own code to an IoT Edge device. This tutorial is a useful prerequisite for all the other tutorials, which will go into more detail about specific programming languages or Azure services. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your development machine.
> * Use the IoT Edge tools for Visual Studio Code to create a new project.
> * Build your project as a container and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device. 


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

A development machine:

* You can use your own computer or a virtual machine, depending on your development preferences.
* Most operating systems that can run a container engine can be used for IoT Edge development. This tutorial uses a Windows computer, but points out known differences on MacOS or Linux. 

An Azure IoT Edge device:

* We strongly recommend that you don't run IoT Edge on your development machine, but instead use a separate device. This distinction between development machine and IoT Edge device more accurately mirrors a true deployment scenario, and helps to keep the different concepts straight.
* If you don't have a second device available, use the quickstart articles to create an IoT Edge device in Azure with either a [Linux virtual machine](quickstart-linux.md) or a [Windows virtual machine](quickstart.md). This tutorial uses a Linux IoT Edge device, but points out differences for Windows devices. 

Cloud resources:

* Along with your working IoT Edge device, you should also have a free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure. 

## Key concepts

This tutorial walks through the development of an IoT Edge module. An *IoT Edge module*, or sometimes just *module* for short, is a container that contains executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, performing data analytics or data cleaning operations, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

When developing IoT Edge modules, it's important to understand the difference between the development machine and the target IoT Edge device where the module will eventually be deployed. The container that you build to hold your module code must match the operating system (OS) of the target device. For example, the most common scenario is someone developing a module on a Windows computer intending to target a Linux IoT Edge device. In that case, the container operating system would be Linux. This tutorial demonstrates that scenario and tries to explicitly call out when a step applies to the *development machine OS* or the *container OS*.

## Install container engine

IoT Edge modules are packaged as containers, so you need a container engine on your development machine to build and manage the containers. We recommend using Docker Desktop for development because of its many features and popularity as a container engine. With Docker Desktop on a Windows device, you can switch between Linux containers and Windows containers so that you can easily develop modules for different types of IoT Edge devices. 

Use the Docker documentation to install on your development machine: 

* [Install Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)

  * When you install Docker Desktop for Windows, you're asked whether you want to use Linux or Windows containers. This decision can be changed at any time using an easy switch. For this tutorial, we assume Linux containers. For more information, see [Switch between Windows and Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

* [Install Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)

* Read [About Docker CE](https://docs.docker.com/install/) for installation information on several Linux platforms

## Install VS Code and tools

If you're familiar with container development, you can use your preferred editors and tools to develop IoT Edge modules. If not, we recommend using the IoT extensions for Visual Studio Code or Visual Studio 2017 that were built specifically to assist with IoT Edge development. These extensions provide project templates, automate the creation of the deployment manifest, and allow you to monitor and manage IoT Edge devices. 

Visual Studio 2017 currently supports the following development options:
* Languages: C and C#
* Device architecture: AMD64

Visual Studio Code currently supports the following development options:
* Languages: C, C#, Java, Node.js, and Python
* Device architecture: AMD64, ARM32v7
* Cloud services: Azure Functions (C#), Azure Machine Learning, Azure Stream Analytics, Azure Marketplace

This tutorial uses Visual Studio Code for development, because it covers more scenarios. If you prefer to use Visual Studio 2017, you can learn more about it in [Use Visual Studio 2017 to develop and debug modules](how-to-visual-studio-develop-csharp-module.md).

1. Install [Visual Studio Code](https://code.visualstudio.com/) on your development machine. 

2. Once the installation is finished, select **View** > **Extensions**. 

3. Search for **Azure IoT Tools**, which is actually a collection of extensions that help you interact with IoT Hub and IoT devices, as well as developing IoT Edge modules. 

4. Select **Install**. 