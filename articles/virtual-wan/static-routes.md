---
title: 'Static routes in Azure Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about the types of static routes in Azure Virtual WAN, their use cases, best practices, and limitations.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 04/27/2026
ms.author: wellee
ms.custom:
---

# Static routes in Virtual WAN

This document describes the different types of static routes in Virtual WAN, common use cases, and the main best practices and limitations to consider during network design and implementation.

## Overview of static routes
Virtual WAN static routes are used to direct traffic to a specific next-hop. Static routes deliver two main routing use cases:

* Route traffic through an Azure Firewall deployed in the Virtual WAN hub
* Route traffic to a designated IP address (often a load balancer in front of a Network Virtual Appliance) deployed in a spoke virtual network that's connected to the Virtual WAN hub.

At a high level, the following static route configurations are needed for the two main use cases mentioned above.

| Use case| Configuration| Detailed use case documentation|
|--|--|--|
|Route traffic through Azure Firewall deployed in Virtual WAN hub |Static routes in Virtual WAN route table with next hop Azure Firewall resource ID.| [Route traffic to secure hub Azure Firewall with Virtual WAN static routes](static-routes.md#common-use-cases). |
|Route traffic to designated IP address in a spoke Virtual Network |**Option 1:**  Static routes on the Virtual Network connection with next hop set to the IP address of the NVA or load balancer in the spoke Virtual Network. Propagate static route set to **true**.<br> **Option 2:**  Configure a static route in Virtual WAN route table with next hop spoke Virtual Network connection. Configure corresponding static route on Virtual Network connection with next hop set to the IP address of the NVA or load balancer in the spoke Virtual Network.| [Route traffic to spoke Virtual Networks using Virtual WAN static routes ](static-routes.md#common-use-cases-1)|

## Routing use cases

### Routing traffic to Azure Firewall

>[!NOTE]
> There are two disjoint ways to direct traffic to Azure Firewall: static routes in Virtual WAN hub route tables, or [routing intent and policies](how-to-routing-policies.md). Mixing the two configuration options is not supported. In this article, the Azure Firewall static route pattern refers to a secured virtual hub with Azure Firewall where routing intent isn't enabled.

#### Configuration

 Configure Virtual WAN to route traffic to Azure Firewall in a secure hub using static routes. This configuration applies to secured virtual hubs with Azure Firewall where routing intent **isn't enabled**. This configuration involves adding two separate configurations to your Virtual WAN deployment:

* Add **static routes** to Virtual WAN hub route tables, with the next hop specified as your Azure Firewall resource identifier.
* Configure the [**associated**](about-virtual-hub-routing.md#association) and [**propagated route tables**](about-virtual-hub-routing.md#propagation) of your Virtual WAN hub connections.  

To configure static routes and [associated](about-virtual-hub-routing.md#association)/[propagated route tables](about-virtual-hub-routing.md#propagation) in secure hub scenarios, utilize the following best practices:

* **Best practices regarding static route configurations and route tables:**
    * Minimize the number of custom route tables (in addition to **defaultRouteTable** and **noneRouteTable**). Custom route tables should be used for more customized routing scenarios such as different routing patterns for Virtual Networks.
    * Use aggregate ranges instead of specific ranges in static routes when possible. This minimizes the number of static routes configured.
    * Carefully evaluate multi-hub designs and utilize [routing intent](how-to-routing-policies.md) when possible. Architectures utilizing static routes to send traffic to Azure Firewall can become complex to operate across multiple hubs and inter-region inspection through Azure Firewall isn't supported with static route configurations.
* **Best practices regarding configuring associations and propagations:**
    * All branches (VPN/ExpressRoute) must associate to the **defaultRouteTable** and propagate to the **same set** of route tables and route table labels.
    * Propagating a connection's routes to a route table implies that all connections associated to that route table can access the propagated routes directly. Ensure your routing configuration is consistent and results in routing symmetry. For example, if branches propagate to a Virtual Network's route table, ensure that the same Virtual Networks propagate to the defaultRouteTable. The same holds if a connection **doesn't** propagate to another connection's route table.
    * Similarly, not propagating a connection to a route table typically implies that connections associated with that same route table won't be able to access that connection. A static route is required.

#### Common use cases

:::image type="content" source="./media/route-scenarios/firewall-static-route-diagram.png" alt-text="Diagram that shows static routes sending same-hub branch, virtual network, and internet traffic through Azure Firewall in a Virtual WAN hub." lightbox="./media/route-scenarios/firewall-static-route-diagram.png":::

One common use case for static routes in Virtual WAN is to send same-hub private traffic through an Azure Firewall deployed in the virtual hub. In this design, the firewall acts as the next hop for traffic that would otherwise flow directly to the final destination.

This pattern is used to deliver Azure Firewall inspection for the following high-level use cases:

| Diagram Traffic Flow | Description |
|--|--|
| 1 | [Traffic between on-premises branches and virtual networks connected to the same virtual hub](static-routes-firewall-basic.md). |
| 2 | [Traffic between virtual networks that are connected to the same virtual hub](static-routes-firewall-basic.md). |
| 3 | [Traffic between the virtual hub's locally connected on-premises branches and Virtual Networks and the internet](static-routes-firewall-basic.md). |

Additional, more complex use cases include:

:::image type="content" source="./media/route-scenarios/bypass-firewall-diagram.png" alt-text="Diagram that shows selected Virtual WAN traffic bypassing Azure Firewall while other traffic is inspected by Azure Firewall." lightbox="./media/route-scenarios/bypass-firewall-diagram.png":::


| Diagram Traffic Flow | Description |
|--|--|
| 1 | [Traffic between certain Virtual Networks should bypass inspection (routed via Virtual Hub router)](firewall-custom-bypass.md#virtual-network-to-virtual-network-selective-inspection). |
| 2 | [Traffic between certain Virtual Networks and on-premises should bypass inspection](firewall-custom-bypass.md#on-premises-to-virtual-network-selective-inspection). |
| 3 | [Traffic local to Virtual WAN hub is inspected via Azure Firewall, while inter-hub traffic bypasses inspection](static-routes-firewall-basic.md#local-hub-inspection-with-inter-hub-routed-directly). |

Other common use cases that require alternate approaches or are not supported with static routes: 

| Use Case| Alternative Approach |
|--|--|
| Route traffic to an NVA deployed inside of the Virtual WAN hub| Inspecting traffic with an NVA deployed in the hub requires using [routing intent and policies](how-to-routing-policies.md).|
| Inspect inter-hub traffic | Use [routing intent and policies](how-to-routing-policies.md).|
| Inspect branch-to-branch traffic (ExpressRoute, Site-to-site VPN and Point-to-site VPN)|Branch-to-branch traffic inspection requires using [routing intent and policies](how-to-routing-policies.md).|
| Virtual Network isolation with secure hubs.| Utilize **Azure Firewall network rules** to block traffic between Virtual Networks that shouldn't be able to communicate. Virtual WAN routing, even when propagations and associations are properly configured, can't guarantee that two Virtual Networks are isolated from a routing perspective. For example, two Virtual Networks that don't propagate to each other can still communicate via Azure Firewall if an aggregate route (such as a 10.0.0.0/8 or 0.0.0.0/0) is configured as a static route pointing to Azure Firewall in the hub on the Virtual Network's associated Virtual WAN route table. |

### Routing traffic to an NVA in a spoke Virtual Network

#### Configuration options

You can configure routing to an IP address in a spoke virtual network in two ways:

* **Option 1: Specify the static route on the virtual network connection**. Set **Propagate static route** to **True**. In this model, the static route on the virtual network connection is automatically propagated into Virtual WAN without needing a separate static route entry in Virtual WAN route tables. This configuration has better scaling properties because Virtual WAN automatically propagates the static routes according to the **Virtual Network's propagated route tables and labels**.
* **Option 2:** Specify a static route in a Virtual WAN route table, with the next hop set to the **Hub virtual network connection**. In this model, there must also be a corresponding static route on the virtual network connection that specifies the next hop IP address for the prefix. Additionally, you must add a static route in every Virtual WAN route table (including remote Virtual WAN hubs) point to the Hub virtual network connection that needs to utilize the static route.

The two configuration options support different routing patterns and have different available use cases:

| Option | Overview| Supported Use Cases|Example Architectures | Unsupported Use Cases|
|--|--|--|--|--|
|  1 | Static route on the virtual network connection with **Propagate static route** set to **True** |Utilize spoke NVA as a source of routes for indirect spokes, VPN tunnels terminated on the NVA device or as an internet edge. Compatible with routing intent hubs. | [Indirect spoke architectures](indirect-spoke-architecture.md) and [route internet-bound traffic to spoke NVA for egress](indirect-spoke-architecture.md), [Hybrid scenarios](hybrid-firewall-spoke-static.md)|  This configuration option **can't be used** for inspection scenarios between a Virtual WAN on-premises connection and spoke Virtual Network.|
|  2 |Static route in a Virtual WAN route table with next hop set to the hub virtual network connection, plus a matching next hop IP on the virtual network connection | Utilize spoke NVA as a source of routes for indirect spokes, VPN tunnels terminated on the NVA device or as an internet edge. Utilize for inspection scenarios between two Virtual WAN connections (on-premises to Virtual Network).  | [Indirect spoke architectures](indirect-spoke-architecture.md), [routing internet-bound traffic to spoke NVA for egress](indirect-spoke-architecture.md), [Hybrid scenarios](hybrid-firewall-spoke-static.md), **[On-premises to Virtual Network inspection](spoke-inspection-north-south.md)**. | Not compatible with hubs using routing intent.|


When using static routes to route traffic to a Virtual Network connection in Virtual WAN, note the following best practices and considerations:

* Utilize configuration **option 1** over configuration **option 2** whenever possible, as **option 1** ensures that static routes are automatically advertised to the relevant Virtual WAN route tables. This significantly reduces the operational overhead of static route management across multiple Virtual WAN route tables and hubs.
* The [bypass next-hop IP address](howto-connect-vnet-hub.md#bypassexplained) setting determines how traffic destined for IP addresses in the same Virtual Network as the NVA is routed. Align this setting with your intended network pattern. Often, setting this value to **true** is critical to routing NVA management traffic correctly to the expected NVA interface or instance.
* If there are multiple static routes configured where the destination CIDRs  are **not** in IANA RFC1918, all static routes with non-RFC1918 destinations must use the **same next hop IP address**.
* For scenarios where the NVA is used to inspect traffic between on-premises and other Virtual Networks, the NVA's Virtual Network will typically be associated with a **custom** route table different from the branches or other Virtual Networks, while all the other connections will propagate to the NVA Virtual Network's **custom route table**. For an example, see the common use cases section below.

#### Common use cases

:::image type="content" source="./media/route-scenarios/spoke-appliance-diagram.png" alt-text="Diagram that shows Virtual WAN static routes sending traffic to a Network Virtual Appliance in a spoke virtual network." lightbox="./media/route-scenarios/spoke-appliance-diagram.png":::

| Diagram Traffic Flow | Description |
|--|--|
| 1 | [Routing traffic to indirect spokes. Indirect spokes are virtual networks that are peered to Virtual WAN spokes, but not directly connected to the Virtual WAN hub](indirect-spoke-architecture.md). |
| 2 | [Route on-premises traffic destined to a spoke Virtual Network to an NVA deployed in a different spoke virtual network for inspection](spoke-inspection-north-south.md). |
| 3 | [Route internet-bound traffic to a spoke NVA for inspection and egress. Commonly used in scenarios where you don't want to use a Firewall solution directly deployed in the Virtual WAN hub](indirect-spoke-architecture.md). |

Some common use cases that require alternative approaches or are not supported in Virtual WAN:

| Use Case| Alternative Approaches|
|--|--|
| Utilize an NVA to inspect Virtual Network to Virtual Network traffic via an NVA deployed in a third Virtual WAN spoke.| Not supported. Utilize an [indirect spoke architecture](indirect-spoke-architecture.md) where spoke virtual networks are peered to the NVA spoke and **not** the Virtual WAN hub. Alternatively, deploy an NVA in the [Virtual WAN hub](about-nva-hub.md), connect all spoke Virtual Networks to the Virtual WAN hub and utilize routing intent.| 
|Utilize an NVA in the spoke to inspect Branch-to-branch traffic. | Not supported. Deploy an NVA in the [Virtual WAN hub](about-nva-hub.md) and utilize routing intent.|

### Combining two types of static routes

You can also combine static routes that point to Azure Firewall in the virtual hub with static routes that point to a virtual network connection. This design is useful when you want different next hops for different traffic classes within the same Virtual WAN deployment.

#### Common use cases include:

:::image type="content" source="./media/route-scenarios/hybrid-diagram.png" alt-text="Diagram that shows Azure Firewall inspecting local traffic while a spoke Network Virtual Appliance handles selected traffic such as internet-bound egress." lightbox="./media/route-scenarios/hybrid-diagram.png":::

| Diagram Traffic Flow | Description |
|--|--|
| 1 and 2| [Use Azure Firewall in the virtual hub to inspect internal traffic between branches and virtual networks (1), or between virtual networks connected to the same hub (1), while using an NVA in a spoke virtual network for internet-bound traffic (2)](hybrid-firewall-spoke-static.md). |

Other common use cases that require alternate approaches or are not supported with static routes: 

| Use case | Alternative approach |
|--|--|
|Double-inspection scenarios: inspect traffic destined for indirect spoke or Internet with Azure Firewall deployed in a secure hub. Then, forward traffic to NVA in spoke for breakout or access to an indirect spoke.| Use [routing intent and policies](how-to-routing-policies.md) and static routes on Virtual Networks connection with **Propagate static routes** set to **true**.|