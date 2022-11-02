---
author: cherylmc
ms.author: cherylmc
ms.date: 04/11/2022
ms.service: virtual-wan
ms.topic: include
---

* You have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You have a virtual network to which you want to connect.

   * Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to.
   * To create a virtual network in the Azure portal, see the [Quickstart](../articles/virtual-network/quick-create-portal.md) article.

* Your virtual network must not have any existing virtual network gateways. 

   * If your virtual network already has gateways (VPN or ExpressRoute), you must remove all of the gateways before proceeding.
   * This configuration requires that virtual networks connect to the Virtual WAN hub gateway only.

* Decide the IP address range that you want to use for your virtual hub private address space. This information is used when configuring your virtual hub. A virtual hub is a virtual network that is created and used by Virtual WAN. It's the core of your Virtual WAN network in a region. The address space range must conform the certain rules:

   * The address range that you specify for the hub can't overlap with any of the existing virtual networks that you connect to.
   * The address range can't overlap with the on-premises address ranges that you connect to.
   * If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.
