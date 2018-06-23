---
title: How to install Azure IoT Edge on Linux | Microsoft Docs
description: Azure IoT Edge installation instructions on Linux on ARM32
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/12/2018
ms.author: kgremban
---
# Install Azure IoT Edge runtime on Linux (ARM32v7/armhf)
The Azure IoT Edge runtime is deployed on all IoT Edge devices. It is composed of three components. The **IoT Edge Security Daemon**  provides and maintains security standards on the Edge device. The daemon starts on every boot and bootstraps the device by starting the IoT Edge Agent. The **IoT Edge Agent** facilitates deployment and monitoring of modules on the Edge device, including the IoT Edge Hub. The **IoT Edge Hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub.

This article lists the steps to install the Azure IoT Edge runtime on your Linux ARM32v7/armhf Edge device (for example, Raspberry Pi).

>[!NOTE]
>Packages in the Linux software repositories are subject to the license terms located in the packages (/usr/share/doc/*package-name*). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

## Install the container runtime

Azure IoT Edge relies on a [OCI-compatible][lnk-oci] container runtime (e.g. Docker). If you already have Docker CE/EE installed on your Edge device, you can continue to use it for development and testing with Azure IoT Edge. 

For production scenarios, it is highly recommended you use the [Moby-based][lnk-moby] engine provided below. It is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are fully compatible with the Moby runtime.

*Instructions below install both moby engine and command-line interface (CLI). The CLI is useful for development but optional for production deployments.*

```cmd/sh

# You can copy the entire text from this code block and 
# paste in terminal. The comment lines will be ignored.

# Download and install the moby-engine
curl https://azureiotedgepreview.blob.core.windows.net/shared/moby-0.1.0~rc1/moby-engine_0.1.0~rc1-1_armhf.deb -o moby_engine.deb && sudo dpkg -i ./moby_engine.deb

# Download and install the moby-cli
curl https://azureiotedgepreview.blob.core.windows.net/shared/moby-0.1.0~rc1/moby-cli_0.1.0~rc1-1_armhf.deb -o moby_cli.deb && sudo dpkg -i ./moby_cli.deb

# Run apt-get fix
sudo apt-get install -f

```

## Install the IoT Edge Security Daemon

```cmd/sh
# You can copy the entire text from this code block and 
# paste in terminal. The comment lines will be ignored.

# Download and install the standard libiothsm implementation
curl https://conteng.blob.core.windows.net/iotedged/libiothsm-std_1.0.0_rc1-1_armhf.deb -o libiothsm-std.deb && sudo dpkg -i ./libiothsm-std.deb

# Download and install the IoT Edge Security Daemon
curl https://conteng.blob.core.windows.net/iotedged/iotedge_1.0.0_rc1-1_armhf.deb -o iotedge.deb && sudo dpkg -i ./iotedge.deb

# Run apt-get fix
sudo apt-get install -f
```

## Configure the Azure IoT Edge Security Daemon

The daemon can be configured using the configuration file at `/etc/iotedge/config.yaml` The edge device can be configured [automatically via Device Provisioning Service][lnk-dps] or manually using a [device connection string][lnk-dcs].

For manual configuration, enter the device connection string in **provisioning** section of **config.yaml**

```yaml
provisioning:
  source: "manual"
  device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
```

*The file is write-protected by default, you might need to use `sudo` to edit it. For example `sudo nano /etc/iotedge/config.yaml`*

After entering the provisioning information in the configuration, restart the daemon:

```cmd/sh
sudo systemctl restart iotedge
```

## Verify successful installation

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
iotedge list
```

## Next steps

If you are having problems with the Edge runtime installing properly, checkout the [troubleshooting][lnk-trouble] page.

<!-- Links -->
[lnk-dcs]: ../iot-hub/quickstart-send-telemetry-dotnet.md#register-a-device
[lnk-dps]: how-to-simulate-dps-tpm.md
[lnk-oci]: https://www.opencontainers.org/
[lnk-moby]: https://mobyproject.org/
[lnk-trouble]: troubleshoot.md