---
title: Multi-Region Solutions in Nonpaired Regions
description: Learn about how to create multi-region solutions even when the regions aren't paired. See Azure services and configurations for multi-region solutions.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 08/12/2025
ms.author: anaharris
ms.custom:
  - subject-reliability
  - build-2025
---

# Multi-region solutions in nonpaired regions

Although some Azure services support geo-redundancy and geo-replication by using paired regions, you can create solutions that support multiple regions [even when those regions aren't paired](./regions-paired.md). This article lists some of the services and possible configurations for multi-region solutions that don't require paired regions. To learn more about each Azure service and how it supports reliability, see the [Azure service reliability guides](./overview-reliability-guidance.md).

## Azure AI Search

To learn about how to create multi-region solutions using Azure AI Search, see [Reliability in AI Search](./reliability-ai-search.md).

## Azure API Management

To learn about how to create multi-region solutions by using Azure API Management, see [Reliability in API Management](./reliability-api-management.md).

## Azure App Service

To learn about how to create multi-region solutions by using Azure App Service, see [Reliability in App Service](./reliability-app-service.md).

## Azure Blob Storage

To learn about how to create multi-region solutions using Azure Blob Storage, see [Reliability in Blob Storage](./reliability-storage-blob.md).

## Azure Cache for Redis

Azure Cache for Redis provides two distinct cross-region replication options: [active geo-replication](/azure/azure-cache-for-redis/cache-how-to-active-geo-replication) and [passive geo-replication](/azure/azure-cache-for-redis/cache-how-to-geo-replication). Neither option explicitly depends on region pairs.

## Azure Container Registry

To learn about how to create multi-region solutions by using Azure Container Registry, see [Reliability in Container Registry](./reliability-container-registry.md).

## Azure Cosmos DB

If your solution requires continuous uptime during region outages, you can configure Azure Cosmos DB to replicate your data across [multiple regions](/azure/cosmos-db/how-to-manage-database-account#add-remove-regions-from-your-database-account) and to transparently fail over to operating regions when required. Azure Cosmos DB supports [multi-region writes](/azure/cosmos-db/multi-region-writes) and can distribute your data globally to provide low-latency access to your data from any region without any pairing restrictions.

## Azure Database for MySQL

Choose any [Azure Database for MySQL available Azure regions](/azure/mysql/flexible-server/overview#azure-regions) to create your [read replicas](/azure/mysql/flexible-server/concepts-read-replicas#cross-region-replication).

## Azure Database for PostgreSQL

For geo-replication in nonpaired regions with Azure Database for PostgreSQL, you can use a managed service that supports geo-replication. The Azure Database for PostgreSQL managed service supports active [geo-replication](/azure/postgresql/flexible-server/concepts-read-replicas) to create a continuously readable secondary replica of your primary server. The readable secondary replica might be in the same Azure region as the primary server or, more commonly, in a different region. This kind of readable secondary replica is also known as *geo-replica*.
 
You can also use either of the following customer-managed data migration methods to replicate data to a nonpaired region: 

- [Dump and restore](/azure/postgresql/migrate/how-to-migrate-using-dump-and-restore)
- [Logical replication and logical decoding](/azure/postgresql/flexible-server/concepts-logical)

## Azure Data Factory

To learn about how to create multi-region solutions by using Azure Data Factory, see [Reliability in Azure Data Factory](./reliability-data-factory.md).

## Azure Event Grid

For geo-replication of Azure Event Grid topics in nonpaired regions, you can implement [client-side failover](/azure/event-grid/custom-disaster-recovery-client-side).

## Azure IoT Hub 

To learn about how to create multi-region solutions by using Azure IoT Hub, see [Reliability in IoT Hub](./reliability-iot-hub.md).

## Azure Kubernetes Service (AKS)

To learn about how to create multi-region solutions by using Azure Kubernetes Service (AKS), see [Reliability in AKS](./reliability-aks.md).

## Azure Monitor Logs

Log Analytics workspaces in Azure Monitor Logs don't use paired regions. To ensure business continuity and protect against data loss, enable cross-region workspace replication.

For more information, see [Enhance resilience by replicating your Log Analytics workspace across regions](/azure/azure-monitor/logs/workspace-replication).

## Azure Queue Storage

To learn about how to create multi-region solutions by using Azure Queue Storage, see [Reliability in Queue Storage](./reliability-storage-queue.md).

## Azure Service Bus 

Azure Service Bus can provide regional resiliency, without a dependency on region pairs, by using either [geo-replication](/azure/service-bus-messaging/service-bus-geo-replication) or [geo-disaster recovery](/azure/service-bus-messaging/service-bus-geo-dr) features.

## Azure SQL Database

For geo-replication in nonpaired regions with Azure SQL Database, you can use the following features:

- The [failover group feature](/azure/azure-sql/database/failover-group-sql-db?view=azuresql&preserve-view=true), which replicates across any combination of Azure regions without any dependency on underlying geo-redundant storage.

- The [active geo-replication feature](/azure/azure-sql/database/active-geo-replication-overview?view=azuresql&preserve-view=true) to create a continuously synchronized, readable secondary database for a primary database. The readable secondary database might be in the same Azure region as the primary database or, more commonly, in a different region. This kind of readable secondary database is also known as a *geo-secondary* or *geo-replica*.

## Azure SQL Managed Instance 

For geo-replication in nonpaired regions with Azure SQL Managed Instance, you can use the following feature:

- The [failover group feature](/azure/azure-sql/managed-instance/failover-group-sql-mi?view=azuresql&preserve-view=true), which replicates across any combination of Azure regions without any dependency on underlying geo-redundant storage.

## Azure Storage

To achieve geo-replication in nonpaired regions:

- **For object storage:** To learn about how to create multi-region solutions by using Blob Storage, see [Reliability in Blob Storage](./reliability-storage-blob.md).

- **For Azure NetApp Files:**
   
   - You can replicate to a set of nonstandard pairs besides Azure region pairs. For more information, see [Reliability in Azure NetApp Files](reliability-netapp-files.md).

- **For Azure Files:**

    - To copy your files to another storage account in a different region, use the following tools.

        -  [AzCopy](../storage/common/storage-use-azcopy-blobs-copy.md)
        -  [Azure PowerShell](/powershell/module/az.storage/?view=azps-12.0.0&preserve-view=true) 
        -  [Data Factory](/azure/data-factory/connector-azure-blob-storage?tabs=data-factory) 
         
        For a sample script, see [Sync between two Azure file shares for backup and disaster recovery](https://github.com/Azure-Samples/azure-files-samples/tree/master/SyncBetweenTwoAzureFileSharesForDR).

    - To sync between your Azure file share (cloud endpoint), an on-premises Windows file server, and a mounted file share that runs on a virtual machine (VM) in another Azure region (your server endpoint for disaster recovery purposes), use [Azure File Sync](/azure/storage/file-sync/file-sync-introduction).

   > [!IMPORTANT]
   > You must disable cloud tiering to ensure that all data is present locally. You must also provision enough storage on the Azure VM to hold the entire dataset. To ensure that changes replicate quickly to the secondary region, files should only be accessed and modified on the server endpoint rather than in Azure.

- **For Queue Storage:**

   - To learn about how to create multi-region solutions by using Queue Storage, see [Reliability in Queue Storage](./reliability-storage-queue.md).

## Azure Virtual Desktop

For geo-replication in nonpaired regions for Azure Virtual Desktop, you need to consider session host VMs and storage for user profiles, applications, and data. Microsoft manages the Azure Virtual Desktop control plane, which is globally distributed and highly available.

- For session hosts, you can deploy VMs in multiple regions in an active-active scenario, or replicate them across regions by using [Azure Site Recovery](/azure/site-recovery/azure-to-azure-enable-global-disaster-recovery) in an active-passive scenario.

- For storage, see [Azure Storage](#azure-storage).

For more information, see [Multiregion business continuity and disaster recovery (BCDR) for Azure Virtual Desktop](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#active-active-vs-active-passive) and [Azure Virtual Desktop service architecture and resilience](/azure/virtual-desktop/service-architecture-resilience).

## Azure Virtual Machines

To achieve geo-replication in nonpaired regions, use [Site Recovery](/azure/site-recovery/azure-to-azure-enable-global-disaster-recovery). Site Recovery is the disaster recovery service from Azure that provides BCDR by replicating workloads from the primary location to the secondary location. The secondary location can be a nonpaired region if Site Recovery supports it.

## Next steps

- [Azure services with availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
- [Reliability guidance](./reliability-guidance-overview.md)
