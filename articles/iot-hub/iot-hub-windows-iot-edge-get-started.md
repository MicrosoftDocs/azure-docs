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
ms.date: 09/29/2017
ms.author: andbuc
ms.custom: H1Hack27Feb2017

---
# Explore Azure IoT Edge architecture on Windows

[!INCLUDE [iot-hub-iot-edge-getstarted-selector](../../includes/iot-hub-iot-edge-getstarted-selector.md)]

[!INCLUDE [iot-hub-iot-edge-install-build-windows](../../includes/iot-hub-iot-edge-install-build-windows.md)]

## Run the sample

The **build.cmd** script generates its output in the **build** folder in your local copy of the **iot-edge** repository. This output includes many files, but this sample focuses on three:
- Two IoT Edge modules: **build\\modules\\logger\\Debug\\logger.dll** and **build\\modules\\hello_world\\Debug\\hello\_world.dll**. 
- An executable file: **build\\samples\\hello\_world\\Debug\\hello\_world\_sample.exe**. This process takes a JSON configuration file as a command-line argument.

The fourth file that you use in this sample isn't in the build folder, but was included when you cloned it iot-edge repository:
- A JSON configuration file: **samples\\hello\_world\\src\\hello\_world\_win.json**. This file contains the paths to the two modules. It also declares where logger.dll writes its output to. The default is **log.txt** in your current working directory. 

   >[!NOTE]
   >If you move the sample modules, or add your own for testing, update the **module.path** values in the configuration file to match. The module paths are relative to the directory where **hello\_world\_sample.exe** is located. 

To run the sample, follow these steps:

1. Navigate to the **build** folder in the root of your local copy of the **iot-edge** repository.

1. Run the following command:

   ```cmd
   samples\hello_world\Debug\hello_world_sample.exe ..\samples\hello_world\src\hello_world_win.json
   ```

1. The following output means the sample is running successfully:

   ```cmd
   gateway successfully created from JSON
   gateway shall run until ENTER is pressed
   ```
  
1. Press the **Enter** key to stop the process.


[!INCLUDE [iot-hub-iot-edge-getstarted-code](../../includes/iot-hub-iot-edge-getstarted-code.md)]
