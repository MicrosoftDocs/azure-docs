---
title: Nested virtualization - Azure IoT Edge for Linux on Windows
description: Learn about how to use nested virtualization in Azure IoT Edge for Linux on Windows and the different deployment options available.
author: PatAltimore
ms.author: patricka
ms.date: 01/22/2025
ms.topic: conceptual
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# Nested virtualization for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

There are three forms of nested virtualization compatible with Azure IoT Edge for Linux on Windows. Users can choose to deploy through a local virtual machine (using Hyper-V hypervisor), VMware Windows virtual machine, or Azure Virtual Machine. This article provides clarity on which option is best for their scenario and provide insight into configuration requirements.

> [!NOTE]
> Ensure to enable one [networking option](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#networking-options) for nested virtualization. Failing to do so will result in EFLOW installation errors. 

## Deployment on local VM

This is the baseline approach for any Windows VM that hosts Azure IoT Edge for Linux on Windows. For this case, nested virtualization needs to be enabled before starting the deployment. Read [Run Hyper-V in a Virtual Machine with Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for more information on how to configure this scenario.

If you're using Windows Server or Azure Local, make sure you [install the Hyper-V role](/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server).

## Deployment on Windows VM on VMware ESXi
Intel-based VMware ESXi [6.7](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-esxi-vcenter-server-67-release-notes.html) and [7.0](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/7-0/release-notes/vsphere-esxi-vcenter-server-70-release-notes.html) versions can host Azure IoT Edge for Linux on Windows on top of a Windows virtual machine. Read [VMware KB2009916](https://kb.vmware.com/s/article/2009916) for more information on VMware ESXi nested virtualization support. 

To set up an Azure IoT Edge for Linux on Windows on a VMware ESXi Windows virtual machine, use the following steps:
1. Create a Windows virtual machine on the VMware ESXi host. For more information about VMware VM deployment, see [VMware - Deploying Virtual Machines](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-39D19B2B-A11C-42AE-AC80-DDA8682AB42C.html).
>[!NOTE]
> If you're creating a Windows 11 virtual machine, ensure to meet the minimum requirements by Microsoft to run Windows 11. For more information about Windows 11 VM VMware support, see [Installing Windows 11 as a guest OS on VMware](https://kb.vmware.com/s/article/86207).
1. Turn off the virtual machine created in previous step.
1. Select the Windows virtual machine and then **Edit settings**.
1. Search for _Hardware virtualization_ and turn on _Expose hardware assisted virtualization to the guest OS_.
1. Select **Save** and start the virtual machine.
1. Install Hyper-V hypervisor. If you're using Windows client, make sure you [Install Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). If you're using Windows Server, make sure you [install the Hyper-V role](/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server). 

> [!NOTE]
> For VMware Windows virtual machines, if you plan to use an **external virtual switch** for the EFLOW virtual machine networking, make sure you enable _Promiscuous mode_. For more information, see [Configuring promiscuous mode on a virtual switch or portgroup](https://kb.vmware.com/s/article/1004099). Failing to do so will result in EFLOW installation errors.

## Deployment on Azure VMs

Azure IoT Edge for Linux on Windows isn't compatible on an Azure VM running the Server SKU unless a script is executed that brings up a default switch. For more information on how to bring up a default switch, see [Create virtual switch for Linux on Windows](how-to-create-virtual-switch.md).

> [!NOTE]
> Any Azure VMs that is supposed to host EFLOW must be a VM that [supports nested virtualization](/azure/virtual-machines/acu). Also, Azure VMs do not support using an **external virtual switch**. 
