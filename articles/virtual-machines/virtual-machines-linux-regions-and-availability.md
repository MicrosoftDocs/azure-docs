<properties
   pageTitle="Azure regions and availability for Linux VMs | Microsoft Azure"
   description="Learn about the regions and availability features for running Linux virtual machines in Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="07/18/2016"
   ms.author="iainfou"/>

# Regions and availability overview
Azure is generally available in 26 regions around the world, typically with multiple datacenters in each region. This gives you flexibility and redundancy in building out your applications to create VMs closest to your users. Write more.

We also [contribute the Open CloudServer](http://www.opencompute.org/wiki/Motherboard/SpecsAndDesigns#Open_CloudServer) to the Open Compute Project.


## What are Azure regions?
You create VMs and other Azure resources within a region, such as 'West US', 'North Europe', or 'Southeast Asia'. There are currently 26 regions around the world. You can review the [list of regions and their locations](https://azure.microsoft.com/regions/). Within each region, multiple datacenters typically exist in order to provide for redundancy and availability even within a given region.

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
Each region within Azure is paired with another region within the same geography (such as US, Europe, or Asia). This allows for replication of resources such as VM storage across a geography that should reduce the likelihood of natural disasters, civil inrest, power outages, or physical network outages affecting both regions at once. Additional advantages of region pairs include:

- In the event of a wider Azure outage, one region is priotizied out of every pair to help reduce the time to restore for applications. 
- Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage.
- Data will continue to reside within the same geography as its pair (with the exception of Brazil South) for tax and law enforcement jurisdiction purposes.

You can see a [list of regional pairs here](https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/#what-are-paired-regions).

## Feature availability
Some services or VM features are only available in certain regions, including specific VM sizes or storage types. To assist you in designing your application environment, you can check the [availability of Azure services across each region](https://azure.microsoft.com/en-us/regions/#services). 



## Azure Images
Marketplace images, availability of those, licensing
Custom disks, needed within same storage account, so potentially upload multilpe disk images to region


## Availability / redundancy best practices
Multiple instances, availability sets, SLA requirements, etc.


## Availability sets
Needed for SLA, best practices for multiple instances for applications

Can also link to https://azure.microsoft.com/documentation/articles/virtual-machines-linux-manage-availability/

### Fault domains

### Upgrade domains



## Next steps
