---
title: Manage Backup vaults
description: Learn how to manage the Backup vaults.
ms.topic: how-to
ms.date: 10/10/2024
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Manage Backup vaults

This article describes how to manage Backup vaults once they're created.

A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such Azure Database for PostgreSQL servers and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides the **Azure role-based access control (Azure RBAC)** feature. Azure RBAC provides fine-grained access management control in Azure. [Azure provides various built-in roles](../role-based-access-control/built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). Backup vaults are compatible with Azure RBAC, which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md).

## Monitor and manage the Backup vault

This section explains how to use the Backup vault **Overview** dashboard to monitor and manage your Backup vaults. The overview pane contains two tiles: **Jobs** and **Instances**.

:::image type="content" source="./media/backup-vault-overview/overview-dashboard.png" alt-text="Screenshot shows the Overview dashboard.":::

### Manage Backup instances

In the **Jobs** tile, you get a summarized view of all backup and restore related jobs in your Backup vault. Selecting any of the numbers in this tile allows you to view more information on jobs for a particular datasource type, operation type, and status.

:::image type="content" source="./media/backup-vault-overview/backup-instances.png" alt-text="Screenshot shows the Backup instances.":::

### Manage Backup jobs

In the **Backup Instances** tile, you get a summarized view of all backup instances in your Backup vault. Selecting any of the numbers in this tile allows you to view more information on backup instances for a particular datasource type and protection status.

:::image type="content" source="./media/backup-vault-overview/backup-jobs.png" alt-text="Screenshot shows the Backup jobs.":::

## Move a Backup vault across Azure subscriptions/resource groups

This section explains how to move a Backup vault (configured for Azure Backup) across Azure subscriptions and resource groups using the Azure portal.

>[!Note]
>You can also move Backup vaults to a different resource group or subscription using [PowerShell](/powershell/module/az.resources/move-azresource) and [CLI](/cli/azure/resource#az-resource-move).

### Supported regions

The vault move across subscriptions and resource groups is supported in all public and national regions.

### Use Azure portal to move Backup vault to a different resource group

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open the list of Backup vaults and select the vault you want to move.

   The vault dashboard displays the vault details.

   :::image type="content" source="./media/backup-vault-overview/vault-dashboard-to-move-to-resource-group-inline.png" alt-text="Screenshot showing the dashboard of the vault to be moved to another resource group." lightbox="./media/backup-vault-overview/vault-dashboard-to-move-to-resource-group-expanded.png"::: 

1. In the vault **Overview** menu, click **Move**, and then select **Move to another resource group**.

   :::image type="content" source="./media/backup-vault-overview/select-move-to-another-resource-group-inline.png" alt-text="Screenshot showing the option for moving the Backup vault to another resource group." lightbox="./media/backup-vault-overview/select-move-to-another-resource-group-expanded.png":::
   >[!Note]
   >Only the admin subscription has the required permissions to move a vault.

1. In the **Resource group** drop-down list, select an existing resource group or select **Create new** to create a new resource group.

   The subscription remains the same and gets auto populated.

   :::image type="content" source="./media/backup-vault-overview/select-existing-or-create-resource-group-inline.png" alt-text="Screenshot showing the selection of an existing resource group or creation of a new resource group." lightbox="./media/backup-vault-overview/select-existing-or-create-resource-group-expanded.png":::

1. On the **Resources to move** tab, the Backup vault that needs to be moved will undergo validation. This process may take a few minutes. Wait till the validation is complete.

   :::image type="content" source="./media/backup-vault-overview/move-validation-process-to-move-to-resource-group-inline.png" alt-text="Screenshot showing the Backup vault validation status." lightbox="./media/backup-vault-overview/move-validation-process-to-move-to-resource-group-expanded.png"::: 

1. Select the checkbox **I understand that tools and scripts associated with moved resources will not work until I update them to use new resource IDs** to confirm, and then select **Move**.
 
   >[!Note]
   >The resource path changes after moving vault across resource groups or subscriptions. Ensure that you update the tools and scripts with the new resource path after the move operation completes.

Wait till the move operation is complete to perform any other operations on the vault. Any operations performed on the Backup vault will fail if performed while move is in progress. When the process is complete, the Backup vault should appear in the target resource group.

>[!Important]
>If you encounter any error while moving the vault, refer to the [Error codes and troubleshooting section](backup-vault-troubleshoot.md).

### Use Azure portal to move Backup vault to a different subscription

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open the list of Backup vaults and select the vault you want to move.
   
   The vault dashboard displays the vault details.

   :::image type="content" source="./media/backup-vault-overview/vault-dashboard-to-move-to-another-subscription-inline.png" alt-text="Screenshot showing the dashboard of the vault to be moved to another Azure subscription." lightbox="./media/backup-vault-overview/vault-dashboard-to-move-to-another-subscription-expanded.png"::: 

1. In the vault **Overview** menu, click **Move**, and then select **Move to another subscription**.

   :::image type="content" source="./media/backup-vault-overview/select-move-to-another-subscription-inline.png" alt-text="Screenshot showing the option for moving the Backup vault to another Azure subscription." lightbox="./media/backup-vault-overview/select-move-to-another-subscription-expanded.png"::: 
   >[!Note]
   >Only the admin subscription has the required permissions to move a vault.

1. In the **Subscription** drop-down list, select an existing subscription.

   For moving vaults across subscriptions, the target subscription must reside in the same tenant as the source subscription. To move a vault to a different tenant, see [Transfer subscription to a different directory](../role-based-access-control/transfer-subscription.md).

1. In the **Resource group** drop-down list, select an existing resource group or select **Create new**  to create a new resource group.

   :::image type="content" source="./media/backup-vault-overview/select-existing-or-create-resource-group-to-move-to-other-subscription-inline.png" alt-text="Screenshot showing the selection of an existing resource group or creation of a new resource group in another Azure subscription." lightbox="./media/backup-vault-overview/select-existing-or-create-resource-group-to-move-to-other-subscription-expanded.png":::

1. On the **Resources to move** tab, the Backup vault that needs to be moved will undergo validation. This process may take a few minutes. Wait till the validation is complete.

   :::image type="content" source="./media/backup-vault-overview/move-validation-process-to-move-to-another-subscription-inline.png" alt-text="Screenshot showing the validation status of Backup vault to be moved to another Azure subscription." lightbox="./media/backup-vault-overview/move-validation-process-to-move-to-another-subscription-expanded.png"::: 

1. Select the checkbox **I understand that tools and scripts associated with moved resources will not work until I update them to use new resource   IDs** to confirm, and then select **Move**.
 
   >[!Note]
   >The resource path changes after moving vault across resource groups or subscriptions. Ensure that you update the tools and scripts with the new resource path after the move operation completes.

Wait till the move operation is complete to perform any other operations on the vault. Any operations performed on the Backup vault will fail if performed while move is in progress. When the process completes, the Backup vault should appear in the target Subscription and Resource group.

>[!Important]
>If you encounter any error while moving the vault, refer to the [Error codes and troubleshooting section](backup-vault-troubleshoot.md).

## Perform Cross Region Restore using Azure portal

The Cross Region Restore option allows you to restore data in a secondary Azure paired region. To configure Cross Region Restore for the backup vault:  

1. Sign in to [Azure portal](https://portal.azure.com/).

1. [Create a new Backup vault](create-manage-backup-vault.md#create-backup-vault) or choose an existing Backup vault, and then enable Cross Region Restore by going to **Properties** > **Cross Region Restore**, and choose **Enable**.

   :::image type="content" source="./media/backup-vault-overview/enable-cross-region-restore-for-postgresql-database.png" alt-text="Screenshot shows how to enable Cross Region Restore for PostgreSQL database." lightbox="./media/backup-vault-overview/enable-cross-region-restore-for-postgresql-database.png":::

1. Go to the Backup vault’s **Overview** pane, and then [configure a backup for PostgreSQL database](backup-azure-database-postgresql.md).

1. Once the backup is complete in the primary region, it can take up to *12 hours* for the recovery point in the primary region to get replicated to the secondary region.

   To check the availability of recovery point in the secondary region, go to the **Backup center** > **Backup Instances** > **Filter  to Azure Database for PostgreSQL servers**, filter **Instance Region** as *Secondary Region*, and then select the required Backup Instance.

   :::image type="content" source="./media/backup-vault-overview/check-availability-of-recovery-point-in-secondary-region.png" alt-text="Screenshot shows how to check availability for the recovery points in the secondary region." lightbox="./media/backup-vault-overview/check-availability-of-recovery-point-in-secondary-region.png":::

   The recovery points available in the secondary region are now listed.

1. Select **Restore to secondary region**.

   :::image type="content" source="./media/backup-vault-overview/initiate-restore-to-secondary-region.png" alt-text="Screenshot shows how to initiate restores to the secondary region." lightbox="./media/backup-vault-overview/initiate-restore-to-secondary-region.png":::

   You can also trigger restores from the respective backup instance.

   :::image type="content" source="./media/backup-vault-overview/trigger-restores-from-respective-backup-instance.png" alt-text="Screenshot shows how to trigger restores from the respective backup instance." lightbox="./media/backup-vault-overview/trigger-restores-from-respective-backup-instance.png":::

1. Select **Restore to secondary region** to review the target region selected, and then select the appropriate recovery point and restore parameters.

1. Once the restore starts, you can monitor the completion of the restore operation under **Backup Jobs** of the Backup vault by filtering **Jobs workload type** to *Azure Database for PostgreSQL servers* and **Instance Region** to *Secondary Region*.

   :::image type="content" source="./media/backup-vault-overview/monitor-postgresql-restore-to-secondary-region.png" alt-text="Screenshot shows how to monitor the postgresql restore to the secondary region." lightbox="./media/backup-vault-overview/monitor-postgresql-restore-to-secondary-region.png":::

> [!NOTE]
> Cross Region Restore is currently only available for PostGreSQL servers.

## Cross Subscription Restore using Azure portal

Some datasources of Backup vault support restore to a subscription different from that of the source machine. Cross Subscription Restore (CSR) is enabled for existing vaults by default, and you can use it if supported for the intended datasource.

>[!Note]
>The feature is currently not supported for Azure Kubernetes Service (AKS) and Azure VMWare Service (AVS) backup.

To do Cross Subscription Restore, follow these steps:

1. In the *Backup vault*, go to **Backup Instance** > **Restore**.
1. Choose the *Subscription* to which you want to restore, and then select **Restore**.

There may be instances when you need to disable Cross Subscription Restore based on your cloud infrastructure. You can enable, disable, or permanently disable Cross Subscription Restore for existing vaults by selecting *Backup vault* > **Properties** > **Cross Subscription Restore**.

:::image type="content" source="./media/create-manage-backup-vault/disable-cross-subscription-restore-for-backup-vault.png" alt-text="Screenshot shows how to disable Cross Subscription Restore for Backup vault." lightbox="./media/create-manage-backup-vault/disable-cross-subscription-restore-for-backup-vault.png":::

You can also select the state of CSR  during the creation of Backup vault.

:::image type="content" source="./media/create-manage-backup-vault/select-cross-subscription-state-on-backup-vault-creation.png" alt-text="Screenshot shows how to select the state of Cross Subscription Restore during Backup vault creation." lightbox="./media/create-manage-backup-vault/select-cross-subscription-state-on-backup-vault-creation.png":::

>[!Note]
>- CSR once permanently disabled on a vault can't be re-enabled because it's an irreversible operation.
>- If CSR is disabled but not permanently disabled, then you can reverse the operation by selecting **Vault** > **Properties** > **Cross Subscription Restore** > **Enable**.
>- If a Backup vault is moved to a different subscription when CSR is disabled or permanently disabled, restore to the original subscription will fail.

## Manage Alerts

You can configure and manage azure monitor based alerts from the **Alerts** pane in the **Backup vault**. [Learn more](backup-azure-monitoring-alerts.md).


## Next steps

- [Configure backup on Azure PostgreSQL databases](backup-azure-database-postgresql.md#configure-backup-on-azure-postgresql-databases)