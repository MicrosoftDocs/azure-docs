---
 title: include file
 description: include file
 services: expressroute
 author: duongau
 ms.service: expressroute
 ms.topic: include
 ms.date: 03/13/2023
 ms.author: duau
 ms.custom: include file
---
### What is ExpressRoute Direct?

ExpressRoute Direct provides customers with the ability to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100 Gbps or 10-Gbps connectivity, which supports Active/Active connectivity at scale. 

### How do customers connect to ExpressRoute Direct? 

Customers need to work with their local carriers and colocation providers to get connectivity to ExpressRoute routers to take advantage of ExpressRoute Direct.

### What locations currently support ExpressRoute Direct? 

Check the availability on the [location page](../articles/expressroute/expressroute-locations-providers.md). 

### What is the SLA for ExpressRoute Direct?

ExpressRoute Direct utilizes the same [enterprise-grade of ExpressRoute](https://azure.microsoft.com/support/legal/sla/expressroute/v1_3/). 

### What scenarios should customers consider with ExpressRoute Direct?  

ExpressRoute Direct provides customers with direct 100 Gbps or 10-Gbps port pairs into the Microsoft global backbone. The scenarios that provide customers with the greatest benefits include: Massive data ingestion, physical isolation for regulated markets, and dedicated capacity for burst scenario, like rendering. 

### What is the billing model for ExpressRoute Direct? 

ExpressRoute Direct is billed for the port pair at a fixed amount. Standard circuits are included at no extra charge and premium has a slight add-on charge. Egress is billed on a per circuit basis based on the zone of the peering location.

### When does billing start and stop for the ExpressRoute Direct port pairs?

ExpressRoute Direct's port pairs gets billed 45 days into the creation of the ExpressRoute Direct resource or when one or both of the links get enabled, whichever comes first. The 45-day grace period is granted to allow customers to complete the cross-connection process with the colocation provider.

You'll stop being charged for ExpressRoute Direct's port pairs after you delete the direct ports and remove the cross-connects.

### How do I request Express Route Direct Port if bandwidth isn't available at a peering location?

If bandwidth is unavailable in the target peering location, open a [support request in the Azure portal](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/%7E/overview) and select the ExpressRoute Direct support topic.
