---
title: Available Azure services by region types and categories 
description: Learn about region types and service categories in Azure.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 04/11/2025
ms.author: anaharris
ms.custom: subject-reliability
---

# Available services by region types and categories 

Availability of services across Azure regions depends on a region's type. There are two types of regions in Azure: *recommended* and *alternate*.

- **Recommended** regions provide the broadest range of service capabilities and currently support availability zones. In the Azure portal, recommended regions are designated as **Recommended**.
- **Alternate** regions extend Azure's footprint within a data residency boundary where a recommended region currently exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs but don't support availability zones. Azure conducts regular assessments of alternate regions to determine if they should become recommended regions. In the Azure portal, alternate regions are designated   as **Other**.

## Service categories across region types
 
[!INCLUDE [Service categories across region types](../../includes/service-categories/service-category-definitions.md)]

## Available services by region category

Azure assigns service categories as foundational, mainstream, and strategic at general availability. Typically, services start as a strategic service and are upgraded to mainstream and foundational as demand and use grow.

Azure services are presented in the following lists by category. Note that some services are non-regional, which means that they're available globally regardless of region. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

## ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services
- Azure Application Gateway
- Azure Backup
- Azure Cosmos DB for NoSQL
- Azure Event Hubs
- Azure ExpressRoute
- Azure Key Vault
- Azure Kubernetes Service (AKS)
- Azure Load Balancer
- Azure NAT Gateway
- Azure Public IP
- Azure Service Bus
- Azure Service Fabric
- Azure Site Recovery
- Azure SQL Database
- Azure SQL Managed Instance
- Azure Storage Accounts
- Azure Storage Data Lake Storage
- Azure Storage: Blob Storage
- Azure Storage: Disk Storage
- Azure Virtual Machine Scale Sets
- Azure Virtual Machines
- Azure Virtual Network
- Azure VPN Gateway
- Virtual Machines: Av2-series
- Virtual Machines: Bs-series
- Virtual Machines: Ddv5 and Ddsv5-series
- Virtual Machines: Dv2 and DSv2-series
- Virtual Machines: Dv3 and DSv3-series
- Virtual Machines: Dv5 and DSv5-series
- Virtual Machines: Edv5 and Edsv5-series
- Virtual Machines: Ev3 and Esv3-series
- Virtual Machines: Ev5 and Esv5-series

## ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services 

- Azure AI Search
- Azure API Management
- Azure App Configuration
- Azure App Service
- Azure Bastion
- Azure Batch
- Azure Cache for Redis
- Azure Container Instances
- Azure Container Registry
- Azure Data Explorer
- Azure Data Factory
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Azure DDoS Protection
- Azure DNS Private Resolver
- Azure Event Grid
- Azure Firewall
- Azure Firewall Manager
- Azure Functions
- Azure HDInsight
- Azure IoT Hub
- Azure Logic Apps
- Azure Media Services
- Azure Monitor: Application Insights
- Azure Monitor: Log Analytics
- Azure Network Watcher
- Azure Private Link
- Azure Storage: Files Storage
- Azure Storage: Premium Blob Storage
- Azure Virtual WAN
- Microsoft Entra Domain Services
- Virtual Machines: Ddsv4-series
- Virtual Machines: Ddv4-series
- Virtual Machines: Dsv4-series
- Virtual Machines: Dv4-series
- Virtual Machines: Edsv4-series
- Virtual Machines: Edv4-series
- Virtual Machines: Esv4-series
- Virtual Machines: Ev4-series
- Virtual Machines: Fsv2-series
- Virtual Machines: M-series

### ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic services

- Azure AI services
- Azure Analysis Services
- Azure API for FHIR
- Azure Automation
- Azure Container Apps
- Azure Data Share
- Azure Database for MariaDB
- Azure Database Migration Service
- Azure Databricks
- Azure Dedicated HSM
- Azure Digital Twins
- Azure HPC Cache
- Azure Kubernetes Fleet Manager
- Azure Lab Services
- Azure Machine Learning
- Azure Managed HSM
- Azure Managed Instance for Apache Cassandra
- Azure NetApp Files
- Azure Red Hat OpenShift
- Azure Remote Rendering
- Azure SignalR Service
- Azure Storage: Archive Storage
- Azure Storage: Azure File Sync
- Azure Synapse Analytics
- Azure Ultra Disk Storage
- Azure VMware Solution
- Microsoft Azure Attestation
- Microsoft Purview
- SQL Server on Azure Virtual Machines
- SQL Server Stretch Database
- Virtual Machines: Bsv2-series
- Virtual Machines: Dasv5 and Dadsv5-series
- Virtual Machines: Dav4 and Dasv4-series
- Virtual Machines: DCsv2-series
- Virtual Machines: Easv5 and Eadsv5-series
- Virtual Machines: Eav4 and Easv4-series
- Virtual Machines: FX-series
- Virtual Machines: HBv2-series
- Virtual Machines: HBv3-series
- Virtual Machines: HCv1-series
- Virtual Machines: Lsv2-series
- Virtual Machines: Lsv3-series
- Virtual Machines: Lsv4, Lasv4, and Laosv4-series
- Virtual Machines: Mv2-series
- Virtual Machines: NCasT4_v3-series
- Virtual Machines: NCv3-series
- Virtual Machines: NDasrA100_v4-Series
- Virtual Machines: NDm_A100_v4-Series
- Virtual Machines: NDv2-series
- Virtual Machines: NP-series
- Virtual Machines: NVv3-series
- Virtual Machines: NVv4-series
- Virtual Machines: SAP HANA on Azure Large Instances

Older generations of services or virtual machines aren't listed. For more information, see [Previous generations of virtual machine sizes](/azure/virtual-machines/sizes-previous-gen).

To learn more about preview services that aren't yet in general availability and to see a listing of these services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). For a complete listing of services that support availability zones, see [Azure services that support availability zones](availability-zones-service-support.md).

## Related content

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
