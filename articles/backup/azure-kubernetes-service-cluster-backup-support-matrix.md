---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: reference
ms.date: 06/10/2025
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Azure Kubernetes Service backup support matrix

You can use [Azure Backup](./backup-overview.md) to help protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

- Azure Backup for AKS supports storing backup data in both Vault and Operational (Snapshot) tiers in the following Azure regions:

Australia Central, Australia Central 2, Australia East, Australia Southeast, Brazil South, Brazil Southeast, Canada Central, Canada East, Central India, Central US, East Asia, East US, East US 2, France Central, France South, Germany North, Germany West Central, Italy North, Japan East, Japan West, Jio India West, Korea Central, Korea South, North Central US, North Europe, Norway East, Norway West, South Africa North, South Africa West, South Central US, South India, Southeast Asia, Sweden Central, Switzerland North, Switzerland West, UAE North, UK South, UK West,  West Central US, West Europe, West US, West US 2, West US 3

- The following regions support only the Operational (Snapshot) tier:

China East 2, China East 3, China North 2, China North 3, US GOV Arizona, US GOV Texas, US GOV Virginia,  Israel Central, Poland Central, and Spain Central 

>[!Note]
  >If you require geo-redundant backups with the ability to restore on demand, store your backups in the Vault tier and enable Cross Region Restore on your Backup Vault. This ensures that your backups are also available in the paired Azure region, allowing you to perform restores even if the primary region is unavailable. See the [list of Azure Paired Region](../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Supported Scenarios

- Azure Backup for AKS supports only clusters running supported Kubernetes versions. [Here's the list of the supported Kubernetes versions](/azure/aks/supported-kubernetes-versions). If your cluster is on an unsupported version, backup operations may still run, but failures during backup or restore are not covered. To ensure full support and reliability, upgrade to a supported version, validate your backups, and reach out to support if issues persist.

- Azure Backup for AKS supports only CSI driver-based persistent volumes (Azure Disks). In-tree volume plugins are not supported. Ensure that the CSI driver and snapshot are enabled for your cluster. If they're disabled, [enable these settings](/azure/aks/csi-storage-drivers#enable-csi-storage-drivers-on-an-existing-cluster). Also, if your workloads use in-tree volumes, [migrate them to CSI-based volumes to enable backup support](/azure/aks/csi-migrate-in-tree-volumes).

- Azure Backup for AKS currently supports only Azure disk-based persistent volumes provisioned using the CSI driver. Supported disk SKUs include Standard HDD, Standard SSD, and Premium SSD. 

- Both dynamically and statically provisioned volumes are supported; however, for static volumes, the *storage class* must be explicitly defined in the **YAML** specification—otherwise, the volume will be skipped during backup. 

- Azure Backup for AKS supports clusters that use either a [system-assigned](/azure/aks/use-managed-identity#update-an-existing-aks-cluster-to-use-a-system-assigned-managed-identity) or [user-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-cluster-to-use-a-user-assigned-managed-identity). Clusters configured with a service principal are not supported. To enable backup, update your cluster to use a system-assigned managed identity or a user-assigned managed identity.

- Azure Backup for AKS offers both Operational Tier and Vault Tier backups. Operational Tier backups consist of snapshots of supported persistent volume types, along with metadata stored in the blob container specified during the installation of the backup extension. Vault Tier backups, on the other hand, are stored offsite—securely and outside of your tenant. Using the backup policy, you can choose to enable both Operational and Vault Tier backups, or use only the Operational Tier.

- The Persistent Volume snapshots taken as part of Operational Tier backup are crash consistent by nature. Although Azure Backup for AKS does not currently support taking snapshots of all PVs at the exact same millisecond to achieve consistent snapshots across volumes.

- The minimum supported backup frequency in Azure Backup for AKS is every 4 hours, with additional options for 6, 8, 12, and 24-hour intervals. Backups are expected to be completed within a 2-hour window from the scheduled start time. These frequencies apply to Operational Tier backups, allowing multiple backups per day. However, only the first successful backup in a 24-hour period is eligible to be transferred to the Vault Tier. Once a backup is created in the Operational Tier, it can take up to four hours for it to be moved to the Vault Tier.

- Backup Vault and the AKS cluster should be located in the same region. However, they can reside in different subscriptions as long as they are within the same tenant. 

- Azure Backup for AKS supports restoring backups to the same or a different AKS cluster using both Operational and Vault Tier backups. The target AKS cluster can be in the same subscription or a different subscription, known as *Cross-Subscription Restore*.

- When restoring from the Operational Tier, the target AKS cluster must be in the same region as the backups. However, if the backups are stored in the Vault Tier with *Geo-redundant storage setting* and *Cross-Region Restore* enabled on the Backup Vault, you can restore to a different region within an Azure Paired Region. 

- To enable Azure Backup for AKS using Azure CLI, ensure you are using version 2.41.0 or later. You can upgrade the CLI by running the az upgrade command.

- To enable Azure Backup for AKS using Terraform, use version 3.99.0 or later.

- Azure Backup for AKS requires a backup extension to be installed. This extension requires a storage account and preferably an empty blob container inside it as input while installing. Do not use a blob container with non backup related files.

- The storage account specified during the installation of the backup extension must be in the same region as the AKS cluster. Only General-purpose v2 storage accounts are supported; Premium storage accounts are not supported.

- If the AKS cluster is deployed within a private virtual network, a private endpoint must be configured to enable backup operations.

- The Backup Extension can only be installed on node pools that use x86-based processors and run Ubuntu or Azure Linux as the operating system.

- Both the AKS cluster and the Backup Extension pods must be in a running and healthy state before performing any backup or restore operations, including the deletion of expired recovery points.

- Azure Backup for AKS provides alerts via Azure Monitor that enables you to have a consistent experience for alert management across different Azure services, including classic alerts, built-in Azure Monitor alerts, and custom log alerts for backup failure notifications. The supported backup alerts [are available here](monitoring-and-alerts-overview.md)

- Azure Backup for AKS supports various backup-related reports. Currently, backup data can only be viewed by selecting “All” for workload type in the report filters. The supported backup reports [are available here](monitoring-and-alerts-overview.md)

- Azure Backup for AKS supports [Enhanced Soft Delete](backup-azure-enhanced-soft-delete-about.md) for backups stored in the Vault Tier, providing protection against accidental or malicious deletion. For backups stored in the Operational Tier, the underlying snapshots are not protected by soft delete and can be permanently deleted.

- Azure Backup for AKS supports [Multi-user authorization (MUA)](multi-user-authorization-concept.md) allowing you to add an additional layer of protection to critical operations on your Backup vaults where backups are configured.

- Azure Backup for AKS supports the [Immutable vault](backup-azure-immutable-vault-concept.md), which helps protect your backup data by preventing operations that could result in the loss of recovery points. However, WORM (Write Once, Read Many) storage for backups is not currently supported.

- Azure Backup for AKS supports [Customer-Managed Key (CMK) encryption](backup-azure-immutable-vault-concept.md), but it is applicable only to backups stored in the Vault Tier.

- For successful backup and restore operations, the Backup vault's managed identity requires role assignments. If you don't have the required permissions, permission problems might happen during backup configuration or restore operations soon after you assign roles because the role assignments take a few minutes to take effect. [Learn about role definitions](azure-kubernetes-service-cluster-backup-concept.md#required-roles-and-permissions). 

## Unsupported Scenarios and Limitations

- Azure Backup for AKS does not support the following Azure Disk SKUs: Premium SSD v2 and Ultra Disks.

- Azure File Shares, Azure Blob Storage and Azure Container Storage based persistent volumes are not supported by AKS Backup. If you're using these types of persistent volumes in your AKS clusters, you can back them up separately using dedicated Azure Backup solutions. For more information, see [Azure file share backup](azure-file-share-backup-overview.md) and [Azure Blob Storage backup](blob-backup-overview.md).

- Any unsupported persistent volume types are automatically skipped during the backup process for the AKS cluster.

- The Backup Extension cannot be installed on Windows-based node pools or ARM64-based node pools. AKS clusters using such nodes should provision a separate Linux-based node pool (preferably a system node pool with x86-based processors) to support the installation of the Backup Extension.

- Azure Backup for AKS is currently not supported for Network Isolated AKS clusters. 

- Do not install the AKS Backup Extension alongside Velero or any Velero-based backup solutions, as this can cause conflicts during backup and restore operations. Additionally, ensure that your Kubernetes resources do not use labels or annotations containing the prefix `velero.io`, unless explicitly required by a supported scenario. The presence of such metadata may lead to unexpected behavior.

- Modifying the backup configuration or the snapshot resource group assigned to a backup instance during AKS cluster backup setup is not supported.

- The following namespaces are skipped from Backup Configuration and cannot be configured for backups: `kube-system`, `kube-node-lease`, `kube-public`. 

- Azure Backup does not automatically scale out AKS nodes, it only restores data and associated resources. Autoscaling is managed by AKS itself, using features like the Cluster Autoscaler. If autoscaling is enabled on the target cluster, it should handle resource scaling automatically. Before restoring, ensure that the target cluster has sufficient resources to avoid restore failures or performance issues.

- Here are the AKS backup limits:

  | Setting | Limit |
  | --- | --- |
  | Number of backup policies per Backup vault | 5,000 |
  | Number of backup instances per Backup vault | 5,000 |
  | Number of on-demand backups allowed in a day per backup instance | 10 |
  | Number of namespaces per backup instance | 800 | 
  | Number of allowed restores per backup instance in a day | 10 |  

### Limitations specific for Vaulted backup and Cross Region Restore

- Currently, Azure Disks with Persistent Volumes of size <= 1 TB are eligible to be moved to the Vault Tier; disks with the higher size are skipped in the backup data moved to the Vault Tier. 

- Currently, backup instances with <= 100 disks attached as persistent volume are supported. Backup and restore operations might fail if number of disks are higher than the limit. 

- Only Azure Disks with public access enabled from all networks are eligible to be moved to the Vault Tier; if there are disks with network access apart from public access, tiering operation fails. 

- *Disaster Recovery* feature is only available between Azure Paired Regions (if backup is configured in a Geo Redundant Backup vault with Cross Region Restore enabled on them). The backup data is only available in an Azure paired region. For example, if you have an AKS cluster in East US that is backed up in a Geo Redundant Backup vault with Cross Region Restore enabled on them, the backup data is also available in West US for restore.

- In the Vault Tier, only one scheduled recovery point is created per day, providing a Recovery Point Objective (RPO) of 24 hours in the primary region. In the secondary region, replication of this recovery point can take up to 12 additional hours, resulting in an effective RPO of up to 36 hours.

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
