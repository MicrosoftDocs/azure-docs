---
 title: include file
 description: include file
 services: expressroute
 author: cherylmc
 ms.service: expressroute
 ms.topic: include
 ms.date: 09/24/2018
 ms.author: cherylmc
 ms.custom: include file
---
### What is ExpressRoute Global Reach?

ExpressRoute Global Reach is an Azure service that connects your on-premises networks via the ExpressRoute service through Microsoft's global network. For example, if you have a private data center in California connected to ExpressRoute in Silicon Valley and another private data center in Texas connected to ExpressRoute in Dallas, with ExpressRoute Global Reach, you can connect your private data centers together through the two ExpressRoute connections and your cross data center traffic will traverse through Microsoft's network backbone.

### How do I enable or disable ExpressRoute Global Reach?

You enable ExpressRoute Global Reach by connecting your ExpressRoute circuits together. You disable the feature by disconnecting the circuits. See the configuration.

### Do I need ExpressRoute Premium for ExpressRoute Global Reach?

If your ExpressRoute circuits are in the same geopolitical region, you don't need ExpressRoute Premium to connect them together. If two ExpressRoute circuits are in different geopolitical regions, you need ExpressRoute Premium for both circuits in order to enable connectivity between them. 

### How will I be charged for ExpressRoute Global Reach?

ExpressRoute enables connectivity from your on-premises network to Microsoft cloud services. ExpressRoute Global Reach enables connectivity between your own on-premises networks via your existing ExpressRoute circuits, leveraging Microsoft's global network. ExpressRoute Global Reach is billed separately from the existing ExpressRoute service. There is an Add-on fee for enabling this feature on each ExpressRoute circuit. Traffic between your on-premises networks enabled by ExpressRoute Global Reach will be billed for an egress rate at the source and for an ingress rate at the destination. The rates are based on the zone at which the circuits are located. See <pricing page>

### Where is ExpressRoute Global Reach supported?

ExpressRoute Global Reach is supported in the following countries. The ExpressRoute circuits must be created at the peering locations in these countries.

* Australia
* Hong Kong
* Ireland
* Japan
* Netherlands
* United Kingdom
* United States

### I have more than two on-premises networks, each connected to an ExpressRoute circuit. Can I enable ExpressRoute Global Reach to connect all of my on-premises networks together?

Yes, you can, as long as the circuits are in the supported countries. You need to connect two ExpressRoute circuits at a time. To create a fully meshed network, you need to enumerate all circuit pairs and repeat the configuration. 

### Can I enable ExpressRoute Global Reach between two ExpressRoute circuits at the same peering location?

No. The two circuits must be from different peering locations. If a metro in a supported country has more than one ExpressRoute peering location, you can connect together the ExpressRoute circuits created at different peering locations in that metro. 

### If ExpressRoute Global Reach is enabled between circuit X and circuit Y, and between circuit Y and circuit Z, will my on-premises networks connected to circuit X and circuit Z talk to each other via Microsoft's network?

No. To enable connectivity between any two of your on-premises networks, you must connect the corresponding ExpressRoute circuits explicitly. In the above example, you must connect circuit X and circuit Z. 

### What is the network throughput I can expect between my on-premises networks after I enable ExpressRoute Global Reach?

The network throughput between your on-premises networks, enabled by ExpressRoute Global Reach, is capped by the smaller of the two ExpressRoute circuits.
