---
title: Update IoT Edge version on devices - Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security subsystem and the IoT Edge runtime
keywords: 
author: PatAltimore

ms.author: patricka
ms.date: 06/03/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update IoT Edge

[!INCLUDE [iot-edge-version-1.1-or-1.4](./includes/iot-edge-version-1.1-or-1.4.md)]

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available.

Two logical components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security subsystem. Although the architecture of the security subsystem [changed between version 1.1 and 1.2](iot-edge-security-manager.md), its overall responsibilities remained the same. It runs on the device, handles security-based tasks, and starts the modules when the device starts. Currently, the security subsystem can only be updated from the device itself. The second component is the runtime, made up of the IoT Edge hub and IoT Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely.

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Update the security subsystem

The IoT Edge security subsystem includes a set of native components that need to be updated using the package manager on the IoT Edge device.

Check the version of the security subsystem running on your device by using the command `iotedge version`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the version.

<!-- Separated Linux content support RHEL - Some content repeated in RHEL tab-->
# [Ubuntu / Debian / Raspberry Pi OS](#tab/ubuntu+debian+rpios)

>[!IMPORTANT]
>If you are updating a device from version 1.0 or 1.1 to the latest release, there are differences in the installation and configuration processes that require extra steps. For more information, refer to the steps later in this article: [Special case: Update from 1.0 or 1.1 to latest release](#special-case-update-from-10-or-11-to-latest-release).

On Linux x64 devices, use apt-get or your appropriate package manager to update the runtime module to the latest version.

Update apt.

   ```bash
   sudo apt-get update
   ```

   > [!NOTE]
   > For instructions to get the latest repository configuration from Microsoft see the preliminary steps to [Install IoT Edge](how-to-provision-single-device-linux-symmetric.md#install-iot-edge).

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Check to see which versions of IoT Edge are available.

   ```bash
   apt list -a iotedge
   ```

If you want to update to the most recent version of the runtime module, use the following command which also updates **libiothsm-std** to the latest version:

   ```bash
   sudo apt-get install iotedge
   ```

If you want to update to a specific version of the runtime module, specify the version from the apt list output. Whenever **iotedge** is updated, it automatically tries to update the **libiothsm-std** package to its latest version, which may cause a dependency conflict. If you aren't going to the most recent version, be sure to target both packages for the same version. For example, the following command installs a specific version of the 1.1 release:

   ```bash
   sudo apt-get install iotedge=1.1.1 libiothsm-std=1.1.1
   ```

If the version that you want to install is not available through apt-get, you can use curl to target any version from the [IoT Edge releases](https://github.com/Azure/azure-iotedge/releases) repository. For whichever version you want to install, locate the appropriate **libiothsm-std** and **iotedge** files for your device. For each file, right-click the file link and copy the link address. Use the link address to install the specific versions of those components:

```bash
curl -L <libiothsm-std link> -o libiothsm-std.deb && sudo apt-get install ./libiothsm-std.deb
curl -L <iotedge link> -o iotedge.deb && sudo apt-get install ./iotedge.deb
```
<!-- end 1.1 -->
:::moniker-end

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

Check to see which versions of IoT Edge are available.

```bash
apt list -a aziot-edge
```

If you want to update to the most recent version of IoT Edge, use the following command which also updates the [identity service](https://azure.github.io/iot-identity-service/) to the latest version:

```bash
sudo apt-get install aziot-edge defender-iot-micro-agent-edge
```

It is recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](../defender-for-iot/device-builders/overview.md).

<!-- end iotedge-2020-11 -->
:::moniker-end

<!--Repeated Linux content for RHEL-->
# [Red Hat Enterprise Linux](#tab/rhel)

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

IoT Edge version 1.1 isn't supported on Red Hat Enterprise Linux 8.

:::moniker-end
<!-- end 1.1 -->

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

Check to see which versions of IoT Edge are available.

```bash
yum list aziot-edge
```

If you want to update to the most recent version of IoT Edge, use the following command which also updates the [identity service](https://azure.github.io/iot-identity-service/) to the latest version:

```bash
sudo yum install aziot-edge
```
---

<!-- end iotedge-2020-11 -->
:::moniker-end
<!--End repeated Linux content for RHEL-->

# [Linux on Windows](#tab/linuxonwindows)

For information about IoT Edge for Linux on Windows updates, see [EFLOW Updates](./iot-edge-for-linux-on-windows-updates.md).

# [Windows](#tab/windows)

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is no support for IoT Edge version 1.4 running on Windows devices.
>
>To view the steps for updating IoT Edge for Linux on Windows, see [IoT Edge 1.1](?view=iotedge-2018-06&preserve-view=true&tabs=windows).

:::moniker-end
<!-- end iotedge-2020-11 -->

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

With IoT Edge for Windows, IoT Edge runs directly on the Windows device.

Use the `Update-IoTEdge` command to update the module runtime. The script automatically pulls the latest version of the module runtime.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Update-IoTEdge
```

Running the `Update-IoTEdge` command removes and updates the runtime module from your device, along with the two runtime container images. The config.yaml file is kept on the device, as well as data from the Moby container engine. Keeping the configuration information means that you don't have to provide the connection string or Device Provisioning Service information for your device again during the update process.

If you want to update to a specific version of the security subsystem, find the version from 1.1 release channel you want to target from [IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). In that version, download the **Microsoft-Azure-IoTEdge.cab** file. Then, use the `-OfflineInstallationPath` parameter to point to the local file location. For example:

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

:::moniker-end
<!-- end 1.1 -->

---

## Update the runtime containers

The way that you update the IoT Edge agent and IoT Edge hub containers depends on whether you use rolling tags (like 1.1) or specific tags (like 1.1.1) in your deployment.

Check the version of the IoT Edge agent and IoT Edge hub modules currently on your device using the commands `iotedge logs edgeAgent` or `iotedge logs edgeHub`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the runtime module versions.

  ![Find container version in logs](./media/how-to-update-iot-edge/container-version.png)

### Understand IoT Edge tags

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they are associated with. There are two different ways to use tags with the runtime images:

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.1 is updated whenever there's a new release to point to the latest 1.1.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. Deployments from the Azure portal default to rolling tags. *This approach is suggested for development purposes.*

* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.1.0 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. *This approach is suggested for production purposes.*

### Update a rolling tag image

If you use rolling tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.1**) then you need to force the container runtime on your device to pull the latest version of the image.

Delete the local version of the image from your IoT Edge device. On Windows machines, uninstalling the security subsystem also removes the runtime images, so you don't need to take this step again.

```bash
docker rmi mcr.microsoft.com/azureiotedge-hub:1.1
docker rmi mcr.microsoft.com/azureiotedge-agent:1.1
```

You may need to use the force `-f` flag to remove the images.

The IoT Edge service will pull the latest versions of the runtime images and automatically start them on your device again.

### Update a specific tag image

If you use specific tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.1.1**) then all you need to do is update the tag in your deployment manifest and apply the changes to your device.

1. In the IoT Hub in the Azure portal, select your IoT Edge device, and select **Set Modules**.

1. In the **IoT Edge Modules** section, select **Runtime Settings**.

   ![Configure runtime settings](./media/how-to-update-iot-edge/configure-runtime.png)

1. In **Runtime Settings**, update the **Image** value for **Edge Hub** with the desired version. Don't select **Save** yet.

   ![Update Edge Hub Image version](./media/how-to-update-iot-edge/runtime-settings-edgehub.png)

1. Collapse the **Edge Hub** settings, or scroll down, and update the **Image** value for **Edge Agent** with the same desired version.

   ![Update Edge Hub Agent version](./media/how-to-update-iot-edge/runtime-settings-edgeagent.png)

1. Select **Save**.

1. Select **Review + create**, review the deployment, and select **Create**.

## Special case: Update from 1.0 or 1.1 to latest release

# [Ubuntu / Debian / Raspberry Pi OS](#tab/ubuntu+debian+rpios)

Starting with version 1.2, the IoT Edge service uses a new package name and has some differences in the installation and configuration processes. If you have an IoT Edge device running version 1.0 or 1.1, use these instructions to learn how to update to the latest release.

Some of the key differences between the latest release and version 1.1 and earlier include:

* The package name changed from **iotedge** to **aziot-edge**.
* The **libiothsm-std** package is no longer used. If you used the standard package provided as part of the IoT Edge release, then your configurations can be transferred to the new version. If you used a different implementation of libiothsm-std, then any user-provided certificates like the device identity certificate, device CA, and trust bundle will need to be reconfigured.
* A new identity service, **[aziot-identity-service](https://azure.github.io/iot-identity-service/)** was introduced as part of the 1.2 release. This service handles the identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub, like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md).
* The default config file has a new name and location. Formerly `/etc/iotedge/config.yaml`, your device configuration information is now expected to be in `/etc/aziot/config.toml` by default. The `iotedge config import` command can be used to help migrate configuration information from the old location and syntax to the new one.
  * The import command cannot detect or modify access rules to a device's trusted platform module (TPM). If your device uses TPM attestation, you need to manually update the /etc/udev/rules.d/tpmaccess.rules file to give access to the aziottpm service. For more information, see [Give IoT Edge access to the TPM](how-to-auto-provision-simulated-device-linux.md?view=iotedge-2020-11&preserve-view=true#give-iot-edge-access-to-the-tpm).
* The workload API in the latest version saves encrypted secrets in a new format. If you upgrade from an older version to latest version, the existing master encryption key is imported. The workload API can read secrets saved in the prior format using the imported encryption key. However, the workload API can't write encrypted secrets in the old format. Once a secret is re-encrypted by a module, it is saved in the new format. Secrets encrypted in the latest version are unreadable by the same module in version 1.1. If you persist encrypted data to a host-mounted folder or volume, always create a backup copy of the data *before* upgrading to retain the ability to downgrade if necessary.
* For backward compatibility when connecting devices that do not support TLS 1.2, you can configure Edge Hub to still accept TLS 1.0 or 1.1 via the [SslProtocols environment variable](https://github.com/Azure/iotedge/blob/main/doc/EnvironmentVariables.md#edgehub).  Please note that support for [TLS 1.0 and 1.1 in IoT Hub is considered legacy](../iot-hub/iot-hub-tls-support.md) and may also be removed from Edge Hub in future releases.  To avoid future issues, use TLS 1.2 as the only TLS version when connecting to Edge Hub or IoT Hub.
* The preview for the experimental MQTT broker in Edge Hub 1.2 has ended and is not included in Edge Hub 1.4. We are continuing to refine our plans for an MQTT broker based on feedback received. In the meantime, if you need a standards-compliant MQTT broker on IoT Edge, consider deploying an open-source broker like Mosquitto as an IoT Edge module. 
* Starting with version 1.2, when a backing image is removed from a container, the container keeps running and it persists across restarts. In 1.1, when a backing image is removed, the container is immediately recreated and the backing image is updated.

Before automating any update processes, validate that it works on test machines.

When you're ready, follow these steps to update IoT Edge on your devices:

1. Update apt.

   ```bash
   sudo apt-get update
   ```

1. Uninstall the previous version of IoT Edge, leaving your configuration files in place.

   ```bash
   sudo apt-get remove iotedge
   ```

1. Install the most recent version of IoT Edge, along with the IoT identity service and the Microsoft Defender for IoT micro agent for Edge. 

   ```bash
   sudo apt-get install aziot-edge defender-iot-micro-agent-edge
   ```
It's recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](../defender-for-iot/device-builders/overview.md).

1. Import your old config.yaml file into its new format, and apply the configuration info.

   ```bash
   sudo iotedge config import
   ```

Now that the IoT Edge service running on your devices has been updated, follow the steps in this article to also [Update the runtime containers](#update-the-runtime-containers).

# [Red Hat Enterprise Linux](#tab/rhel)

IoT Edge version 1.1 isn't supported on Red Hat Enterprise Linux 8.

# [Linux on Windows](#tab/linuxonwindows)

If you're using Windows containers or IoT Edge for Linux on Windows, this special case section does not apply.

# [Windows](#tab/windows)

Currently, there is no support for IoT Edge version 1.4 running on Windows devices.

---

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)