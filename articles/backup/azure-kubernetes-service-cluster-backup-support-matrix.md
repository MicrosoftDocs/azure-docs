---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: conceptual
ms.date: 04/21/2024
ms.custom:
  - references_regions
  - ignite-2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Kubernetes Service backup support matrix

You can use [Azure Backup](./backup-overview.md) to help protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

>[!Note]
>Vaulted backup and Cross Region Restore for AKS using Azure Backup are currently in preview.

## Supported regions

- Operational Tier support for AKS backup is supported in all the following Azure public cloud regions: East US, North Europe, West Europe, South East Asia, West US 2, East US 2, West US, North Central US, Central US, France Central, Korea Central, Australia East, UK South, East Asia, West Central US, Japan East, South Central US, West US 3, Canada Central, Canada East, Australia South East, Central India, Norway East, Germany West Central, Switzerland North, Sweden Central, Japan West, UK West, Korea South, South Africa North, South India, France South, Brazil South, and UAE North.

- Vault Tier and Cross Region Restore support (preview) for AKS backup are available in the following regions: East US, West US, West US 3, North Europe, West Europe, North Central US, South Central US, East US 2, Central US, UK South, UK West, East Asia, and South-East Asia.

  >[!Note]
  >If Cross Region Restore is enabled, backups stored in Vault Tier will be available in the Azure Paired region. See the [list of Azure Paired Region](../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Limitations

- AKS backup supports AKS clusters with Kubernetes version *1.22* or later. This version has Container Storage Interface (CSI) drivers installed.

- Before you install the backup extension in an AKS cluster, ensure that the CSI drivers and snapshot are enabled for your cluster. If they're disabled, [enable these settings](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).

- AKS backups don't support in-tree volumes. You can back up only CSI driver-based volumes. You can [migrate from tree volumes to CSI driver-based persistent volumes](../aks/csi-migrate-in-tree-volumes.md).

- Currently, an AKS backup supports only the backup of Azure disk-based persistent volumes (enabled by the CSI driver). The supported Azure Disk SKUs are Standard HDD, Standard SSD, and Premium SSD. The disks belonging to Premium SSD v2 and Ultra Disk SKU are not supported. Both static and dynamically provisioned volumes are supported. For backup of static disks, the persistent volumes specification should have the *storage class* defined in the **YAML** file, otherwise such persistent volumes will be skipped from the backup operation.

- Azure Files shares and Azure Blob Storage persistent volumes are currently not supported by AKS backup due to lack of CSI Driver-based snapshotting capability. If you're using said persistent volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions. For more information, see [Azure file share backup](azure-file-share-backup-overview.md) and [Azure Blob Storage backup](blob-backup-overview.md).

- Any unsupported persistent volume type is skipped while a backup is being created for the AKS cluster.

- Currently, AKS clusters using a Service Principal aren't supported. If your AKS cluster uses a Service Principal, you can [update your AKS cluster to use a System Identity](../aks/use-managed-identity.md#enable-managed-identities-on-an-existing-aks-cluster).

- You can deploy the Backup Extension in the Ubuntu-based cluster nodes. AKS Clusters with the Windows-based nodes aren't supported by Azure Backup for AKS.

- You must install the backup extension in the AKS cluster. If you're using Azure CLI to install the backup extension, ensure that the version is 2.41 or later. Use `az upgrade` command to upgrade the Azure CLI.

- The blob container provided as input during installation of the backup extension should be in the same region and subscription as that of the AKS cluster. Only blob containers in a General-purpose V2 Storage Account are supported and Premium Storage Account are not supported.   

- The Backup vault and the AKS cluster should be in the same region and subscription.

- Azure Backup for AKS provides both Operation Tier (Snapshot) and Vault Tier backup. Multiple backups per day can be stored in Operational Tier, with only one backup per day to be stored in the Vault.

- Currently, the modification of a backup policy and the modification of a snapshot resource group (assigned to a backup instance during configuration of the AKS cluster backup) aren't supported.

- AKS clusters and backup extension pods should be in a running state before you perform any backup and restore operations. This state includes deletion of expired recovery points.

- For successful backup and restore operations, the Backup vault's managed identity requires role assignments. If you don't have the required permissions, permission problems might happen during backup configuration or restore operations soon after you assign roles because the role assignments take a few minutes to take effect. [Learn about role definitions](azure-kubernetes-service-cluster-backup-concept.md#required-roles-and-permissions).

- Here are the AKS backup limits:

  | Setting | Limit |
  | --- | --- |
  | Number of backup policies per Backup vault | 5,000 |
  | Number of backup instances per Backup vault | 5,000 |
  | Number of on-demand backups allowed in a day per backup instance | 10 |
  | Number of allowed restores per backup instance in a day | 10 |

- Configuration of a storage account with private endpoint is supported.

### Additional limitations for Vaulted backup and Cross Region Restore (preview)

- Only Azure Disk with Persistent Volumes of size <= 1 TB are eligible to be moved to the Vault Tier; otherwise, they are skipped in the backup data. 

- *Disaster Recovery* feature is only available between Azure Paired Regions (if backup is configured in a Geo Redundant Backup vault). The backup data is only available in an Azure paired region. For example, if you have an AKS cluster in East US that is backed up in a Geo Redundant Backup vault, the backup data is also available in West US for restore.

- Only one scheduled recovery point is available in Vault Tier per day that is providing an RPO of 24 hours. For secondary region, the recovery point can take up to 12 hours, thus providing an RPO of 36 hours.

- During restore from Vault Tier, the provided staging location shouldn't have a *Read*/*Delete Lock*; otherwise, hydrated resources aren't cleaned after restore. 

- Don't install AKS Backup Extension along with Velero or other Velero-based backup services. This could lead to disruption of backup service during any future Velero upgrades driven by you or AKS backup

## Next steps

- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
- [Back up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
