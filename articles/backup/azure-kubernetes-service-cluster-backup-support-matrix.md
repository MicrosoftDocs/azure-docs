---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: conceptual
ms.date: 08/17/2023
ms.custom:
  - references_regions
  - ignite-2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Kubernetes Service backup support matrix

You can use [Azure Backup](./backup-overview.md) to help protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

AKS backup is available in all the Azure public cloud regions: East US, North Europe, West Europe, South East Asia, West US 2, East US 2, West US, North Central US, Central US, France Central, Korea Central, Australia East, UK South, East Asia, West Central US, Japan East, South Central US, West US3, Canada Central, Canada East, Australia South East, Central India, Norway East, Germany West Central, Switzerland North, Sweden Central, Japan West, UK West, Korea South, South Africa North, South India, France South, Brazil South, and UAE North.

## Limitations

- AKS backup supports AKS clusters with Kubernetes version *1.22* or later. This version has Container Storage Interface (CSI) drivers installed.

- Before you install the backup extension in an AKS cluster, ensure that the CSI drivers and snapshot are enabled for your cluster. If they're disabled, [enable these settings](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).

- AKS backups don't support in-tree volumes. You can back up only CSI driver-based volumes. You can [migrate from tree volumes to CSI driver-based persistent volumes](../aks/csi-migrate-in-tree-volumes.md).

- Currently, an AKS backup supports only the backup of Azure disk-based persistent volumes (enabled by the CSI driver). Also, these persistent volumes should be dynamically provisioned as static volumes are not supported.

- Azure Files shares and Azure Blob Storage persistent volumes are currently not supported by AKS backup due to lack of CSI Driver-based snapshotting capability. If you're using said persistent volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions. For more information, see [Azure file share backup](azure-file-share-backup-overview.md) and [Azure Blob Storage backup](blob-backup-overview.md).

- Any unsupported persistent volume type is skipped while a backup is being created for the AKS cluster.

- The backup extension uses the AKS cluster's system identity to do the backup operations. Currently, AKS clusters using a User Identity, or a Service Principal aren't supported. If your AKS cluster uses a Service Principal, you can [update your AKS cluster to use a System Identity](../aks/use-managed-identity.md#enable-managed-identities-on-an-existing-aks-cluster).

- You must install the backup extension in the AKS cluster. If you're using Azure CLI to install the backup extension, ensure that the version is 2.41 or later. Use `az upgrade` command to upgrade the Azure CLI.

- The blob container provided as input during installation of the backup extension should be in the same region and subscription as that of the AKS cluster.

- The Backup vault and the AKS cluster should be in the same region and subscription.

- Azure Backup provides operational (snapshot) tier backup of AKS clusters with support for multiple backups per day. The backups aren't copied to the Backup vault.

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

## Next steps

- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
- [Back up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
