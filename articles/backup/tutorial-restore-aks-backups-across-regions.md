---
title: Tutorial - Enable Vault-Tier protection for AKS clusters and restore backups in secondary region using Azure Backup
description: Learn how to enable Vault-Tier protection for AKS clusters and restore backups in secondary region using Azure Backup.
ms.topic: tutorial
ms.date: 11/14/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Enable disaster recovery for AKS backups and restore across Regions (preview)

This tutorial describes how to create backups for an AKS cluster available in the Secondary Region (Azure Paired region) and then perform a disaster recovery using Cross Region Restore.

## Consideration

For backups to be available in Secondary region (Azure Paired Region), [create a Backup vault](create-manage-backup-vault.md#create-backup-vault) with **Storage Redundancy** enabled as **Globally Redundant** and Cross Region Restore enable.

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-backup-storage-redundancy-parameter.png" alt-text="Screenshot shows how to enable the Backup Storage Redundance parameter.":::

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-cross-region-restore-parameter.png" alt-text="Screenshot shows how to enable the Cross Region Restore parameter.":::

## Configure Vault Tier Backup

To use AKS backup against regional disaster recovery, store the backups in Vault Tier. You can enable this capability by [creating a backup policy](azure-kubernetes-service-cluster-backup.md#create-a-backup-policy) with retention policy set for Vault-standard datastore.

To set the retention policy in an backup policy, follow these steps:

1. Select the *backup policy*.

1. On the **Schedule + retention** tab, define the *frequency of backups* and *how long they need to be retained* in Operational and Vault Tier (also called *datastore*).

   **Backup Frequency**: Select the *backup frequency* (hourly or daily), and then choose the *retention duration* for the backups.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-frequency.png" alt-text="Screenshot that shows selection of backup frequency.":::

   **Retention Setting**: A new backup policy has two retention rules.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-period.png" alt-text="Screenshot that shows selection of retention period.":::

   You can also create additional retention rules to store backups that are taken daily or weekly to be stored for a longer duration.


   - **Default**: This  rule defines the default retention duration for all the operational tier backups taken. You can only edit this rule and  can’t delete it.

   - **First successful backup taken every day**: In addition to the default rule, every first successful backup of the day can be retained in the Operational datastore and Vault-standard store. You can edit and delete this rule (if you want to retain backups in Operational datastore).

     :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-configuration-for-vault-operational-tiers.png" alt-text="Screenshot that shows the retention configuration for Vault Tier and Operational Tier.":::


   You can also define similar rules for the *First successful backup taken every week, month, and year*.

With the new bckup policy, you can [now [configure protection for the AKS cluster](azure-kubernetes-service-cluster-backup.md#configure-backups) and then protect backups using the backup policy against regional disaster.


## Restore in secondary region

## Restore the AKS clusters

To restore the backed-up AKS cluster, follow these steps:

1. Go to **Backup center** and select **Restore**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/start-kubernetes-cluster-restore.png" alt-text="Screenshot shows how to start the restore process.":::

2. On the next page, click **Select backup instance**, and then select the *instance* that you want to restore.

   If the instance is available in both *Primary* and *Secondary Region*, select the *region to restore* too, and then select **Continue**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-backup-instance-for-restore.png" alt-text="Screenshot shows selection of backup instance for restore.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/choose-instances-for-restore.png" alt-text="Screenshot shows choosing instances for restore.":::
   
   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/starting-kubernetes-restore.png" alt-text="Screenshot shows starting restore.":::

3. Click **Select restore point** to select the *restore point* you want to restore. 

   If the restore point is available in both Vault and Operation datastore, select the one you want to restore from.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-restore-points-for-kubernetes.png" alt-text="Screenshot shows how to view the restore points.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/choose-restore-points-for-kubernetes.png" alt-text="Screenshot shows selection of a restore point.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/open-restore-page.png" alt-text="Screenshot shows how to go to the Restore page.":::


4. In the **Restore parameters** section, click **Select Kubernetes Service** and select the *AKS cluster* to which you want to restore the backup to.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/parameter-selection.png" alt-text="Screenshot shows how to initiate parameter selection.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-kubernetes-service-parameter.png" alt-text="Screenshot shows selection of parameter Kubernetes Service.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/set-for-restore-after-parameter-selection.png" alt-text="Screenshot shows the Restore page with the selection of Kubernetes parameter.":::

5. To select the *backed-up cluster resources* for restore, click **Select resources**.

   Learn more about [restore configurations](#restore-configurations).

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/select-resources-to-restore-page.png" alt-text="Screenshot shows the Select Resources to restore page.":::

6. If you have opted for restore from *Vault-standard datastore*, then provide a *snapshot resource group* and *storage account* as the staging location.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameters.png" alt-text="Screenshot shows the parameters to add for restore from Vault-standard storage.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/restore-parameter-storage.png" alt-text="Screenshot shows the storage parameter to add for restore from Vault-standard storage.":::

7. Select **Validate** to run validation on the cluster selections for restore.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/validate-restore-parameters.png" alt-text="Screenshot shows the validation of restore parameters.":::


8. Once the validation is successful, select **Review + restore** and restore the backups to the selected cluster.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-restore/review-restore-tab.png" alt-text="Screenshot shows the Review + restore tab for restore.":::

9. Track this restore operation by using the name **CrossRegionRestore**.

## Next step

> [!div class="nextstepaction"]
> [Restore a backup for an AKS cluster](./azure-kubernetes-service-cluster-restore.md)
> [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)