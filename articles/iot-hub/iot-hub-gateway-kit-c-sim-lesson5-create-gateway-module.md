---
title: Create your first gateway module and add it to the hello_world sample app | Microsoft Docs
description: Create a module and add it to a sample app to customize module behaviors.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: ''

ms.assetid: 5dc51d73-f748-4c50-8611-251c79e7443b
ms.service: iot-hub
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/17/2016
ms.author: xshi

---
[!INCLUDE [iot-hub-gateway-kit-c-lesson5-create-gateway-module-s1](../../includes/iot-hub-gateway-kit-c-lesson5-create-gateway-module-s1.md)]

1. Initialize the configuration files by running the following commands:

   ```bash
   cd iot-hub-c-intel-nuc-gateway-getting-started
   cd Lesson5
   npm install
   gulp init
   ```

1. Update the gateway configuration file with the MAC address of Intel NUC. Skip this step if you have gone through the lesson to [run a simulated device sample app to send data to Azure IoT Hub][sim_app].

   1. Open the gateway configuration file by running the following command:

      ```bash
      # For Windows command prompt
      code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

      # For MacOS or Ubuntu
      code ~/.iot-hub-getting-started/config-gateway.json
      ```

   1. Update the gateway's MAC address when you [set up Intel NUC as a IoT gateway][setup_nuc], and then save the file.

1. Compile the sample source code by running the following command:

   ```bash
   gulp compile
   ```

   The command transfers the sample source code to Intel NUC and runs `build.sh` to compile it.

1. Run the `hello_world` app on Intel NUC by running the following command:

   ```bash
   gulp run
   ```

   The command runs `../Tools/run-hello-world.js` that is specified in `config.json` to start the sample app on Intel NUC.

   ![run_sample](media/iot-hub-gateway-kit-lessons/lesson5/run_sample.png)

[!INCLUDE [iot-hub-gateway-kit-c-lesson5-create-gateway-module-s2](../../includes/iot-hub-gateway-kit-c-lesson5-create-gateway-module-s2.md)]

<!-- Images and links -->

[sim_app]: iot-hub-gateway-kit-c-sim-lesson3-configure-simulated-device-app.md
[setup_nuc]: iot-hub-gateway-kit-c-sim-lesson1-set-up-nuc.md