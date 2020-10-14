---
title: Install Azure IoT Edge | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows or Linux devices
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 10/07/2020
ms.author: kgremban
---

# Install or uninstall the Azure IoT Edge runtime

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

There are two steps to setting up an IoT Edge device. The first step is to install the runtime and its dependencies, which is covered by this article. The second step is to connect the device to its identity in the cloud and set up authentication with IoT Hub. Those steps are in the next articles.

This article lists the steps to install the Azure IoT Edge runtime on Linux or Windows devices. For Windows devices, you have an additional choice of using Linux containers or Windows containers. Currently, Windows containers on Windows are recommended for production scenarios. Linux containers on Windows are useful for development and testing scenarios, especially if you're developing on a Windows PC in order to deploy to Linux devices.

## Prerequisites

For the latest information about which operating systems are currently supported for production scenarios, see [Azure IoT Edge supported systems](support.md#operating-systems)

# [Linux](#tab/linux)

Have an X64, ARM32, or ARM64 Linux device. Microsoft provides installation packages for Ubuntu Server 16.04, Ubuntu Server 18.04, and Raspbian Stretch operating systems.

>[!NOTE]
>Support for ARM64 devices is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Prepare your device to access the Microsoft installation packages.

1. Install the repository configuration that matches your device operating system.

   * **Ubuntu Server 16.04**:

     ```bash
     curl https://packages.microsoft.com/config/ubuntu/16.04/multiarch/prod.list > ./microsoft-prod.list
     ```

   * **Ubuntu Server 18.04**:

     ```bash
     curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
     ```

   * **Raspbian Stretch**:

     ```bash
     curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
     ```

2. Copy the generated list to the sources.list.d directory.

   ```bash
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

3. Install the Microsoft GPG public key.

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

# [Windows](#tab/windows)

### Windows version

IoT Edge with Windows containers requires Windows version 1809/build 17762, which is the latest [Windows long term support build](/windows/release-information/). For development and test scenarios, any SKU (Pro, Enterprise, Server, etc.) that supports the containers feature will work. However, be sure to review the supported systems list before going to production.

IoT Edge with Linux containers can run on any version of Windows that meets the [requirements for Docker Desktop](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

### Container engine requirements

Azure IoT Edge relies on an [OCI-compatible](https://www.opencontainers.org/) container engine. Make sure your device can support containers.

If you are installing IoT Edge on a virtual machine, enable nested virtualization and allocate at least 2-GB memory. For Hyper-V, generation 2 virtual machines have nested virtualization enabled by default. For VMware, there's a toggle to enable the feature on your virtual machine.

---

Azure IoT Edge software packages are subject to the license terms located in each package (`usr/share/doc/{package-name}` or the `LICENSE` directory). Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use that package.

## Install a container engine

Azure IoT Edge relies on an OCI-compatible container runtime. For production scenarios, we recommended that you use the Moby-based engine. The Moby engine is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

# [Linux](#tab/linux)

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install the Moby engine.

   ```bash
   sudo apt-get install moby-engine
   ```

If you get errors when installing the Moby container engine, verify your Linux kernel for Moby compatibility. Some embedded device manufacturers ship device images that contain custom Linux kernels without the features required for container engine compatibility. Run the following command, which uses the [check-config script](https://github.com/moby/moby/blob/master/contrib/check-config.sh) provided by Moby, to check your kernel configuration:

   ```bash
   curl -sSL https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh -o check-config.sh
   chmod +x check-config.sh
   ./check-config.sh
   ```

In the output of the script, check that all items under `Generally Necessary` and `Network Drivers` are enabled. If you are missing features, enable them by rebuilding your kernel from source and selecting the associated modules for inclusion in the appropriate kernel .config. Similarly, if you are using a kernel configuration generator like `defconfig` or `menuconfig`, find and enable the respective features and rebuild your kernel accordingly. Once you have deployed your newly modified kernel, run the check-config script again to verify that all the required features were successfully enabled.

# [Windows](#tab/windows)

For production scenarios, use the Moby-based engine that is included in the installation script. There are no additional steps to install the engine.

For IoT Edge with Linux containers, you need to provide your own container runtime. Install [Docker Desktop](https://docs.docker.com/docker-for-windows/install/) on your device and configure it to [use Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers) before continuing.

---

## Install the IoT Edge security daemon

The IoT Edge security daemon provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The steps in these section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the [Offline or specific version installation](#offline-or-specific-version-installation) steps in the next section.

# [Linux](#tab/linux)

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Check to see which versions of IoT Edge are available.

   ```bash
   apt list -a iotedge
   ```

If you want to install the most recent version of the security daemon, use the following command that also installs the latest version of the **libiothsm-std** package:

   ```bash
   sudo apt-get install iotedge
   ```

If you want to install a specific version of the security daemon, specify the version from the apt list output. Also specify the same version for the **libiothsm-std** package, which otherwise would install its latest version. For example, the following command installs the most recent version of the 1.0.8 release:

   ```bash
   sudo apt-get install iotedge=1.0.8* libiothsm-std=1.0.8*
   ```

If the version that you want to install isn't listed, follow the [Offline or specific version installation](#offline-or-specific-version-installation) steps in the next section. That section shows you how to target any previous version of the IoT Edge security daemon, or release candidate versions.

# [Windows](#tab/windows)

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

   The `Deploy-IoTEdge` command defaults to using Windows containers. If you want to use Linux containers, add the `ContainerOs` parameter:

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge -ContainerOs Linux
   ```

3. At this point, the output may prompt you to restart. If so, restart your device now.

When you install IoT Edge on a device, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Point the installer to a local directory for offline installation.

For more information about these additional parameters, see [PowerShell scripts for IoT Edge on Windows](reference-windows-scripts.md).

---

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to register your device with IoT Hub and set up the device with its cloud identity and authentication information.

Choose the next article based on which authentication type you want to use:

* [Symmetric key authentication](how-to-manual-provision-symmetric-key.md) is faster to get started.
* [X.509 certificate authentication](how-to-manual-provision-x509.md) is more secure for production scenarios.

## Offline or specific version installation

The steps in this section are for scenarios not covered by the standard installation steps. This may include:

* Install IoT Edge while offline
* Install a release candidate version
* On Windows, install a version other than the latest

# [Linux](#tab/linux)

Use the steps in this section if you want to install a specific version of the Azure IoT Edge runtime that isn't available through `apt-get install`. The Microsoft package list only contains a limited set of recent versions and their sub-versions, so these steps are for anyone who wants to install an older version or a release candidate version.

Using curl commands, you can target the component files directly from the IoT Edge GitHub repository.

<!-- TODO: Offline installation? -->

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target.

2. Expand the **Assets** section for that version.

3. Every release should have new files for the IoT Edge security daemon and the hsmlib. Use the following commands to update those components.

   1. Find the **libiothsm-std** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   2. Use the copied link in the following command to install that version of the hsmlib:

      ```bash
      curl -L <libiothsm-std link> -o libiothsm-std.deb && sudo dpkg -i ./libiothsm-std.deb
      ```

   3. Find the **iotedge** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   4. Use the copied link in the following command to install that version of the IoT Edge security daemon.

      ```bash
      curl -L <iotedge link> -o iotedge.deb && sudo dpkg -i ./iotedge.deb
      ```

# [Windows](#tab/windows)

During installation three files are downloaded:

* A PowerShell script, which contains the installation instructions
* Microsoft Azure IoT Edge cab, which contains the IoT Edge security daemon (iotedged), Moby container engine, and Moby CLI
* Visual C++ redistributable package (VC runtime) installer

If your device will be offline during installation, or if you want to install a specific version of IoT Edge, you can download these files ahead of time to the device. When it's time to install, point the installation script at the directory that contains the downloaded files. The installer checks that directory first, and then only downloads components that aren't found. If all the files are available offline, you can install with no internet connection.

1. For the latest IoT Edge installation files along with previous versions, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

2. Find the version that you want to install, and download the following files from the **Assets** section of the release notes onto your IoT device:

   * IoTEdgeSecurityDaemon.ps1
   * Microsoft-Azure-IoTEdge-amd64.cab from releases 1.0.9 or newer, or Microsoft-Azure-IoTEdge.cab from releases 1.0.8 and older.

   Microsoft-Azure-IotEdge-arm32.cab is also available beginning in 1.0.9 for testing purposes only. IoT Edge is not currently supported on Windows ARM32 devices.

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

---

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to [Authenticate an IoT Edge device in IoT Hub](how-to-manual-provision-symmetric-key.md).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your device, use the following commands.

# [Linux](#tab/linux)

Remove the IoT Edge runtime.

```bash
sudo apt-get remove --purge iotedge
```

When the IoT Edge runtime is removed, any containers that it created are stopped but still exist on your device. View all containers to see which ones remain.

```bash
sudo docker ps -a
```

Delete the containers from your device, including the two runtime containers.

```bash
sudo docker rm -f <container name>
```

Finally, remove the container runtime from your device.

```bash
sudo apt-get remove --purge moby-cli
sudo apt-get remove --purge moby-engine
```

# [Windows](#tab/windows)

If you want to remove the IoT Edge installation from your Windows device, use the [Uninstall-IoTEdge](reference-windows-scripts.md#uninstall-iotedge) command from an administrative PowerShell window. This command removes the IoT Edge runtime, along with your existing configuration and the Moby engine data.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Uninstall-IoTEdge
```

For more information about uninstallation options, use the command `Get-Help Uninstall-IoTEdge -full`.

---

## Next steps

After installing the IoT Edge runtime, configure your device to connect with IoT Hub. The following articles walk through registering a new device in the cloud and then providing the device with its identity and authentication info.

Choose the next article based on which type of authentication you want to use:

* **Symmetric key**: Both IoT Hub and the IoT Edge device have a copy of a secure key. When the device connects to IoT Hub, they check that the keys match. This authentication method is faster to get started, but not as secure.

  [Set up an Azure IoT Edge device with symmetric key authentication](how-to-manual-provision-symmetric-key.md)

* **X.509 self-signed**: The IoT Edge device has X.509 identity certificates, and IoT Hub is given the thumbprint of the certificates. When the device connects to IoT Hub, they compare the certificate against its thumbprint. This authentication method is more secure, and recommended for production scenarios.

  [Set up an Azure IoT Edge device with X.509 certificate authentication](how-to-manual-provision-x509.md)