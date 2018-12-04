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

You can create an entire IoT Edge solution that contains multiple coordinating modules, and the extensions automatically update a deployment manifest template with each new module addition. You can edit, build, run, and debug IoT Edge modules locally on your machines. With the extensions, you can also manage your IoT devices from within Visual Studio or Visual Studio Code. Deploy modules to a device, monitor the status, and view messages as they arrive at IoT Hub. 


### Visual Studio Code

The Azure IoT Edge extension for Visual Studio Code provides IoT Edge module templates built on programming languages including C, C#, Java, Node.js, and Python. It also has templates for modules built on Azure Functions and Azure Stream Analytics. 

For more information and to download, see [Azure IoT Edge for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge).

In addition to the IoT Edge extensions, you may find it helpful to install additional extensions for developing. For example, you can use [Docker Support for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) to manage your images, containers, and registries. Additionally, all the major supported languages have extensions for Visual Studio Code that can help when you're developing modules. 

#### Prerequisites

The module templates for some languages and services have prerequisites that are necessary to build the project folders on your development machine.

| Module template | Prerequisite |
| --------------- | ------------ |
| Azure Functions | [.NET Core 2.1 SDK](https://www.microsoft.com/net/download) |
| C# | [.NET Core 2.1 SDK](https://www.microsoft.com/net/download) |
| Java | * [Java SE Development Kit 10](https://aka.ms/azure-jdks) <br> * [Set the JAVA_HOME environment variable](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) <br> * [Maven](https://maven.apache.org/) |
| Node.js | [Node.js](https://nodejs.org/) |
| Python | * [Python](https://www.python.org/downloads/) with [Pip](https://pip.pypa.io/en/stable/installing/#installation) <br> * [Cookiecutter](https://cookiecutter.readthedocs.io/en/latest/installation.html) <br> * [Git](https://git-scm.com/) |

### Visual Studio 2017

The Azure IoT Edge tools for Visual Studio provides an IoT Edge module template built on C#. 

For more information and to download, see [Azure IoT Edge Tools for Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vsiotedgetools).

### Prerequisites

Depending on which language you intend to use in your module development, you may have different prerequisites for using the IoT Edge extensions for Visual Studio and Visual Studio Code. 

## Testing tools

Several testing tools exist to help you simulate IoT Edge devices or debug modules more efficiently. The following table shows a high-level comparison between the tools, and then individual sections describe each tool more specifically. 

Only the IoT Edge runtime is supported for production deployments, but the following tools allow you to simulate or easily create IoT Edge devices for development and testing purposes. These tools aren't mutually exclusive, and work well together in a development experience. 

| Tool | Also known as | Supported platforms | Best for |
| ---- | ------------- | ------------------- | --------- |
| IoT EdgeHub dev tool  | iotedgehubdev | Windows, Linux, MacOS | Simulating a device to debug modules. |
| IoT Edge dev tool | iotedgedev | Windows, Linux, MacOS | Simplifying IoT Edge development with command line abilities. |
| IoT Edge dev container | microsoft/iotedgedev | Windows, Linux, MacOS | Developing without installing dependencies. |
| IoT Edge runtime in a container | iotedgec | Windows, Linux, MacOS, ARM | Testing on a device that may not support the runtime. |
| IoT Edge device container | toolboc/azure-iot-edge-device-container | Windows, Linux, MacOS, ARM | Testing a scenario with many IoT Edge devices at scale. |

### IoT EdgeHub dev tool

The Azure IoT EdgeHub dev tool provides a local development and debug experience. The tool helps start IoT Edge modules without the IoT Edge runtime so that you can create, develop, test, run, and debug IoT Edge modules and solutions locally. YOu don't have to push images to a container registry and deploy them to a device for testing.

The IoT EdgeHub dev tool was designed to work in tandem with the Visual Studio and Visual Studio Code extensions, as well as with the IoT Edge dev tool. It supports inner loop development as well as outer loop testing, so integrates with the DevOps tools too. 

For more information and to install, see [Azure IoT EdgeHub dev tool](https://pypi.org/project/iotedgehubdev/).

### IoT Edge dev tool

The Azure IoT Edge dev tool simplifies IoT Edge development with command line abilities. This tool provides CLI commands to develop, debug, and test modules. The IoT Edge dev tool works with your development system, whether you've manually installed the dependencies on your machine or are using the IoT Edge dev container. 

For more information and to get started, see [IoT Edge dev tool wiki](https://github.com/Azure/iotedgedev/wiki).

### IoT Edge dev container

The Azure IoT Edge dev container is a Docker container that has all the dependencies that you need for IoT Edge development. This container makes it easy to get started with whichever language you want to develop in, including C#, Python, Node.js, and Java. All you need to install is a container engine, like Docker or Moby, to pull the container to your development machine. 

For more information, see [Azure IoT Edge dev container](https://hub.docker.com/r/microsoft/iotedgedev/).

### IoT Edge runtime in a container

The IoT Edge runtime in a container provides a complete runtime that takes your device connection string as an environment variable. This container enables you to test IoT Edge modules and scenarios on a system that may not support the runtime natively, like MacOS. Any modules that you deploy will be started outside of the runtime container. If you want the runtime and any deployed modules to exist within the same container, consider the IoT Edge device container instead.

For more information, see [Running Azure IoT Edge in a container](https://github.com/Azure/iotedgedev/tree/master/docker/runtime).

### IoT Edge device container

The IoT Edge device container is a complete IoT Edge device, ready to be launched on any machine with a container engine. The device container includes the IoT Edge runtime and a container engine itself. Each instance of the container is a fully functional self-provisioning IoT Edge device. The device container supports remote debugging of modules, as long as there is a network route to the module. The device container is good for quickly creating large numbers of IoT Edge devices to test at-scale scenarios or DevOps pipelines. It also supports deployment to kubernetes via helm. 

For more information, see [Azure IoT Edge device container](https://github.com/toolboc/azure-iot-edge-device-container).

## DevOps tools

When you're ready to develop at-scale solutions for extensive production scenarios, take advantage of modern DevOps principles including automation, monitoring, and streamlined software engineering processes. IoT Edge supports DevOps tools including Azure DevOps and Jenkins. 

For more information, guidance, and examples, see the following pages:
* [Continuous integration and continuous deployment to Azure IoT Edge](how-to-ci-cd.md)
* [Azure IoT Edge Jenkins plugin](https://plugins.jenkins.io/azure-iot-edge)
* [IoT Edge DevOps GitHub repo](https://github.com/toolboc/IoTEdge-DevOps)
