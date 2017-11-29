---
title: Provision Raspberry Pi to Remote Monitoring using C - Azure | Microsoft Docs
description: Describes how to connect a Raspberry Pi device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C.
services: iot-suite
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: fc50a33f-9fb9-42d7-b1b8-eb5cff19335e
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/10/2017
ms.author: dobett

---
# Connect your Raspberry Pi device to the remote monitoring preconfigured solution (C)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a physical device to the remote monitoring preconfigured solution. As with most embedded applications that run on constrained devices, the client code for the Raspberry Pi device application is written in C. In this tutorial, you build the application on a Raspberry Pi running the Raspbian OS.

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

The following steps show you how to prepare your Raspberry Pi for building a C application that connects to the preconfigured solution:

1. Connect to your Raspberry Pi using `ssh`. For more information, see [SSH (Secure Shell)](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) on the [Raspberry Pi website](https://www.raspberrypi.org/).

1. Use the following command to update your Raspberry Pi:

    ```sh
    sudo apt-get update
    ```

1. Use the following command to add the required development tools and libraries to your Raspberry Pi:

    ```sh
    sudo apt-get install g++ make cmake gcc git
    ```

1. Use the following commands to install the IoT Hub client libraries:

    ```sh
    grep -q -F 'deb http://ppa.launchpad.net/aziotsdklinux/ppa-azureiot/ubuntu vivid main' /etc/apt/sources.list || sudo sh -c "echo 'deb http://ppa.launchpad.net/aziotsdklinux/ppa-azureiot/ubuntu vivid main' >> /etc/apt/sources.list"
    grep -q -F 'deb-src http://ppa.launchpad.net/aziotsdklinux/ppa-azureiot/ubuntu vivid main' /etc/apt/sources.list || sudo sh -c "echo 'deb-src http://ppa.launchpad.net/aziotsdklinux/ppa-azureiot/ubuntu vivid main' >> /etc/apt/sources.list"
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FDA6A393E4C2257F
    sudo apt-get update
    sudo apt-get install -y azure-iot-sdk-c-dev cmake libcurl4-openssl-dev git-core
    ```

1. Clone the Parson JSON parser to your Raspberry Pi using the following commands:

    ```sh
    cd ~
    git clone https://github.com/kgabis/parson.git
    ```

## Create a project

Complete the following steps using the `ssh` connection to your Raspberry Pi:

1. Create a folder called `remote_monitoring` in your home folder on the Raspberry Pi. Navigate to this folder in your command line:

    ```sh
    cd ~
    mkdir remote_monitoring
    cd remote_monitoring
    ```

1. Create the four files `main.c`, `remote_monitoring.c`, `remote_monitoring.h`, and `CMakeLists.txt` in the `remote_monitoring` folder.

1. Create folder called `parson` in the `remote_monitoring` folder.

1. Copy the files `parson.c` and `parson.h` from your local copy of the Parson repository into the `remote_monitoring/parson` folder.

1. In a text editor, open the `remote_monitoring.c` file. On the Raspberry Pi, you can use either the `nano` OR `vi` text editor. Add the following `#include` statements:

    ```c
    #include "iothubtransportmqtt.h"
    #include "schemalib.h"
    #include "iothub_client.h"
    #include "serializer_devicetwin.h"
    #include "schemaserializer.h"
    #include "azure_c_shared_utility/threadapi.h"
    #include "azure_c_shared_utility/platform.h"
    #include "parson.h"
    ```

[!INCLUDE [iot-suite-connecting-code](../../includes/iot-suite-connecting-code.md)]

## Add code to run the app

In a text editor, open the `remote_monitoring.h` file. Add the following code:

```c
void remote_monitoring_run(void);
```

In a text editor, open the `main.c` file. Add the following code:

```c
#include "remote_monitoring.h"

int main(void)
{
  remote_monitoring_run();

  return 0;
}
```

## Build and run the application

The following steps describe how to use *CMake* to build your client application.

1. In a text editor, open the **CMakeLists.txt** file in the `remote_monitoring` folder.

1. Add the following instructions to define how to build your client application:

    ```cmake
    macro(compileAsC99)
      if (CMAKE_VERSION VERSION_LESS "3.1")
        if (CMAKE_C_COMPILER_ID STREQUAL "GNU")
          set (CMAKE_C_FLAGS "--std=c99 ${CMAKE_C_FLAGS}")
          set (CMAKE_CXX_FLAGS "--std=c++11 ${CMAKE_CXX_FLAGS}")
        endif()
      else()
        set (CMAKE_C_STANDARD 99)
        set (CMAKE_CXX_STANDARD 11)
      endif()
    endmacro(compileAsC99)

    cmake_minimum_required(VERSION 2.8.11)
    compileAsC99()

    set(AZUREIOT_INC_FOLDER "${CMAKE_SOURCE_DIR}" "${CMAKE_SOURCE_DIR}/parson" "/usr/include/azureiot" "/usr/include/azureiot/inc")

    include_directories(${AZUREIOT_INC_FOLDER})

    set(sample_application_c_files
        ./parson/parson.c
        ./remote_monitoring.c
        ./main.c
    )

    set(sample_application_h_files
        ./parson/parson.h
        ./remote_monitoring.h
    )

    add_executable(sample_app ${sample_application_c_files} ${sample_application_h_files})

    target_link_libraries(sample_app
        serializer
        iothub_client
        iothub_client_mqtt_transport
        aziotsharedutil
        umqtt
        pthread
        curl
        ssl
        crypto
        m
    )
    ```

1. In the `remote_monitoring` folder, create a folder to store the *make* files that CMake generates. Then run the **cmake** and **make** commands as follows:

    ```sh
    mkdir cmake
    cd cmake
    cmake ../
    make
    ```

1. Run the client application and send telemetry to IoT Hub:

    ```sh
    ./sample_app
    ```

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
