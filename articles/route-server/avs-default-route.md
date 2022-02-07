---
title: 'Injecting default route to Azure VMware Solution'
description: Learn about how to advertise a default route to Azure VMware Solution with Azure Route Server.
services: route-server
author: jomore
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: jomore
---

# Default routing for Azure VMware Solution

[Azure VMware Solution (AVS)](https://docs.microsoft.com/azure/azure-vmware/) is an Azure service where native VMware vSphere workloads run and communicate with other Azure services. This communication happens over ExpressRoute, and Azure Route Server can be used to modify the default behavior of Azure VMware Solution networking. For example, a default route can be injected from a Network Virtual Appliance (NVA) in Azure to attract traffic from AVS and inspect it before sending it out to the public Internet, or to analyze traffic between AVS and the on-premises network.

## Advertising the default route

The following diagram shows a basic hub and spoke topology connected to an AVS cloud and to an on-premises network through ExpressRoute. This diagram shows how the default route (`0.0.0.0/0`) is originated by the NVA in Azure, and propagated by Azure Route Server to Azure VMware Solution through ExpressRoute.

:::image type="content" source="./media/senarios/avs-default.png" alt-text="Diagram of AVS with Route Server and default route.":::

> [!IMPORTANT]
> The default route advertised by the NVA will be propagated to the on-premises network as well, so it needs to be filtered out in the customer routing environment.

## Communication between AVS and the on-premises network

If not only the Internet traffic should be inspected by the NVA, but also traffic between AVS and the on-premises network, an additional transit VNet is required to avoid potential routing loops, which would be originated since a single ExpressRoute gateway wouldn't be able to route packets properly (more specifically the User Defined Routes in the GatewaySubnet can either point to the NVA or to on-premises, but not to both).

An additional NVA would be required in this transit VNet, and both NVAs would exchange the routes they learn from their respective Azure Route Servers via BGP and some sort of encapsulation such as VXLAN or IPsec, as the following diagram shows.

:::image type="content" source="./media/senarios/avs-to-on-premises.png" alt-text="Diagram of AVS to on-premises communication with Route Server.":::

The reason why encapsulation is needed is because the NVA NICs would learn the routes from ExpressRoute or from the Route Server, so they would send packets that need to be routed to the other NVA in the wrong direction (potentially creating a routing loop returning the packets to the local NVA).

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
