---
title: Provision Raspberry Pi to Remote Monitoring using C - Azure | Microsoft Docs
description: Describes how to connect a Raspberry Pi device to the Remote Monitoring solution accelerator using an application written in C.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 08/31/2018
ms.author: dobett
---

# Connect your Raspberry Pi device to the Remote Monitoring solution accelerator (C)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a physical device to the Remote Monitoring solution accelerator. As with most embedded applications that run on constrained devices, the client code for the Raspberry Pi device application is written in C. In this tutorial, you build the application on a Raspberry Pi running the Raspbian OS.

### Required hardware

A desktop computer to enable you to connect remotely to the command line on the Raspberry Pi.

[Microsoft IoT Starter Kit for Raspberry Pi 3](https://azure.microsoft.com/develop/iot/starter-kits/) or equivalent components. This tutorial uses the following items from the kit:

- Raspberry Pi 3
- MicroSD Card (with NOOBS)
- A USB Mini cable
- An Ethernet cable

### Required desktop software

You need SSH client on your desktop machine to enable you to remotely access the command line on the Raspberry Pi.

- Windows does not include an SSH client. We recommend using [PuTTY](http://www.putty.org/).
- Most Linux distributions and Mac OS include the command-line SSH utility. For more information, see [SSH Using Linux or Mac OS](https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md).

### Required Raspberry Pi software

This article assumes you have installed the latest version of the [Raspbian OS on your Raspberry Pi](https://www.raspberrypi.org/learning/software-guide/quickstart/).

The following steps show you how to prepare your Raspberry Pi for building a C application that connects to the solution accelerator:

1. Connect to your Raspberry Pi using **ssh**. For more information, see [SSH (Secure Shell)](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) on the [Raspberry Pi website](https://www.raspberrypi.org/).

1. Use the following command to update your Raspberry Pi:

    ```sh
    sudo apt-get update
    ```

1. Use the following command to add the required development tools and libraries to your Raspberry Pi:

    ```sh
    sudo apt-get install g++ make cmake gcc git libssl1.0-dev build-essential curl libcurl4-openssl-dev uuid-dev
    ```

1. Use the following commands to download, build, and install the IoT Hub client libraries on your Raspberry Pi:

    ```sh
    cd ~
    git clone --recursive https://github.com/azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    cmake ..
    make
    sudo make install
    ```

## View the code

The sample code used in this guide is available in the Azure IoT C SDKs GitHub repository.

### Download the source code and prepare the project

The sample is located in the **samples/solutions/RemoteMonitoring** folder in your copy of the **azure-iot-sdk-c** repository. The **CMakeLists.txt** file to build the client application is in the **pi** subfolder.

Download the **parson.c** and **parson.h** source files from [https://github.com/kgabis/parson](https://github.com/kgabis/parson) and save them in the sample folder alongside the **RemoteMonitoring.c** file. The sample uses the Parson json parser.

Open the **RemoteMonitoring.c** file in the **samples/solutions/RemoteMonitoring** folder in a text editor.

[!INCLUDE [iot-accelerators-connecting-code](../../includes/iot-accelerators-connecting-code.md)]

## Build and run the application

The following steps describe how to use *CMake* to build the client application.

1. Edit the **RemoteMonitoring.c** file to replace `<connectionstring>` with the device connection string you noted at the start of this how-to guide when you added a device to the solution accelerator.

1. Navigate to the **samples/solutions/RemoteMonitoring/pi** folder and run the following commands to build the client application:

    ```sh
    mkdir cmake
    cd cmake
    cmake ../
    make
    ```

1. Run the client application and send telemetry to IoT Hub:

    ```sh
    ./RemoteMonitoringClient
    ```

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
