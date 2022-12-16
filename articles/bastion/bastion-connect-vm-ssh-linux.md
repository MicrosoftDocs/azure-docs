---
title: 'Connect to a Linux VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Linux VM using SSH.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/18/2022
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Create an SSH connection to a Linux VM using Azure Bastion

This article shows you how to securely and seamlessly create an SSH connection to your Linux VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Linux VM using RDP. For information, see [Create an RDP connection to a Linux VM](bastion-connect-vm-rdp-linux.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md) overview article.

When connecting to a Linux virtual machine using SSH, you can use both username/password and SSH keys for authentication. 

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](./tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network. 

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network)

### Ports

In order to connect to the Linux VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22) ***or***
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion)

   > [!NOTE]
   > If you want to specify a custom port value, Azure Bastion must be configured using the Standard SKU. The Basic SKU does not allow you to specify custom ports.
   >

## Bastion connection page

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. On the **Overview** page, select **Connect**, then select **Bastion** from the dropdown to open the Bastion connection page. You can also select **Bastion** from the left pane.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connect.png" alt-text="Screenshot shows the overview for a virtual machine in Azure portal with Connect selected" lightbox="./media/bastion-connect-vm-ssh-linux/connect.png":::

1. On the **Bastion** connection page, click the **Connection Settings** arrow to expand all the available settings. If you are using a Bastion **Standard** SKU, you have more available settings than a Basic SKU.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/connection-settings.png" alt-text="Screenshot shows connection settings.":::

1. Authenticate and connect using one of the methods in the following sections.

   * [Username and password](#username-and-password)
   * [Private key from local file](#private-key-from-local-file)
   * [Password - Azure Key Vault](#password---azure-key-vault)
   * [Private key - Azure Key Vault](#private-key---azure-key-vault)

## Username and password

Use the following steps to authenticate using username and password.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/password.png" alt-text="Screenshot shows Password authentication.":::

1. To authenticate using a username and password, configure the following settings:

   * **Protocol**: Select SSH.
   * **Port**: Input the port number. Custom port connections are available for the Standard SKU only.
   * **Authentication type**: Select **Password** from the dropdown.
   * **Username**: Enter the username.
   * **Password**: Enter the **Password**.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Private key from local file

Use the following steps to authenticate using an SSH private key from a local file.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/private-key-file.png" alt-text="Screenshot shows private key from local file authentication.":::

1. To authenticate using a private key from a local file, configure the following settings:

   * **Protocol**: Select SSH.
   * **Port**: Input the port number. Custom port connections are available for the Standard SKU only.
   * **Authentication type**: Select **SSH Private Key from Local File** from the dropdown.
   * **Local File**: Select the local file.
   * **SSH Passphrase**: Enter the SSH passphrase if necessary.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Password - Azure Key Vault

Use the following steps to authenticate using a password from Azure Key Vault.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/password-key-vault.png" alt-text="Screenshot shows password from Azure Key Vault authentication.":::

1. To authenticate using a password from Azure Key Vault, configure the following settings:

   * **Protocol**: Select SSH.
   * **Port**: Input the port number. Custom port connections are available for the Standard SKU only.
   * **Authentication type**: Select **Password from Azure Key Vault** from the dropdown.
   * **Username**: Enter the username.
   * **Subscription**: Select the subscription.
   * **Azure Key Vault**: Select the Key Vault.
   * **Azure Key Vault Secret**: Select the Key Vault secret containing the value of your SSH private key.

     * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.

     * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

       > [!NOTE]
       > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
       >

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Private key - Azure Key Vault

Use the following steps to authenticate using a private key stored in Azure Key Vault.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/ssh-key-vault.png" alt-text="Screenshot shows Private key stored in Azure Key Vault authentication.":::

1. To authenticate using a private key stored in Azure Key Vault, configure the following settings:

   * **Protocol**: Select SSH.
   * **Port**: Input the port number. Custom port connections are available for the Standard SKU only.
   * **Authentication type**: Select **SSH Private Key from Azure Key Vault** from the dropdown.
   * **Username**: Enter the username.
   * **Subscription**: Select the subscription.
   * **Azure Key Vault**: Select the Key Vault.

     * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.

     * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

       > [!NOTE]
       > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
       >

   * **Azure Key Vault Secret**: Select the Key Vault secret containing the value of your SSH private key.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md).
