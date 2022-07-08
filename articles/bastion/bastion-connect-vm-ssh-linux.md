---
title: 'Connect to a Linux VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Linux VM using SSH.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/12/2021
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Create an SSH connection to a Linux VM using Azure Bastion

This article shows you how to securely and seamlessly create an SSH connection to your Linux VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Linux VM using RDP. For information, see [Create an RDP connection to a Linux VM](bastion-connect-vm-rdp-linux.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it is provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md).

When connecting to a Linux virtual machine using SSH, you can use both username/password and SSH keys for authentication. You can connect to your VM with SSH keys by using either:

* A private key that you manually enter
* A file that contains the private key information

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](./tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. 

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

### Ports

In order to connect to the Linux VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22) ***or***
* Inbound port: Custom value (you will then need to specify this custom port when you connect to the VM via Azure Bastion)

   > [!NOTE]
   > If you want to specify a custom port value, Azure Bastion must be configured using the Standard SKU. The Basic SKU does not allow you to specify custom ports.
   >

## <a name="username"></a>Connect: Using username and password

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected" lightbox="./media/bastion-connect-vm-ssh-linux/connect.png":::

1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **Password**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/password.png" alt-text="Screenshot shows Password authentication.":::
1. Select **Connect** to connect to the VM.

## <a name="privatekey"></a>Connect: Manually enter a private key

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connect.png" alt-text="Screenshot of the overview for a virtual machine in Azure portal with Connect selected." lightbox="./media/bastion-connect-vm-ssh-linux/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **SSH Private Key**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/ssh-private-key.png" alt-text="Screenshot of SSH Private Key authentication.":::
1. Enter your private key into the text area **SSH Private Key** (or paste it directly).
1. Select **Connect** to connect to the VM.

## <a name="ssh"></a>Connect: Using a private key file

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connect.png" alt-text="Screenshot depicts the overview for a virtual machine in Azure portal with Connect selected." lightbox="./media/bastion-connect-vm-ssh-linux/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and **SSH Private Key from Local File**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/private-key-file.png" alt-text="Screenshot depicts SSH Private Key file.":::

1. Browse for the file, then select **Open**.
1. Select **Connect** to connect to the VM. Once you click Connect, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## <a name="akv"></a>Connect: Using a private key stored in Azure Key Vault

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connect.png" alt-text="Screenshot showing the overview for a virtual machine in Azure portal with Connect selected" lightbox="./media/bastion-connect-vm-ssh-linux/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, enter the **Username** and select **SSH Private Key from Azure Key Vault**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/ssh-key-vault.png" alt-text="Screenshot showing SSH Private Key from Azure Key Vault.":::
1. Select the **Azure Key Vault** dropdown and select the resource in which you stored your SSH private key. 

   * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.

   * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

     > [!NOTE]
     > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
     >

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/private-key-stored.png" alt-text="Screenshot showing  Azure Key Vault." lightbox="./media/bastion-connect-vm-ssh-linux/private-key-stored.png":::

1. Select the **Azure Key Vault Secret** dropdown and select the Key Vault secret containing the value of your SSH private key.
1. Select **Connect** to connect to the VM. Once you click **Connect**, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md).
