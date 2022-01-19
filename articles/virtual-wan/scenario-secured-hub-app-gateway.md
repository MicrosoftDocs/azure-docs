---
title: 'Secure traffic between Application Gateway and backend pools'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN routing scenarios for secure traffic traveling through an application gateway. The application gateway is deployed in a spoke VNet that is connected to a secured Virtual WAN hub.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: cherylmc

---
# Scenario: Secure traffic between Application Gateway and backend pools

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, a user’s traffic enters Azure through an application gateway deployed in a spoke VNet that is connected to a secured Virtual WAN hub (Virtual WAN hub with an Azure Firewall). The goal is to use the Azure Firewall in the secured virtual hub to inspect traffic between the application gateway and the backend pools.

There are two specific design patterns in this scenario, depending on whether the application gateway and backend pools are in the same VNet, or different VNets.

* **Scenario 1:** The application gateway and backend pools are in the same virtual network peered to a Virtual WAN hub (separate subnets).
* **Scenario 2:** The application gateway and backend pools are in different virtual networks peered to a Virtual WAN hub.

## <a name="scenario-1"></a>Scenario 1 - Same VNet

In this scenario, the application gateway and backend pools are in the same virtual network peered to a Virtual WAN hub (separate subnets).

:::image type="content" source="./media/routing-scenarios/secured-application-gateway/same-vnet.png" alt-text="Diagram for Scenario 1." lightbox="./media/routing-scenarios/secured-application-gateway/same-vnet.png":::

### Workflow

Currently, routes that are advertised from the Virtual WAN route table to spoke virtual networks are applied to the entire virtual network, and not on the subnets of the spoke VNet. As a result, user-defined routes are necessary to enable this scenario. For information about user-defined routes (UDR), see [Virtual Network custom routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).


1. In Azure Firewall Manager, on the spoke virtual network containing the application gateway and backend pools, select **Enable Secure Internet Traffic** and **Enable Secure Private Traffic**.
1. Configure user-defined routes (UDRs) on the application gateway subnet.

   * To ensure the application gateway is able to send traffic directly to the Internet, specify the following UDR:

     * **Address Prefix:** 0.0.0.0.0/0
     * **Next Hop:** Internet

   * To ensure the application gateway is able to send traffic to the backend pool via Azure Firewall in the Virtual WAN hub, specify the following UDR:

      * **Address Prefix:** Backend pool subnet (10.2.0.0/24)
      * **Next Hop:** Azure Firewall private IP

1. Configure a user-defined route (UDR) on the backend pool subnet.

   * **Address Prefix:** Application Gateway subnet
   * **Next Hop:** Azure Firewall private IP

## <a name="scenario-2"></a>Scenario 2 - Different VNets

In this scenario, application gateway and backend pools are in different virtual networks that are peered to a Virtual WAN hub.

:::image type="content" source="./media/routing-scenarios/secured-application-gateway/different-vnets.png" alt-text="Diagram for Scenario 2." lightbox="./media/routing-scenarios/secured-application-gateway/different-vnets.png":::

### Workflow

Currently, routes that are advertised from the Virtual WAN route table to spoke virtual networks are applied to the entire virtual network, and not on the subnets of the spoke VNet. As a result, user-defined routes are necessary to enable this scenario. For information about user-defined routes (UDR), see [Virtual Network custom routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).

1. In **Azure Firewall Manager**, select **Enable Secure Internet Traffic** and **Enable Secure Private Traffic** on both of the spoke virtual networks.

1. Configure user-defined routes (UDRs) on the application gateway subnet. To ensure the application gateway is able to send traffic directly to the Internet, specify the following UDR:

   * **Address Prefix:** 0.0.0.0.0/0
   * **Next Hop:** Internet

## Next steps

* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about user-defined routes, see [Virtual Network custom routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).
* For information about Virtual WAN secured virtual hubs, see [Secured virtual hubs](../firewall-manager/secured-virtual-hub.md).
