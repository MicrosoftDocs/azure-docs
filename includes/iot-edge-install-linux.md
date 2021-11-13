---
ms.topic: include
ms.date: 10/29/2021
author: kgremban
ms.author: kgremban
ms.service: iot-edge
services: iot-edge
---

## Install IoT Edge

In this section, you prepare your Linux VM or physical device for IoT Edge. Then, you install IoT Edge.

You need to complete two steps on your device before it's ready to install the IoT Edge runtime. Your device needs access to the Microsoft installation packages, and it needs a container engine installed.

### Access the Microsoft installation packages

1. Download the repository configuration package that matches your device's operating system.

   * **Ubuntu Server 18.04**:

      ```bash
      curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/packages-microsoft-prod.deb > ./packages-microsoft-prod.deb
      ```

   * **Raspberry Pi OS Stretch**:

      ```bash
      curl https://packages.microsoft.com/config/debian/stretch/multiarch/packages-microsoft-prod.deb > ./packages-microsoft-prod.deb
      ```

1. Install the configuration package to add Microsoft's package repository and GPG public key.

   ```bash
   sudo apt install ./packages-microsoft-prod.deb
   ```

> [!NOTE]
> Azure IoT Edge software packages are subject to the license terms located in each package (`usr/share/doc/{package-name}` or the `LICENSE` directory). Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you don't agree with the license terms, don't use that package.

### Install a container engine

Azure IoT Edge relies on an OCI-compatible container runtime. For production scenarios, we recommend that you use the Moby engine. The Moby engine is the only container engine officially supported with IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

1. Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

1. Install the Moby engine.

   ```bash
   sudo apt-get install moby-engine
   ```

   > [!TIP]
   > If you get errors when you install the Moby container engine, verify your Linux kernel for Moby compatibility. Some embedded device manufacturers ship device images that contain custom Linux kernels without the features required for container engine compatibility. Run the following command, which uses the [check-config script](https://github.com/moby/moby/blob/master/contrib/check-config.sh) provided by Moby, to check your kernel configuration:
   >
   >   ```bash
   >   curl -ssl https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh -o check-config.sh
   >   chmod +x check-config.sh
   >   ./check-config.sh
   >   ```
   >
   > In the output of the script, check that all items under `Generally Necessary` and `Network Drivers` are enabled. If you're missing features, enable them by rebuilding your kernel from source and selecting the associated modules for inclusion in the appropriate kernel .config. Similarly, if you're using a kernel configuration generator like `defconfig` or `menuconfig`, find and enable the respective features and rebuild your kernel accordingly. After you've deployed your newly modified kernel, run the check-config script again to verify that all the required features were successfully enabled.

### Install the IoT Edge runtime

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

The IoT Edge security daemon provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The steps in this section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the **Offline or specific version installation** steps later in this article.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install IoT Edge version 1.1.* along with the **libiothsm-std** package:

   ```bash
   sudo apt-get install iotedge
   ```

>[!NOTE]
>IoT Edge version 1.1 is the long-term support branch of IoT Edge. If you are running an older version, we recommend installing or updating to the latest patch as older versions are no longer supported.

<!-- end 1.1 -->
::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

The IoT Edge service provides and maintains security standards on the IoT Edge device. The service starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The IoT identity service was introduced along with version 1.2 of IoT Edge. This service handles the identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub.

The steps in this section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the **Offline or specific version installation** steps later in this article.

>[!NOTE]
>The steps in this section show you how to install IoT Edge version 1.2.
>
>If you already have an IoT Edge device running an older version and want to upgrade to 1.2, use the steps in [Update the IoT Edge security daemon and runtime](../articles/iot-edge/how-to-update-iot-edge.md). Version 1.2 is sufficiently different from previous versions of IoT Edge that specific steps are necessary to upgrade.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Check to see which versions of IoT Edge and the IoT identity service are available.

   ```bash
   apt list -a aziot-edge aziot-identity-service
   ```

To install the latest version of IoT Edge and the IoT identity service package, use the following command:

   ```bash
   sudo apt-get install aziot-edge
   ```

<!-- end 1.2 -->
::: moniker-end
