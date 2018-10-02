---
title: Install Azure IoT Edge on Linux ARM32 | Microsoft Docs
description: Azure IoT Edge installation instructions on Linux on ARM32 devices, like a Raspberry PI
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 08/27/2018
ms.author: kgremban
---
# Install Azure IoT Edge runtime on Linux (ARM32v7/armhf)

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. 

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to install the Azure IoT Edge runtime on a Linux ARM32v7/armhf Edge device. For example, these steps would work for Raspberry Pi devices. Refer to [Azure IoT Edge support](support.md#operating-systems) for a list of ARM32 operating systems that are currently supported. 

>[!NOTE]
>Packages in the Linux software repositories are subject to the license terms located in each package (/usr/share/doc/*package-name*). Read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

## Install the container runtime

Azure IoT Edge relies on an [OCI-compatible][lnk-oci] container runtime. For production scenarios, it is highly recommended you use the [Moby-based][lnk-moby] engine provided below. It is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby-based runtime.

Commands below install both the Moby-based engine and command-line interface (CLI). The CLI is useful for development but optional for production deployments.

```bash

# You can copy the entire text from this code block and 
# paste in terminal. The comment lines will be ignored.

# Download and install the moby-engine
curl -L https://aka.ms/moby-engine-armhf-latest -o moby_engine.deb && sudo dpkg -i ./moby_engine.deb

# Download and install the moby-cli
curl -L https://aka.ms/moby-cli-armhf-latest -o moby_cli.deb && sudo dpkg -i ./moby_cli.deb

# Run apt-get fix
sudo apt-get install -f

```

## Install the IoT Edge Security Daemon

The **IoT Edge security daemon** provides and maintains security standards on the Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime. 


```bash
# You can copy the entire text from this code block and 
# paste in terminal. The comment lines will be ignored.

# Download and install the standard libiothsm implementation
curl -L https://aka.ms/libiothsm-std-linux-armhf-latest -o libiothsm-std.deb && sudo dpkg -i ./libiothsm-std.deb

# Download and install the IoT Edge Security Daemon
curl -L https://aka.ms/iotedged-linux-armhf-latest -o iotedge.deb && sudo dpkg -i ./iotedge.deb

# Run apt-get fix
sudo apt-get install -f
```

## Connect your device to an IoT hub 

Configure the IoT Edge runtime to link your physical device with a device identity that exists in an Azure IoT hub. 

The daemon can be configured using the configuration file at `/etc/iotedge/config.yaml`. The file is write-protected by default, you might need elevated permissions to edit it.

A single IoT Edge device can be provisioned manually using a device connections string provided by IoT Hub. Or, you can use the Device Provisioning Service to automatically provision devices, which is helpful when you have many devices to provision. Depending on your provisioning choice, choose the appropriate installation script. 

### Option 1: Manual provisioning

To manually provision a device, you need to provide it with a [device connection string][lnk-dcs] that you can create by registering a new device in your IoT hub.


Open the configuration file. 

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning section of the file and uncomment the **manual** provisioning mode. Update the value of **device_connection_string** with the connection string from your IoT Edge device.

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

To automatically provision a device, [set up Device Provisioning Service and retrieve your device registration ID][lnk-dps]. Automatic provisioning only works with devices that have a Trusted Platform Module (TPM) chip. For example, Raspberry Pi devices do not come with TPM by default. 

Open the configuration file. 

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning section of the file and uncomment the **dps** provisioning mode. Update the values of **scope_id** and **registration_id** with the values from your IoT Hub Device Provisioning service and your IoT Edge device with TPM. 

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

If you used the **manual configuration** steps in the previous section, the IoT Edge runtime should be successfully provisioned and running on your device. If you used the **automatic configuration** steps, then you need to complete some additional steps so that the runtime can register your device with your IoT hub on your behalf. For next steps, see [Create and provision a simulated TPM Edge device on a Linux virtual machine](how-to-auto-provision-simulated-device-linux.md#give-iot-edge-access-to-the-tpm).

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

On resource constrained devices, it is highly recommended that you set the *OptimizeForPerformance* environment variable to *false* as per instructions in the [troubleshooting guide][lnk-trouble].

If your network that has a proxy server, follow the steps in [Configure your IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Next steps

If you are having problems with the Edge runtime installing properly, refer to the [troubleshooting][lnk-trouble] page.

<!-- Links -->
[lnk-dcs]: how-to-register-device-portal.md
[lnk-dps]: how-to-auto-provision-simulated-device-linux.md
[lnk-trouble]: https://docs.microsoft.com/azure/iot-edge/troubleshoot#stability-issues-on-resource-constrained-devices
[lnk-oci]: https://www.opencontainers.org/
[lnk-moby]: https://mobyproject.org/
