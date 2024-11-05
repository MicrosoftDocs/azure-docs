---
title: Restore Azure Kubernetes Service (AKS) using Azure Backup
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure Backup.
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - ignite-2023
ms.date: 12/29/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Kubernetes Service using Azure Backup 

This article describes how to restore backed-up Azure Kubernetes Service (AKS).

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

> [!NOTE]
> Vaulted backup and Cross Region Restore for AKS using Azure Backup are currently in preview.

## Before you start

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-configurations) to define parameters based on the cluster resources that are to be restored.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations) between the Backup vault and the AKS cluster.

- In case you are trying to restore a backup stored in Vault Tier, you need to provide a storage account in input as a staging location. Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one vault to staging storage account across tenants. Ensure that the staging storage account for the restore has the **AllowCrossTenantReplication** property set to **true**. 

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Restore the AKS clusters

To restore the backed-up AKS cluster, follow these steps:

1. In the Azure portal, navigate to your AKS cluster resource.
1. From the service menu, under **Settings**, select **Backup** > **Restore**.
1. On the *Start: Restore* page, select **Select backup instance**, select the *instance* that you want to restore, and then select **Select** > **Continue**.
1. On the *Basics* tab of the *Restore* page, select the *Restore Region* you want to restore the backup to, and then select **Next: Restore point**.
1. Select **Select restore point**, select the *restore point* you want to restore from, and then select **Select** > **Next: Restore parameters**.
1. On the *Restore parameters* tab, ensure that the *AKS cluster* is selected as the *restore target*, and then select **Validate**.
1. Once the validation completes, select **Next: Review + restore** > **Restore**.

### Restore configurations

As part of item-level restore capability of AKS backup, you can utilize multiple restore configuration filters to perform restore.

- On the *Restore parameters* tab, next to *Restore configuration*, select **Select resources**, and select the *Namespaces* that you want to restore from the list. The list shows only the backed-up namespaces.

  :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-namespace.png" alt-text="Screenshot shows selection of Namespace.":::

- You can provide *API Groups* and *Kinds* to restore specific resource types. The list of *API Group* and *Kind* is available in the *Appendix*. You can enter *multiple API Groups*.
- To restore a workload, such as Deployment from a backup via API Group, the entry should be:

  - **Kind**: Select **Deployment**.
  - **Group**: Select **Group**.
  - **Namespace Mapping**: To migrate the backed-up cluster resources to a different *Namespace*, select the *backed-up Namespace*, and then enter the *Namespace* to which you want to migrate the resources.

Azure Backup for AKS currently supports the following two options when doing a restore operation when resource clash happens (backed-up resource has the same name as the resource in the target AKS cluster). You can choose one of these options when defining the restore configuration.

- **Skip**: This option is selected by default. For example, if you backed up a PVC named *pvc-azuredisk* and you're restoring it in a target cluster that has the PVC with the same name, then the backup extension skips restoring the backed-up persistent volume claim (PVC). In such scenarios, we recommend you to delete the resource from the cluster, and then do the restore operation.

- **Patch**: This option allows the patching mutable variable in the backed-up resource on the resource in the target cluster. If you want to update the number of replicas in the target cluster, you can opt for patching as an operation.

> [!NOTE]
> AKS backup currently doesn't delete and recreate resources in the target cluster if they already exist. If you attempt to restore Persistent Volumes in the original location, delete the existing Persistent Volumes, and then do the restore operation.

## Restore in secondary region (preview)

To restore the AKS cluster in the secondary region, [configure Geo redundancy and Cross Region Restore in the Backup vault](azure-kubernetes-service-cluster-backup.md#create-a-backup-vault), and then [trigger restore](tutorial-restore-aks-backups-across-regions.md#restore-in-secondary-region-preview).

## Next steps

- [Manage Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
