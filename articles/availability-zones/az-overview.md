---
title: Regions and Availability Zones in Azure
description: To create highly available and resilient applications in Azure, Availability Zones provide physically separate locations you can use to run your resources.
author: cynthn
ms.service: azure
ms.topic: article
ms.date: 04/15/2020
ms.author: cynthn
ms.custom: fasttrack-edit, mvc
---

# Regions and Availability Zones in Azure

Microsoft Azure services are available globally to drive your cloud operations at an optimal level. You can choose the best region for your needs based on technical and regulatory considerations: service capabilities, data residency, compliance requirements, and latency.

## Terminology

To better understand regions and Availability Zones in Azure, it helps to understand key terms or concepts.

| Term or concept | Description |
| --- | --- |
| region | A set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. |
| Availability Zone | Unique physical locations within a region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. |
| recommended region | A region that provides the broadest range of capabilities with high-growth capacity needs and meets in-country data residency requirements. |
| auxiliary/alternate region | An alternate region that provides proactive support around disaster recovery, meets in-country data residency, and provides an additional location to improve latency . |
| foundational service | A core Azure service that is available in all regions when the region is generally available. |
| mainstream service | An Azure service that is available in all recommended regions within one year of the region/service general availability or demand-driven availability in auxiliary/alternate regions. |
| specialized service | An Azure service that is demand-driven availability across regions backed by customized/specialized hardware. |

## Regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to. Azure’s approach on availability of Azure services across regions is best described in two ways – recommended regions and auxiliary/alternate regions.

### Recommended regions

A recommended region is a region that provides the broadest range of capabilities, which include the following:

- High-growth capacity needs
- Meet in-country data residency requirements
- Designed to support Availability Zones now or in the future

The Azure services available in recommended regions enable you to perform cloud operations at an optimal level. The services are grouped in three categories – Foundational, Mainstream, and Specialized services. 

- Foundational – available in all regions when the region is generally available. When unavailable, Microsoft is working on region-specific improvements to deploy across all regions. 
- Mainstream – available in all Recommended regions within one year of the region/service general availability. When unavailable, Microsoft is working on region-specific improvements to deploy across all recommended regions. 
- Specialized – demand-driven availability across regions backed by customized/specialized hardware, with many already deployed into a large subset of Recommended regions. 

Availability Zones are currently/planned to be available in most recommended regions. The hardware Availability Zone deployments are the following:
- Foundational VM and Disk types: generally are available in all zones
- Mainstream VM and Disk types: generally are available in two or more zones in regions with zones; additional demand and capacity drives third Zone deployment
- Specialized VM and Disk types: generally are available in one Zone in regions with zones; additional demand and capacity drives second and third Zone deployments

### Auxiliary/alternate regions

An auxiliary/alternate region is a region that provides essential capabilities, which include the following:

- Proactive support around disaster recovery
- Meet in-country data residency
- Additional location to improve latency 
- Not designed to support Availability Zones

The Azure services available in auxiliary/alternate regions support your business needs around disaster recovery, data residency, and improving latency. There are three categories of Azure services.

- Foundational – available in all regions when the region is generally available. When unavailable, Microsoft is working on region-specific improvements to deploy across all regions. 
- Mainstream – demand-driven availability in Auxiliary/alternate regions; not targeted at parity. 
- Specialized – demand-driven availability across regions backed by customized/specialized hardware; not targeted at parity. 

### Comparing region types

| Region type | Non-regional services | Foundational services | Mainstream services | Specialized services | Availability Zones | Data residency |
| --- | --- | --- | --- | --- | --- | --- |
| Recommenced | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | :heavy_check_mark: | :heavy_check_mark: |
| Auxiliary/alternate | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | Demand-driven | N/A | :heavy_check_mark: |

For more information, see the [Services](#services) section later in this article.

## Availability Zones

Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical separation of Availability Zones within a region protects applications and data from datacenter failures. Zone-redundant services replicate your applications and data across Availability Zones to protect from single-points-of-failure. With Availability Zones, Azure offers industry best 99.99% VM uptime SLA. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

An Availability Zone in an Azure region is a combination of a fault domain and an update domain. For example, if you create three or more VMs across three zones in an Azure region, your VMs are effectively distributed across three fault domains and three update domains. The Azure platform recognizes this distribution across update domains to make sure that VMs in different zones are not updated at the same time.

Build high-availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones. Azure services that support Availability Zones fall into two categories:

- **Zonal services** – you pin the resource to a specific zone (for example, virtual machines, managed disks, Standard IP addresses), or
- **Zone-redundant services** – platform replicates automatically across zones (for example, zone-redundant storage, SQL Database).

To achieve comprehensive business continuity on Azure, build your application architecture using the combination of Availability Zones with Azure region pairs. You can synchronously replicate your applications and data using Availability Zones within an Azure region for high-availability and asynchronously replicate across Azure regions for disaster recovery protection.
 
![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

> [!IMPORTANT]
> The Availability Zone identifiers (the numbers 1, 2 and 3 in the picture above) are logically mapped to the actual physical zones for each subscription independently. That means that Availability Zone 1 in a given subscription might refer to a different physical zone than Availability Zone 1 in a different subscription. As a consequence, it's recommended to not rely on Availability Zone IDs across different subscriptions for virtual machine placement.

### Pricing for VMs in Availability Zones

There is no additional cost for virtual machines deployed in an Availability Zone. 99.99% VM uptime SLA is offered when two or more VMs are deployed across two or more Availability Zones within an Azure region. There will be additional inter-Availability Zone VM-to-VM data transfer charges. For more information, review the [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) page.

### Get started with Availability Zones

- [Create a virtual machine](../virtual-machines/windows/create-portal-availability-zone.md)
- [Add a Managed Disk using PowerShell](../virtual-machines/windows/attach-disk-ps.md#add-an-empty-data-disk-to-a-virtual-machine)
- [Create a zone redundant virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
- [Load balance VMs across zones using a Standard Load Balancer with a zone-redundant frontend](../load-balancer/load-balancer-standard-public-zone-redundant-cli.md)
- [Load balance VMs within a zone using a Standard Load Balancer with a zonal frontend](../load-balancer/load-balancer-standard-public-zonal-cli.md)
- [Zone-redundant storage](../storage/common/storage-redundancy-zrs.md)
- [SQL Database](../sql-database/sql-database-high-availability.md#zone-redundant-configuration)
- [Event Hubs geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md#availability-zones)
- [Service Bus geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md#availability-zones)
- [Create a zone-redundant virtual network gateway](../vpn-gateway/create-zone-redundant-vnet-gateway.md)
- [Add zone redundant region for Azure Cosmos DB](../cosmos-db/high-availability.md#availability-zone-support)
- [Getting Started Azure Cache for Redis Availability Zones](https://aka.ms/redis/az/getstarted)
- [Create an Azure Active Directory Domain Services instance](../active-directory-domain-services/tutorial-create-instance.md)
- [Create an Azure Kubernetes Service (AKS) cluster that uses Availability Zones](../aks/availability-zones.md)

## Services

You can choose one or more regions to use based on availability of Azure services and capabilities. If a service is not available in a in a specific region or you are interested in additional regions, you can provide feedback by contacting your Microsoft sales representative.

### Services support by region

The combinations of Azure services and regions that support Availability Zones are:


|                                 |Americas |              |           |           | Europe |              |          |              | Asia Pacific |                 |
|----------------------------|----------|----------|---------|---------|--------------|------------|--------|----------|----------|-------------|
|          |Central US|East US|East US 2|West US 2|France Central|North Europe|UK South|West Europe|Japan East|Southeast Asia|
| **Compute**                         |            |              |           |           |                |              |          |             |            |                |
| Linux Virtual Machines          | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Windows Virtual Machines        | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Virtual Machine Scale Sets      | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Azure App Service Environments ILB | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Azure Kubernetes Service        | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| **Storage**   |            |              |           |           |                |              |          |             |            |                |
| Managed Disks                   | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Zone-redundant Storage          | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| **Networking**                     |            |              |           |           |                |              |          |             |            |                |
| Standard IP Address        | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| Standard Load Balancer     | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;   | &#10003;       |
| VPN Gateway            | &#10003;   |  &#10003;    | &#10003;  | &#10003;  | &#10003;       | &#10003;     |  &#10003;  | &#10003;    |  &#10003;   | &#10003;       |
| ExpressRoute Gateway   | &#10003;   |  &#10003;    | &#10003;  | &#10003;  | &#10003;       | &#10003;     |  &#10003;  | &#10003;    |  &#10003;   | &#10003;       |
| Application Gateway(V2)    | &#10003;   |  &#10003;    | &#10003;  | &#10003;  | &#10003;       | &#10003;     |  &#10003;  | &#10003;    |  &#10003;   | &#10003;       |
| Azure Firewall           | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    |  &#10003;       | &#10003;       |
| **Databases**                     |            |              |           |           |                |              |          |             |            |                |
| Azure Data Explorer                   | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003;        | &#10003;       |
| SQL Database                    | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    | &#10003; (Preview)      | &#10003;       |
| Azure Cache for Redis           | &#10003;   | &#10003;     | &#10003;  | &#10003;  | &#10003;       | &#10003;     | &#10003; | &#10003;    |  &#10003;       | &#10003;       |
| Azure Cosmos DB                    | &#10003;   |  &#10003;  |  &#10003; | &#10003; |       |     | &#10003; |  &#10003;   |            | &#10003;       |
| **Analytics**                       |            |              |           |           |                |              |          |             |            |                |
| Event Hubs                      | &#10003;   |   &#10003; | &#10003;  | &#10003;  | &#10003; | &#10003; | &#10003; | &#10003; | &#10003; | &#10003;       |
| **Integration**                     |            |              |           |           |                |              |          |             |            |                |
| Service Bus (Premium Tier Only) | &#10003;   |  &#10003;  | &#10003;  | &#10003;  | &#10003;  | &#10003;     |&#10003;   | &#10003;    |&#10003;      | &#10003;       |
| Event Grid | &#10003;   |  &#10003;  | &#10003;  | &#10003;  | &#10003;  | &#10003;     |&#10003;   | &#10003;    |&#10003;      | &#10003;       |
| **Identity**                     |            |              |           |           |                |              |          |             |            |                |
| Azure AD Domain Services | &#10003;   |  &#10003;  | &#10003;  | &#10003;  | &#10003;  | &#10003;     |&#10003;   | &#10003;    |&#10003;      | &#10003;       |

###  Services resiliency

All Azure management services are architected to be resilient from region-level failures. In the spectrum of failures, one or more Availability Zone failures within a region have a smaller failure radius compared to an entire region failure. Azure can recover from a zone-level failure of management services within the region or from another Azure region. Azure performs critical maintenance one zone at a time within a region, to prevent any failures impacting customer resources deployed across Availability Zones within a region.

### Service categories

Azure classifies services into three categories: foundational, mainstream, and specialized. 

#### Foundational services

- Application Gateway
- Azure Cosmos DB
- Azure Load Balancer
- Azure Load Balance: Standard
- Azure Resource Manager
- Azure SQL
- Azure SQL: Managed Instance
- Azure Service Manager (RDFE)
- Backup
- Event Hubs
- ExpressRoute
- ExpressRoute : ExpressRoute Gateways
- Key Vault
- Key Vault: Premium
- Service Bus
- Service Bus: Premium
- Service Fabric
- Storage
- Storage: Azure Data Lake Storage Gen2
- Storage: Disk Storage
- Storage: Hot/Cool Blob Storage Tiers
- Storage: Managed Disks
- Storage: Queues
- Storage: Tables
- VPN Gateway	Virtual Machine Scale Sets
- Virtual Machines
- Virtual Machines: A0 - A7
- Virtual Machines: Av2-Series
- Virtual Machines: B-Series
- Virtual Machines: D-Series
- Virtual Machines: DS-Series
- Virtual Machines: DSv2-Series
- Virtual Machines: DSv3-Series
- Virtual Machines: Dv2-Series
- Virtual Machines: Dv3-Series
- Virtual Machines: ESv3-Series
- Virtual Machines: Ev3-Series
- Virtual Machines: F-Series
- Virtual Machines: FS-Series
- Virtual Machines Instance Level IPs
- Virtual Machines: Reserved IP
- Virtual Network
- Virtual Network: Global Vnet Peering
- Virtual Network: Public IP Address Basic
- Virtual Network: Public IP Address Standard

### Mainstream services

- Management
- App Service
- App Service: App Service Environments
- Application Gateway : Application Gateway v2
- Automation
- Azure Active Directory
- Azure Active Directory : Premium P1
- Azure Active Directory : Premium P2
- Azure Active Directory B2C
- Azure Active Directory Domain Services
- Azure Advanced Threat Protection
- Azure Advisor
- Azure Analysis Services
- Azure Bastion
- Azure Bot Service
- Azure DDoS Protection Standard
- Azure DNS
- Azure DNS: Azure DNS private zones
- Azure Data Box: Data Box
- Azure Data Box: Data Box Disk
- Azure Data Box: Data Box Edge
- Azure Data Box: Data Box Gateway
- Azure Data Explorer
- Azure Data Share
- Azure Data Share: Snapshot Execution
- Azure Database Migration Service
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Azure Databricks
- Azure DevOps
- Azure DevTest Labs
- Azure Firewall
- Azure Front Door
- Azure HPC Cache
- Azure Information Protection
- Azure Information Protection: Free
- Azure Information Protection : Premium P1
- Azure Information Protection : Premium P2
- Azure Kubernetes Service (AKS)
- Azure Lighthouse
- Azure LockBox
- Azure Managed Applications
- Azure Maps
- Azure Migrate
- Azure Monitor
- Azure Monitor : Application Insights
- Azure Monitor : Log Analytics
- Azure Open Datasets
- Azure Policy
- Azure Private Link
- Azure Red Hat OpenShift (ARO)
- Azure Resource Graph
- Azure Search
- Azure Search: Cognitive Search
- Azure Security for IoT
- Azure Sentinel
- Azure SignalR Service
- Azure Signup Portal
- Azure Stack
- Azure Synapse Analytics
- Azure Web Application Firewall
- Azure Web Application Firewall: Azure Web Application Firewall – Regional v2
- Azure for Education
- Batch
- Cloud Shell
- Cognitive Services
- Cognitive Services: Computer Vision
- Cognitive Services: Content Moderator
- Cognitive Services: Face
- Cognitive Services: Language Understanding
- Cognitive Services: Personalizer
- Cognitive Services: QnA Maker
- Cognitive Services: Speech Services
- Cognitive Services: Text Analytics
- Cognitive Services: Translator Text
- Container Instances
- Container Registry
- Content Delivery Network
- Cost Management
- Data Factory
- Data Factory: Azure Integration Runtime
- Data Factory: SSIS Integration Runtime
- Dynamics 365 Customer Engagement
- Dynamics 365 Customer Service
- Dynamics 365 Field Service
- Dynamics 365 Sales
- Event Grid
- Functions
- Functions: Consumption Plan Linux
- Functions: Premium Plan
- Functions: Premium Plan Linux
- Guest Configuration
- HDInsight
- HDInsight: Enterprise Security Package
- Intune
- IoT Hub
- IoT Hub: IoT Hub Device Provisioning Service
- Logic Apps
- Machine Learning Service
- Media Services
- Microsoft Azure portal
- Microsoft Cloud App Security
- Microsoft Graph
- Microsoft Managed Desktop
- Microsoft Stream
- Multi-Factor Authentication
- Network Watcher
- Network Watcher: Traffic Analytics
- Notification Hubs
- Power Apps
- Power Automate
- Power BI
- Redis Cache
- Security Center
- Site Recovery
- Storage: Archive Storage
- Storage: Azure File Sync
- Storage: Azure Premium Files
- Storage: Azure Storage Reservations
- Storage: Import/Export
- Storage: Premium Block Blobs
- Storage: Ultra Disk Storage
- Stream Analytics
- Traffic Manager
- Virtual Machines: Azure Dedicated Host
- Virtual Machines: Fsv2-Series
- Virtual Machines: M-Series
- Virtual Machines: Serial Console
- Virtual Machines: Software Plan
- Virtual WAN
- Virtual WAN: ExpressRoute
- Virtual WAN: Point-to-site VPN Gateway
- Virtual WAN: Site-to-Site VPN Gateway
- Windows Virtual Desktop

### Specialized services

- AI builder
- Azure API for FHIR
- Azure Container Service
- Azure Data Box: Data Box Heavy
- Azure Data Lake Storage Gen1
- Azure Database for MariaDB
- Azure Dedicated HSM
- Azure Dev Spaces
- Azure Lab Services
- Azure NetApp Files
- Chat for Dynamics 365
- Cognitive Services: Bing Autosuggest
- Cognitive Services: Bing Custom Search
- Cognitive Services: Bing Entity Search
- Cognitive Services: Bing Image Search
- Cognitive Services: Bing News Search
- Cognitive Services: Bing Speech
- Cognitive Services: Bing Spell Check
- Cognitive Services: Bing Video Search
- Cognitive Services: Bing Visual Search
- Cognitive Services: Bing Web Search
- Cognitive Services: Custom Vision
- Cognitive Services: Translator Speech
- Data Catalog
- Data Factory: Data Factory V1
- Data Lake Analytics
- Dynamics 365 AI Customer Insights
- Dynamics 365 Business Central
- Dynamics 365 Customer Service Insights
- Dynamics 365 Finance
- Dynamics 365 Fraud Protection
- Dynamics 365 Guides
- Dynamics 365 Human Resources
- Dynamics 365 Marketing
- Dynamics 365 Portals
- Dynamics 365 Project Service Automation
- Dynamics 365 Retail
- Dynamics 365 Sales Insights
- Dynamics 365 Supply Chain Management
- Dynamics 365 Talent Attract & Onboard
- HockeyApp
- IoT Central
- Machine Learning Studio
- Media Services: Video Indexer
- Microsoft Defender Advanced Threat Protection
- Microsoft Defender Advanced Threat	Protection: Microsoft Defender non-E5
- Microsoft Forms Pro
- Microsoft Genomics
- Microsoft Healthcare Bot
- Power Virtual Agents
- StorSimple
- Time Series Insights
- VMWare by CloudSimple
- Virtual Machines: A8 - A11 (Compute Intensive)
- Virtual Machines: DASv4-Series
- Virtual Machines: DAv4-Series
- Virtual Machines: EASv4-Series
- Virtual Machines: EAv4-Series
- Virtual Machines: G-Series
- Virtual Machines: GS-Series
- Virtual Machines: H-Series
- Virtual Machines: HBv1-Series
- Virtual Machines: HBv2-Series
- Virtual Machines: HCv1-Series
- Virtual Machines: LS-Series
- Virtual Machines: LSv2-Series
- Virtual Machines: Mv2 SKL-series
- Virtual Machines: NC-Series
- Virtual Machines: NCv2-Series
- Virtual Machines: NCv3-Series
- Virtual Machines: ND-Series
- Virtual Machines: NV-Series
- Virtual Machines: NVv3-Series
- Virtual Machines: SAP HANA on Azure Large Instances
- Visual Studio App Center
- Windows 10 IoT Core Services

## Next steps

- [Quickstart templates](https://aka.ms/azqs)
