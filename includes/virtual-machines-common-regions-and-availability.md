# Regions and availability overview
Azure is generally available in 26 regions around the world, typically with multiple datacenters in each region. This gives you flexibility and redundancy in building out your applications to create VMs closest to your users. Write more.

We also [contribute the Open CloudServer](http://www.opencompute.org/wiki/Motherboard/SpecsAndDesigns#Open_CloudServer) to the Open Compute Project.


## What are Azure regions?
Azure allows you to create resources such as VMs in defined geographic regions such as 'West US', 'North Europe', or 'Southeast Asia'. There are currently 26 Azure regions around the world. You can review the [list of regions and their locations](https://azure.microsoft.com/regions/). Within each region, multiple datacenters typically exist in order to provide for redundancy and availability.

## Specialized Azure regions
Within Azure, there are some specialized regions for compliance or legal purposes. 

Existing specialized regions include:

- **US Gov Virginia** and **US Gov Iowa**
    - A physical and logical network-isolated instance of Azure for US government and agencies, operated by screened US persons. Includes additional compliance certifications such as [FedRAMP](https://www.fedramp.gov/marketplace/compliant-systems/) and [DISA](http://www.disa.mil/). Read more about [Azure Government](https://azure.microsoft.com/features/gov/).
- **Australia East** and **Australia Southeast**
    - These regions are available to customers with a business presence in Australia or New Zealand.
- **Central India**, **South India**, and **West India**
    - These regions are currently available to volume licensing customers and partners with a local enrollment in India and access will open to direct online subscriptions throughout 2016.
- **China East** and **China North**
    - These regions are available through a unique partnership between Microsoft and 21Vianet, whereby Microsoft does not directly maintain the datacenters. See more about [Microsoft Azure in China](http://www.windowsazure.cn/).

Announced specialized regions include:
- **Germany Central** and **Germany Northeast**
    - Azure will be available via a new data trustee model whereby customer data remains in Germany under control of T-Systems, a Deutsche Telekom company, acting as the German data trustee.

## Region pairs
Each Azure region is paired with another region within the same geography (such as US, Europe, or Asia). This allows for the replication of resources such as VM storage across a geography that should reduce the likelihood of natural disasters, civil inrest, power outages, or physical network outages affecting both regions at once. Additional advantages of region pairs include:

- In the event of a wider Azure outage, one region is priotizied out of every pair to help reduce the time to restore for applications. 
- Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage.
- Data will continue to reside within the same geography as its pair (with the exception of Brazil South) for tax and law enforcement jurisdiction purposes.

You can see a [list of regional pairs here](../articles/best-practices-availability-paired-regions.md#what-are-paired-regions).

## Feature availability
Some services or VM features are only available in certain regions, such as specific VM sizes or storage types. To assist you in designing your application environment, you can check the [availability of Azure services across each region](https://azure.microsoft.com/regions/#services). 



## Azure Images
Marketplace images, availability of those, licensing
Custom disks, needed within same storage account, so potentially upload multilpe disk images to region


## Availability / redundancy best practices
Multiple instances, availability sets, SLA requirements, etc.


## Availability sets
An availability set is a logical grouping of VMs that provide a way for Azure to understand how your application is built in order to provide for redundancy and availability. It is recommended that two or more VMs are created within an availability set in order to provide for a highly-available application and to meet the [99.95% Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). The availability set is compromised of two additional groupings that protect against hardware failures and allow updates to safely be applied - fault domains and update domains.

![Conceptual drawing of the update domain and fault domain configuration](./media/virtual-machines-common-regions-and-availability/ud-fd-configuration.png)

### Fault domains
A fault domain is a logical group of underlying hardware that share a common power source and network switch, similar to a rack within an on-premises datacenter. As you create VMs within an availability set, the Azure platform automatically distributes your VMs across these fault domains to limit the impact of potential physical hardware failures, network outages, or power interuptions.

### Update domains
An update domain is a logical group of underlying hardware that can undergo maintenance or be rebooted at the same time. As you create VMs within an availability set, the Azure platform automatically distributes your VMs across these update domains to ensure that at least one instance of your application always remains running as the Azure platform undergoes periodic maintenance. Note that the order of update domains being rebooted may not proceed sequentially during planned maintenance, but only one update domain will be reboot at a time.


### 
It is recommended that each tier of your application should be represented by its own availabilty set in order to ensure each component of your application remains accessible during a planned or unplanned event. You can also combine the [Azure load balancer](../articles/load-balancer/load-balancer-overview.md) with an availability set to distribute the traffic across your VMs in each tier for the highest level of application resiliency. You can read more detailed information on availability sets, update and fault domains, and using different application tiers and load balancers for [Linux](../articles/virtual-machines/virtual-machines-linux-manage-availability.md) or [Windows](../articles/virtual-machines/virtual-machines-windows-manage-availability.md).