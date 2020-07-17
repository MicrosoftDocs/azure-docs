---
title: 'Scenario: Azure Firewall - Interhub routing'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - routing between multiple hubs that have Azure Firewall
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Azure Firewall - Interhub (Preview)

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to route between multiple hubs that contain Azure Firewall. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario architecture

In this scenario, we assume the following configuration:

* You have multiple hubs with Azure Firewall in each hub.
* You are using Secure Virtual Hub.
* The appropriate policies for Private traffic (VNet), Internet, and Branch traffic have been set up.
* VNet-to-Internet (V2I), VNet-to-Branch (V2B), Branch-to-VNet (B2V), all go through Azure Firewall in each hub.

Additional considerations:

* For an inter-hub scenario with Azure Firewall, the assumption is that spoke VNets do not associate to separate route tables. (e.g **VNET 1** associated to **Route Table A**, and **VNET 2** associated to **Route Table B**). All VNets associate to the same route table in which the routes for the Azure Firewall reside.
* Securing via Azure Firewall is currently limited to **Branch <-> VNet** and **Internet** traffic only. Branch-to-Branch flow via the Azure Firewall currently not supported.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/between-hubs-firewall/architecture.png" alt-text="architecture":::

## <a name="workflow"></a>Scenario workflow

In order to configure this scenario, take the following steps into consideration:

### <a name="step-1"></a>Step 1

Assuming that you have already secured the connections via Azure Firewall Manager, the first step is to ensure that all branch and VNet connections propagate **None**. This is required to ensure traffic is being set via the Azure Firewall.

1. Select the hub and edit the **None** Route Table.
1. Update **Propagation** to select all branches and all VNets.

### <a name="step-2"></a>Step 2

Set up a custom route table per hub.

1. For **Hub 1**, create Route Table **RT_Hub1**.

    * If you used the Azure Firewall Manager, it automatically creates a route for 0.0.0.0/0 with next hop **AZFW1** in the hub’s default route table. We will modify this setting in Step 3. For **RT_Hub1**, create an entry for 0.0.0.0/0 explicitly with next hop **AZFW1**. This setting will activate V2V, B2V, and V2I via AZFW1.
    * Because you want the **Hub 2** branches and VNets to be reached via **AZFW2** from **Hub 1** (instead of via AZFW1), you need to add another 2 aggregated routes for **Hub 2** branches (10.5.0.0/16->AZFW2) and VNets (10.2.0.0/16->AZFW2).

1. For **Hub 2**, create Route Table **RT_Hub2**.

    * If you used the Azure Firewall Manager, it automatically creates a route for 0.0.0.0/0 with next hop **AZFW2** in the hub’s default route table. We will modify this setting in Step 3. For **RT_Hub2**, create an entry for 0.0.0.0/0 explicitly with next hop **AZFW2**. This setting will activate V2V, B2V, and V2I via **AZFW2**.
    * Because you want the inter-hub traffic to be protected by Hub 2’s **AZFW2**, you do not need to explicitly add a step similar to the second bullet in the previous Hub 1 step.

### <a name="step-3"></a>Step 3

Modify the **Default Route Table** in each of the hubs to add a static route for the **Branch to VNet** (B2V) and **Branch to Internet** (B2I) flows via the Azure Firewall. Branch to Branch is currently not supported via Azure Firewall.

1. For the **Hub 1 Default Route Table**:

    * **Branch to Hub 2 Branches via AZFW2**: 10.5.0.0/16->AZFW2. This configuration sets up a route for Hub 2 firewall.
    * **Branch to Hub 2 VNets via AZFW2**: 10.2.0.0/16->AZFW2. This configuration sets up a route for Hub 2 firewall.
    * **Branch to Branch (Local)/ Branch to VNet (Local)/ Branch to Internet**: 0.0.0.0/0->AZFW1.

2. For the **Hub 2 Default Route Table**:

    * Branch to Branch (Local and Remote)/ Branch to VNet (Local and Remote)/ Branch to Internet: 0.0.0.0/0->AZFW2.

This will result in the routing configuration changes as seen the figure below

**Figure 2**

:::image type="content" source="./media/routing-scenarios/between-hubs-firewall/workflow.png" alt-text="workflow":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about how to configure virtual hub routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).
