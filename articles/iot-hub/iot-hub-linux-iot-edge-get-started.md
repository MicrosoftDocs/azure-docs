---
title: Get started with Azure IoT Edge (Linux) | Microsoft Docs
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

[!INCLUDE [iot-hub-iot-edge-install-build-linux](../../includes/iot-hub-iot-edge-install-build-linux.md)]

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

