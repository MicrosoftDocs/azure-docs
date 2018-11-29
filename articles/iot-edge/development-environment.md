---
title: Azure IoT Edge development environment | Microsoft Docs 
description: Learn about the supported systems and first-party development tools that will help you create IoT Edge modules
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 12/05/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Prepare your development and test environment for IoT Edge

Azure IoT Edge moves your existing business logic to devices operating at the edge. To prepare your applications and workloads to run as IoT Edge modules, you need to build them as containers. This article provides guidance around how to configure your development environment so that you can successfully create an IoT Edge solution. 

In any IoT Edge solution, there are at least two machines to consider. One is the IoT Edge device (or devices) itself, which runs the IoT Edge module. The other is the development machine that you use to build, test, and deploy modules. This article focuses primarily on the development machine. For testing purposes, the two machines can be the same. You can run IoT Edge on your development machine and deploy modules to it. However, for simplicity, this article always refers to them as two separate machines. 

## Operating system

You can use whatever operating system that you like to develop IoT Edge modules. The only requirement is that your development machine can run a container engine so that you can build your modules as containers and push them to a container registry. 

IoT Edge devices support Linux- and Windows-based containers. For a complete list of operating systems that can run IoT Edge, see [Azure IoT Edge support](support.md). 

The operating system of your development machine doesn't have to match the operating system of your IoT Edge device. For example, you can develop modules on a Windows machine and deploy them to a Raspberry Pi. However, the container operating system must be consistent between development machine and IoT Edge device. Using the same example, the Windows machine needs to run Linux containers in order to build the modules for the Raspberry Pi deployment. 

## Container engine

The central concept of IoT Edge is that you can remotely deploy your business and cloud logic to devices by packaging it into containers. To build containers, you need a container engine on your development machine. 

The only supported container engine for IoT Edge devices in production is moby-engine. Microsoft provides servicing for solutions based on moby-engine. However, any container engine compatible with the Open Container Initiative, like Docker, is sufficient to develop IoT Edge modules. 

If you're using a Windows machine to develop modules, you may need to enable virtualization. You can check the status of virtualization on your machine in the Task Manager. Within the Performance tab, there's a parameter called Virtualization that will be disabled or enabled. Virtualization is enabled in BIOS on Windows machines, so search for instructions from your hardware manufacturer. 

## Development tools

Both Visual Studio and Visual Studio Code have add-on extensions to help develop IoT Edge solutions. These extensions provide language-specific templates to help create new IoT Edge modules and deployment manifests, as well as debugging functionality. 

The Azure IoT Edge extensions for Visual Studio and Visual Studio Code help you code, build, deploy, and debug your IoT Edge solutions. 

You can compose an entire IoT Edge solution by adding multiple modules, and the extension automatically updates a deployment manifest template to help you prepare for deployment. You can edit, build, run, and debug IoT Edge modules locally on your machines In coordination with the Azure IoT 


### Visual Studio Code

The Azure IoT Edge extension for Visual Studio Code helps you code, build, deploy, and debug your IoT Edge solutions. The extension provides IoT Edge solution templates built on programming languages including C, C#, Java, Node.js, and Python. It also has templates for solutions built on Azure Functions, Azure Stream Analytics, or existing modules from any container registry. 

You can compose an entire IoT Edge solution by adding multiple modules, and the extension automatically updates a deployment manifest template to help you prepare for deployment. When you're ready to turn your code into a module In coordination with the Azure IoT 

For more information and to download, see:
* [Azure IoT Edge Tools for Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vsiotedgetools)
* [Azure IoT Edge for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge)

In addition to the IoT Edge extensions, you may find it helpful to install additional extensions for developing. For example, you can use [Docker Support for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) to manage your images, containers, and registries. Additionally, all the major supported languages have extensions for Visual Studio Code that can help when you're developing modules. 

### Prerequisites

Depending on which language you intend to use in your module development, you may have different prerequisites for using the IoT Edge extensions for Visual Studio and Visual Studio Code. 

## Testing tools

## DevOps tools

When you're ready to develop at-scale solutions for extensive production scenarios, take advantage of modern DevOps principles including automation, monitoring, and streamlined software engineering processes. IoT Edge supports DevOps tools including Azure DevOps and Jenkins. 

For more information, guidance, and examples, see the following pages:
* [Continuous integration and continuous deployment to Azure IoT Edge](how-to-ci-cd.md)
* [Azure IoT Edge Jenkins plugin](https://plugins.jenkins.io/azure-iot-edge)
* [IoT Edge DevOps GitHub repo](https://github.com/toolboc/IoTEdge-DevOps)
