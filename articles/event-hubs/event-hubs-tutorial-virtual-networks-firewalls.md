---
title: Azure Event Hubs - Enable virtual networks integration and firewalls
description: In this tutorial, you learn how to integrate Event Hubs with Virtual Networks to enable secure access.
services: event-hubs
author: spelluru

ms.author: spelluru
ms.date: 12/20/2019
ms.topic: tutorial
ms.service: event-hubs
ms.custom: mvc

---

# Integrate Event Hubs with Virtual Networks using network service endpoints

[Virtual Network (VNet) service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your VNet to the Azure service always remains on the Microsoft Azure backbone network.

This article shows how to integrate Virtual Networks service endpoints with your existing Azure Event Hubs namespace, using the portal.

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs. It's not supported in basic tier.


## Conclusion

In this tutorial, you integrated Virtual Network endpoints and Firewall rules with an existing Event Hubs namespace. You learnt how to :
> [!div class="checklist"]
> * How to integrate Virtual Networks Service endpoints with your Event Hubs namespace.
> * How to setup Firewall (IP Filtering) with your Event Hubs namespace.


[Azure portal]: https://portal.azure.com/
