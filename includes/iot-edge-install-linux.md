---
ms.topic: include
ms.date: 07/13/2022
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Install IoT Edge

In this section, you prepare your Linux VM or physical device for IoT Edge. Then, you install IoT Edge.

First, run the following commands to add the package repository and then add the Microsoft package signing key to your list of trusted keys.

# [Ubuntu](#tab/ubuntu)

Installing can be done with a few commands.  Open a terminal and run the following commands:

* **20.04**:

   ```bash
   wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   rm packages-microsoft-prod.deb
   ```

* **18.04**:

   ```bash
   wget https://packages.microsoft.com/config/ubuntu/18.04/multiarch/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   rm packages-microsoft-prod.deb
   ```

# [Debian](#tab/debian)

Installing with APT can be done with a few commands.  Open a terminal and run the following commands:

* **11 - Bullseye (arm32v7)**:

    ```bash
    curl https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb > ./packages-microsoft-prod.deb
    sudo apt install ./packages-microsoft-prod.deb
    ```

> [!TIP]
> If you gave the "root" account a password during the OS install, you will not need 'sudo' and can run the above command by starting with 'apt'.

# [Raspberry Pi OS](#tab/rpios)

> [!IMPORTANT]
> By June 30, 2022 we will retire Raspberry Pi OS Stretch from the Tier 1 OS support list. To avoid potential security vulnerabilities update your host OS to Bullseye.

Installing can be done with a few commands.  Open a terminal and run the following commands:

* **Latest**:

    ```bash
    curl https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb > ./packages-microsoft-prod.deb
    sudo apt install ./packages-microsoft-prod.deb
    ```

# [Red Hat Enterprise Linux](#tab/rhel)

Installing can be done with a few commands. Open a terminal and run the following commands:

* **8.x (amd64)**:

   ```bash
    wget https://packages.microsoft.com/config/rhel/8/packages-microsoft-prod.rpm -O packages-microsoft-prod.rpm
    sudo yum localinstall packages-microsoft-prod.rpm
    rm packages-microsoft-prod.rpm
    ```

---

> [!NOTE]
> Azure IoT Edge software packages are subject to the license terms located in each package (`usr/share/doc/{package-name}` or the `LICENSE` directory). Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you don't agree with the license terms, don't use that package.

### Install a container engine

Azure IoT Edge relies on an OCI-compatible container runtime. For production scenarios, we recommend that you use the Moby engine. The Moby engine is the only container engine officially supported with IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

# [Ubuntu](#tab/ubuntu)

Install the Moby engine.

   ```bash
   sudo apt-get update; \
     sudo apt-get install moby-engine
   ```

# [Debian](#tab/debian)

Install the Moby engine.

   ```bash
   sudo apt-get update; \
     sudo apt-get install moby-engine
   ```

# [Raspberry Pi OS](#tab/rpios)

> [!IMPORTANT]
> By June 30, 2022 we will retire Raspberry Pi OS Stretch from the Tier 1 OS support list. To avoid potential security vulnerabilities update your host OS to Bullseye.

Install the Moby engine.

   ```bash
   sudo apt-get update; \
     sudo apt-get install moby-engine
   ```

# [Red Hat Enterprise Linux](#tab/rhel)

Install the Moby engine and CLI.

   ```bash
   sudo yum install moby-engine moby-cli
   ```
---

Once the Moby engine is successfully installed, configure it to use [`local` logging driver](https://docs.docker.com/config/containers/logging/local/) as the logging mechanism. To learn more about logging configuration, see [Production Deployment Checklist](../articles/iot-edge/production-checklist.md#set-up-default-logging-driver).

* Create or open the Docker daemon's config file at `/etc/docker/daemon.json`.
* Set the default logging driver to the `local` logging driver as shown in the example below.   
   
    ```JSON
       {
          "log-driver": "local"
       }
    ```
* Restart the container engine for the changes to take effect.

    ```bash
    sudo systemctl restart docker
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

Install IoT Edge version 1.1.* along with the **libiothsm-std** package:

# [Ubuntu](#tab/ubuntu)

   ```bash
   sudo apt-get update; \
     sudo apt-get install iotedge
   ```

# [Debian](#tab/debian)

   ```bash
   sudo apt-get update; \
     sudo apt-get install iotedge
   ```

# [Raspberry Pi OS](#tab/rpios)

> [!IMPORTANT]
> By June 30, 2022 we will retire Raspberry Pi OS Stretch from the Tier 1 OS support list. To avoid potential security vulnerabilities update your host OS to Bullseye.

   ```bash
   sudo apt-get update; \
     sudo apt-get install iotedge
   ```

# [Red Hat Enterprise Linux](#tab/rhel)

IoT Edge version 1.1 isn't supported on Red Hat Enterprise Linux 8.

---

>[!NOTE]
>IoT Edge version 1.1 is the long-term support branch of IoT Edge. If you are running an older version, we recommend installing or updating to the latest patch as older versions are no longer supported.

<!-- end 1.1 -->
::: moniker-end

<!-- iotedge-2020-11 -->
::: moniker range=">=iotedge-2020-11"

The IoT Edge service provides and maintains security standards on the IoT Edge device. The service starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

Beginning with version 1.2, the IoT identity service handles identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub.

The steps in this section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the **Offline or specific version installation** steps later in this article.

>[!NOTE]
>The steps in this section show you how to install the latest IoT Edge version.
>
>If you already have an IoT Edge device running an older version and want to upgrade to the latest release, use the steps in [Update the IoT Edge security daemon and runtime](../articles/iot-edge/how-to-update-iot-edge.md). Later versions are sufficiently different from previous versions of IoT Edge that specific steps are necessary to upgrade.

# [Ubuntu](#tab/ubuntu)

Install the latest version of IoT Edge and the IoT identity service package:

   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge defender-iot-micro-agent-edge
   ```

The defender-iot-micro-agent-edge package includes the Microsoft Defender for IoT security micro-agent that provides endpoint visibility into security posture management, vulnerabilities, threat detection, fleet management and more to help you secure your IoT Edge devices. It is recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](../articles/defender-for-iot/device-builders/overview.md).

# [Debian](#tab/debian)

Install the latest version of IoT Edge and the IoT identity service package:

   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge defender-iot-micro-agent-edge
   ```

The defender-iot-micro-agent-edge package includes the Microsoft Defender for IoT security micro-agent that provides endpoint visibility into security posture management, vulnerabilities, threat detection, fleet management and more to help you secure your IoT Edge devices. It is recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](../articles/defender-for-iot/device-builders/overview.md).


# [Raspberry Pi OS](#tab/rpios)

> [!IMPORTANT]
> By June 30, 2022 we will retire Raspberry Pi OS Stretch from the Tier 1 OS support list. To avoid potential security vulnerabilities update your host OS to Bullseye.

Install the latest version of IoT Edge and the IoT identity service package:

   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge
   ```

# [Red Hat Enterprise Linux](#tab/rhel)

   ```bash
   sudo yum install aziot-edge
   ```
---

<!-- end iotedge-2020-11 -->
::: moniker-end
