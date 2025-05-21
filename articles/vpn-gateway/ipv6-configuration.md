---
title: Configure IPv6 in dual stack
titleSuffix: Azure VPN Gateway
description: Learn how to configure IPv6 in dual stack for VPN Gateway.
author: radwiv
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 05/02/2025
ms.author: radwiv
---

# Configure IPv6 for VPN Gateway - Preview

You can use IPv6 in a dual-stack configuration for Azure VPN Gateway. This configuration allows seamless IPv6 traffic traversal within the VPN tunnel when connecting from on-premises or remote user devices to Azure VPN Gateway.

This article helps you configure IPv6 in dual stack for VPN Gateway using the Azure portal. Configuration steps are similar to the existing IPv4 configuration. You can also use PowerShell, or CLI for this configuration. If you use PowerShell or CLI, you can configure IPv6 addresses along with IPv4 addresses.

> [!IMPORTANT]
> IPv6 in dual stack configuration is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

During Preview, you can opt in to configure IPv6 in dual stack. To opt in, send your subscription ID to **vpnipv6preview@microsoft.com** and request your subscription to be enabled for IPv6.

## Configure using the Azure portal

When you deploy VPN Gateway with IPv6 in dual stack mode, you can use the same steps as you would for an IPv4 deployment, but with IPv6 addresses. The following steps show how to configure IPv6 in dual stack mode using the Azure portal.

1. Create a virtual network with IPv4 and IPv6 address ranges.

   :::image type="content" source="./media/ipv6-configuration/vnet-ipv6.png" alt-text="Diagram shows IPv6 configuration for Virtual Network." lightbox="./media/ipv6-configuration/vnet-ipv6.png":::

1. Create the gateway subnet with IPv4 and IPv6 address ranges.

   :::image type="content" source="./media/ipv6-configuration/gateway-subnet-ipv6.png" alt-text="Diagram shows IPv6 configuration for Virtual Network." lightbox="./media/ipv6-configuration/gateway-subnet-ipv6.png":::

1. Create the virtual network gateway and local network gateway using IPv4 and IPv6 configuration settings.

   **Virtual network gateway**

   :::image type="content" source="./media/ipv6-configuration/vng-vpn-config.png" alt-text="Diagram shows IPv6 configuration for Virtual network gateway." lightbox="./media/ipv6-configuration/vng-vpn-config.png":::

   **Local network gateway**

   :::image type="content" source="./media/ipv6-configuration/lng-vpn-ipv6-config.png" alt-text="Diagram shows IPv6 configuration for Local network gateway." lightbox="./media/ipv6-configuration/lng-vpn-ipv6-config.png":::

    **Address pool**

   :::image type="content" source="./media/ipv6-configuration/vng-vpn-p2s-ipv6-config.png" alt-text="Diagram shows Point-to-site IPv6 configuration for Virtual Network Gateway." lightbox="./media/ipv6-configuration/vng-vpn-p2s-ipv6-config.png":::

## Limitations

The following limitations apply to IPv6 in dual stack configuration for VPN Gateway:

* IPv6 support is available for new gateway deployments using VpnGw1-5 and VpnGw1AZ-5AZ SKUs.
* A VPN gateway deployed in IPv6 dual stack mode can't be moved to an IPv4 only configuration.
* IPv6 can be used with IPv4 in dual stack mode to set up VPN Gateway connectivity.
* Point-to-Site VPN gateways using IKEv2 and OpenVPN protocols support IPv6. Point-to-Site VPN gateways don't support IPv6 when using SSTP protocol.
* Site-to-Site VPN gateways don't support IPv6 when using IKEv1 protocol.
* Currently IPv6 for VPN in Virtual WAN isn't supported.
* Currently User Defined Routes (UDR) with IPv6 using a virtual network gateway VPN as the next hop aren't supported.
* IPv6 support is available for inner traffic only. Currently, support for IPv6 in the outer VPN tunnel isn't available.

## Next steps

For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).