---
title: What is a secured virtual hub?
description: Learn about secured virtual hubs
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: conceptual
ms.date: 06/30/2020
ms.author: victorh
---

# What is a secured virtual hub?

A virtual hub is a Microsoft-managed virtual network that enables connectivity from other resources. When a virtual hub is created from a Virtual WAN in the Azure portal, a virtual hub VNet and gateways (optional) are created as its components.

A *secured* virtual hub is an [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) with associated security and routing policies configured by Azure Firewall Manager. Use secured virtual hubs to easily create hub-and-spoke and transitive architectures with native security services for traffic governance and protection. 

You can use a secured virtual hub as a managed central VNet with no on-prem connectivity. It replaces the central VNet that was previously required for an Azure Firewall deployment. Since the secured virtual hub provides automated routing, there's no need to configure your own UDRs (user defined routes) to route traffic through your firewall.

It's also possible to use secured virtual hubs as part of a full Virtual WAN architecture. This architecture provides secured, optimized, and automated branch connectivity to and through Azure. You can choose the services to protect and govern your network traffic, including Azure Firewall and other third-party security as a service (SECaaS) providers.

## Create a secured virtual hub

Using Firewall Manager in the Azure portal, you can either create a new secured virtual hub, or convert an existing virtual hub that you previously created using Azure Virtual WAN.

## Next steps

To create a secured virtual hub and use it  to secure and govern a hub and spoke network, see [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md).