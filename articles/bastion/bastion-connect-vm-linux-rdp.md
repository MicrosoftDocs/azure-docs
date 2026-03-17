---
title: 'Connect to a Linux VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to a Linux VM using RDP via the Azure portal or a specified IP address.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/12/2026
ms.author: abell
ms.custom:
  - linux-related-content
# Customer intent: "As a cloud administrator, I want to establish a secure RDP connection to a Linux VM using a Bastion host, so that I can access my virtual machines without exposing them to the public internet."
---

# Create an RDP connection to a Linux VM using Azure Bastion

This article describes how to create a secure RDP connection to your Linux virtual machines using Azure Bastion. You can connect through the Azure portal (browser-based) or via a specified IP address. When you use Azure Bastion, your virtual machines don't require a client, agent, or additional software (other than xrdp on the Linux VM). Azure Bastion securely connects to all virtual machines in the virtual network without exposing RDP/SSH ports to the public internet. For more information, see [What is Azure Bastion?](bastion-overview.md)

To connect to a Linux virtual machine using SSH, see [Create an SSH connection to a Linux VM](bastion-connect-vm-ssh-linux.md). For native client connections using Azure CLI (SSH and tunnel), see [Connect to a VM using a native client](connect-vm-native-client-windows.md).

The following diagram shows the dedicated deployment architecture using an RDP connection.

:::image type="content" source="./media/connect-vm-rdp-windows/host-architecture-rdp.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/connect-vm-rdp-windows/host-architecture-rdp.png":::

## Prerequisites

Before you begin, verify that you meet the following criteria:

* An Azure Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). To set up a Bastion host, see [Create a bastion host](quickstart-host-portal.md#createhost). The SKU you need depends on your connection method:

  | Connection method | Minimum SKU | Additional configuration |
  |---|---|---|
  | Azure portal (browser) | Standard | None |
  | Azure portal with custom ports | Standard | None |
  | IP-based connection | Standard | [IP-based connection](connect-ip-address.md#sku-requirements) enabled |

* **xrdp required:** To use RDP with a Linux VM, you must have [xrdp](https://www.xrdp.org/) installed and configured on the Linux VM. To learn how to do this, see [Use xrdp with Linux](/azure/virtual-machines/linux/use-remote-desktop).

* Azure Bastion uses RDP port 3389 by default. Custom ports require the [Standard SKU or higher](bastion-sku-comparison.md). To upgrade, see [Upgrade a SKU](upgrade-sku.md).

* A Linux virtual machine in the virtual network (or reachable from the virtual network for [IP-based connections](connect-ip-address.md)).

* **Required roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with the private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

* **Ports:** You must have the following ports open on your VM:

  * Inbound port: RDP (3389) *or*
  * Inbound port: Custom value (you then need to specify this custom port when you connect to the VM via Azure Bastion).

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## Authentication methods

The following authentication method is available for RDP connections to Linux VMs through Azure Bastion.

| Authentication method | Supported connection methods | Minimum SKU |
|---|---|---|
| Username and password | Azure portal, IP address (portal) | Standard |

> [!NOTE]
> Microsoft Entra ID and Kerberos authentication aren't supported for RDP connections to Linux VMs.

<a name="connect-to-a-vm"></a>

## Connect to a virtual machine using RDP

Select a connection method to see the corresponding steps.

# [Azure portal](#tab/portal)

<a name="rdp"></a>

Use the Azure portal to create a browser-based RDP connection to your Linux virtual machine. This method connects directly through your browser. No native RDP client or additional software is required on your local computer. The [Standard SKU](bastion-sku-comparison.md) or higher is required.

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. On the **Overview** page, select **Connect**, then select **Bastion** from the dropdown to open the Bastion page.

1. On the **Bastion** page, expand the **Connection Settings** section and select **RDP**. If you plan to use an inbound port different from the standard RDP port (3389), enter the **Port**.

1. Enter the **Username** and **Password**, and then select **Connect**. The RDP connection to this virtual machine via Bastion opens directly in the browser (over HTML5) using port 443 and the Bastion service.

> [!NOTE]
> For troubleshooting tips, see [Troubleshooting](troubleshoot.md).

# [IP address (portal)](#tab/ip-address)

<a name="ip-address"></a>

Use the Azure portal to create a browser-based RDP connection to your Linux virtual machine using a specified IP address. This method connects through your browser and doesn't require a native RDP client or additional software on your local computer. The Standard SKU or higher is required, and you must enable [IP-based connection](connect-ip-address.md).

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

---

## Limitations

* **xrdp requirement:** RDP to a Linux VM requires xrdp to be installed and configured on the target VM. Without xrdp, an RDP connection can't be established.
* **Authentication:** Only username and password authentication is supported for RDP connections to Linux VMs. Microsoft Entra ID and Kerberos authentication aren't supported.
* **Native client:** The `az network bastion rdp` command isn't supported for Linux VMs. To connect to a Linux VM using a native client, use `az network bastion ssh` or `az network bastion tunnel` instead. For more information, see [Connect to a VM using Bastion and the Windows native client](connect-vm-native-client-windows.md) or [Connect to a VM using Bastion and a Linux native client](connect-vm-native-client-linux.md).
* **IP-based connections:** IP-based connection doesn't work with force tunneling over VPN, or when a default route is advertised over an ExpressRoute circuit. Azure Bastion requires access to the Internet and force tunneling, or the default route advertisement, results in traffic blackholing.
* **IP-based connections:** UDR isn't supported on the Bastion subnet, including with IP-based connections.

## Next steps

* [Connect to a Linux VM using SSH](bastion-connect-vm-ssh-linux.md)
* [What is Azure Bastion?](bastion-overview.md)
* [Connect to a VM using Bastion and a Windows native client](connect-vm-native-client-windows.md)
* [Connect to a VM using Bastion and a Linux native client](connect-vm-native-client-linux.md)
* [Transfer files](vm-upload-download-native.md) to your virtual machine using a native client.
* [Configure a shareable link](shareable-link.md) for users without Azure portal access.
* [Azure Bastion FAQ](bastion-faq.md)
