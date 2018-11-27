---
title: Install Azure IoT Edge on IoT Core | Microsoft Docs 
description: Install the Azure IoT Edge runtime on a Windows IoT Core device
author: kgremban
manager: philmea
ms.author: kgremban
ms.reviewer: veyalla
ms.date: 03/05/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Install the IoT Edge runtime on Windows IoT Core - preview

Azure IoT Edge and [Windows IoT Core](https://docs.microsoft.com/windows/iot-core/) work together to enable edge computing on even small devices. The Azure IoT Edge Runtime can run even on tiny Single Board Computer (SBC) devices which are very prevalent in the IoT industry. 

This article walks through provisioning the runtime on a development board running Windows IoT Core. 

**Currently, Windows IoT Core supports Azure IoT Edge only on Intel x64-based processors.**

## Install the container runtime

1. Configure your board with **Build 17134 (RS4)** IoT Core image. 
1. Turn on the device, then [login remotely with PowerShell](https://docs.microsoft.com/windows/iot-core/connect-your-device/powershell).
1. In the PowerShell console, install the container runtime: 

   ```powershell
   Invoke-WebRequest https://master.dockerproject.org/windows/x86_64/docker-0.0.0-dev.zip -o temp.zip
   Expand-Archive .\temp.zip $env:ProgramFiles -f
   Remove-Item .\temp.zip
   $env:Path += ";$env:programfiles\docker"
   SETX /M PATH "$env:Path"
   dockerd --register-service
   start-service docker
   ```

   >[!NOTE]
   >This container runtime is from the Moby project build server, and is intended for evaluation purposes only. It's not tested, endorsed, or supported by Docker.

## Finish installing

Install the IoT Edge Security Daemon and configure it using instructions in [this article](how-to-install-iot-edge-windows-with-windows.md)

## Next steps

Now that you have a device running the IoT Edge runtime, learn how to [Deploy and monitor IoT Edge modules at scale](how-to-deploy-monitor.md).