---
title: Tutorial - Enable Vault Tier protection for Azure Kubernetes Cluster (AKS) clusters and restore backups in secondary region using Azure Backup
description: Learn how to enable Vault Tier protection for AKS clusters and restore backups in secondary region using Azure Backup.
ms.topic: tutorial
ms.date: 12/25/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Enable Vault Tier backups for AKS and restore across regions by using Azure Backup (preview)

This tutorial describes how to create backups for an AKS cluster stored in the Secondary Region (Azure Paired region). Then perform a Cross Region Restore to recover the AKS Cluster during regional disaster.

Azure Backup allows you to store AKS cluster backups in both **Operational Tier as snapshot** and **Vault Tier as blobs** (preview). This feature enables you to move snapshot-based AKS backups stored in Operational Tier to a Vault-standard Tier. You can use the backup policy, to define whether to store backups just in Operational Tier as snapshots or also protect them in Vault Tier along with Operational. Vaulted backups are stored offsite, which protects them from tenant compromise, malicious attacks, and ransomware threats. You can also retain the backup data for long term. Additionally, you can perform Cross Region Restore by configuring the Backup vault with storage redundancy set as global and Cross Region Restore property enabled. [Learn more](azure-kubernetes-service-backup-overview.md). 

## Consideration

For backups to be available in Secondary region (Azure Paired Region), [create a Backup vault](create-manage-backup-vault.md#create-backup-vault) with **Storage Redundancy** enabled as **Globally Redundant** and Cross Region Restore enable.

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-backup-storage-redundancy-parameter.png" alt-text="Screenshot shows how to enable the Backup Storage Redundance parameter.":::

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-cross-region-restore-parameter.png" alt-text="Screenshot shows how to enable the Cross Region Restore parameter.":::

## Configure Vault Tier backup (preview)

To use AKS backup for regional disaster recovery, store the backups in Vault Tier. You can enable this capability by [creating a backup policy](azure-kubernetes-service-cluster-backup.md#create-a-backup-policy) with retention policy set for Vault-standard datastore.

To set the retention policy in a backup policy, follow these steps:

1. Select the *backup policy*.

1. On the **Schedule + retention** tab, define the *frequency of backups* and *how long they need to be retained* in Operational and Vault Tier (also called *datastore*).

   **Backup Frequency**: Select the *backup frequency* (hourly or daily), and then choose the *retention duration* for the backups.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-frequency.png" alt-text="Screenshot that shows selection of backup frequency.":::

   **Retention Setting**: A new backup policy has two retention rules.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-period.png" alt-text="Screenshot that shows selection of retention period.":::

   You can also create additional retention rules to store backups for a longer duration that are taken daily or weekly.


   - **Default**: This  rule defines the default retention duration for all the operational tier backups taken. You can only edit this rule and  can’t delete it.

   - **First successful backup taken every day**: In addition to the default rule, every first successful backup of the day can be retained in the Operational datastore and Vault-standard store. You can edit and delete this rule (if you want to retain backups in Operational datastore).

     :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-configuration-for-vault-operational-tiers.png" alt-text="Screenshot that shows the retention configuration for Vault Tier and Operational Tier.":::


With the new backup policy, you can [configure protection for the AKS cluster](azure-kubernetes-service-cluster-backup.md#configure-backups) and store in both Operational Tier (as snapshot) and Vault Tier (as blobs). Once the configuration is complete, the backups stored in the vault are available in the Secondary Region (an [Azure paired region](../reliability/cross-region-replication-azure.md#azure-paired-regions)) for restore that can be used when during regional outage.


## Restore in secondary region (preview)

If there is an outage in the primary region, you can use the recovery points stored in Vault Tier in the secondary region to restore the AKS cluster.
Follow these steps:

1. Go to **Backup center** and select **Restore**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/start-kubernetes-cluster-restore.png" alt-text="Screenshot shows how to start the restore process.":::

2. On the next page, select **Select backup instance**, and then select the *instance* that you want to restore.

   If a disaster occurs and there is an outage in the Primary Region, select Secondary Region. Then, it allows you to choose recovery points available in the [Azure Paired Region](../reliability/cross-region-replication-azure.md#azure-paired-regions). 

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-backup-instance-for-restore.png" alt-text="Screenshot shows selection of backup instance for restore.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/choose-instances-for-restore.png" alt-text="Screenshot shows choosing instances for restore.":::
   
   :::image type="content" source="./media/tutorial-restore-aks-backups-across-regions/restore-to-secondary-region.png" alt-text="Screenshot shows the selection of the secondary region.":::

3. Click **Select restore point** to select the *restore point* you want to restore. 

   If the restore point is available in both Vault and Operation datastore, select the one you want to restore from.

   :::image type="content" source="./media/tutorial-restore-aks-backups-across-regions/select-restore-points.png" alt-text="Screenshot shows how to view the restore points.":::

   :::image type="content" source="./media/tutorial-restore-aks-backups-across-regions/choose-restore-points-for-kubernetes.png" alt-text="Screenshot shows selection of a restore point.":::


4. In the **Restore parameters** section, click **Select Kubernetes Service** and select the *AKS cluster* to which you want to restore the backup to.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/parameter-selection.png" alt-text="Screenshot shows how to initiate parameter selection.":::

   :::image type="content" source="./media/tutorial-restore-aks-backups-across-regions/select-kubernetes-service-instance.png" alt-text="Screenshot shows selection of AKS instance.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/set-for-restore-after-parameter-selection.png" alt-text="Screenshot shows the Restore page with the selection of Kubernetes parameter.":::


6. The backups stored in the Vault need to be moved to a Staging Location before being restored to the AKS Cluster. Provide a *snapshot resource group* and *storage account* as a Staging Location.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameters.png" alt-text="Screenshot shows the parameters to add for restore from Vault-standard storage.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameter-storage.png" alt-text="Screenshot shows the storage parameter to add for restore from Vault-standard storage.":::

>[!Note]
>Currently, resources created in the staging location can't belong within a Private Endpoint. Ensure that you enable _public access_ on the storage account provided as a staging location.

7. Select **Validate** to run validation on the cluster selections for restore.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/validate-restore-parameters.png" alt-text="Screenshot shows the validation of restore parameters.":::


8. Once the validation is successful, select **Restore** to trigger the restore operation.

   :::image type="content" source="./media/tutorial-restore-aks-backups-across-regions/trigger-restore.png" alt-text="Screenshot shows how to start the restore operation.":::

9. You can track this restore operation by the **Backup Job** named as **CrossRegionRestore**.

## Next steps

> [!div class="nextstepaction"]
> [Restore a backup for an AKS cluster](./azure-kubernetes-service-cluster-restore.md)
> [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
