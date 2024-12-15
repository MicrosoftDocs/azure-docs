---
title: Manage Azure Recovery Services vaults and servers
description: In this article, learn how to use the Recovery Services vault Overview dashboard to monitor and manage your Recovery Services vaults. 
ms.topic: how-to
ms.date: 10/10/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Monitor and manage Recovery Services vaults

This article explains how to use the Recovery Services vault **Overview** dashboard to monitor and manage your Recovery Services vaults. When you open a Recovery Services vault from the list, the **Overview** dashboard for the selected vault, opens. The dashboard provides various details about the vault. There are *tiles* that show: the status of critical and warning alerts, in-progress and failed backup jobs, and the amount of locally redundant storage (LRS) and geo-redundant storage (GRS) used. If you back up Azure VMs to the vault, the [**Backup Pre-Check Status** tile displays any critical or warning items](#backup-pre-check-status). The following image is the **Overview** dashboard for **Contoso-vault**. The **Backup Items** tile shows there are nine items registered to the vault.

![Recovery Services vault dashboard](./media/backup-azure-manage-windows-server/rs-vault-blade.png)

The prerequisites for this article are: an Azure subscription, a Recovery Services vault, and that there's at least one backup item configured for the vault.

[!INCLUDE [learn-about-deployment-models](~/reusable-content/ce-skilling/azure/includes/learn-about-deployment-models-rm-include.md)]

## Open a Recovery Services vault

To monitor alerts, or view management data about a Recovery Services vault, open the vault.

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Azure subscription.

2. In the portal, select **All services**.

   ![Open list of Recovery Services vaults step 1](./media/backup-azure-manage-windows-server/open-rs-vault-list.png)

3. In the **All services** dialog box, type **Recovery Services**. As you begin typing, the list filters based on your input. When the **Recovery Services vaults** option appears, select it to open the list of Recovery Services vaults in your subscription.

    ![Create Recovery Services vault step 1](./media/backup-azure-manage-windows-server/list-of-rs-vaults.png) <br/>

4. From the list of vaults, select a vault to open its **Overview** dashboard.

    ![Recovery Services vault dashboard](./media/backup-azure-manage-windows-server/rs-vault-blade.png) <br/>

    The Overview dashboard uses tiles to provide alerts and backup job data.

## Monitor backup jobs and alerts

The Recovery Services vault **Overview** dashboard provides tiles for Monitoring and Usage information. The tiles in the Monitoring section display Critical and Warning alerts, and In progress and Failed jobs. Select a particular alert or job to open the Backup Alerts or Backup Jobs menu, filtered for that job or alert.

![Backup dashboard tasks](./media/backup-azure-manage-windows-server/monitor-dashboard-tiles-warning.png)

[!INCLUDE [Classic alerts deprecation for Azure Backup.](../../includes/backup-azure-classic-alerts-deprecation.md)]

The Monitoring section shows the results of predefined **Backup Alerts** and **Backup Jobs** queries. The Monitoring tiles provide up-to-date information about:

* Critical and Warning alerts for Backup jobs (in the last 24 hours)
* Pre-check status for Azure VMs. For complete information on the pre-check status, see [Backup Pre-Check Status](#backup-pre-check-status).
* The Backup jobs in progress, and jobs that have failed (in the last 24 hours).

The Usage tiles provide:

* The number of Backup items configured for the vault.
* The Azure storage (separated by LRS and GRS) consumed by the vault.

Select the tiles (except Backup Storage) to open the associated menu. In the image above, the Backup Alerts tile shows three Critical alerts. Select the Critical alerts row in the Backup Alerts tile to open the Backup Alerts filtered for Critical alerts.

![Backup alerts menu filtered for critical alerts](./media/backup-azure-manage-windows-server/critical-backup-alerts.png)

You can see the details of classic alerts by selecting the **Backup Alerts** tile.

>[!Important]
>Classic alerts for Azure Backup will be deprecated on 31 March 2026. We recommend you to [migrate to Azure Monitor Alerts](backup-azure-monitoring-alerts.md#migrate-from-classic-alerts-to-built-in-azure-monitor-alerts) for a seamless experience. View **Azure Monitor alerts** on the **Alerts** blade in the Recovery Services Vault.

### Backup Pre-Check Status

Backup Pre-Checks check your VMs' configuration for issues that can adversely affect backups. They aggregate this information so you can view it directly from the Recovery Services vault dashboard and provide recommendations for corrective measures to ensure successful file-consistent or application-consistent backups. They require no infrastructure and have no additional cost.  

Backup Pre-Checks run as part of the scheduled backup operations for your Azure VMs. They conclude with one of the following states:

* **Passed**: This state indicates that your VM's configuration should lead to successful backups and no corrective action needs to be taken.
* **Warning**: This state indicates one or more issues in the VM's configuration that *might* lead to backup failures. It provides *recommended* steps to ensure successful backups. For example, not having the latest VM Agent installed can cause backups to fail intermittently. This situation will provide a warning state.
* **Critical**: This state indicates one or more critical issues in the VM's configuration that *will* lead to backup failures and provides *required* steps to ensure successful backups. For example, a network issue caused by an update to the NSG rules of a VM, will cause backups to fail, as it prevents the VM from communicating with the Azure Backup service. This situation will provide a critical state.

Follow the steps below to start resolving any issues reported by Backup Pre-Checks for VM backups on your Recovery Services vault.

* Select the **Backup Pre-Check Status (Azure VMs)** tile on the Recovery Services vault dashboard.
* Select any VM with a Backup Pre-Check status of either **Critical** or **Warning**. This action will open the **VM details** pane.
* Select the pane notification on the top of the pane to reveal the configuration issue description and remedial steps.

## Manage Backup alerts

To access the Backup Alerts menu, in the Recovery Services vault menu, select **Backup Alerts**.

![Backup alerts](./media/backup-azure-manage-windows-server/backup-alerts-menu.png)

The Backup Alerts report lists the alerts for the vault.

![Backup alerts report](./media/backup-azure-manage-windows-server/backup-alerts.png)

>[!Important]
>Backup Alerts (Classic) will be deprecated by 31st March, 2026. Migrate to Azure Monitor alerts for a seamless experience. View **Azure Monitor Alerts** on the **Alerts** tab.

## Manage Backup items

A Recovery Services vault holds many types of backup data. [Learn more](backup-overview.md#what-can-i-back-up) about what you can back up. To manage the various servers, computers, databases, and workloads, select the **Backup Items** tile to view the contents of the vault.

![Backup items tile](./media/backup-azure-manage-windows-server/backup-items.png)

The list of Backup Items, organized by Backup Management Type, opens.

![List of Backup items](./media/backup-azure-manage-windows-server/list-backup-items.png)

To explore a specific type of protected instance, select the item in the Backup Management Type column. For example, in the above image, there are two Azure virtual machines protected in this vault. Select **Azure Virtual Machine** to open the list of protected virtual machines in this vault.

![List of protected virtual machines](./media/backup-azure-manage-windows-server/list-of-protected-virtual-machines.png)

The list of virtual machines has helpful data: the associated Resource Group, previous [Backup Pre-Check](#backup-pre-check-status), Last Backup Status, and date of the most recent Restore Point. The ellipsis, in the last column, opens the menu to trigger common tasks. The helpful data provided in columns is different for each backup type.

![Open ellipsis menu for common tasks](./media/backup-azure-manage-windows-server/ellipsis-menu.png)

## Manage Backup jobs

The **Backup Jobs** tile in the vault dashboard shows the number of jobs that are In Progress, or Failed in the last 24 hours. The tile provides a glimpse into the Backup Jobs menu.

![Back jobs tile](./media/backup-azure-manage-windows-server/backup-jobs-tile.png)

To see additional details about the jobs, select **In Progress** or **Failed** to open the Backup Jobs menu filtered for that state.

### Backup jobs menu

The **Backup Jobs** menu displays information about the Item type, Operation, Status, Start Time, and Duration.  

To open the Backup Jobs menu, in the vault's main menu, select **Backup Jobs**.

![Select backup jobs](./media/backup-azure-manage-windows-server/backup-jobs-menu-item.png)

The list of Backup jobs opens.

![List of backup jobs](./media/backup-azure-manage-windows-server/backup-jobs-list.png)

The Backup Jobs menu shows the status for all operations, on all backup types, for the last 24 hours. Use **Filter** to change the filters. The filters are explained in the following sections.

To change the filters:

1. In the vault Backup Jobs menu, select **Filter**.

   ![Select filter for backup jobs](./media/backup-azure-manage-windows-server/vault-backup-job-menu-filter.png)

    The Filter menu opens.

   ![Filter menu opens for backup jobs](./media/backup-azure-manage-windows-server/filter-menu-backup-jobs.png)

2. Choose the filter settings and select **Done**. The filtered list refreshes based on the new settings.

#### Item type

The Item type is the backup management type of the protected instance. There are four types; see the following list. You can view all item types, or one item type. You can't select two or three item types. The available Item types are:

* All item types
* Azure virtual machine
* Files and folders
* Azure Storage
* Azure workload

#### Operation

You can view one operation, or all operations. You can't select two or three operations. The available Operations are:

* All Operations
* Register
* Configure backup
* Backup
* Restore
* Disable backup
* Delete backup data

#### Status

You can view All Status or one. You can't select two or three statuses. The available statuses are:

* All Status
* Completed
* In progress
* Failed
* Canceled
* Completed with warnings

#### Start time

The day and time that the query begins. The default is a 24-hour period.

#### End time

The day and time when the query ends.

### Export jobs

Use **Export jobs** to create a spreadsheet containing all Jobs menu information. The spreadsheet has one sheet that holds a summary of all jobs, and individual sheets for each job.

To export the jobs information to a spreadsheet, select **Export jobs**. The service creates a spreadsheet using the name of the vault and date, but you can change the name.

## Monitor Backup usage

The Backup Storage tile in the dashboard shows the storage consumed in Azure. Storage usage is provided for:

* Cloud LRS storage usage associated with the vault
* Cloud GRS storage usage associated with the vault

## Next steps

* [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md).
* [Troubleshoot monitoring issues](backup-azure-monitor-troubleshoot.md).
* To learn more about Azure Backup, see [Azure Backup Overview](./backup-overview.md).
