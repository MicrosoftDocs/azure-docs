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
ms.date: 12/09/2020
ms.author: kgremban
---

# What is Azure IoT Edge for Linux on Windows (Preview)

Azure IoT Edge for Linux on Windows allows you to run containerized Linux workloads alongside Windows applications in production Windows edge deployments.

## Components

IoT Edge for Linux on Windows uses the following components to enable Linux and Windows workloads to run alongside each other and communicate seamlessly:

* **A Linux virtual machine running Azure IoT Edge**: A Linux virtual machine, based on Microsoft's first party [Mariner](https://github.com/microsoft/CBL-Mariner) operating system, is built with the IoT Edge runtime and validated as a tier 1 supported environment for IoT Edge workloads.

* **Windows Admin Center**: An IoT Edge extension for Windows Admin Center facilitates installation, configuration, and diagnostics from a remote workstation or on the local device.

* **Microsoft Update**: Integration with Microsoft Update keeps the Windows runtime components, the Mariner Linux VM, and IoT Edge up to date.

![Windows and the Linux VM run in parallel, while the Windows Admin Center controls both components](./media/iot-edge-for-linux-on-windows/architecture-and-communication.png)

Bi-directional communication between Windows process and the Linux virtual machine means that Windows processes can provide user interfaces or hardware proxies for workloads run in the Linux containers.

## Public preview

IoT Edge for Linux on Windows is currently in public preview. Support and installation may be different than for generally available features.

## Updates and management

## Next steps
