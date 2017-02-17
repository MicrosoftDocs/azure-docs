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
ms.date: 1/24/2016
ms.author: xshi

---
[!INCLUDE [iot-hub-gateway-kit-c-lesson5-create-your-first-gateway-module-s1](../../includes/iot-hub-gateway-kit-c-lesson5-create-your-first-gateway-module-s1.md)]

1. Update the gateway configuration file with the MAC address of Intel NUC. Skip this step if you have gone through the lesson to [run a simulated device sample app to send data to Azure IoT Hub][sim_app].

   1. Open the gateway configuration file by running the following command:

      ```bash
      # For Windows command prompt
      code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

      # For MacOS or Ubuntu
      code ~/.iot-hub-getting-started/config-gateway.json
      ```

   1. Update the gateway's MAC address when you [set up Intel NUC as a IoT gateway][setup_nuc], and then save the file.

[!INCLUDE [iot-hub-gateway-kit-c-lesson5-create-your-first-gateway-module-s2](../../includes/iot-hub-gateway-kit-c-lesson5-create-your-first-gateway-module-s2.md)]

<!-- Images and links -->

[sim_app]: iot-hub-gateway-kit-c-sim-lesson3-configure-simulated-device-app.md
[setup_nuc]: iot-hub-gateway-kit-c-sim-lesson1-set-up-nuc.md