---
title: Available Azure services by region types and categories 
description: Learn about region types and service categories in Azure.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 06/13/2024
ms.author: anaharris
ms.custom: references_regions, subject-reliability
---

# Available services by region types and categories 

Availability of services across Azure regions depends on a region's type. There are two types of regions in Azure: *recommended* and *alternate*.

- **Recommended**: These regions provide the broadest range of service capabilities and currently support availability zones. Designated in the Azure portal as **Recommended**.
- **Alternate**: These regions extend Azure's footprint within a data residency boundary where a recommended region currently exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs but don't support availability zones. Azure conducts regular assessments of alternate regions to determine if they should become recommended regions. Designated in the Azure portal as **Other**.

## Service categories across region types
 
[!INCLUDE [Service categories across region types](../../includes/service-categories/service-category-definitions.md)]

## Available services by region category

Azure assigns service categories as foundational, mainstream, and strategic at general availability. Typically, services start as a strategic service and are upgraded to mainstream and foundational as demand and use grow.

Azure services are presented in the following tables by category. Note that some services are non-regional. That means they're available globally regardless of region. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational                           | ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream                                  |
> |----------------------------------------|-------------------------------------|
> | Azure Application Gateway              | Azure AI Search                     |
> | Azure Backup                           | Azure API Management                |
> | Azure Cosmos DB for NoSQL              | Azure App Configuration             |
> | Azure Event Hubs                       | Azure App Service                   |
> | Azure ExpressRoute                     | Azure Bastion                       |
> | Azure Key Vault                        | Azure Batch                         |
> | Azure Load Balancer                    | Azure Cache for Redis               |
> | Azure NAT Gateway                      | Azure Container Instances           |
> | Azure Public IP                        | Azure Container Registry            |
> | Azure Service Bus                      | Azure Data Explorer                 |
> | Azure Service Fabric                   | Azure Data Factory                  |
> | Azure Site Recovery                    | Azure Database for MySQL            |
> | Azure SQL                              | Azure Database for PostgreSQL       |
> | Azure Storage Accounts                 | Azure DDoS Protection               |
> | Azure Storage Data Lake Storage        | Azure Event Grid                    |
> | Azure Storage: Blob Storage            | Azure Firewall                      |
> | Azure Storage: Disk Storage            | Azure Firewall Manager              |
> | Azure Virtual Machine Scale Sets       | Azure Functions                     |
> | Azure Virtual Machines                 | Azure HDInsight                     |
> | Azure Virtual Network                  | Azure IoT Hub                       |
> | Azure VPN Gateway                      | Azure Kubernetes Service (AKS)      |
> | Virtual Machines: Av2-series           | Azure Logic Apps                    |
> | Virtual Machines: Bs-series            | Azure Media Services                |
> | Virtual Machines: Dv2 and DSv2-series  | Azure Monitor: Application Insights |
> | Virtual Machines: Dv3 and DSv3-series  | Azure Monitor: Log Analytics        |
> | Virtual Machines: ESv3 and ESv3-series | Azure Network Watcher               |
> |                                        | Azure Private Link                  |
> |                                        | Azure Storage: Files Storage        |
> |                                        | Azure Storage: Premium Blob Storage |
> |                                        | Azure Virtual WAN                   |
> |                                        | Microsoft Entra Domain Services     |
> |                                        | Virtual Machines: Ddsv4-series      |
> |                                        | Virtual Machines: Ddv4-series       |
> |                                        | Virtual Machines: Dsv4-series       |
> |                                        | Virtual Machines: Dv4-series        |
> |                                        | Virtual Machines: Edsv4-series      |
> |                                        | Virtual Machines: Edv4-series       |
> |                                        | Virtual Machines: Esv4-series       |
> |                                        | Virtual Machines: Ev4-series        |
> |                                        | Virtual Machines: Fsv2-series       |
> |                                        | Virtual Machines: M-series          |

### Strategic services
As mentioned previously, Azure classifies services into three categories: foundational, mainstream, and strategic. Service categories are assigned at general availability. Often, services start their lifecycle as a strategic service and as demand and utilization increases may be promoted to mainstream or foundational. The following table lists strategic services. 

> [!div class="mx-tableFixed"]
> | ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic       |
> |----------------------------------------|
> | Azure AI services                                    |
> | Azure Analysis Services                              |
> | Azure API for FHIR                                   |
> | Azure Automation                                     |
> | Azure Container Apps                                 |
> | Azure Data Share                                     |
> | Azure Database for MariaDB                           |
> | Azure Database Migration Service                     |
> | Azure Databricks                                     |
> | Azure Dedicated HSM                                  |
> | Azure Digital Twins                                  |
> | Azure HPC Cache                                      |
> | Azure Lab Services                                   |
> | Azure Machine Learning                               |
> | Azure Managed HSM                                    |
> | Azure Managed Instance for Apache Cassandra          |
> | Azure NetApp Files                                   |
> | Azure Red Hat OpenShift                              |
> | Azure Remote Rendering                               |
> | Azure SignalR Service                                |
> | Azure Spring Apps                                    |
> | Azure Storage: Archive Storage                       |
> | Azure Synapse Analytics                              |
> | Azure Ultra Disk Storage                             |
> | Azure VMware Solution                                |
> | Microsoft Azure Attestation                          |
> | Microsoft Purview                                    |
> | SQL Server Stretch Database                          |
> | Virtual Machines: Dasv5 and Dadsv5-series            |
> | Virtual Machines: DAv4 and DASv4-series              |
> | Virtual Machines: DCsv2-series                       |
> | Virtual Machines: Ddv5 and Ddsv5-series              |
> | Virtual Machines: Dv5 and Dsv5-series                |
> | Virtual Machines: Easv5 and Eadsv5-series            |
> | Virtual Machines: Eav4 and Easv4-series              |
> | Virtual Machines: Edv5 and Edsv5-series              |
> | Virtual Machines: Ev5 and Esv5-series                |
> | Virtual Machines: FX-series                          |
> | Virtual Machines: HBv2-series                        |
> | Virtual Machines: HBv3-series                        |
> | Virtual Machines: HCv1-series                        |
> | Virtual Machines: LSv2-series                        |
> | Virtual Machines: LSv3-series                        |
> | Virtual Machines: Mv2-series                         |
> | Virtual Machines: NCasT4 v3-series                   |
> | Virtual Machines: NCv3-series                        |
> | Virtual Machines: NDasr A100 v4-Series               |
> | Virtual Machines: NDm A100 v4-Series                 |
> | Virtual Machines: NDv2-series                        |
> | Virtual Machines: NP-series                          |
> | Virtual Machines: NVv3-series                        |
> | Virtual Machines: NVv4-series                        |
> | Virtual Machines: SAP HANA on Azure Large Instances  |


Older generations of services or virtual machines aren't listed. For more information, see [Previous generations of virtual machine sizes](/azure/virtual-machines/sizes-previous-gen).

To learn more about preview services that aren't yet in general availability and to see a listing of these services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). For a complete listing of services that support availability zones, see [Azure services that support availability zones](availability-zones-service-support.md).

## Next steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
