---
title: Install Azure IoT Edge on Windows | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows 10, Windows Server, and Windows IoT Core
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 03/14/2019
ms.author: kgremban
ms.custom: seodec18
---
# Install the Azure IoT Edge runtime on Windows

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. 

To learn more about the IoT Edge runtime, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime on your Windows x64 (AMD/Intel) system. Windows support is currently in Preview.

> [!NOTE]
> A known Windows operating system issue prevents transition to sleep and hibernate power states when IoT Edge modules (process-isolated Windows Nano Server containers) are running. This issue impacts battery life on the device.
>
> As a workaround, use the command `Stop-Service iotedge` to stop any running IoT Edge modules before using these power states. 

<!--
> [!NOTE]
> Using Linux containers on Windows systems is not a recommended or supported production configuration for Azure IoT Edge. However, it can be used for development and testing purposes.
-->

Using Linux container on Windows systems is not a recommended or supported production configuration for Azure IoT Edge. However, it can be used for development and testing purposes. 

## Prerequisites

Use this section to review whether your Windows device can support IoT Edge, and to prepare it for a container engine before installation. 

### Supported Windows versions

Azure IoT Edge supports different versions of Windows, depending on whether you're running Windows containers or Linux containers. 

The latest version of Azure IoT Edge with Windows containers can run on the following versions of Windows:
* Windows 10 or IoT Core with October 2018 update (build 17763)
* Windows Server 2019 (build 17763)

The latest version of Azure IoT Edge with Linux containers can run on the following versions of Windows: 
* Windows 10 Anniversary update (build 14393) or newer
* Windows Server 2016 or newer

For more information about which operating systems are currently supported, see [Azure IoT Edge support](support.md#operating-systems). 

For more information about what's included in the latest version of IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

### Prepare for a container engine 

Azure IoT Edge relies on a [OCI-compatible](https://www.opencontainers.org/) container engine. For production scenarios, use the Moby engine included in the installation script to run Windows containers on your Windows device. For developing and testing, you can run Linux containers on your Windows device, but you need to install and configure a container engine before installing IoT Edge. For either scenario, see the following sections for prerequisites to prepare your device. 

If you want to install IoT Edge on a virtual machine, enable nested virtualization and allocate at least 2-GB memory. How you enable nested virtualization is different depending on the hypervisor your use. For Hyper-V, generation 2 virtual machines have nested virtualization enabled by default. For VMWare, there's a toggle to enable the feature on your virtual machine. 

#### Moby engine for Windows containers

For Windows devices running IoT Edge in production scenarios, Moby is the only officially supported container engine. The installation script automatically installs the Moby engine on your device before installing IoT Edge. Prepare your device by turning on the Containers feature. 

1. In the start bar, search for **Turn Windows features on or off** and open the control panel program.
2. Find and select **Containers**.
3. Select **OK**. 

#### Docker for Linux containers

If you're using Windows to develop and test containers for Linux devices, you can use [Docker for Windows](https://www.docker.com/docker-windows) as your container engine. Docker can be configured to [use Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers). You need to install Docker and configure it before installing IoT Edge. Linux containers are not supported on Windows devices in production. 

If your IoT Edge device is a Windows computer, check that it meets the [system requirements](https://docs.microsoft.com/virtualization/hyper-v-on-windows/reference/hyper-v-requirements) for Hyper-V.

## Install IoT Edge on a new device

>[!NOTE]
>Azure IoT Edge software packages are subject to the license terms located in the packages (in the LICENSE directory). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

A PowerShell script downloads and installs the Azure IoT Edge security daemon. The security daemon then starts the first of two runtime modules, the IoT Edge agent, which enables remote deployments of other modules. 

When you install the IoT Edge runtime for the first time on a device, you need to provision the device with an identity from an IoT hub. A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to set up. Depending on your provisioning choice, choose the appropriate installation script. 

The following sections describe the common use cases and parameters for the IoT Edge installation script on a new device. 

### Option 1: Install and manually provision

In this first option, you provide a device connection string generated by IoT Hub to provision the device. 

Follow the steps in [Register a new Azure IoT Edge device](how-to-register-device-portal.md) to register your device and retrieve the device connection string. 

This example shows a manual installation with Windows containers:

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -Manual -ContainerOs Windows -DeviceConnectionString '<connection-string>'
```

When you install and provision a device manually, you can use additional parameters to modify the installation including:
* Direct traffic to go through a proxy server
* Point the installer to an offline directory
* Declare a specific agent container image, and provide credentials if it's in a private registry
* Skip the Moby CLI installation

For more information about these installation options, continue reading this article or skip to learn about [All installation parameters](#all-installation-parameters).

### Option 2: Install and automatically provision

In this second option, you provision the device using the IoT Hub Device Provisioning Service. Provide the **Scope ID** from a Device Provisioning Service instance, and the **Registration ID** from your device.

Follow the steps in [Create and provision a simulated TPM Edge device on Windows](how-to-auto-provision-simulated-device-windows.md) to set up the Device Provisioning Service and retrieve its **Scope ID**, simulate a TPM device and retrieve its **Registration ID**, then create an individual enrollment. Once your device is registered in your IoT Hub, continue with the installation.  

   >[!TIP]
   >Keep the window that's running the TPM simulator open during your installation and testing. 

The following example shows an automatic installation with Windows containers:

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -Dps -ContainerOs Windows -ScopeId <DPS scope ID> -RegistrationId <device registration ID>
```

When you install and provision a device manually, you can use additional parameters to modify the installation including:
* Direct traffic to go through a proxy server
* Point the installer to an offline directory
* Declare a specific agent container image, and provide credentials if it's in a private registry
* Skip the Moby CLI installation

For more information about these installation options, continue reading this article or skip to learn about [All installation parameters](#all-installation-parameters).

## Update an existing installation

If you've already installed the IoT Edge runtime on a device before and provisioned it with an identity from IoT Hub, then you can use a simplified installation script. The flag `-ExistingConfig` declares that an IoT Edge configuration file already exists on the device. The configuration file contains information about the device identity as well as certificates and network settings. You can use this installation option whether your device was originally provisioned manually or automatically. 

For more information, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

This example shows an installation that points to an existing configuration file, and uses Windows containers: 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -ExistingConfig -ContainerOs Windows
```

When you install IoT Edge from an existing configuration file, you can use additional parameters to modify the installation, including:
* Direct traffic to go through a proxy server
* Point the installer to an offline directory, or 
* Skip the Moby CLI installation. 

You can't declare an IoT Edge agent container image with script parameters, because that information is already set in the configuration file from the previous installation. If you want to modify the agent container image, do so in the config.yaml file. 

For more information about these installation options, continue reading this article or skip to learn about [All installation parameters](#all-installation-parameters).

## Offline installation

During installation four files are downloaded: 
* IoT Edge security daemon (iotedgd) zip 
* Moby engine zip
* Moby CLI zip
* Visual C++ redistributable package (VC runtime) msi

You can download one or all of these files ahead of time to the device, then point the installation script at the directory that contains the files. The installer checks the directory first, and then only downloads components that aren't found. If all four files are available offline, you can install with no internet connection. You can also use this feature to override the online versions of one or more components.  

For the latest installation files along with previous versions, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases)

To install with offline components, use the `-OfflineInstallationPath` parameter and provide the absolute path to the file directory. For example,

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -Manual -DeviceConnectionString '<connection-string>' -OfflineInstallationPath C:\Downloads\iotedgeoffline
```

## All installation parameters

The previous sections introduced common installation scenarios with examples of how to use parameters to modify the installation script. This section provides a reference table of the valid parameters you can use to install IoT Edge. For more information, run `get-help Install-SecurityDaemon -full` in a PowerShell window. 

To install IoT Edge with an existing configuration, your installation command can use these common parameters: 

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| **Manual** | None | **Switch parameter**. Every installation must be declared either manual, DPS, or existingconfig.<br><br>Declares that you will provide a device connection string to provision the device manually |
| **Dps** | None | **Switch parameter**. Every installation must be declared either manual, DPS, or existingconfig.<br><br>Declares that you will provide a Device Provisioning Service (DPS) scope ID and your device's Registration ID to provision through DPS.  |
| **ExistingConfig** | None | **Switch parameter**. Every installation must be declared either manual, DPS, or existingconfig.<br><br>Declares that a config.yaml file already exists on the device with its provisioning information. |
| **DeviceConnectionString** | A connection string from an IoT Edge device registered in an IoT Hub, in single quotes | **Required** for manual installation. If you don't provide a connection string in the script parameters, you will be prompted for one during installation. |
| **ScopeId** | A scope ID from an instance of Device Provisioning Service associated with your IoT Hub. | **Required** for DPS installation. If you don't provide a scope ID in the script parameters, you will be prompted for one during installation. |
| **RegistrationId** | A registration ID generated by your device | **Required** for DPS installation. If you don't provide a registration ID in the script parameters, you will be prompted for one during installation. |
| **ContainerOs** | **Windows** or **Linux** | If no container OS is specified, Linux is the default value. For Windows containers, a container engine will be included in the installation. For Linux containers, you need to install a container engine before starting the installation. Running Linux containers on Windows is a useful development scenario, but not supported in production. |
| **Proxy** | Proxy URL | Include this parameter if your device needs to go through a proxy server to reach the internet. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **InvokeWebRequestParameters** | Hashtable of parameters and values | During installation, several web requests are made. Use this field to set parameters for those web requests. This parameter is useful to configure credentials for proxy servers. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **OfflineInstallationPath** | Directory path | If this parameter is included, the installer will check the directory for the iotedged zip, Moby engine zip, Moby CLI zip, and VC Runtime MSI files required for installation. If all four files are in the directory, you can install IoT Edge while offline. You can also use this parameter to override the online version of a specific component. |
| **AgentImage** | IoT Edge agent image URI | By default, a new IoT Edge installation uses the latest rolling tag for the IoT Edge agent image. Use this parameter to set a specific tag for the image version, or to provide your own agent image. For more information, see [Understand IoT Edge tags](how-to-update-iot-edge.md#understand-iot-edge-tags). |
| **Username** | Container registry username | Use this parameter only if you set the -AgentImage parameter to a container in a private registry. Provide a username with access to the registry. |
| **Password** | Secure password string | Use this parameter only if you set the -AgentImage parameter to a container in a private registry. Provide the password to access the registry. | 
| **SkipMobyCli** | None | Only applicable if -ContainerOS is set to Windows. Don't install the Moby CLI (docker.exe) to $MobyInstallDirectory. |

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

After a new installation, the only module you should see running is **edgeAgent**. After you [deploy IoT Edge modules](how-to-deploy-modules-portal.md), you will see others. 

## Manage module containers

The IoT Edge service requires a container engine running on your device. When you deploy a module to a device, the IoT Edge runtime uses the container engine to pull the container image from a registry in the cloud. The IoT Edge service enables you to interact with your modules and retrieve logs, but sometimes you may want to use the container engine to interact with the container itself. 

For more information about module concepts, see [Understand Azure IoT Edge modules](iot-edge-modules.md). 

If you're running Windows containers on your Windows IoT Edge device, then the IoT Edge installation included the Moby container engine. If you're developing Linux containers on your Windows development machine, you're probably using Docker Desktop. The Moby engine was based on the same standards as Docker, and was designed to run in parallel on the same machine as Docker Desktop. For that reason, if you want to target containers managed by the Moby engine, you have to specifically target that engine instead of Docker. 

For example, to list all Docker images, use the following command:

```powershell
docker images
```

To list all Moby images, modify the same command with a pointer to the Moby engine: 

```powershell
docker -H npipe:////./pipe/iotedge_moby_engine images
```

The engine URI is listed in the output of the installation script, or you can find it in the container runtime settings section for the config.yaml file. 

![moby_runtime uri in config.yaml](./media/how-to-install-iot-edge-windows/moby-runtime-uri.png)

For more information about commands you can use to interact with containers and images running on your device, see [Docker command-line interfaces](https://docs.docker.com/engine/reference/commandline/docker/).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your Windows device, use the following command from an administrative PowerShell window. This command removes the IoT Edge runtime, along with your existing configuration and the Moby engine data. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Uninstall-SecurityDaemon -DeleteConfig -DeleteMobyDataRoot
```

If you intend to reinstall IoT Edge on your device, leave out the `-DeleteConfig` and `-DeleteMobyDataRoot` parameters so that you can reinstall the security daemon later with the existing configuration information. 

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems installing IoT Edge properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).
