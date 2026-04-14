---
title: 'Connect to a Linux VM using SSH'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to a Linux VM using SSH via the Azure portal, a specified IP address, or a native client.
author: cherylmc
ms.service: azure-bastion
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 03/12/2026
ms.author: cherylmc
# Customer intent: "As a cloud administrator, I want to securely connect to a Linux VM using SSH through a managed service, so that I can ensure safe access without exposing RDP/SSH ports to the internet."
---

# Create an SSH connection to a Linux VM using Azure Bastion

This article describes how to create a secure SSH connection to your Linux virtual machines using Azure Bastion. You can connect through the Azure portal (browser-based), via a specified IP address, or using a native client on your local computer. When you use Azure Bastion, your virtual machines don't require a client, agent, or additional software. Azure Bastion securely connects to all virtual machines in the virtual network without exposing RDP/SSH ports to the public internet. For more information, see [What is Azure Bastion?](bastion-overview.md)

For native client connections using Azure CLI, see [Connect to a VM using a Linux native client](connect-vm-native-client-linux.md) or [Connect to a VM using a Windows native client](connect-vm-native-client-windows.md). To connect to a Linux VM using RDP, see [Create an RDP connection to a Linux VM](bastion-connect-vm-linux-rdp.md).

The following diagram shows the dedicated deployment architecture using an SSH connection.

:::image type="content" source="./media/connect-vm-ssh-linux/host-architecture-ssh-linux.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/connect-vm-ssh-linux/host-architecture-ssh-linux.png":::

## Prerequisites

Before you begin, verify that you meet the following criteria:

* An Azure Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). To set up a Bastion host, see [Create a bastion host](quickstart-host-portal.md#createhost). The SKU you need depends on your connection method:

  | Connection method | Minimum SKU | Additional configuration |
  |---|---|---|
  | Azure portal (browser) | Basic | None |
  | Azure portal with custom ports | Standard | None |
  | IP-based connection | Standard | [IP-based connection](connect-ip-address.md#sku-requirements) enabled |
  | Native client (SSH) | Standard | [Native client support](native-client.md) enabled |

* A Linux virtual machine in the virtual network (or reachable from the virtual network for [IP-based connections](connect-ip-address.md)).

* **Required roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).
  * Virtual Machine Administrator Login or Virtual Machine User Login role (only required for [Microsoft Entra ID authentication](bastion-entra-id-authentication.md)).

* **Ports:** In order to connect to the Linux VM via SSH, you must have the following ports open on your VM:

  * Inbound port: SSH (22) ***or***
  * Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion). This setting isn't available for the Basic or Developer SKU.

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## Authentication methods

The following table shows which authentication methods are available for each connection method.

| Authentication method | Supported connection methods | Minimum SKU |
|---|---|---|
| [Microsoft Entra ID](bastion-entra-id-authentication.md) | Azure portal, native client | Basic (portal), Standard (native client) |
| Username and password | Azure portal, IP address (portal), native client | Basic (portal), Standard (IP address, native client) |
| Password from Azure Key Vault | Azure portal | Basic |
| SSH private key from local file | Azure portal, IP address (portal), native client | Basic (portal), Standard (IP address, native client) |
| SSH private key from Azure Key Vault | Azure portal | Basic |

## Authentication details

Configure the authentication settings for your connection. Not all authentication methods are available for every connection method. See the [authentication methods](#authentication-methods) table for availability.

# [Microsoft Entra ID](#tab/entra-id)

**Available for:** Azure portal, native client. Not supported for IP-based connections.

For prerequisites, setup steps, and connection instructions, see [Configure Microsoft Entra ID authentication for Azure Bastion](bastion-entra-id-authentication.md).

# [Username and password](#tab/password)

**Available for:** Azure portal, IP address (portal), native client.

To authenticate using a username and password, configure the following settings.

| Setting                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **Authentication type**| Select **Password** from the dropdown.                                      |
| **Username**           | Enter the username.                                                         |
| **Password**           | Enter the **Password**.                                                     |

When connecting via the portal, select **Open in new browser tab** if desired, then select **Connect**.

# [Password from Azure Key Vault](#tab/keyvault-password)

**Available for:** Azure portal only.

To authenticate using a password from Azure Key Vault, configure the following settings.

| Setting                    | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Authentication type**    | Select **Password from Azure Key Vault** from the dropdown.                 |
| **Username**               | Enter the username.                                                         |
| **Subscription**           | Select the subscription.                                                    |
| **Azure Key Vault**        | Select the Key Vault.                                                       |
| **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your SSH private key.   |

For Key Vault setup requirements, see [Key Vault configuration](#key-vault-configuration).

Select **Open in new browser tab** if desired, then select **Connect**.

# [SSH private key from local file](#tab/ssh-key-local)

**Available for:** Azure portal, IP address (portal), native client.

> [!NOTE]
> The SSH private key must be in a format that begins with `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

To authenticate using a private key from a local file, configure the following settings.

| Setting                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **Authentication type**| Select **SSH Private Key from Local File** from the dropdown.               |
| **Username**           | Enter the username.                                                         |
| **Local File**         | Select the local file.                                                      |
| **SSH Passphrase**     | Enter the SSH passphrase if necessary.                                      |

When connecting via the portal, select **Open in new browser tab** if desired, then select **Connect**.

# [SSH private key from Azure Key Vault](#tab/ssh-key-keyvault)

**Available for:** Azure portal only. Not supported for native client or IP-based connections.

> [!NOTE]
> The SSH private key must be in a format that begins with `"-----BEGIN RSA PRIVATE KEY-----"` and ends with `"-----END RSA PRIVATE KEY-----"`.

To authenticate using a private key stored in Azure Key Vault, configure the following settings.

| Setting                    | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Authentication type**    | Select **SSH Private Key from Azure Key Vault** from the dropdown.          |
| **Username**               | Enter the username.                                                         |
| **Subscription**           | Select the subscription.                                                    |
| **Azure Key Vault**        | Select the Key Vault.                                                       |
| **Azure Key Vault Secret** | Select the Key Vault secret containing the value of your SSH private key.   |

For Key Vault setup requirements, see [Key Vault configuration](#key-vault-configuration).

Select **Open in new browser tab** if desired, then select **Connect**.

---

### Key Vault configuration

If you're using Azure Key Vault to store a password or SSH private key, configure your Key Vault using the following requirements:

* If you didn't set up an Azure Key Vault resource, see [Create a key vault](/azure/key-vault/secrets/quick-create-powershell) and store your secret (password or SSH private key) as the value of a new Key Vault secret.
* Make sure you have **List** and **Get** access to the secrets stored in the Key Vault resource. To assign and modify access policies for your Key Vault resource, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).
* Store your secret in Azure Key Vault using the **PowerShell** or **Azure CLI** experience. Storing your secret via the Azure Key Vault portal experience interferes with the formatting and results in unsuccessful login. If you stored your private key as a secret using the portal experience and no longer have access to the original private key file, see [Update SSH key](/azure/virtual-machines/extensions/vmaccess-linux#update-ssh-key) to update access to your target VM with a new SSH key pair.

## Connect to a virtual machine using SSH

Choose your connection method tab below to see the navigation steps for connecting to your VM. For available authentication methods per connection method, see the [authentication methods](#authentication-methods) table.

# [Azure portal](#tab/portal)

Use the Azure portal to create a browser-based SSH connection to your Linux virtual machine. This method connects directly through your browser. No native SSH client or additional software is required on your local computer. The [Basic SKU](bastion-sku-comparison.md) or higher is required, or the Standard SKU if you need custom ports.

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine to which you want to connect. At the top of the virtual machine **Overview** page, select **Connect**, then select **Connect via Bastion** from the dropdown. This opens the **Bastion** page. You can also go to the Bastion page directly in the left pane.

1. On the **Bastion** page, the settings that you can configure depend on the Bastion [SKU](bastion-overview.md#sku) that your bastion host has been configured to use.

   * If you're using a SKU higher than the Basic SKU, **Connection Settings** values (ports and protocols) are visible and can be configured.
   * If you're using the Basic SKU or Developer SKU, you can't configure **Connection Settings** values. Instead, your connection uses the following default settings: SSH and port 22.
   * To view and select an available **Authentication Type**, use the dropdown.

1. Configure your authentication settings. For details, see [Authentication details](#authentication-details). Select **Connect**.

# [IP address (portal)](#tab/ip-address)

Use the Azure portal to create a browser-based SSH connection to your Linux virtual machine using a specified IP address. This method connects through your browser and doesn't require a native SSH client or additional software on your local computer. The Standard SKU or higher is required, and you must enable [IP-based connection](connect-ip-address.md).

#### Enable IP-based connection

Before you can connect using an IP address, you must enable IP-based connection on your Bastion deployment.

1. In the [Azure portal](https://portal.azure.com), go to your Bastion deployment.

1. On the **Configuration** page, for **Tier**, verify the SKU is set to the **Standard** SKU or higher. If the SKU is set to the Basic SKU, select a higher SKU from the dropdown.

1. Select **IP based connection**.

1. Select **Apply** to apply the changes. It takes a few minutes for the Bastion configuration to complete.

After IP-based connection is enabled, you specify the IP address of the target virtual machine directly on the Bastion **Connect** page, rather than selecting a virtual machine from the Azure portal.

#### Connect using an IP address

1. To connect to a virtual machine using a specified IP address, make the connection from Bastion, not directly from the virtual machine page. On your Bastion resource, select **Connect** to open the Connect page.

1. On the Bastion **Connect** page, for **IP address**, enter the IP address of the target virtual machine.

1. Adjust your connection settings to the desired **Protocol** (SSH) and **Port**.

1. Available authentication types for IP-based SSH connections from the portal are **Password** and **SSH Private Key from Local File**. Configure your authentication settings. For details, see [Authentication details](#authentication-details). Select **Connect**.

> [!NOTE]
> Microsoft Entra ID authentication isn't supported for IP-based SSH connections. For more information, see [IP-based connections](connect-ip-address.md).

# [Native client](#tab/native-client)

Connect to your Linux virtual machine from a local computer using Azure CLI (`az network bastion ssh`). This method requires the [Standard SKU](bastion-sku-comparison.md) or higher with [native client support configured](native-client.md).

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

[!INCLUDE [VM connect prerequisites](../../includes/bastion-native-pre-vm-connect.md)]

[!INCLUDE [roles and ports](../../includes/bastion-native-roles-ports.md)]

For complete steps to connect using the native client, see [Connect to a VM using Bastion and a Linux native client](connect-vm-native-client-linux.md).

For supported authentication types, see [Authentication details](#authentication-details).

> [!NOTE]
> Signing in using an SSH private key stored in Azure Key Vault isn't supported with native client connections. Before signing in to your Linux VM using an SSH key pair, download your private key to a file on your local machine.

---

## Limitations

* **IP-based connections:** IP-based connection doesn't work with force tunneling over VPN, or when a default route is advertised over an ExpressRoute circuit. Azure Bastion requires access to the internet. Force tunneling or default route advertisement results in traffic being dropped.
* **IP-based connections:** UDR isn't supported on the Bastion subnet, including with IP-based connections.
* **IP-based connections:** Microsoft Entra ID authentication isn't supported for IP-based SSH connections. For more information, see [Microsoft Entra ID authentication](bastion-entra-id-authentication.md).
* **Native client:** Signing in using an SSH private key stored in Azure Key Vault isn't supported with native client connections.
* **Native client:** This feature isn't supported in Cloud Shell.

## Next steps

* [Connect to a Linux VM using RDP](bastion-connect-vm-linux-rdp.md)
* [What is Azure Bastion?](bastion-overview.md)
* [Configure Microsoft Entra ID authentication](bastion-entra-id-authentication.md) for identity-based access.
* [Transfer files](vm-upload-download-native.md) to your virtual machine using a native client.
* [Configure a shareable link](shareable-link.md) for users without Azure portal access.
* [Azure Bastion FAQ](bastion-faq.md)