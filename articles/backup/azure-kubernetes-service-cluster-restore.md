---
title: Restore Azure Kubernetes Service (AKS) using Azure Backup
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure Backup.
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - ignite-2023
  - ignite-2024
ms.date: 01/19/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud operations engineer, I want to restore a backed-up Azure Kubernetes Service cluster using Azure Backup, so that I can recover cluster resources and ensure continuity of services during disruptions."
---

# Restore Azure Kubernetes Service using Azure Backup 

This article describes how to restore backed-up Azure Kubernetes Service (AKS). You can also restore AKS cluster using [Azure PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md).

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Before you start

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#configure-item-level-restore-for-aks-cluster) to define parameters based on the cluster resources that are to be restored.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations) between the Backup vault and the AKS cluster.

- In case you're trying to restore a backup stored in Vault Tier, you need to provide a storage account in input as a staging location. Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one vault to staging storage account across tenants. Ensure that the staging storage account for the restore has the **AllowCrossTenantReplication** property set to **true**. 

- Azure Backup doesn't automatically scale out AKS nodes—it only restores data and associated resources. AKS manages autoscaling by using features like the Cluster Autoscaler. If autoscaling is enabled on the target cluster, it should handle resource scaling automatically. Before restoring, ensure that the target cluster has sufficient resources to avoid restore failures or performance issues 

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Restore the AKS clusters

To restore the backed-up AKS cluster, follow these steps:

1. Go to **Resiliency** and select **Recover**.

2. On the **Recover** pane, select **Azure Kubernetes Services** as the **Datasource type**, and then click **Select** under **Protected item**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-protected-item.png" alt-text="Screenshot that shows the selection of a protected AKS cluster for restore." lightbox="./media/azure-kubernetes-service-cluster-restore/select-protected-item.png":::

1. On the **Select Protected item** pane, select a backed-up AKS cluster from the list, and then click **Select**.
1. On the **Recover** pane, select **Continue**.

1. On the **Restore** pane, on the **Basics** tab, select **Next: Restore point**.

   If the instance is available in both *Primary* and *Secondary Region*, select the *region to restore* too, and then select **Continue**.

1. On the **Restore point** tab, for **Restore Point**, click **Select restore point** to select the *restore point* you want to restore. 

   If the restore point is available in both Vault and Operation datastore, select the one you want to restore from.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-restore-points-for-kubernetes.png" alt-text="Screenshot that shows the process to view the restore points.":::

1. On the **Select restore point** pane, select a restore point from the list, and then click **Select**.

1. On the **Restore** pane, select **Next: Restore parameters** to configure the restore parameters.

4. On the **Restore parameters** tab, click **Select Kubernetes Service**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/parameter-selection.png" alt-text="Screenshot shows how to initiate parameter selection." lightbox="./media/azure-kubernetes-service-cluster-restore/parameter-selection.png":::

1. On the **Select Kubernetes service** pane, select the target *AKS cluster* from the list, and then click **Select**.

1. On the **Restore** pane, to select the *backed-up cluster resources* for restore, click **Select resources**.

   Learn more about [restore configurations](#configure-item-level-restore-for-aks-cluster).

   If you select a recovery point for restore from *Vault-standard datastore*, then provide a *snapshot resource group* and *storage account* as the staging location.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameters.png" alt-text="Screenshot shows the parameters to add for restore from Vault-standard storage.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameter-storage.png" alt-text="Screenshot shows the storage parameter to add for restore from Vault-standard storage.":::

   >[!Note]
   >Currently, resources created in the staging location can't belong within a Private Endpoint. Ensure that you enable _public access_ on the storage account provided as a staging location.

1. Select **Validate** to run validation on the cluster selections for restore.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/validate-restore-parameters.png" alt-text="Screenshot shows the validation of restore parameters.":::


1. After the validation is successful, select **Next: Review + restore**.
1. On the **Review + restore** pane, review the selections, and then select **Restore** to restore the backups to the selected cluster.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/review-restore-tab.png" alt-text="Screenshot shows the Review + restore tab for restore." lightbox="./media/azure-kubernetes-service-cluster-restore/review-restore-tab.png":::

### Configure item-level restore for AKS cluster

As part of item-level restore capability of AKS backup, you can utilize multiple restore configuration filters   to perform restore.

- Select the *Namespaces* that you want to restore from the list. The list shows only the backed-up Namespaces. 

  :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-namespace.png" alt-text="Screenshot shows selection of Namespace." lightbox="./media/azure-kubernetes-service-cluster-restore/select-namespace.png":::

  You can also select the checkboxes if you want to restore cluster scoped resources and persistent volumes (of Azure Disk only).

  To restore specific cluster resources, use the labels attached to them in the textbox. Only resources with the entered labels are backed up.

- You can provide *API Groups* and *Kinds* to restore specific resource types. The list of *API Group* and *Kind* is available in the *Appendix*. You can enter *multiple API Groups*.

  :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/use-api-for-restore.png" alt-text="Screenshot shows the usage of API for restore." lightbox="./media/azure-kubernetes-service-cluster-restore/use-api-for-restore.png":::

- To restore a workload, such as Deployment from a backup via API Group, the entry should be: 

   - **Kind**: Select **Deployment**.
   - **Group**: Select **Group**.
   - **Namespace Mapping**: To migrate the backed-up cluster resources to a different *Namespace*, select the *backed-up Namespace*, and then enter the *Namespace* to which you want to migrate the resources.

     If the *Namespace* doesn't exist in the AKS cluster, it gets created. If a conflict occurs during the cluster resources restore, you can skip or patch the conflicting resources.
   
     :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-backed-up-namespace-for-migrate.png" alt-text="Screenshot shows the selection of namespace for migration." lightbox="./media/azure-kubernetes-service-cluster-restore/select-backed-up-namespace-for-migrate.png":::

Azure Backup for AKS currently supports the following two options when doing a restore operation when resource clash happens (backed-up resource has the same name as the resource in the target AKS cluster). You can choose one of these options when defining the restore configuration.

- **Skip**: This option is selected by default. For example, if you backed up a PVC named *pvc-azuredisk* and you're restoring it in a target cluster that has the PVC with the same name, then the backup extension skips restoring the backed-up persistent volume claim (PVC). In such scenarios, we recommend you to delete the resource from the cluster, and then do the restore operation.

- **Patch**: This option allows the patching mutable variable in the backed-up resource on the resource in the target cluster. If you want to update the number of replicas in the target cluster, you can opt for patching as an operation. 

>[!Note]
>AKS backup currently doesn't delete and recreate resources in the target cluster if they already exist. If you attempt to restore Persistent Volumes in the original location, delete the existing Persistent Volumes, and then do the restore operation.

## Restore the AKS clusters in secondary region

To restore the AKS cluster in the secondary region, [configure Geo redundancy and Cross Region Restore in the Backup vault](azure-kubernetes-service-cluster-backup.md#create-a-backup-vault), and then [trigger restore](tutorial-restore-aks-backups-across-regions.md#restore-in-secondary-region).

## Next steps

- [Manage Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-manage-backups.md)
- [Overview of Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
