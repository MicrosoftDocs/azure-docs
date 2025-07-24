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

To improve the reliability of your solution, it's a good practice to enable availability zone support on your Azure resources. Most services require that you follow certain procedures in order to enable availability zone support on an existing resource. In the list below, you'll find guides to support availability zones on many Azure services. These guides provide detailed information such as prerequisites for migration, expected downtime, important migration considerations, and recommendations.


## Azure services migration guides


- [Azure API Management](./reliability-api-management.md#availability-zone-support)
- [Azure App Configuration](migrate-app-configuration.md)
- [Azure App Service](reliability-app-service.md#configure-availability-zone-support)
- [Azure App Service Environment](reliability-app-service-environment.md#configure-availability-zone-support)
- [Azure Application Gateway (V2)](migrate-app-gateway-v2.md)
- [Azure Backup and Azure Site Recovery](migrate-recovery-services-vault.md)
- [Azure Batch](reliability-batch.md#availability-zone-migration)
- [Azure Cache for Redis](migrate-cache-redis.md)
- [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-migration)
- [Azure Container Instances](./reliability-containers.md#availability-zone-redeployment-and-migration)
- [Azure Container Registry](./reliability-container-registry.md#configure-availability-zone-support)
- [Azure Cosmos DB](./reliability-cosmos-db-nosql.md#migrate-to-availability-zone-support)
- [Azure Database for MySQL - Flexible Server](migrate-database-mysql-flex.md)
- [Azure Database for PostgreSQL](./reliability-postgresql-flexible-server.md#availability-zone-redeployment-and-migration)
- [Azure Elastic SAN](reliability-elastic-san.md#availability-zone-migration)
- [Azure ExpressRoute](/azure/expressroute/expressroute-howto-gateway-migration-portal)
- [Azure Functions](reliability-functions.md#availability-zone-migration)
- [Azure HDInsight](reliability-hdinsight.md#availability-zone-migration)
- [Azure Kubernetes Service](/azure/aks/availability-zones?toc=/azure/reliability)
- [Azure Load Balancer](migrate-load-balancer.md)
- [Azure Logic Apps](./reliability-logic-apps.md#configure-availability-zone-support)
- [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md)
- [Azure Service Bus](/azure/service-bus-messaging/service-bus-outages-disasters#availability-zones)
- [Azure Service Fabric](migrate-service-fabric.md)
- [Azure SQL Database](migrate-sql-database.md)
- [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-zone-redundancy-configure)
- [Azure Storage account: Blob Storage, Azure Data Lake Storage, Files Storage](migrate-storage.md)
- [Azure Storage: Managed Disks](migrate-vm.md)
- [Azure Virtual Machines and Azure Virtual Machine Scale Sets](migrate-vm.md)




## Related resources
- [Azure reliability guides](overview-reliability-guidance.md)
- [Azure services with availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)
- [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones)
