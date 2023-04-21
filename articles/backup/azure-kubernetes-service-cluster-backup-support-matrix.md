---
title: Azure Kubernetes Service (AKS) backup support matrix
description: This article provides a summary of support settings and limitations of Azure Kubernetes Service (AKS) backup.
ms.topic: conceptual
ms.date: 03/27/2023
ms.custom: references_regions
ms.service: backup
author: jyothisuri
ms.author: jsuri
---

# Azure Kubernetes Service backup support matrix (preview)

You can use [Azure Backup](./backup-overview.md) to protect Azure Kubernetes Service (AKS). This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

AKS backup is available in all the Azure public cloud regions, East US, North Europe, West Europe, South East Asia, West US 2, East US 2, West US, North Central US, Central US, France Central, Korea Central, Australia East, UK South, East Asia, West Central US, Japan East, South Central US, West US3, Canada Central, Canada East, Australia South East, Central India, Norway East, Germany West Central, Switzerland North, Sweden Central, Japan West, UK West, Korea South, South Africa North, South India, France South, Brazil South, UAE North.

## Limitations

- AKS backup supports AKS clusters with Kubernetes version 1.21.1 or later. This version of cluster has CSI drivers installed.

- Container Storage Interface (CSI) driver supports performing backup and restore operations for persistent volumes.

- Currently, AKS backup only supports backup of Azure Disk-based persistent volumes (enabled by CSI driver). If you’re using Azure File Share and Azure Blob type Persistent Volumes in your AKS clusters, you can configure backup for them via the Azure Backup solutions available for [Azure File Share](azure-file-share-backup-overview.md) and [Azure Blob](blob-backup-overview.md).

- Tree Volumes aren’t supported by AKS backup. You can back up only CSI driver based volumes. You can [migrate from tree volumes to CSI driver based persistent volumes](../aks/csi-migrate-in-tree-volumes.md).

- Before you install the Backup Extension in the AKS cluster, ensure that the *CSI drivers*, and *snapshot* are enabled for your cluster. If  disabled, [enable these settings](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).

- The Backup Extension uses the AKS cluster's Managed System Identity to perform backup operations. So, AKS clusters using *Service Principal* aren't supported by ASK backup. You can [update your AKS cluster to use Managed System Identity](../aks/use-managed-identity.md#update-an-aks-cluster-to-use-a-managed-identity).

- You must install Backup Extension in the AKS cluster. If you're using Azure CLI to install the Backup Extension, ensure that the CLI version is to  *2.41* or later. Use `az upgrade` command to upgrade Azure CLI.

- The blob container provided as input during Backup Extension installation should be in the same region and subscription as that of the AKS cluster.

- Both the Backup vault and AKS cluster should be in the same subscription and region.

- Azure Backup provides operational (snapshot) tier backup of AKS clusters with the support for multiple backups per day. The backups aren't copied to the backup vault.

- Currently, the modification of backup policy and the modification of snapshot resource group (assigned to a backup instance during configuration of the AKS cluster backup) aren't supported.

- AKS cluster and Backup Extension pods should be in running state for any backup and restore operations to be performed. This includes deletion of expired recovery points.

- For successful backup and restore operations, role assignments are required by the Backup vault's managed identity. If you don't have the required permissions, you may see permission issues during backup configuration or restore operations soon after assigning roles because the role assignments take a few minutes to take effect. Learn about the [role definitions](azure-kubernetes-service-cluster-backup-concept.md#required-roles-and-permissions).

- AKS backup limits are:

  | Setting | Maximum limit |
  | --- | --- |
  | Number of backup policies per Backup vault | 5000 |
  | Number of backup instances per Backup vault | 5000 |
  | Number of on-demand backups allowed in a day per backup instance | 10 |
  | Number of allowed restores per backup instance in a day | 10 |

## Next steps

- [About Azure Kubernetes Service cluster backup (preview)](azure-kubernetes-service-cluster-backup-concept.md)
- [Back up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-restore.md)