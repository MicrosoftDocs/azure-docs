---
title: Availability zone migration guidance overview for Microsoft Azure products and services
description: Availability zone migration guidance overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 02/27/2025
ms.author: anaharris
ms.custom: subject-reliability
---

# Availability zone migration guidance overview

Azure services that once didn't support availability zones are often upgraded to provide that support for their resources. However, most services require that you follow certain procedures in order to move a resource from non-availability zone support to availability support. In the list below, you'll find migration guides for Azure services that have been updated to support availability zones. These guides provide detailed information such as prerequisites for migration, download requirements, important migration considerations, and recommendations.


## Azure services migration guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| **Products**  | 
| --- | 
| [Azure API Management](migrate-api-mgt.md)|
| [Azure App Configuration](migrate-app-configuration.md)|
| [Azure App Service](reliability-app-service.md#configure-availability-zone-support)|
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) |
| [Azure Backup and Azure Site Recovery](migrate-recovery-services-vault.md)  | 
| [Azure Batch](reliability-batch.md#availability-zone-migration)|
| [Azure Cache for Redis](migrate-cache-redis.md)|
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-migration)|
| [Azure Container Instances](./reliability-containers.md#availability-zone-redeployment-and-migration)|
| [Azure Container Registry](/azure/container-registry/zone-redundancy?toc=/azure/reliability) |
| [Azure Cosmos DB](./reliability-cosmos-db-nosql.md#migrate-to-availability-zone-support) |
| [Azure Database for MySQL - Flexible Server](migrate-database-mysql-flex.md)|
| [Azure Database for PostgreSQL](./reliability-postgresql-flexible-server.md#availability-zone-redeployment-and-migration)|
| [Azure Elastic SAN](reliability-elastic-san.md#availability-zone-migration)|
| [Azure ExpressRoute](/azure/expressroute/expressroute-howto-gateway-migration-portal) |
| [Azure Functions](reliability-functions.md#availability-zone-migration)|
| [Azure HDInsight](reliability-hdinsight.md#availability-zone-migration)|
| [Azure Kubernetes Service](/azure/aks/availability-zones?toc=/azure/reliability)|
| [Azure Load Balancer](migrate-load-balancer.md)|
| [Azure Logic Apps](./reliability-logic-apps.md#configure-availability-zone-support)|
| [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md)|
| [Azure Service Bus](/azure/service-bus-messaging/service-bus-outages-disasters#availability-zones)|
| [Azure Service Fabric](migrate-service-fabric.md)  | 
| [Azure SQL Database](migrate-sql-database.md) |
| [Azure SQL Managed Instance](migrate-sql-managed-instance.md)|
| [Azure Storage account: Blob Storage, Azure Data Lake Storage, Files Storage](migrate-storage.md) |
| [Azure Storage: Managed Disks](migrate-vm.md)|
| [Azure Virtual Machines and Azure Virtual Machine Scale Sets](migrate-vm.md)|  

\*VMs that support availability zones: AV2-series, B-series, DSv2-series, DSv3-series, Dv2-series, Dv3-series, ESv3-series, Ev3-series, F-series, FS-series, FSv2-series, and M-series.


## Workload and general guidance
| **Workloads**   | 
| --- | 
| [Azure Kubernetes Service (AKS) and MySQL Flexible Server](migrate-workload-aks-mysql.md)|

## Related resources

- [Azure services with availability zones](availability-zones-service-support.md)
- [Azure regions with availability zones](availability-zones-region-support.md)
- [Availability of service by category](availability-service-by-category.md)
- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)
- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
