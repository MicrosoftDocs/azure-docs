---
title: Get started with the IoT Hub Gateway SDK | Microsoft Docs
description: This Azure IoT Gateway SDK walkthrough uses Linux to illustrate key concepts you should understand when you use the Azure IoT Gateway SDK.
services: iot-hub
documentationcenter: ''
author: chipalost
manager: timlt
editor: ''

ms.assetid: cf537bdd-2352-4bb1-96cd-a283fcd3d6cf
ms.service: iot-hub
ms.devlang: cpp
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/25/2016
ms.author: andbuc

---
# Azure IoT Gateway SDK (beta) - Get started using Linux
[!INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample
Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Linux.

1. Open a shell.
2. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
3. Run the **tools/build.sh** script. This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **azure-iot-gateway-sdk** repository and generate a makefile. The script then builds the solution and runs the tests.

> [!NOTE]
> Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **azure-iot-gateway-sdk** repository.
> 
> 

## How to run the sample
1. The **build.sh** script generates its output in the **build** folder in your local copy of the **azure-iot-gateway-sdk** repository. This includes the two modules used in this sample.
   
    The build script places **liblogger.so** in the **build/modules/logger/** folder and **libhello_world.so** in  the **build/modules/hello_world/** folder. Use these paths for the **module path** value as shown in the JSON settings file below.
2. The hello_world_sample process takes the path to a JSON configuration file as an argument in the command line. An example JSON file has been provided as part of the repo at **azure-iot-gateway-sdk/samples/hello_world/src/hello_world_win.json** and is copied below. It will work as is unless you have modified the build script to place modules or sample executables in non-default locations.

   > [!Note]: The module paths are relative to the current working directory from where the hello_world_sample executable is launched, not the directory where the executable is located. The sample JSON configuration file defaults to writing 'log.txt' in your current working directory.
   
    ```
    {
      "modules" :
      [ 
        {
          "module name" : "logger",
          "loading args": {
            "module path" : "./build/modules/logger/liblogger.so"
          },
          "args" : 
          {
            "filename":"log.txt"
          }
        },
        {
          "module name" : "hello_world",
          "loading args": {
            "module path" : "./build/modules/hello_world/libhello_world.so"
          },
          "args" : null
        }
      ],
      "links" :
      [
        {
          "source": "hello_world",
          "sink": "logger"
        }
      ]
    }
    ```
3. Navigate to **azure-iot-gateway-sdk** folder.
4. Run the following command:
   
   ```
   ./build/samples/hello_world/hello_world_sample ./samples/hello_world/src/hello_world_lin.json
   ``` 

[!INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md
