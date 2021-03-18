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
> Ensure to enable one [netowrking option](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#networking-options) for nested virtualization. Failing to do so will result in EFLOW installation errors. 

## Deployment on local VM
This is the baseline approach for any Windows VM that hosts Azure IoT Edge for Linux on Windows. For this case, nested virtualization needs to be enabled before starting the deployment. Read [Run Hyper-V in a Virtual Machine with Nested Virtualization](https://docs.microsoft.com/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for more information on how to configure this scenario.

If you are using Windows Server, make sure you [install the Hyper-V role](https://docs.microsoft.com/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server).

## Deployment on Azure VMs
If you choose to deploy on Azure VMs, note that there is no external switch by design. Azure IoT Edge for Linux on Windows is also not compatible on an Azure VM running the Server SKU unless a specific script is executed that brings up a default switch. For more information on how to bring up a default switch, see the [Windows Server section](#windows-server) below. 

> [!NOTE]
>
> Any Azure VMs that is supposed to host EFLOW must be a VM that [supports nested virtualization](../virtual-machines/acu.md)


## Limited use of external switch
In any scenario where the VM cannot obtain an IP address through an external switch, the deployment functionality automatically uses the internal default switch for the deployment. This means that the management of the Azure IoT Edge for Linux VM can only be executed on the target device itself (i.e. connecting to the Azure IoT Edge for Linux VM via the WAC PowerShell SSH extension is only possible on localhost).

## Windows Server
For Windows Server users, note that Azure IoT Edge for Linux on Windows does not automatically support the default switch.

* Consequences for local VM: Ensure the EFLOW VM can obtain an IP address through the external switch.

* Consequences for Azure VM: Because there's no external switch on Azure VMs, it's not possible to deploy EFLOW before you set up an internal switch on the server.

There is no default switch on Server SKUs by default (regardless of whether the Server SKU runs on an Azure VM or not). When deploying on an Azure VM where the external switch cannot be used, the default switch needs to be set up and configured manually before Azure IoT Edge for Linux on Windows deployment. Our deployment functionality covers this as it requires IP configuration for the internal switch, a NAT configuration, and installing and configuring a DHCP server. Our deployment functionality in public preview states that it does not fiddle around with these settings not to impair network configurations on productive deployments.

* Relevant information on how to set up the default switch manually can be found here: [How to enable nested virtualization in Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/nested-virtualization)
* Documentation on how to set up a DHCP server for this scenario can be found here: [Deploy DHCP using Windows PowerShell](https://docs.microsoft.com/windows-server/networking/technologies/dhcp/dhcp-deploy-wps)
