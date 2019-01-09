---
title: include file
description: include file
services: iot-edge
author: kgremban
ms.service: iot-edge
ms.topic: include
ms.date: 08/10/2018
ms.author: kgremban
ms.custom: include file
---

### Delete local resources

If you want to remove the IoT Edge runtime and related resources from your device, use the appropriate commands for your device operating system. 

#### Windows

Uninstall the IoT Edge runtime.

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
   Uninstall-SecurityDaemon
   ```

When the IoT Edge runtime is removed, the containers that it created are stopped, but still exist on your device. View all containers.

   ```powershell
   docker ps -a
   ```

Delete the runtime containers that were created on your device.

   ```powershell
   docker rm -f edgeHub
   docker rm -f edgeAgent
   ```

Delete any additional containers that were listed in the `docker ps` output by referring to the container names. 

#### Linux

Remove the IoT Edge runtime.

   ```bash
   sudo apt-get remove --purge iotedge
   ```

When the IoT Edge runtime is removed, the containers that it created are stopped, but still exist on your device. View all containers.

   ```bash
   sudo docker ps -a
   ```

Delete the runtime containers that were created on your device.

   ```bash
   docker rm -f edgeHub
   docker rm -f edgeAgent
   ```

Delete any additional containers that were listed in the `docker ps` output by referring to the container names. 

Remove the container runtime.

   ```bash
   sudo apt-get remove --purge moby
   ```