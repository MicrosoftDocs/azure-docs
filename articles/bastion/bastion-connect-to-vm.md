---
title: 'Connect to a VM using Azure Bastion  | Microsoft Docs'
description: In this article, learn how to connect to an Azure Virtual Machine by using Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 05/14/2019
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to an Azure virtual machine that doesn't have a public IP address by using Azure Bastion.

---

# Connect to a virtual machine by using Azure Bastion (preview)

This article shows you how to securely and seamlessly RDP & SSH to your VMs in an Azure virtual network. You can connect to a VM directly from the Azure portal. When using Azure Bastion, VMs don't require a client, agent, or additional software. For more information about Azure Bastion, see the [Overview](bastion-overview.md).

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](bastion-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. In this preview, Bastion assumes that you are using RDP to connect to a Windows VM, and SSH to connect to your Linux VMs.

## <a name="rdp"></a>Connect using RDP (Windows)

1. In the [Azure portal](https://aka.ms/BastionHost) for the Bastion preview, navigate to the virtual machine that you want to connect to, then click **Connect**. The VM should be a Windows virtual machine when using an RDP connection.

    ![VM connect](./media/bastion-connect-to-vm/connect.png)

1. After you click Connect, a side bar appears that has three tabs – RDP, SSH, and Bastion. If Bastion was provisioned for the virtual network, the Bastion tab is active by default. If you didn't provision Bastion for the virtual network, you can click the link to configure Bastion. For configuration instructions, see [Configure Bastion](bastion-create-host-portal.md).

    ![VM connect](./media/bastion-connect-to-vm/bastion.png)

1. On the Bastion tab, the username and password for your virtual machine, then click **Connect**. The RDP connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

    ![VM connect](./media/bastion-connect-to-vm/443rdp.png)
 
## <a name="ssh"></a>Connect using SSH (Linux)

1. In the [Azure portal](https://aka.ms/BastionHost) for the Bastion preview, navigate to the virtual machine that you want to connect to, then click **Connect**. The VM should be a Linux virtual machine when using an SSH connection.

    ![VM connect](./media/bastion-connect-to-vm/connect.png)

1. After you click Connect, a side bar appears that has three tabs – RDP, SSH, and Bastion (new). If Bastion was provisioned for the virtual network, the Bastion tab is active by default. If you didn't provision Bastion for the virtual network, you can click the link to configure Bastion. For configuration instructions, see [Configure Bastion](bastion-create-host-portal.md).

    ![VM connect](./media/bastion-connect-to-vm/bastion.png)

1. On the **Bastion** tab, enter the username and password for your virtual machine, then click **Connect**. The SSH connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

    ![VM connect](./media/bastion-connect-to-vm/443ssh.png)

## Next steps

Read the [Bastion FAQ](bastion-faq.md)