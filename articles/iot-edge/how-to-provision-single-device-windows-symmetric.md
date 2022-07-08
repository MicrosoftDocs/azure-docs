---
title: Create and provision an IoT Edge device on Windows using symmetric keys - Azure IoT Edge | Microsoft Docs
description: Create and provision a single Windows IoT Edge device in IoT Hub using manual provisioning with symmetric keys
author: PatAltimore
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: patricka
monikerRange: "iotedge-2018-06"
---

# Create and provision an IoT Edge device on Windows using symmetric keys

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides end-to-end instructions for registering and provisioning a Windows IoT Edge device.

>[!NOTE]
>Azure IoT Edge with Windows containers will not be supported starting with version 1.2 of Azure IoT Edge.
>
>Consider using the new method for running IoT Edge on Windows devices, [Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).
>
>If you want to use Azure IoT Edge for Linux on Windows, you can follow the steps in the [equivalent how-to guide](how-to-provision-single-device-linux-on-windows-symmetric.md).

Every device that connects to an IoT hub has a device ID that's used to track cloud-to-device or device-to-cloud communications. You configure a device with its connection information, which includes the IoT hub hostname, the device ID, and the information the device uses to authenticate to IoT Hub.

The steps in this article walk through a process called manual provisioning, where you connect a single device to its IoT hub. For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric keys**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method is faster to get started, but not as secure.

* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

  This authentication method is more secure and recommended for production scenarios.

This article covers using symmetric keys as your authentication method. If you want to use X.509 certificates, see [Create and provision an IoT Edge device on Windows using X.509 certificates](how-to-provision-single-device-windows-x509.md).

> [!NOTE]
> If you have many devices to set up and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub device provisioning service:
>
> * [Create and provision IoT Edge devices at scale using X.509 certificates](how-to-provision-devices-at-scale-windows-x509.md)
> * [Create and provision IoT Edge devices at scale with a TPM](how-to-provision-devices-at-scale-windows-tpm.md)
> * [Create and provision IoT Edge devices at scale using symmetric keys](how-to-provision-devices-at-scale-windows-symmetric.md)

## Prerequisites

This article covers registering your IoT Edge device and installing IoT Edge on it. These tasks have different prerequisites and utilities used to accomplish them. Make sure you have all the prerequisites covered before proceeding.

<!-- Device registration prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-register-device.md](../../includes/iot-edge-prerequisites-register-device.md)]

### Device requirements

A Windows device.

IoT Edge with Windows containers requires Windows version 1809/build 17763, which is the latest [Windows long term support build](/windows/release-information/). Be sure to review the [supported systems list](support.md#operating-systems) for a list of supported SKUs.

Note that the Windows versions on both the container and host must match. For more information, see [Could not start module due to OS mismatch](troubleshoot-common-errors.md#could-not-start-module-due-to-os-mismatch).

<!-- Register your device and View provisioning information H2s and content -->
[!INCLUDE [iot-edge-register-device-symmetric.md](../../includes/iot-edge-register-device-symmetric.md)]

<!-- Install IoT Edge on Windows H2 and content -->
[!INCLUDE [install-iot-edge-windows.md](../../includes/iot-edge-install-windows.md)]

## Provision the device with its cloud identity

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to set up the device with its cloud identity and authentication information.

1. On the IoT Edge device, run PowerShell as an administrator.

2. Use the [Initialize-IoTEdge](reference-windows-scripts.md#initialize-iotedge) command to configure the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ManualConnectionString -ContainerOs Windows
   ```

   * If you downloaded the IoTEdgeSecurityDaemon.ps1 script onto your device for offline or specific version installation, be sure to reference the local copy of the script.

      ```powershell
      . <path>/IoTEdgeSecurityDaemon.ps1
      Initialize-IoTEdge -ManualConnectionString -ContainerOs Windows
      ```

3. When prompted, provide the device connection string that you retrieved in the previous section. The device connection string associates the physical device with a device ID in IoT Hub and provides authentication information.

   The device connection string takes the following format, and should not include quotation marks: `HostName={IoT_hub_name}.azure-devices.net;DeviceId={device_name};SharedAccessKey={key}`

When you provision a device manually, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Declare a specific edgeAgent container image, and provide credentials if it's in a private registry

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

## Verify successful configuration

Verify that the runtime was successfully installed and configured on your IoT Edge device.

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules.

```powershell
iotedge list
```

## Offline or specific version installation (optional)

The steps in this section are for scenarios not covered by the standard installation steps. This may include:

* Install IoT Edge while offline
* Install a release candidate version
* Install a version other than the latest

During installation three files are downloaded:

* A PowerShell script, which contains the installation instructions
* Microsoft Azure IoT Edge cab, which contains the IoT Edge security daemon (iotedged), Moby container engine, and Moby CLI
* Visual C++ redistributable package (VC runtime) installer

If your device will be offline during installation, or if you want to install a specific version of IoT Edge, you can download these files ahead of time to the device. When it's time to install, point the installation script at the directory that contains the downloaded files. The installer checks that directory first, and then only downloads components that aren't found. If all the files are available offline, you can install with no internet connection.

1. For the latest IoT Edge installation files along with previous versions, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

2. Find the version that you want to install, and download the following files from the **Assets** section of the release notes onto your IoT device:

   * IoTEdgeSecurityDaemon.ps1
   * Microsoft-Azure-IoTEdge-amd64.cab from 1.1 release channel.

   It's important to use the PowerShell script from the same release as the .cab file that you use because the functionality changes to support the features in each release.

3. If the .cab file you downloaded has an architecture suffix on it, rename the file to just **Microsoft-Azure-IoTEdge.cab**.

4. Optionally, download an installer for Visual C++ redistributable. For example, the PowerShell script uses this version: [vc_redist.x64.exe](https://download.microsoft.com/download/0/6/4/064F84EA-D1DB-4EAA-9A5C-CC2F0FF6A638/vc_redist.x64.exe). Save the installer in the same folder on your IoT device as the IoT Edge files.

5. To install with offline components, [dot source](/powershell/module/microsoft.powershell.core/about/about_scripts#script-scope-and-dot-sourcing) the local copy of the PowerShell script.

6. Run the [Deploy-IoTEdge](reference-windows-scripts.md#deploy-iotedge) command with the `-OfflineInstallationPath` parameter. Provide the absolute path to the file directory. For example,

   ```powershell
   . path_to_powershell_module_here\IoTEdgeSecurityDaemon.ps1
   Deploy-IoTEdge -OfflineInstallationPath path_to_file_directory_here
   ```

   The deployment command will use any components found in the local file directory provided. If either the .cab file or the Visual C++ installer is missing, it will attempt to download them.

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your Windows device, use the [Uninstall-IoTEdge](reference-windows-scripts.md#uninstall-iotedge) command from an administrative PowerShell window. This command removes the IoT Edge runtime, along with your existing configuration and the Moby engine data.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Uninstall-IoTEdge
```

For more information about uninstallation options, use the command `Get-Help Uninstall-IoTEdge -full`.

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
