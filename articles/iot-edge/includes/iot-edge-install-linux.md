---
ms.topic: include
ms.date: 05/03/2023
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Install IoT Edge

In this section, you prepare your Linux virtual machine or physical device for IoT Edge. Then, you install IoT Edge.

Run the following commands to add the package repository and then add the Microsoft package signing key to your list of trusted keys.

> [!IMPORTANT]
> On June 30, 2022 Raspberry Pi OS Stretch was retired from the Tier 1 OS support list. To avoid potential security vulnerabilities update your host OS to Bullseye.

# [Ubuntu](#tab/ubuntu)

Installing can be done with a few commands.  Open a terminal and run the following commands:

* **22.04**:

   ```bash
   wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   rm packages-microsoft-prod.deb
   ```

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

# [Red Hat Enterprise Linux](#tab/rhel)

Installing can be done with a few commands. Open a terminal and run the following commands:

* **9.x (amd64)**:

   ```bash
    wget https://packages.microsoft.com/config/rhel/9.0/packages-microsoft-prod.rpm -O packages-microsoft-prod.rpm
    sudo yum localinstall packages-microsoft-prod.rpm
    rm packages-microsoft-prod.rpm
    ```

* **8.x (amd64)**:

   ```bash
    wget https://packages.microsoft.com/config/rhel/8/packages-microsoft-prod.rpm -O packages-microsoft-prod.rpm
    sudo yum localinstall packages-microsoft-prod.rpm
    rm packages-microsoft-prod.rpm
    ```

---

For more information about operating system versions, see [Azure IoT Edge supported platforms](../support.md?#linux-containers).

> [!NOTE]
> Azure IoT Edge software packages are subject to the license terms located in each package (`usr/share/doc/{package-name}` or the `LICENSE` directory). Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you don't agree with the license terms, don't use that package.

### Install a container engine

Azure IoT Edge relies on an [OCI](https://opencontainers.org/)-compatible container runtime. For production scenarios, we recommend that you use the Moby engine. The Moby engine is the only container engine officially supported with IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

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

# [Red Hat Enterprise Linux](#tab/rhel)

Install the Moby engine and CLI.

   ```bash
   sudo yum install moby-engine moby-cli
   ```
---

By default, the Moby container engine does not set container log size limits. Over time, this can lead to the device filling up with logs and running out of disk space. However, you can configure your log to show locally, though it's optional. To learn more about logging configuration, see [Production Deployment Checklist](../production-checklist.md#set-up-default-logging-driver).

The following steps show you how to configure your container to use [`local` logging driver](https://docs.docker.com/config/containers/logging/local/) as the logging mechanism. 

1. Create (if the file's not there already) or open the Docker [daemon's config file](https://docs.docker.com/config/daemon/) at `/etc/docker/daemon.json`.

1. Set the default logging driver to the `local` logging driver as shown in the example below.   
   
    ```JSON
       {
          "log-driver": "local"
       }
    ```
1. Restart the container engine for the changes to take effect.

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

The IoT Edge service provides and maintains security standards on the IoT Edge device. The service starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

> [!NOTE]
> Beginning with version 1.2, the [IoT identity service](https://azure.github.io/iot-identity-service/) handles identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub.

The steps in this section represent the typical process to install the latest IoT Edge version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the **Offline or specific version installation** steps later in this article.

> [!TIP]
> If you already have an IoT Edge device running an older version and want to upgrade to the latest release, use the steps in [Update the IoT Edge security daemon and runtime](../how-to-update-iot-edge.md). Later versions are sufficiently different from previous versions of IoT Edge that specific steps are necessary to upgrade.

# [Ubuntu](#tab/ubuntu)

Install the latest version of IoT Edge and the IoT identity service package (if you're not already [up-to-date](../version-history.md)):

* **22.04**:
   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge
   ```

* **20.04 or 18.04**:
   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge defender-iot-micro-agent-edge
   ```

The optional `defender-iot-micro-agent-edge` package includes the Microsoft Defender for IoT security micro-agent that provides endpoint visibility into security posture management, vulnerabilities, threat detection, fleet management and more to help you secure your IoT Edge devices. It's recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](/azure/defender-for-iot/device-builders/overview).

# [Debian](#tab/debian)

Install the latest version of IoT Edge and the IoT identity service package (if you're not already [up-to-date](../version-history.md)):

   ```bash
   sudo apt-get update; \
     sudo apt-get install aziot-edge defender-iot-micro-agent-edge
   ```

The optional defender-iot-micro-agent-edge package includes the Microsoft Defender for IoT security micro-agent that provides endpoint visibility into security posture management, vulnerabilities, threat detection, fleet management and more to help you secure your IoT Edge devices. It's recommended to install the micro agent with the Edge agent to enable security monitoring and hardening of your Edge devices. To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT for device builders](/azure/defender-for-iot/device-builders/overview).

# [Red Hat Enterprise Linux](#tab/rhel)

  Install the latest version of IoT Edge and the IoT identity service package (if you're not already [up-to-date](../version-history.md)):

   ```bash
   sudo yum install aziot-edge
   ```

---
