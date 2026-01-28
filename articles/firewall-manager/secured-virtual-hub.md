---
title: What is a secured virtual hub?
description: Learn about secured virtual hubs
author: duongau
ms.service: azure-firewall-manager
services: firewall-manager
ms.topic: concept-article
ms.date: 01/28/2026
ms.author: duau
---

# What is a secured virtual hub?

A virtual hub is a Microsoft-managed virtual network that enables connectivity from other resources. When you create a virtual hub from a Virtual WAN in the Azure portal, you also create a virtual hub VNet and gateways (optional) as its components.

A *secured* virtual hub is an [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) with associated security and routing policies configured by Azure Firewall Manager. Use secured virtual hubs to easily create hub-and-spoke and transitive architectures with native security services for traffic governance and protection. You can deploy multiple secured hubs within the same region or across regions as part of the same Virtual WAN resource. Use Firewall Manager in the Azure portal to add more secured hubs. 

You can use a secured virtual hub to filter traffic between virtual networks (V2V), branch-to-branch (B2B), branch offices (B2V), and traffic to the Internet (B2I/V2I). A secured virtual hub provides automated routing. There's no need to configure your own UDRs (user defined routes) to route traffic through your firewall.

> [!IMPORTANT]
> You must configure Virtual WAN routing intent to secure inter-hub and branch-to-branch communications, even within a single Virtual WAN hub. For more information on routing intent, see the [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md).

You can choose the required security providers to protect and govern your network traffic, including Azure Firewall, third-party security as a service (SECaaS) providers, or both. To learn more, see [What is Azure Firewall Manager?](overview.md#known-issues) 

> [!NOTE]
> **Public IP address limit**
>
> - Secured Virtual Hub Azure Firewall supports up to 80 public IP addresses per firewall for standard deployments. Exceeding this limit might prevent Azure Firewall and associated Firewall Policy updates.
> 
> - For Secured Virtual Hub deployments using Bring Your Own Public IP (BYOPIP) (preview), the public IP address limit can be increased up to 250.

## Create a secured virtual hub

By using Firewall Manager in the Azure portal, you can create a new secured virtual hub or convert an existing virtual hub that you previously created by using Azure Virtual WAN.

## Next steps

- Review Firewall Manager architecture options: [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md)
- To create a secured virtual hub and use it to secure and govern a hub and spoke network, see [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md).
- [Learn more about Azure network security](../networking/security/index.yml).

