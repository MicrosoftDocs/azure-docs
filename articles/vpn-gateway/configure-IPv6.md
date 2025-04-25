---
title: 'Configure IPv6 for your virtual network gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to configure IPv6 for your VPN Gateway virtual network gateways
author: radwiv
ms.service: azure-vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/25/2025
ms.author: radwiv
---

# Configure IPv6 in dual stack (Preview)

Customers can use IPv6 in a dual-stack configuration for Azure VPN Gateway, allowing seamless IPv6 traffic traversal within the VPN tunnel when connecting from on-premises or remote user devices to Azure VPN Gateway.

During Preview, customers can opt in to configure IPv6 in dual stack. To do so, Customers can send their subscription ID to VPNIPv6Preview@microsoft.com, requesting their subscription to be enabled for IPv6 in preview.

When deploying VPN Gateway with IPv6 in dual stack mode, customers can continue with the same steps as they would for IPv4 deployment and additionally use IPv6 addresses beginning with the creation of Virtual Network, Gateway Subnet, Virtual Network Gateway (such as BGP Peer IP address, Address Pool), and Local Network Gateway. 

Portal flow for configuring IPv6 in dual stack are included below. For PowerShell and CLI, customers can include IPv6 addresses as well along with IPv4 addresses.

Please refer to the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#IPv6) for additional information and limitations.
