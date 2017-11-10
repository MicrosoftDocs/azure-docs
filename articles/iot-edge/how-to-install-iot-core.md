---
title: Install Azure IoT Edge on IoT Core | Microsoft Docs 
description: Install the Azure IoT Edge runtime on a Windows IoT Core device
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.reviewer: veyalla
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Install the IoT Edge runtime on Windows IoT Core - preview

The Azure IoT Edge Runtime can run even on tiny Single Board Computer (SBC) devices which are very prevalent in the IoT industry. This article walks through provisioning the runtime on a [MinnowBoard Turbot][lnk-minnow] development board running Windows IoT Core.

## Install the runtime

1. Install [Windows 10 IoT Core Dashboard][lnk-core] on a host system.
1. Follow the steps in [Set up your device][lnk-board] to configure your board with the MinnowBoard Turbot/MAX Build 16299 image. 
1. Turn on the device, then [login remotely with PowerShell][lnk-powershell].
2. Run the following command in the PowerShell console to install IoT Edge runtime and configure the prerequisites:

   ```powershell
   Invoke-Expression (Invoke-WebRequest -useb https://aka.ms/iotedgewin)
   ```

   This script provides the following:
   * Docker, configured to use Windows containers. If you already have Docker on your machine, go through the steps to [switch to Windows containers][lnk-docker-containers]. 
   * Python 3.6
   * The IoT Edge control script (iotedgectl.exe)

You may see informational output from the iotedgectl.exe tool in red in the remote PowerShell window. This doesn't necessarily indicate errors. 

## Next steps

Now that you have a device running the IoT Edge runtime, learn how to [Deploy and monitor IoT Edge modules at scale][lnk-deploy].

<!--Links-->
[lnk-minnow]: https://minnowboard.org/ 
[lnk-core]: https://docs.microsoft.com/windows/iot-core/connect-your-device/iotdashboard
[lnk-board]: https://developer.microsoft.com/windows/iot/Docs/GetStarted/mbm/sdcard/stable/getstartedstep2
[lnk-powershell]: https://docs.microsoft.com/windows/iot-core/connect-your-device/powershell
[lnk-deploy]: how-to-deploy-monitor.md