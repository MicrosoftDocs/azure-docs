---
title: How to install Azure IoT Edge on Linux | Microsoft Docs
description: Azure IoT Edge installation instructions on Linux
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/27/2018
ms.author: kgremban
---
# Install the Azure IoT Edge runtime on Linux (x64)

The Azure IoT Edge runtime is deployed on all IoT Edge devices. It has three components. The **IoT Edge security daemon** provides and maintains security standards on the Edge device. The daemon starts on every boot and bootstraps the device by starting the IoT Edge agent. The **IoT Edge agent** facilitates deployment and monitoring of modules on the Edge device, including the IoT Edge hub. The **IoT Edge hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub.

This article lists the steps to install the Azure IoT Edge runtime on your Linux x64 (Intel/AMD) Edge device.

>[!NOTE]
>Packages in the Linux software repositories are subject to the license terms located in each package (/usr/share/doc/*package-name*). Read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

## Register Microsoft key and software repository feed

### Ubuntu 16.04

```cmd/sh
# Install repository configuration
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/

# Install Microsoft GPG public key
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
```

### Ubuntu 18.04

```cmd/sh
# Install repository configuration
curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/

# Install Microsoft GPG public key
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/

# Perform apt upgrade
sudo apt-get upgrade
```

## Install the container runtime 

Azure IoT Edge relies on a [OCI-compatible][lnk-oci] container runtime. For production scenarios, it is highly recommended you use the [Moby-based][lnk-moby] engine provided below. It is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

Update apt-get.

```bash
sudo apt-get update
```

Install the Moby engine and command-line interface (CLI). The CLI is useful for development but optional for production deployments.*

```bash
sudo apt-get install moby-engine
sudo apt-get install moby-cli
```

## Install the Azure IoT Edge Security Daemon

Commands below will also install the standard version of the **iothsmlib** if not already present.

```bash
sudo apt-get update
sudo apt-get install iotedge
```

## Configure the Azure IoT Edge Security Daemon

The daemon can be configured using the configuration file at `/etc/iotedge/config.yaml`. The file is write-protected by default, you might need elevated permissions to edit it.

```bash
sudo nano /etc/iotedge/config.yaml
```

The edge device can be configured manually using a [device connection string][lnk-dcs] or [automatically via Device Provisioning Service][lnk-dps].

* For manual configuration, uncomment the **manual** provisioning mode. Update the value of **device_connection_string** with the connection string from your IoT Edge device.

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

* For automatic configuration, uncomment the **dps** provisioning mode. Update the values of **scope_id** and **registration_id** with the values from your IoT Hub DPS instance and your IoT Edge device with TPM. 

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

After entering the provisioning information in the configuration, restart the daemon:

```cmd/sh
sudo systemctl restart iotedge
```

## Verify successful installation

If you used the **manual configuration** steps in the previous section, the IoT Edge runtime should be successfully provisioned and running on your device. If you used the **automatic configuration** steps, then you need to complete some additional steps so that the runtime can register your device with your IoT hub on your behalf. For next steps, see [Create and provision a simulated TPM Edge device on a Linux virtual machine](how-to-auto-provision-simulated-device-linux.md#give-iot-edge-access-to-the-tpm).

You can check the status of the IoT Edge Daemon using:

```cmd/sh
systemctl status iotedge
```

Examine daemon logs using:

```cmd/sh
journalctl -u iotedge --no-pager --no-full
```

And, list running modules with:

```cmd/sh
sudo iotedge list
```

## Next steps

If you are having problems with the Edge runtime installing properly, checkout the [troubleshooting][lnk-trouble] page.

<!-- Links -->
[lnk-dcs]: how-to-register-device-portal.md
[lnk-dps]: how-to-auto-provision-simulated-device-linux.md
[lnk-oci]: https://www.opencontainers.org/
[lnk-moby]: https://mobyproject.org/
[lnk-trouble]: troubleshoot.md
