---
title: Cross-region replication for non-paired regions
description: Learn about cross-region replication for non-paired regions
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 06/14/2024
ms.author: anaharris
ms.custom: references_regions
---

# Cross-region replication for non-paired regions

Some Azure services support cross-region replication to ensure business continuity and protect against data loss. These services make use of another secondary region that uses *cross-region replication*. Both the primary and secondary regions together form a [region pair](./cross-region-replication-azure.md#azure-paired-regions).

However, there are some [regions that are non-paired](./cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair) and so require alternative methods to achieving geo-replication. 

This document lists some of the services and possible solutions that support geo-replication methods without requiring paired regions. 


## Azure Storage

To achieve geo-replication in non-paired regions, you can use:

- [Azure Storage Object Replication](/azure/storage/blobs/object-replication-overview).
- [AZCopy](/azure/storage/common/storage-use-azcopy-blobs-copy).
- [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-best-practices) or any application-level replication service. 
- [Azure NetApp Files (ANF)](/azure/azure-netapp-files/azure-netapp-files-introduction) can be also considered as an option since it can replicate to a set of paired regions not constrained by geo-redundant storage (GRS).
- [Azure File Sync](/azure/storage/file-sync/file-sync-introduction) to sync between your Azure file share (cloud endpoint), an on-premises Windows file server, and a mounted file share running on a virtual machine in another Azure region (your server endpoint for disaster recovery purposes). You must disable cloud tiering to ensure that all data is present locally, and provision enough storage on the Azure Virtual Machine to hold the entire dataset. To ensure changes replicate quickly to the secondary region, files should only be accessed and modified on the server endpoint rather than in Azure.” 


## Azure Backup

To achieve geo-replication in non-paired regions:

- Use [Azure Site Recovery](/azure/site-recovery/azure-to-azure-enable-global-disaster-recovery).  Azure Site Recovery is the Disaster Recovery service from Azure that provides business continuity and disaster recovery by replicating workloads from the primary location to the secondary location. The secondary location can be a non-paired region if it is supported by Azure Site Recovery. You can have maximum data retention up to 14 days with Azure Site Recovery.
- Replace the data retention time frame from 14 days to 15 days.
- Add [Zone-redundant Storage](../backup/backup-overview#why-use-azure-backup.md) as one of the replication options.


 
## Azure SQL Database

For geo-replication in non-paired regions with Azure SQL Database, you can use:

- [Failover group feature](/azure/azure-sql/database/failover-group-sql-db?view=azuresql&preserve-view=true) that replicates across any combination of Azure regions without any dependency on underlying storage GRS.

- [Active geo-replication feature](/azure/azure-sql/database/active-geo-replication-overview?view=azuresql&preserve-view=true) to create a continuously synchronized readable secondary database for a primary database. The readable secondary database may be in the same Azure region as the primary or, more commonly, in a different region. This kind of readable secondary database is also known as a *geo-secondary* or *geo-replica*.

## Azure SQL Managed Instance 

For geo-replication in non-paired regions with Azure SQL Managed Instance, you can use:

- [Failover group feature](/azure/azure-sql/managed-instance/failover-group-sql-mi?view=azuresql&preserve-view=true) that replicates across any combination of Azure regions without any dependency on underlying storage GRS.



## Azure Key Vault

To achieve geo-replication in non-paired regions, you can:

- Within a single geography only, [backup Azure Key Vault](/azure/key-vault/general/backup?tabs=azure-cli). 

- Use [Key Vault Managed Hardware Security Module (HSM)](/azure/key-vault/managed-hsm/overview). Although it's a more expensive option, as it provides encryption key management.


## Azure Data Factory

For geo-replication in non-paired regions, Azure Data Factory (ADF) supports Infrastructure-as-code provisioning of ADF pipelines combined with [Source Control for ADF](/azure/data-factory/concepts-data-redundancy#using-source-control-in-azure-data-factory).

## Azure Database for MySQL 

For geo-replication in non-paired regions:

1. [Export](/azure/mysql/flexible-server/concepts-migrate-import-export) the database.

2. [Copy](/azure/mysql/flexible-server/concepts-migrate-dump-restore) the database.

## Azure Database for PostgreSQL

For geo-replication in non-paired regions, copy the database using [pg_dump](/azure/postgresql/migrate/how-to-migrate-using-dump-and-restore?tabs=psql).

## Azure Event Grid

For geo-replication of Event Grid topics in non-paired regions, you can implement [client-side failover](/azure/event-grid/custom-disaster-recovery-client-side).

## Azure IoT Hub 

For geo-replication in non-paired regions, use the [concierge pattern](/azure/iot-hub/iot-hub-ha-dr#achieve-cross-region-ha) for routing to a secondary IoT Hub. 


## Azure Virtual Desktop (AVD)

[AVD](/azure/virtual-desktop/overview) provides an efficient scale-out model for compute (Host Pools) in any region, but may be constrained by the underlying storage type used (Azure Files, Azure NetApp Files, blobs, file servers). From a DR perspective, FSLogix Cloud Cache provides an efficient and well-known replication mechanism. FSLogix mechanism isn't tied to any GRS pair and is independent from the underlying storage used. As a result, the replication mechanism is able to provide [multiple solutions and high flexibility](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr). 


## Azure Log Analytics Workspace

With Log Analytics Workspace, the only possible solution is to have all the "sources" and "agents" replicate to multiple workspaces in different regions, which is something complex and expensive to implement. Deployment of other solutions like Azure Sentinel may add complexity to Business Continuity and Disaster recovery (BCDR). 

For more information, see [Enhance resilience by replicating your Log Analytics workspace across regions](/azure/azure-monitor/logs/workspace-replication)


## Azure Kubernetes Service (AKS)

Azure Backup can provide protection for AKS clusters, including a [cross-region restore (CRR)](/azure/backup/tutorial-restore-aks-backups-across-regions) feature that's currently in preview and only supports Azure Disks. Although the CRR feature relies on GRS paired regions replicas, any dependency on CRR can be avoided if the AKS cluster stores data only in external storage and avoids using "in-cluster" solutions.


## Azure App Service
For App Service, custom backups are stored on a selected storage account. As a result, there's a dependency for cross-region restore on GRS and paired regions. For automatic backup type, you can't backup/restore across regions. As a workaround, you can implement a custom file copy mechanism for the saved data set to manually copy across non-paired regions and different storage accounts.


## Next steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
- [Disaster recovery guidance by service](disaster-recovery-guidance-overview.md)
- [Reliability guidance](./reliability-guidance-overview.md)
- [Business continuity management program in Azure](./business-continuity-management-program.md)

