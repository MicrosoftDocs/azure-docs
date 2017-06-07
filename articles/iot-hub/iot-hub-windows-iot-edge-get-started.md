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
ms.date: 06/07/2017
ms.author: andbuc
ms.custom: H1Hack27Feb2017

---
# Explore Azure IoT Edge architecture on Windows

[!INCLUDE [iot-hub-iot-edge-getstarted-selector](../../includes/iot-hub-iot-edge-getstarted-selector.md)]

## Install the prerequisites

1. Install [Visual Studio 2015 or 2017](https://www.visualstudio.com). You can use the free Community Edition if you meet the licensing requirements. Be sure to include Visual C++ and NuGet Package Manager.

1. Install [git](http://www.git-scm.com) and make sure you can run git.exe from the command line.

1. Install [CMake](https://cmake.org/download/) and make sure you can run cmake.exe from the command line. CMake version 3.7.2 or later is recommended. The **.msi** installer is the easiest option on Windows. Add CMake to the PATH for at least the current user when the installer prompts you.

1. Install [Python 2.7](https://www.python.org/downloads/release/python-27). Make sure you add Python to your `PATH` environment variable in **Control Panel -> System -> Advanced system settings -> Environment Variables**.

1. At a command prompt, run the following command to clone the Azure IoT Edge GitHub repository to your local machine:

    ```cmd
    git clone https://github.com/Azure/iot-edge.git
    ```

## How to build the sample

You can now build the IoT Edge runtime and samples on your local machine:

1. Open a **Developer Command Prompt for VS 2015** or **Developer Command Prompt for VS 2017** command prompt.

1. Navigate to the root folder in your local copy of the **iot-edge** repository.

1. Run the build script as follows:

    ```cmd
    tools\build.cmd --disable-nodejs-remote-modules --disable-native-remote-modules
    ```

This script creates a Visual Studio solution file and builds the solution. You can find the Visual Studio solution in the **build** folder in your local copy of the **iot-edge** repository. If you want to build and run the unit tests, add the `--run-unittests` parameter. If you want to build and run the end to end tests, add the `--run-e2e-tests`.

> [!NOTE]
> Every time you run the **build.cmd** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **iot-edge** repository.

## How to run the sample

The **build.cmd** script generates its output in the **build** folder in your local copy of the **iot-edge** repository. This output includes the two IoT Edge modules used in this sample.

The build script places **logger.dll** in the **build\\modules\\logger\\Debug** folder and **hello\_world.dll** in the **build\\modules\\hello_world\\Debug** folder. Use these paths for the **module path** values as shown in the following JSON settings file.

The hello\_world\_sample process takes the path to a JSON configuration file as a command-line argument. The following example JSON file is provided in the SDK repository at **samples\\hello\_world\\src\\hello\_world\_win.json**. This configuration file works as is unless you modify the build script to place the IoT Edge modules or sample executables in non-default locations.

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

1. Navigate to the **build** folder in the root of your local copy of the **iot-edge** repository.

1. Run the following command:

    ```cmd
    samples\hello_world\Debug\hello_world_sample.exe ..\samples\hello_world\src\hello_world_win.json
    ```

[!INCLUDE [iot-hub-iot-edge-getstarted-code](../../includes/iot-hub-iot-edge-getstarted-code.md)]
