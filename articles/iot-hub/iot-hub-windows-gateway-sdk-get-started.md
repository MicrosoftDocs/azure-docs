---
title: Get started with the Azure IoT Gateway SDK (Windows) | Microsoft Docs
description: How to build a gateway on a Windows machine and learn about key concepts in the Azure IoT Gateway SDK such as modules and JSON configuration files.
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
ms.date: 11/16/2016
ms.author: andbuc

---
# Get started with the Azure IoT Gateway SDK (Windows)
[!INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample
Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Windows.

1. Open a **Developer Command Prompt for VS2015** command prompt.
2. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
3. Run the **tools\\build.cmd** script. This script creates a Visual Studio solution file and builds 
the solution. You can find the Visual Studio solution in the **build** folder in your local copy of 
the **azure-iot-gateway-sdk** repository. Additional parameters can be given to the script to build 
and run unit and end to end tests. These paramaters are **--run-unittests** and **--run-e2e-tests**
respectively. 

## How to run the sample
1. The **build.cmd** script creates a folder called **build** in your local copy of the repository. This folder contains the two modules used in this sample.
   
    The build script places **logger.dll** in the **build\\modules\\logger\\Debug** folder and **hello_world.dll** in the **build\\modules\\hello_world\\Debug** folder. Use these paths for the **module path** value as shown in the following JSON settings file.
2. The hello_world_sample process takes the path to a JSON configuration file as an argument in the command-line. The following example JSON file has been provided as part of the repo at **azure-iot-gateway-sdk\samples\hello_world\src\hello_world_win.json**. It works as is unless you have modified the build script to place modules or sample executables in non-default locations. 

   > [!NOTE]
   > The module paths are relative to the directory where the hello_world_sample.exe is located. The sample JSON configuration file defaults to writing 'log.txt' in your current working directory.
   
    ```
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
3. Navigate to the root folder of your local copy of the **azure-iot-gateway-sdk** repository.

4. Run the following command:
   
   ```
   build\samples\hello_world\Debug\hello_world_sample.exe samples\hello_world\src\hello_world_win.json
   ```

[!INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md
