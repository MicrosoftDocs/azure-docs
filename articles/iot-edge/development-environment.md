---
title: Azure IoT Edge development environment
description: Learn about the supported systems and first-party development tools that will help you create IoT Edge modules
author: PatAltimore

ms.author: patricka
ms.date: 07/10/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Prepare your development and test environment for IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

IoT Edge moves your existing business logic to devices operating at the edge. To prepare your applications and workloads to run as [IoT Edge modules](iot-edge-modules.md), you need to build them as containers. This article provides guidance around how to configure your development environment so that you can successfully create an IoT Edge solution. Once you have your development environment set up, you can learn how to [Develop your own IoT Edge modules](module-development.md).

In any IoT Edge solution, there are at least two machines to consider: the IoT Edge device (or devices) that runs the IoT Edge module, and the development machine that builds, tests, and deploys modules. This article focuses primarily on the development machine. For testing purposes, the two machines can be the same. You can run IoT Edge on your development machine and deploy modules to it.

## Operating system

IoT Edge runs on a specific set of [supported operating systems](support.md). When developing for IoT Edge, you can use most operating systems that can run a container engine. The container engine is a requirement on the development machine to build your modules as containers and push them to a container registry.

If your development machine can't run IoT Edge, skip to the [Testing tools](#testing-tools) section of this article to learn how to test and debug locally.

The operating systems of the development machine and IoT Edge devices don't need to match. However, the container operating system must be consistent with the development machine and the IoT Edge device. For example, you can develop modules on a Windows machine and deploy them to a Linux device. The Windows machine needs to run Linux containers to build the modules for the Linux device.

## Container engine

The central concept of IoT Edge is that you can remotely deploy your business and cloud logic to devices by packaging it into containers. To build containers, you need a container engine on your development machine.

The only supported container engine for IoT Edge devices in production is Moby. However, any container engine compatible with the Open Container Initiative, like Docker, is capable of building IoT Edge module images.

## Development tools

The [Azure IoT Edge development tool](#iot-edge-dev-tool) is a command line tool to develop and test IoT Edge modules. You can create new IoT Edge scenarios, build module images, run modules in a simulator, and monitor messages sent to IoT Hub. The *iotedgedev* tool is the recommended tool for developing IoT Edge modules. 

Both Visual Studio and Visual Studio Code have add-on extensions to help develop IoT Edge solutions. These extensions provide language-specific templates to help create and deploy new IoT Edge scenarios. The Azure IoT Edge extensions for Visual Studio and Visual Studio Code help you code, build, deploy, and debug your IoT Edge solutions. You can create an entire IoT Edge solution that contains multiple modules, and the extensions automatically update a deployment manifest template with each new module addition. The extensions also enable management of IoT devices from within Visual Studio or Visual Studio Code. You can deploy modules to a device, monitor the status, and view messages as they arrive at IoT Hub. Finally, both extensions use the IoT EdgeHub dev tool to enable local running and debugging of modules on your development machine.

### IoT Edge dev tool

The Azure IoT Edge dev tool simplifies IoT Edge development with command-line abilities. This tool provides CLI commands to develop, debug, and test modules. The IoT Edge dev tool works with your development system, whether you've manually installed the dependencies on your machine or are using the prebuilt [IoT Edge Dev Container](#iot-edge-dev-container) to run the *iotedgedev* tool in a container.

For more information and to get started, see [IoT Edge dev tool wiki](https://github.com/Azure/iotedgedev/wiki).

### Visual Studio Code extension

The Azure IoT Edge extension for Visual Studio Code provides IoT Edge module templates built on programming languages including C, C#, Java, Node.js, and Python. Templates for Azure functions in C# are also included.

> [!IMPORTANT]
> The Azure IoT Edge Visual Studio Code extension is in [maintenance mode](https://github.com/microsoft/vscode-azure-iot-edge/issues/639). The *iotedgedev* tool is the recommended tool for developing IoT Edge modules.

For more information and to download, see [Azure IoT Edge for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge).

In addition to the IoT Edge extensions, you may find it helpful to install additional extensions for developing. For example, you can use [Docker Support for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) to manage your images, containers, and registries. Additionally, all the major supported languages have extensions for Visual Studio Code that can help when you're developing modules.

The [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension is useful as a companion for the Azure IoT Edge extension.

### Visual Studio 2017/2019 extension

The Azure IoT Edge tools for Visual Studio provide an IoT Edge module template built on C# and C.

> [!IMPORTANT]
> The Azure IoT Edge Visual Studio extensions are in maintenance mode. The *iotedgedev* tool is the recommended tool for developing IoT Edge modules.

For more information and to download, see [Azure IoT Edge Tools for Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vsiotedgetools) or [Azure IoT Edge Tools for Visual Studio 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools).

## Testing tools

Several testing tools exist to help you simulate IoT Edge devices or debug modules more efficiently. The table below shows a high-level comparison between the tools and the following individual sections describe each tool more specifically.

Only the IoT Edge runtime is supported for production deployments, but the following tools allow you to simulate or easily create IoT Edge devices for development and testing purposes. These tools aren't mutually exclusive, but can work together for a complete development experience.

| Tool | Also known as | Supported platforms | Best for |
| ---- | ------------- | ------------------- | --------- |
| IoT EdgeHub dev tool  | iotedgehubdev | Windows, Linux, macOS | Simulating a device to debug modules. |
| IoT Edge dev container | iotedgedev | Windows, Linux, macOS | Developing without installing dependencies. |

### IoT EdgeHub dev tool

The Azure IoT EdgeHub dev tool provides a local development and debug experience. The tool helps start IoT Edge modules without the IoT Edge runtime so that you can create, develop, test, run, and debug IoT Edge modules and solutions locally. You don't have to push images to a container registry and deploy them to a device for testing.

The IoT EdgeHub dev tool was designed to work in tandem with the Visual Studio and Visual Studio Code extensions, as well as with the IoT Edge dev tool. The dev tool supports inner loop development as well as outer loop testing, so it integrates with other DevOps tools too.

> [!IMPORTANT]
> The IoT EdgeHub dev tool is in [maintenance mode](https://github.com/Azure/iotedgehubdev/issues/396). Consider using a [Linux virtual machine with IoT Edge runtime installed](quickstart-linux.md), physical device, or [EFLOW](https://github.com/Azure/iotedge-eflow).

For more information and to install, see [Azure IoT EdgeHub dev tool](https://pypi.org/project/iotedgehubdev/).

### IoT Edge dev container

The Azure IoT Edge dev container is a Docker container that has all the dependencies that you need for IoT Edge development. This container makes it easy to get started with whichever language you want to develop in, including C#, Python, Node.js, and Java. All you need to install is a container engine, like Docker or Moby, to pull the container to your development machine.

For more information, see [Azure IoT Edge dev container](https://github.com/Azure/iotedgedev/wiki/quickstart-with-iot-edge-dev-container).

## DevOps tools

When you're ready to develop at-scale solutions for extensive production scenarios, take advantage of modern DevOps principles including automation, monitoring, and streamlined software engineering processes. IoT Edge has extensions to support DevOps tools including Azure DevOps, Azure DevOps Projects, and Jenkins. If you want to customize an existing pipeline or use a different DevOps tool like CircleCI or TravisCI, you can do so with the CLI features included in the IoT Edge dev tool.

For more information, guidance, and examples, see the following pages:

* [Continuous integration and continuous deployment to Azure IoT Edge](how-to-continuous-integration-continuous-deployment.md)
* [IoT Edge DevOps GitHub repo](https://github.com/toolboc/IoTEdge-DevOps)
