---
title: Why use Azure IoT Edge for Linux on Windows?
description: Benefits for using Azure IoT Edge for Linux on Windows (EFLOW) to deploy production Linux-based cloud-native workloads on Windows devices.
author: PatAltimore
ms.author: patricka
ms.date: 06/09/2025
ms.topic: concept-article
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# Why use Azure IoT Edge for Linux on Windows?

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge for Linux on Windows (EFLOW) lets you run business logic and analytics on devices by deploying production Linux-based cloud-native workloads on Windows devices. Connecting devices to Microsoft Azure lets you bring cloud intelligence to your business. Running workloads on devices helps you respond quickly when connectivity is limited and reduces bandwidth costs.

EFLOW combines the strengths of Windows and Linux, so you get new capabilities while using your existing Windows infrastructure and applications. Running Linux IoT Edge modules on Windows devices lets you do more on a single device, which reduces the overhead and cost of using separate devices for different apps.

You don't need deep Linux knowledge to use EFLOW, and you manage your EFLOW device and workloads with familiar Windows tools. Windows IoT gives you trusted enterprise-grade security and established IT admin infrastructure. Microsoft maintains and keeps the entire solution up to date. 

## Easily connect to Azure
**IoT Edge Built-In**. [Tier 1 Azure IoT Edge support](support.md#operating-systems) is built in to EFLOW for a simpler deployment experience for your cloud workloads.

**Curated Linux VM for Azure**. EFLOW uses a specially curated Linux VM that runs alongside the Windows IoT host OS. This Linux VM is based on [CBL-Mariner Linux](https://github.com/microsoft/CBL-Mariner), and is optimized for hosting IoT Edge workloads.

## Familiar Windows management
**Flexible Scripting**. [PowerShell modules](reference-iot-edge-for-linux-on-windows-functions.md) let you fully script deployments.

**WAC**. [Windows Admin Center EFLOW extension](how-to-provision-single-device-linux-on-windows-symmetric.md#developer-tools) (preview, EFLOW 1.1 only) gives you a click-through deployment wizard and remote management experience.

## Production ready
**Always Up-to-date**. EFLOW regularly releases feature and security improvements, and its reliably updated using Microsoft Update. For more information about EFLOW updates, see [Update IoT Edge for Linux on Windows](./iot-edge-for-linux-on-windows-updates.md).

**Fully Supported Environment.** In an EFLOW solution, Microsoft maintains the base operating system, the EFLOW Linux environment, and the container runtime. This means there's a single source for all components. Each of the three components—[Windows IoT](/windows/iot/iot-enterprise/commercialization/licensing), EFLOW, and [Azure IoT Edge](version-history.md)—has defined servicing mechanisms and support timelines.

## Windows + Linux
**Interoperability**. EFLOW lets you combine a Windows application and a Linux application on the same device, unlocking new experiences and scenarios that aren't possible otherwise. Interoperability and hardware passthrough capabilities built into EFLOW, including [TPM passthrough](how-to-provision-devices-at-scale-linux-on-windows-tpm.md), [HW acceleration](gpu-acceleration.md), [Camera passthrough](https://github.com/Azure/iotedge-eflow/tree/main/samples/camera-over-rtsp), [Serial passthrough](https://github.com/Azure/iotedge-eflow/tree/main/samples/serial), and more, let you use both Linux and Windows environments.
