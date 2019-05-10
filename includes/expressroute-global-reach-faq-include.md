---
 title: include file
 description: include file
 services: expressroute
 author: cherylmc
 ms.service: expressroute
 ms.topic: include
 ms.date: 03/19/2019
 ms.author: cherylmc
 ms.custom: include file
---
### What is ExpressRoute Global Reach?

ExpressRoute Global Reach is an Azure service that connects your on-premises networks via the ExpressRoute service through Microsoft's global network. For example, if you have a private data center in California connected to ExpressRoute in Silicon Valley and another private data center in Texas connected to ExpressRoute in Dallas, with ExpressRoute Global Reach, you can connect your private data centers together through the two ExpressRoute connections and your cross data center traffic will traverse through Microsoft's network backbone.

### How do I enable or disable ExpressRoute Global Reach?

You enable ExpressRoute Global Reach by connecting your ExpressRoute circuits together. You disable the feature by disconnecting the circuits. See the [configuration](../articles/expressroute/expressroute-howto-set-global-reach.md).

### Do I need ExpressRoute Premium for ExpressRoute Global Reach?

If your ExpressRoute circuits are in the same geopolitical region, you don't need ExpressRoute Premium to connect them together. If two ExpressRoute circuits are in different geopolitical regions, you need ExpressRoute Premium for both circuits in order to enable connectivity between them. 

### How will I be charged for ExpressRoute Global Reach?

ExpressRoute enables connectivity from your on-premises network to Microsoft cloud services. ExpressRoute Global Reach enables connectivity between your own on-premises networks via your existing ExpressRoute circuits, leveraging Microsoft's global network. ExpressRoute Global Reach is billed separately from the existing ExpressRoute service. There is an Add-on fee for enabling this feature on each ExpressRoute circuit. Traffic between your on-premises networks enabled by ExpressRoute Global Reach will be billed for an egress rate at the source and for an ingress rate at the destination. The rates are based on the zone at which the circuits are located.

### Where is ExpressRoute Global Reach supported?

ExpressRoute Global Reach is supported in [select countries/regions or places](../articles/expressroute/expressroute-global-reach.md). The ExpressRoute circuits must be created at the peering locations in those countries/regions or places.

### I have more than two on-premises networks, each connected to an ExpressRoute circuit. Can I enable ExpressRoute Global Reach to connect all of my on-premises networks together?

Yes, you can, as long as the circuits are in the supported countries/regions. You need to connect two ExpressRoute circuits at a time. To create a fully meshed network, you need to enumerate all circuit pairs and repeat the configuration. 

### Can I enable ExpressRoute Global Reach between two ExpressRoute circuits at the same peering location?

No. The two circuits must be from different peering locations. If a metro in a supported country/region has more than one ExpressRoute peering location, you can connect together the ExpressRoute circuits created at different peering locations in that metro. 

### If ExpressRoute Global Reach is enabled between circuit X and circuit Y, and between circuit Y and circuit Z, will my on-premises networks connected to circuit X and circuit Z talk to each other via Microsoft's network?

No. To enable connectivity between any two of your on-premises networks, you must connect the corresponding ExpressRoute circuits explicitly. In the above example, you must connect circuit X and circuit Z. 

### What is the network throughput I can expect between my on-premises networks after I enable ExpressRoute Global Reach?

The network throughput between your on-premises networks, enabled by ExpressRoute Global Reach, is capped by the smaller of the two ExpressRoute circuits. Premises-to-Azure traffic and premises-to-premises traffic share the same circuit and are subject to the same bandwidth cap. 

### With ExpressRoute Global Reach, what are the limits on the number of routes I can advertise and the number of routes I will receive?

The number of routes you can advertise to Microsoft on Azure private peering remains at 4000 on a Standard circuit or 10000 on a Premium circuit. The number of routes you will receive from Microsoft on Azure private peering will be the sum of the routes of your Azure virtual networks and the routes from your other on-premises networks connected via ExpressRoute Global Reach. Please make sure you set an appropriate maximum prefix limit on your on-premises router. 

### What is the SLA for ExpressRoute Global Reach?

ExpressRoute Global Reach will provide the same [availability SLA](https://azure.microsoft.com/support/legal/sla/expressroute/v1_3/) as the regular ExpressRoute service.
