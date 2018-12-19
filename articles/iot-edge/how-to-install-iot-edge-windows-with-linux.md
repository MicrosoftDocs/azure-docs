---
title: How to install Azure IoT Edge on Windows with Linux containers | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows with Linux containers
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 08/27/2018
ms.author: kgremban
---
# Install the Azure IoT Edge runtime on Windows to use with Linux containers

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. 

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime with Linux containers on your Windows x64 (AMD/Intel) system. Windows support is currently in Preview.

>[!NOTE]
Using Linux containers on Windows sytems is not a recommended or supported production configuration for Azure IoT Edge. However, it can be used for development and testing purposes.

## Supported Windows versions
Azure IoT Edge can be used for development and testing on following versions of Windows, when using Linux containers:
  * Windows 10 or newer desktop operating systems.
  * Windows Server 2016 or new server operating systems.

For more information about which operating systems are currently supported, refer to [Azure IoT Edge support](support.md#operating-systems). 

## Install the container runtime 

Azure IoT Edge relies on a [OCI-compatible](https://www.opencontainers.org/) container runtime (for example, Docker). 

You can use [Docker for Windows](https://www.docker.com/docker-windows) for development and testing. Configure Docker for Windows [to use Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

## Install the Azure IoT Edge Security Daemon

>[!NOTE]
>Azure IoT Edge software packages are subject to the license terms located in the packages (in the LICENSE directory). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to provision. Depending on your provisioning choice, choose the appropriate installation script. 

### Option 1: Install and manually provision

1. Follow the steps in [Register a new Azure IoT Edge device](how-to-register-device-portal.md) to register your device and retrieve the device connection string. 

2. On your IoT Edge device, run PowerShell as an administrator. 

3. Download and install the IoT Edge runtime. 

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
   Install-SecurityDaemon -Manual -ContainerOs Linux
   ```

4. When prompted for a **DeviceConnectionString**, provide the connection string that you retrieved from IoT Hub. Do not include quotes around the connection string. 

### Option 2: Install and automatically provision

1. Follow the steps in [Create and provision a simulated TPM Edge device on Windows](how-to-auto-provision-simulated-device-windows.md) to set up the Device Provisioning Service and retrieve its **Scope ID**, simulate a TPM device and retrieve its **Registration ID**, then create an individual enrollment. Once your device is registered in your IoT Hub, continue with the installation.  

   >[!TIP]
   >Keep the window that's running the TPM simulator open during your installation and testing. 

2. On your IoT Edge device, run PowerShell as an administrator. 

3. Download and install the IoT Edge runtime. 

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
   Install-SecurityDaemon -Dps -ContainerOs Linux
   ```

4. When prompted, provide the **ScopeID** and **RegistrationID** for your provisioning service and device.

## Verify successful installation

You can check the status of the IoT Edge service by: 

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes using:

```powershell

# Displays logs from last 5 min, newest at the bottom.

Get-WinEvent -ea SilentlyContinue `
  -FilterHashtable @{ProviderName= "iotedged";
    LogName = "application"; StartTime = [datetime]::Now.AddMinutes(-5)} |
  select TimeCreated, Message |
  sort-object @{Expression="TimeCreated";Descending=$false} |
  format-table -autosize -wrap
```

And, list running modules with:

```powershell
iotedge list
```

## Tips and suggestions

If your network has a proxy server, follow the steps in [Configure your IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md) to install and start the IoT Edge runtime.

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems with the Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.
