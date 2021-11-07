---
title: Azure services
description: Learn about Region types and service categories in Azure.
author: prsandhu
ms.service: azure
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: prsandhu
ms.reviewer: cynthn
ms.custom: references_regions
---

# Azure services

Availability of services across Azure regions depends on a region's type. There are two types of regions in Azure: *recommended* and *alternate*.

- **Recommended**: These regions provide the broadest range of service capabilities and currently support availability zones. Designated in the Azure portal as **Recommended**.
- **Alternate**: These regions extend Azure's footprint within a data residency boundary where a recommended region currently exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs but don't support availability zones. Azure conducts regular assessments of alternate regions to determine if they should become recommended regions. Designated in the Azure portal as **Other**.

## Service categories across region types

Azure services are grouped into three categories: *foundational*, *mainstream*, and *strategic*. Azure's general policy on deploying services into any given region is primarily driven by region type, service categories, and customer demand.

- **Foundational**: Available in all recommended and alternate regions when the region is generally available, or within 90 days of a new foundational service becoming generally available.
- **Mainstream**: Available in all recommended regions within 90 days of the region general availability. Demand-driven in alternate regions, and many are already deployed into a large subset of alternate regions.
- **Strategic** (previously Specialized): Targeted service offerings, often industry-focused or backed by customized hardware. Demand-driven availability across regions, and many are already deployed into a large subset of recommended regions.

To see which services are deployed in a region and the future roadmap for preview or general availability of services in a region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

If a service offering isn't available in a region, contact your Microsoft sales representative for more information and to explore options.

| Region type | Non-regional | Foundational | Mainstream | Strategic | Availability zones | Data residency |
| --- | --- | --- | --- | --- | --- | --- |
| Recommended | **Y** | **Y** | **Y** | Demand-driven | **Y** | **Y** |
| Alternate | **Y** | **Y** | Demand-driven | Demand-driven | N/A | **Y** |

## Available services by category

Azure assigns service categories as foundational, mainstream, and strategic at general availability. Typically, services start as a strategic service and are upgraded to mainstream and foundational as demand and use grow.

Azure services are presented in the following tables by category. Note that some services are non-regional. That means they're available globally regardless of region. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational                           | ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream                                        | 
> |----------------------------------------|---------------------------------------------------|
> | Azure storage accounts                 | Azure API Management                              | 
> | Azure Application Gateway              | Azure App Configuration                           | 
> | Azure Backup                           | Azure App Service                                 | 
> | Azure Cosmos DB                        | Azure Automation                                  | 
> | Azure Data Lake Storage Gen2           | Azure Active Directory Domain Services            | 
> | Azure ExpressRoute                     | Azure Bastion                                     | 
> | Azure public IP                        | Azure Cache for Redis                             | 
> | Azure SQL Database                     | Azure Cognitive Services                          | 
> | Azure SQL Managed Instance             | Azure Cognitive Services: Computer Vision         | 
> | Disk storage                           | Azure Cognitive Services: Content Moderator       | 
> | Azure Event Hubs                       | Azure Cognitive Services: Face                    | 
> | Azure Key Vault                        | Azure Cognitive Services: Text Analytics          | 
> | Azure Load Balancer                    | Azure Data Explorer                               | 
> | Azure Service Bus                      | Azure Database for MySQL                          | 
> | Azure Service Fabric                   | Azure Database for PostgreSQL                     | 
> | Azure Storage: Hot/cool Blob Storage tiers   | Azure DDoS Protection                       | 
> | Storage: Managed Disks                 | Azure Firewall                                    | 
> | Azure Virtual Machine Scale Sets       | Azure Firewall Manager                            | 
> | Azure Virtual Machines                 | Azure Functions                                   | 
> | Virtual Machines: Azure Dedicated Host | Azure IoT Hub                                     | 
> | Virtual Machines: Av2-series           | Azure Kubernetes Service (AKS)                    | 
> | Virtual Machines: Bs-series            | Azure Monitor: Application Insights               | 
> | Virtual Machines: DSv2-series          | Azure Monitor: Log Analytics                      | 
> | Virtual Machines: DSv3-series          | Azure Private Link                                | 
> | Virtual Machines: Dv2-series           | Azure Site Recovery                               | 
> | Virtual Machines: Dv3-series           | Azure Synapse Analytics                           |     
> | Virtual Machines: ESv3-series          | Azure Batch                                       | 
> | Virtual Machines: Ev3-series           | Azure Cloud Service: M-series                     | 
> | Azure Virtual Network                  | Azure Container Instances                         | 
> | Azure VPN Gateway                      | Azure Container Registry                          | 
> |                                        | Azure Data Factory                                | 
> |                                        | Azure Event Grid                                  | 
> |                                        | Azure HDInsight                                   |  
> |                                        | Azure Logic Apps                                  | 
> |                                        | Azure Media Services                              | 
> |                                        | Azure Network Watcher                             | 
> |                                        | Premium Blob Storage                              | 
> |                                        | Premium Files Storage                             | 
> |                                        | Virtual Machines: Ddsv4-series                    | 
> |                                        | Virtual Machines: Ddv4-series                     | 
> |                                        | Virtual Machines: Dsv4-series                     | 
> |                                        | Virtual Machines: Dv4-series                      | 
> |                                        | Virtual Machines: Edsv4-series                    | 
> |                                        | Virtual Machines: Edv4-series                     | 
> |                                        | Virtual Machines: Esv4-series                     | 
> |                                        | Virtual Machines: Ev4-series                      | 
> |                                        | Virtual Machines: Fsv2-series                     | 
> |                                        | Virtual Machines: M-series                        | 
> |                                        | Azure Virtual WAN                                 | 

### Strategic Services
As mentioned previously, Azure classifies services into three categories: foundational, mainstream, and strategic. Service categories are assigned at general availability. Often, services start their lifecycle as a strategic service and as demand and utilization increases may be promoted to mainstream or foundational. The following table lists strategic services. 

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic                                          |
> |------------------------------------------------------|
> | Azure API for FHIR                                   |
> | Azure Analysis Services                              |
> | Azure Blockchain Service                             |
> | Azure Cognitive Services: Anomaly Detector           |
> | Azure Cognitive Services: Custom Vision              |
> | Azure Cognitive Services: Form Recognizer            |
> | Azure Cognitive Services: Immersive Reader           |
> | Azure Cognitive Services: Language Understanding     |
> | Azure Cognitive Services: Personalizer               |
> | Azure Cognitive Services: QnA Maker                  |
> | Azure Cognitive Services: Speech Services            |
> | Azure Data Share                                     |
> | Azure Databricks                                     |
> | Azure Database for MariaDB                           |
> | Azure Database Migration Service                     |
> | Azure Dedicated HSM                                  |
> | Azure Digital Twins                                  |
> | Azure Health Bot                                     |
> | Azure HPC Cache                                      |
> | Azure Lab Services                                   |
> | Azure NetApp Files                                   |
> | Azure Red Hat OpenShift                              |
> | Azure SignalR Service                                |
> | Azure Spring Cloud                                   |
> | Azure Stream Analytics                               |
> | Azure Time Series Insights                           |
> | Azure VMware Solution                                |
> | Azure VMware Solution by CloudSimple                 |
> | Azure Spatial Anchors                                |
> | Storage: Archive Storage                             |
> | Azure Ultra Disk Storage                             |
> | Video Indexer                                        |
> | Virtual Machines: DASv4-series                       |
> | Virtual Machines: DAv4-series                        |
> | Virtual Machines: DCsv2-series                       |
> | Virtual Machines: EASv4-series                       |
> | Virtual Machines: EAv4-series                        |
> | Virtual Machines: HBv1-series                        |
> | Virtual Machines: HBv2-series                        |
> | Virtual Machines: HCv1-series                        |
> | Virtual Machines: H-series                           |
> | Virtual Machines: LSv2-series                        |
> | Virtual Machines: Mv2-series                         |
> | Virtual Machines: NCv3-series                        |
> | Virtual Machines: NDv2-series                        |
> | Virtual Machines: NVv3-series                        |
> | Virtual Machines: NVv4-series                        | 
> | Virtual Machines: SAP HANA on Azure Large Instances  |

\*VMs that support availability zones: AV2-series, B-series, DSv2-series, DSv3-series, Dv2-series, Dv3-series, ESv3-series, Ev3-series, F-series, FS-series, FSv2-series, and M-series.\*

Older generations of services or virtual machines aren't listed. For more information, see [Previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).

To learn more about preview services that aren't yet in general availability and to see a listing of these services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). For a complete listing of services that support availability zones, see [Azure services that support availability zones](az-region.md).

## Next steps

- [Azure services that support availability zones](az-region.md)
- [Regions and availability zones in Azure](az-overview.md)
