---
title: Provision Raspberry Pi to Remote Monitoring using C - Azure | Microsoft Docs
description: Describes how to connect a Raspberry Pi device to the Remote Monitoring solution accelerator using an application written in C.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 03/08/2019
ms.author: dobett
---

# Connect your Raspberry Pi device to the Remote Monitoring solution accelerator (C)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a real device to the Remote Monitoring solution accelerator. As with most embedded applications that run on constrained devices, the client code for the Raspberry Pi device application is written in C. In this tutorial, you build the application on a Raspberry Pi running the Raspbian OS.

If you prefer to simulate a device, see [Create and test a new simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md).

### Required hardware

A desktop computer to enable you to connect remotely to the command line on the Raspberry Pi.

[Microsoft IoT Starter Kit for Raspberry Pi 3](https://azure.microsoft.com/develop/iot/starter-kits/) or equivalent components. This tutorial uses the following items from the kit:

- Raspberry Pi 3
- MicroSD Card (with NOOBS)
- A USB Mini cable
- An Ethernet cable

### Required desktop software

You need SSH client on your desktop machine to enable you to remotely access the command line on the Raspberry Pi.

- Windows does not include an SSH client. We recommend using [PuTTY](https://www.putty.org/).
- Most Linux distributions and Mac OS include the command-line SSH utility. For more information, see [SSH Using Linux or Mac OS](https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md).

### Required Raspberry Pi software

This article assumes you have installed the latest version of the [Raspbian OS on your Raspberry Pi](https://www.raspberrypi.org/learning/software-guide/quickstart/).

The following steps show you how to prepare your Raspberry Pi for building a C application that connects to the solution accelerator:

1. Connect to your Raspberry Pi using **ssh**. For more information, see [SSH (Secure Shell)](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) on the [Raspberry Pi website](https://www.raspberrypi.org/).

1. Use the following command to update your Raspberry Pi:

    ```sh
    sudo apt-get update
    ```

1. To complete the steps in this how-to guide follow the steps in [set up your Linux development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#linux) to add the required development tools and libraries to your Raspberry Pi.

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
