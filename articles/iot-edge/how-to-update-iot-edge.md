---
title: Update IoT Edge version on devices - Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security subsystem and the IoT Edge runtime
keywords: 
author: PatAltimore

ms.author: patricka
ms.date: 2/2/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update IoT Edge

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available.

Two logical components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security subsystem. Although the architecture of the security subsystem [changed between version 1.1 and 1.2](iot-edge-security-manager.md), its overall responsibilities remained the same. It runs on the device, handles security-based tasks, and starts the modules when the device starts. Currently, the security subsystem can only be updated from the device itself. The second component is the runtime, made up of the IoT Edge hub and IoT Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely.

You should update the IoT Edge runtime and application layers use the same release version. While mismatched versions are supported, they aren't tested together. Use the following sections in this article to update both the runtime and application layers on a device:

1. [Update the security subsystem](#update-the-security-subsystem)
1. [Update the runtime containers](#update-the-runtime-containers)
1. Verify versions match
   * On your device, use `iotedge version` to check the security subsystem version. The output includes the major, minor, and revision version numbers. For example,  *iotedge 1.4.2*.
   * In your device deployment runtime settings, verify *edgehub* and *edgeagent* image URI versions match the major and minor version of the security subsystem. If the security subsystem version is 1.4.2, the image versions would be 1.4. For example, *mcr.microsoft.com/azureiotedge-hub:1.4* and *mcr.microsoft.com/azureiotedge-agent:1.4*.

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Update the security subsystem

The IoT Edge security subsystem includes a set of native components that need to be updated using the package manager on the IoT Edge device.

Check the version of the security subsystem running on your device by using the command `iotedge version`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the version.

<!-- Separated Linux content support RHEL - Some content repeated in RHEL tab-->
# [Ubuntu / Debian](#tab/linux)

>[!IMPORTANT]
>If you are updating a device from version 1.0 or 1.1 to the latest release, there are differences in the installation and configuration processes that require extra steps. For more information, refer to the steps later in this article: [Special case: Update from 1.0 or 1.1 to latest release](#special-case-update-from-10-or-11-to-latest-release).

On Linux x64 devices, use apt-get or your appropriate package manager to update the runtime module to the latest version.

Update apt.

   ```bash
   sudo apt-get update
   ```

   > [!NOTE]
   > For instructions to get the latest repository configuration from Microsoft see the preliminary steps to [Install IoT Edge](how-to-provision-single-device-linux-symmetric.md#install-iot-edge).

Check to see which versions of IoT Edge are available.

```bash
apt list -a aziot-edge
```

If you want to update to the most recent version of IoT Edge, use the following command, which also updates the [identity service](https://azure.github.io/iot-identity-service/) to the latest version:

```bash
sudo apt-get install aziot-edge defender-iot-micro-agent-edge
```

It's recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](../defender-for-iot/device-builders/overview.md).

<!--Repeated Linux content for RHEL-->
# [Red Hat Enterprise Linux](#tab/rhel)

Check to see which versions of IoT Edge are available.

```bash
yum list aziot-edge
```

If you want to update to the most recent version of IoT Edge, use the following command, which also updates the [identity service](https://azure.github.io/iot-identity-service/) to the latest version:

```bash
sudo yum install aziot-edge
```
<!--End repeated Linux content for RHEL-->

# [Linux on Windows](#tab/linuxonwindows)

For information about IoT Edge for Linux on Windows updates, see [EFLOW Updates](./iot-edge-for-linux-on-windows-updates.md).

# [Windows](#tab/windows)

>[!NOTE]
>Currently, there is no support for IoT Edge version 1.4 running on Windows devices.
>

---

Then, reapply configuration to ensure system is fully updated.

```bash
sudo iotedge config apply
```

## Update the runtime containers

The way that you update the IoT Edge agent and IoT Edge hub containers depends on whether you use rolling tags (like 1.1) or specific tags (like 1.1.1) in your deployment.

Check the version of the IoT Edge agent and IoT Edge hub modules currently on your device using the commands `iotedge logs edgeAgent` or `iotedge logs edgeHub`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the runtime module versions.

:::image type="content" source="media/how-to-update-iot-edge/container-version.png" alt-text="Screenshot of where to find the container version in console logs." lightbox="media/how-to-update-iot-edge/container-version.png":::

### Understand IoT Edge tags

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they're associated with. There are two different ways to use tags with the runtime images:

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

1. On the **Modules** tab, select **Runtime Settings**.

   :::image type="content" source="media/how-to-update-iot-edge/runtime-settings.png" alt-text="Screenshot that shows location of the Runtime Settings tab.":::

1. In **Runtime Settings**, update the **Image URI** value in the **Edge Agent** section with the desired version. Don't select **Apply** yet.

   :::image type="content" source="media/how-to-update-iot-edge/runtime-settings-agent.png" alt-text="Screenshot that shows where to update the image URI with your version in the Edge Agent.":::

1. Select the **Edge Hub** tab and update the **Image URI** value with the same desired version.

   :::image type="content" source="media/how-to-update-iot-edge/runtime-settings-hub.png" alt-text="Screenshot that shows where to update the image URI with your version in the Edge Hub.":::

1. Select **Apply** to save changes.

1. Select **Review + create**, review the deployment as seen in the JSON file, and select **Create**.

## Special case: Update from 1.0 or 1.1 to latest release

# [Ubuntu / Debian](#tab/linux)

Starting with version 1.2, the IoT Edge service uses a new package name and has some differences in the installation and configuration processes. If you have an IoT Edge device running version 1.0 or 1.1, use these instructions to learn how to update to the latest release.

Some of the key differences between the latest release and version 1.1 and earlier include:

* The package name changed from **iotedge** to **aziot-edge**.
* The **libiothsm-std** package is no longer used. If you used the standard package provided as part of the IoT Edge release, then your configurations can be transferred to the new version. If you used a different implementation of libiothsm-std, then any user-provided certificates like the device identity certificate, device CA, and trust bundle will need to be reconfigured.
* A new identity service, **[aziot-identity-service](https://azure.github.io/iot-identity-service/)** was introduced as part of the 1.2 release. This service handles the identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub, like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md).
* The default config file has a new name and location. Formerly `/etc/iotedge/config.yaml`, your device configuration information is now expected to be in `/etc/aziot/config.toml` by default. The `iotedge config import` command can be used to help migrate configuration information from the old location and syntax to the new one.
  * The import command can't detect or modify access rules to a device's trusted platform module (TPM). If your device uses TPM attestation, you need to manually update the /etc/udev/rules.d/tpmaccess.rules file to give access to the aziottpm service. For more information, see [Give IoT Edge access to the TPM](how-to-auto-provision-simulated-device-linux.md#give-iot-edge-access-to-the-tpm).
* The workload API in the latest version saves encrypted secrets in a new format. If you upgrade from an older version to latest version, the existing master encryption key is imported. The workload API can read secrets saved in the prior format using the imported encryption key. However, the workload API can't write encrypted secrets in the old format. Once a secret is re-encrypted by a module, it's saved in the new format. Secrets encrypted in the latest version are unreadable by the same module in version 1.1. If you persist encrypted data to a host-mounted folder or volume, always create a backup copy of the data *before* upgrading to retain the ability to downgrade if necessary.
* For backward compatibility when connecting devices that don't support TLS 1.2, you can configure Edge Hub to still accept TLS 1.0 or 1.1 via the [SslProtocols environment variable](https://github.com/Azure/iotedge/blob/main/doc/EnvironmentVariables.md#edgehub).  Please note that support for [TLS 1.0 and 1.1 in IoT Hub is considered legacy](../iot-hub/iot-hub-tls-support.md) and may also be removed from Edge Hub in future releases.  To avoid future issues, use TLS 1.2 as the only TLS version when connecting to Edge Hub or IoT Hub.
* The preview for the experimental MQTT broker in Edge Hub 1.2 has ended and isn't included in Edge Hub 1.4. We're continuing to refine our plans for an MQTT broker based on feedback received. In the meantime, if you need a standards-compliant MQTT broker on IoT Edge, consider deploying an open-source broker like Mosquitto as an IoT Edge module. 
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

# [Red Hat Enterprise Linux](#tab/rhel)

IoT Edge version 1.1 isn't supported on Red Hat Enterprise Linux 8.

# [Linux on Windows](#tab/linuxonwindows)

If you're using Windows containers or IoT Edge for Linux on Windows, this special case section doesn't apply.

# [Windows](#tab/windows)

Currently, there's no support for IoT Edge version 1.4 running on Windows devices.

---

Now that the latest IoT Edge service is running on your devices, you also need to [Update the runtime containers](#update-the-runtime-containers) to the latest version. The updating process for runtime containers is the same as the updating process the IoT Edge service. 

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)