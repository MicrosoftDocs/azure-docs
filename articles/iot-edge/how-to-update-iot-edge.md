---
title: Update IoT Edge version on devices
description: How to update IoT Edge devices to run the latest versions of the security subsystem and the IoT Edge runtime
author: PatAltimore
ms.author: patricka
ms.date: 04/03/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update IoT Edge

**Applies to:** ![IoT Edge 1.5 checkmark](./includes/media/iot-edge-version/yes-icon.png) IoT Edge 1.5 ![IoT Edge 1.4 checkmark](./includes/media/iot-edge-version/yes-icon.png) IoT Edge 1.4

> [!IMPORTANT]
> IoT Edge 1.5 LTS and IoT Edge 1.4 LTS are [supported releases](support.md#releases). IoT Edge 1.4 LTS is end of life on November 12, 2024.

As the IoT Edge service releases new versions, update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available.

Two logical components of an IoT Edge device need to be updated if you want to move to a newer version.

* *Security subsystem* - It runs on the device, handles security-based tasks, and starts the modules when the device starts. The *security subsystem* can only be updated from the device itself.

* *IoT Edge runtime* - The IoT Edge runtime is made up of the IoT Edge hub (`edgeHub`) and IoT Edge agent (`edgeAgent`) modules. Depending on how you structure your deployment, the *runtime* can be updated from either the device or remotely.

## How to update

Use the sections of this article to update both the security subsystem and runtime containers on a device.

### Patch releases

When you upgrade between *patch* releases, for example 1.4.1 to 1.4.2, the update order isn't important. You can upgrade the security subsystem or the runtime containers before or after the other. To update between patch releases:

1. [Update the security subsystem](#update-the-security-subsystem)
1. [Update the runtime containers](#update-the-runtime-containers)
1. [Verify versions match](#verify-versions-match)

You can [troubleshoot](#troubleshooting) the upgrade process at any time.

### Major or minor releases

When you upgrade between major or minor releases, for example from 1.4 to 1.5, update both the security subsystem and the runtime containers. Before a release, we test the security subsystem and the runtime container version combination. To update between major or minor product releases:

1. On the device, stop IoT Edge using the command `sudo systemctl stop iotedge` and [uninstall](how-to-provision-single-device-windows-symmetric.md#uninstall-iot-edge).

1. On the device, upgrade your container engine, either [Docker](https://docs.docker.com/engine/install) or [Moby](how-to-provision-single-device-linux-symmetric.md#install-a-container-engine).

1. On the device, [install IoT Edge](how-to-provision-single-device-linux-symmetric.md#install-iot-edge).
   
   If you're importing an old configuration using `iotedge config import`, then modify the [agent.config] image of the generated `/etc/aziot/config.toml` file to use the 1.4 image for edgeAgent.

   For more information, see [Configure IoT Edge device settings](configure-device.md#default-edge-agent).

1. In IoT Hub, [update the module deployment](#update-a-specific-tag-image) to reference the newest system modules.

1. On the device, start the IoT Edge using `sudo iotedge config apply`.

You can [troubleshoot](#troubleshooting) the upgrade process at any time.

## Update the security subsystem

The IoT Edge security subsystem includes a set of native components that need to be updated using the package manager on the IoT Edge device.

Check the version of the security subsystem running on your device by using the command `iotedge version`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the version.

<!-- Separated Linux content support RHEL - Some content repeated in RHEL tab-->
# [Ubuntu / Debian](#tab/linux)

On Linux x64 devices, use `apt-get` or your appropriate package manager to update the security subsystem to the latest version.

Update `apt`:

   ```bash
   sudo apt-get update
   ```

   > [!NOTE]
   > For instructions to get the latest repository configuration from Microsoft see the preliminary steps to [Install IoT Edge](how-to-provision-single-device-linux-symmetric.md#install-iot-edge).

Check to see which versions of IoT Edge are available:

```bash
apt list -a aziot-edge
```

Update IoT Edge:

```bash
sudo apt-get install aziot-edge defender-iot-micro-agent-edge
```

Running `apt-get install aziot-edge` upgrades the security subsystem and installs the [identity service](https://azure.github.io/iot-identity-service/), `aziot-identity-service`, as a required dependency.

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
>Currently, there is no support for IoT Edge running on Windows devices in Windows containers. Use a Linux container to run IoT Edge on Windows.
>

---

Then, reapply configuration to ensure system is fully updated.

```bash
sudo iotedge config apply
```

## Update the runtime containers

The way that you update the IoT Edge agent and IoT Edge hub containers depends on whether you use rolling tags (like 1.5) or specific tags (like 1.5.1) in your deployment.

Check the version of the IoT Edge agent and IoT Edge hub modules currently on your device using the commands `iotedge logs edgeAgent` or `iotedge logs edgeHub`. If you're using IoT Edge for Linux on Windows, you need to SSH into the Linux virtual machine to check the runtime module versions.

:::image type="content" source="media/how-to-update-iot-edge/container-version.png" alt-text="Screenshot of where to find the container version in console logs." lightbox="media/how-to-update-iot-edge/container-version.png":::

### Understand IoT Edge tags

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they're associated with. There are two different ways to use tags with the runtime images:

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.5 is updated whenever there's a new release to point to the latest 1.5.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. Deployments from the Azure portal default to rolling tags. *This approach is suggested for development purposes.*

* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.5.0 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. *This approach is suggested for production purposes.*

### Update a rolling tag image

If you use rolling tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.5**) then you need to force the container runtime on your device to pull the latest version of the image.

Delete the local version of the image from your IoT Edge device. On Windows machines, uninstalling the security subsystem also removes the runtime images, so you don't need to take this step again.

```bash
docker rmi mcr.microsoft.com/azureiotedge-hub:1.5
docker rmi mcr.microsoft.com/azureiotedge-agent:1.5
```

You may need to use the force `-f` flag to remove the images.

The IoT Edge service pulls the latest versions of the runtime images and automatically starts them on your device again.

### Update a specific tag image

If you use specific tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.4**) then all you need to do is update the tag in your deployment manifest and apply the changes to your device.

1. In the IoT Hub in the Azure portal, select your IoT Edge device, and select **Set Modules**.

1. On the **Modules** tab, select **Runtime Settings**.

1. In **Runtime Settings**, update the **Image URI** value in the **Edge Agent** section with the desired version. For example, `mcr.microsoft.com/azureiotedge-agent:1.5`
    Don't select **Apply** yet.

1. Select the **Edge Hub** tab and update the **Image URI** value with the same desired version. For example, `mcr.microsoft.com/azureiotedge-hub:1.5`.

1. Select **Apply** to save changes.

1. Select **Review + create**, review the deployment as seen in the JSON file, and select **Create**.

## Verify versions match

1. On your device, use `iotedge version` to check the security subsystem version. The output includes the major, minor, and revision version numbers. For example,  *iotedge 1.4.2*.

1. In your device deployment runtime settings, verify the *edgeHub* and *edgeAgent* image URI versions match the major and minor version of the security subsystem. If the security subsystem version is 1.4.2, the image versions would be 1.4. For example, *mcr.microsoft.com/azureiotedge-hub:1.4* and *mcr.microsoft.com/azureiotedge-agent:1.4*.

>[!NOTE]
>Update the IoT Edge security subsystem and runtime containers to the same supported release version. While mismatched versions are supported, we haven't tested all version combinations.
>
>To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Troubleshooting

You can view logs of your system at any time by running the following commands from your device. 

* Start troubleshooting using the [check](troubleshoot.md#run-the-check-command) command. It runs a collection of configuration and connectivity tests for common issues.

  ```bash
  sudo iotedge check --verbose
  ```

* To view the status of the IoT Edge system, run:

  ```bash
  sudo iotedge system status 
  ```

* To view host component logs, run:

  ```bash
  sudo iotedge system logs
  ```

* To check for recurring issues reported with edgeAgent and edgeHub, run:

  Be sure to replace `<module>` with your own module name. If there are no issues, you see no output.

  ```bash
  sudo iotedge logs <module>
  ```

For more information, see [Troubleshoot your IoT Edge device](troubleshoot.md).

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)
