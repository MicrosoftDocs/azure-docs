---
title: 'Connect to a Linux VM using Azure Bastion  | Microsoft Docs'
description: In this article, learn how to connect to Linux Virtual Machine by using Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 06/03/2019
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to an Azure virtual machine running Linux that doesn't have a public IP address by using Azure Bastion.

---

# Connect using SSH to a Linux virtual machine using Azure Bastion (Preview)

This article shows you how to securely and seamlessly SSH to your Linux VMs in an Azure virtual network. You can connect to a VM directly from the Azure portal. When using Azure Bastion, VMs don't require a client, agent, or additional software. For more information about Azure Bastion, see the [Overview](bastion-overview.md).

You can use Azure Bastion to connect to a Linux virtual machine using SSH. You can use both username/password and SSH keys for authentication. You can connect to your VM with SSH keys by using either:

* A private key that you manually enter
* A file that contains the private key information

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](bastion-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. In this preview, when you use Bastion to connect, it assumes that you are using RDP to connect to a Windows VM, and SSH to connect to your Linux VMs.

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

## <a name="username"></a>Connect: Using username and password


1.  Use [this link](https://aka.ms/BastionHost) to open the preview portal page for Azure Bastion. Navigate to the virtual machine that you want to connect to, then click **Connect**. The VM should be a Linux virtual machine when using an SSH connection.
1. After you click Connect, a side bar appears that has three tabs – RDP, SSH, and Bastion. If Bastion was provisioned for the virtual network, the Bastion tab is active by default. If you didn't provision Bastion for the virtual network, see [Configure Bastion](bastion-create-host-portal.md). If you do not see **Bastion** listed, you have not opened the preview portal. Open the portal using [this link](https://aka.ms/BastionHost).

      ![VM connect](./media/bastion-connect-vm-ssh/bastion.png)

1. Enter the username and password for SSH to your virtual machine.
1. Click **Connect** button after entering the key.

## <a name="privatekey"></a>Connect: Manually enter a private key

1.  Use [this link](https://aka.ms/BastionHost) to open the preview portal page for Azure Bastion. Navigate to the virtual machine that you want to connect to, then click **Connect**. The VM should be a Linux virtual machine when using an SSH connection.
1. After you click Connect, a side bar appears that has three tabs – RDP, SSH, and Bastion. If Bastion was provisioned for the virtual network, the Bastion tab is active by default. If you didn't provision Bastion for the virtual network, see [Configure Bastion](bastion-create-host-portal.md). If you do not see **Bastion** listed, you have not opened the preview portal. Open the portal using [this link](https://aka.ms/BastionHost).

      ![VM connect](./media/bastion-connect-vm-ssh/bastion.png)

1. Enter the username and select **SSH Private Key**.
1. Enter your private key into the text area **SSH Private Key** (or paste it directly).
1. Click **Connect** button after entering the key.

## <a name="ssh"></a>Connect: Using a private key file

1.  Use [this link](https://aka.ms/BastionHost) to open the preview portal page for Azure Bastion. Navigate to the virtual machine that you want to connect to, then click **Connect**. The VM should be a Linux virtual machine when using an SSH connection.

    ![VM connect](./media/bastion-connect-vm-ssh/connect.png)

1. After you click Connect, a side bar appears that has three tabs – RDP, SSH, and Bastion. If Bastion was provisioned for the virtual network, the Bastion tab is active by default. If you didn't provision Bastion for the virtual network, see [Configure Bastion](bastion-create-host-portal.md). If you do not see **Bastion** listed, you have not opened the preview portal. Open the portal using [this link](https://aka.ms/BastionHost).

    ![VM connect](./media/bastion-connect-vm-ssh/bastion.png)

1. Enter the username and select **SSH Private Key from Local File**.
1. Click the **Browse** button (the folder icon in the local file).
1. Browse for the file, then click **Open**.
1. Click **Connect** to connect to the VM. Once you click Connect, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## Next steps

Read the [Bastion FAQ](bastion-faq.md)
