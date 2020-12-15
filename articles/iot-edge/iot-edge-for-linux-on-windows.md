---
title: What is Azure IoT Edge | Microsoft Docs
description: Overview of the Azure IoT Edge service
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: twarwick
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 12/14/2020
ms.author: kgremban
---

# What is Azure IoT Edge for Linux on Windows (Preview)

Azure IoT Edge for Linux on Windows allows you to run containerized Linux workloads alongside Windows applications in production Windows edge deployments. Businesses that rely on Windows IoT to power their edge devices can now take advantage of the cloud-native analytics solutions being built in Linux.

IoT Edge for Linux on Windows works by running a Linux virtual machine on a Windows device. The Linux virtual machine comes pre-installed with the IoT Edge runtime. Any IoT Edge modules deployed to the device run inside the virtual machine. Meanwhile, Windows applications running on the Windows host device can communicate with the modules running in the Linux virtual machine.

## Components

IoT Edge for Linux on Windows uses the following components to enable Linux and Windows workloads to run alongside each other and communicate seamlessly:

* **A Linux virtual machine running Azure IoT Edge**: A Linux virtual machine, based on Microsoft's first party [Mariner](https://github.com/microsoft/CBL-Mariner) operating system, is built with the IoT Edge runtime and validated as a tier 1 supported environment for IoT Edge workloads.

* **Windows Admin Center**: An IoT Edge extension for Windows Admin Center facilitates installation, configuration, and diagnostics of IoT Edge on the Linux virtual machine. Windows Admin Center can deploy IoT Edge for Linux on Windows on the local device, or can connect to target devices and manage them remotely.

* **Microsoft Update**: Integration with Microsoft Update keeps the Windows runtime components, the Mariner Linux VM, and IoT Edge up to date.

![Windows and the Linux VM run in parallel, while the Windows Admin Center controls both components](./media/iot-edge-for-linux-on-windows/architecture-and-communication.png)

Bi-directional communication between Windows process and the Linux virtual machine means that Windows processes can provide user interfaces or hardware proxies for workloads run in the Linux containers.

## Samples

IoT Edge for Linux on Windows emphasizes interoperability between the Linux and WIndows components.

For samples that demonstrate communication between Windows applications and IoT Edge modules, see [Windows 10 IoT Samples](https://github.com/microsoft/Windows-IoT-Samples).

## Public preview

IoT Edge for Linux on Windows is currently in public preview. Support and installation may be different than for generally available features.

Currently, IoT Edge for Linux on Windows uses the Windows Insider Preview version of Windows Admin Center. For more information about the Windows Insider Program and to register, see [What is the Windows Insider Program?](https://insider.windows.com/about-windows-insider-program).

<!--TODO: Add link to how-to guide-->

## Updates and management

## Next steps

<!--TODO: Add link to how-to guide-->
