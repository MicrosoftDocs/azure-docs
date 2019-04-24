---
title: Install Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Azure IoT Edge installation instructions for Linux containers on Windows 10, Windows Server, and Windows IoT Core
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: kgremban
---

# Use IoT Edge on Windows to run Linux containers

Test IoT Edge modules for Linux devices using a Windows machine. 

In a production scenario, Windows devices should only run Windows containers. However, a common development scenario is to use a Windows computer to build IoT Edge modules for Linux devices. The IoT Edge runtime for Windows allows you to run Linux containers for **testing and development** purposes. 

This article lists the steps to install the Azure IoT Edge runtime using Linux containers on your Windows x64 (AMD/Intel) system. To learn more about the IoT Edge runtime installer, including details about all the installation parameters, see [Install the Azure IoT Edge runtime on Windows](how-to-install-iot-edge-windows.md).

## Prerequisites

Use this section to review whether your Windows device can support IoT Edge, and to prepare it for a container engine before installation. 

### Supported Windows versions

Azure IoT Edge with Linux containers can run on the following versions of Windows: 
* Windows 10 Anniversary update (build 14393) or newer
* Windows Server 2016 or newer

For more information about what's included in the latest version of IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

If you want to install IoT Edge on a virtual machine, enable nested virtualization and allocate at least 2-GB memory. How you enable nested virtualization is different depending on the hypervisor your use. For Hyper-V, generation 2 virtual machines have nested virtualization enabled by default. For VMWare, there's a toggle to enable the feature on your virtual machine. 

### Prepare the container engine 

Azure IoT Edge relies on a [OCI-compatible](https://www.opencontainers.org/) container engine. The biggest configuration difference between running Windows and Linux containers on a Windows machine is that the IoT Edge installation includes a Windows container runtime, but you need to provide your own runtime for Linux containers before installing IoT Edge. 

To set up a Windows machine to develop and test containers for Linux devices, you can use [Docker Desktop](https://www.docker.com/docker-windows) as your container engine. You need to install Docker and configure it to [use Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers) before installing IoT Edge.  

If your IoT Edge device is a Windows computer, check that it meets the [system requirements](https://docs.microsoft.com/virtualization/hyper-v-on-windows/reference/hyper-v-requirements) for Hyper-V.

## Install IoT Edge on a new device

>[!NOTE]
>Azure IoT Edge software packages are subject to the license terms located in the packages (in the LICENSE directory). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

A PowerShell script downloads and installs the Azure IoT Edge security daemon. The security daemon then starts the first of two runtime modules, the IoT Edge agent, which enables remote deployments of other modules. 

When you install the IoT Edge runtime for the first time on a device, you need to provision the device with an identity from an IoT hub. A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to set up. 

You can read more about the different installation options and parameters in the article [Install the Azure IoT Edge runtime on Windows](how-to-install-iot-edge-windows.md). Once you have Docker Desktop installed and configured for Linux containers, the main installation difference is declaring Linux with the **-ContainerOs** parameter. For example: 

1. If you haven't already, follow the steps in [Register a new Azure IoT Edge device](how-to-register-device-portal.md) to register your device and retrieve the device connection string. 

2. Run PowerShell as an administrator.

3. The **Deploy-IoTEdge** command checks that your Windows machine is on a supported version, turns on the containers feature if necessary, and then downloads the IoT Edge runtime. Declare Linux as the container operating system so that the Deploy-IoTEdge command doesn't install the Moby engine for Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge -ContainerOs Linux
   ```

4. Your machine may restart automatically. If you are prompted by the Deploy-IoTEdge command to reboot, do so now. 

5. Run PowerShell as an administrator again.

6. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers. Declare Linux as the container operating system so that the IoT Edge runtime will point to Docker Desktop as the default container engine. 

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ContainerOs Linux
   ```

7. When prompted, provide the device connection string that will associate this physical device with a device ID in IoT Hub. 

## Verify successful installation

Check the status of the IoT Edge service. It should be listed as running.  

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes. If you just finished installing the IoT Edge runtime, you may see a list of errors from the time between running **Deploy-IoTEdge** and **Initialize-IoTEdge**. These errors are expected, as the service is trying to start before being configured. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules. After a new installation, the only module you should see running is **edgeAgent**. After you [deploy IoT Edge modules](how-to-deploy-modules-portal.md), you will see others. 

```powershell
iotedge list
```

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems installing IoT Edge properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).
