---
title: 'Connect to a Linux VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Linux VM using RDP.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/12/2021
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Create an RDP connection to a Linux VM using Azure 

This article shows you how to securely and seamlessly create an RDP connection to your Linux VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Linux VM using SSH. For information, see [Create an SSH connection to a Linux VM](bastion-connect-vm-ssh-linux.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it is provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md).

> [!NOTE]
> Using RDP to connect to a Linux virtual machine requires the Azure Bastion Standard SKU.
>

When using Azure Bastion to connect to a Linux virtual machine using RDP, you must use username/password for authentication.

## Prerequisites

Before you begin, verify that you have met the following criteria:

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network.

To RDP to a Linux virtual machine, you must also ensure that you have xrdp installed and configured on your Linux virtual machine. To learn how to do this, see [Use xrdp with Linux](../virtual-machines/linux/use-remote-desktop.md).

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

### Ports

To connect to the Linux VM via RDP, you must have the following ports open on your VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you will then need to specify this custom port when you connect to the VM via Azure Bastion)

### Supported configurations

Currently, Azure Bastion only supports connecting to Linux VMs via RDP using **xrdp**.

## <a name="rdp"></a>Connect

[!INCLUDE [Connect to a Linux VM using RDP](../../includes/bastion-vm-rdp-linux.md)]
 
## Next steps

Read the [Bastion FAQ](bastion-faq.md).
