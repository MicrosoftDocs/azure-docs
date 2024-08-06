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

# Cross-region replication solutions for non-paired regions

Some Azure services support cross-region replication to ensure business continuity and protect against data loss. These services make use of another secondary region that uses *cross-region replication*. Both the primary and secondary regions together form a [region pair](./cross-region-replication-azure.md#azure-paired-regions).

However, there are some [regions that are non-paired](./cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair) and so require alternative methods to achieving geo-replication. 

This document lists some of the services and possible solutions that support geo-replication methods without requiring paired regions. 


## Azure App Service
For App Service, custom backups are stored on a selected storage account. As a result, there's a dependency for cross-region restore on GRS and paired regions. For automatic backup type, you can't backup/restore across regions. As a workaround, you can implement a custom file copy mechanism for the saved data set to manually copy across non-paired regions and different storage accounts.

## Azure Backup

To achieve geo-replication in non-paired regions:

- Use [Azure Site Recovery](/azure/site-recovery/azure-to-azure-enable-global-disaster-recovery).  Azure Site Recovery is the Disaster Recovery service from Azure that provides business continuity and disaster recovery by replicating workloads from the primary location to the secondary location. The secondary location can be a non-paired region if it is supported by Azure Site Recovery. You can have maximum data retention up to 15 days with Azure Site Recovery.
- Use [Zone-redundant Storage](../backup/backup-overview.md#why-use-azure-backup) to replicate your data in availability zones, guaranteeing data residency and resiliency in the same region.



## Azure Database for MySQL 


Choose any [Azure Database for MySQL available Azure regions](/azure/mysql/flexible-server/overview#azure-region) to spin up your [read replicas](/azure/mysql/flexible-server/concepts-read-replicas#cross-region-replication).


## Azure Database for PostgreSQL

For geo-replication in non-paired regions with Azure Database for PostgreSQL, you can use:

**Managed service with geo-replication**: Azure PostgreSQL Managed service supports active [geo-replication](/azure/postgresql/flexible-server/concepts-read-replicas) to create a continuously readable secondary replica of your primary server. The readable secondary may be in the same Azure region as the primary or, more commonly, in a different region. This kind of readable secondary replica is also known as *geo-replica*.
 
You can also utilize any of the two customer-managed data migration methods listed below to replicate the data to a non-paired region.  

- [Copy](/azure/postgresql/migrate/how-to-migrate-using-dump-and-restore?tabs=psql).

- [Logical Replication & Logical Decoding](/azure/postgresql/flexible-server/concepts-logical).


 
## Azure Data Factory

For geo-replication in non-paired regions, Azure Data Factory (ADF) supports Infrastructure-as-code provisioning of ADF pipelines combined with [Source Control for ADF](/azure/data-factory/concepts-data-redundancy#using-source-control-in-azure-data-factory).


## Azure Event Grid

For geo-replication of Event Grid topics in non-paired regions, you can implement [client-side failover](/azure/event-grid/custom-disaster-recovery-client-side).

## Azure IoT Hub 

For geo-replication in non-paired regions, use the [concierge pattern](/azure/iot-hub/iot-hub-ha-dr#achieve-cross-region-ha) for routing to a secondary IoT Hub. 


## Azure Key Vault

[!INCLUDE [Key Vault in non-paired regions guidance](../key-vault/includes/key-vault-non-paired-regions.md)]



## Azure Kubernetes Service (AKS)

Azure Backup can provide protection for AKS clusters, including a [cross-region restore (CRR)](/azure/backup/tutorial-restore-aks-backups-across-regions) feature that's currently in preview and only supports Azure Disks. Although the CRR feature relies on GRS paired regions replicas, any dependency on CRR can be avoided if the AKS cluster stores data only in external storage and avoids using "in-cluster" solutions.


## Azure Monitor Logs

Log Analytics workspaces in Azure Monitor Logs don't use paired regions. To ensure business continuity and protect against data loss, enable cross-region workspace replication.

For more information, see [Enhance resilience by replicating your Log Analytics workspace across regions](/azure/azure-monitor/logs/workspace-replication)


## Azure SQL Database

For geo-replication in non-paired regions with Azure SQL Database, you can use:

- [Failover group feature](/azure/azure-sql/database/failover-group-sql-db?view=azuresql&preserve-view=true) that replicates across any combination of Azure regions without any dependency on underlying storage GRS.

- [Active geo-replication feature](/azure/azure-sql/database/active-geo-replication-overview?view=azuresql&preserve-view=true) to create a continuously synchronized readable secondary database for a primary database. The readable secondary database may be in the same Azure region as the primary or, more commonly, in a different region. This kind of readable secondary database is also known as a *geo-secondary* or *geo-replica*.

## Azure SQL Managed Instance 

For geo-replication in non-paired regions with Azure SQL Managed Instance, you can use:

- [Failover group feature](/azure/azure-sql/managed-instance/failover-group-sql-mi?view=azuresql&preserve-view=true) that replicates across any combination of Azure regions without any dependency on underlying storage GRS.


## Azure Storage


To achieve geo-replication in non-paired regions: 

- **For Azure Object Storage**:

    - For blob storage and Azure Data Lake Storage, you can use tools such as [AZCopy](../storage/common/storage-use-azcopy-blobs-copy.md) or [Azure Data Factory](/azure/data-factory/connector-azure-blob-storage?tabs=data-factory.md).

    - For general-purpose v2 storage accounts and premium block blob accounts, you can use [Azure Storage Object Replication](../storage/blobs/object-replication-overview.md).
    
   >[!NOTE]
   >Object replication isn't supported for [Azure Data Lake Storage](../storage/blobs/data-lake-storage-best-practices.md).



- **For Azure NetApp Files (ANF)**, you can replicate to a set of non-standard pairs besides Azure region pairs.  See [Azure NetApp Files (ANF) cross-region replication](/azure/azure-netapp-files/cross-region-replication-introduction).

- **For Azure Files:**

    - To copy your files to another storage account in a different region, use tools such as:

        -  [AZCopy](../storage/common/storage-use-azcopy-blobs-copy.md)
        -  [Azure PowerShell](/powershell/module/az.storage/?view=azps-12.0.0&preserve-view=true) 
        -  [Azure Data Factory](/azure/data-factory/connector-azure-blob-storage?tabs=data-factory) 
         
        For a sample script, see [Sync between two Azure file shares for Backup and Disaster Recovery](https://github.com/Azure-Samples/azure-files-samples/tree/master/SyncBetweenTwoAzureFileSharesForDR).

    - To sync between your Azure file share (cloud endpoint), an on-premises Windows file server, and a mounted file share running on a virtual machine in another Azure region (your server endpoint for disaster recovery purposes), use [Azure File Sync](/azure/storage/file-sync/file-sync-introduction).

   > [!IMPORTANT]
   > You must disable cloud tiering to ensure that all data is present locally, and provision enough storage on the Azure Virtual Machine to hold the entire dataset. To ensure changes replicate quickly to the secondary region, files should only be accessed and modified on the server endpoint rather than in Azure.







## Next steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
- [Disaster recovery guidance by service](disaster-recovery-guidance-overview.md)
- [Reliability guidance](./reliability-guidance-overview.md)
- [Business continuity management program in Azure](./business-continuity-management-program.md)

