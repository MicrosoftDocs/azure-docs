---
title: 'Virtual Network Manager and Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual Network Manager and Virtual WAN.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/25/2026
ms.author: wellee
ms.custom:
---

# Virtual Network Manager and Virtual WAN overview

## Overview

Azure Virtual Network Manager can utilize a Virtual WAN hub as the hub for hub-spoke network topologies. This allows you to dynamically group your Azure Virtual Networks into **Network Groups** and deploy **connection configurations** to connect **Network Groups** to a **Virtual WAN hub**.

Virtual Network Manager **connection configurations** also assign your network groups to a Virtual WAN hub [connection policy](how-to-connection-policy.md), ensuring all connections to the Virtual WAN hub have the same routing configuration. Connection policies manage the following Virtual Network connection settings:

* Enable internet security: when Virtual WAN is configured to route Internet traffic via a Firewall or Network Virtual Appliance (NVA), control whether the default route (0.0.0.0/0) is advertised to the spoke Virtual Networks.
* Route maps: assign which route maps are applied to Virtual Network connections.
* Routing configuration: specify which Virtual WAN route table the Virtual Network connection learns routes from and which route tables the Virtual Network propagates to.

## Key Considerations

### Virtual WAN and Virtual Network Manager interactions

* A single Virtual Network Manager Network Group and connection policy can only be applied to a single Virtual WAN hub. If you're using Virtual Network Manager to manage connectivity to multiple Virtual WAN hubs, create separate Network Groups and connection policies for each Virtual WAN hub.
* Virtual Network Manager allows you to update the Virtual WAN connection policy used by a connectivity configuration in two ways:
    * **Edit currently associated connection policy:** Edit the routing settings within the currently associated connection policy. These changes are immediately applied to all Virtual Networks in the network group upon saving the connection policy.
    * **Associate a different connection policy with a connection configuration:** Use a brand-new connection policy with the desired settings and associate it with the connectivity configuration. This approach allows you to stage and deploy changes to your network group in an incremental fashion.
* Removing a Virtual Network from a network group that is connected to Virtual WAN **disconnects** the Virtual Network from the Virtual WAN hub.
* Virtual Network Manager allows you to enable **direct connectivity** between Virtual Networks in a Network Group connected to a Virtual WAN hub, forming a connected group or mesh. When this setting is turned **on**, Virtual Network toVirtual Network traffic within the Network Group routes directly between Virtual Networks instead of transiting the Virtual WAN hub. Connected group and mesh configurations are prioritized over any routing intent or routing configurations that send Virtual Network-to-Virtual Network traffic to a security solution deployed in the Virtual WAN hub.
* Properties managed by connection policies override any conflicting settings configured directly on individual Virtual WAN connections. See [connection policy](how-to-connection-policy.md) for more information.
* Virtual Network Manager connectivity configurations **don't** enforce peering or connectivity to the Virtual WAN hub. This means that any Virtual Network connections created by Virtual Network Manager to the Virtual WAN hub can be removed. Virtual Network Manager automatically attempts to reconnect the Virtual Network to the Virtual WAN the **next** time the connectivity configuration is deployed in the spoke Virtual Network's region.

### Virtual Network settings

* [High-scale private endpoints](../private-link/increase-private-endpoint-vnet-limits.md) can be enabled for Network Groups connected to Virtual WAN hubs in a hub-spoke Virtual Network connectivity configuration. However, when more than 4000 private endpoints are deployed in Virtual Networks connected to a single Virtual WAN hub, Private Link connectivity transiting the hub, either from a virtual network or on-premises, might be impacted. For more information, see [Use Private Link in Virtual WAN](howto-private-link.md).
* Virtual WAN automatically sets the use remote gateway setting to **on** for Virtual Networks connected to the Virtual WAN hub. This setting can't be changed while the Virtual Network is connected to the Virtual WAN hub.

## Use cases

The following sections describe some of the common use cases for using Virtual Network Manager with Virtual WAN.

## Bulk connection of Virtual Networks to Virtual WAN hub

Virtual Network Manager **connectivity configurations** allow you to define a **network group** with Virtual WAN as the network hub. This connects **all** Virtual Networks in the network group to your Virtual WAN hub in parallel. Your pre-defined routing configuration is automatically applied to all of the spoke Virtual Networks in the network group.

All Virtual Network connections are automatically orchestrated by Virtual Network Manager.

:::image type="content" source="./media/virtual-network-manager-virtual-wan/bulk-connection-creation.png" alt-text="Diagram showing bulk connection creation for Virtual Networks connected through Virtual Network Manager and Virtual WAN." lightbox="./media/virtual-network-manager-virtual-wan/bulk-connection-creation.png":::

## Utilize Azure Policy to dynamically connect Virtual Networks to Virtual WAN

Implement [Azure Policy](../virtual-network-manager/how-to-define-network-group-membership-azure-policy) on your subscription to automatically connect newly created Virtual Networks to Virtual WAN and apply the correct routing configurations. This allows you to build faster by automating new workload onboarding and network access.

:::image type="content" source="./media/virtual-network-manager-virtual-wan/policy-connection-creation.png" alt-text="Diagram showing policy-based connection creation for Virtual Networks connected through Virtual Network Manager and Virtual WAN." lightbox="./media/virtual-network-manager-virtual-wan/policy-connection-creation.png":::

## Batch routing configuration updates at scale

Virtual Network Manager and Virtual WAN’s control plane integration enables you to push critical configuration settings to all Virtual Networks in a network group as a single fully parallelized operation.  

Update parallelization significantly reduces the length of maintenance windows required to make, and potentially roll back, network changes and allows you to make changes at scale without depending on infrastructure-as-code or CI/CD pipelines.

## Incremental deployment and management

Virtual Network Manager allows you to segment your network into more precise update domains by incrementally applying changes to your Virtual WAN Virtual Network connections. You can create individual network groups by environment, for example staging, development, and production, or by region. You can then apply connection policies to each network group or Azure region independently, allowing you to test changes on a smaller subset of your network before applying them globally. This helps minimize the blast radius of any potential misconfiguration and ensures the stability of your network.

:::image type="content" source="./media/virtual-network-manager-virtual-wan/incremental-update.png" alt-text="Diagram showing incremental updates for Virtual Network Manager and Virtual WAN deployments." lightbox="./media/virtual-network-manager-virtual-wan/incremental-update.png":::

## Mesh peering for direct connectivity for selective inspection scenarios

Routing intent and routing policies allow Virtual WAN customers to configure all private (Virtual Network and on-premises) traffic to be inspected by a Firewall appliance in the Virtual WAN hub.

In certain high-throughput or latency-sensitive applications, such as nightly database updates, inspecting traffic via a next-generation Firewall deployed in the Virtual WAN hub throttles throughput, adds latency, and increases cost. To allow Virtual Network-to-Virtual Network traffic to bypass inspection, enable **direct connectivity** to create a **mesh** between Virtual Networks in a Network Group.


:::image type="content" source="./media/virtual-network-manager-virtual-wan/mesh-peering-secure-hub.png" alt-text="Diagram showing mesh peering with a secured hub for selective inspection scenarios." lightbox="./media/virtual-network-manager-virtual-wan/mesh-peering-secure-hub.png":::
  
## Implement security admin rules to simplify deployment and management of access control lists at scale

Define network groups to connect your spoke Virtual Networks to Virtual WAN and then use security admin rules to author and deploy Access Control Lists (ACLs) to your Virtual WAN spoke networks. Security admin rules offer an easy-to-use way to configure multiple layers of defense from external threats alongside next-generation Firewalls in the Virtual WAN hub.

:::image type="content" source="./media/virtual-network-manager-virtual-wan/security-admin-rules.png" alt-text="Diagram showing security admin rules applied to Virtual Network Manager and Virtual WAN spoke networks." lightbox="./media/virtual-network-manager-virtual-wan/security-admin-rules.png":::
