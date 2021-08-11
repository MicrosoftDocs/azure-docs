---
title: Update IoT Edge version on devices - Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security daemon and the IoT Edge runtime
keywords: 
author: kgremban

ms.author: kgremban
ms.date: 06/15/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update IoT Edge

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available.

Two components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security daemon, which runs on the device and starts the runtime modules when the device starts. Currently, the security daemon can only be updated from the device itself. The second component is the runtime, made up of the IoT Edge hub and IoT Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely.

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Update the security daemon

The IoT Edge security daemon is a native component that needs to be updated using the package manager on the IoT Edge device.

Check the version of the security daemon running on your device by using the command `iotedge version`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the version.

# [Linux](#tab/linux)

>[!IMPORTANT]
>If you are updating a device from version 1.0 or 1.1 to version 1.2, there are differences in the installation and configuration processes that require extra steps. For more information, refer to the steps later in this article: [Special case: Update from 1.0 or 1.1 to 1.2](#special-case-update-from-10-or-11-to-12).

On Linux x64 devices, use apt-get or your appropriate package manager to update the security daemon to the latest version.

Get the latest repository configuration from Microsoft:

* **Ubuntu Server 18.04**:

   ```bash
   curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
   ```

* **Raspberry Pi OS Stretch**:

   ```bash
   curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
   ```

Copy the generated list.

   ```bash
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

Install Microsoft GPG public key.

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

Update apt.

   ```bash
   sudo apt-get update
   ```

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Check to see which versions of IoT Edge are available.

   ```bash
   apt list -a iotedge
   ```

If you want to update to the most recent version of the security daemon, use the following command which also updates **libiothsm-std** to the latest version:

   ```bash
   sudo apt-get install iotedge
   ```

If you want to update to a specific version of the security daemon, specify the version from the apt list output. Whenever **iotedge** is updated, it automatically tries to update the **libiothsm-std** package to its latest version, which may cause a dependency conflict. If you aren't going to the most recent version, be sure to target both packages for the same version. For example, the following command installs a specific version of the 1.1 release:

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

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Check to see which versions of IoT Edge are available.

   ```bash
   apt list -a aziot-edge
   ```

If you want to update to the most recent version of IoT Edge, use the following command which also updates the identity service to the latest version:

   ```bash
   sudo apt-get install aziot-edge
   ```
<!-- end 1.2 -->
:::moniker-end

# [Linux on Windows](#tab/linuxonwindows)

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on Linux for Windows virtual machines.

:::moniker-end
<!-- end 1.2 -->

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

>[!IMPORTANT]
>If you are updating a device from the public preview version of IoT Edge for Linux on Windows to the generally available version, you need to uninstall and reinstall Azure IoT Edge.
>
>To find out if you're currently using the public preview version, navigate to **Settings** > **Apps** on your Windows device. Find **Azure IoT Edge** in the list of apps and features. If your listed version is 1.0.x, you are running the public preview version. Uninstall the app and then [Install and provision IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md) again. If your listed version is 1.1.x, you are running the generally available version and can receive updates through Microsoft Update.

With IoT Edge for Linux on Windows, IoT Edge runs in a Linux virtual machine hosted on a Windows device. This virtual machine is pre-installed with IoT Edge, and you cannot manually update or change the IoT Edge components. Instead, the virtual machine is managed with Microsoft Update to keep the components up to date automatically. 

To find the latest version of Azure IoT Edge for Linux on Windows, see [EFLOW releases](https://aka.ms/AzEFLOW-Releases).


To receive IoT Edge for Linux on Windows updates, the Windows host should be configured to receive updates for other Microsoft products. You can turn this option with the following steps:

1. Open **Settings** on the Windows host.

1. Select **Updates & Security**.

1. Select **Advanced options**.

1. Toggle the *Receive updates for other Microsoft products when you update Windows* button to **On**.

:::moniker-end
<!-- end 1.1 -->

# [Windows](#tab/windows)

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on Windows devices.

:::moniker-end
<!-- end 1.2 -->

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

With IoT Edge for Windows, IoT Edge runs directly on the Windows device. For update instructions using the PowerShell scripts, see [Install and manage Azure IoT Edge for Windows](how-to-install-iot-edge-windows-on-windows.md).

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

Delete the local version of the image from your IoT Edge device. On Windows machines, uninstalling the security daemon also removes the runtime images, so you don't need to take this step again.

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

## Special case: Update from 1.0 or 1.1 to 1.2

>[!NOTE]
>If you're using Windows containers or IoT Edge for Linux on Windows, this special case section does not apply.

Starting with version 1.2, the IoT Edge service uses a new package name and has some differences in the installation and configuration processes. If you have an IoT Edge device running version 1.0 or 1.1, use these instructions to learn how to update to 1.2.

>[!NOTE]
>Currently, there is no support for IoT Edge version 1.2 running on Windows devices.

Some of the key differences between 1.2 and earlier versions include:

* The package name changed from **iotedge** to **aziot-edge**.
* The **libiothsm-std** package is no longer used. If you used the standard package provided as part of the IoT Edge release, then your configurations can be transferred to the new version. If you used a different implementation of libiothsm-std, then any user-provided certificates like the device identity certificate, device CA, and trust bundle will need to be reconfigured.
* A new identity service, **aziot-identity-service** was introduced as part of the 1.2 release. This service handles the identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub, like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md).
* The default config file has a new name and location. Formerly `/etc/iotedge/config.yaml`, your device configuration information is now expected to be in `/etc/aziot/config.toml` by default. The `iotedge config import` command can be used to help migrate configuration information from the old location and syntax to the new one.
  * The import command cannot detect or modify access rules to a device's trusted platform module (TPM). If your device uses TPM attestation, you need to manually update the /etc/udev/rules.d/tpmaccess.rules file to give access to the aziottpm service. For more information, see [Give IoT Edge access to the TPM](how-to-auto-provision-simulated-device-linux.md?view=iotedge-2020-11&preserve-view=true#give-iot-edge-access-to-the-tpm).
* The workload API in version 1.2 saves encrypted secrets in a new format. If you upgrade from an older version to version 1.2, the existing master encryption key is imported. The workload API can read secrets saved in the prior format using the imported encryption key. However, the workload API can't write encrypted secrets in the old format. Once a secret is re-encrypted by a module, it is saved in the new format. Secrets encrypted in version 1.2 are unreadable by the same module in version 1.1. If you persist encrypted data to a host-mounted folder or volume, always create a backup copy of the data *before* upgrading to retain the ability to downgrade if necessary.

Before automating any update processes, validate that it works on test machines.

When you're ready, follow these steps to update IoT Edge on your devices:

1. Get the latest repository configuration from Microsoft:

   * **Ubuntu Server 18.04**:

     ```bash
     curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
     ```

   * **Raspberry Pi OS Stretch**:

     ```bash
     curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
     ```

2. Copy the generated list.

   ```bash
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

3. Install Microsoft GPG public key.

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

4. Update apt.

   ```bash
   sudo apt-get update
   ```

5. Uninstall the previous version of IoT Edge, leaving your configuration files in place.

   ```bash
   sudo apt-get remove iotedge
   ```

6. Install the most recent version of IoT Edge, along with the IoT identity service.

   ```bash
   sudo apt-get install aziot-edge
   ```

7. Import your old config.yaml file into its new format, and apply the configuration info.

   ```bash
   sudo iotedge config import
   ```

Now that the IoT Edge service running on your devices has been updated, follow the steps in this article to also [Update the runtime containers](#update-the-runtime-containers).

## Special case: Update to a release candidate version

>[!NOTE]
>If you're using Windows containers or IoT Edge for Linux on Windows, this special case section does not apply.

Azure IoT Edge regularly releases new versions of the IoT Edge service. Before each stable release, there is one or more release candidate (RC) versions. RC versions include all the planned features for the release, but are still going through testing and validation. If you want to test a new feature early, you can install an RC version and provide feedback through GitHub.

Release candidate versions follow the same numbering convention of releases, but have **-rc** plus an incremental number appended to the end. You can see the release candidates in the same list of [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases) as the stable versions. For example, find **1.2.0-rc4**, one of the release candidates released before **1.2.0**. You can also see that RC versions are marked with **pre-release** labels.

The IoT Edge agent and hub modules have RC versions that are tagged with the same convention. For example, **mcr.microsoft.com/azureiotedge-hub:1.2.0-rc4**.

As previews, release candidate versions aren't included as the latest version that the regular installers target. Instead, you need to manually target the assets for the RC version that you want to test. For the most part, installing or updating to an RC version is the same as targeting any other specific version of IoT Edge.

Use the sections in this article to learn how to update an IoT Edge device to a specific version of the security daemon or runtime modules.

If you're installing IoT Edge, rather than upgrading an existing installation, use the steps in [Offline or specific version installation](how-to-install-iot-edge.md#offline-or-specific-version-installation-optional).

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)
