---
title: 'Connect to a Linux VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Linux VM using SSH.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/13/2023
ms.author: cherylmc
---

# Create an SSH connection to a Linux VM using Azure Bastion

This article shows you how to securely and seamlessly create an SSH connection to your Linux VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software.

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md) overview article.

When connecting to a Linux virtual machine using SSH, you can use both username/password and SSH keys for authentication. The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](./tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network.

The connection settings and features that are available depend on the Bastion SKU you're using. Make sure your Bastion deployment is using the required SKU.

* To see the available features and settings per SKU tier, see the [SKUs and features](bastion-overview.md#sku) section of the Bastion overview article.  
* To check the SKU tier of your Bastion deployment and upgrade if necessary, see [Upgrade a Bastion SKU](upgrade-sku.md).

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

### Ports

In order to connect to the Linux VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22) ***or***
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion). This setting requires the **Standard** SKU tier.

## Bastion connection page

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine to which you want to connect. On the **Overview** page for the virtual machine, select **Connect**, then select **Bastion** from the dropdown to open the Bastion page.

   :::image type="content" source="./media/bastion-connect-vm-ssh-linux/bastion.png" alt-text="Screenshot shows the Overview page for a virtual machine." lightbox="./media/bastion-connect-vm-ssh-linux/bastion.png":::

1. On the **Bastion** page, the settings that you can configure depend on the Bastion [SKU](bastion-overview.md#sku) tier that your bastion host has been configured to use.

   * If you're using the **Standard** SKU, **Connection Settings** values (ports and protocols) are visible and can be configured.

      :::image type="content" source="./media/bastion-connect-vm-ssh-linux/bastion-connect-full.png" alt-text="Screenshot shows connection settings for the Standard SKU." lightbox="./media/bastion-connect-vm-ssh-linux/bastion-connect-full.png":::

   * If you're using the **Basic** SKU, you can't configure **Connection Settings** values. Instead, your connection uses the following default settings: SSH and port 22.

      :::image type="content" source="./media/bastion-connect-vm-ssh-linux/basic.png" alt-text="Screenshot shows connection settings for the Basic SKU." lightbox="./media/bastion-connect-vm-ssh-linux/basic.png":::

   * To view and select an available **Authentication Type**, use the dropdown.

      :::image type="content" source="./media/bastion-connect-vm-ssh-linux/authentication-type.png" alt-text="Screenshot shows authentication type settings." lightbox="./media/bastion-connect-vm-ssh-linux/authentication-type.png":::

1. Use the following sections in this article to configure authentication settings and connect to your VM.

   * [Username and password](#password-authentication)
   * [Password - Azure Key Vault](#password-authentication---azure-key-vault)
   * [SSH private key from local file](#ssh-private-key-authentication---local-file)
   * [SSH private key - Azure Key Vault](#ssh-private-key-authentication---azure-key-vault)

## Password authentication

Use the following steps to authenticate using username and password.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/password.png" alt-text="Screenshot shows Password authentication." lightbox="./media/bastion-connect-vm-ssh-linux/password.png":::

1. To authenticate using a username and password, configure the following settings.

   * **Connection Settings** (Standard SKU only)

     * **Protocol**: Select SSH.
     * **Port**: Specify the port number.

   * **Authentication type**: Select **Password** from the dropdown.
   * **Username**: Enter the username.
   * **Password**: Enter the **Password**.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Password authentication - Azure Key Vault

Use the following steps to authenticate using a password from Azure Key Vault.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/password-key-vault.png" alt-text="Screenshot shows password from Azure Key Vault authentication." lightbox="./media/bastion-connect-vm-ssh-linux/password-key-vault.png":::

1. To authenticate using a password from Azure Key Vault, configure the following settings.

   * **Connection Settings** (Standard SKU only)

     * **Protocol**: Select SSH.
     * **Port**: Specify the port number.
   * **Authentication type**: Select **Password from Azure Key Vault** from the dropdown.
   * **Username**: Enter the username.
   * **Subscription**: Select the subscription.
   * **Azure Key Vault**: Select the Key Vault.
   * **Azure Key Vault Secret**: Select the Key Vault secret containing the value of your SSH private key.

     * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.

     * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

       > [!NOTE]
       > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess-linux.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
       >

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## SSH private key authentication - local file

Use the following steps to authenticate using an SSH private key from a local file.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/private-key-file.png" alt-text="Screenshot shows private key from local file authentication." lightbox="./media/bastion-connect-vm-ssh-linux/private-key-file.png":::

1. To authenticate using a private key from a local file, configure the following settings.

   * **Connection Settings** (Standard SKU only)

     * **Protocol**: Select SSH.
     * **Port**: Specify the port number.
   * **Authentication type**: Select **SSH Private Key from Local File** from the dropdown.
   * **Username**: Enter the username.
   * **Local File**: Select the local file.
   * **SSH Passphrase**: Enter the SSH passphrase if necessary.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## SSH private key authentication - Azure Key Vault

Use the following steps to authenticate using a private key stored in Azure Key Vault.

:::image type="content" source="./media/bastion-connect-vm-ssh-linux/ssh-key-vault.png" alt-text="Screenshot shows Private key stored in Azure Key Vault authentication." lightbox="./media/bastion-connect-vm-ssh-linux/ssh-key-vault.png":::

1. To authenticate using a private key stored in Azure Key Vault, configure the following settings. For the Basic SKU, connection settings can't be configured and will instead use the default connection settings: SSH and port 22.

   * **Connection Settings** (Standard SKU only)

     * **Protocol**: Select SSH.
     * **Port**: Specify the port number.
   * **Authentication type**: Select **SSH Private Key from Azure Key Vault** from the dropdown.
   * **Username**: Enter the username.
   * **Subscription**: Select the subscription.
   * **Azure Key Vault**: Select the Key Vault.

     * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](../key-vault/secrets/quick-create-powershell.md) and store your SSH private key as the value of a new Key Vault secret.

     * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md).

       > [!NOTE]
       > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](../virtual-machines/extensions/vmaccess-linux.md#update-ssh-key) to update access to your target VM with a new SSH key pair.
       >

   * **Azure Key Vault Secret**: Select the Key Vault secret containing the value of your SSH private key.

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md).
