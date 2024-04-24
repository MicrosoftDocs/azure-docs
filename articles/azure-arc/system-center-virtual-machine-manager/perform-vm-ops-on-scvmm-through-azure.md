---
title: Perform VM operations on SCVMM VMs through Azure
description: Learn how to manage SCVMM VMs in Azure through Arc-enabled SCVMM.
ms.topic: how-to 
ms.date: 03/12/2024
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
---

# Manage SCVMM VMs in Azure through Arc-enabled SCVMM

In this article, you learn how to perform various operations on the Azure Arc-enabled SCVMM VMs such as:

- Start, stop, and restart a VM

- Control access and add Azure tags

- Add, remove, and update network interfaces

- Add, remove, and update disks and update VM size (CPU cores, memory)

- Enable guest management

- Install extensions (enabling guest management is required). All the [extensions](../servers/manage-vm-extensions.md#extensions) that are available with Arc-enabled Servers are supported.

:::image type="content" source="media/perform-vm-ops-on-scvmm-through-azure/manage-vms.png" alt-text="Screenshot showing the SCVMM virtual machine operations." lightbox="media/perform-vm-ops-on-scvmm-through-azure/manage-vms.png":::

To perform guest OS operations on Arc-enabled SCVMM VMs, you must enable guest management on the VMs. When you enable guest management, the Arc Connected Machine Agent is installed on the VM.

## Enable guest management

Before you can install an extension, you must enable guest management on the SCVMM VM.  

1. Make sure your target machine:

   - is running a [supported operating system](../servers/prerequisites.md#supported-operating-systems).

   - can connect through the firewall to communicate over the internet and [these URLs](../servers/network-requirements.md#urls) aren't blocked.

   - has SCVMM tools installed and running.

   - is powered on and the resource bridge has network connectivity to the host running the VM.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

2. Search for and select the SCVMM VM for which you want to enable guest management and select **Configuration**.

3. Select **Enable guest management** and provide the administrator username and password to enable guest management.  Then select **Apply**.

For Linux, use the root account, and for Windows, use an account that is a member of the Local Administrators group.

>[!Note]
>You can install Arc agents at scale on Arc-enabled SCVMM VMs through Azure Portal only if you are running: 
>- SCVMM 2022 UR1 or later versions of SCVMM server and console
>- SCVMM 2019 UR5 or later versions of SCVMM server and console
>- VMs running Windows Server 2012 R2, 2016, 2019, 2022, Windows 10, and Windows 11 <br>
> For other SCVMM versions, Linux VMs, or Windows VMs running WS 2012 or earlier, [install Arc agents through the script](./install-arc-agents-using-script.md).

## Delete a VM

If you no longer need the VM, you can delete it.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

2. Search for and select the VM you want to delete.

3. In the selected VM's Overview page, select **Delete**.

4. When prompted, confirm that you want to delete it.

>[!NOTE]
>This also deletes the VM on your SCVMM managed on-premises host.

## Next steps

[Create a Virtual Machine on SCVMM managed on-premises hosts](./create-virtual-machine.md).
