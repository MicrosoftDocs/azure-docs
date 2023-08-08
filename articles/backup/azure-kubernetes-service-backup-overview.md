---
title: Azure Kubernetes Service backup - Overview
description: This article gives you an understanding about Azure Kubernetes Service (AKS) backup, the cloud-native process to back up and restore the containerized applications and data running in AKS clusters.
ms.topic: conceptual
ms.service: backup
ms.date: 04/05/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About Azure Kubernetes Service backup using Azure Backup (preview)

[Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) backup is a simple, cloud-native process to back up and restore the containerized applications and data running in AKS clusters. You can configure scheduled backup for cluster state and application data (persistent volumes - CSI driver-based Azure Disks). The solution provides granular control to choose a specific namespace or an entire cluster to back up or restore by storing backups locally in a blob container and as disk snapshots. With AKS backup, you can unlock end-to-end scenarios - operational recovery, cloning developer/test environments, or cluster upgrade scenarios. 

AKS backup integrates with Backup center, providing a single pane of glass that can help you govern, monitor, operate, and analyze backups at scale. Your backups are also available in the *AKS portal* under the **Settings** section.

## How does AKS backup work?

AKS Backup enables you to back up your Kubernetes workloads and Persistent Volumes deployed in AKS clusters. The solution requires a [**Backup Extension**](/azure/azure-arc/kubernetes/conceptual-extensions) to be installed inside the AKS cluster and Backup Vault communicates to the Extension to perform backup and restore related operations. **Backup Extension** is mandatory to be installed inside AKS cluster to enable backup and restore. As part of installation, a storage account and a blob container is to be provided in input where backups will be stored. 

Along with Backup Extension, a *User Identity* is created in the AKS cluster's Managed Resource Group (called Extension Identity). This extension identity gets the *Storage Account Contributor* role assigned to it on the storage account where backups are stored in a blob container.

To support Public, Private, and Authorized IP based clusters, AKS backup requires *Trusted Access* to be enabled between *Backup vault* and *AKS cluster*. Trusted Access allows Backup vault to access the AKS clusters as specific permissions assigned to it related to the *Backup operations*. For more information on AKS Trusted Access, see [Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access](../aks/trusted-access-feature.md).

>[!Note]
>AKS backup currently allows storing backups in *Operational Tier*. Operational Tier is a local data store and backups aren't moved to a vault, but are stored in your own tenant. However, the Backup vault still serves as the unit of managing backups.

Once *Backup Extension* is installed and *Trusted Access* is enabled, you can configure scheduled backups for the clusters as per your backup policy, and can restore the backups to the original or an alternate cluster in the same subscription and region. AKS backup allows you to enable granular controls to choose a specific *namespace* or an *entire cluster* as a backup/restore configuration while performing the specific operation.

The *backup solution* enables backup operation for your Kubernetes workloads deployed in the cluster and the data stored in the *Persistent Volume*. The Kubernetes workloads are stored in a blob container and the *Disk-based Persistent Volumes* are backed up as *Disk Snapshots* in a Snapshot Resource Group 

>[!Note]
>Currently, the solution only supports Persistent Volumes of CSI Driver-based Azure Disks. During backups, other Persistent Volume types (File Share, Blobs) are skipped by the solution.

## Backup
 
To configure backup for AKS cluster, first you need to create a *Backup vault*. The vault gives you a consolidated view of the backups configured across different workloads. AKS backup supports only Operational Tier backup.

>[!Note]
>- The Backup vault and the AKS cluster to be backed up or restored should be in the same region and subscription.
>- Copying backups to the *Vault Tier* is currently not supported. So, the *Backup vault storage redundancy* setting (LRS/GRS) doesn't apply to the backups stored in Operational Tier.

AKS backup automatically triggers scheduled backup job that copies the cluster resources to a blob container and creates an incremental snapshot of the disk-based persistent volumes as per the backup frequency. Older backups are deleted as per the retention duration specified by the backup policy.

>[!Note]
>AKS backup allows creating multiple backup instances for a single AKS cluster with different backup configurations, as required. However, each backup instance of an AKS cluster should be created either in a different Backup vault or with a different backup policy in the same Backup vault.

## Backup management 

Once the backup configuration for an AKS cluster is complete, a backup instance is created in the Backup vault. You can view the backup instance for the cluster under the Backup section in the AKS portal. You can perform any Backup-related operations for the Instance, such as initiating restores, monitoring, stopping protection, and so on, through its corresponding backup instance.

AKS backup also integrates directly with Backup center to help you manage the protection of all your AKS clusters centrally along with all other backup supported workloads. The Backup center is a single pane of glass for all your backup requirements, such as monitoring jobs and state of backups and restores, ensuring compliance and governance, analyzing backup usage, and performing operations pertaining to back up and restore of data.

AKS backup uses Managed Identity to access other Azure resources. To configure backup of an AKS cluster and to restore from past backup, Backup vault's Managed Identity requires a set of permissions on the AKS cluster and the snapshot resource group where snapshots are created and managed. Currently, the AKS cluster requires a set of permissions on the Snapshot Resource Group. Also, the Backup Extension creates a User Identity and assigns a set of permissions to access the storage account where backups are stored in a blob. You can grant permissions to the Managed Identity using Azure role-based access control (Azure RBAC). Managed Identity is a service principle of a special type that can only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

## Restore

You can restore data from any point-in-time for which a recovery point exists. A recovery point is created when a backup instance is in protected state, and can be used to restore data until it's retained by the backup policy.

Azure Backup provides an instant restore experience because the snapshots are stored locally in your subscription. Operational backup gives you the option to restore all the backed-up items or use the granular controls to select specific items from the backup by choosing namespaces and other available filters. Also, you've the ability to perform the restore on the original AKS cluster (that's backed up) or alternate AKS cluster in the same region and subscription.

## Pricing

You won't incur any management charges or instance fee when using AKS backup for Operational Tier in preview. However, you'll incur the  charges for:

- Retention of backup data stored in the blob container. 
- Disk-based persistent volume snapshots are created by AKS backup are stored in the resource group in your Azure subscription and incur Snapshot Storage charges. Because the snapshots aren't copied to the Backup vault, Backup Storage cost doesn't apply. For more information on the snapshot pricing, see [Managed Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

AKS backup uses incremental snapshots of the Disk-based persistent volumes. Incremental snapshots are charged *per GiB of the storage occupied by the delta changes* since the last snapshot. For example, if you're using a disk-based persistent volume with a provisioned size of *128 GiB*, with *100 GiB* used, then the first incremental snapshot is charged only for the used size of *100 GiB*. *20 GiB* of data is added on the disk before you create the second snapshot. Now, the second incremental snapshot is charged for only *20 GiB*.

Incremental snapshots are always stored on standard storage, irrespective of the storage type of parent-managed disks and are charged based on the pricing of standard storage. For example, incremental snapshots of a Premium SSD-Managed Disk are stored on standard storage. By default, they're stored on zonal redundant storage (ZRS) in regions that support ZRS. Otherwise, they're stored  locally redundant storage (LRS). The per GiB pricing of both the options, LRS and ZRS, is the same.

## Next steps

- [Prerequisites for Azure Kubernetes Service backup (preview)](azure-kubernetes-service-cluster-backup-concept.md)