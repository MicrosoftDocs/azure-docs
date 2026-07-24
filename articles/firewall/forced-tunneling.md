---
title: Azure Firewall forced tunneling
description: You can configure forced tunneling to route Internet-bound traffic to another firewall or network virtual appliance for further processing.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
ms.custom: sfi-image-nochange
# Customer intent: As a network administrator, I want to route Internet-bound traffic through an on-premises firewall using forced tunneling, so that I can enhance security and control over outbound traffic processing before it reaches the Internet.
---

# Azure Firewall forced tunneling

When you configure a new Azure Firewall, you can route all Internet-bound traffic to a designated next hop instead of going directly to the Internet. For example, you could have a default route advertised through BGP or by using user-defined routes (UDRs) to force traffic to an on-premises edge firewall or other network virtual appliance (NVA) to process network traffic before it goes to the Internet. To support this configuration, you must create an Azure Firewall with the Firewall Management network interface enabled.

:::image type="content" source="media/forced-tunneling/forced-tunneling-configuration.png" lightbox="media/forced-tunneling/forced-tunneling-configuration.png" alt-text="Screenshot showing forced tunneling configuration.":::

You might prefer not to expose a public IP address directly to the Internet. In this case, you can deploy Azure Firewall with the Management network interface enabled without a public IP address. When you enable the Management network interface, it creates a management interface with a public IP address that Azure Firewall uses for its operations. The public IP address is used exclusively by the Azure platform and can't be used for any other purpose. You can configure the tenant data path network without a public IP address, and you can force tunnel or block Internet traffic.

Azure Firewall provides automatic SNAT for all outbound traffic to public IP addresses. Azure Firewall doesn’t SNAT when the destination IP address is a private IP address range per IANA RFC 1918. This logic works perfectly when you egress directly to the Internet. However, with forced tunneling configured, Internet-bound traffic might be SNATed to one of the firewall private IP addresses in the AzureFirewallSubnet. This SNAT hides the source address from your on-premises firewall. You can configure Azure Firewall to not SNAT regardless of the destination IP address by adding *0.0.0.0/0* as your private IP address range. With this configuration, Azure Firewall can never egress directly to the Internet. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

Azure Firewall also supports split tunneling, which is the ability to selectively route traffic. For example, you can configure Azure Firewall to direct all traffic to your on-premises network while routing traffic to the Internet for KMS activation, ensuring the KMS server is activated. You can do this by using route tables on the AzureFirewallSubnet. For more information, see [Configuring Azure Firewall in Forced Tunneling mode - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-network-security-blog/configuring-azure-firewall-in-forced-tunneling-mode/ba-p/3581955).

> [!IMPORTANT]
> Forced tunnel is available for Azure Firewall deployments in the Virtual WAN hub (secured Virtual hub) that utilize routing intent. See [internet access patterns in Virtual WAN](../virtual-wan/about-internet-routing.md) for more information.

> [!IMPORTANT]
> DNAT isn't supported with forced tunneling enabled. Firewalls deployed with forced tunneling enabled can't support inbound access from the Internet because of asymmetric routing. However, firewalls with a Management network interface still support DNAT.

## Forced tunneling configuration

When you enable the Firewall Management network interface, you can add routes to any on-premises firewall or NVA in the *AzureFirewallSubnet* to process traffic before it goes to the Internet. If you enable **Propagate gateway routes** on this subnet, you can also publish these routes through BGP to *AzureFirewallSubnet*.

For example, you can create a default route on the *AzureFirewallSubnet* with your VPN gateway as the next hop to get to your on-premises device. Or you can enable **Propagate gateway routes** to get the appropriate routes to the on-premises network.

If you configure forced tunneling, Azure Firewall SNATs Internet-bound traffic to one of the firewall private IP addresses in AzureFirewallSubnet, which hides the source from your on-premises firewall.

If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. However, you can configure Azure Firewall to **not** SNAT your public IP address range. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

## Related content

- [Azure Firewall Management network interface](management-nic.md)

