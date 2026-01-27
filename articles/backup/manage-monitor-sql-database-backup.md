---
title: Manage and monitor SQL Server DBs on an Azure VM
description: This article describes how to manage and monitor SQL Server databases that are running on an Azure VM.
ms.topic: how-to
ms.date: 01/27/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to manage and monitor SQL Server databases on Azure VMs, so that I can ensure reliable backups and recoveries while maintaining optimal performance and reducing downtime."
---

# Manage and monitor backed up SQL Server databases using Azure portal

This article describes common tasks for managing and monitoring SQL Server databases that are running on an Azure virtual machine (VM) and that are backed up to an Azure Backup Recovery Services vault by the [Azure Backup](backup-overview.md) service using Azure portal. You can also use [Azure CLI](backup-azure-sql-manage-cli.md) and [REST API](manage-azure-sql-vm-rest-api.md) to manage SQL database backups. You can monitor jobs and alerts, stop and resume database protection, run backup jobs, and unregister a VM from backups.

If you haven't yet configured backups for your SQL Server databases, see [Back up SQL Server databases on Azure VMs](backup-azure-sql-database.md)

>[!Note]
>See the [SQL backup support matrix](sql-support-matrix.md) to know more about the supported configurations and scenarios.

## Monitor backup jobs in the Azure portal

Azure Backup shows all scheduled and on-demand operations under **Jobs** in **Resiliency** in the Azure portal, except the scheduled log backups since they can be very frequent. The jobs you see in this portal includes database discovery and registration, configure backup, and backup and restore operations.

:::image type="content" source="./media/backup-azure-sql-database/monitor-sql-database-backup-operations.png" alt-text="Screenshot shows the Backup jobs in Resiliency." lightbox="./media/backup-azure-sql-database/monitor-sql-database-backup-operations.png":::

For details on Monitoring scenarios, go to [Monitoring in the Azure portal](backup-azure-monitoring-built-in-monitor.md) and [Monitoring using Azure Monitor](backup-azure-monitoring-use-azuremonitor.md).  

## View backup alerts

Azure Backup raises built-in alerts via Azure Monitor for the following SQL database backups scenarios:

- Backup failures
- Restore failures
- Unsupported backup type is configured
- Workload extension unhealthy
- Deletion of backup data

For more information on the supported alert scenarios, see [Azure Monitor alerts for Azure Backup](monitoring-and-alerts-overview.md#azure-monitor-alerts-for-azure-backup).

To monitor database backup alerts, follow these steps:

1. In the Azure portal, go to **Resiliency** select **Monitoring + Reporting** > **Alerts**.

   :::image type="content" source="./media/backup-azure-sql-database/alerts-list.png" alt-text="Screenshot shows the list of alerts." lightbox="./media/backup-azure-sql-database/alerts-list.png":::

1. On the **Alerts** pane, select the **Alert rule** for the SQL database to view the resources for which the alerts are triggered.

   :::image type="content" source="./media/backup-azure-sql-database/sql-alerts.png" alt-text="Screenshot shows the failed Backup alerts list." lightbox="./media/backup-azure-sql-database/sql-alerts.png":::

1. To configure notifications for these alerts, you must create an alert processing rule.

   Learn about [Configure notifications for alerts](backup-azure-monitor-alerts-notification.md#configure-notifications-for-alerts).

## Stop protection for a SQL Server database

Azure Backup provides the following options to stop protection of a SQL Server database:

- **Stop protection and retain backup data (Retain forever)**: Stops all future backup jobs from protecting a SQL Server database and retains the existing backup data in the Recovery Services vault forever. This retention incurs a storage fee as per [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). If needed, you can use the backup data to restore the SQL Server database and use the **Resume backup** option to resume protection.
- **Stop protection and retain backup data (Retain as per policy)**: Stops all future backup jobs from protecting a SQL Server database and retains the existing backup data in the Recovery Services vault as per policy. However, the latest recovery point is retained forever. This retention incurs a storage fee as per [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). If needed, you can use the backup data to restore the SQL Server database and use the **Resume backup** option to resume protection.
- **Stop protection and delete backup data**: Stops future backup jobs for a SQL Server database and deletes all backup data. You can't restore the SQL Server database or use the **Resume backup** option.

To stop protection for a database:

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/backup-azure-sql-database/protected-items.png" alt-text="Screenshot shows how to select a protected SQL database item." lightbox="./media/backup-azure-sql-database/protected-items.png":::
2. On the **Protected items** pane, select **SQL in Azure VM** as the datasource type, and then select a protected item from the list.

3. On the selected **protected item** pane, select the database instance for which you want to stop protection.

   :::image type="content" source="./media/backup-azure-sql-database/sql-select-instance.png" alt-text="Screenshot shows how to select the database to stop protection." lightbox="./media/backup-azure-sql-database/sql-select-instance.png":::

4. On the selected **database instance** pane, select **Stop backup**.

   You can also right-click a particular row in the database instances view and select **Stop Backup**.

   :::image type="content" source="./media/backup-azure-sql-database/sql-stop-backup.png" alt-text="Screenshot shows the selection of Stop backup." lightbox="./media/backup-azure-sql-database/sql-stop-backup.png":::

5. On the **Stop Backup** pane, select whether to retain or delete data. If you want, provide a reason and comment.

    :::image type="content" source="./media/backup-azure-sql-database/stop-backup.png" alt-text="Screenshot shows the options to retain or delete data on the Stop Backup pane.":::

6. Select **Stop backup**.

> [!NOTE]
>
>For more information about the delete data option, see the following FAQs:
>
>- [If I delete a database from an autoprotected instance, what will happen to the backups?](faq-backup-sql-server.yml#if-i-delete-a-database-from-an-autoprotected-instance--what-will-happen-to-the-backups-)
>- [If I do stop backup operation of an autoprotected database what will be its behavior?](faq-backup-sql-server.yml#if-i-ve-changed-the-name-of-the-database-after-it-has-been-protected--what-will-be-the-behavior-)
>
>

## Resume protection for a SQL database

When you stop protection for the SQL database, if you select the **Retain Backup Data** option, you can later resume protection. If you don't retain the backup data, you can't resume protection.

To resume protection for a SQL database, follow these steps:

1. Open the backup item and select **Resume backup**.

    ![Select Resume backup to resume database protection](./media/backup-azure-sql-database/resume-backup-button.png)

2. On the **Backup policy** menu, select a policy, and then select **Save**.

## Run an on-demand backup

You can run different types of on-demand backups:

- Full backup
- Copy-only full backup
- Differential backup
- Log backup

>[!Note]
>The retention period of this backup is determined by the type of on-demand backup you have run.
>
>- *On-demand full* retains backups for a minimum of *45 days* and a maximum of *99 years*.
>- *On-demand copy only full* accepts any value for retention.
>- *On-demand differential* retains backup as per the retention of scheduled differentials set in policy.
>- *On-demand log* retains backups as per the retention of scheduled logs set in policy.

For more information, see [SQL Server backup types](backup-architecture.md#sql-server-backup-types).

## Modify policy

Modify policy to change backup frequency or retention range.

> [!NOTE]
> Any change in the retention period will be applied retrospectively to all the older recovery points besides the new ones.

In the vault dashboard, go to **Manage** > **Backup Policies** and choose the policy you want to edit.

  ![Manage backup policy](./media/backup-azure-sql-database/modify-backup-policy.png)

  :::image type="content" source="./media/backup-azure-sql-database/modify-backup-policy-impact.png" alt-text="Screenshot that shows the impact of modifying a backup policy on associated backup items." lightbox="./media/backup-azure-sql-database/modify-backup-policy-impact.png":::

Policy modification will impact all the associated Backup Items and trigger corresponding **configure protection** jobs.

>[!Note]
>Modification of policy will affect existing recovery points also. <br><br> For recovery points in archive that haven't stayed for a duration of 180 days in Archive Tier, deletion of those recovery points lead to early deletion cost. [Learn more](../storage/blobs/access-tiers-overview.md).

### Inconsistent policy

Sometimes, a modify policy operation can lead to an **inconsistent** policy version for some backup items. This happens when the corresponding **configure protection** job fails for the backup item after a modify policy operation is triggered. It appears as follows in the backup item view:

  ![Inconsistent policy](./media/backup-azure-sql-database/inconsistent-policy.png)

You can fix the policy version for all the impacted items in one click:

  ![Fix inconsistent policy](./media/backup-azure-sql-database/fix-inconsistent-policy.png)

## Unregister a SQL Server instance

Before you unregister the server, [disable soft delete](./backup-azure-security-feature-cloud.md?tabs=azure-portal#disable-soft-delete), and then delete all backup items.

>[!NOTE]
>Deleting backup items with soft delete enabled will lead to 14 days retention, and you will need to wait before the items are completely removed. However, if you've deleted the backup items with soft delete enabled, you can undelete them, disable soft-delete, and then delete them again for immediate removal. [Learn more](./backup-azure-security-feature-cloud.md#delete-soft-deleted-backup-items-permanently)

Unregister a SQL Server instance after you disable protection but before you delete the vault.

1. On the vault dashboard, under **Manage**, select **Backup Infrastructure**.  

   ![Select Backup Infrastructure](./media/backup-azure-sql-database/backup-infrastructure-button.png)

2. Under **Management Servers**, select **Protected Servers**.

   ![Select Protected Servers](./media/backup-azure-sql-database/protected-servers.png)

3. In **Protected Servers**, select the server to unregister. To delete the vault, you must unregister all servers.

4. Right-click the protected server, and select **Unregister**.

   ![Select Delete](./media/backup-azure-sql-database/delete-protected-server.jpg)

## Re-register extension on the SQL Server VM

Sometimes, the workload extension on the VM may become impacted for one reason or another. In such cases, all the operations triggered on the VM will begin to fail. You may then need to re-register the extension on the VM. The **Re-register** operation reinstalls the workload backup extension on the VM for operations to continue. You can find this option under **Backup Infrastructure** in the Recovery Services vault.

![Protected servers under Backup Infrastructure](./media/backup-azure-sql-database/protected-servers-backup-infrastructure.png)

Use this option with caution. When triggered on a VM with an already healthy extension, this operation will cause the extension to get restarted. This may cause all the in-progress jobs to fail. Check for one or more of the [symptoms](backup-sql-server-azure-troubleshoot.md#re-registration-failures) before triggering the re-register operation.

## Manage database backup when backed-up VM is moved/deleted

The backed-up SQL VM is deleted or moved using Resource move. The experience depends on the following characteristics of the new VM.

New VM subscription | New VM Name | New VM Resource group | New VM Region | Experience
------------------- | ----------- | --------------------- | ------------- | ---------------------------------
Same                | Same        | Same                  | Same          | **What will happen to backups of _old_ VM?** <br><br> You’ll receive an alert that backups will be stopped on the _old_ VM. The backup data will be retained as per the last active policy. You can choose to stop protection and delete data and unregister the old VM once all backup data is cleaned up as per policy.   <br><br> **How to get backup data from _old_ VM to _new_ VM?**    <br><br> No SQL backups will be triggered automatically on the _new_ virtual machine. You must re-register the VM to the same vault. Then it will appear as a valid target, and SQL data can be restored to the latest available point-in-time via the alternate location recovery capability. After you restore SQL data, SQL backups will continue on this machine. VM backup will continue as-is, if previously configured.
Same                | Same        | Different             | Same          | **What will happen to backups of _old_ VM?**   <br><br> You’ll receive an alert that backups will be stopped on the _old_ VM. The backup data will be retained as per the last active policy. You can choose to stop protection and delete data and unregister the old VM once all backup data is cleaned up as per policy.     <br><br>**How to get backup data from _old_ VM to _new_ VM?** <br><br> As the new virtual machine is in a different resource group, it will be treated as a new machine and you've to explicitly configure SQL backups (and VM backup too, if  previously configured) to the same vault. Then proceed to restore the SQL backup item of the old VM to latest available point-in-time via the _alternate location recovery_ to the new VM. The SQL backups will now continue.
Same                | Same        | Same or different     | Different     | **What will happen to backups of _old_ VM?**   <br><br> You’ll receive an alert that backups will be stopped on the _old_ VM. The backup data will be retained as per the last active policy. You can choose to stop protection and delete data and unregister the old VM once all backup data is cleaned up as per policy. <br><br> **How to get backup data from _old_ VM to _new_ VM? <br><br>  As the new virtual machine is in a different region, you’ve to configure SQL backups to a vault in the new region.  <br><br> If the new region is a paired region, you can choose to restore SQL data to latest available point-in-time via the ‘cross region restore’ capability from the SQL backup item of the _old_ VM. <br><br> If the new region is a non-paired region, direct restore from the previous SQL backup item isn't supported. However, you can choose the *restore as files* option, from the SQL backup item of the ‘old’ VM, to get the data to a mounted share in a VM of the old region, and then mount it to the new VM.
Different           | Same or different        | Same or different     | Same or different     | **What will happen to backups of _old_ VM?** <br><br>  You’ll receive an alert that backups will be stopped on the _old_ VM. The backup data will be retained as per the last active policy. You can choose to stop protection + delete data and unregister the old VM once all backup data is cleaned up as per policy. <br><br> **How to get backup data from _old_ VM to _new_ VM?** <br><br> As the new virtual machine is in a different subscription, you’ve to configure SQL backups to a vault in the new subscription. If it's a new vault in different subscription, direct restore from the previous SQL backup item isn't supported. However, you can choose the *restore as files* option, from the SQL backup item of the _old_ VM, to get the data to a mounted share in a VM of the old subscription, and then mount it to the new VM.

## Next steps

For more information, see [Troubleshoot backups on a SQL Server database](backup-sql-server-azure-troubleshoot.md).


## Related content

- [Back up SQL server databases in Azure VMs using Azure Backup via REST API](backup-azure-sql-vm-rest-api.md).
- [Restore SQL Server databases in Azure VMs with REST API](restore-azure-sql-vm-rest-api.md).
- [Manage SQL server databases in Azure VMs with REST API](manage-azure-sql-vm-rest-api.md).

