---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: reference
ms.date: 01/06/2026
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to understand the backup support and limitations for Azure Kubernetes Service (AKS) so that I can implement effective backup strategies for my clusters and ensure data protection compliance.
---

# Azure Kubernetes Service backup support matrix

You can use [Azure Backup](./backup-overview.md) to help protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

- Azure Backup for AKS supports storing backup data in both Vault and Operational (Snapshot) tiers in the following Azure regions:

Australia Central, Australia Central 2, Australia East, Australia Southeast, Brazil South, Brazil Southeast, Canada Central, Canada East, Central India, Central US, East Asia, East US, East US 2, France Central, France South, Germany North, Germany West Central, Italy North, Japan East, Japan West, Jio India West, Korea Central, Korea South, North Central US, North Europe, Norway East, Norway West, South Africa North, South Africa West, South Central US, South India, Southeast Asia, Sweden Central, Switzerland North, Switzerland West, UAE North, UK South, UK West,  West Central US, West Europe, West US, West US 2, West US 3

- The following regions support only the Operational (Snapshot) tier:

China East 2, China East 3, China North 2, China North 3, US GOV Arizona, US GOV Texas, US GOV Virginia,  Israel Central, Poland Central, and Spain Central 

>[!Note]
  >If you require geo-redundant backups with the ability to restore on demand, store your backups in the Vault tier and enable Cross Region Restore on your Backup Vault. This ensures that your backups are also available in the paired Azure region, allowing you to perform restores even if the primary region is unavailable. See the [list of Azure Paired Region](/azure/reliability/cross-region-replication-azure#azure-paired-regions).

## Supported Scenarios

- Azure Backup for AKS supports only clusters running supported Kubernetes versions. [Here's the list of the supported Kubernetes versions](/azure/aks/supported-kubernetes-versions). If your cluster is on an unsupported version, backup operations may still run, but failures during backup or restore aren't covered. To ensure full support and reliability, upgrade to a supported version, validate your backups, and reach out to support if issues persist.

- Azure Backup for AKS supports only CSI driver-based persistent volumes. In-tree volume plugins aren't supported. Ensure that the CSI driver and snapshot are enabled for your cluster. If they're disabled, [enable these settings](/azure/aks/csi-storage-drivers#enable-csi-storage-drivers-on-an-existing-cluster). Also, if your workloads use in-tree volumes, [migrate them to CSI-based volumes to enable backup support](/azure/aks/csi-migrate-in-tree-volumes).

- Azure Backup for AKS supports the following persistent volume types provisioned using the CSI driver:
  - **Azure Disk-based persistent volumes**: Supported disk SKUs include Standard HDD, Standard SSD, Premium SSD, Premium SSD v2, and Ultra Disks. While snapshot and restore operations are supported across all these SKUs, both operations for Premium SSD v2 and Ultra Disks may take longer. This is because both processes involves copying data from the volume to a snapshot and back. As a result, the snapshot may appear available and the volume may be mounted before the underlying data copy operation is fully completed, causing a delay before the restored data becomes visible.
  - **Azure Files-based persistent volumes (SMB protocol only)**: Both Standard and Premium file shares are supported. The CSI driver version must be 1.32 or higher. Azure Files using NFS protocol isn't supported. 

- Both dynamically and statically provisioned volumes are supported; however, for static volumes, the *storage class* must be explicitly defined in the **YAML** specification—otherwise, the volume is skipped during backup. 

- Azure Backup for AKS supports clusters that use either a [system-assigned](/azure/aks/use-managed-identity#update-an-existing-aks-cluster-to-use-a-system-assigned-managed-identity) or [user-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-cluster-to-use-a-user-assigned-managed-identity). Clusters configured with a service principal aren't supported. To enable backup, update your cluster to use a system-assigned managed identity or a user-assigned managed identity.

- Azure Backup for AKS offers both Operational Tier and Vault Tier backups. Operational Tier backups consist of snapshots of supported persistent volume types (Azure Disks and Azure Files), along with metadata stored in the blob container specified during the installation of the backup extension. Vault Tier backups, on the other hand, are stored offsite—securely and outside of your tenant. Note that Vault Tier is only supported for Azure Disk-based volumes; Azure Files volumes are backed up to Operational Tier only. Using the backup policy, you can choose to enable both Operational and Vault Tier backups, or use only the Operational Tier.

- The Persistent Volume snapshots taken as part of Operational Tier backup are crash consistent by nature. Although Azure Backup for AKS doesn't currently support taking snapshots of all PVs at the exact same millisecond to achieve consistent snapshots across volumes.

- The minimum supported backup frequency in Azure Backup for AKS is every 4 hours, with another options for 6, 8, 12, and 24-hour intervals. Backups are expected to be completed within a 2-hour window from the scheduled start time. These frequencies apply to Operational Tier backups, allowing multiple backups per day. However, only the first successful backup in a 24-hour period is eligible to be transferred to the Vault Tier (applicable only to Azure Disk-based volumes). For Azure Files-based volumes, backup retention is limited to a maximum of 30 days in the Operational Tier. Once a backup is created in the Operational Tier, it can take up to four hours for it to be moved to the Vault Tier.

- Backup Vault and the AKS cluster should be located in the same region. However, they can reside in different subscriptions as long as they are within the same tenant. 

- Azure Backup for AKS supports restoring backups to the same or a different AKS cluster using both Operational and Vault Tier backups. The target AKS cluster can be in the same subscription or a different subscription, known as *Cross-Subscription Restore*.

- When restoring from the Operational Tier, the target AKS cluster must be in the same region as the backups. However, if the backups are stored in the Vault Tier with *Geo-redundant storage setting* and *Cross-Region Restore* enabled on the Backup Vault, you can restore to a different region within an Azure Paired Region. 

- To enable Azure Backup for AKS using Azure CLI, ensure you're using version 2.41.0 or later. You can upgrade the CLI by running the az upgrade command.

- To enable Azure Backup for AKS using Terraform, use version 3.99.0 or later.

- Azure Backup for AKS requires a backup extension to be installed. This extension requires a storage account and preferably an empty blob container inside it as input while installing. Do not use a blob container with non backup related files.

- The storage account specified during the installation of the backup extension must be in the same region as the AKS cluster. Only General-purpose v2 storage accounts are supported; Premium storage accounts aren't supported.

- If the AKS cluster is deployed within a private virtual network, a private endpoint must be configured to enable backup operations.

- The Backup Extension can only be installed on node pools that use x86-based processors and run Ubuntu or Azure Linux as the operating system.

- Both the AKS cluster and the Backup Extension pods must be in a running and healthy state before performing any backup or restore operations, including the deletion of expired recovery points.

- Azure Backup for AKS provides alerts via Azure Monitor that enables you to have a consistent experience for alert management across different Azure services, including classic alerts, built-in Azure Monitor alerts, and custom log alerts for backup failure notifications. The supported backup alerts [are available here](monitoring-and-alerts-overview.md)

- Azure Backup for AKS supports various backup-related reports. Currently, backup data can only be viewed by selecting “All” for workload type in the report filters. The supported backup reports [are available here](monitoring-and-alerts-overview.md)

- Azure Backup for AKS supports [Enhanced Soft Delete](backup-azure-enhanced-soft-delete-about.md) for backups stored in the Vault Tier, providing protection against accidental or malicious deletion. For backups stored in the Operational Tier, the underlying snapshots aren't protected by soft delete and can be permanently deleted.

- Azure Backup for AKS supports [Multi-user authorization (MUA)](multi-user-authorization-concept.md) allowing you to add another layer of protection to critical operations on your Backup vaults where backups are configured.

- Azure Backup for AKS supports the [Immutable vault](backup-azure-immutable-vault-concept.md), which helps protect your backup data by preventing operations that could result in the loss of recovery points. However, WORM (Write Once, Read Many) storage for backups isn't currently supported.

- Azure Backup for AKS supports [Customer-Managed Key (CMK) encryption](backup-azure-immutable-vault-concept.md), but it is applicable only to backups stored in the Vault Tier.

- For successful backup and restore operations, the Backup vault's managed identity requires role assignments. For Azure Files-based volumes, both the source and target AKS clusters must have the **Storage File Data Privileged Contributor** role assigned on the storage account that hosts the file shares. For statically provisioned file shares, you must assign this role manually; for dynamically provisioned volumes, the Backup vault handles the role assignment automatically. If you don't have the required permissions, permission problems might happen during backup configuration or restore operations soon after you assign roles because the role assignments take a few minutes to take effect. [Learn about role definitions](azure-kubernetes-service-cluster-backup-concept.md#required-roles-and-permissions). 

## Unsupported Scenarios and Limitations

- For Azure Files-based persistent volumes, only SMB protocol is supported. Azure Files using NFS protocol isn't supported. Additionally, only file shares with 25,000 files or fewer are supported; larger file shares may result in restore failures. Azure Files with private network endpoints aren't supported; only publicly accessible file shares (network endpoint type set to **All**) are supported.

- Azure Blob Storage and Azure Container Storage based persistent volumes aren't supported by AKS Backup. If you're using these types of persistent volumes in your AKS clusters, you can back them up separately using dedicated Azure Backup solutions. For more information, see [Azure Blob Storage backup](blob-backup-overview.md).

- Any unsupported persistent volume types are automatically skipped during the backup process for the AKS cluster. This includes in-tree volumes (where provisioner: `kubernetes.io/azure-disk` or `kubernetes.io/azure-file`) which must be migrated to CSI driver-based volumes.

- The Backup Extension cannot be installed on Windows-based node pools or ARM64-based node pools. AKS clusters using such nodes should provision a separate Linux-based node pool (preferably a system node pool with x86-based processors) to support the installation of the Backup Extension.

- Azure Backup for AKS is currently not supported for Network Isolated AKS clusters. 

- Don't install the AKS Backup Extension alongside Velero or any Velero-based backup solutions, as this can cause conflicts during backup and restore operations. Additionally, ensure that your Kubernetes resources do not use labels or annotations containing the prefix `velero.io`, unless explicitly required by a supported scenario. The presence of such metadata may lead to unexpected behavior.

- Modifying the backup configuration or the snapshot resource group assigned to a backup instance during AKS cluster backup setup isn't supported. You cannot update existing backup instances to include Azure Files-based volumes; you must create a new backup instance to back up these volumes.

- The following namespaces are skipped from Backup Configuration and cannot be configured for backups: `kube-system`, `kube-node-lease`, `kube-public`. 

- Azure Backup doesn't automatically scale out AKS nodes, it only restores data and associated resources. Autoscaling is managed by AKS itself, using features like the Cluster Autoscaler. If autoscaling is enabled on the target cluster, it should handle resource scaling automatically. Before restoring, ensure that the target cluster has sufficient resources to avoid restore failures or performance issues.

- Here are the AKS backup limits:

  | Setting | Limit |
  | --- | --- |
  | Number of backup policies per Backup vault | 5,000 |
  | Number of backup instances per Backup vault | 5,000 |
  | Number of on-demand backups allowed in a day per backup instance | 10 |
  | Number of namespaces per backup instance | 800 | 
  | Number of allowed restores per backup instance in a day | 10 |

## Azure Files-based Persistent Volumes - Additional Considerations

- **Snapshot Storage**: Azure Files volumes are backed up as snapshots stored in the same storage account as the file share, unlike Azure Disk snapshots which are stored in a separate snapshot resource group.

- **Snapshot Lifecycle**: Azure Files snapshots are tied to the lifecycle of the file share. If the file share or the storage account it resides in is deleted, the associated snapshots will also be deleted, rendering your backups unrecoverable. We recommend creating persistent volumes with the Reclaim Policy set to **Retain** to ensure that if the PVC or namespace is deleted, the volume and its associated backups continue to exist. You can update the reclaim policy with: `kubectl patch pv <your-pv-name> --patch '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'`

- **Secrets Backup**: If Kubernetes secrets are used to store the storage account key for Azure Files volumes, you must include secrets in your backup configuration. Otherwise, mounting issues will occur during restore.

- **Custom Storage Classes**: To back up Azure Files-based volumes created using custom storage classes, you must also back up the storage class itself.

- **Storage Account Locks**: Don't apply read or delete locks on storage accounts containing file shares, as this will prevent deletion of recovery points after their retention period expires.

- **Cross-Region/Subscription Restore**: For Azure Files-based volumes, restore to a different subscription or region isn't supported. Azure Files snapshots are tied to the storage account and cannot be restored across subscriptions or regions. 

- **Mixed Workloads**: You can back up both Azure Disk and Azure Files volumes in the same backup instance. However, if you need different backup targets (Vault Tier for Disks and Operational Tier for Files), you must create separate backup instances—one for each resource type.

- **CLI Support**: Currently, ability to backup AFS based Persistent Volumes is only available by Azure portal. Powershell, Azure CLI, Terraform  and other programmatic tools are currently not supported. 

- **File Size limits**: Only Fileshares with ≤ 25,000 files are supported. Larger fileshares may result in failures during restoration.

- **NFS File Support**: Fileshares using SMB protocol are only supported with NFS protocol based Files are skipped while creating a backup.

- **Retention Duration**: Backup policies used for File-based Persistent Volumes support a maximum retention of 30 days. This limit is imposed due to the maximum of 200 snapshots that can exist concurrently for an Azure File Share.


### Supported Scenarios and limitations specific for Vaulted backup and Cross Region Restore

- Currently, Azure Disks with Persistent Volumes of size <= 1 TB are eligible to be moved to the Vault Tier; disks with the higher size are skipped in the backup data moved to the Vault Tier. 

- Currently, backup instances with <= 100 disks attached as persistent volume are supported. Backup and restore operations might fail if number of disks are higher than the limit. 

- Only Azure Disks that have public network access enabled, AAD (Data Access) authentication disabled, and Disk Encryption Set (DES) disabled are eligible to be moved to the Vault tier. If a disk has restricted network access, AAD authentication enabled, or DES enabled, the tiering operation will fail.
  
- *Disaster Recovery* feature is only available between Azure Paired Regions (if backup is configured in a Geo Redundant Backup vault with Cross Region Restore enabled on them). The backup data is only available in an Azure paired region. For example, if you have an AKS cluster in East US that is backed up in a Geo Redundant Backup vault with Cross Region Restore enabled on them, the backup data is also available in West US for restore.

- In the Vault Tier, only one scheduled recovery point is created per day, providing a Recovery Point Objective (RPO) of upto 24 hours in the primary region. In the secondary region, replication of this recovery point can take up to 12 another hours, resulting in an effective RPO of up to 36 hours.

- When a backup is created in the Operational Tier and becomes eligible for Vault Tier, it may take up to four hours for the tiering process to begin.

- When moving backups from the Operational tier to the Vault tier, the pruning logic preserves essential snapshots to ensure successful tiering operations and data integrity. Specifically, during the tiering of the latest Recovery Point (RP) in the source store (Operational tier), snapshots from both the following are required:

  - The latest RP in the Operational tier (source store).
  - The previous hardening RP in the Vault tier (target store).

As a result, two Recovery Points in the Operational tier are intentionally retained and not pruned:

  - The most recent RP in the Operational tier.
  - The RP in the Operational tier linked to the latest Vault-tier RP.

This behavior prevents accidental data loss and ensures consistent backups. Consequently, you may notice that some operational backups persist longer than the configured daily retention policy due to these tiering dependencies. 

- When moving backups from the Operational tier to the Vault tier, the storage account provided to the Backup Extension should preferably have public network access enabled. If the storage account is behind a firewall or has private access enabled, ensure that the Backup Vault is added as a Trusted Service in the storage account’s network settings to allow seamless data transfer.

- During restore from Vault Tier, the hydrated resources in the staging location which includes a storage account and a resource group aren't cleaned after restore. They have to be deleted manually.

- During restore, the staging storage account must have public network access enabled to allow the backup service to access and transfer data. Without public access, the restore operation may fail due to connectivity restrictions.

- During restore, if the target AKS cluster is deployed within a private virtual network, you must enable a private endpoint between the cluster and the staging storage account to ensure secure and successful data transfer.

- If the target AKS cluster version differs from the version used during backup, the restore operation may fail or complete with warnings for various scenarios like deprecated resources in the newer cluster version. In case of restoring from Vault tier, you can use the hydrated resources in the staging location to restore application resources to the target cluster.

- Currently Vault Tier based backup isn't supported with Terraform deployment.

## Next steps

- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md).
- Back up Azure Kubernetes Service cluster using [Azure portal](azure-kubernetes-service-cluster-backup.md), [Azure CLI](azure-kubernetes-service-cluster-backup-using-cli.md), [Azure PowerShell](azure-kubernetes-service-cluster-backup-using-powershell.md), [Azure Resource Manager](quick-kubernetes-backup-arm.md), [Bicep](quick-kubernetes-backup-bicep.md), [Terraform](quick-kubernetes-backup-terraform.md).
- Restore Azure Kubernetes Service cluster using [Azure portal](azure-kubernetes-service-cluster-restore.md), [Azure CLI](azure-kubernetes-service-cluster-restore-using-cli.md), [Azure PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md).
- [Manage Azure Kubernetes Service backups using Azure Backup](azure-kubernetes-service-cluster-manage-backups.md).
