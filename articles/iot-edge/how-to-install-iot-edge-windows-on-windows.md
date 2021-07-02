---
title: Install Azure IoT Edge for Windows | Microsoft Docs
description: Install Azure IoT Edge for Windows containers on Windows devices 
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 12/18/2020
ms.author: kgremban
monikerRange: "iotedge-2018-06"

---

# Install and manage Azure IoT Edge with Windows containers

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

There are two steps to setting up an IoT Edge device. The first step is to install the runtime and its dependencies. The second step is to connect the device to its identity in the cloud and set up authentication with IoT Hub.

This article lists the steps to install the Azure IoT Edge runtime with Windows containers. If you are looking to use Linux containers on a Windows device, please see the [Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md) article.

>[!NOTE]
>Azure IoT Edge with Windows containers will not be supported starting with version 1.2 of Azure IoT Edge.
>
>Consider using the new method for running IoT Edge on Windows devices, [Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).

## Prerequisites

* A Windows device

  IoT Edge with Windows containers requires Windows version 1809/build 17763, which is the latest [Windows long term support build](/windows/release-information/). Be sure to review the [supported systems list](support.md#operating-systems) for a list of supported SKUs.

* A [registered device ID](how-to-register-device.md)

  If you registered your device with symmetric key authentication, have the device connection string ready.

  If you registered your device with X.509 self-signed certificate authentication, have at least one of the identity certificates that you used to register the device and its matching private private key available on your device.

## Install a container engine

Azure IoT Edge relies on an OCI-compatible container runtime like [Moby](https://github.com/moby/moby). A Moby-based engine that is included in the installation script. There are no additional steps to install the engine.

## Install the IoT Edge security daemon

1. Run PowerShell as an administrator.

   Use an AMD64 session of PowerShell, not PowerShell(x86). If you're unsure which session type you're using, run the following command:

   ```powershell
   (Get-Process -Id $PID).StartInfo.EnvironmentVariables["PROCESSOR_ARCHITECTURE"]
   ```

2. Run the [Deploy-IoTEdge](reference-windows-scripts.md#deploy-iotedge) command, which performs the following tasks:

   * Checks that your Windows machine is on a supported version.
   * Turns on the containers feature.
   * Downloads the moby engine and the IoT Edge runtime.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

3. Restart your device if prompted.

When you install IoT Edge on a device, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Point the installer to a local directory for offline installation.

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

## Provision the device with its cloud identity

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to set up the device with its cloud identity and authentication information.

Choose the next section based on which authentication type you want to use:

* [Option 1: Authenticate with symmetric keys](#option-1-authenticate-with-symmetric-keys)
* [Option 2: Authenticate with X.509 certificates](#option-2-authenticate-with-x509-certificates)

### Option 1: Authenticate with symmetric keys

At this point, the IoT Edge runtime is installed on your Windows device, and you need to provision the device with its cloud identity and authentication information.

This section walks through the steps to provision a device with symmetric key authentication. You should have registered your device in IoT Hub, and retrieved the connection string from the device information. If not, follow the steps in [Register an IoT Edge device in IoT Hub](how-to-register-device.md).

1. On the IoT Edge device, run PowerShell as an administrator.

2. Use the [Initialize-IoTEdge](reference-windows-scripts.md#initialize-iotedge) command to configure the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ManualConnectionString -ContainerOs Windows
   ```

   * If you downloaded the IoTEdgeSecurityDaemon.ps1 script onto your device for offline or specific version installation, be sure to reference the local copy of the script.

      ```powershell
      . <path>/IoTEdgeSecurityDaemon.ps1
      Initialize-IoTEdge -ManualX509
      ```

3. When prompted, provide the device connection string that you retrieved in the previous section. The device connection string associates the physical device with a device ID in IoT Hub and provides authentication information.

   The device connection string takes the following format, and should not include quotation marks: `HostName={IoT hub name}.azure-devices.net;DeviceId={device name};SharedAccessKey={key}`

When you provision a device manually, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Declare a specific edgeAgent container image, and provide credentials if it's in a private registry

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

### Option 2: Authenticate with X.509 certificates

At this point, the IoT Edge runtime is installed on your Windows device, and you need to provision the device with its cloud identity and authentication information.

This section walks through the steps to provision a device with X.509 certificate authentication. You should have registered your device in IoT Hub, providing thumbprints that match the certificate and private key located on your IoT Edge device. If not, follow the steps in [Register an IoT Edge device in IoT Hub](how-to-register-device.md).

1. On the IoT Edge device, run PowerShell as an administrator.

2. Use the [Initialize-IoTEdge](reference-windows-scripts.md#initialize-iotedge) command to configure the IoT Edge runtime on your machine.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ManualX509
   ```

   * If you downloaded the IoTEdgeSecurityDaemon.ps1 script onto your device for offline or specific version installation, be sure to reference the local copy of the script.

      ```powershell
      . <path>/IoTEdgeSecurityDaemon.ps1
      Initialize-IoTEdge -ManualX509
      ```

3. When prompted, provide the following information:

   * **IotHubHostName**: Hostname of the IoT hub the device will connect to. For example, `{IoT hub name}.azure-devices.net`.
   * **DeviceId**: The ID that you provided when you registered the device.
   * **X509IdentityCertificate**: Absolute path to an identity certificate on the device. For example, `C:\path\identity_certificate.pem`.
   * **X509IdentityPrivateKey**: Absolute path to the private key file for the provided identity certificate. For example, `C:\path\identity_key.pem`.

When you provision a device manually, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Declare a specific edgeAgent container image, and provide credentials if it's in a private registry

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

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
   . <path>\IoTEdgeSecurityDaemon.ps1
   Deploy-IoTEdge -OfflineInstallationPath <path>
   ```

   The deployment command will use any components found in the local file directory provided. If either the .cab file or the Visual C++ installer is missing, it will attempt to download them.

## Update IoT Edge

Use the `Update-IoTEdge` command to update the security daemon. The script automatically pulls the latest version of the security daemon.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Update-IoTEdge
```

Running the Update-IoTEdge command removes and updates the security daemon from your device, along with the two runtime container images. The config.yaml file is kept on the device, as well as data from the Moby container engine. Keeping the configuration information means that you don't have to provide the connection string or Device Provisioning Service information for your device again during the update process.

If you want to update to a specific version of the security daemon, find the version from 1.1 release channel you want to target from [IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). In that version, download the **Microsoft-Azure-IoTEdge.cab** file. Then, use the `-OfflineInstallationPath` parameter to point to the local file location. For example:

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Update-IoTEdge -OfflineInstallationPath <absolute path to directory>
```

>[!NOTE]
>The `-OfflineInstallationPath` parameter looks for a file named **Microsoft-Azure-IoTEdge.cab** in the directory provided. Rename the file to remove the architecture suffix if it has one.

If you want to update a device offline, find the version you want to target from [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). In that version, download the *IoTEdgeSecurityDaemon.ps1* and *Microsoft-Azure-IoTEdge.cab* files. It's important to use the PowerShell script from the same release as the .cab file that you use because the functionality changes to support the features in each release.

If the .cab file you downloaded has an architecture suffix on it, rename the file to just **Microsoft-Azure-IoTEdge.cab**.

To update with offline components, [dot source](/powershell/module/microsoft.powershell.core/about/about_scripts#script-scope-and-dot-sourcing) the local copy of the PowerShell script. Then, use the `-OfflineInstallationPath` parameter as part of the `Update-IoTEdge` command and provide the absolute path to the file directory. For example,

```powershell
. <path>\IoTEdgeSecurityDaemon.ps1
Update-IoTEdge -OfflineInstallationPath <path>
```

For more information about update options, use the command `Get-Help Update-IoTEdge -full` or refer to [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your device, use the following commands.

If you want to remove the IoT Edge installation from your Windows device, use the [Uninstall-IoTEdge](reference-windows-scripts.md#uninstall-iotedge) command from an administrative PowerShell window. This command removes the IoT Edge runtime, along with your existing configuration and the Moby engine data.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Uninstall-IoTEdge
```

For more information about uninstallation options, use the command `Get-Help Uninstall-IoTEdge -full`.

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
