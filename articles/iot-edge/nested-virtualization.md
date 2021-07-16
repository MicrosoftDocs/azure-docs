---
title: Nested virtualization for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to navigate nested virtualization in Azure IoT Edge for Linux on Windows.
author: fcabrera
manager: kgremban
ms.author: fcabrera
ms.date: 2/24/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# Nested virtualization for Azure IoT Edge for Linux on Windows
There are two forms of nested virtualization compatible with Azure IoT Edge for Linux on Windows. Users can choose to deploy through a local VM or Azure VM. This article will provide users clarity on which option is best for their scenario and provide insight into configuration requirements.

> [!NOTE]
>
> Ensure to enable one [networking option](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#networking-options) for nested virtualization. Failing to do so will result in EFLOW installation errors. 

## Deployment on local VM

This is the baseline approach for any Windows VM that hosts Azure IoT Edge for Linux on Windows. For this case, nested virtualization needs to be enabled before starting the deployment. Read [Run Hyper-V in a Virtual Machine with Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for more information on how to configure this scenario.

If you are using Windows Server, make sure you [install the Hyper-V role](/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server).

## Deployment on Azure VMs

Azure IoT Edge for Linux on Windows is not compatible on an Azure VM running the Server SKU unless a script is executed that brings up a default switch. For more information on how to bring up a default switch, see the [Windows Server section](#windows-server) below.

> [!NOTE]
>
> Any Azure VMs that is supposed to host EFLOW must be a VM that [supports nested virtualization](../virtual-machines/acu.md)

## Windows Server

For Windows Server users, note that Azure IoT Edge for Linux on Windows does not automatically support the default switch. Before you can deploy IoT Edge for Linux on Windows you must set up an internal switch on the server.

Our deployment functionality does not create the default switch automatically because that requires IP configuration for the internal switch, a NAT configuration, and installing and configuring a DHCP server. Our deployment functionality states that it does not fiddle around with these settings in order to not affect network configurations on productive deployments.

* For information about setting up the default switch manually, see [How to enable nested virtualization in Azure Virtual Machines](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)
* For information about setting up a DHCP server for this scenario, see [Deploy DHCP using Windows PowerShell](/windows-server/networking/technologies/dhcp/dhcp-deploy-wps)