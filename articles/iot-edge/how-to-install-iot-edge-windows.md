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
ms.date: 04/09/2020
ms.author: kgremban
---
# Install the Azure IoT Edge runtime on Windows

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more about the IoT Edge runtime, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime on your Windows x64 (AMD/Intel) system using Windows containers.

> [!NOTE]
> A known Windows operating system issue prevents transition to sleep and hibernate power states when IoT Edge modules (process-isolated Windows Nano Server containers) are running. This issue impacts battery life on the device.
>
> As a workaround, use the command `Stop-Service iotedge` to stop any running IoT Edge modules before using these power states.

Using Linux containers on Windows systems is not a recommended or supported production configuration for Azure IoT Edge. However, it can be used for development and testing purposes. To learn more, see [Use IoT Edge on Windows to run Linux containers](how-to-install-iot-edge-windows-with-linux.md).

For information about what's included in the latest version of IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Prerequisites

Use this section to review whether your Windows device can support IoT Edge, and to prepare it for a container engine before installation.

### Supported Windows versions

IoT Edge for Windows requires Windows version 1809/build 17763, which is the latest [Windows long term support build](https://docs.microsoft.com/windows/release-information/). For Windows SKU support, see what is supported based on whether you're preparing for production scenarios or development and test scenarios:

* **Production**: For the latest information about which operating systems are currently supported for production scenarios, see [Azure IoT Edge supported systems](support.md#operating-systems).
* **Development and test**: For development and test scenarios, Azure IoT Edge with Windows containers can be installed on any SKU (Pro, Enterprise, Server etc.) of Windows build 17763 that supports the containers feature.

IoT Core devices must include the IoT Core Windows Containers optional feature to support the IoT Edge runtime. Use the following command in a [remote PowerShell session](https://docs.microsoft.com/windows/iot-core/connect-your-device/powershell) to check that Windows containers are supported on your device:

```powershell
Get-Service vmcompute
```

If the service is present, you should get a successful response with the service status listed as **running**. If the `vmcompute` service is not found, then your device does not meet the requirements for IoT Edge. Contact your hardware provider to ask about support for this feature.

### Prepare for a container engine

Azure IoT Edge relies on a [OCI-compatible](https://www.opencontainers.org/) container engine. For production scenarios, use the Moby engine included in the installation script to run Windows containers on your Windows device.

## Install IoT Edge on a new device

>[!NOTE]
>Azure IoT Edge software packages are subject to the license terms located in the packages (in the LICENSE directory). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

A PowerShell script downloads and installs the Azure IoT Edge security daemon. The security daemon then starts the first of two runtime modules, the IoT Edge agent, which enables remote deployments of other modules.

>[!TIP]
>For IoT Core devices, we recommend running the installation commands using a RemotePowerShell session. For more information, see [Using PowerShell for Windows IoT](https://docs.microsoft.com/windows/iot-core/connect-your-device/powershell).

When you install the IoT Edge runtime for the first time on a device, you need to provision the device with an identity from an IoT hub. A single IoT Edge device can be provisioned manually using a device connection string provided by IoT Hub. Or, you can use the Device Provisioning Service (DPS) to automatically provision devices, which is helpful when you have many devices to set up. Depending on your provisioning choice, choose the appropriate installation script.

The following sections describe the common use cases and parameters for the IoT Edge installation script on a new device.

### Option 1: Install and manually provision

In this first option, you provide a **device connection string** generated by IoT Hub to provision the device.

This example demonstrates a manual installation with Windows containers:

1. If you haven't already, register a new IoT Edge device and retrieve the **device connection string**. Copy the connection string to use later in this section. You can complete this step using the following tools:

   * [Azure portal](how-to-register-device.md#register-in-the-azure-portal)
   * [Azure CLI](how-to-register-device.md#register-with-the-azure-cli)
   * [Visual Studio Code](how-to-register-device.md#register-with-visual-studio-code)

2. Run PowerShell as an administrator.

   >[!NOTE]
   >Use an AMD64 session of PowerShell to install IoT Edge, not PowerShell (x86). If you're not sure which session type you're using, run the following command:
   >
   >```powershell
   >(Get-Process -Id $PID).StartInfo.EnvironmentVariables["PROCESSOR_ARCHITECTURE"]
   >```

3. The **Deploy-IoTEdge** command checks that your Windows machine is on a supported version, turns on the containers feature, and then downloads the moby runtime and the IoT Edge runtime. The command defaults to using Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

4. At this point, IoT Core devices may restart automatically. Other Windows 10 or Windows Server devices may prompt you to restart. If so, restart your device now. Once your device is ready, run PowerShell as an administrator again.

5. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge
   ```

6. When prompted, provide the device connection string that you retrieved in step 1. The device connection string associates the physical device with a device ID in IoT Hub.

   The device connection string takes the following format, and should not include quotation marks: `HostName={IoT hub name}.azure-devices.net;DeviceId={device name};SharedAccessKey={key}`

7. Use the steps in [Verify successful installation](#verify-successful-installation) to check the status of IoT Edge on your device.

When you install and provision a device manually, you can use additional parameters to modify the installation including:

* Direct traffic to go through a proxy server
* Point the installer to an offline directory
* Declare a specific agent container image, and provide credentials if it's in a private registry

For more information about these installation options, skip ahead to learn about [all installation parameters](#all-installation-parameters).

### Option 2: Install and automatically provision

In this second option, you provision the device using the IoT Hub Device Provisioning Service. Provide the **Scope ID** from a Device Provisioning Service instance along with any other information specific to your preferred [attestation mechanism](../iot-dps/concepts-security.md#attestation-mechanism):

* [Create and provision a simulated IoT Edge device with a virtual TPM on Windows](how-to-auto-provision-simulated-device-windows.md)
* [Create and provision a simulated IoT Edge device using X.509 certificates](how-to-auto-provision-x509-certs.md)
* [Create and provision an IoT Edge device using symmetric key attestation](how-to-auto-provision-symmetric-keys.md)

When you install and provision a device automatically, you can use additional parameters to modify the installation including:

* Direct traffic to go through a proxy server
* Point the installer to an offline directory
* Declare a specific agent container image, and provide credentials if it's in a private registry

For more information about these installation options, continue reading this article or skip to learn about [All installation parameters](#all-installation-parameters).

## Offline or specific version installation

During installation three files are downloaded:

* A PowerShell script, which contains the installation instructions
* Microsoft Azure IoT Edge cab, which contains the IoT Edge security daemon (iotedged), Moby container engine, and Moby CLI
* Visual C++ redistributable package (VC runtime) installer

If your device will be offline during installation, or if you want to install a specific version of IoT Edge, you can download these files ahead of time to the device. When it's time to install, point the installation script at the directory that contains the downloaded files. The installer checks that directory first, and then only downloads components that aren't found. If all the files are available offline, you can install with no internet connection.

You can also use the offline installation path parameter to update IoT Edge. For more information, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

1. For the latest IoT Edge installation files along with previous versions, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

2. Find the version that you want to install, and download the following files from the **Assets** section of the release notes onto your IoT device:

   * IoTEdgeSecurityDaemon.ps1
   * Microsoft-Azure-IoTEdge-amd64.cab from releases 1.0.9 or newer, or Microsoft-Azure-IoTEdge.cab from releases 1.0.8 and older.

   Microsoft-Azure-IotEdge-arm32.cab is also available beginning in 1.0.9 for testing purposes only. IoT Edge is not currently supported on Windows ARM32 devices.

   It's important to use the PowerShell script from the same release as the .cab file that you use because the functionality changes to support the features in each release.

3. If the .cab file you downloaded has an architecture suffix on it, rename the file to just **Microsoft-Azure-IoTEdge.cab**.

4. Optionally, download an installer for Visual C++ redistributable. For example, the PowerShell script uses this version: [vc_redist.x64.exe](https://download.microsoft.com/download/0/6/4/064F84EA-D1DB-4EAA-9A5C-CC2F0FF6A638/vc_redist.x64.exe). Save the installer in the same folder on your IoT device as the IoT Edge files.

5. To install with offline components, [dot source](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_scripts?view=powershell-7#script-scope-and-dot-sourcing) the local copy of the PowerShell script. Then, use the `-OfflineInstallationPath` parameter as part of the `Deploy-IoTEdge` command and provide the absolute path to the file directory. For example,

   ```powershell
   . <path>\IoTEdgeSecurityDaemon.ps1
   Deploy-IoTEdge -OfflineInstallationPath <path>
   ```

   The deployment command will use any components found in the local file directory provided. If either the .cab file or the Visual C++ installer is missing, it will attempt to download them.

6. Run the `Initialize-IoTEdge` command to provision your device with an identity in IoT Hub. Either provide a device connection string for manual provisioning, or choose one of the methods described in the previous [automatically provision](#option-2-install-and-automatically-provision) section.

   If your device restarted after running `Deploy-IoTEdge`, dot source the PowerShell script again before running `Initialize-IoTEdge`.

For more information about the offline installation option, skip ahead to learn about [all installation parameters](#all-installation-parameters).

## Verify successful installation

Check the status of the IoT Edge service. It should be listed as running.  

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes. If you just finished installing the IoT Edge runtime, you may see a list of errors from the time between running **Deploy-IoTEdge** and **Initialize-IoTEdge**. These errors are expected, as the service is trying to start before being configured.

```powershell
. {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

Run the [troubleshooting tool](troubleshoot.md#run-the-check-command) to check for the most common configuration and networking errors.

```powershell
iotedge check
```

Until you deploy your first module to IoT Edge on your device, the **$edgeHub** system module will not be deployed to the device. As a result, the automated check will return an error for the `Edge Hub can bind to ports on host` connectivity check. This error can be ignored unless it occurs after deploying a module to the device.

Finally, list running modules:

```powershell
iotedge list
```

After a new installation, the only module you should see running is **edgeAgent**. After you [deploy IoT Edge modules](how-to-deploy-modules-portal.md) for the first time, the other system module, **edgeHub**, will start on the device too.

## Manage module containers

The IoT Edge service requires a container engine running on your device. When you deploy a module to a device, the IoT Edge runtime uses the container engine to pull the container image from a registry in the cloud. The IoT Edge service enables you to interact with your modules and retrieve logs, but sometimes you may want to use the container engine to interact with the container itself.

For more information about module concepts, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

If you're running Windows containers on your Windows IoT Edge device, then the IoT Edge installation included the Moby container engine. The Moby engine was based on the same standards as Docker, and was designed to run in parallel on the same machine as Docker Desktop. For that reason, if you want to target containers managed by the Moby engine, you have to specifically target that engine instead of Docker.

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
Uninstall-IoTEdge
```

The Uninstall-IoTEdge command does not work on Windows IoT Core. To remove IoT Edge from Windows IoT Core devices, you need to redeploy your Windows IoT Core image.

For more information about uninstallation options, use the command `Get-Help Uninstall-IoTEdge -full`.

## Verify installation script

The installation commands provided in this article use the Invoke-WebRequest cmdlet to request the installation script from `aka.ms/iotedge-win`. This link points to the`IoTEdgeSecurityDaemon.ps1` script from the most recent [IoT Edge release](https://github.com/Azure/azure-iotedge/releases). You can also download this script, or a version of the script from a specific release, to run the installation commands on your IoT Edge device.

The provided script is signed to increase security. You can verify the signature by downloading the script to your device then running the following PowerShell command:

```powershell
Get-AuthenticodeSignature "C:\<path>\IotEdgeSecurityDaemon.ps1"
```

The output status is **Valid** if the signature is verified.

## All installation parameters

The previous sections introduced common installation scenarios with examples of how to use parameters to modify the installation script. This section provides reference tables of the common parameters used to install, update, or uninstall IoT Edge.

### Deploy-IoTEdge

The Deploy-IoTEdge command downloads and deploys the IoT Edge Security Daemon and its dependencies. The deployment command accepts these common parameters, among others. For the full list, use the command `Get-Help Deploy-IoTEdge -full`.  

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| **ContainerOs** | **Windows** or **Linux** | If no container operating system is specified, Windows is the default value.<br><br>For Windows containers, IoT Edge uses the moby container engine included in the installation. For Linux containers, you need to install a container engine before starting the installation. |
| **Proxy** | Proxy URL | Include this parameter if your device needs to go through a proxy server to reach the internet. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **OfflineInstallationPath** | Directory path | If this parameter is included, the installer will check the listed directory for the IoT Edge cab and VC Runtime MSI files required for installation. Any files not found in the directory are downloaded. If both files are in the directory, you can install IoT Edge without an internet connection. You can also use this parameter to use a specific version. |
| **InvokeWebRequestParameters** | Hashtable of parameters and values | During installation, several web requests are made. Use this field to set parameters for those web requests. This parameter is useful to configure credentials for proxy servers. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **RestartIfNeeded** | none | This flag allows the deployment script to restart the machine without prompting, if necessary. |

### Initialize-IoTEdge

The Initialize-IoTEdge command configures IoT Edge with your device connection string and operational details. Much of the information generated by this command is then stored in the iotedge\config.yaml file. The initialization command accepts these common parameters, among others. For the full list, use the command `Get-Help Initialize-IoTEdge -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| **Manual** | None | **Switch parameter**. If no provisioning type is specified, manual is the default value.<br><br>Declares that you will provide a device connection string to provision the device manually |
| **Dps** | None | **Switch parameter**. If no provisioning type is specified, manual is the default value.<br><br>Declares that you will provide a Device Provisioning Service (DPS) scope ID and your device's Registration ID to provision through DPS.  |
| **DeviceConnectionString** | A connection string from an IoT Edge device registered in an IoT Hub, in single quotes | **Required** for manual provisioning. If you don't provide a connection string in the script parameters, you will be prompted for one. |
| **ScopeId** | A scope ID from an instance of Device Provisioning Service associated with your IoT Hub. | **Required** for DPS provisioning. If you don't provide a scope ID in the script parameters, you will be prompted for one. |
| **RegistrationId** | A registration ID generated by your device | **Required** for DPS provisioning if using TPM or symmetric key attestation. **Optional** if using X.509 certificate attestation. |
| **X509IdentityCertificate** | The URI path to the X.509 device identity certificate on the device. | **Required** for DPS provisioning if using X.509 certificate attestation. |
| **X509IdentityPrivateKey** | The URI path to the X.509 device identity certificate key on the device. | **Required** for DPS provisioning if using X.509 certificate attestation. |
| **SymmetricKey** | The symmetric key used to provision the IoT Edge device identity when using DPS | **Required** for DPS provisioning if using symmetric key attestation. |
| **ContainerOs** | **Windows** or **Linux** | If no container operating system is specified, Windows is the default value.<br><br>For Windows containers, IoT Edge uses the moby container engine included in the installation. For Linux containers, you need to install a container engine before starting the installation. |
| **InvokeWebRequestParameters** | Hashtable of parameters and values | During installation, several web requests are made. Use this field to set parameters for those web requests. This parameter is useful to configure credentials for proxy servers. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **AgentImage** | IoT Edge agent image URI | By default, a new IoT Edge installation uses the latest rolling tag for the IoT Edge agent image. Use this parameter to set a specific tag for the image version, or to provide your own agent image. For more information, see [Understand IoT Edge tags](how-to-update-iot-edge.md#understand-iot-edge-tags). |
| **Username** | Container registry username | Use this parameter only if you set the -AgentImage parameter to a container in a private registry. Provide a username with access to the registry. |
| **Password** | Secure password string | Use this parameter only if you set the -AgentImage parameter to a container in a private registry. Provide the password to access the registry. |

### Update-IoTEdge

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| **ContainerOs** | **Windows** or **Linux** | If no container OS is specified, Windows is the default value. For Windows containers, a container engine will be included in the installation. For Linux containers, you need to install a container engine before starting the installation. |
| **Proxy** | Proxy URL | Include this parameter if your device needs to go through a proxy server to reach the internet. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **InvokeWebRequestParameters** | Hashtable of parameters and values | During installation, several web requests are made. Use this field to set parameters for those web requests. This parameter is useful to configure credentials for proxy servers. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md). |
| **OfflineInstallationPath** | Directory path | If this parameter is included, the installer will check the listed directory for the IoT Edge cab and VC Runtime MSI files required for installation. Any files not found in the directory are downloaded. If both files are in the directory, you can install IoT Edge without an internet connection. You can also use this parameter to use a specific version. |
| **RestartIfNeeded** | none | This flag allows the deployment script to restart the machine without prompting, if necessary. |

### Uninstall-IoTEdge

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| **Force** | none | This flag forces the uninstallation in case the previous attempt to uninstall was unsuccessful.
| **RestartIfNeeded** | none | This flag allows the uninstall script to restart the machine without prompting, if necessary. |

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems installing IoT Edge properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).
