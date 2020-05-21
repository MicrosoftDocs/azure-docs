---
title: Manage backed up SAP HANA databases on Azure VMs
description: In this article, learn common tasks for managing and monitoring SAP HANA databases that are running on Azure virtual machines.
ms.topic: conceptual
ms.date: 11/12/2019
---

# Manage and monitor backed up SAP HANA databases

This article describes common tasks for managing and monitoring SAP HANA databases that are running on an Azure virtual machine (VM) and that are backed up to an Azure Backup Recovery Services vault by the [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview) service. You'll learn how to monitor jobs and alerts, trigger an on-demand backup, edit policies, stop and resume database protection and unregister a VM from backups.

If you haven't configured backups yet for your SAP HANA databases, see [Back up SAP HANA databases on Azure VMs](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database).

## Monitor manual backup jobs in the portal

Azure Backup shows all manually triggered jobs in the **Backup jobs** section on Azure portal.

![Backup jobs section](./media/sap-hana-db-manage/backup-jobs.png)

The jobs you see in this portal include database discovery and registering, and backup and restore operations. Scheduled jobs, including log backups aren't shown in this section. Manually triggered backups from the SAP HANA native clients (Studio/ Cockpit/ DBA Cockpit) also don't show up here.

![Backup jobs list](./media/sap-hana-db-manage/backup-jobs-list.png)

To learn more about monitoring, go to [Monitoring in the Azure portal](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-built-in-monitor) and [Monitoring using Azure Monitor](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor).

## View backup alerts

Alerts are an easy means of monitoring backups of SAP HANA databases. Alerts help you focus on the events you care about the most without getting lost in the multitude of events that a backup generates. Azure Backup allows you to set alerts, and they can be monitored as follows:

* Sign in to the [Azure portal](https://portal.azure.com/).
* On the vault dashboard, select **Backup Alerts**.

  ![Backup alerts on vault dashboard](./media/sap-hana-db-manage/backup-alerts-dashboard.png)

* You will be able to see the alerts:

  ![List of backup alerts](./media/sap-hana-db-manage/backup-alerts-list.png)

* Click on the alerts to see more details:

  ![Alert details](./media/sap-hana-db-manage/alert-details.png)

Today, Azure Backup allows the sending of alerts through email. These alerts are:

* Triggered for all backup failures.
* Consolidated at the database level by error code.
* Sent only for a database's first backup failure.

ToTo learn more about monitoring, go to [Monitoring in the Azure portal](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-built-in-monitor) and [Monitoring using Azure Monitor](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor).

## Management Operations

Azure Backup makes management of a backed-up SAP HANA database easy with an abundance of management operations that it supports. These operations are discussed in more detail in the following sections.

### Run an on-demand backup

Backups run in accordance with the policy schedule. You can run a backup on-demand as follows:

1. In the vault menu, click **Backup items**.
2. In **Backup Items**, select the VM running the SAP HANA database, and then click **Backup now**.
3. In **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then click **OK**.
4. Monitor the portal notifications. You can monitor the job progress in the vault dashboard > **Backup Jobs** > **In progress**. Depending on the size of your database, creating the initial backup may take a while.

### HANA native client integration

#### Backup

On-demand backups triggered from any of the HANA native clients (to **Backint**) will show up in the backup list on the **Backup Items** page.

![Last backups run](./media/sap-hana-db-manage/last-backups.png)

You can also [monitor these backups](https://docs.microsoft.com/azure/backup/sap-hana-db-manage#monitor-manual-backup-jobs-in-the-portal) from the **Backup jobs** page.

These on-demand backups will also show up in the list of restore points for restore.

![List of restore points](./media/sap-hana-db-manage/list-restore-points.png)

#### Restore

Restores triggered from HANA native clients (using **Backint**) to restore to the same machine can be [monitored](https://docs.microsoft.com/azure/backup/sap-hana-db-manage#monitor-manual-backup-jobs-in-the-portal) from the **Backup jobs** page.

### Run SAP HANA native client backup on a database with Azure backup enabled

If you want to take a local backup (using HANA Studio / Cockpit) of a database that's being backed up with Azure Backup, do the following:

1. Wait for any full or log backups for the database to finish. Check the status in SAP HANA Studio/ Cockpit.
2. Disable log backups, and set the backup catalog to the file system for relevant database.
3. To do this, double-click **systemdb** > **Configuration** > **Select Database** > **Filter (Log)**.
4. Set **enable_auto_log_backup** to **No**.
5. Set **log_backup_using_backint** to **False**.
6. Take an on-demand full backup of the database.
7. Wait for the full backup and catalog backup to finish.
8. Revert the previous settings back to those for Azure:
   * Set **enable_auto_log_backup** to **Yes**.
   * Set **log_backup_using_backint** to **True**.

### Change policy

You can change the underlying policy for an SAP HANA backup item.

* In the vault dashboard, go to **Backup items**:

  ![Select backup items](./media/sap-hana-db-manage/backup-items.png)

* Choose **SAP HANA in Azure VM**

  ![Choose SAP HANA in Azure VM](./media/sap-hana-db-manage/sap-hana-in-azure-vm.png)

* Choose the backup item whose underlying policy you want to change
* Click on the existing Backup policy

  ![Select existing backup policy](./media/sap-hana-db-manage/existing-backup-policy.png)

* Change the policy, choosing from the list. [Create a new backup policy](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database#create-a-backup-policy) if needed.

  ![Choose policy from drop-down list](./media/sap-hana-db-manage/choose-backup-policy.png)

* Save the changes

  ![Save the changes](./media/sap-hana-db-manage/save-changes.png)

* Policy modification will impact all the associated Backup Items and trigger corresponding **configure protection** jobs.

>[!NOTE]
> Any change in the retention period will be applied retrospectively to all the older recovery points besides the new ones.
>
> Incremental backup policies cannot be used for SAP HANA databases. Incremental backup is not currently supported for these databases.

### Modify Policy

Modify policy to change backup types, frequencies and retention range.

>[!NOTE]
>Any change in the retention period will be applied retroactively to all the older recovery points, in addition to the new ones.

1. In the vault dashboard, go to **Manage > Backup Policies** and choose the policy you want to edit.

   ![Choose the policy to edit](./media/sap-hana-db-manage/manage-backup-policies.png)

1. Select **Modify**.

   ![Select Modify](./media/sap-hana-db-manage/modify-policy.png)

1. Choose the frequency for the backup types.

   ![Choose backup frequency](./media/sap-hana-db-manage/choose-frequency.png)

Policy modification will impact all the associated backup items and trigger corresponding **configure protection** jobs.

### Inconsistent policy

Occasionally a modify policy operation can lead to an **inconsistent** policy version for some backup items. This happens when the corresponding **configure protection** job fails for the backup item after a modify policy operation is triggered. It appears as follows in the backup item view:

![Inconsistent policy](./media/sap-hana-db-manage/inconsistent-policy.png)

You can fix the policy version for all the impacted items in one click:

![Fix policy version](./media/sap-hana-db-manage/fix-policy-version.png)

### Stop protection for an SAP HANA database

You can stop protecting an SAP HANA database in a couple of ways:

* Stop all future backup jobs and delete all recovery points.
* Stop all future backup jobs and leave the recovery points intact.

If you choose to leave recovery points, keep these details in mind:

* All recovery points will remain intact forever, all pruning shall stop at stop protection with retain data.
* You will be charged for the protected instance and the consumed storage. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
* If you delete a data source without stopping backups, new backups will fail.

To stop protection for a database:

* On the vault dashboard, select **Backup Items**.
* Under **Backup Management Type**, select **SAP HANA in Azure VM**

  ![Select SAP HANA in Azure VM](./media/sap-hana-db-manage/sap-hana-azure-vm.png)

* Select the database for which you want to stop protection on:

  ![Select database to stop protection](./media/sap-hana-db-manage/select-database.png)

* On the database menu, select **Stop backup**.

  ![Select stop backup](./media/sap-hana-db-manage/stop-backup.png)

* On the **Stop Backup** menu, select whether to retain or delete data. If you want, provide a reason and comment.

  ![Select retain or delete data](./media/sap-hana-db-manage/retain-backup-data.png)

* Select **Stop backup**.

### Resume protection for an SAP HANA database

When you stop protection for the SAP HANA database, if you select the **Retain Backup Data** option, you can later resume protection. If you don't retain the backed-up data, you will not be able to resume protection.

To resume protection for an SAP HANA database:

* Open the backup item and select **Resume backup**.

   ![Select resume backup](./media/sap-hana-db-manage/resume-backup.png)

* On the **Backup policy** menu, select a policy, and then select **Save**.

### Upgrading from SDC to MDC

Learn how to continue backup for an SAP HANA database [after upgrading from SDC to MDC](backup-azure-sap-hana-database-troubleshoot.md#sdc-to-mdc-upgrade-with-a-change-in-sid).

### Upgrading from SDC to MDC without a SID change

Learn how to continue backup of an SAP HANA database whose [SID has not changed after upgrade from SDC to MDC](backup-azure-sap-hana-database-troubleshoot.md#sdc-to-mdc-upgrade-with-no-change-in-sid).

### Unregister an SAP HANA instance

Unregister an SAP HANA instance after you disable protection but before you delete the vault:

* On the vault dashboard, under **Manage**, select **Backup Infrastructure**.

   ![Select Backup Infrastructure](./media/sap-hana-db-manage/backup-infrastructure.png)

* Select the **Backup Management type** as **Workload in Azure VM**

   ![Select the Backup Management type as Workload in Azure VM](./media/sap-hana-db-manage/backup-management-type.png)

* In **Protected Servers**, select the instance to unregister. To delete the vault, you must unregister all servers/ instances.

* Right-click the protected instance and select **Unregister**.

   ![Select unregister](./media/sap-hana-db-manage/unregister.png)

### Re-register extension on the SAP HANA server VM

Sometimes the workload extension on the VM may get impacted for one reason or another. In such cases, all the operations triggered on the VM will begin to fail. You may then need to re-register the extension on the VM. Re-register operation reinstalls the workload backup extension on the VM for operations to continue.

Use this option with caution: when triggered on a VM with an already healthy extension, this operation will cause the extension to get restarted. This may cause all the in-progress jobs to fail. Check for one or more of the [symptoms](backup-azure-sap-hana-database-troubleshoot.md#re-registration-failures) before triggering the re-register operation.

## Next steps

* Learn how to [troubleshoot common issues when backing up SAP HANA databases.](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database-troubleshoot)
