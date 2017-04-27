---
title: Get started with the Azure IoT Gateway SDK (Linux) | Microsoft Docs
description: How to build a gateway on a Linux machine and learn about key concepts in the Azure IoT Gateway SDK such as modules and JSON configuration files.
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
ms.date: 03/28/2017
ms.author: andbuc
ms.custom: H1Hack27Feb2017

---
# Explore the IoT Gateway SDK architecture on Linux

[!INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Linux.

1. Open a shell.
1. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
1. Run the **tools/build.sh** script. This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **azure-iot-gateway-sdk** repository and generate a makefile. The script then builds the solution, skipping unit tests and end to end tests. Add the **--run-unittests** parameter if you want to build and run the unit tests. Add the **--run-e2e-tests** if you want to build and run the end to end tests.

> [!NOTE]
> Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **azure-iot-gateway-sdk** repository.

## How to run the sample

1. The **build.sh** script generates its output in the **build** folder in your local copy of the **azure-iot-gateway-sdk** repository. This output includes the two modules used in this sample.

    The build script places **liblogger.so** in the **build/modules/logger/** folder and **libhello\_world.so** in the **build/modules/hello_world/** folder. Use these paths for the **module path** value as shown in the following example JSON settings file.
1. The hello\_world\_sample process takes the path to a JSON configuration file a command-line argument. The following example JSON file is provided in the SDK repository at **samples/hello\_world/src/hello\_world\_lin.json**. This configuration file works as is unless you modify the build script to place modules or sample executables in non-default locations.

   > [!NOTE]
   > The module paths are relative to the current working directory from where the hello\_world\_sample executable is launched, not the directory where the executable is located. The sample JSON configuration file defaults to writing 'log.txt' in your current working directory.

    ```json
    {
        "modules" :
        [
            {
              "name" : "logger",
              "loader": {
                "name": "native",
                "entrypoint": {
                  "module.path": "./modules/logger/liblogger.so"
                }
              },
              "args" : {"filename":"log.txt"}
            },
            {
                "name" : "hello_world",
              "loader": {
                "name": "native",
                "entrypoint": {
                  "module.path": "./modules/hello_world/libhello_world.so"
                }
              },
                "args" : null
            }
        ],
        "links":
        [
            {
                "source": "hello_world",
                "sink": "logger"
            }
        ]
    }
    ```
1. Navigate to **build** folder.
1. Run the following command:

   `./samples/hello_world/hello_world_sample ./../samples/hello_world/src/hello_world_lin.json`

[!INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md
