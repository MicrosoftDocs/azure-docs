---
title: 'Connect to a Linux VM using Azure Bastion'
description: In this article, learn how to connect to Linux Virtual Machine by using Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: how-to
ms.date: 02/12/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to an Azure virtual machine running Linux that doesn't have a public IP address by using Azure Bastion.

---

# Connect using SSH to a Linux virtual machine using Azure Bastion

This article shows you how to securely and seamlessly SSH to your Linux VMs in an Azure virtual network. You can connect to a VM directly from the Azure portal. When using Azure Bastion, VMs don't require a client, agent, or additional software. For more information about Azure Bastion, see the [Overview](bastion-overview.md).

You can use Azure Bastion to connect to a Linux virtual machine using SSH. You can use both username/password and SSH keys for authentication. You can connect to your VM with SSH keys by using either:

* A private key that you manually enter
* A file that contains the private key information

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](./tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. 

When you use Bastion to connect, it assumes that you are using RDP to connect to a Windows VM, and SSH to connect to your Linux VMs. For information about connecting to a Windows VM, see [Connect to a VM - Windows](bastion-connect-vm-rdp.md).

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

### Ports

In order to connect to the Linux VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22)

## <a name="username"></a>Connect: Using username and password

1. Open the [Azure portal](https://portal.azure.com). Navigate to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **Password**.

   :::image type="content" source="./media/bastion-connect-vm-ssh/password.png" alt-text="Password authentication":::
1. Select **Connect** to connect to the VM.

## <a name="privatekey"></a>Connect: Manually enter a private key

1. Open the [Azure portal](https://portal.azure.com). Navigate to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **SSH Private Key**.

   :::image type="content" source="./media/bastion-connect-vm-ssh/ssh-private-key.png" alt-text="SSH Private Key authentication":::
1. Enter your private key into the text area **SSH Private Key** (or paste it directly).
1. Select **Connect** to connect to the VM.

## <a name="ssh"></a>Connect: Using a private key file

1. Open the [Azure portal](https://portal.azure.com). Navigate to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **SSH Private Key from Local File**.

   :::image type="content" source="./media/bastion-connect-vm-ssh/private-key-file.png" alt-text="SSH Private Key file":::

1. Browse for the file, then select **Open**.
1. Select **Connect** to connect to the VM. Once you click Connect, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## <a name="akv"></a>Connect: Using a private key stored in Azure Key Vault

>[!NOTE]
>The portal update for this feature is currently rolling out to regions.
>

1. Open the [Azure portal](https://portal.azure.com). Navigate to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and select **SSH Private Key from Azure Key Vault**.

   :::image type="content" source="./media/bastion-connect-vm-ssh/ssh-key-vault.png" alt-text="SSH Private Key from Azure Key Vault":::
1. Select the **Azure Key Vault** dropdown and select the resource in which you stored your SSH private key. If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/general/quick-create-portal.md) and store your SSH private key as the value of a new Key Vault secret.

   :::image type="content" source="./media/bastion-connect-vm-ssh/key-vault.png" alt-text="Azure Key Vault":::

   Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).
1. Select the **Azure Key Vault Secret** dropdown and select the Key Vault secret containing the value of your SSH private key.
1. Select **Connect** to connect to the VM. Once you click **Connect**, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md). 
