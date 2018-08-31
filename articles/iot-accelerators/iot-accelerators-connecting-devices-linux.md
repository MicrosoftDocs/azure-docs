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

This tutorial shows you how to connect a physical device to the Remote Monitoring solution accelerator.

As with most embedded applications that run on constrained devices, the client code for the device application is written in C. In this tutorial, you build the application on a machine running Ubuntu (Linux).

## Prerequisites

To complete the steps in this how-to guide, you need a device running Ubuntu version 15.04 or later. Before proceeding, install the prerequisite packages on your Ubuntu device using the following command:

```sh
sudo apt-get install cmake build-essential
```

### Install the client libraries on your device

The Azure IoT Hub client libraries are available as a package you can install on your Ubuntu device using the **apt-get** command. Complete the following steps to install the package that contains the IoT Hub client library and header files on your Ubuntu computer:

1. In a shell, add the AzureIoT repository to your computer:

    ```sh
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository ppa:aziotsdklinux/ppa-azureiot
    sudo apt-get update
    ```

1. Install the azure-iot-sdk-c-dev package:

    ```sh
    sudo apt-get install -y azure-iot-sdk-c-dev
    ```

## View the code

The sample code used in this guide is available in the Azure IoT C SDKs GitHub repository.

### Download the source code and prepare the project

To prepare the project, clone or download the [Azure IoT C SDKs repository](https://github.com/Azure/azure-iot-sdk-c) from GitHub.

The sample is located in the **samples/solutions/RemoteMonitoring** folder. The **CMakeLists.txt** file for Linux is in the **linux** subfolder.

Download the **parson.c** and **parson.h** source files from [https://github.com/kgabis/parson](https://github.com/kgabis/parson) and save them in the sample folder alongside the **RemoteMonitoring.c** file. The sample uses the Parson json parser.

Open the **RemoteMonitoring.c** file in the **samples/solutions/RemoteMonitoring** folder in a text editor.

[!INCLUDE [iot-accelerators-connecting-code](../../includes/iot-accelerators-connecting-code.md)]

## Build and run the application

The following steps describe how to use *CMake* to build the client application.

1. Edit the **RemoteMonitoring.c** file to replace `<connectionstring>` with the device connection string you noted at the start of this how-to guide when you added a device to the solution accelerator.

1. Navigate to the **samples/solutions/RemoteMonitoring/linux** folder and run the following commands to build the client application:

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
