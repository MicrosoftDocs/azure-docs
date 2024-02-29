---
title: 'Scenario: Route to shared services VNets'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN routing scenarios. In this scenario, you set up routes to access a shared service VNet with a workload that you want every VNet and branch to access.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/24/2023
ms.author: cherylmc
ms.custom: fasttrack-edit

---
# Scenario: Route to shared services VNets

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to set up routes to access a **Shared Service** VNet with workloads that you want every VNet and Branch (VPN/ER/P2S) to access. Examples of these shared workloads might include Virtual Machines with services like Domain Controllers or File Shares, or Azure services exposed internally through [Azure Private Endpoints](../private-link/private-endpoint-overview.md).

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="design"></a>Design

We can use a connectivity matrix to summarize the requirements of this scenario:

**Connectivity matrix**

| From             | To:   |*Isolated VNets*|*Shared VNet*|*Branches*|
|---|---|---|---|---|
|**Isolated VNets**| ->|        | Direct | Direct |
|**Shared VNets**  |->| Direct | Direct | Direct |
|**Branches**      |->| Direct | Direct | Direct |

Each of the cells in the previous table describes whether a Virtual WAN connection (the "From" side of the flow, the row headers) communicates with a destination (the "To" side of the flow, the column headers in italics). In this scenario there are no firewalls or Network Virtual Appliances, so communication flows directly over Virtual WAN (hence the word "Direct" in the table).

Similarly to the [Isolated VNet scenario](scenario-isolate-vnets.md), this connectivity matrix gives us two different row patterns, which translate to two route tables (the shared services VNets and the branches have the same connectivity requirements). Virtual WAN already has a Default route table, so we'll need another custom route table, which we will call **RT_SHARED** in this example.

VNets will be associated to the **RT_SHARED** route table. Because they need connectivity to branches and to the shared service VNets, the shared service VNet and branches will need to propagate to **RT_SHARED** (otherwise the VNets wouldn't learn the branch and shared VNet prefixes). Because the branches are always associated to the Default route table, and the connectivity requirements are the same for shared services VNets, we'll associate the shared service VNets to the Default route table too.

As a result, this is the final design:

* Isolated virtual networks:
  * Associated route table: **RT_SHARED**
  * Propagating to route tables: **Default**
* Shared services virtual networks:
  * Associated route table: **Default**
  * Propagating to route tables: **RT_SHARED** and **Default**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **RT_SHARED** and **Default**

> [!NOTE]
> If your Virtual WAN is deployed over multiple regions, you will need to create the **RT_SHARED** route table in every hub, and routes from each shared services VNet and branch connection need to be propagated to the route tables in every virtual hub using propagation labels.

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Workflow

To configure the scenario, consider the following steps:

1. Identify the **shared services** VNet.
2. Create a custom route table. In the example, we refer to the route table as **RT_SHARED**. For steps to create a route table, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md). Use the following values as a guideline:

   * **Association**
     * For **VNets *except* the shared services VNet**, select the VNets to isolate. This implies that all these VNets (except the shared services VNet) will be able to reach destination based on the routes of RT_SHARED route table.

   * **Propagation**
      * For **Branches**, propagate routes to this route table, in addition to any other route tables you may have already selected. Because of this step, the RT_SHARED route table will learn routes from all branch connections (VPN/ER/User VPN).
      * For **VNets**, select the **shared services VNet**. Because of this step, RT_SHARED route table will learn routes from the shared services VNet connection.

This results in the routing configuration shown in the following figure:

   :::image type="content" source="./media/routing-scenarios/shared-service-vnet/shared-services.png" alt-text="Diagram for shared services VNet." lightbox="./media/routing-scenarios/shared-service-vnet/shared-services.png":::

## Next steps

* To configure using an ARM template, see [Quickstart: Route to shared services VNets using an ARM template](quickstart-route-shared-services-vnet-template.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
