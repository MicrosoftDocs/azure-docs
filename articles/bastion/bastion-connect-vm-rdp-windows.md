---
title: 'Connect to a Windows VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Windows VM using RDP.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 08/03/2023
ms.author: cherylmc

---

# Create an RDP connection to a Windows VM using Azure Bastion

This article shows you how to securely and seamlessly create an RDP connection to your Windows VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Windows VM using SSH. For information, see [Create an SSH connection to a Windows VM](bastion-connect-vm-ssh-windows.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see [What is Azure Bastion?](bastion-overview.md)

## Prerequisites

Before you begin, verify that you've met the following criteria:

* A VNet with the Bastion host already installed.

  * Make sure that you have set up an Azure Bastion host for the virtual network in which the VM is located. Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in the virtual network.
  * To set up an Azure Bastion host, see [Create a bastion host](tutorial-create-host-portal.md#createhost). If you plan to configure custom port values, be sure to select the Standard SKU when configuring Bastion.

* A Windows virtual machine in the virtual network.

### Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

### Ports

To connect to the Windows VM, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) ***or***
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion)

> [!NOTE]
> If you want to specify a custom port value, Azure Bastion must be configured using the Standard SKU. The Basic SKU does not allow you to specify custom ports.

### Rights on target VM

[!INCLUDE [Remote Desktop Users](../../includes/bastion-remote-desktop-users.md)]

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## <a name="rdp"></a>Connect

[!INCLUDE [Connect to a Windows VM](../../includes/bastion-vm-rdp.md)]
 
## Next steps

Read the [Bastion FAQ](bastion-faq.md) for more connection information.
