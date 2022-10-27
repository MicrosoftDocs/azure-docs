---
title: 'Connect to a Linux VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Linux VM using RDP.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/18/2022
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Create an RDP connection to a Linux VM using Azure Bastion

This article shows you how to securely and seamlessly create an RDP connection to your Linux VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also [connect to a Linux VM using SSH](bastion-connect-vm-ssh-linux.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see [What is Azure Bastion?](bastion-overview.md)

## Prerequisites

Before you begin, verify that you've met the following criteria:

* Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network.

* To use RDP with a Linux virtual machine, you must also ensure that you have xrdp installed and configured on the Linux VM. To learn how to do this, see [Use xrdp with Linux](../virtual-machines/linux/use-remote-desktop.md).

* Bastion must be configured with the [Standard SKU](configuration-settings.md#skus).

* You must use username/password authentication.

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).


### Ports

To connect to the Linux VM via RDP, you must have the following ports open on your VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion)

## <a name="rdp"></a>Connect

[!INCLUDE [Connect to a Linux VM using RDP](../../includes/bastion-vm-rdp-linux.md)]

## Next steps

Read the [Bastion FAQ](bastion-faq.md) for more information.
