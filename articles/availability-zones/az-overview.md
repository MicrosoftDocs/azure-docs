---
title: Regions and Availability Zones in Azure
description: Learn about regions and Availability Zones in Azure to meet your technical and regulatory requirements.
author: cynthn
ms.service: azure
ms.topic: article
ms.date: 04/27/2020
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
| geography | An area of the world containing at least one Azure region. Geographies define a discrete market that preserve data residency and compliance boundaries. Geographies allow customers with specific data-residency and compliance needs to keep their data and applications close. Geographies are fault-tolerant to withstand complete region failure through their connection to our dedicated high-capacity networking infrastructure. |
| Availability Zone | Unique physical locations within a region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. |
| recommended region | A region that provides the broadest range of service capabilities and is designed to support Availability Zones now, or in the future. These are designated in the Azure portal as **Recommended**. |
| alternate (other) region | A region that extends Azure's footprint within a data residency boundary where a recommended region also exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs. They are not designed to support Availability Zones (although Azure conducts regular assessment of these regions to determine if they should become recommended regions). These are designated in the Azure portal as **Other**. |
| foundational service | A core Azure service that is available in all regions when the region is generally available. |
| mainstream service | An Azure service that is available in all recommended regions within 12 months of the region/service general availability or demand-driven availability in alternate regions. |
| specialized service | An Azure service that is demand-driven availability across regions backed by customized/specialized hardware. |

## Regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to, including across multiple regions to deliver cross-region resiliency. For more information, see [Overview of the resiliency pillar](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview).

## Availability Zones

Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical separation of Availability Zones within a region protects applications and data from datacenter failures. Zone-redundant services replicate your applications and data across Availability Zones to protect from single-points-of-failure. With Availability Zones, Azure offers industry best 99.99% VM uptime SLA. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

An Availability Zone in an Azure region is a combination of a fault domain and an update domain. For example, if you create three or more VMs across three zones in an Azure region, your VMs are effectively distributed across three fault domains and three update domains. The Azure platform recognizes this distribution across update domains to make sure that VMs in different zones are not updated at the same time.

Build high-availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones. Azure services that support Availability Zones fall into two categories:

- **Zonal services** – where a resource is pinned to a specific zone (for example, virtual machines, managed disks, Standard IP addresses), or
- **Zone-redundant services** – when the Azure platform replicates automatically across zones (for example, zone-redundant storage, SQL Database).

To achieve comprehensive business continuity on Azure, build your application architecture using the combination of Availability Zones with Azure region pairs. You can synchronously replicate your applications and data using Availability Zones within an Azure region for high-availability and asynchronously replicate across Azure regions for disaster recovery protection.
 
![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

> [!IMPORTANT]
> The Availability Zone identifiers (the numbers 1, 2 and 3 in the picture above) are logically mapped to the actual physical zones for each subscription independently. That means that Availability Zone 1 in a given subscription might refer to a different physical zone than Availability Zone 1 in a different subscription. As a consequence, it's recommended to not rely on Availability Zone IDs across different subscriptions for virtual machine placement.

## Region and service categories

Azure's approach on availability of Azure services across regions is best described in two ways – recommended regions and alternate regions.

- **Recommended region** - A region that provides the broadest range of service capabilities and is designed to support Availability Zones now, or in the future. These are designated in the Azure portal as **Recommended**.
- **Alternate (other) region** - A region that extends Azure's footprint within a data residency boundary where a recommended region also exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs. They are not designed to support Availability Zones (although Azure conducts regular assessment of these regions to determine if they should become recommended regions). These are designated in the Azure portal as **Other**.

### Comparing region types

The Azure services available in each region are grouped in three categories: foundational, mainstream, and specialized services. Azure's general policy on deploying services into region types is dependent on customer demand, region type, and service categories:

- **Foundational** – Available in all recommended and alternate regions when the region is generally available, or within 12 months of a new foundational service becoming generally available.
- **Mainstream** – Available in all recommended regions within 12 months of the region/service general availability; demand-driven in alternate regions (many are already deployed into a large subset of alternate regions).
- **Specialized** – Targeted service offerings, often industry-focused or backed by customized/specialized hardware. Demand-driven availability across regions (many are already deployed into a large subset of recommended regions).

To see which services are deployed in a given region, as well as the future roadmap for preview or general availability of services in a region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all)

If a service offering is not available in a specific region, you can share your interest by contacting your Microsoft sales representative.

| Region type | Non-regional | Foundational | Mainstream | Specialized | Availability Zones | Data residency |
| --- | --- | --- | --- | --- | --- | --- |
| Recommended | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | :heavy_check_mark: | :heavy_check_mark: |
| Alternate | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | Demand-driven | N/A | :heavy_check_mark: |

### Service categories

Azure classifies services into three categories: foundational, mainstream, and specialized. The services in this section are public services that are regional only. For information about non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). This section excludes older generation virtual machines documented at [Previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).

> [!div class="mx-tableFixed"]
> | Foundational | Mainstream | Specialized |
> | --- | --- | --- |
> | Application Gateway | API Management | Azure API for FHIR |
> | Azure Cosmos DB | App Service; App Service Linux(?) | Azure Blockchain Service |
> | Load balancer | Automation | Azure Blueprints |
> | Azure SQL Database | Azure Active Directory Domain Services | Data Box Heavy |
> | Manager | Azure Analysis Services | Azure Database for MariaDB |
> | Azure Backup | App Configuration | Azure Dedicated HSM |
> | Cloud Services | Azure Arc | Azure Dev Spaces |
> | Cloud Services : A0 - A7 | Azure Bastion | Azure Digital Twins |
> | Cloud Services : Av2-Series | Azure Data Explorer | Azure Lab Services |
> | Cloud Services : D-Series | Azure Data Share | Azure NetApp Files |
> | Cloud Services : Dv2-Series | Snapshot Execution | Azure Quantum |
> | Cloud Services : Dv3-Series | Azure Database for MySQL | Remote Rendering |
> | Cloud Services : Ev3-Series | Azure Database for PostgreSQL | Spatial Anchors |
> | Cloud Services : Instance Level IPs | Azure Database Migration Service | Cloud Services : A8 - A11 (Compute Intensive) |
> | Cloud Services : Reserved IP | Azure Databricks | Cloud Services : G-Series |
> | Cloud Services: G- Series | Azure DDoS Protection  | Cloud Services : H-Series |
> | Cloud Services: M-Series | Azure DevTest Labs | Cognitive Services : Anomaly Detector |
> | Cloud Services: H- Series | Azure Firewall | Cognitive Services : Custom Vision |
> | Cloud Service: Lsv2- Series | Azure Firewall Manager | Cognitive Services : Speaker Recognition |
> | Event Hubs | Azure HPC Cache | Data Catalog |
> | Azure ExpressRoute | Azure Internet Analyzer | Data Factory : Data Factory V1 |
> | Key Vault | Azure Kubernetes Service (AKS) | Data Lake Alytics |
> | Service Bus | Azure Private Link | Machine Learning Studio |
> | Service Fabric | Azure Red Hat OpenShift  | Video Indexer |
> | Account Storage | Azure Cognitive Search | Microsoft Genomics |
> | Azure Data Lake Storage Gen2 | Azure SignalR Service | StorSimple |
> | Disk Storage | Azure Spring Cloud Service | Azure Time Series Insights |
> | Virtual Machine Scale Sets | Azure Stack Hub | Virtual Machines : A8 - A11 (Compute Intensive) |
> | Virtual Machines | Azure Synapse Analytics | Virtual Machines : DASv4-Series |
> | Virtual Machines : A0 - A7 | Batch | Virtual Machines : DAv4-Series |
> | Virtual Machines : Instance Level IPs | Cloud Services: M-series | Virtual Machines : DCsv2-series |
> | Virtual Machines: Av2-Series | Cognitive Services | Virtual Machines : EASv4-Series |
> | Virtual Machines: Bs-Series | Cognitive Services: Computer Vision | Virtual Machines : EAv4-Series |
> | Virtual Machines: D-Series | Cognitive Services: Content Moderator | Virtual Machines : G-Series |
> | Virtual Machines : DS-Series | Cognitive Services: Face | Virtual Machines : GS-Series |
> | Virtual Machines: DSv2-Series | Cognitive Services : Form Recognizer (In Preview) | Virtual Machines : HBv1-Series |
> | Virtual Machines: DSv3-Series | Cognitive Services : Immersive Reader (In Preview) | Virtual Machines : HBv2-Series |
> | Virtual Machines: Dv2-Series | Cognitive Services: Language Understanding | Virtual Machines : HCv1-Series |
> | Virtual Machines: Dv3-Series | Cognitive Services: Personalizer | Virtual Machines : H-Series |
> | Virtual Machines: ESv3-Series | Cognitive Services: QnA Maker | Virtual Machines : LS-Series |
> | Virtual Machines: Ev3-Series | Cognitive Services: Speech Services | Virtual Machines : LSv2-Series |
> | Virtual Machines: F-Series | Container Instances | Virtual Machines : Mv2 -series |
> | Virtual Machines: FS-Series | Container Registry | Virtual Machines : NC-Series |
> | Virtual Machines: Reserved IP | Data Factory | Virtual Machines : NCv2-Series |
> | Virtual Network | Data Factory: Azure Integration Runtime | Virtual Machines : NCv3-Series |
> | VPN Gateway | Data Factory: SSIS Integration Runtime | Virtual Machines : NDs-Series |
> |  | Event Grid | Virtual Machines : NDv2-Series |
> |  | Azure Functions | Virtual Machines : NV-Series |
> |  | Functions : Consumption Plan | Virtual Machines : NVv3-Series |
> |  | Functions : Consumption Plan Linux | Virtual Machines : NVv4-Series |
> |  | Functions : Premium Plan | Virtual Machines : SAP HANA on Azure Large Instances |
> |  | Functions : Premium Plan Linux | Visual Studio App Center |
> |  | HDInsight | Azure VMware Solution by CloudSimple |
> |  | Azure IoT Hub |  |
> |  | IoT Hub: IoT Hub Device Provisioning Service |  |
> |  | Logic Apps |  |
> |  | Azure Machine Learning |  |
> |  | Media Services |  |
> |  | Azure Stream Analytics |  |
> |  | Network Watcher |  |
> |  | Notification Hubs |  |
> |  | Power BI Embedded |  |
> |  | Azure Cache for Redis |  |
> |  | Azure Site Recovery |  |
> |  | Storage: Archive Storage |  |
> |  | Premium Files Storage |  |
> |  | Premium Blob Storage |  |
> |  | Ultra Disk Storage |  |
> |  | Azure Stream Analytics |  |
> |  | Virtual Machines: Fsv2-Series |  |
> |  | Virtual Machines: M-Series |  |
> |  | Virtual WAN |  |
> |  | Visual Studio Online |  |

###  Services resiliency

All Azure management services are architected to be resilient from region-level failures. In the spectrum of failures, one or more Availability Zone failures within a region have a smaller failure radius compared to an entire region failure. Azure can recover from a zone-level failure of management services within the region or from another Azure region. Azure performs critical maintenance one zone at a time within a region, to prevent any failures impacting customer resources deployed across Availability Zones within a region.

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

## Next steps

- [Regions that support Availability Zones in Azure](az-region.md)
- [Quickstart templates](https://aka.ms/azqs)
