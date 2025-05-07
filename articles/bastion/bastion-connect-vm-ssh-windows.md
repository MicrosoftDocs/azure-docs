---
title: 'Connect to a Windows VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Windows VM using SSH.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 02/10/2025
ms.author: cherylmc
---

# Create an SSH connection to a Windows VM using Azure Bastion

This article shows you how to securely and seamlessly create an SSH connection to your Windows VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Windows VM using RDP. For information, see [Create an RDP connection to a Windows VM](bastion-connect-vm-rdp-windows.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see the [What is Azure Bastion?](bastion-overview.md).

> [!NOTE]
> If you want to create an SSH connection to a Windows VM, Azure Bastion must be configured using the Standard SKU or higher.
>

When connecting to a Windows virtual machine using SSH, you can use both username/password and SSH keys for authentication.

The SSH private key must be in a format that begins with  `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the VM resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in this virtual network.

To SSH to a Windows virtual machine, you must also ensure that:
* Your Windows virtual machine is running Windows Server 2019 or later.
* You have OpenSSH Server installed and running on your Windows virtual machine. To learn how to do this, see [Install OpenSSH](/windows-server/administration/openssh/openssh_install_firstuse).
* Azure Bastion has been configured to use the Standard SKU or higher.

### Required roles

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

### Ports

In order to connect to the Windows VM via SSH, you must have the following ports open on your VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion)

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

### Supported configurations

Currently, Azure Bastion only supports connecting to Windows VMs via SSH using **OpenSSH**.

## Bastion connection page

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. On the **Overview** page, select **Connect**, then select **Bastion** from the dropdown to open the Bastion connection page. You can also select **Bastion** from the left pane.

1. On the **Bastion** connection page, click the **Connection Settings** arrow to expand all the available settings. Notice that if you're using the Bastion **Standard** SKU or higher, you have more available settings.

1. Authenticate and connect using one of the methods in the following sections.

   * [Username and password](#username-and-password)
   * [Private key from local file](#private-key-from-local-file)
   * [Password - Azure Key Vault](#password---azure-key-vault)
   * [Private key - Azure Key Vault](#private-key---azure-key-vault)

## Username and password

Use the following steps to authenticate using username and password.


1. To authenticate using a username and password, configure the following settings:

    | Setting              | Value                                                                 |
    |----------------------|-----------------------------------------------------------------------|
    | **Protocol**         | Select SSH                                                            |
    | **Port**             | Input the port number. Custom port connections are available for the Standard SKU or higher. |
    | **Authentication type** | Select **Password** from the dropdown                                |
    | **Username**         | Enter the username                                                    |
    | **Password**         | Enter the **Password**                                                |
    
1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Private key from local file

Use the following steps to authenticate using an SSH private key from a local file.

1. To authenticate using a private key from a local file, configure the following settings:

    | Setting              | Value                                                                 |
    |----------------------|-----------------------------------------------------------------------|
    | **Protocol**         | Select SSH                                                            |
    | **Port**             | Input the port number. Custom port connections are available for the Standard SKU or higher. |
    | **Authentication type** | Select **SSH Private Key from Local File** from the dropdown         |
    | **Local File**       | Select the local file                                                 |
    | **SSH Passphrase**   | Enter the SSH passphrase if necessary                                 |

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Password - Azure Key Vault

Use the following steps to authenticate using a password from Azure Key Vault.

1. To authenticate using a password from Azure Key Vault, configure the following settings:

    | Setting                | Value                                                                 |
    |------------------------|-----------------------------------------------------------------------|
    | **Protocol**           | Select SSH                                                            |
    | **Port**               | Input the port number. Custom port connections are available for the Standard SKU or higher. |
    | **Authentication type**| Select **Password from Azure Key Vault** from the dropdown            |
    | **Username**           | Enter the username                                                    |
    | **Subscription**       | Select the subscription                                               |
    | **Azure Key Vault**    | Select the Key Vault                                                  |
    | **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your SSH private key |

   * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](/azure/key-vault/secrets/quick-create-powershell) and store your SSH private key as the value of a new Key Vault secret.

   * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

      > [!NOTE]
      > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](/azure/virtual-machines/extensions/vmaccess-linux#update-ssh-key) to update access to your target VM with a new SSH key pair.
      >

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Private key - Azure Key Vault

Use the following steps to authenticate using a private key stored in Azure Key Vault.


1. To authenticate using a private key stored in Azure Key Vault, configure the following settings:

    | Setting                | Value                                                                 |
    |------------------------|-----------------------------------------------------------------------|
    | **Protocol**           | Select SSH                                                            |
    | **Port**               | Input the port number. Custom port connections are available for the Standard SKU or higher. |
    | **Authentication type**| Select **SSH Private Key from Azure Key Vault** from the dropdown     |
    | **Username**           | Enter the username                                                    |
    | **Subscription**       | Select the subscription                                               |
    | **Azure Key Vault**    | Select the Key Vault                                                  |
    | **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your SSH private key |
    

   * If you didn’t set up an Azure Key Vault resource, see [Create a key vault](/azure/key-vault/secrets/quick-create-powershell) and store your SSH private key as the value of a new Key Vault secret.

   * Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

      > [!NOTE]
      > Please store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](/azure/virtual-machines/extensions/vmaccess-linux#update-ssh-key) to update access to your target VM with a new SSH key pair.
      >

1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

## Next steps

For more information about Azure Bastion, see the [Bastion FAQ](bastion-faq.md).
