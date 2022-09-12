---
title: Manage SAP HANA database instances on Azure VMs
description: In this article, discover how to manage SAP HANA database instances that are running on Azure Virtual Machines.
ms.topic: conceptual
ms.date: 10/05/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# Manage SAP HANA database instances in Azure VMs (preview)

This article describes how to manage SAP HANA database instances in Azure VMs.

## Monitor a manual backup job in the Azure portal

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status, follow these steps:

1. In the Recovery Services vault blade, select **Backup Jobs** in the left pane.

   It shows the jobs dashboard with operation and status of the jobs triggered in *past 24 hours*. To modify the time range, select **Filter** and do required changes.

1. To review the job details of a job, select **View details** corresponding to the job.

## View backup alerts

Alerts are an easy means of monitoring backups of SAP HANA databases instances. Alerts help you focus on the events you care about the most without getting lost in the multitude of events that a backup generates. Azure Backup allows you to set alerts, and they can be monitored as follows:

1. In the Azure portal, on the vault dashboard, select **Backup Alerts** in the left pane.

   :::image type="content" source="./media/sap-hana-database-instances-manage/hana-snapshot-instance-alert-list.png" alt-text="Screenshot showing the list of backup alerts.":::

   You'll be able to see the alerts.

1. Select **View details** corresponding to the alert to see more details:

   :::image type="content" source="./media/sap-hana-database-instances-manage/hana-instance-view-alert-details.png" alt-text="Screenshot showing the option to view backup alert details.":::

Azure Backup allows the sending of alerts through email. These alerts are:

- Triggered for all backup failures.
- Consolidated at the database level by error code.
- Sent only for a database's first backup failure.

Learn more about [Monitoring in the Azure portal](backup-azure-monitoring-built-in-monitor.md) and [Monitoring using Azure Monitor](backup-azure-monitoring-use-azuremonitor.md).

## Management operations

Azure Backup makes management of a backed-up SAP HANA database instance easy with an abundance of management operations that it supports. These operations are discussed in more detail in the following sections.

### Run an on-demand backup

Follow these steps:

1. In the Azure portal, go to Recovery Services vault.

1. In the Recovery Services vault, select **Backup items** in the left pane.

1. By default **Primary Region** is selected. Select **SAP HANA in Azure VM**.

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA snapshot instance.

   :::image type="content" source="./media/sap-hana-database-instances-backup/hana-snapshot-view-details.png" alt-text="Screenshot showing to select View Details of HANA database snapshot instance.":::

1. Select **Backup now**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/start-backup-hana-snapshot.png" alt-text="Screenshot showing to start backup of HANA database snapshot instance.":::

1. On the **Backup now** page, select **OK**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/trigger-backup-hana-snapshot.png" alt-text="Screenshot showing to trigger HANA database snapshot instance backup.":::

### Change a policy

You can change the underlying policy for an SAP HANA instance backup item.

Follow these steps:

1. In the Recovery Services vault, select **Backup items** in the left pane.

1. Select **SAP HANA in Azure VM**.

1. Choose the snapshot backup whose underlying policy you want to change.

   :::image type="content" source="./media/sap-hana-database-instances-manage/hana-snapshot-instance-view-details.png" alt-text="Screenshot showing to select the HANA snapshot for backup policy change.":::

1. Select the existing Backup policy.

   :::image type="content" source="./media/sap-hana-database-instances-manage/hana-snapshot-instance-select-existing-policy.png" alt-text="Screenshot showing to select the existing HANA snapshot backup policy to change.":::

1. In the **Change Backup Policy** blade, select the backup policy from the list. Then select **Change** to save the changes.

   :::image type="content" source="./media/sap-hana-database-instances-manage/hana-snapshot-instance-change-policy.png" alt-text="Screenshot showing to select the required policy in the Change Backup Policy blade.":::

>[!Note]
>- Policy modification impacts all the associated backup items and trigger corresponding configure protection jobs.
>- Any change in the retention period applies retrospectively to all older recovery points as per the new ones.

### Modify a policy

Follow these steps:

1. In Recovery Services vault, select **Backup policies** in the right pane.

   :::image type="content" source="./media/sap-hana-database-instances-manage/backup-policy-list.png" alt-text="Screenshot showing to open the backup policy list.":::

1. Select a policy for SAP HANA instance backup from the list.

1. On the **Modify policy** page, you can modify the daily backup schedule, retention range, resource group, and managed identity.

   :::image type="content" source="./media/sap-hana-database-instances-manage/modify-sap-hana-instance-backup-policy.png" alt-text="Screenshot showing to modify the SAP HANA instance backup policy.":::

1. Select **Update** to save the changes.

### Stop protection of database instance

You can stop protecting an SAP HANA database instance in a couple of ways:

- Stop protection and retain backup data.
- Stop protection and delete backup data.

If you choose to retain recovery points, keep these details in mind:

- All recovery points will remain intact forever, and all pruning will stop at stop protection with retain data.
- You'll be charged for the protected instance and the consumed storage. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
- If you delete a data source without stopping backups, new backups will fail.

To stop protection for a database:

1. In the Recovery Services vault, select **Backup items** in the left pane.
1. Select **SAP HANA in Azure VM** as the datasource type.
1. Select the database snapshot for which you want to stop protection on.
1. In the database instance menu, select **Stop backup**.
1. In the **Stop Backup** menu, select data retention option:

   - **Retain backup data**: Retains the recovery points forever and pruning is as per policy is stopped.
   - **Delete backup data**: Deletes all recovery points.

1. Select **Stop backup**.

### Resume protection

When you stop protection for the SAP HANA database instance, if you select the **Retain backup data** option, you can later resume protection. If you don't retain the backed-up data, you can't resume protection.

To resume protection, follow these steps:

1. Open the backup item and select **Resume backup**.
1. On the **Backup policy** menu, select a policy, and then select **Save**.

## Next steps

- [Back up SAP HANA database instances in Azure VMs (preview)](sap-hana-database-instances-backup.md).
- [Restore SAP HANA database instances in Azure VMs (preview)](sap-hana-database-instances-restore.md).
