---
title: Provision Linux devices to Remote Monitoring in C - Azure | Microsoft Docs
description: Describes how to connect a device to the Remote Monitoring solution accelerator using an application written in C running on Linux.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 08/31/2018
ms.author: dobett
---

# Connect your device to the Remote Monitoring solution accelerator (Linux)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a real device to the Remote Monitoring solution accelerator.

As with most embedded applications that run on constrained devices, the client code for the device application is written in C. In this tutorial, you build the application on a machine running Ubuntu (Linux).

If you prefer to simulate a device, see [Create and test a new simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md).

## Prerequisites

To complete the steps in this how-to guide, you need a device running Ubuntu version 15.04 or later. Before proceeding, [set up your Linux development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#linux).

## View the code

The [sample code](https://github.com/Azure/azure-iot-sdk-c/tree/master/samples/solutions/remote_monitoring_client) used in this guide is available in the Azure IoT C SDKs GitHub repository.

### Download the source code and prepare the project

To prepare the project, clone or download the [Azure IoT C SDKs repository](https://github.com/Azure/azure-iot-sdk-c) from GitHub.

The sample is located in the **samples/solutions/remote_monitoring_client** folder.

Open the **remote_monitoring.c** file in the **samples/solutions/remote_monitoring_client** folder in a text editor.

[!INCLUDE [iot-accelerators-connecting-code](../../includes/iot-accelerators-connecting-code.md)]

## Build and run the application

The following steps describe how to use *CMake* to build the client application. The remote monitoring client application is built as part of the build process for the SDK.

1. Edit the **remote_monitoring.c** file to replace `<connectionstring>` with the device connection string you noted at the start of this how-to guide when you added a device to the solution accelerator.

1. Navigate to root of your cloned copy of the [Azure IoT C SDKs repository](https://github.com/Azure/azure-iot-sdk-c) repository and run the following commands to build the client application:

    ```sh
    mkdir cmake
    cd cmake
    cmake ../
    make
    ```

1. Run the client application and send telemetry to IoT Hub:

    ```sh
    ./samples/solutions/remote_monitoring_client/remote_monitoring_client
    ```

    The console displays messages as:

    - The application sends sample telemetry to the solution accelerator.
    - Responds to methods invoked from the solution dashboard.

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
