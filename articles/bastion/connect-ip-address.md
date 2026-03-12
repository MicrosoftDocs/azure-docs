---
title: 'About Azure Bastion IP-based connection'
titleSuffix: Azure Bastion
description: Learn about IP-based connection in Azure Bastion, including supported scenarios, SKU requirements, and limitations.
author: abell
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 03/09/2026
ms.author: abell

# Customer intent: As a network administrator, I want to understand how IP-based connection works with Azure Bastion, so that I can determine whether it's the right approach for securely connecting to on-premises, non-Azure, or Azure virtual machines.
---

# About Azure Bastion IP-based connection

IP-based connection lets you connect to your on-premises, non-Azure, and Azure virtual machines via Azure Bastion using a specified IP address. Unlike standard Bastion connections that use the Azure Resource Manager resource ID of a target virtual machine, IP-based connections target a virtual machine by its IP address. This makes it possible to connect to machines that aren't registered as Azure resources, such as on-premises servers or VMs running in other cloud environments.

## Architecture

The following diagram shows the IP-based connection architecture. Azure Bastion, deployed in its virtual network, connects to a target virtual machine using the virtual machine's IP address over an ExpressRoute circuit or VPN site-to-site connection. The connection doesn't require the target virtual machine to have a public IP address or to be an Azure resource.

:::image type="content" source="./media/connect-ip-address/architecture.png" alt-text="Diagram that shows how IP-based connections work over Azure ExpressRoute private peering or VPN site-to-site connections, extending Azure Bastion secure connectivity beyond Azure-hosted workloads." lightbox="./media/connect-ip-address/architecture.png":::

In this scenario:
* Azure Bastion routes the RDP or SSH traffic through the ExpressRoute or VPN connection to reach the target virtual machine at the specified IP address.
* The connection is secured through the Bastion host, so the target virtual machine doesn't need to be exposed to the public internet.

## Supported scenarios

IP-based connection supports the following scenarios:

* **On-premises virtual machines:** Connect to virtual machines running in your on-premises datacenter through an [ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md) or [VPN site-to-site connection](../vpn-gateway/add-remove-site-to-site-connections.md).
* **Non-Azure virtual machines:** Connect to virtual machines hosted in other cloud environments that are reachable from the Azure virtual network through ExpressRoute or VPN.
* **Azure virtual machines:** Connect to Azure virtual machines by specifying an IP address instead of selecting the virtual machine resource in the portal. This is useful when the target virtual machine is in a peered or connected virtual network.

## Supported connection methods

The following table summarizes the connection methods available with IP-based connection:

| Connection method | Protocol | Details |
|---|---|---|
| Azure portal (browser) | RDP, SSH | Provides browser-based RDP or SSH sessions from the Bastion **Connect** page by targeting an IP address. For step-by-step guidance, see [Connect to a Windows VM using RDP](bastion-connect-vm-rdp-windows.md). |
| Native client (Azure CLI) | RDP | Provides RDP connectivity from a Windows client using `az network bastion rdp` with the `--target-ip-address` parameter. For connection steps, see [Connect from a Windows native client](connect-vm-native-client-windows.md). |
| Native client (Azure CLI) | SSH | Provides SSH connectivity from Windows or Linux clients using `az network bastion ssh` with the `--target-ip-address` parameter. For connection steps, see [Connect from a Windows native client](connect-vm-native-client-windows.md) or [Connect from a Linux native client](connect-vm-native-client-linux.md). |
| Native client (Azure CLI) | Tunnel | Creates an IP-based TCP tunnel using `az network bastion tunnel` with the `--target-ip-address` parameter. For configuration steps, see [Configure Bastion native client support](native-client.md). |

## SKU requirements

IP-based connection requires the **Standard** SKU tier or higher for Azure Bastion. The Basic and Developer SKUs don't support this feature. You must also enable the **IP-based connection** setting on the Bastion **Configuration** page.

For information about SKU capabilities, see [Choose the right Azure Bastion SKU](bastion-sku-comparison.md). To upgrade your Bastion deployment, see [Upgrade a SKU](upgrade-sku.md).

## Limitations

* **Force tunneling:** IP-based connection doesn't work with force tunneling over VPN, or when a default route is advertised over an ExpressRoute circuit. Azure Bastion requires access to the internet. Force tunneling or default route advertisement results in traffic being dropped.

* **Microsoft Entra ID authentication:** Microsoft Entra authentication isn't supported for RDP connections via IP address. Microsoft Entra authentication is supported for SSH connections via native client. For more information, see [Microsoft Entra ID authentication](bastion-entra-id-authentication.md).

* **Custom ports and protocols:** Custom ports and protocols aren't currently supported when connecting to a virtual machine via native client with IP-based connections.

* **UDR:** User-defined routes (UDR) aren't supported on the Bastion subnet, including with IP-based connections.

## Next steps

* [Create an RDP connection to a Windows VM](bastion-connect-vm-rdp-windows.md)
* [Connect from a Windows native client](connect-vm-native-client-windows.md)
* [Connect from a Linux native client](connect-vm-native-client-linux.md)
* [Configure Bastion native client support](native-client.md)
* [Azure Bastion FAQ](bastion-faq.md)
