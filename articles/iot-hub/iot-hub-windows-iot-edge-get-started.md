---
title: Get started with Azure IoT Edge (Windows) | Microsoft Docs
description: How to build an Azure IoT Edge gateway on a Windows machine and learn about key concepts in Azure IoT Edge such as modules and JSON configuration files.
services: iot-hub
documentationcenter: ''
author: chipalost
manager: timlt
editor: ''

ms.assetid: 9aff3724-5e4e-40ec-b95a-d00df4f590c5
ms.service: iot-hub
ms.devlang: cpp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/18/2017
ms.author: andbuc
ms.custom: H1Hack27Feb2017

---
# Explore Azure IoT Edge architecture on Windows

[!INCLUDE [iot-hub-iot-edge-getstarted-selector](../../includes/iot-hub-iot-edge-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Windows.

1. Open a **Developer Command Prompt for VS 2015** or **Developer Command Prompt for VS 2017** command prompt.
1. Navigate to the root folder in your local copy of the **iot-edge** repository.
1. Run the **tools\\build.cmd** script. This script creates a Visual Studio solution file and builds the solution. You can find the Visual Studio solution in the **build** folder in your local copy of the **iot-edge** repository. Additional parameters can be given to the script to build and run unit and end-to-end tests. These parameters are **--run-unittests** and **--run-e2e-tests** respectively.

## How to run the sample

1. The **build.cmd** script creates a folder called **build** in your local copy of the repository. This folder contains the two IoT Edge modules used in this sample.

    The build script places **logger.dll** in the **build\\modules\\logger\\Debug** folder and **hello\_world.dll** in the **build\\modules\\hello_world\\Debug** folder. Use these paths for the **module path** values as shown in the following JSON settings file.
1. The hello\_world\_sample process takes the path to a JSON configuration file as a command-line argument. The following example JSON file is provided in the SDK repository at **samples\\hello\_world\\src\\hello\_world\_win.json**. This configuration file works as is unless you modify the build script to place modules or sample executables in non-default locations.

   > [!NOTE]
   > The module paths are relative to the directory where the hello\_world\_sample.exe is located. The sample JSON configuration file defaults to writing 'log.txt' in your current working directory.

    ```json
    {
      "modules": [
        {
          "name": "logger",
          "loader": {
            "name": "native",
            "entrypoint": {
              "module.path": "..\\..\\..\\modules\\logger\\Debug\\logger.dll"
            }
          },
          "args": { "filename": "log.txt" }
        },
        {
          "name": "hello_world",
          "loader": {
            "name": "native",
            "entrypoint": {
              "module.path": "..\\..\\..\\modules\\hello_world\\Debug\\hello_world.dll"
            }
          },
          "args": null
          }
      ],
      "links": [
        {
          "source": "hello_world",
          "sink": "logger"
        }
      ]
    }
    ```

1. Navigate to the root folder of your local copy of the **iot-edge** repository.

1. Run the following command:

   `build\samples\hello_world\Debug\hello_world_sample.exe samples\hello_world\src\hello_world_win.json`

[!INCLUDE [iot-hub-iot-edge-getstarted-code](../../includes/iot-hub-iot-edge-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/iot-edge/blob/master/doc/devbox_setup.md
