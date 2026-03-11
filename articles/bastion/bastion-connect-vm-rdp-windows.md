---
title: 'Connect to a Windows VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to a Windows VM using RDP via the Azure portal, a specified IP address, or a native client.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/06/2026
ms.author: abell

# Customer intent: "As a cloud administrator, I want to establish a secure RDP connection to a Windows VM using a Bastion host, so that I can access my virtual machines without exposing them to the public internet."
---

# Create an RDP connection to a Windows VM using Azure Bastion

This article describes how to create a secure RDP connection to your Windows virtual machines using Azure Bastion. You can connect through the Azure portal (browser-based), via a specified IP address, or using a native client on your local Windows computer. When you use Azure Bastion, your virtual machines don't require a client, agent, or additional software. Azure Bastion securely connects to all virtual machines in the virtual network without exposing RDP/SSH ports to the public internet. For more information, see [What is Azure Bastion?](bastion-overview.md)

For native client connections using Azure CLI (including SSH and tunnel), see [Connect to a VM using a native client](connect-vm-native-client-windows.md). To connect to a Windows virtual machine using SSH, see [Create an SSH connection to a Windows VM](bastion-connect-vm-ssh-windows.md).

The following diagram shows the dedicated deployment architecture using an RDP connection.

:::image type="content" source="./media/connect-vm-rdp-windows/host-architecture-rdp.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/connect-vm-rdp-windows/host-architecture-rdp.png":::

## Prerequisites

Before you begin, verify that you meet the following criteria:

* An Azure Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). To set up a Bastion host, see [Create a bastion host](quickstart-host-portal.md#createhost). The SKU you need depends on your connection method:

  | Connection method | Minimum SKU | Additional configuration |
  |---|---|---|
  | Azure portal (browser) | Basic | None |
  | Azure portal with custom ports | Standard | None |
  | IP-based connection | Standard | [IP-based connection](connect-ip-address.md#configure-bastion) enabled |
  | Native client (RDP) | Standard | [Native client support](native-client.md) enabled |

* Users connecting via RDP must have rights on the target virtual machine. If the user isn't a local administrator, add them to the **Remote Desktop Users** group.

* Azure Bastion uses RDP port 3389 by default. Custom ports require the [Standard SKU or higher](bastion-sku-comparison.md). To upgrade, see [Upgrade a SKU](upgrade-sku.md).

* A Windows virtual machine in the virtual network (or reachable from the virtual network for [IP-based connections](connect-ip-address.md)).

* **Required roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with the IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).
  * Virtual Machine Administrator Login or Virtual Machine User Login role (only required for [Microsoft Entra ID authentication](bastion-entra-id-authentication.md)).


See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

<a name="entra-id"></a>

## Authentication methods

<a name="microsoft-entra-id-authentication-preview"></a>

The following authentication methods are available for RDP connections through Azure Bastion. Select an authentication method to see the corresponding steps.

| Authentication method | Supported connection methods | Minimum SKU |
|---|---|---|
| [Microsoft Entra ID (Preview)](bastion-entra-id-authentication.md) (Preview for RDP) | Azure portal, native client | Basic (portal), Standard (native client) |
| Username and password | Azure portal, IP address (portal), native client | Basic (portal), Standard (IP address, native client) |
| [Kerberos](kerberos-authentication-portal.md) | Azure portal | Basic |

<a name="connect-to-a-vm"></a>

## Connect to a virtual machine using RDP 

Select a connection method to see the corresponding steps. After you navigate to the Bastion connection page, choose your [authentication method](#authentication-methods).

# [Azure portal](#tab/portal)

<a name="rdp"></a>

Use the Azure portal to create a browser-based RDP connection to your Windows virtual machine. This method connects directly through your browser. No native RDP client or additional software is required on your local computer. The [Basic SKU](bastion-sku-comparison.md) or higher is required, or the Standard SKU if you need custom ports.


1. In the [Azure portal](https://portal.azure.com), select your virtual machine. On the left pane select **Connect**, then select **Bastion**.

1. In the **Connection settings** tab, select **RDP** as the protocol, and enter the port number if you changed it from the default of 3389.

1. Select your authentication method. [Microsoft Entra ID (Preview)](bastion-entra-id-authentication.md) is recommended. For other options, see [Authentication methods](#authentication-methods).

1. Select **Connect** to open the RDP connection to your virtual machine in a new browser tab.

> [!NOTE]
> For troubleshooting tips, see [Troubleshooting RDP connections](troubleshoot.md) and [Troubleshoot Microsoft Entra sign in for a Windows virtual machine in Azure or Arc-enabled Windows Server](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows#troubleshoot-sign-in-problems)


# [IP address (portal)](#tab/ip-address)

<a name="ip-address"></a>

Use the Azure portal to create a browser-based RDP connection to your Windows virtual machine using a specified IP address. This method connects through your browser and doesn't require a native RDP client or additional software on your local computer. The Standard SKU or higher is required, and you must enable [IP-based connection](connect-ip-address.md).

### Enable IP-based connection

Before you can connect using an IP address, you must enable IP-based connection on your Bastion deployment.

1. In the [Azure portal](https://portal.azure.com), go to your Bastion deployment.

1. On the **Configuration** page, for **Tier**, verify the SKU is set to the **Standard** SKU or higher. If the SKU is set to the Basic SKU, select a higher SKU from the dropdown.

1. Select **IP based connection**.

1. Select **Apply** to apply the changes. It takes a few minutes for the Bastion configuration to complete.

1. You specify the IP address of the target virtual machine directly on the Bastion **Connect** page, rather than selecting a virtual machine from the Azure portal.

### Connect using an IP address

1. To connect to a virtual machine using a specified IP address, make the connection from Bastion, not directly from the virtual machine page. On your Bastion resource, select **Connect** to open the Connect page.

1. On the Bastion **Connect** page, for **IP address**, enter the IP address of the target virtual machine.

    :::image type="content" source="./media/connect-ip-address/ip-address.png" alt-text="Screenshot of the Connect using Azure Bastion page." lightbox="./media/connect-ip-address/ip-address.png":::

1. Adjust your connection settings to the desired **Protocol** (RDP) and **Port**.

1. Enter your credentials in **Username** and **Password**.

1. Select **Connect** to connect to your virtual machine.

For native client RDP connections via IP address, see the **Native client** tab on this page.

# [Native client](#tab/native-client)

Connect to your Windows virtual machine from a local Windows computer using Azure CLI (`az network bastion rdp`). This method requires the [Standard SKU](bastion-sku-comparison.md) or higher with [native client support configured](native-client.md).

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

[!INCLUDE [Native client RDP to Windows VM](../../includes/bastion-native-rdp-windows.md)]

For SSH and tunnel connections, see [Connect to a VM using Bastion and the Windows native client](connect-vm-native-client-windows.md).

---

## Limitations

* **IP-based connections:** IP-based connection doesn't work with force tunneling over VPN, or when a default route is advertised over an ExpressRoute circuit. Azure Bastion requires access to the Internet and force tunneling, or the default route advertisement, results in traffic blackholing.
* **IP-based connections:** UDR isn't supported on the Bastion subnet, including with IP-based connections.
* **IP-based connections:** Custom ports and protocols aren't currently supported when connecting to a virtual machine via native client with IP-based connections.
* **Microsoft Entra ID:** Microsoft Entra authentication isn't supported for IP-based RDP connections. IP-based SSH connections via native client do support Entra ID authentication. For Entra ID auth details, see [About Microsoft Entra ID authentication](bastion-entra-id-authentication.md).
* **Session recording:** RDP + Entra ID authentication in the portal can't be used concurrently with [graphical session recording](session-recording.md).

## Next steps

* [Connect to a Windows VM using SSH](bastion-connect-vm-ssh-windows.md)
* [What is Azure Bastion?](bastion-overview.md)
* [Configure Microsoft Entra ID authentication](bastion-entra-id-authentication.md) for identity-based access.
* [Configure Kerberos authentication](kerberos-authentication-portal.md) for domain-joined virtual machines.
* [Transfer files](vm-upload-download-native.md) to your virtual machine using a native client.
* [Configure a shareable link](shareable-link.md) for users without Azure portal access.
* [Azure Bastion FAQ](bastion-faq.md)