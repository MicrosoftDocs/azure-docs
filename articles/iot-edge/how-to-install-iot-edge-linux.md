---
title: Install Azure IoT Edge on Linux | Microsoft Docs
description: Azure IoT Edge installation instructions on Linux devices running Ubuntu or Raspbian
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: kgremban
---
# Install the Azure IoT Edge runtime on Debian-based Linux systems

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime on an X64, ARM32, or ARM64 Linux device. We provide installation packages for Ubuntu Server 16.04, Ubuntu Server 18.04, and Raspbian Stretch. Refer to [Azure IoT Edge supported systems](support.md#operating-systems) for a list of supported Linux operating systems and architectures.

> [!NOTE]
> Packages in the Linux software repositories are subject to the license terms located in each package (/usr/share/doc/*package-name*). Read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

## Install the latest runtime version

Use the following sections to install the most recent version of the Azure IoT Edge runtime onto your device.

>[!NOTE]
>Support for ARM64 devices is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Register Microsoft key and software repository feed

Prepare your device for the IoT Edge runtime installation.

Install the repository configuration. Choose the **16.04** or **18.04** command that matches your device operating system:

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

Copy the generated list.

   ```bash
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

Install Microsoft GPG public key

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

### Install the container runtime

Azure IoT Edge relies on an [OCI-compatible](https://www.opencontainers.org/) container runtime. For production scenarios, we recommended that you use the [Moby-based](https://mobyproject.org/) engine provided below. The Moby engine is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install the Moby engine.

   ```bash
   sudo apt-get install moby-engine
   ```

Install the Moby command-line interface (CLI). The CLI is useful for development but optional for production deployments.

   ```bash
   sudo apt-get install moby-cli
   ```

If you get errors when installing the Moby container runtime, follow the steps to [Verify your Linux kernel for Moby compatibility](#verify-your-linux-kernel-for-moby-compatibility), provided later in this article.

### Install the Azure IoT Edge Security Daemon

The **IoT Edge security daemon** provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The installation command also installs the standard version of the **libiothsm** if not already present.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install the security daemon. The package is installed at `/etc/iotedge/`.

   ```bash
   sudo apt-get install iotedge
   ```

Once IoT Edge is successfully installed, the output will prompt you to update the configuration file. Follow the steps in the [Configure the security daemon](#configure-the-security-daemon) section to complete device provisioning.

## Install a specific runtime version

If you want to install a specific version of Moby and the Azure IoT Edge runtime instead of using the latest versions, you can target the component files directly from the IoT Edge GitHub repository. Use the following steps to get all of the IoT Edge components onto your device: the Moby engine and CLI, the libiothsm, and finally the IoT Edge security daemon. Skip to the next section, [Configure the security daemon](#configure-the-security-daemon), if you do not want to change to a specific runtime version.

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target.

2. Expand the **Assets** section for that version.

3. There may or may not be updates to the Moby engine in any given release. If you see files that start with **moby-engine** and **moby-cli**, use the following commands to update those components. If you don't see any Moby files, go back through the older release assets until you find the most recent version.

   1. Find the **moby-engine** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   2. Use the copied link in the following command to install that version of the Moby engine:

      ```bash
      curl -L <moby-engine link> -o moby_engine.deb && sudo dpkg -i ./moby_engine.deb
      ```

   3. Find the **moby-cli** file that matches your IoT Edge device's architecture. The Moby CLI is an optional component, but can be helpful during development. Right-click on the file link and copy the link address.

   4. Use the copied link in the following command to install that version of the Moby CLI:

      ```bash
      curl -L <moby-cli link> -o moby_cli.deb && sudo dpkg -i ./moby_cli.deb
      ```

4. Every release should have new files for the IoT Edge security daemon and the hsmlib. Use the following commands to update those components.

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

Once IoT Edge is successfully installed, the output will prompt you to update the configuration file. Follow the steps in the next section to complete device provisioning.

## Configure the security daemon

Configure the IoT Edge runtime to link your physical device with a device identity that exists in an Azure IoT hub.

The daemon can be configured using the configuration file at `/etc/iotedge/config.yaml`. The file is write-protected by default, you might need elevated permissions to edit it.

A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to provision. Depending on your provisioning choice, choose the appropriate installation script.

### Option 1: Manual provisioning

To manually provision a device, you need to provide it with a [device connection string](how-to-register-device.md#register-in-the-azure-portal) that you can create by registering a new device in your IoT hub.

Open the configuration file.

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning configurations of the file and uncomment the **Manual provisioning configuration** section. Update the value of **device_connection_string** with the connection string from your IoT Edge device. Make sure any other provisioning sections are commented out. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

   ```yaml
   # Manual provisioning configuration
   provisioning:
     source: "manual"
     device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   # DPS TPM provisioning configuration
   # provisioning:
   #   source: "dps"
   #   global_endpoint: "https://global.azure-devices-provisioning.net"
   #   scope_id: "{scope_id}"
   #   attestation:
   #     method: "tpm"
   #     registration_id: "{registration_id}"
   ```

To paste clipboard contents into Nano `Shift+Right Click` or press `Shift+Insert`.

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

```bash
sudo systemctl restart iotedge
```

### Option 2: Automatic provisioning

To automatically provision a device, [set up Device Provisioning Service and retrieve your device registration ID](how-to-auto-provision-simulated-device-linux.md). There are a number of attestation mechanisms supported by IoT Edge when using automatic provisioning but your hardware requirements also impact your choices. For example, Raspberry Pi devices do not come with a Trusted Platform Module (TPM) chip by default.

Open the configuration file.

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning configurations of the file and uncomment the section appropriate for your attestation mechanism. When using TPM attestation, for example, update the values of **scope_id** and **registration_id** with the values from your IoT Hub Device Provisioning service and your IoT Edge device with TPM, respectively. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

   ```yaml
   # Manual provisioning configuration
   # provisioning:
   #   source: "manual"
   #   device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   # DPS TPM provisioning configuration
   provisioning:
     source: "dps"
     global_endpoint: "https://global.azure-devices-provisioning.net"
     scope_id: "{scope_id}"
     attestation:
       method: "tpm"
       registration_id: "{registration_id}"
   ```

To paste clipboard contents into Nano `Shift+Right Click` or press `Shift+Insert`.

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

```bash
sudo systemctl restart iotedge
```

## Verify successful installation

If you used the **manual configuration** steps in the previous section, the IoT Edge runtime should be successfully provisioned and running on your device. If you used the **automatic configuration** steps, then you need to complete some additional steps so that the runtime can register your device with your IoT hub on your behalf. For next steps, see [Create and provision a simulated TPM IoT Edge device on a Linux virtual machine](how-to-auto-provision-simulated-device-linux.md#give-iot-edge-access-to-the-tpm).

You can check the status of the IoT Edge Daemon:

```bash
systemctl status iotedge
```

Examine daemon logs:

```bash
journalctl -u iotedge --no-pager --no-full
```

Run an automated check for the most common configuration and networking errors:

```bash
sudo iotedge check
```

Until you deploy your first module to IoT Edge on your device, the **$edgeHub** system module will not be deployed to the device. As a result, the automated check will return an error for the `Edge Hub can bind to ports on host` connectivity check. This error can be ignored unless it occurs after deploying a module to the device.

Finally, list running modules:

```bash
sudo iotedge list
```

After installing IoT Edge on your device, the only module you should see running is **edgeAgent**. Once you create your first deployment, the other system module **$edgeHub** will start on the device as well. For more information, see [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

## Tips and troubleshooting

You need elevated privileges to run `iotedge` commands. After installing the runtime, sign out of your machine and sign back in to update your permissions automatically. Until then, use **sudo** in front of any `iotedge` the commands.

On resource constrained devices, it is highly recommended that you set the *OptimizeForPerformance* environment variable to *false* as per instructions in the [troubleshooting guide](troubleshoot.md).

If your network that has a proxy server, follow the steps in [Configure your IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

### Verify your Linux kernel for Moby compatibility

Many embedded device manufacturers ship device images that contain custom Linux kernels without the features required for container runtime compatibility. If you encounter issues while installing the recommended Moby container runtime, you may be able to troubleshoot your Linux kernel configuration using the [check-config](https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh) script from the official [Moby GitHub repository](https://github.com/moby/moby). Run the following commands on the device to check your kernel configuration:

   ```bash
   curl -sSL https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh -o check-config.sh
   chmod +x check-config.sh
   ./check-config.sh
   ```

This command provides a detailed output that contains the status of kernel features that are used by the Moby runtime. You will want to ensure that all items under `Generally Necessary` and  `Network Drivers` are enabled to ensure that your kernel is fully compatible with the Moby runtime.  If you have identified any missing features, enable them by rebuilding your kernel from source and selecting the associated modules for inclusion in the appropriate kernel .config.  Similarly, if you are using a kernel configuration generator like defconfig or menuconfig, find and enable the respective features and rebuild your kernel accordingly.  Once you have deployed your newly modified kernel, run the check-config script again to verify that all the required features were successfully enabled.

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your Linux device, use the following commands from the command line.

Remove the IoT Edge runtime.

```bash
sudo apt-get remove --purge iotedge
```

When the IoT Edge runtime is removed, the containers that it created are stopped but still exist on your device. View all containers to see which ones remain.

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

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems with the IoT Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).
