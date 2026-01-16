---
title: Manage Azure Recovery Services Vaults and Servers
description: In this article, learn how to use the Recovery Services vault Overview dashboard to monitor and manage your Recovery Services vaults. 
ms.topic: how-to
ms.date: 12/19/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to use the Overview dashboard of the Recovery Services vault to monitor Azure Backup jobs and alerts so that I can ensure the reliability and effectiveness of our backup and recovery processes."
---
# Monitor and manage Recovery Services vaults

This article explains how to use the Recovery Services vault **Overview** dashboard to monitor and manage your Recovery Services vaults. When you open a Recovery Services vault from the list, the **Overview** dashboard for the selected vault opens. The dashboard provides details about the vault. The tiles show:

- The status of Critical and Warning alerts.
- In-progress and failed backup jobs.
- The amount of locally redundant storage (LRS) and geo-redundant storage (GRS) used.

If you back up Azure virtual machines (VMs) to the vault, the [Backup Pre-Check Status tile displays any Critical or Warning alerts](#backup-pre-check-status). The following image shows the **Overview** dashboard for **Contoso-vault**. The **Backup items** tile shows nine items registered to the vault.

![Screenshot that shows the Recovery Services vault dashboard.](./media/backup-azure-manage-windows-server/rs-vault-blade.png)

## Prerequisites

- An Azure subscription
- A Recovery Services vault
- At least one Azure Backup item configured for the vault

[!INCLUDE [learn-about-deployment-models](~/reusable-content/ce-skilling/azure/includes/learn-about-deployment-models-rm-include.md)]

Learn how to create a Recovery Services vault by using the [Azure portal](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) and a [REST API](backup-azure-arm-userestapi-createorupdatevault.md).

## Open a Recovery Services vault

To monitor alerts or view management data about a Recovery Services vault, open the vault.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure subscription.

1. In the portal, select **All services**.

   ![Screenshot that shows the Recovery Services vaults option.](./media/backup-azure-manage-windows-server/open-rs-vault-list.png)

1. In the **All services** dialog, enter **Recovery Services**. As you begin typing, the list filters based on your input. When the **Recovery Services vaults** option appears, select it to open the list of Recovery Services vaults in your subscription.

    ![Screenshot that shows the list of Recovery Services vaults.](./media/backup-azure-manage-windows-server/list-of-rs-vaults.png) <br/>

1. From the list of vaults, select a vault to open its **Overview** dashboard.

    ![Screenshot that shows the Recovery Services vault dashboard.](./media/backup-azure-manage-windows-server/rs-vault-blade.png) <br/>

    The **Overview** dashboard uses tiles to provide alerts and backup job data.

## Monitor backup jobs and alerts

The Recovery Services vault **Overview** dashboard provides tiles for monitoring and use information. The tiles in the **Monitoring** section show **Critical** and **Warning** alerts and **In progress** and **Failed** jobs. Select a particular alert or job to open the **Backup Alerts** or **Backup Jobs** menu filtered for that job or alert.

![Screenshot that shows the Backup dashboard tasks.](./media/backup-azure-manage-windows-server/monitor-dashboard-tiles-warning.png)

[!INCLUDE [Classic alerts deprecation for Azure Backup.](../../includes/backup-azure-classic-alerts-deprecation.md)]

The **Monitoring** section shows the results of predefined Backup alerts and backup jobs queries. The **Monitoring** tiles provide up-to-date information about:

* **Critical** and **Warning** alerts for backup jobs in the last 24 hours.
* Precheck status for Azure VMs. For complete information on the precheck status, see [Backup Pre-Check Status](#backup-pre-check-status).
* The backup jobs in progress, and the jobs that failed in the last 24 hours.

The **Usage** tiles provide information about:

* The number of backup items configured for the vault.
* The Azure storage (separated by LRS and GRS) consumed by the vault.

Select the tiles (except **Backup Storage**) to open the associated menu. In the preceding image, the **Backup Alerts** tile shows three **Critical** alerts. Select the **Critical** alerts row on the **Backup Alerts** tile to open the Backup alerts filtered for **Critical** alerts.

![Screenshot that shows the Backup alerts menu filtered for Critical alerts.](./media/backup-azure-manage-windows-server/critical-backup-alerts.png)

To see the details of classic alerts, select the **Backup Alerts** tile.

> [!IMPORTANT]
> Classic alerts for Azure Backup will be deprecated on March 31, 2026. We recommend that you [migrate to Azure Monitor alerts](backup-azure-monitoring-alerts.md#migrate-from-classic-alerts-to-built-in-azure-monitor-alerts) for a seamless experience. View **Azure Monitor alerts** on the **Alerts** pane in the Recovery Services vault.

### Backup Pre-Check Status

Backup prechecks assess your VM configuration for issues that can adversely affect backups. They aggregate this information so that you can view it directly from the Recovery Services vault dashboard and provide recommendations for corrective measures to ensure successful file-consistent or application-consistent backups. They require no infrastructure and have no other cost.  

Backup prechecks run as part of the scheduled backup operations for your Azure VMs. They conclude with one of the following states:

* **Passed**: This state indicates that your VM's configuration should lead to successful backups and no corrective action needs to be taken.
* **Warning**: This state indicates one or more issues in the VM's configuration that *might* lead to backup failures. It provides *recommended* steps to ensure successful backups. For example, not having the latest VM Agent installed can cause backups to fail intermittently. This situation provides a Warning state.
* **Critical**: This state indicates one or more critical issues in the VM's configuration that *will* lead to backup failures and provides *required* steps to ensure successful backups. For example, a network issue caused by an update to the network security group rules of a VM causes backups to fail. It prevents the VM from communicating with Azure Backup. This situation provides a Critical state.

Follow these steps to start resolving any issues reported by backup prechecks for VM backups on your Recovery Services vault:

* Select the **Backup Pre-Check Status (Azure VMs)** tile on the Recovery Services vault dashboard.
* Select any VM with a backup precheck status of either **Critical** or **Warning** to open the **VM details** pane.
* Select the pane notification at the top of the pane to reveal the configuration issue description and remedial steps.

## Manage Backup alerts

To access the **Backup Alerts** menu, on the Recovery Services vault menu, select **Backup Alerts**.

![Screenshot that shows the Backup alerts.](./media/backup-azure-manage-windows-server/backup-alerts-menu.png)

The Backup alerts report lists the alerts for the vault.

![Screenshot that shows the Backup alerts report.](./media/backup-azure-manage-windows-server/backup-alerts.png)

> [!IMPORTANT]
> Backup alerts (classic) will be deprecated by March 31, 2026. Migrate to Azure Monitor alerts for a seamless experience. See **Azure Monitor Alerts** on the **Alerts** tab.

## Manage backup items

A Recovery Services vault holds many types of backup data. To learn about what you can back up, see [What is the Azure Backup service?](backup-overview.md#what-can-i-back-up). To manage your various servers, computers, databases, and workloads, select the **Backup items** tile to view the contents of the vault.

![Screenshot that shows the Backup items tile.](./media/backup-azure-manage-windows-server/backup-items.png)

The list of backup items is organized by backup management type.

![Screenshot that shows the list of backup items.](./media/backup-azure-manage-windows-server/list-backup-items.png)

To explore a specific type of protected instance, select the item in the **Backup Management Type** column. For example, in the preceding image, two Azure VMs are protected in this vault. To open the list of protected VMs in this vault, select **Azure Virtual Machine**.

![Screenshot that shows the list of protected VMs.](./media/backup-azure-manage-windows-server/list-of-protected-virtual-machines.png)

The list of VMs has data like:

- The associated resource group.
- Previous [backup precheck](#backup-pre-check-status).
- Last backup status.
- Date of the most recent restore point.

In the last column, the ellipsis opens the menu to trigger common tasks. The data provided in columns is different for each backup type.

![Screenshot that shows the open ellipsis menu for common tasks.](./media/backup-azure-manage-windows-server/ellipsis-menu.png)

## Manage backup jobs

The **Backup Jobs** tile in the vault dashboard shows the number of jobs that are in progress or that failed in the last 24 hours. The tile provides a glimpse into the **Backup Jobs** menu.

![Screenshot that shows the Backup Jobs tile.](./media/backup-azure-manage-windows-server/backup-jobs-tile.png)

To see more information about the jobs, select **In Progress** or **Failed** to open the **Backup Jobs** menu filtered for that state.

### Backup Jobs menu

The **Backup Jobs** menu shows information about the item type, operation, status, start time, and duration.

To open the **Backup Jobs** menu, on the vault's main menu, select **Backup Jobs**.

![Screenshot that shows selecting Backup Jobs.](./media/backup-azure-manage-windows-server/backup-jobs-menu-item.png)

The list of backup jobs opens.

![Screenshot that shows the list of backup jobs.](./media/backup-azure-manage-windows-server/backup-jobs-list.png)

The **Backup Jobs** menu shows the status for all operations, on all backup types, for the last 24 hours. Use **Filter** to change the filters. The filters are explained in the following sections.

To change the filters:

1. On the vault **Backup Jobs** menu, select **Filter**.

   ![Screenshot that shows the filter for backup jobs.](./media/backup-azure-manage-windows-server/vault-backup-job-menu-filter.png)

    The **Filter** menu opens.

   ![Screenshot that shows the Filter menu open for backup jobs.](./media/backup-azure-manage-windows-server/filter-menu-backup-jobs.png)

1. Choose the filter settings and select **Done**. The filtered list refreshes based on the new settings.

#### Item type

The item type is the backup management type of the protected instance. You can view all item types or one item type. You can't select two or three item types. The available item types in the dropdown list are:

* **All item types**
* **Azure virtual machine**
* **Files and folders**
* **Azure Storage**
* **Azure workload**

#### Operation

You can view one operation or all operations. You can't select two or three operations. The available operations in the dropdown list are:

* **All Operations**
* **Register**
* **Configure backup**
* **Backup**
* **Restore**
* **Disable backup**
* **Delete backup data**

#### Status

You can view all statuses or one. You can't select two or three statuses. The available statuses in the dropdown list are:

* **All Status**
* **Completed**
* **In progress**
* **Failed**
* **Canceled**
* **Completed with warnings**

#### Start time

The day and time when the query begins. The default is a 24-hour period.

#### End time

The day and time when the query ends.

### Export jobs

Use **Export jobs** to create a spreadsheet that contains all the menu information for jobs. The spreadsheet has one sheet that holds a summary of all jobs and individual sheets for each job.

To export the jobs information to a spreadsheet, select **Export jobs**. The service creates a spreadsheet by using the name of the vault and date, but you can change the name.

> [!NOTE]
> Azure Backup currently doesn't support exporting jobs with a filter applied. Triggering this operation fails for SQL and SAP HANA workload types. Alternatively, enable a Log Analytics workspace and [export workload-specific jobs](backup-azure-monitoring-use-azuremonitor.md#queries-specific-to-recovery-services-vault-workloads).

## Monitor Backup use

The **Backup Storage** tile on the dashboard shows the storage consumed in Azure. Storage use information is provided for:

* Cloud LRS storage use associated with the vault.
* Cloud GRS storage use associated with the vault.

## Optimize backup and recovery with Resiliency Copilot

Resiliency Copilot introduces new capabilities in the pane for Recovery Services vaults. You can use it to configure or manage a secure, resilient backup and recovery environment. You can:

- [Increase security levels](../business-continuity-center/tutorial-manage-data-using-copilot.md#increase-security-level-of-recovery-service-vault-and-backup-vault) to strengthen protection for backup data and disaster recovery operations.
- [Analyze job failures](../business-continuity-center/tutorial-manage-data-using-copilot.md#analyze-job-failures-for-recovery-service-vault-and-backup-vault) to gain insights into failures for precise analysis and faster resolution.
- [Configure protection for unprotected resources](..\business-continuity-center\tutorial-manage-data-using-copilot.md#configure-protection-for-resources-in-recovery-services-vault-and-backup-vault).
- [Reconfigure backup for data sources in an alternate vault](../business-continuity-center/tutorial-reconfigure-backup-alternate-vault.md).
- [Delete a vault](..\business-continuity-center\tutorial-manage-data-using-copilot.md#delete-recovery-services-vault-and-backup-vault-using-copilot).
- [Troubleshoot common errors efficiently](../business-continuity-center/tutorial-manage-data-using-copilot.md#troubleshoot-error-codes-for-recovery-service-vaults-and-backup-vaults).
- [Manage the business continuity and disaster recovery estate by using Copilot (preview)](../business-continuity-center/tutorial-manage-data-using-copilot.md).

## Related content

- [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md)
- [Update the soft delete state for a Recovery Services vault by using a REST API](use-restapi-update-vault-properties.md)
- [Troubleshoot monitoring issues](backup-azure-monitor-troubleshoot.md)
- [What is Azure Backup?](./backup-overview.md)
