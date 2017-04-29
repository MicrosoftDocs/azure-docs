---
title: Connect a device using C on Linux | Microsoft Docs
description: Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on Linux.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 0c7c8039-0bbf-4bb5-9e79-ed8cff433629
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/25/2017
ms.author: dobett

---
# Connect your device to the remote monitoring preconfigured solution (Linux)
[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run a sample C client Linux
The following steps show you how to create a client application that communicates with the remote monitoring preconfigured solution. This application is written in C and built and run on Ubuntu Linux.

To complete these steps, you need a device running Ubuntu version 15.04 or 15.10. Before proceeding, install the prerequisite packages on your Ubuntu device using the following command:

```
sudo apt-get install cmake gcc g++
```

## Install the client libraries on your device
The Azure IoT Hub client libraries are available as a package you can install on your Ubuntu device using the **apt-get** command. Complete the following steps to install the package that contains the IoT Hub client library and header files on your Ubuntu computer:

1. In a shell, add the AzureIoT repository to your computer:
   
    ```
    sudo add-apt-repository ppa:aziotsdklinux/ppa-azureiot
    sudo apt-get update
    ```
2. Install the azure-iot-sdk-c-dev package
   
    ```
    sudo apt-get install -y azure-iot-sdk-c-dev
    ```

## Install the Parson JSON parser
The IoT Hub client libraries use the Parson JSON parser to parse message payloads. In a suitable folder on your computer, clone the Parson GitHub repository using the following command:

```
git clone https://github.com/kgabis/parson.git
```

## Prepare your project
On your Ubuntu machine, create a folder called **remote\_monitoring**. In the **remote\_monitoring** folder:

- Create the four files **main.c**, **remote\_monitoring.c**, **remote\_monitoring.h**, and **CMakeLists.txt**.
- Create folder called **parson**.

Copy the files **parson.c** and **parson.h** from your local copy of the Parson repository into the **remote\_monitoring/parson** folder.

In a text editor, open the **remote\_monitoring.c** file. Add the following `#include` statements:
   
```
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

## Call the remote\_monitoring\_run function
In a text editor, open the **remote_monitoring.h** file. Add the following code:

```
void remote_monitoring_run(void);
```

In a text editor, open the **main.c** file. Add the following code:

```
#include "remote_monitoring.h"

int main(void)
{
    remote_monitoring_run();

    return 0;
}
```

## Build and run the application
The following steps describe how to use *CMake* to build your client application.

1. In a text editor, open the **CMakeLists.txt** file in the **remote_monitoring** folder.

1. Add the following instructions to define how to build your client application:
   
    ```
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

    set(AZUREIOT_INC_FOLDER ".." "../parson" "/usr/include/azureiot" "/usr/include/azureiot/inc")

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

    add_executable(sample_app ${sample_application_c_files} ${sample_application_h
    _files})

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
1. In the **remote_monitoring** folder, create a folder to store the *make* files that CMake generates and then run the **cmake** and **make** commands as follows:
   
    ```
    mkdir cmake
    cd cmake
    cmake ../
    make
    ```

1. Run the client application and send telemetry to IoT Hub:
   
    ```
    ./sample_app
    ```

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

