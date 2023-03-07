---
title: Azure Kubernetes Service backup - Overview
description: This article gives you an understanding about Azure Kubernetes Service (AKS) backup, the cloud-native process to back up and restore the containerized applications and data running in AKS clusters.
ms.topic: conceptual
ms.service: backup
ms.date: 03/14/2023
author: jyothisuri
ms.author: jsuri
---

# Overview of Azure Kubernetes Service backup using Azure Backup (preview)

[Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) backup is a simple, cloud-native process to back up and restore the containerized applications and data running in AKS clusters. You can configure scheduled backup for cluster state and application data (persistent volumes - CSI driver-based Azure Disks). The solution provides granular control to choose a specific namespace or an entire cluster to back up or restore by storing backups locally in a blob container and as disk snapshots. With AKS backup, you can unlock end-to-end scenarios - operational recovery, cloning developer/test environments, or cluster upgrade scenarios. 

AKS backup integrates with Backup center (with other backup management capabilities) to provide a single pane of glass that helps you govern, monitor, operate, and analyze backups at scale.

## How does AKS backup work?

AKS backup enables you to back up your Kubernetes workloads and persistent volumes deployed in AKS clusters. The solution requires a [**Backup Extension**](/azure/azure-arc/kubernetes/conceptual-extensions) to be installed in the AKS cluster. Backup vault communicates to the Backup Extension to perform backup and restore related operations. You can configure scheduled backups for your clusters as per your backup policy and can restore the backups to the original or an alternate cluster within the same subscription and region. The extension also allows you to enable granular controls to choose a specific namespace or an entire cluster as a backup/restore configuration while performing the specific operation.

>[!Note]
>- You must install Backup Extension in the AKS cluster to enable backups and restores. With the extension installation, a User Identity is created in the AKS cluster's managed resource group (Extension Identity), which gets assigned a set of permissions to access the storage account with the backups stored in the blob container.
> 
>- An AKS cluster can have only one Backup Extension installed at a time.
>
>- Currently, AKS backup allows storing backups in Operational Tier. Operational Tier is a local data store and backups aren't moved to a vault but are stored in your own tenant. However, the Backup vault still serves as the unit for managing backups. 

The backup solution enables backups for your Kubernetes workloads deployed in the cluster and the data stored in the persistent volume. Currently, the solution only supports persistent volumes of CSI driver-based Azure Disks. During backups, other *PV* types (such as File Share and Blobs) are skipped by the solution. The Kubernetes workloads are stored in a blob container and the Disk-based persistent volumes are backed up as Disk snapshots.   

## Backup
 
To configure backup for AKS cluster, first you need to create a *Backup vault*. The vault gives you a consolidated view of the backups configured across different workloads. AKS backup supports only Operational Tier backup.
Note: Copying backups to the Vault Tier is currently not supported. So, the Backup vault storage redundancy setting (LRS/GRS) doesn't apply to the backups stored in Operational Tier.  

AKS backup automatically triggers scheduled backup job that copies the cluster resources to a blob container and creates an incremental snapshot of the disk-based persistent volumes as per the backup frequency. Older backups are deleted as per the retention duration specified by the backup policy.

>[!Note]
>AKS backup allows creating multiple backup instances for a single AKS cluster. You can create multiple backup Instances with different backup configurations, as required. However, each backup instance of an AKS cluster should be created with a different backup policy, either in the same or in a different Backup vault.

## Backup management 

Once the backup configuration for an AKS cluster is complete, a backup instance is created in the Backup vault. You can view the backup instance for the cluster under the Backup section in the AKS portal. You can perform any Backup-related operations for the Instance, such as initiating restores, monitoring, stopping protection, and so on, through its corresponding backup instance.

AKS backup also integrates directly with Backup center to help you manage the protection of all your storage accounts centrally along with all other backup supported workloads. The Backup center is a single pane of glass for all your backup requirements, such as monitoring jobs and state of backups and restores, ensuring compliance and governance, analyzing backup usage, and performing operations pertaining to back up and restore of data.

AKS backup uses Managed Identity to access other Azure resources. To configure backup of an AKS cluster and to restore from past backup, Backup vault's Managed Identity requires a set of permissions on the AKS cluster and the snapshot resource group where snapshots are created and managed. Currently, the AKS cluster requires a set of permissions on the Snapshot Resource Group. Also, the Backup Extension creates a User Identity and assigns a set of permissions to access the storage account where backups are stored in a blob. You can grant permissions to the Managed Identity using Azure role-based access control (Azure RBAC). Managed Identity is a service principle of a special type that can only be used with Azure resources. Learn more about [Managed Identities](/azure/active-directory/managed-identities-azure-resources/overview.md).

## Restore

You can restore data from any point-in-time for which a recovery point exists. A recovery point is created when a backup instance is in protected state, and can be used to restore data until it's retained by the backup policy.

Azure Backup provides an instant restore experience because the snapshots are stored locally in your subscription. Operational backup gives you the option to restore all the backed-up items or use the granular controls to select specific items from the backup by choosing namespaces and other available filters. Also, you've the ability to perform the restore on the original AKS cluster (that's backed up) or alternate AKS cluster in the same region and subscription.

## Pricing

You won't incur any management charges or instance fee when using AKS backup for Operational Tier in preview. However, you'll incur the  charges for:

1. Retention of backup data stored in the blob container. 
1. Disk-based persistent volume snapshots are created by AKS backup are stored in the resource group in your Azure subscription and incur Snapshot Storage charges. Because the snapshots aren't copied to the Backup vault, Backup Storage cost doesn't apply. For more information on the snapshot pricing, see [Managed Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

AKS backup uses incremental snapshots of the Disk-based persistent volumes. Incremental snapshots are charged *per GiB of the storage occupied by the delta changes* since the last snapshot. For example, if you're using a disk-based persistent volume with a provisioned size of *128 GiB*, with *100 GiB* used, then the first incremental snapshot is charged only for the used size of *100 GiB*. *20 GiB* of data is added on the disk before you create the second snapshot. Now, the second incremental snapshot is charged for only *20 GiB*.

Incremental snapshots are always stored on standard storage, irrespective of the storage type of parent-managed disks and are charged based on the pricing of standard storage. For example, incremental snapshots of a Premium SSD-Managed Disk are stored on standard storage. By default, they're stored on zonal redundant storage (ZRS) in regions that support ZRS. Otherwise, they're stored  locally redundant storage (LRS). The per GiB pricing of both the options, LRS and ZRS, is the same.

## Next steps

- 
