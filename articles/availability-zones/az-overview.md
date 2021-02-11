---
title: Regions and Availability Zones in Azure
description: Learn about regions and Availability Zones in Azure to meet your technical and regulatory requirements.
author: prsandhu
ms.service: azure
ms.topic: conceptual
ms.date: 01/26/2021
ms.author: prsandhu
ms.reviewer: cynthn
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
| regional service | An Azure service that is deployed regionally and enables the customer to specify the region into which the service will be deployed. For a complete list, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all). |
| non-regional service | An Azure service for which there is no dependency on a specific Azure region. Non-regional services are deployed to two or more regions and if there is a regional failure, the instance of the service in another region continues servicing customers. For a complete list, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all). |

## Regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to, including across multiple regions to deliver cross-region resiliency. For more information, see [Overview of the resiliency pillar](/azure/architecture/framework/resiliency/overview).

## Availability Zones

An Availability Zone is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical separation of Availability Zones within a region protects applications and data from datacenter failures. Zone-redundant services replicate your applications and data across Availability Zones to protect from single-points-of-failure. With Availability Zones, Azure offers industry best 99.99% VM uptime SLA. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

An Availability Zone in an Azure region is a combination of a fault domain and an update domain. For example, if you create three or more VMs across three zones in an Azure region, your VMs are effectively distributed across three fault domains and three update domains. The Azure platform recognizes this distribution across update domains to make sure that VMs in different zones are not scheduled to be updated at the same time.

Build high-availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones. Azure services that support Availability Zones fall into two categories:

- **Zonal services** – where a resource is pinned to a specific zone (for example, virtual machines, managed disks, Standard IP addresses), or
- **Zone-redundant services** – when the Azure platform replicates automatically across zones (for example, zone-redundant storage, SQL Database).

To achieve comprehensive business continuity on Azure, build your application architecture using the combination of Availability Zones with Azure region pairs. You can synchronously replicate your applications and data using Availability Zones within an Azure region for high-availability and asynchronously replicate across Azure regions for disaster recovery protection.
 
![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

> [!IMPORTANT]
> The Availability Zone identifiers (the numbers 1, 2 and 3 in the picture above) are logically mapped to the actual physical zones for each subscription independently. That means that Availability Zone 1 in a given subscription might refer to a different physical zone than Availability Zone 1 in a different subscription. As a consequence, it's recommended to not rely on Availability Zone IDs across different subscriptions for virtual machine placement.

## Region and service categories

Azure's approach on availability of Azure services across regions is best described by expressing services made available in recommended regions and alternate regions.

- **Recommended region** - A region that provides the broadest range of service capabilities and is designed to support Availability Zones now, or in the future. These are designated in the Azure portal as **Recommended**.
- **Alternate (other) region** - A region that extends Azure's footprint within a data residency boundary where a recommended region also exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs. They are not designed to support Availability Zones (although Azure conducts regular assessment of these regions to determine if they should become recommended regions). These are designated in the Azure portal as **Other**.

### Comparing region types

Azure services are grouped into three categories: foundational, mainstream, and specialized services. Azure's general policy on deploying services into any given region is primarily driven by region type, service categories, and customer demand:

- **Foundational** – Available in all recommended and alternate regions when the region is generally available, or within 12 months of a new foundational service becoming generally available.
- **Mainstream** – Available in all recommended regions within 12 months of the region/service general availability; demand-driven in alternate regions (many are already deployed into a large subset of alternate regions).
- **Specialized** – Targeted service offerings, often industry-focused or backed by customized/specialized hardware. Demand-driven availability across regions (many are already deployed into a large subset of recommended regions).

To see which services are deployed in a given region, as well as the future roadmap for preview or general availability of services in a region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all).

If a service offering is not available in a specific region, you can share your interest by contacting your Microsoft sales representative.

| Region type | Non-regional | Foundational | Mainstream | Specialized | Availability Zones | Data residency |
| --- | --- | --- | --- | --- | --- | --- |
| Recommended | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | :heavy_check_mark: | :heavy_check_mark: |
| Alternate | :heavy_check_mark: | :heavy_check_mark: | Demand-driven | Demand-driven | N/A | :heavy_check_mark: |

### Services by category

As mentioned previously, Azure classifies services into three categories: foundational, mainstream, and specialized. Service categories are assigned at general availability. Often, services start their lifecycle as a specialized service and as demand and utilization increases may be promoted to mainstream or foundational. The following table lists the category for services as foundational, mainstream, or specialized. You should note the following about the table:

- Some services are non-regional. For information and a list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).
- Older generation virtual machines are not listed. For more information, see documentation at [Previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md)
- .Services are not assigned a category until General Availability (GA). For information, and a list of preview services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). 

> [!div class="mx-tableFixed"]
> | Foundational                          | Mainstream                                        | Specialized                                          |
> |---------------------------------------|---------------------------------------------------|------------------------------------------------------|
> | Storage Accounts                      | API Management                                    | Azure API for FHIR                                   |
> | Application Gateway                   | App Configuration                                 | Azure Analysis Services                              |
> | Azure Backup                          | App Service                                       | Azure Cognitive Services: Anomaly Detector           |
> | Azure Cosmos DB                       | Automation                                        | Azure Cognitive Services: Custom Vision              |
> | Azure Data Lake Storage Gen2          | Azure Active Directory Domain Services            | Azure Cognitive Services: Form Recognizer            |
> | Azure ExpressRoute                    | Azure Bastion                                     | Azure Cognitive Services: Personalizer               |
> | Azure Public IP                       | Azure Cache for Redis                             | Azure Cognitive Services: QnA Maker                  |
> | Azure SQL Database                    | Azure Cognitive Search                            | Azure Database for MariaDB                           |
> | Azure SQL : Managed Instance          | Azure Cognitive Services                          | Azure Database Migration Service                     |
> | Cloud Services                        | Azure Cognitive Services: Computer Vision         | Azure Dedicated HSM                                  |
> | Cloud Services: Av2-Series            | Azure Cognitive Services: Content Moderator       | Azure Digital Twins                                  |
> | Cloud Services: Dv2-Series            | Azure Cognitive Services: Face                    | Azure Health Bot                                     |
> | Cloud Services: Dv3-Series            | Azure Cognitive Services: Immersive Reader        | Azure HPC Cache                                      |
> | Cloud Services: Ev3-Series            | Azure Cognitive Services: Language Understanding  | Azure Lab Services                                   |
> | Cloud Services: Instance Level IPs    | Azure Cognitive Services: Speech Services         | Azure NetApp Files                                   |
> | Cloud Services: Reserved IP           | Azure Cognitive Services: Text Analytics          | Azure SignalR Service                                |
> | Disk Storage                          | Azure Cognitive Services: Translator              | Azure Spring Cloud Service                           |
> | Event Hubs                            | Azure Data Explorer                               | Azure Time Series Insights                           |
> | Key Vault                             | Azure Data Share                                  | Azure VMware Solution                                |
> | Load balancer                         | Azure Database for MySQL                          | Azure VMware Solution by CloudSimple                 |
> | Service Bus                           | Azure Database for PostgreSQL                     | Cloud Services: H-Series                             |
> | Service Fabric                        | Azure Databricks                                  | Data Catalog                                         |
> | Storage: Hot/Cool Blob Storage Tiers  | Azure DDoS Protection                             | Data Lake Analytics                                  |
> | Storage: Managed Disks                | Azure DevTest Labs                                | Azure Machine Learning Studio (classic)              |
> | Virtual Machine Scale Sets            | Azure Firewall                                    | Spatial Anchors                                      |
> | Virtual Machines                      | Azure Firewall Manager                            | Storage: Archive Storage                             |
> | Virtual Machines: Av2-Series          | Azure Functions                                   | StorSimple                                           |
> | Virtual Machines: Bs-Series           | Azure IoT Hub                                     | Ultra Disk Storage                                   |
> | Virtual Machines: DSv2-Series         | Azure Kubernetes Service (AKS)                    | Video Indexer                                        |
> | Virtual Machines: DSv3-Series         | Azure Machine Learning                            | Virtual Machines: DASv4-Series                       |
> | Virtual Machines: Dv2-Series          | Azure Monitor: Application Insights               | Virtual Machines: DAv4-Series                        |
> | Virtual Machines: Dv3-Series          | Azure Monitor: Log Analytics                      | Virtual Machines: DCsv2-series                       |
> | Virtual Machines: ESv3-Series         | Azure Private Link                                | Virtual Machines: EASv4-Series                       |
> | Virtual Machines: Ev3-Series          | Azure Red Hat OpenShift                           | Virtual Machines: EAv4-Series                        |
> | Virtual Machines: Instance Level IPs  | Azure Site Recovery                               | Virtual Machines: HBv1-Series                        |
> | Virtual Machines: Reserved IP         | Azure Stream Analytics                            | Virtual Machines: HBv2-Series                        |
> | Virtual Network                       | Azure Synapse Analytics                           | Virtual Machines: HCv1-Series                        |
> | VPN Gateway                           | Batch                                             | Virtual Machines: H-Series                           |
> |                                       | Cloud Services: M-series                          | Virtual Machines: LSv2-Series                        |
> |                                       | Container Instances                               | Virtual Machines: Mv2-Series                         |
> |                                       | Container Registry                                | Virtual Machines: NCv3-Series                        |
> |                                       | Data Factory                                      | Virtual Machines: NDv2-Series                        |
> |                                       | Event Grid                                        | Virtual Machines: NVv3-Series                        |
> |                                       | HDInsight                                         | Virtual Machines: NVv4-Series                        |> 
> |                                       | Logic Apps                                        | Virtual Machines: SAP HANA on Azure Large Instances  |
> |                                       | Media Services                                    |                                                      |
> |                                       | Network Watcher                                   |                                                      |
> |                                       | Notification Hubs                                 |                                                      |
> |                                       | Premium Blob Storage                              |                                                      |
> |                                       | Premium Files Storage                             |                                                      |
> |                                       | Virtual Machines: Ddsv4-Series                    |                                                      |
> |                                       | Virtual Machines: Ddv4-Series                     |                                                      |
> |                                       | Virtual Machines: Dsv4-Series                     |                                                      |
> |                                       | Virtual Machines: Dv4-Series                      |                                                      |
> |                                       | Virtual Machines: Edsv4-Series                    |                                                      |
> |                                       | Virtual Machines: Edv4-Series                     |                                                      |
> |                                       | Virtual Machines: Esv4-Series                     |                                                      |
> |                                       | Virtual Machines: Ev4-Series                      |                                                      |
> |                                       | Virtual Machines: Fsv2-Series                     |                                                      |
> |                                       | Virtual Machines: M-Series                        |                                                      |
> |                                       | Virtual WAN                                       |                                                      |


## Next steps

- [Regions that support Availability Zones in Azure](az-region.md)
- [Quickstart templates](https://aka.ms/azqs)
