---
title: Manage backed up SAP ASE databases on Azure VMs
description: In this article, you'll learn common tasks for managing and monitoring SAP ASE databases that are running on Azure virtual machines.
ms.topic: how-to
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage and monitor backed up SAP ASE databases

This article describes common tasks for managing and monitoring SAP ASE databases that are running on an Azure virtual machine (VM) and backed up to an Azure Backup Recovery Services vault by the [Azure Backup](./backup-overview.md) service. 

You'll learn how to monitor jobs and alerts, trigger an on-demand backup, edit policies, stop and resume database protection, and unregister a VM from backups.

>[!Note]
>Support for ASE instance snapshots is in now generally available.

If you haven't configured backups yet for your SAP ASE databases, see [Back up SAP ASE databases on Azure VMs](./backup-azure-sap-ase-database.md). To earn more about the supported configurations and scenarios, see [Support matrix for backup of SAP ASE databases on Azure VMs](sap-ase-backup-support-matrix.md).

## Run on-demand backups

Backups run according to the policy schedule.

To run on-demand backups, follow these steps:

1. On the left pane of the Recovery Services vault, select **Backup items**.

   ![Screenshot that shows the 'Backup items' link on the Recovery Services vault dashboard.](./media/sap-ase-db-manage/backup-items.png)

1. On the **Backup Items** blade, select the **Backup Management Type** as **SAP ASE in Azure VM**.

   :::image type="content" source="./media/sap-ase-db-manage/select-management-type.png" alt-text="Screenshot shows how to select the backup management type." lightbox="./media/sap-ase-db-manage/select-management-type.png":::

1. On the **Backup Items (SAP ASE in Azure VM)** blade, select the VM that's running the SAP ASE database, and then select **Backup now**.

1. On the **Backup Now** pane, choose the type of backup that you want to perform, and then select **OK**.

   The retention period of this backup is determined by the type of on-demand backup you want to run.

   - *On-demand full backups* are retained for a minimum of *45 days* and a maximum of *99 years*.
   - *On-demand differential backups* are retained as per the *log retention set in the policy*.
   - *On-demand incremental backups* aren't currently supported.

1. Monitor the Azure portal notifications. To do so, on the Recovery Services vault dashboard, select **Backup Jobs**, and then select **In progress**. 

   >[!Note]
   >- Based on the size of your database, creating the initial backup might take a while.
   >- Before a planned failover, ensure that both VMs/Nodes are registered to the vault (physical and logical registration). [Learn more](#verify-the-registration-status-of-vms-or-nodes-to-the-vault).

## Monitor manual backup jobs

Azure Backup shows all manually triggered jobs in the **Backup jobs** section of **Backup center**.

:::image type="content" source="./media/sap-ase-db-manage/backup-center-jobs-list-inline.png" alt-text="Screenshot that shows the 'Backup jobs' section of 'Backup center'." lightbox="./media/sap-ase-db-manage/backup-center-jobs-list-expanded.png":::

The jobs that are displayed in the Azure portal include database discovery and registering, and backup and restore operations. Scheduled jobs, including log backups, aren't shown in this section. Manually triggered backups from the SAP ASE native clients (Studio, Cockpit, and DBA Cockpit) also aren't shown here.

:::image type="content" source="./media/sap-ase-db-manage/ase-view-jobs-inline.png" alt-text="Screenshot that shows the 'Backup jobs' list." lightbox="./media/sap-ase-db-manage/ase-view-jobs-expanded.png":::

To learn more about monitoring, go to [Monitor Azure Backup workloads in the Azure portal](./backup-azure-monitoring-built-in-monitor.md) and [Monitor at scale by using Azure Monitor](./backup-azure-monitoring-use-azuremonitor.md).

## Monitor backup alerts

Alerts are an easy means of monitoring backups of SAP ASE databases. Alerts help you focus on the events you care about the most without getting lost in the multitude of events that a backup generates. 

Azure Backup lets you set alerts, which you can monitor by doing the following:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. On the left pane of the Recovery Services vault, select **Backup Alerts**.

   ![Screenshot that shows the 'Backup Alerts' link on the Recovery Services vault dashboard.](./media/sap-ase-db-manage/backup-alerts-dashboard.png)

   The **Backup Alerts** pane opens.

   ![Screenshot that shows a list of backup alerts on the 'Backup Alerts' pane.](./media/sap-ase-db-manage/backup-alerts-list.png)

1. To view alert details, select the alert:

   ![Screenshot that shows the details of an alert.](./media/sap-ase-db-manage/alert-details.png)

With Azure Backup, you can send alerts by email. These alerts are:

* Triggered for all backup failures.
* Consolidated at the database level by error code.
* Sent only for a database's first backup failure.

## Manage operations using the Azure portal

This section describes several Azure Backup supported  management operations that make it easy to manage a backed-up SAP ASE database.

### Change a policy

You can change the underlying policy for an SAP ASE backup item.

> [!Note]
> For ASE snapshots, the new ASE instance policy can have a different resource group or another user-assigned managed identity. Currently, the Azure portal performs all validations during the backup configuration. So, you must assign the required roles on the new snapshot resource group or the new user-assigned identity by using the [CLI scripts](https://github.com/Azure/Azure-Workload-Backup-Troubleshooting-Scripts/tree/main/SnapshotPreReqCLIScripts).

On the **Backup center** dashboard, go to **Backup Instances**, and then do the following:

1. Choose **SAP ASE in Azure VM** as the datasource type.

   :::image type="content" source="./media/sap-ase-db-manage/ase-backup-instances-inline.png" alt-text="Screenshot that shows where to choose 'SAP ASE in Azure VM'." lightbox="./media/sap-ase-db-manage/ase-backup-instances-expanded.png":::

1. Choose the backup item whose underlying policy you want to change.

1. Select the existing Azure Backup policy.

   ![Screenshot that shows where to select existing backup policy.](./media/sap-ase-db-manage/existing-backup-policy.png)

1. On the **Backup Policy** pane, change the policy by selecting it in the dropdown list. If necessary, [Create a new backup policy](./backup-azure-sap-ase-database.md#create-a-backup-policy).

   ![Screenshot that shows the dropdown list for changing the backup policy.](./media/sap-ase-db-manage/choose-backup-policy.png)

1. Select **Save**.

   ![Screenshot that shows the 'Save' button for changing the backup policy change.](./media/sap-ase-db-manage/save-changes.png)

Making policy modifications affects all the associated backup items and triggers corresponding *configure protection* jobs.

### Edit a policy

To modify the policy to change backup types, frequencies, and retention range, follow these steps:

>[!NOTE]
> * Any change in the retention period will be applied to both the new recovery points and, retroactively, to all older recovery points.
>
> * For ASE snapshots, you can edit the ASE instance policy to have a different resource group or another user-assigned managed identity. Currently, the Azure portal performs all validations during the backup configuration only. So, you must assign the required roles on the new snapshot resource group or the new user-assigned identity by using the [CLI scripts](https://github.com/Azure/Azure-Workload-Backup-Troubleshooting-Scripts/tree/main/SnapshotPreReqCLIScripts).

1. On the **Backup center** dashboard, go to **Backup Policies**, and then select the policy you want to edit.

   :::image type="content" source="./media/sap-ase-db-manage/backup-center-policies-inline.png" alt-text="Screenshot that shows where to select the policy to edit." lightbox="./media/sap-ase-db-manage/backup-center-policies-expanded.png":::

1. On the **Backup policy** pane, select **Modify**.

   ![Screenshot that shows the 'Modify' button for changing the backup policy.](./media/sap-ase-db-manage/modify-policy.png)

1. Select the frequency of the backups.

   ![Screenshot that shows where to select the backup frequency.](./media/sap-ase-db-manage/choose-frequency.png)

Modifying the backup policy affects all the associated backup items and triggers corresponding *configure protection* jobs.

### Upgrade from SDC to MDC

Learn how to continue backing up an [SAP ASE database after you upgrade from a single container database (SDC) to a multiple container database (MDC)](backup-azure-sap-ase-database-troubleshoot.md#sdc-to-mdc-upgrade-with-a-change-in-sid).

### Inconsistent policy

Occasionally, a *modify policy* operation can lead to an *inconsistent* policy version for some backup items. This happens when the corresponding *configure protection* job fails for the backup item after a modify policy operation is triggered. It appears as follows in the backup item view:

![Screenshot that displays a message saying that the policy is inconsistent and provides a link for fixing the issue.](./media/sap-ase-db-manage/inconsistent-policy.png)

You can fix the policy version for all the impacted items in one click:

![Screenshot that shows the 'Fix Inconsistent Policy' pane.](./media/sap-ase-db-manage/fix-policy-version.png)

### Upgrade from SDC to MDC without a SID change

Learn how to continue backing up an [SAP ASE database whose SID hasn't changed after your upgrade from an SDC to an MDC](backup-azure-sap-ase-database-troubleshoot.md#sdc-to-mdc-upgrade-with-no-change-in-sid).

### Upgrade to a new version in either SDC or MDC

Learn how to continue backing up an [SAP ASE database whose version you're upgrading](backup-azure-sap-ase-database-troubleshoot.md#sdc-version-upgrade-or-mdc-version-upgrade-on-the-same-vm).

### Stop protection for an SAP ASE database or ASE instance

You can stop protecting an SAP ASE database in a couple of ways:

* Stop all future backup jobs and delete all recovery points.
* Stop all future backup jobs and leave the recovery points intact.

If you choose to leave recovery points, keep these details in mind:

* All recovery points will remain intact forever, and all pruning will stop at stop protection with retain data.
* You'll incur charges for the protected instance and the consumed storage. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
* If you delete a data source without stopping backups, new backups will fail.

> [!Note]
> For ASE instances, first stop the protection of the ASE instance, and then stop protection of all related databases; otherwise, the stop protection operation will fail.

To stop protection of a database:

1. On the **Backup center** dashboard, select **Backup Instances**.
1. Select **SAP ASE in Azure VM** as the datasource type.

   :::image type="content" source="./media/sap-ase-db-manage/ase-backup-instances-inline.png" alt-text="Screenshot that shows where to select 'SAP ASE in Azure VM'." lightbox="./media/sap-ase-db-manage/ase-backup-instances-expanded.png":::

1. Select the database for which you want to stop protection.

1. On the database menu, select **Stop backup**.

   :::image type="content" source="./media/sap-ase-db-manage/stop-backup.png" alt-text="Screenshot that shows where to select 'Stop backup'.":::

1. On the **Stop Backup** menu, select whether to retain or delete data. Optionally, you can provide a reason and comment.

   :::image type="content" source="./media/sap-ase-db-manage/retain-backup-data.png" alt-text="Screenshot that shows where to select to retain or delete data.":::

1. Select **Stop backup**.

### Resume protection for an SAP ASE database or ASE instance

When you stop protection for an SAP ASE database or SAP ASE instance, if you select the **Retain Backup Data** option, you can later resume protection. If you don't retain the backed-up data, you can't resume protection.

To resume protection for an SAP ASE database:

1. Open the backup item, and then select **Resume backup**.

   ![Select resume backup](./media/sap-ase-db-manage/resume-backup.png)

1. On the **Backup policy** menu, select a policy, and then select **Save**.

### Re-register an extension on the SAP ASE server VM

The workload extension on the VM might sometimes be adversely affected for one reason or another. If it is, all operations that are triggered on the VM will begin to fail. You might then need to re-register the extension on the VM. The re-register operation reinstalls the workload backup extension on the VM for operations to continue.

Use this option with caution: when it's triggered on a VM with an already healthy extension, the operation will cause the extension to restart. This might in turn cause all the in-progress jobs to fail. Before you trigger a re-register operation, [check for one or more of the symptoms](backup-azure-sap-ase-database-troubleshoot.md#re-registration-failures).

### Unregister an SAP ASE instance

Unregister an SAP ASE instance after you disable protection but before you delete the vault:

1. In the Recovery Services vault, under **Manage**, select **Backup Infrastructure**.

   ![Screenshot that shows the 'Backup Infrastructure' link on the Recovery Services dashboard.](./media/sap-ase-db-manage/backup-infrastructure.png)

1. For **Backup Management type**, select **Workload in Azure VM**.

   ![Screenshot that shows where to select the 'Backup Management Type' as 'Workload in Azure VM'.](./media/sap-ase-db-manage/backup-management-type.png)

1. On the **Protected Servers** pane, select the instance to unregister. To delete the vault, you must unregister all servers and instances.

1. Right-click the protected instance, and then select **Unregister**.

   ![Select unregister](./media/sap-ase-db-manage/unregister.png)

### Verify the registration status of VMs or Nodes to the vault

Before a planned failover, ensure that both VMs/Nodes are registered to the vault (physical and logical registration). If backups fail after failover/fallback, ensure that physical/logical registration is complete. Otherwise, [rediscover the VMs/Nodes](sap-ase-database-with-ase-system-replication-backup.md#discover-the-databases).

**Confirm the physical registration**

Go to the *Recovery Services vault* > **Manage** > **Backup Infrastructure** > **Workload in Azure VM**.

The status of both primary and secondary VMs should be **registered**.

:::image type="content" source="./media/sap-ase-db-manage/confirm-physical-registration-status-of-node.png" alt-text="Screenshot shows the physical registration status." lightbox="./media/sap-ase-db-manage/confirm-physical-registration-status-of-node.png":::


**Confirm the logical registration**

Follow these steps:

1. Go to *Recovery services vault* > **Backup Items** > **SAP ASE in Azure VM**.

2. Under **ASE System**, select the name of the ASE instance.

   :::image type="content" source="./media/sap-ase-db-manage/select-database-name.png" alt-text="Screenshot shows how to select the database name." lightbox="./media/sap-ase-db-manage/select-database-name.png":::

   Two VMs/Nodes appear under **FQDN** and are in **registered** state.
 
   :::image type="content" source="./media/sap-ase-db-manage/confirm-logical-registration-status.png" alt-text="Screenshot shows the logical registration status." lightbox="./media/sap-ase-db-manage/confirm-logical-registration-status.png":::
 
>[!Note]
>If status is in **not registered** state, you need to [rediscover the VMs/Nodes](sap-ase-database-with-ase-system-replication-backup.md#discover-the-databases) and check the status again.

### Switch SAP HSR to standalone databases and configure backup

To switch ASE System Replication (HSR) to standalone databases and configure backup, follow these steps:

1. [Stop protection and retain data for thes currently protected databases](#stop-protection-for-an-sap-ase-database-or-ase-instance).
2. Run [pre-registration script](tutorial-backup-sap-ase-db.md#what-the-pre-registration-script-does) on both the nodes as Standalone.
3. [Re-discover the databases](backup-azure-sap-ase-database.md#discover-the-databases) on both nodes.
4. [Protect the databases as Standalone](backup-azure-sap-ase-database.md#configure-backup) on both the nodes.

## Manage operations using SAP ASE native clients

This section describes how to manage various operations from non-Azure clients, such as ASE Studio.

> [!Note]
> ASE native clients are integrated for Backint-based operations only. Snapshots and ASE System Replication mode-related operations are currently not supported.

### Backup via Backint

On-demand backups that are triggered from any of the ASE native clients that use Backint are displayed in the backup list on the **Backup Instances** page.

![Screenshot that shows the 'Restore points' pane for viewing the most recently run backups.](./media/sap-ase-db-manage/last-backups.png)

> [!Note]
> You can also [monitor the backups](#monitor-manual-backup-jobs) from the **Backup jobs** page.

These on-demand backups are also displayed in the list of restore points on the **Select restore point** pane.

![Screenshot that shows a list of restore points.](./media/sap-ase-db-manage/list-restore-points.png)

#### Back up to local files instead of Backint

To back up local files, in the SAP ASE native client (ASE Studio/Cockpit), change the target to *local filesystem* instead of *Backint*.

Then ASE dumps the backups to the mentioned filesystem path and Azure Backup (the Backint service) places the subsequent catalog on that path using the `basepath_catalogbackup` parameter.

### Restore the backups

Restore operations that are triggered from ASE native clients that use Backint to restore backups *to the same machine* can be [monitored](#monitor-manual-backup-jobs) from the **Backup jobs** page.

Restore operations that are triggered from ASE native clients to restore *to another machine* aren't allowed. This is because, according to Azure role-based access control (RBAC) rules, the Azure Backup service can't authenticate the target server for restore operations.

### Delete the backups

The delete operation from ASE native clients isn't supported by Azure Backup, because the backup policy determines the lifecycle of backups in the Azure Recovery services vault.

### Clean up ASE catalog

The Azure Backup service currently doesn't modify the ASE backup catalog as per the policy. Because you can store the backup locally (outside of Backint), you need to maintain the lifecycle of the catalog. You can clean up the catalog as per the [SAP documentation](https://help.sap.com/docs/ASE_SERVICE_CF/7c78579ce9b14a669c1f3295b0d8ca16/22275913eb9e4a5bb539fc8df3da77f1.html) and Azure Backup (the Backint service) places the subsequent catalog in the path specified by the `basepath_catalogbackup` parameter.

## Next steps

- [Troubleshoot common issues with SAP ASE database backups](./backup-azure-sap-ase-database-troubleshoot.md)
