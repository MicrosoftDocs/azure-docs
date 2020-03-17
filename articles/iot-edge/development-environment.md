---
title: Azure IoT Edge development environment | Microsoft Docs 
description: Learn about the supported systems and first-party development tools that will help you create IoT Edge modules
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 01/04/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Prepare your development and test environment for IoT Edge

Azure IoT Edge moves your existing business logic to devices operating at the edge. To prepare your applications and workloads to run as [IoT Edge modules](iot-edge-modules.md), you need to build them as containers. This article provides guidance around how to configure your development environment so that you can successfully create an IoT Edge solution. Once you have your development environment set up, then you can learn how to [Develop your own IoT Edge modules](module-development.md).

In any IoT Edge solution, there are at least two machines to consider. One is the IoT Edge device (or devices) itself, which runs the IoT Edge module. The other is the development machine that you use to build, test, and deploy modules. This article focuses primarily on the development machine. For testing purposes, the two machines can be the same. You can run IoT Edge on your development machine and deploy modules to it.

## Operating system

Azure IoT Edge runs on a specific set of [supported operating systems](support.md). For developing for IoT Edge, you can use most operating systems that can run a container engine. The container engine is a requirement on the development machine to build your modules as containers and push them to a container registry.

If your development machine can't run Azure IoT Edge, continue in this article to learn about [testing tools](#testing-tools) that help you test and debug locally.

The operating system of your development machine doesn't have to match the operating system of your IoT Edge device. However, the container operating system must be consistent between development machine and IoT Edge device. For example, you can develop modules on a Windows machine and deploy them to a Linux device. The Windows machine needs to run Linux containers to build the modules for the Linux device.

## Container engine

The central concept of IoT Edge is that you can remotely deploy your business and cloud logic to devices by packaging it into containers. To build containers, you need a container engine on your development machine.

The only supported container engine for IoT Edge devices in production is Moby. However, any container engine compatible with the Open Container Initiative, like Docker, is capable of building IoT Edge module images.

## Development tools

Both Visual Studio and Visual Studio Code have add-on extensions to help develop IoT Edge solutions. These extensions provide language-specific templates to help create and deploy new IoT Edge scenarios. The Azure IoT Edge extensions for Visual Studio and Visual Studio Code help you code, build, deploy, and debug your IoT Edge solutions. You can create an entire IoT Edge solution that contains multiple modules, and the extensions automatically update a deployment manifest template with each new module addition. With the extensions, you can also manage your IoT devices from within Visual Studio or Visual Studio Code. Deploy modules to a device, monitor the status, and view messages as they arrive at IoT Hub. Both extensions use the [IoT EdgeHub dev tool](#iot-edgehub-dev-tool) to enable local running and debugging of modules on your development machine as well.

If you prefer to develop with other editors or from the CLI, the Azure IoT Edge dev tool provides commands so that you can develop and test from the command line. You can create new IoT Edge scenarios, build module images, run modules in a simulator, and monitor messages sent to IoT Hub.

### Visual Studio Code extension

The Azure IoT Edge extension for Visual Studio Code provides IoT Edge module templates built on programming languages including C, C#, Java, Node.js, and Python as well as Azure functions in C#.

For more information and to download, see [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).

In addition to the IoT Edge extensions, you may find it helpful to install additional extensions for developing. For example, you can use [Docker Support for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) to manage your images, containers, and registries. Additionally, all the major supported languages have extensions for Visual Studio Code that can help when you're developing modules.

#### Prerequisites

The module templates for some languages and services have prerequisites that are necessary to build the project folders on your development machine with Visual Studio Code.

| Module template | Prerequisite |
| --------------- | ------------ |
| Azure Functions | [.NET Core 2.1 SDK](https://www.microsoft.com/net/download) |
| C | [Git](https://git-scm.com/) |
| C# | [.NET Core 2.1 SDK](https://www.microsoft.com/net/download) |
| Java | <ul><li>[Java SE Development Kit 10](https://aka.ms/azure-jdks) <li> [Set the JAVA_HOME environment variable](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) <li> [Maven](https://maven.apache.org/)</ul> |
| Node.js | <ul><li>[Node.js](https://nodejs.org/) <li> [Yeoman](https://www.npmjs.com/package/yo) <li> [Azure IoT Edge Node.js module generator](https://www.npmjs.com/package/generator-azure-iot-edge-module)</ul> |
| Python |<ul><li> [Python](https://www.python.org/downloads/) <li> [Pip](https://pip.pypa.io/en/stable/installing/#installation) <li> [Git](https://git-scm.com/) </ul> |

### Visual Studio 2017/2019 extension

The Azure IoT Edge tools for Visual Studio provide an IoT Edge module template built on C# and C.

For more information and to download, see [Azure IoT Edge Tools for Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vsiotedgetools) or [Azure IoT Edge Tools for Visual Studio 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools).

### IoT Edge dev tool

The Azure IoT Edge dev tool simplifies IoT Edge development with command-line abilities. This tool provides CLI commands to develop, debug, and test modules. The IoT Edge dev tool works with your development system, whether you've manually installed the dependencies on your machine or are using the IoT Edge dev container.

For more information and to get started, see [IoT Edge dev tool wiki](https://github.com/Azure/iotedgedev/wiki).

## Testing tools

Several testing tools exist to help you simulate IoT Edge devices or debug modules more efficiently. The following table shows a high-level comparison between the tools, and then individual sections describe each tool more specifically.

Only the IoT Edge runtime is supported for production deployments, but the following tools allow you to simulate or easily create IoT Edge devices for development and testing purposes. These tools aren't mutually exclusive, but can work together for a complete development experience.

| Tool | Also known as | Supported platforms | Best for |
| ---- | ------------- | ------------------- | --------- |
| IoT EdgeHub dev tool  | iotedgehubdev | Windows, Linux, MacOS | Simulating a device to debug modules. |
| IoT Edge dev container | microsoft/iotedgedev | Windows, Linux, MacOS | Developing without installing dependencies. |
| IoT Edge runtime in a container | iotedgec | Windows, Linux, MacOS, ARM | Testing on a device that may not support the runtime. |
| IoT Edge device container | toolboc/azure-iot-edge-device-container | Windows, Linux, MacOS, ARM | Testing a scenario with many IoT Edge devices at scale. |

### IoT EdgeHub dev tool

The Azure IoT EdgeHub dev tool provides a local development and debug experience. The tool helps start IoT Edge modules without the IoT Edge runtime so that you can create, develop, test, run, and debug IoT Edge modules and solutions locally. You don't have to push images to a container registry and deploy them to a device for testing.

The IoT EdgeHub dev tool was designed to work in tandem with the Visual Studio and Visual Studio Code extensions, as well as with the IoT Edge dev tool. It supports inner loop development as well as outer loop testing, so integrates with the DevOps tools too.

For more information and to install, see [Azure IoT EdgeHub dev tool](https://pypi.org/project/iotedgehubdev/).

### IoT Edge dev container

The Azure IoT Edge dev container is a Docker container that has all the dependencies that you need for IoT Edge development. This container makes it easy to get started with whichever language you want to develop in, including C#, Python, Node.js, and Java. All you need to install is a container engine, like Docker or Moby, to pull the container to your development machine.

For more information, see [Azure IoT Edge dev container](https://hub.docker.com/r/microsoft/iotedgedev/).

### IoT Edge runtime in a container

The IoT Edge runtime in a container provides a complete runtime that takes your device connection string as an environment variable. This container enables you to test IoT Edge modules and scenarios on a system that may not support the runtime natively, like MacOS. Any modules that you deploy will be started outside of the runtime container. If you want the runtime and any deployed modules to exist within the same container, consider the IoT Edge device container instead.

For more information, see [Running Azure IoT Edge in a container](https://github.com/Azure/iotedgedev/tree/master/docker/runtime).

### IoT Edge device container

The IoT Edge device container is a complete IoT Edge device, ready to be launched on any machine with a container engine. The device container includes the IoT Edge runtime and a container engine itself. Each instance of the container is a fully functional self-provisioning IoT Edge device. The device container supports remote debugging of modules, as long as there is a network route to the module. The device container is good for quickly creating large numbers of IoT Edge devices to test at-scale scenarios or Azure Pipelines. It also supports deployment to kubernetes via helm.

For more information, see [Azure IoT Edge device container](https://github.com/toolboc/azure-iot-edge-device-container).

## DevOps tools

When you're ready to develop at-scale solutions for extensive production scenarios, take advantage of modern DevOps principles including automation, monitoring, and streamlined software engineering processes. IoT Edge has extensions to support DevOps tools including Azure DevOps, Azure DevOps Projects, and Jenkins. If you want to customize an existing pipeline or use a different DevOps tool like CircleCI or TravisCI, you can do so with the CLI features included in the IoT Edge dev tool.

For more information, guidance, and examples, see the following pages:

* [Continuous integration and continuous deployment to Azure IoT Edge](how-to-ci-cd.md)
* [Create a CI/CD pipeline for IoT Edge with Azure DevOps Projects](how-to-devops-project.md)
* [Azure IoT Edge Jenkins plugin](https://plugins.jenkins.io/azure-iot-edge)
* [IoT Edge DevOps GitHub repo](https://github.com/toolboc/IoTEdge-DevOps)
