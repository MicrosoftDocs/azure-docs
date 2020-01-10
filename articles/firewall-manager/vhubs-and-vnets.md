---
title: What are the Azure Firewall Manager architecture options?
description: Compare and contrast using hub virtual network or secured virtual hub architectures with Azure Firewall Manager.
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: article
ms.date: 01/11/2020
ms.author: victorh
---

# What are the Azure Firewall Manager architecture options?

Azure Firewall Manager can provide security management for two network architecture types:

- **secured virtual hub**

   An [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) is a Microsoft-managed resource that lets you easily create hub and spoke architectures. When security and routing policies are associated with such a hub, it is referred to as a *[secured virtual hub](secured-virtual-hub.md)*. 
- **hub virtual network**

   This is a standard Azure virtual network that you create and manage yourself. You create the *hub virtual network* that contains the firewall, and peer the spoke virtual networks that contain your workload servers and services.

## Comparison

The following table compares these two architecture options and can help you decide which one is right for your organization's security requirements:


|  |**secured virtual hub**  |**hub virtual network**  |
|---------|---------|---------|
|Row1     |         |         |
|Row2     |         |         |
|Row3     |         |         |
|Row4     |         |         |
|Row5     |         |         |
|Row6     |         |         |
|Row7     |         |         |
|Row8     |         |         |
|Row9     |         |         |
|Row10     |         |         |


## Next steps

- Review [Azure Firewall Manager Preview deployment overview](deployment-overview.md)
- Learn about [secured Virtual Hubs](secured-virtual-hub.md).