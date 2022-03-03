---
title: 'Connect to a Windows VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Windows VM using SSH.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 09/20/2021
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Create an SSH connection to a Windows VM using Azure Bastion

This article shows you how to securely and seamlessly create an RDP connection to your Windows VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Windows VM using RDP. For information, see [Create an RDP connection to a Windows VM](bastion-connect-vm-rdp-windows.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it is provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md).

> [!NOTE]
> If you want to create an SSH connection to a Windows VM, Azure Bastion must be configured using the Standard SKU.
>

When connecting to a Windows virtual machine using SSH, you can use both username/password and SSH keys for authentication. You can connect to your VM with SSH keys by using either:

* A private key that you manually enter
* A file that contains the private key information

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. 

To SSH to a Windows virtual machine, you must also ensure that:
* Your Windows virtual machine is running Windows Server 2019 or later
* You have OpenSSH Server installed and running on your Windows virtual machine. To learn how to do this, see [Install OpenSSH](/windows-server/administration/openssh/openssh_install_firstuse).
* Azure Bastion has been configured to use the Standard SKU.

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

### Ports

In order to connect to the Windows VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you will then need to specify this custom port when you connect to the VM via Azure Bastion)

### Supported configurations

Currently, Azure Bastion only supports connecting to Windows VMs via SSH using **OpenSSH**.

## <a name="username"></a>Connect: Using username and password

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connect.png" alt-text="Screenshot of  overview for a virtual machine in Azure portal with Connect selected." lightbox="./media/bastion-connect-vm-ssh-windows/connect.png":::

1. After you select Bastion, select **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, expand the **Connection Settings** section and select **SSH**. If you plan to use an inbound port different from the standard SSH port (22), enter the **Port**.

    :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connection-settings.png" alt-text="Screenshot showing the Connection settings." lightbox="./media/bastion-connect-vm-ssh-windows/connection-settings.png":::

1. Enter the **Username** and **Password**, and then select **Connect** to connect to the VM.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/authentication.png" alt-text="Screenshot of Password authentication." lightbox="./media/bastion-connect-vm-ssh-windows/authentication.png":::

## <a name="privatekey"></a>Connect: Manually enter a private key

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected." lightbox="./media/bastion-connect-vm-ssh-windows/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, expand the **Connection Settings** section and select **SSH**. If you plan to use an inbound port different from the standard SSH port (22), enter the **Port**.

    :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connection-settings-manual.png" alt-text="Screenshot of Connection settings." lightbox="./media/bastion-connect-vm-ssh-windows/connection-settings-manual.png":::

1. Enter the **Username** and **SSH Private Key**. Enter your private key into the text area **SSH Private Key** (or paste it directly).

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/authentication-manual.png" alt-text="Screenshot of SSH key authentication." lightbox="./media/bastion-connect-vm-ssh-windows/authentication-manual.png":::

1. Select **Connect** to connect to the VM.

## <a name="ssh"></a>Connect: Using a private key file

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connect.png" alt-text="Screenshot depicts the overview for a virtual machine in Azure portal with Connect selected" lightbox="./media/bastion-connect-vm-ssh-windows/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, expand the **Connection Settings** section and select **SSH**. If you plan to use an inbound port different from the standard SSH port (22), enter the **Port**.

    :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connection-settings-file.png" alt-text="Screenshot depicts Connection settings." lightbox="./media/bastion-connect-vm-ssh-windows/connection-settings-file.png":::

1. Enter the **Username** and **SSH Private Key from Local File**. Browse for the file, then select **Open**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/authentication-file.png" alt-text="Screenshot depicts SSH key file." lightbox="./media/bastion-connect-vm-ssh-windows/authentication-file.png":::

1. Select **Connect** to connect to the VM. Once you click Connect, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## <a name="akv"></a>Connect: Using a private key stored in Azure Key Vault

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine that you want to connect to, then click **Connect** and select **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connect.png" alt-text="Screenshot is the overview for a virtual machine in Azure portal with Connect selected." lightbox="./media/bastion-connect-vm-ssh-windows/connect.png":::
1. After you select Bastion, click **Use Bastion**. If you didn't provision Bastion for the virtual network, see [Configure Bastion](./quickstart-host-portal.md).
1. On the **Connect using Azure Bastion** page, expand the **Connection Settings** section and select **SSH**. If you plan to use an inbound port different from the standard SSH port (22), enter the **Port**.

    :::image type="content" source="./media/bastion-connect-vm-ssh-windows/connection-settings-akv.png" alt-text="Screenshot showing Connection settings." lightbox="./media/bastion-connect-vm-ssh-windows/connection-settings-akv.png":::

1. Enter the **Username** and select **SSH Private Key from Azure Key Vault**.

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/ssh-key-vault.png" alt-text="Screenshot showing SSH Private Key from Azure Key Vault.":::
1. Select the **Azure Key Vault** dropdown and select the resource in which you stored your SSH private key. 

   * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.
   * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

      >[!NOTE]
      >Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
      >

   :::image type="content" source="./media/bastion-connect-vm-ssh-windows/private-key-stored.png" alt-text="Screenshot showing Azure Key Vault." lightbox="./media/bastion-connect-vm-ssh-windows/private-key-stored.png":::

1. Select the **Azure Key Vault Secret** dropdown and select the Key Vault secret containing the value of your SSH private key.
1. Select **Connect** to connect to the VM. Once you click **Connect**, SSH to this virtual machine will directly open in the Azure portal. This connection is over HTML5 using port 443 on the Bastion service over the private IP of your virtual machine.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md).
