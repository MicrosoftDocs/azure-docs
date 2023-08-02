---
title: Available Azure services by region types and categories 
description: Learn about region types and service categories in Azure.
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 08/18/2022
ms.author: anaharris
ms.custom: references_regions
---

# Available services by region types and categories 

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

## Available services by region category

Azure assigns service categories as foundational, mainstream, and strategic at general availability. Typically, services start as a strategic service and are upgraded to mainstream and foundational as demand and use grow.

Azure services are presented in the following tables by category. Note that some services are non-regional. That means they're available globally regardless of region. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational                           | ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream                                  | 
> |----------------------------------------|---------------------------------------------------|
> | Azure Application Gateway              | Azure API Management                              | 
> | Azure Backup                           | Azure App Configuration                           | 
> | Azure Cosmos DB                        | Azure App Service                                 | 
> | Azure Event Hubs                       | Azure Active Directory Domain Services            | 
> | Azure ExpressRoute                     | Azure Bastion                                     |
> | Azure Key Vault                        | Azure Batch                                       | 
> | Azure Load Balancer                    | Azure Cache for Redis                             | 
> | Azure Public IP                        | Azure Cognitive Search                            | 
> | Azure Service Bus                      | Azure Container Registry                          | 
> | Azure Service Fabric                   | Azure Container Instances                         |
> | Azure Site Recovery                    | Azure Data Explorer                               |  
> | Azure SQL                              | Azure Data Factory                                | 
> | Azure Storage: Disk Storage            | Azure Database for MySQL                          | 
> | Azure Storage Accounts                 | Azure Database for PostgreSQL                     | 
> | Azure Storage: Blob Storage            | Azure DDoS Protection                             | 
> | Azure Storage Data Lake Storage        | Azure Event Grid                                  | 
> | Azure Virtual Machines                 | Azure Firewall                                    | 
> | Azure Virtual Machine Scale Sets       | Azure Firewall Manager                            |
> | Virtual Machines: Av2-series           | Azure Functions                                   |
> | Virtual Machines: Bs-series            | Azure HDInsight                                   |   
> | Virtual Machines: Dv2 and DSv2-series  | Azure IoT Hub                                     | 
> | Virtual Machines: Dv3 and DSv3-series  | Azure Kubernetes Service (AKS)                    | 
> | Virtual Machines: ESv3 abd ESv3-series | Azure Logic Apps                                  | 
> | Azure Virtual Network                  | Azure Media Services                              | 
> | Azure VPN Gateway                      | Azure Monitor: Application Insights               | 
> |                                        | Azure Monitor: Log Analytics                      | 
> |                                        | Azure Network Watcher                             | 
> |                                        | Azure Private Link                                |  
> |                                        | Azure Storage: Files Storage                      |
> |                                        | Azure Virtual WAN                                 | 
> |                                        | Premium Blob Storage                              |  
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

### Strategic services
As mentioned previously, Azure classifies services into three categories: foundational, mainstream, and strategic. Service categories are assigned at general availability. Often, services start their lifecycle as a strategic service and as demand and utilization increases may be promoted to mainstream or foundational. The following table lists strategic services. 

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic                                          |
> |------------------------------------------------------|
> | Azure API for FHIR                                   |
> | Azure Analysis Services                              |
> | Azure AI services                            |
> | Azure Automation                                     |
> | Azure AI services                             |
> | Azure Data Share                                     |
> | Azure Databricks                                     |
> | Azure Database for MariaDB                           |
> | Azure Database Migration Service                     |
> | Azure Dedicated HSM                                  |
> | Azure Digital Twins                                  |
> | Azure HPC Cache                                      |
> | Azure Lab Services                                   |
> | Azure Machine Learning                               |
> | Azure Managed Instance for Apache Cassandra          |
> | Azure NetApp Files                                   |
> | Microsoft Purview                                        |
> | Azure Red Hat OpenShift                              |
> | Azure Remote Rendering                               |
> | Azure SignalR Service                                |
> | Azure Spatial Anchors                                |
> | Azure Spring Cloud                                   |
> | Azure Storage: Archive Storage                       |
> | Azure Synapse Analytics                              |
> | Azure Ultra Disk Storage                             |
> | Azure VMware Solution                                |
> | Microsoft Azure Attestation                          |
> | SQL Server Stretch Database                          |
> | Virtual Machines: DAv4 and DASv4-series              |
> | Virtual Machines: Dasv5 and Dadsv5-series            |
> | Virtual Machines: DCsv2-series                       |
> | Virtual Machines: Ddv5 and Ddsv5-series              |
> | Virtual Machines: Dv5 and Dsv5-series                |
> | Virtual Machines: Eav4 and Easv4-series              |
> | Virtual Machines: Easv5 and Eadsv5-series            |
> | Virtual Machines: Edv5 and Edsv5-series              |
> | Virtual Machines: Ev5 and Esv5-series                |
> | Virtual Machines: FX-series                          |
> | Virtual Machines: HBv2-series                        |
> | Virtual Machines: HBv3-series                        |
> | Virtual Machines: HCv1-series                        |
> | Virtual Machines: LSv2-series                        |
> | Virtual Machines: Mv2-series                         |
> | Virtual Machines: NCv3-series                        |
> | Virtual Machines: NCasT4 v3-series                   |
> | Virtual Machines: NDasr A100 v4-Series               |
> | Virtual Machines: NDm A100 v4-Series                 |
> | Virtual Machines: NDv2-series                        |
> | Virtual Machines: NP-series                          |
> | Virtual Machines: NVv3-series                        |
> | Virtual Machines: NVv4-series                        | 
> | Virtual Machines: SAP HANA on Azure Large Instances  |

Older generations of services or virtual machines aren't listed. For more information, see [Previous generations of virtual machine sizes](../virtual-machines/sizes-previous-gen.md).

To learn more about preview services that aren't yet in general availability and to see a listing of these services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). For a complete listing of services that support availability zones, see [Azure services that support availability zones](availability-zones-service-support.md).

## Next steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
