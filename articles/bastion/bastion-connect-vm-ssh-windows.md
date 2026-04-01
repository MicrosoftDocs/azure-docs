---
title: 'Connect to a Windows VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to a Windows VM using SSH via the Azure portal.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/12/2026
ms.author: abell
# Customer intent: "As a cloud administrator, I want to connect to a Windows VM using SSH through a secure service, so that I can manage the VM without exposing sensitive ports to the internet."
---

# Create an SSH connection to a Windows VM using Azure Bastion

This article describes how to create a secure SSH connection to your Windows virtual machines using Azure Bastion. You can connect through the Azure portal (browser-based). When you use Azure Bastion, your virtual machines don't require a client, agent, or additional software. Azure Bastion securely connects to all virtual machines in the virtual network without exposing RDP/SSH ports to the public internet. For more information, see [What is Azure Bastion?](bastion-overview.md)

For RDP connections to a Windows virtual machine, see [Create an RDP connection to a Windows VM](bastion-connect-vm-rdp-windows.md). For native client connections using Azure CLI (including SSH tunnels), see [Connect to a VM using a native client](connect-vm-native-client-windows.md).

The following diagram shows the dedicated deployment architecture using an SSH connection.

:::image type="content" source="./media/connect-vm-ssh-windows/host-architecture-ssh-windows.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/connect-vm-ssh-windows/host-architecture-ssh-windows.png":::

## Prerequisites

Before you begin, verify that you meet the following criteria:

* An Azure Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). To set up a Bastion host, see [Create a bastion host](quickstart-host-portal.md#createhost). The [Standard SKU](bastion-sku-comparison.md) or higher is required for SSH connections to Windows VMs.

  | Connection method | Minimum SKU | Additional configuration |
  |---|---|---|
  | Azure portal (browser) | Standard | None |

* A Windows virtual machine running Windows Server 2019 or later in the virtual network.

* [OpenSSH Server](/windows-server/administration/openssh/openssh_install_firstuse) installed and running on your Windows virtual machine. Azure Bastion only supports connecting to Windows VMs via SSH using **OpenSSH**.

* Azure Bastion uses SSH port 22 by default. Custom ports require the [Standard SKU or higher](bastion-sku-comparison.md).

* **Required roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with the IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## Authentication methods

The following authentication methods are available for SSH connections to Windows VMs through Azure Bastion. Select an authentication method tab to see the corresponding steps.

| Authentication method | Minimum SKU |
|---|---|
| Username and password | Standard |
| SSH private key from local file | Standard |
| Password from Azure Key Vault | Standard |
| SSH private key from Azure Key Vault | Standard |

> [!NOTE]
> [Microsoft Entra ID authentication](bastion-entra-id-authentication.md) and [Kerberos authentication](kerberos-authentication-portal.md) are not supported for SSH connections to Windows VMs. These authentication methods are available for [RDP connections](bastion-connect-vm-rdp-windows.md).

## Connect to a virtual machine using SSH

1. In the [Azure portal](https://portal.azure.com), select your virtual machine. On the left pane, select **Connect**, then select **Bastion**.

1. In the **Connection Settings**, select **SSH** as the protocol, and enter the port number if you changed it from the default of 22.

1. Select your authentication method and configure the settings shown in the corresponding tab. Then select **Connect** to open the SSH connection to your virtual machine in a new browser tab.

# [Username and password](#tab/password)

To authenticate using a username and password, configure the following settings:

| Setting | Value |
|---|---|
| **Authentication type** | Select **Password** from the dropdown. |
| **Username** | Enter the username. |
| **Password** | Enter the password. |

# [Private key from local file](#tab/local-key)

To authenticate using an SSH private key from a local file, configure the following settings:

| Setting | Value |
|---|---|
| **Authentication type** | Select **SSH Private Key from Local File** from the dropdown. |
| **Username** | Enter the username. |
| **Local File** | Select the local file. |
| **SSH Passphrase** | Enter the SSH passphrase if necessary. |

# [Password - Azure Key Vault](#tab/kv-password)

To authenticate using a password from Azure Key Vault, configure the following settings:

| Setting | Value |
|---|---|
| **Authentication type** | Select **Password from Azure Key Vault** from the dropdown. |
| **Username** | Enter the username. |
| **Subscription** | Select the subscription. |
| **Azure Key Vault** | Select the Key Vault. |
| **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your password. |

If you didn't set up an Azure Key Vault resource, see [Create a key vault](/azure/key-vault/secrets/quick-create-powershell) and store your password as the value of a new Key Vault secret.

Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

# [Private key - Azure Key Vault](#tab/kv-key)

To authenticate using a private key stored in Azure Key Vault, configure the following settings:

| Setting | Value |
|---|---|
| **Authentication type** | Select **SSH Private Key from Azure Key Vault** from the dropdown. |
| **Username** | Enter the username. |
| **Subscription** | Select the subscription. |
| **Azure Key Vault** | Select the Key Vault. |
| **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your SSH private key. |

If you didn't set up an Azure Key Vault resource, see [Create a key vault](/azure/key-vault/secrets/quick-create-powershell) and store your SSH private key as the value of a new Key Vault secret.

Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

> [!NOTE]
> Store your SSH private key as a secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your private key via the Azure Key Vault portal experience will interfere with the formatting and result in unsuccessful login. If you did store your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](/azure/virtual-machines/extensions/vmaccess-linux#update-ssh-key) to update access to your target VM with a new SSH key pair.

---

## Limitations

* **Connection methods:** SSH connections to Windows VMs are supported through the Azure portal only. Native client (`az network bastion ssh`) and IP-based connections aren't supported for SSH to Windows VMs. For a workaround using RDP over port 22, see [Connect to a VM using a native client](connect-vm-native-client-windows.md).
* **Microsoft Entra ID:** Microsoft Entra authentication isn't supported for SSH connections to Windows VMs. For Entra ID auth details, see [About Microsoft Entra ID authentication](bastion-entra-id-authentication.md).
* **Kerberos:** Kerberos authentication isn't supported for SSH connections. For Kerberos with RDP connections, see [Configure Kerberos authentication](kerberos-authentication-portal.md).
* **File transfer:** File transfer isn't available for SSH connections via the portal. To transfer files, use a [native client RDP connection](vm-upload-download-native.md).
* **Key format:** SSH private keys must be in RSA format (`-----BEGIN RSA PRIVATE KEY-----`).

## Next steps

* [Connect to a Windows VM using RDP](bastion-connect-vm-rdp-windows.md)
* [What is Azure Bastion?](bastion-overview.md)
* [Connect to a VM using a native client](connect-vm-native-client-windows.md)
* [Azure Bastion FAQ](bastion-faq.md)
