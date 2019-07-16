---
 title: include file
 description: include file
 services: expressroute
 author: jaredr80
 ms.service: expressroute
 ms.topic: include
 ms.date: 07/09/2019
 ms.author: jaredro
 ms.custom: include file
---
### What is ExpressRoute Direct?

ExpressRoute Direct provides customers with the ability to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100 or 10 Gbps connectivity, which supports Active/Active connectivity at scale. 

### How do customers connect to ExpressRoute Direct? 

Customers will need to work with their local carriers and co-location providers to get connectivity to ExpressRoute routers to take advantage of ExpressRoute Direct.

### What locations currently support ExpressRoute Direct? 

The available ports will be dynamic and will be available by PowerShell to view the capacity. Locations include and *are subject to change based on availability*:

* Amsterdam
* Amsterdam2
* Auckland 
* Chicago
* Dallas
* Dublin
* Hong Kong SAR
* London
* Los Angeles
* Melbourne
* New York City
* Perth
* San Antonio
* Seattle
* Seoul
* Silicon Valley
* Singapore2 
* Sydney
* Taipei
* Tokyo
* Toronto
* Washington DC
* Washington DC2

### What is the SLA for ExpressRoute Direct?

ExpressRoute Direct will utilize the same [enterprise-grade of ExpressRoute](https://azure.microsoft.com/support/legal/sla/expressroute/v1_3/). 

### What scenarios should customers consider with ExpressRoute Direct?  

ExpressRoute Direct provides customers with direct 100 or 10 Gbps port pairs into the Microsoft global backbone. The scenarios that will provide customers with the greatest benefits include: Massive data ingestion, physical isolation for regulated markets, and dedicated capacity for burst scenario, like rendering. 

### What is the billing model for ExpressRoute Direct? 

ExpressRoute Direct will be billed for the port pair at a fixed amount. Standard circuits will be included at no additional hours and premium will have a slight add-on charge. Egress will be billed on a per circuit basis based on the zone of the peering location.

### When does billing start for the ExpressRoute Direct port pairs?

ExpressRoute Direct's port pairs are billed 45 days into the creation of the ExpressRoute Direct resource or when 1 or both of the links are enabled, whichever comes first. The 45-day grace period is granted to allow customers to complete the cross-connection process with the colocation provider.
