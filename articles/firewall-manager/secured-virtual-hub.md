---
title: What is a secured virtual hub?
description: Learn about secured virtual hubs
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: conceptual
ms.date: 10/4/2019
ms.author: victorh
---

# What is a secured virtual hub?

A virtual hub is a Microsoft-managed virtual network that contains various service endpoints to enable connectivity from other resources. When a virtual hub is created from a Virtual WAN in the Azure portal, a virtual hub VNet and gateways (optional) are created as its components.

A *secured* virtual hub is a virtual hub configured in Firewall Manager used to protect network traffic to and from the virtual hub and spokes. You can choose the services to protect and govern your network traffic, including Azure Firewall and other third party SECaaS (Security as a service) providers.

## Create a secured virtual hub

Using Firewall Manager in the Azure portal, you can either create a new secured virtual hub, or convert an existing virtual hub that you created and configured previously.

## Next steps

To see how a secured virtual hub is created and used to secure and govern a hub and spoke network, see (link to tutorial).