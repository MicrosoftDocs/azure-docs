---
title: Nested Virtualization for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to navigate nested virtualization in Azure IoT Edge for Linux on Windows.
author: rsameser
manager: kgremban
ms.author: riameser
ms.date: 2/24/2021
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc, devx-track-azurecli
monikerRange: "=iotedge-2018-06"
---

# Nested Virtualization for Azure IoT Edge for Linux on Windows
There are two forms of nested virtualization compatible with Azure IoT Edge for Linux on Windows. Users can choose to deploy through a local virtual or Azure VM. This article will provide users clarity on which option is best for their scenario and provide insight into configuration requirements.

> [!NOTE]
>
> Ensure to enable one [netowrking option](https://docs.microsoft.com/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#networking-options) for nested virtualization. Failing to do so will result in EFLOW installation errors. 

## Deploymnet on Local VM
This is the baseline approach for any Windows VM that hosts Azure IoT Edge for Linux on Windows. Nested virtualization needs to be enabled. Read [Run Hyper-V in a Virtual Machine with Nested Virtualization](https://docs.microsoft.com/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for more information on how to configure this scenario.

If you are using Windows Server, please make sure you [install the Hyper-V role](https://docs.microsoft.com/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server).

## Deployment on Azure VMs
If you choose to deploy on Azure VMs, please note that there is no external switch by design. Azure IoT Edge for Linux on Windows is also not compatible on an Azure VM running the Server SKU unless a specific script is executed that brings up a default switch. For more information on how to bring up a default switch, see the [Windos Server section](#windows-server) below. 

> [!NOTE]
>
> Any Azure VMs that is supposed to host EFLOW must be a VM that [supports nested virtualization](https://docs.microsoft.com/en-us/azure/virtual-machines/acu)


## Limited use of external switch
In any scenario where the VM can not obtain an IP address through an external switch, the deployment functionality automatically uses the internal default switch for the deployment. This means that the management of the Azure IoT Edge for Linux VM can only be executed on the target device itself (i.e. connecting to the Azure IoT Edge for Linux VM via the WAC PowerShell SSH extension is only possible on localhost).

## Windows Server
For Windows Server users, please note that Azure IoT Edge for Linux on Windows does not automatically support the default switch.

* Consequences for local VM: ensure the EFLOW VM can obtain an IP address through the external switch.

* Consequences for Azure VM: since there's no external switch on Azure VMs, it is not possible to deploy EFLOW before setting up an internal switch on the server.

There is no default switch on Server SKUs by default (regardless of whether the Server SKU runs on an Azure VM or not). When deploying on an Azure VM where the external switch cannot be used, the default switch needs to be set up and configured manually before Azure IoT Edge for Linux on Windows deployment. Our deployment functionality covers this as it requires IP configuration for the internal switch, a NAT configuration, and installing and configuring a DHCP server. Our deployment functionality in public preview states that it does not fiddle around with these settings not to impair network configurations on productive deployments.

* Relevant information on how to set up the default switch manually can be found here: [How to enable nested virtualization in Azure Virtual Machines - Azure Virtual Machines | Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nested-virtualization)
* Documentation on how to set up a DHCP server for this scenario can be found here: [Deploy DHCP Using Windows PowerShell | Microsoft Docs](https://docs.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-deploy-wps)
