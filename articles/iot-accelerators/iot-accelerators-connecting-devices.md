---
title: Provision Windows devices to remote monitoring in C - Azure | Microsoft Docs
description: Describes how to connect a device to the Remote Monitoring solution accelerator using an application written in C running on Windows.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 09/17/2018
ms.author: dobett
---

# Connect your device to the Remote Monitoring solution accelerator (Windows)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a physical device to the Remote Monitoring solution accelerator.

As with most embedded applications that run on constrained devices, the client code for the device application is written in C. In this tutorial, you build the device client application on a machine running Windows.

## Prerequisites

To complete the steps in this how-to guide follow the steps in [set up your Windows development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#set-up-a-windows-development-environment) to add the required development tools and libraries to your Windows machine.

## View the code

The [sample code](https://github.com/Azure/azure-iot-sdk-c/tree/master/samples/solutions/remote_monitoring_client) used in this guide is available in the Azure IoT C SDKs GitHub repository.

### Download the source code and prepare the project

To prepare the project, clone or download the [Azure IoT C SDKs repository](https://github.com/Azure/azure-iot-sdk-c) from GitHub.

The sample is located in the **samples/solutions/remote_monitoring_client** folder.

Open the **remote_monitoring.c** file in the **samples/solutions/remote_monitoring_client** folder in a text editor.

[!INCLUDE [iot-accelerators-connecting-code](../../includes/iot-accelerators-connecting-code.md)]

## Build and run the sample

1. Edit the **remote_monitoring.c** file to replace `<connectionstring>` with the device connection string you noted at the start of this how-to guide when you added a device to the solution accelerator.

1. Follow the steps in [Build the C SDK in Windows](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#build-the-c-sdk-in-windows) to build the SDK and the remote monitoring client application.

1. At the command-prompt you used to build the solution, run:

    ```cmd
    samples\solutions\remote_monitoring_client\Release\remote_monitoring_client.exe
    ```

    The console displays messages as:

    - The application sends sample telemetry to the solution accelerator.
    - Responds to methods invoked from the solution dashboard.

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
