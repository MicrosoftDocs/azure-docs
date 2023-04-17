---
title: What is a secured virtual hub?
description: Learn about secured virtual hubs
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: conceptual
ms.date: 03/24/2023
ms.author: victorh
---

# What is a secured virtual hub?

A virtual hub is a Microsoft-managed virtual network that enables connectivity from other resources. When a virtual hub is created from a Virtual WAN in the Azure portal, a virtual hub VNet and gateways (optional) are created as its components.

A *secured* virtual hub is an [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) with associated security and routing policies configured by Azure Firewall Manager. Use secured virtual hubs to easily create hub-and-spoke and transitive architectures with native security services for traffic governance and protection.

> [!IMPORTANT]
> Currently, Azure Firewall in secured virtual hubs (vWAN) is not supported in Qatar.

You can use a secured virtual hub to filter traffic between virtual networks (V2V), virtual networks and branch offices (B2V) and traffic to the Internet (B2I/V2I). A secured virtual hub provides automated routing. There's no need to configure your own UDRs (user defined routes) to route traffic through your firewall.

You can choose the required security providers to protect and govern your network traffic, including Azure Firewall, third-party security as a service (SECaaS) providers, or both. Currently, a secured hub doesn’t support Branch to Branch (B2B) filtering and filtering across multiple hubs. To learn more, see [What is Azure Firewall Manager?](overview.md#known-issues). 

## Create a secured virtual hub

Using Firewall Manager in the Azure portal, you can either create a new secured virtual hub, or convert an existing virtual hub that you previously created using Azure Virtual WAN.

## Public preview features

The following features are in public preview:

| Feature | Description |
| ---------- | --------- |
| Routing Intent and Policies enabling Inter-hub security | This feature allows you to configure internet-bound, private or inter-hub traffic flow through Azure Firewall. For more information, see [Routing Intent and Policies](../virtual-wan/how-to-routing-policies.md). |

## Next steps

- Review Firewall Manager architecture options: [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md)
- To create a secured virtual hub and use it  to secure and govern a hub and spoke network, see [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md).
