---
title: Quickstart - Get started using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started using the Ubuntu Server 18.04 x64 Package agent.
author: philmea
ms.author: philmea
ms.date: 1/11/2021
ms.topic: quickstart
ms.service: iot-hub
---

# Getting Started using Ubuntu Server 18.04 x64 Package agent
Device Update for IoT Hub provides a package agent for Ubuntu Server 18.04 x64.

## Download update agent packages

Download the latest .deb packages from the specified location and copy them to
your pre-provisioned Azure IoT Edge device running Ubuntu Server 18.04 x64.

Delivery Optimization Plugin: Download [here](https://github.com/microsoft/do-client/releases)

Delivery Optimization SDK: Download [here](https://github.com/microsoft/do-client/releases)

Delivery Optimization Simple Client: Download [here](https://github.com/microsoft/do-client/releases)

Device Update Agent: Download [here](https://github.com/Azure/adu-private-preview/releases)

## Install Device Update .deb agent packages

1. Copy over your downloaded .deb packages to your IoT Edge device from your host machine using PowerShell.

```shell
PS> scp '<PATH_TO_DOWNLOADED_FILES>\*.deb' <USERNAME>@<EDGE IP ADDRESS>:~
```

2. Use apt-get to install the packages in the specified order

* Delivery Optimization Simple Client (ms-doclient-lite)
* Delivery Optimization SDK (ms-dosdkcpp)
* Delivery Optimization Plugin for APT (ms-dopapt)
* ADU Agent (adu-agent)

```shell
sudo apt-get -y install ./<NAME_OF_PACKAGE>.deb
```

## Configure Device Update Agent

1. Open the Device Update configuration file

```shell
sudo nano /etc/adu/adu-conf.txt
```

2. Provide your primary connection string in the configuration file. A device's connection string can be found in Azure portal, in the IoT Edge device blade, in the device details page after clicking on the device.

3. Press Ctrl+X, Y, Enter to save and close the file

4. Restart the Device Update Agent daemon

```shell
sudo systemctl restart adu-agent
```

5. Optionally, you can verify that the services are running by

```shell
sudo systemctl list-units --type=service | grep 'adu-agent\.service\|do-client-lite\.service'
```

The output should read:

```markdown
adu-agent.service                   loaded active running Device Update for IoT Hub Agent daemon.

do-client-lite.service               loaded active running do-client-lite.service: Performs content delivery optimization tasks   `
```


**[Next Step: Import New Update](./import-update.md)**
