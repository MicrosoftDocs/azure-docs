---
title: Install Azure IoT Edge on Linux | Microsoft Docs
description: Azure IoT Edge installation instructions on Linux AMD64 devices running Ubuntu
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/27/2019
ms.author: kgremban
ms.custom: seodec18
---
# Install the Azure IoT Edge runtime on Linux (x64)

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime on your Ubuntu Linux x64 (Intel/AMD) IoT Edge device. Refer to [Azure IoT Edge supported systems](support.md#operating-systems) for a list of supported AMD64 operating systems.

> [!NOTE]
> Packages in the Linux software repositories are subject to the license terms located in each package (/usr/share/doc/*package-name*). Read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

## Install the latest version

Use the following sections to install the most recent version of the Azure IoT Edge service onto your devices. 

### Register Microsoft key and software repository feed

Prepare your device for the IoT Edge runtime installation.


Install the repository configuration. Choose either the **16.04** or **18.04** code snippet as appropriate for your release of Ubuntu:

> [!NOTE]
> Make sure you choose the code snippet from the correct code box for your version of Ubuntu.

* For **Ubuntu 16.04**:
   ```bash
   curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > ./microsoft-prod.list
   ```

* For **Ubuntu 18.04**:
   ```bash
   curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list > ./microsoft-prod.list
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

Azure IoT Edge relies on an [OCI-compatible](https://www.opencontainers.org/) container runtime. For production scenarios, we recommended that you use the [Moby-based](https://mobyproject.org/) engine provided below. It is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

Perform apt update.

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

#### Verify your Linux kernel for Moby compatibility

Many embedded device manufacturers ship device images which contain custom Linux kernels that may be missing features required for container runtime compatibility. If you encounter issues when installing the recommended [Moby](https://github.com/moby/moby) container runtime, you may be able to troubleshoot your Linux kernel configuration using the [check-config](https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh) script supplied in the official [Moby Github repository](https://github.com/moby/moby) by running the following commands on the device.

   ```bash
   curl -sSL https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh -o check-config.sh
   chmod +x check-config.sh
   ./check-config.sh
   ```

This will provide a detailed output which contains the status of kernel features that are used by the Moby runtime. You will want to ensure that all items under `Generally Necessary` and  `Network Drivers` are enabled to ensure that your kernel is fully compatible with the Moby runtime.  If you have identified any missing features, you may enable them by rebuilding your kernel from source and selecting the associated modules for inclusion in the appropriate kernel .config.  Similarly, if you are using a kernel configuration generator like defconfig or menuconfig, you will need to find and enable the respective features and rebuild your kernel accordingly.  Once you have deployed your newly modified kernel, run the check-config script again to verify that your identified features have been successfully enabled.

### Install the Azure IoT Edge Security Daemon

The **IoT Edge security daemon** provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The installation command also installs the standard version of the **libiothsm** if not already present.

Perform apt update.

   ```bash
   sudo apt-get update
   ```

Install the security daemon. The package is installed at `/etc/iotedge/`.

   ```bash
   sudo apt-get install iotedge
   ```

Once IoT Edge is successfully installed, the output will prompt you to update the configuration file. Follow the steps in the [Configure the Azure IoT Edge security daemon](#configure-the-azure-iot-edge-security-daemon) section to finish provisioning your device. 

## Install a specific version

If you want to install a specific version of Azure IoT Edge, you can target the component files directly from the IoT Edge GitHub repository. Use the following steps to get all of the IoT Edge components onto your device: the Moby engine and CLI, the libiothsm, and finally the IoT Edge security daemon.

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target. 

2. Expand the **Assets** section for that version.

3. There may or may not be updates to the Moby engine in any given release. If you see files that start with **moby-engine** and **moby-cli**, use the following commands to update those components. If you don't see any Moby files and you don't already have Moby installed on your device, go back through the older release assets until you find them. 

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

Once IoT Edge is successfully installed, the output will prompt you to update the configuration file. Follow the steps in the next section to finish provisioning your device. 

## Configure the Azure IoT Edge security daemon

Configure the IoT Edge runtime to link your physical device with a device identity that exists in an Azure IoT hub.

The daemon can be configured using the configuration file at `/etc/iotedge/config.yaml`. The file is write-protected by default, you might need elevated permissions to edit it.

A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to provision. Depending on your provisioning choice, choose the appropriate installation script.

### Option 1: Manual provisioning

To manually provision a device, you need to provide it with a [device connection string](how-to-register-device-portal.md) that you can create by registering a new device in your IoT hub.

Open the configuration file.

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning section of the file. Uncomment the **manual** provisioning mode, and make sure the dps provisioning mode is commented out. Update the value of **device_connection_string** with the connection string from your IoT Edge device.

   ```yaml
   provisioning:
     source: "manual"
     device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   # provisioning:
   #   source: "dps"
   #   global_endpoint: "https://global.azure-devices-provisioning.net"
   #   scope_id: "{scope_id}"
   #   registration_id: "{registration_id}"
   ```

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

```bash
sudo systemctl restart iotedge
```

### Option 2: Automatic provisioning

To automatically provision a device, [set up Device Provisioning Service and retrieve your device registration ID](how-to-auto-provision-simulated-device-linux.md). Automatic provisioning only works with devices that have a Trusted Platform Module (TPM) chip. For example, Raspberry Pi devices do not come with TPM by default.

Open the configuration file.

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning section of the file. Uncomment the **dps** provisioning mode and comment out the manual section. Update the values of **scope_id** and **registration_id** with the values from your IoT Hub Device Provisioning Service and your IoT Edge device with TPM.

   ```yaml
   # provisioning:
   #   source: "manual"
   #   device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   provisioning:
     source: "dps"
     global_endpoint: "https://global.azure-devices-provisioning.net"
     scope_id: "{scope_id}"
     registration_id: "{registration_id}"
   ```

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

```bash
sudo systemctl restart iotedge
```

## Verify successful installation

If you used the **manual configuration** steps in the previous section, the IoT Edge runtime should be successfully provisioned and running on your device. If you used the **automatic configuration** steps, then you need to complete some additional steps so that the runtime can register your device with your IoT hub on your behalf. For next steps, see [Create and provision a simulated TPM IoT Edge device on a Linux virtual machine](how-to-auto-provision-simulated-device-linux.md#give-iot-edge-access-to-the-tpm).

You can check the status of the IoT Edge Daemon using:

```bash
systemctl status iotedge
```

Examine daemon logs using:

```bash
journalctl -u iotedge --no-pager --no-full
```

And, list running modules with:

```bash
sudo iotedge list
```

## Tips and suggestions

You need elevated privileges to run `iotedge` commands. After installing the runtime, sign out of your machine and sign back in to update your permissions automatically. Until then, use **sudo** in front of any `iotedge` the commands.

On resource constrained devices, it is highly recommended that you set the *OptimizeForPerformance* environment variable to *false* as per instructions in the [troubleshooting guide](troubleshoot.md).

If your network that has a proxy server, follow the steps in [Configure your IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your Linux device, use the following commands from the command line.

Remove the IoT Edge runtime.

```bash
sudo apt-get remove --purge iotedge
```

When the IoT Edge runtime is removed, the container that it created are stopped but still exist on your device. View all containers to see which ones remain.

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
