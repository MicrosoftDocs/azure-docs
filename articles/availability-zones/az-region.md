---
title: Azure Services that support Availability Zones
description: To create highly available and resilient applications in Azure, Availability Zones provide physically separate locations you can use to run your resources.
author: prsandhu
ms.service: azure
ms.topic: conceptual
ms.date: 04/13/2021
ms.author: prsandhu
ms.reviewer: cynthn
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
 

| Americas           | Europe               | Africa              | Asia Pacific   |
|--------------------|----------------------|---------------------|----------------|
|                    |                      |                     |                |
| Brazil South       | France Central       | South Africa North* | Australia East |
| Canada Central     | Germany West Central |                     | Central India* |
| Central US         | North Europe         |                     | Japan East     |
| East US            | UK South             |                     | Korea Central* |
| East US 2          | West Europe          |                     | Southeast Asia |
| South   Central US |                      |                     |                |
| US Gov Virginia    |                      |                     |                |
| West   US 2        |                      |                     |                |
| West   US 3*       |                      |                     |                |

\* To learn more about Availability Zones and available services support in these regions, contact your Microsoft sales or customer representative. For the upcoming regions that will support Availability Zones, see [Azure geographies](https://azure.microsoft.com/en-us/global-infrastructure/geographies/).


## Azure Services supporting Availability Zones

- Older generation virtual machines are not listed below. For more information, see [previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).

- Some services are non-regional, see [Regions and Availability Zones in Azure](az-overview.md) for more information. These services do not have dependency on a specific Azure region, making them resilient to zone-wide outages and region-wide outages.  The list of non-regional services can be found at [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


### Zone Resilient Services 

:globe_with_meridians: Non-Regional Services - Services are always available from Azure geographies and are resilient to zone-wide outages as well as region-wide outages.

:large_blue_diamond:   Resilient to the zone-wide outages 

**Foundational Services**

|     Products                                                    | Resiliency             |
|-----------------------------------------------------------------|:----------------------------:|
|     [Application   Gateway (V2)](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant)                                  | :large_blue_diamond:  |
|     [Azure Backup](https://docs.microsoft.com/azure/backup/backup-create-rs-vault#set-storage-redundancy)                                                | :large_blue_diamond:  |
|     [Azure Cosmos   DB](https://docs.microsoft.com/azure/cosmos-db/high-availability#availability-zone-support)                                           | :large_blue_diamond:  |
|     [Azure Data   Lake Storage Gen 2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction)                             | :large_blue_diamond:  |
|     [Azure Express   Route](https://docs.microsoft.com/azure/expressroute/designing-for-high-availability-with-expressroute)                                       | :large_blue_diamond:  |
|     [Azure Public   IP](https://docs.microsoft.com/azure/virtual-network/public-ip-addresses)                                           | :large_blue_diamond:  |
|     Azure SQL   Database ([General Purpose Tier](https://docs.microsoft.com/azure/azure-sql/database/high-availability-sla))                 | :large_blue_diamond:  |
|     Azure SQL   Database([Premium & Business Critical Tier](https://docs.microsoft.com/azure/azure-sql/database/high-availability-sla))     | :large_blue_diamond:  |
|     [Disk Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy)                                                | :large_blue_diamond:  |
|     [Event Hubs](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr#availability-zones)                                                  | :large_blue_diamond:  |
|     [Key Vault](https://docs.microsoft.com/azure/key-vault/general/disaster-recovery-guidance)                                                   | :large_blue_diamond:  |
|     [Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones)                                               | :large_blue_diamond:  |
|     [Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-geo-dr#availability-zones)                                                 | :large_blue_diamond:  |
|     [Service   Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-cross-availability-zones#:~:text=An%20Availability%20Zone%20is%20a%20unique%20physical%20location,zones.%20This%20will%20ensure%20high-availability%20of%20your%20applications)                                            | :large_blue_diamond:  |
|     [Storage   Account](https://docs.microsoft.com/azure/storage/common/storage-redundancy)                                           | :large_blue_diamond:  |
|     Storage:   [Hot/Cool Blob Storage Tiers](https://docs.microsoft.com/azure/storage/common/storage-redundancy)                      | :large_blue_diamond:  |
|     Storage:   [Managed Disks](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview)                                    | :large_blue_diamond:  |
|     [Virtual   Machines Scale Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/scripts/cli-sample-zone-redundant-scale-set)                               | :large_blue_diamond:  |
|     [Virtual   Machines](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                                          | :large_blue_diamond:  |
|     Virtual   Machines: [Av2-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                              | :large_blue_diamond:  |
|     Virtual   Machines: [Bs-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual   Machines: [DSv2-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                             | :large_blue_diamond:  |
|     Virtual   Machines: [DSv3-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                            | :large_blue_diamond:  |
|     Virtual   Machines: [Dv2-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                             | :large_blue_diamond:  |
|     Virtual   Machines: [Dv3-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                              | :large_blue_diamond:  |
|     Virtual   Machines: [ESv3-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                             | :large_blue_diamond:  |
|     Virtual   Machines: [Ev3-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                              | :large_blue_diamond:  |
|     Virtual   Machines: [F-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                                | :large_blue_diamond:  |
|     Virtual   Machines: [FS-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [Shared Image Gallery](https://docs.microsoft.com/azure/virtual-machines/shared-image-galleries#make-your-images-highly-available) | :large_blue_diamond:  |
|     [Virtual   Network](https://docs.microsoft.com/azure/vpn-gateway/create-zone-redundant-vnet-gateway)                                         | :large_blue_diamond:  |
|     [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/about-zone-redundant-vnet-gateways)                                             | :large_blue_diamond:  |


**Mainstream services**


|     Products                                                    | Resiliency             |
|-----------------------------------------------------------------|:----------------------------:|
|     [App Service Environments](https://docs.microsoft.com/azure/app-service/environment/zone-redundancy)                                    | :large_blue_diamond:  |
|     [Azure Active Directory Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/overview)                      | :large_blue_diamond:  |
|     [Azure API Management](https://docs.microsoft.com/azure/api-management/zone-redundancy)                      | :large_blue_diamond:  |
|     [Azure Bastion](https://docs.microsoft.com/azure/bastion/bastion-overview)                                               | :large_blue_diamond:  |
|     [Azure Cache for Redis](https://docs.microsoft.com/azure/azure-cache-for-redis/cache-high-availability)                              | :large_blue_diamond:  |
|     [Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-performance-optimization#availability-zones)               | :large_blue_diamond:  |
|     Azure Cognitive Services: [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/)                    | :large_blue_diamond:  |
|     [Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal)                               | :large_blue_diamond:  |
|     Azure Database for MySQL – [Flexible Server](https://docs.microsoft.com/azure/mysql/flexible-server/concepts-high-availability)                  | :large_blue_diamond:  |
|     Azure Database for PostgreSQL – [Flexible Server](https://docs.microsoft.com/azure/postgresql/flexible-server/overview)             | :large_blue_diamond:  |
|     [Azure DDoS Protection](https://docs.microsoft.com/azure/ddos-protection/ddos-faq)                                       | :large_blue_diamond:  |
|     [Azure Disk Encryption](https://docs.microsoft.com/azure/virtual-machines/disks-redundancy)                                       | :large_blue_diamond:  |
|     [Azure Firewall](https://docs.microsoft.com/azure/firewall/deploy-availability-zone-powershell#:~:text=For%20more%20information%20about%20Azure%20Firewall%20Availability%20Zones%2C,This%20creates%20a%20zone-redundant%20IP%20address%20by%20default)                                              | :large_blue_diamond:  |
|     [Azure Firewall Manager](https://docs.microsoft.com/azure/firewall-manager/quick-firewall-policy)                                      | :large_blue_diamond:  |
|     [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/availability-zones)                              | :large_blue_diamond:  |
|     [Azure Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview)                                          | :large_blue_diamond:  |
|     [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery)                                         | :large_blue_diamond:  |
|     Azure SQL: [Virtual Machine](https://docs.microsoft.com/azure/azure-sql/database/high-availability-sla)                                  | :large_blue_diamond:  |
|     [Azure Web Application Firewall](https://docs.microsoft.com/azure/firewall/deploy-availability-zone-powershell#:~:text=For%20more%20information%20about%20Azure%20Firewall%20Availability%20Zones%2C,This%20creates%20a%20zone-redundant%20IP%20address%20by%20default)                              | :large_blue_diamond:  |
|     [Container Registry](https://docs.microsoft.com/azure/container-registry/zone-redundancy)                                          | :large_blue_diamond:  |
|     [Event Grid](https://docs.microsoft.com/azure/event-grid/overview)                                                  | :large_blue_diamond:  |
|     [Network Watcher](https://docs.microsoft.com/azure/network-watcher/frequently-asked-questions#service-availability-and-redundancy)                                             | :large_blue_diamond:  |
|     Network Watcher: [Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/frequently-asked-questions#service-availability-and-redundancy)                          | :large_blue_diamond:  |
|     [Power BI Embedded](https://docs.microsoft.com/power-bi/admin/service-admin-failover#what-does-high-availability)                                           | :large_blue_diamond:  |
|     [Premium Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-performance-tiers#:~:text=Table%201%20%20%20%20Area%20%20,%20%20Currently%20supports%20only%20locally-redundan%20...%20)                                        | :large_blue_diamond:  |
|     Storage: [Azure Premium Files](https://docs.microsoft.com/azure/storage/files/storage-files-planning)                                | :large_blue_diamond:  |
|     Virtual Machines: [Azure Dedicated Host](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                     | :large_blue_diamond:  |
|     Virtual Machines: [Ddsv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                              | :large_blue_diamond:  |
|     Virtual Machines: [Ddv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [Dsv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [Dv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                                | :large_blue_diamond:  |
|     Virtual Machines: [Edsv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                              | :large_blue_diamond:  |
|     Virtual Machines: [Edv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [Esv4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [Ev4-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                                | :large_blue_diamond:  |
|     Virtual Machines: [Fsv2-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                               | :large_blue_diamond:  |
|     Virtual Machines: [M-Series](https://docs.microsoft.com/azure/virtual-machines/windows/create-powershell-availability-zone)                                  | :large_blue_diamond:  |
|     [Virtual WAN](https://docs.microsoft.com/azure/virtual-wan/virtual-wan-about#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)                                                 | :large_blue_diamond:  |
|     Virtual WAN: [ExpressRoute](https://docs.microsoft.com/azure/virtual-wan/virtual-wan-about#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)                                   | :large_blue_diamond:  |
|     Virtual WAN: [Point-to-Site VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/about-zone-redundant-vnet-gateways)                      | :large_blue_diamond:  |
|     Virtual WAN: [Site-to-Site VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/about-zone-redundant-vnet-gateways)                       | :large_blue_diamond:  |


**Specialized Services**

|     Products                                                    | Resiliency             |
|-----------------------------------------------------------------|:----------------------------:|
|     Azure Red Hat OpenShift                                     | :large_blue_diamond:  |
|     Cognitive Services: Anomaly Detector                        | :large_blue_diamond:  |
|     Cognitive Services: Form Recognizer                         | :large_blue_diamond:  |
|     Storage: Ultra Disk                                         | :large_blue_diamond:  |


**Non-regional**

|     Products                                                    | Resiliency             |
|-----------------------------------------------------------------|:----------------------------:|
|     Azure DNS                                                   | :globe_with_meridians: |
|     Azure Active   Directory                                    | :globe_with_meridians: |
|     Azure Advanced Threat Protection                            | :globe_with_meridians: |
|     Azure Advisor                                               | :globe_with_meridians: |
|     Azure Blueprints                                            | :globe_with_meridians: |
|     Azure Bot Services                                          | :globe_with_meridians: |
|     Azure Front Door                                            | :globe_with_meridians: |
|     Azure   Defender for IoT                                    | :globe_with_meridians: |
|     Azure Front Door                                            | :globe_with_meridians: |
|     Azure   Information Protection                              | :globe_with_meridians: |
|     Azure   Lighthouse                                          | :globe_with_meridians: |
|     Azure Managed   Applications                                | :globe_with_meridians: |
|     Azure Maps                                                  | :globe_with_meridians: |
|     Azure Performance Diagnostics                               | :globe_with_meridians: |
|     Azure Policy                                                | :globe_with_meridians: |
|     Azure   Resource Graph                                      | :globe_with_meridians: |
|     Azure Sentinel                                              | :globe_with_meridians: |
|     Azure Stack                                                 | :globe_with_meridians: |
|     Azure Stack   Edge                                          | :globe_with_meridians: |
|     Cloud Shell                                                 | :globe_with_meridians: |
|     Content Delivery Network                                    | :globe_with_meridians: |
|     Cost Management                                             | :globe_with_meridians: |
|     Customer Lockbox   for Microsoft Azure                      | :globe_with_meridians: |
|     Intune                                                      | :globe_with_meridians: |
|     Microsoft   Azure Peering Service                           | :globe_with_meridians: |
|     Microsoft   Azure portal                                    | :globe_with_meridians: |
|     Microsoft Cloud App Security                                | :globe_with_meridians: |
|     Microsoft Graph                                             | :globe_with_meridians: |
|     Security   Center                                           | :globe_with_meridians: |
|     Traffic   Manager                                           | :globe_with_meridians: |


## Pricing for VMs in Availability Zones

Azure Availability Zones are available with your Azure subscription. Learn more here - [Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/).


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
