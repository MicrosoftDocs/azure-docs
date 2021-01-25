---
title: Azure Services that support Availability Zones
description: To create highly available and resilient applications in Azure, Availability Zones provide physically separate locations you can use to run your resources.
author: cynthn
ms.service: azure
ms.topic: article
ms.date: 12/17/2020
ms.author: cynthn
ms.custom: fasttrack-edit, mvc, references_regions
---

# Azure Services that support Availability Zones

Microsoft Azure global infrastructure is designed and constructed at every layer to deliver the highest levels of redundancy and resiliency to its customers. Azure infrastructure is composed of geographies, regions, and Availability Zones, which limit the blast radius of a failure and therefore limit potential impact to customer applications and data. The Azure Availability Zones construct was developed to provide a software and networking solution to protect against datacenter failures and to provide increased high availability (HA) to our customers.

Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters with independent power, cooling, and networking. The physical separation of Availability Zones within a region limits the impact to applications and data from zone failures, such as large-scale flooding, major storms and superstorms, and other events that could disrupt site access, safe passage, extended utilities uptime, and the availability of resources. Availability Zones and their associated datacenters are designed such that if one zone is compromised, the services, capacity, and availability are supported by the other Availability Zones in the region.

All Azure management services are architected to be resilient from region-level failures. In the spectrum of failures, one or more Availability Zone failures within a region have a smaller failure radius compared to an entire region failure. Azure can recover from a zone-level failure of management services within a region. Azure performs critical maintenance one zone at a time within a region, to prevent any failures impacting customer resources deployed across Availability Zones within a region.


![conceptual view of an Azure region with 3 zones](./media/az-region/azure-region-availability-zones.png)


Azure services supporting Availability Zones fall into three categories: **zonal**, **zone-redundant**, and **non-regional** services. Customer workloads can be categorized to utilize any of these architecture scenarios to meet application performance and durability.

- **Zonal services** – A resource can be deployed to a specific, self-selected Availability Zone to achieve more stringent latency or performance requirements.  Resiliency is self-architected by replicating applications and data to one or more zones within the region.  Resources can be pinned to a specific zone. For example, virtual machines, managed disks, or standard IP addresses can be pinned to a specific zone, which allows for increased resilience by having one or more instances of resources spread across zones.

- **Zone-redundant services** – Azure platform replicates the resource and data across zones.  Microsoft manages the delivery of high availability since Azure automatically replicates and distributes instances within the region.  ZRS, for example, replicates the data across three zones so that a zone failure does not impact the HA of the data. 

- **Non-regional services** – Services are always available from Azure geographies and are resilient to zone-wide outages as well as region-wide outages. 


To achieve comprehensive business continuity on Azure, build your application architecture using the combination of Availability Zones with Azure region pairs. You can synchronously replicate your applications and data using Availability Zones within an Azure region for high-availability and asynchronously replicate across Azure regions for disaster recovery protection. To learn more, read [building solutions for high availability using Availability Zones](/azure/architecture/high-availability/building-solutions-for-high-availability). 

## Azure services supporting Availability Zones

 - The older generation virtual machines are not listed. For more information, see [Previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).
 - As mentioned in the [Regions and Availability Zones in Azure](az-overview.md), some services are non-regional. These services do not have dependency on a specific Azure region, as such are resilient to zone-wide outages as well as region-wide outages.  The list of non-regional services can be found at [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


## Azure regions with Availability Zones

|     Americas                                                                                                                               |     Europe                                                                        |     Germany                   |     Africa                         |     Asia Pacific                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|-------------------------------|------------------------------------|---------------------------------------------------------------------|
|     Canada   Central     Central   US     East   US     East   US 2     South   Central US     US   Gov Virginia*     West   US 2          |     France   Central     North   Europe     UK   South     West   Europe          |     Germany   West Central    |     South   Africa North*          |     Japan   East     Southeast   Asia     Australia   East          |

To learn more about Availability Zones and available services support in these regions, contact your Microsoft sales or customer representative. For the upcoming regions that will support Availability Zones, see [Azure geographies](https://azure.microsoft.com/en-us/global-infrastructure/geographies/).


## Azure Services supporting Availability Zones

- Older generation virtual machines are not listed below. For more information, see [previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).

- Some services are non-regional, see [Regions and Availability Zones in Azure](az-overview.md) for more information. These services do not have dependency on a specific Azure region, making them resilient to zone-wide outages and region-wide outages.  The list of non-regional services can be found at [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


### Zone Resilient Services 

:globe_with_meridians: Non-Regional Services - Services are always available from Azure geographies and are resilient to zone-wide outages as well as region-wide outages.
:small_red_triangle:   Resilient to the zone-wide outages 
:heavy_check_mark:    Generally Available in all regions with Availability Zones

### Foundational Services

| Products                                              | Resiliency | Availability |
|-------------------------------------------------------|------------|--------------|
| Storage Account                                       | :small_red_triangle:          | :heavy_check_mark:            |
| Application Gateway (V2)                              | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Backup                                          | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Cosmos DB                                       | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Data Lake Storage Gen 2                         | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Express Route                                   | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Public IP                                       | :small_red_triangle:          | :heavy_check_mark:            |
| Azure SQL Database (General Purpose Tier)             | :small_red_triangle:          | :heavy_check_mark:            |
| Azure SQL Database (Premium & Business Critical Tier) | :small_red_triangle:          | :heavy_check_mark:            |
| Disk Storage                                          | :small_red_triangle:          | :heavy_check_mark:            |
| Event Hubs                                            | :small_red_triangle:          | :heavy_check_mark:            |
| Key Vault                                             | :small_red_triangle:          | :heavy_check_mark:            |
| Load Balancer                                         | :small_red_triangle:          | :heavy_check_mark:            |
| Service Bus                                           | :small_red_triangle:          | :heavy_check_mark:            |
| Service Fabric                                        | :small_red_triangle:          | :heavy_check_mark:            |
| Storage: Hot/Cool Blob Storage Tiers                  | :small_red_triangle:          | :heavy_check_mark:            |
| Storage: Managed Disks                                | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines Scale Sets                           | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines                                      | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Av2-Series                          | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Bs-Series                           | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: DSv2-Series                         | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: DSv3-Series                         | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Dv2-Series                          | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Dv3-Series                          | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: ESv3-Series                         | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Ev3-Series                          | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Network                                       | :small_red_triangle:          | :heavy_check_mark:            |
| VPN Gateway                                           | :small_red_triangle:          | :heavy_check_mark:            |



### Mainstream services

| Products                                             | Resiliency | Availability |
|------------------------------------------------------|------------|--------------|
| App Service Environments                             | :small_red_triangle:          | :heavy_check_mark: <sup>3</sup> |
| Azure Active Directory Domain Services               | :small_red_triangle:          | :heavy_check_mark: <sup>4</sup> |
| Azure Bastion                                        | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Cache for Redis                                | :small_red_triangle:          | :heavy_check_mark: <sup>4</sup>|
| Azure Cognitive Services: Text Analytics             | :small_red_triangle:          | :heavy_check_mark: <sup>4</sup>|
| Azure Data Explorer                                  | :small_red_triangle:          | :heavy_check_mark: <sup>4</sup>|
| Azure Database for MySQL – Flexible Server           | :small_red_triangle:          | :heavy_check_mark: <sup>5</sup>  |
| Azure Database for PostgreSQL – Flexible Server (ZR) | :small_red_triangle:          | :heavy_check_mark: <sup>6</sup>  |
| Azure DDoS Protection                                | :small_red_triangle:          | :heavy_check_mark: <sup>7</sup>  |
| Azure Firewall                                       | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Firewall Manager                               | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Kubernetes Service (AKS)                       | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Private Link                                   | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Red Hat OpenShift                              | :small_red_triangle:          | :heavy_check_mark:            |
| Azure Site Recovery                                  | :small_red_triangle:          | :heavy_check_mark: <sup>8</sup> |
| Container Registry                                   | :small_red_triangle:          | :heavy_check_mark: <sup>9</sup> |
| Event Grid                                           | :small_red_triangle:          | :heavy_check_mark: <sup>4</sup>|
| Network Watcher                                      | :small_red_triangle:          | :heavy_check_mark: <sup>10</sup> |
| Power BI Embedded                                    | :small_red_triangle:          | :heavy_check_mark: <sup>11</sup>  |
| Premium Blob Storage                                 | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Ddsv4-Series                       | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Ddv4-Series                        | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Dsv4-Series                        | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Dv4-Series                         | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Edsv4-Series                       | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Edv4-Series                        | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Esv4-Series                        | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Ev4-Series                         | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: Fsv2-Series                        | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual Machines: M-Series                           | :small_red_triangle:          | :heavy_check_mark:            |
| Virtual WAN                                          | :small_red_triangle:          | :heavy_check_mark:            |



### Non-regional

| Products                             | Resiliency | Availability |
|--------------------------------------|------------|--------------|
| Azure DNS                            | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Active Directory               | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Advisor                        | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Bot Services                   | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Defender for IoT               | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Information Protection         | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Lighthouse                     | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Managed Applications           | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Maps                           | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Policy                         | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Resource Graph                 | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Stack                          | :globe_with_meridians:          | :heavy_check_mark:            |
| Azure Stack Edge                     | :globe_with_meridians:          | :heavy_check_mark:            |
| Cloud Shell                          | :globe_with_meridians:          | :heavy_check_mark:            |
| Customer Lockbox for Microsoft Azure | :globe_with_meridians:          | :heavy_check_mark:            |
| Microsoft Azure Peering Service      | :globe_with_meridians:          | :heavy_check_mark:            |
| Microsoft Azure portal               | :globe_with_meridians:          | :heavy_check_mark:            |
| Security Center                      | :globe_with_meridians:          | :heavy_check_mark:            |
| Traffic Manager                      | :globe_with_meridians:          | :heavy_check_mark:            |



<sup>1</sup>  Available from South East Asia, UK South
<sup>2</sup>  Available from Central US, East US, East US 2, West US 2, France Central, North Europe, UK South, West Europe, Japan East, Southeast Asia
<sup>3</sup>Available from Canada Central, Central US, East US, East US 2, West US 2, France Central, North Europe, UK South, West Europe, Germany West Central, Japan East, Southeast Asia, Australia East
<sup>4</sup>  Available from Canada Central, Central US, East US, East US 2, West US 2, France Central, North Europe, UK South, West Europe, Japan East, Southeast Asia, Australia East
<sup>5</sup>  Available from West US 2, UK South, Southeast Asia, West Europe, East US, Canada Central, Australia East, East US 2, North Europe, Japan East, Central US
<sup>6</sup>  Available from West US 2, UK South, Southeast Asia, West Europe, East US, Canada Central, East US 2, Japan East, Central US
<sup>7</sup>  Available from Central US, East US, East US 2, West US 2, France Central, North Europe, West Europe, Japan East, Southeast Asia, Australia East
<sup>8</sup>  Available from Central US, East US, East US 2, West US 2, North Europe, UK South, Japan East, Southeast Asia, Australia East
<sup>9</sup>  Available from East US, East US 2, West US 2
<sup>10</sup>  Available from East US, East US 2, West US 2, France Central, North Europe, West Europe, Japan East
<sup>11</sup>  Available from East US 2, Southeast Asia, UK South, West Europe, Central US, France Central, Japan East

## Pricing for VMs in Availability Zones

There is no additional cost for virtual machines deployed in an Availability Zone. For more information, review the [Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/).


## Get started with Availability Zones

- [Create a virtual machine](../virtual-machines/windows/create-portal-availability-zone.md)
- [Add a Managed Disk using PowerShell](../virtual-machines/windows/attach-disk-ps.md#add-an-empty-data-disk-to-a-virtual-machine)
- [Create a zone redundant virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
- [Load balance VMs across zones using a Standard Load Balancer with a zone-redundant frontend](../load-balancer/quickstart-load-balancer-standard-public-cli.md?tabs=option-1-create-load-balancer-standard)
- [Load balance VMs within a zone using a Standard Load Balancer with a zonal frontend](../load-balancer/quickstart-load-balancer-standard-public-cli.md?tabs=option-1-create-load-balancer-standard)
- [Zone-redundant storage](../storage/common/storage-redundancy.md)
- [SQL Database general purpose tier](../azure-sql/database/high-availability-sla.md#general-purpose-service-tier-zone-redundant-availability-preview)
- [Event Hubs geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md#availability-zones)
- [Service Bus geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md#availability-zones)
- [Create a zone-redundant virtual network gateway](../vpn-gateway/create-zone-redundant-vnet-gateway.md)
- [Add zone redundant region for Azure Cosmos DB](../cosmos-db/high-availability.md#availability-zone-support)
- [Getting Started Azure Cache for Redis Availability Zones](https://gist.github.com/JonCole/92c669ea482bbb7996f6428fb6c3eb97#file-redisazgettingstarted-md)
- [Create an Azure Active Directory Domain Services instance](../active-directory-domain-services/tutorial-create-instance.md)
- [Create an Azure Kubernetes Service (AKS) cluster that uses Availability Zones](../aks/availability-zones.md)


## Next steps

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)