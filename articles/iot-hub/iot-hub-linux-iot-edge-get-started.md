---
title: Get started with the Azure IoT Edge (Linux) | Microsoft Docs
description: How to build a gateway on a Linux machine and learn about key concepts in Azure IoT Edge such as modules and JSON configuration files.
services: iot-hub
documentationcenter: ''
author: chipalost
manager: timlt
editor: ''

ms.assetid: cf537bdd-2352-4bb1-96cd-a283fcd3d6cf
ms.service: iot-hub
ms.devlang: cpp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/07/2017
ms.author: andbuc
ms.custom: H1Hack27Feb2017

---
# Explore Azure IoT Edge architecture on Linux

[!INCLUDE [iot-hub-iot-edge-getstarted-selector](../../includes/iot-hub-iot-edge-getstarted-selector.md)]

## Install the prerequisites

The steps in this tutorial assume you are running Ubuntu Linux.

Open a shell and run the following commands to install the prerequisite packages:

```bash
sudo apt-get update
sudo apt-get install curl build-essential libcurl4-openssl-dev git cmake libssl-dev uuid-dev valgrind libglib2.0-dev libtool autoconf
```

In the shell, run the following command to clone the Azure IoT Edge GitHub repository to your local machine:

```bash
git clone https://github.com/Azure/iot-edge.git
```

## How to build the sample

You can now build the IoT Edge runtime and samples on your local machine:

1. Open a shell.

1. Navigate to the root folder in your local copy of the **iot-edge** repository.

1. Run the build script as follows:

    ```sh
    tools/build.sh --disable-nodejs-remote-modules --disable-native-remote-modules
    ```

This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **iot-edge** repository and generate a makefile. The script then builds the solution, skipping unit tests and end to end tests. If you want to build and run the unit tests, add the `--run-unittests` parameter. If you want to build and run the end to end tests, add the `--run-e2e-tests`.

> [!NOTE]
> Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **iot-edge** repository.

## How to run the sample

The **build.sh** script generates its output in the **build** folder in your local copy of the **iot-edge** repository. This output includes the two IoT Edge modules used in this sample.

The build script places **liblogger.so** in the **build/modules/logger/** folder and **libhello\_world.so** in the **build/modules/hello_world/** folder. Use these paths for the **module path** values as shown in the following example JSON settings file.

The hello\_world\_sample process takes the path to a JSON configuration file a command-line argument. The following example JSON file is provided in the SDK repository at **samples/hello\_world/src/hello\_world\_lin.json**. This configuration file works as is unless you modify the build script to place the IoT Edge modules or sample executables in non-default locations.

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

1. Navigate to the **build** folder in the root of your local copy of the **iot-edge** repository.

1. Run the following command:

    ```sh
    ./samples/hello_world/hello_world_sample ../samples/hello_world/src/hello_world_lin.json`
    ```

[!INCLUDE [iot-hub-iot-edge-getstarted-code](../../includes/iot-hub-iot-edge-getstarted-code.md)]

