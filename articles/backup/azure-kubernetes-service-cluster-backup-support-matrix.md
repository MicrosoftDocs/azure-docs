---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: reference
ms.date: 09/09/2024
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Kubernetes Service backup support matrix

You can use [Azure Backup](./backup-overview.md) to help protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

- Operational Tier support for AKS backup is supported in all the following Azure public cloud regions: East US, North Europe, West Europe, South East Asia, West US 2, East US 2, West US, North Central US, Central US, France Central, Korea Central, Australia East, UK South, East Asia, West Central US, Japan East, South Central US, West US 3, Canada Central, Canada East, Australia South East, Central India, Norway East, Germany West Central, Switzerland North, Sweden Central, Japan West, UK West, Korea South, South Africa North, South India, France South, Brazil South, UAE North, China East 2, China East 3, China North 2, China North 3, USGov Virginia, USGov Arizona, and USGov Texas.

- Vault Tier and Cross Region Restore support for AKS backup are available in the following regions: East US, West US, West US 3, North Europe, West Europe, North Central US, South Central US, West Central US, East US 2, Central US, UK South, UK West, East Asia, South-East Asia, Japan East South India, Central India, Canada Central, and Norway East.


  >[!Note]
  >Enable Cross Region Restore capability for your Backup Vault to have your backups available in an Azure paired region. See the [list of Azure Paired Region](../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Limitations

- Azure Backup won't address failures occurring during backup or restore operations for Kubernetes clusters running unsupported Kubernetes versions. While backup operations continue to run, please upgrade your clusters to a supported version, validate the backup operations, and reach out if the issue persists. [Here's the list of the supported Kubernetes versions](/azure/aks/supported-kubernetes-versions.md)

- Before you install the backup extension in an AKS cluster, ensure that the CSI drivers and snapshot are enabled for your cluster. If they're disabled, [enable these settings](/azure/aks/csi-storage-drivers#enable-csi-storage-drivers-on-an-existing-cluster).

- Provide a new and empty blob container as input while installing backup extension in an AKS cluster for the first time. Don't use same blob container for more than one AKS cluster. 

- AKS backups don't support in-tree volumes. You can back up only CSI driver-based volumes. You can [migrate from tree volumes to CSI driver-based persistent volumes](/azure/aks/csi-migrate-in-tree-volumes).

- Currently, an AKS backup supports only the backup of Azure disk-based persistent volumes (enabled by the CSI driver). The supported Azure Disk SKUs are Standard HDD, Standard SSD, and Premium SSD. The disks belonging to Premium SSD v2 and Ultra Disk SKU aren't supported. Both static and dynamically provisioned volumes are supported. For backup of static disks, the persistent volumes specification should have the *storage class* defined in the **YAML** file, otherwise such persistent volumes are skipped from the backup operation.

- Azure Files shares and Azure Blob Storage persistent volumes are not supported by AKS backup due to lack of CSI Driver-based snapshotting capability. If you're using said persistent volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions. For more information, see [Azure file share backup](azure-file-share-backup-overview.md) and [Azure Blob Storage backup](blob-backup-overview.md).

- Any unsupported persistent volume type is skipped while a backup is being created for the AKS cluster.

- Currently, AKS clusters using a service principal aren't supported. If your AKS cluster uses a service principal for authorization, you can update the cluster to use a [system-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-aks-cluster-to-use-a-system-assigned-managed-identity) or a [user-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-cluster-to-use-a-user-assigned-managed-identity).

- You can only install the Backup Extension on agent nodes with Ubuntu and Azure Linux as Operating System. AKS Clusters with Windows based agent nodes don't allow Backup Extension installation.

- You can't install Backup Extension in AKS Cluster with Arm64 based agent nodes irrespective of Operating System (Ubuntu/Azure Linux/Windows) running on these nodes.

- Don't install AKS Backup Extension along with Velero or other Velero-based backup services. This could lead to disruption of backup service during any future Velero upgrades driven by you or AKS backup  

- You must install the backup extension in the AKS cluster. If you're using Azure CLI to install the backup extension, ensure that the version is 2.41 or later. Use `az upgrade` command to upgrade the Azure CLI.

- In case you're using Terraform to enable Azure Backup for AKS, ensure that the Terraform version being used in 3.99 or above.

- The blob container provided as input during installation of the backup extension should be in the same region and subscription as that of the AKS cluster. Only blob containers in a General-purpose V2 Storage Account are supported and Premium Storage Account aren't supported.   

- The Backup vault and the AKS cluster should be in the same region and subscription.

- Azure Backup for AKS provides both Operational Tier (Snapshot) and Vault Tier backup. Multiple backups per day can be stored in Operational Tier, with only one backup per day to be stored in the Vault as per the retention policy defined.

- Currently, the modification of a backup policy and the modification of a snapshot resource group (assigned to a backup instance during configuration of the AKS cluster backup) aren't supported.

- AKS clusters and backup extension pods should be in a running state before you perform any backup and restore operations. This state includes deletion of expired recovery points.

- For successful backup and restore operations, the Backup vault's managed identity requires role assignments. If you don't have the required permissions, permission problems might happen during backup configuration or restore operations soon after you assign roles because the role assignments take a few minutes to take effect. [Learn about role definitions](azure-kubernetes-service-cluster-backup-concept.md#required-roles-and-permissions).

- Backup vault doesn't support Azure Lighthouse. Thus, cross tenant management can't be enabled by Lighthouse for Azure Backup for AKS and you cannot backup/restore AKS Clusters across tenant.

- The following namespaces are skipped from Backup Configuration and not configured for backups: `kube-system`, `kube-node-lease`, `kube-public`.

- Here are the AKS backup limits:

  | Setting | Limit |
  | --- | --- |
  | Number of backup policies per Backup vault | 5,000 |
  | Number of backup instances per Backup vault | 5,000 |
  | Number of on-demand backups allowed in a day per backup instance | 10 |
  | Number of namespaces per backup instance | 800 | 
  | Number of allowed restores per backup instance in a day | 10 |

- Configuration of a storage account with private endpoint is supported.
- To enable Azure Backup for AKS via Terraform, its version should be >= 3.99.

### Other limitations for Vaulted backup and Cross Region Restore

- Currently, Azure Disks with Persistent Volumes of size <= 1 TB are eligible to be moved to the Vault Tier; disks with the higher size are skipped in the backup data moved to the Vault Tier. 

- Currently, backup instances with <= 100 disks attached as persistent volume are supported. Backup and restore operations might fail if number of disks are higher than the limit. 

- Only Azure Disks with public access enabled from all networks are eligible to be moved to the Vault Tier; if their are disks with network access apart from public access, tiering operation will fail. 

- *Disaster Recovery* feature is only available between Azure Paired Regions (if backup is configured in a Geo Redundant Backup vault). The backup data is only available in an Azure paired region. For example, if you have an AKS cluster in East US that is backed up in a Geo Redundant Backup vault, the backup data is also available in West US for restore.

- Only one scheduled recovery point is available in Vault Tier per day that is providing an RPO of 24 hours in the primary region. For secondary region, the recovery point can take up to 12 hours, thus providing an RPO of 36 hours.

- During restore from Vault Tier, the hydrated resources in the staging location which includes a storage account and a resource group aren't cleaned after restore. They have to be deleted manually.

- In case the target cluster is within a virtual network, enable a private endpoint between the cluster and the staging storage account.

- If the target AKS cluster version differs from the version used during backup, the restore operation may fail or complete with warnings for various scenarios like deprecated resources in the newer cluster version. In case of restoring from Vault tier, you can use the hydrated resources in the staging location to restore application resources to the target cluster.

- Currently Vault Tier based backup isn't supported with Terraform deployment.

## Next steps

- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
- [Back up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
