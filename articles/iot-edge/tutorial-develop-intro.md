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

* You can use your own computer or a virtual machine, depending on your preference.
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


