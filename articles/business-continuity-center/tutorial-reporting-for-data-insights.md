---
title: Tutorial - Set up and view reports in Azure Business Continuity Center
description: This tutorial describes how to set up and view reports in Azure Business Continuity Center.
ms.topic: tutorial
ms.date: 11/15/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---


# Tutorial: Set up and view reports

This tutorial describes how to set up and view reports in Azure Business Continuity Center.

Azure Business Continuity Center provides a reporting solution for the backup and disaster recovery administrators to gain insights on the long-term data related to Azure Backup and Azure Site Recovery. This solution includes:

- Allocating and forecasting of cloud storage consumed.
- Auditing backups and restores.
- Identifying key trends at different levels of detail.

The Reporting solution in Azure Business Continuity Center uses Azure Monitor logs and Azure workbooks. These resources enable you to gain insights on your estate that is protected with either Azure Backup or Azure Site Recovery.

## Create a Log Analytics workspace or use an existing workspace

Set up one or more Log Analytics workspaces to store your backup reporting data. The location and subscription of this Log Analytics workspace can be different from where your vaults are located or subscribed. To set up a Log Analytics workspace, see [this article](../azure-monitor/logs/quick-create-workspace.md).

The data in a Log Analytics workspace is kept for *30 days* by default. If you want to see data for a longer time span, change the retention period of the Log Analytics workspace. To change the retention period, see Configure data retention and archive policies in Azure Monitor Logs.

## Configure diagnostics settings for your vaults

Azure Resource Manager resources, like Recovery Services vaults, record information about backup and site recovery jobs as diagnostics data.

To learn how to configure diagnostics settings, see [this article](../azure-monitor/essentials/diagnostic-settings.md). You can also configure diagnostics settings for your vaults using the Azure portal by following these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the required **Recovery Services vault** > **Monitoring** > **Diagnostic settings**.

2. Specify the target for the Recovery Services Vault's diagnostic data. Learn [how to use diagnostic events for Recovery Services vaults](../backup/backup-azure-diagnostic-events.md?tabs=recovery-services-vaults).

## Generate reports

To generate the reports, see the following options:

- For Azure Site Recovery reports, select [**Azure Site Recovery Jobs**](/azure/azure-monitor/reference/tables/asrjobs) and **Azure Site Recovery Replicated Item Details** options to generate the reports.
- For Azure Backup reports, select [**Core Azure Backup**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#coreazurebackup) data, [**Addon Azure Backup Job**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupjobs) data, [**Addon Azure Backup Policy**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackuppolicy) data, [**Addon Azure Backup Storage**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupstorage) data, [**Addon Azure Backup Protected Instance**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupprotectedinstance) data, and [**Azure Backup Operations**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#azurebackupoperations).

>[!Note]
>After diagnostics configuration, it takes up to *24 hours* for the initial data push to complete. Once the data starts flowing in the Log Analytics workspace, you might not see the data in the reports immediately becauses the data for the current partial day isn't shown in the reports. Learn more about the [conventions](../site-recovery/report-site-recovery.md#conventions-used-in-site-recovery-reports).
>
>We recommend that you start viewing the reports two days after you configure your vaults to send data to Log Analytics.

## View reports in Azure Business Continuity Center

To view your reports after setting up your vault (to transfer data to Log Analytics workspace), go to **Business Continuity Center** > **Monitoring+Reporting** > **Reports**.

Azure Business Continuity Center provides various reports for Azure Backup and Azure Site Recovery to help fetching historical data for audit and executive purposes. Before you choose the required report, first, select one or more workspace subscriptions, log analytics workspaces, and other fields in the report to generate appropriate report with the required information. Learn [how to generate reports](#generate-reports).

The following table describes the types of available reports:

| Report | Solution | Description | Scope | Type |
| --- | --- | --- | --- | --- |
| **Backup Reports** | Azure Backup | Gain visibility into backup jobs, instances, usage, policies, policy adherence, and optimization. | - Virtual Machine (VM) <br> - SQL in Azure VMs <br> - SAP HANA in Azure VMs <br> - Backup Agent <br> - Backup Server <br> - Data Protection Manager (DPM) <br> - Azure Files <br> SQL database in Azure VM <br> - SAP HANA in Azure VM | Consolidated |
| **Backup Configuration Status** | Azure Backup | Information on whether all of your VMs have been configured for backup. | VM | Out-of-Box |
| **Backup Job History** | Azure Backup | Information on your successful and failed backup jobs over a specified duration. | - VM <br> - Backup Agent (MARS) <br> - Backup Server (MABS) <br> - DPM <br> - Azure Database for PostgreSQL Server <br> - Azure Blobs <br> - Azure Disks | Out-of-Box |
| **Backup Schedule and Retention** | Azure Backup | Information on schedule and retention of all your backup items so that you can verify if they meet the business requirements. | - VM <br>- Azure Files | Out-of-Box |
**User Triggered Operations** | Azure Backup | Information on user triggered operations on Recovery Services vaults over a specified period.  |  - VM <br>- Backup Agent <br>- Backup Server <br>- DPM <br>- Azure Files <br>- SQL database in Azure VM <br>- SAP HANA in Azure VM | Out-of-Box |
| **Azure Site Recovery Job History** | Azure Site Recovery | Information on your successful and failed Azure Site Recovery jobs over a specified duration. <br> Currently, only jobs triggered on replicated items and recovery plans are shown in this report. | VM | Out-of-Box |
| **Azure Site Recovery Replication History** | Azure Site Recovery | Information on your replicated items over a specified duration. | VM | Out-of-Box |


[!INCLUDE [backup-conventions-for-reports.md](../../includes/backup-conventions-for-reports.md)]

Learn about [the estimated time that different widgets can take to load, based on the number of Backup items and the time range for which the report is being viewed](../backup/configure-reports.md?tabs=recovery-services-vaults#query-load-times). To troubleshoot data discrepancy in backup reports, see [this article](../backup/configure-reports.md?tabs=recovery-services-vaults#how-to-troubleshoot).

## Next steps 

[Govern and view compliance](tutorial-govern-monitor-compliance.md)
