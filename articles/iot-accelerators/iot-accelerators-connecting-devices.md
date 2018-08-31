---
title: Provision Windows devices to remote monitoring in C - Azure | Microsoft Docs
description: Describes how to connect a device to the Remote Monitoring solution accelerator using an application written in C running on Windows.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 08/31/2018
ms.author: dobett
---

# Connect your device to the Remote Monitoring solution accelerator (Windows)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a physical device to the Remote Monitoring solution accelerator.

As with most embedded applications that run on constrained devices, the client code for the device application is written in C. In this tutorial, you build the device client application on a machine running Windows.

## Prerequisites

To complete the steps in this how-to guide, you need Visual Studio 2017 installed on your Windows machine.

## View the code

The sample code used in this guide is available in the Azure IoT C SDKs GitHub repository.

### Download the source code and prepare the solution

To prepare the solution, clone or download the [Azure IoT C SDKs repository](https://github.com/Azure/azure-iot-sdk-c) from GitHub.

The sample is located in the **samples\solutions\RemoteMonitoring** folder. The Visual Studio solution and project files are in the **windows** subfolder.

Download the **parson.c** and **parson.h** source files from [https://github.com/kgabis/parson](https://github.com/kgabis/parson) and save them in the sample folder alongside the **RemoteMonitoring.c** file. The sample uses the Parson json parser.

Open the **RemoteMonitoringClient.sln** file in the **windows** folder in Visual Studio 2017.

[!INCLUDE [iot-accelerators-connecting-code](../../includes/iot-accelerators-connecting-code.md)]

## Build and run the sample

1. Edit the **RemoteMonitoring.c** file to replace `<connectionstring>` with the device connection string you noted at the start of this how-to guide when you added a device to the solution accelerator.

1. Choose **Build** and then **Build Solution** to build the device application.

1. In **Solution Explorer**, right-click the **RemoteMonitoringClient** project, choose **Debug**, and then choose **Start new instance** to run the sample. The console displays messages as:

    - The application sends sample telemetry to the solution accelerator.
    - Responds to methods invoked from the solution dashboard.

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
