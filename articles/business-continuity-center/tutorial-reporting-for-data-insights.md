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


# Tutorial: Configure and view reports

This tutorial describes how to set up and view reports in Azure Business Continuity Center.

Azure Business Continuity Center provides a reporting solution for backup and disaster recovery administrators to gain insights into long-term data related to Azure Backup and Azure Site Recovery. This solution includes:

- Allocating and analyzing of cloud storage consumed.
- Auditing backups and restores.
- Identifying key trends at different levels of detail.

The Reporting solution in Azure Business Continuity Center uses [Azure Monitor logs and Azure workbooks](../azure-monitor/logs/log-analytics-tutorial.md). These resources enable you to gain insights into your estate that is protected with either Azure Backup or Azure Site Recovery.

## Configure reports

To set up reporting for backup and site recovery, see the following sections.

### Create a Log Analytics workspace or use an existing workspace

Set up one or more Log Analytics workspaces to store your backup reporting data. The location and subscription of this Log Analytics workspace can be different from where your vaults are located or subscribed. To set up a Log Analytics workspace, see [this article](../azure-monitor/logs/quick-create-workspace.md).

The data in a Log Analytics workspace is kept for *30 days* by default. If you want to see data for a longer time span, change the retention period of the Log Analytics workspace. To change the retention period, see [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-configure.md?tabs=portal-3%2Cportal-1%2Cportal-2).

### Configure diagnostics settings for your vaults

Azure Resource Manager resources, like Recovery Services vaults, record information about backup and site recovery jobs as diagnostics data.

To learn how to configure diagnostics settings, see [this article](../azure-monitor/essentials/diagnostic-settings.md). You can also configure diagnostics settings for your vaults using the Azure portal by following these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the required **Recovery Services vault** > **Monitoring** > **Diagnostic settings**.

2. Specify the target for the Recovery Services Vault's diagnostic data to Log Analytics workspace. Learn [how to use diagnostic events for Recovery Services vaults](../backup/backup-azure-diagnostic-events.md?tabs=recovery-services-vaults).

3. To configure the reports, choose one of the following solutions:

   - For Azure Site Recovery reports, select [**Azure Site Recovery Jobs**](/azure/azure-monitor/reference/tables/asrjobs) and **Azure Site Recovery Replicated Item Details** options to show the reports.
   - For Azure Backup reports, select [**Core Azure Backup**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#coreazurebackup) data, [**Addon Azure Backup Job**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupjobs) data, [**Addon Azure Backup Policy**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackuppolicy) data, [**Addon Azure Backup Storage**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupstorage) data, [**Addon Azure Backup Protected Instance**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#addonazurebackupprotectedinstance) data, and [**Azure Backup Operations**](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults#azurebackupoperations). Learn more [about data model for Azure Backup Diagnostics Events](../backup/backup-azure-reports-data-model.md?tabs=recovery-services-vaults).

>[!Note]
>After diagnostics configuration, it takes up to *24 hours* for the initial data push to complete. Once the data migrates to the Log Analytics workspace, the data in the reports might take some time to appear because the data for the current day isn't available in the reports. Learn more about the [conventions](../site-recovery/report-site-recovery.md#conventions-used-in-site-recovery-reports).

## View reports in Azure Business Continuity Center

We recommend that you start viewing the reports two days after you configure your vaults to send data to Log Analytics.

To view your reports after setting up your vault (to transfer data to Log Analytics workspace), go to **Business Continuity Center** > **Monitoring+Reporting** > **Reports**.

:::image type="content" source="./media/tutorial-reporting-for-data-insights/view-report-dashboard.png" alt-text="Screenshot shows the Reports dashboard in Azure Business Continuity Center." lightbox="./media/tutorial-reporting-for-data-insights/view-report-dashboard.png":::

Azure Business Continuity Center provides various reports for Azure Backup and Azure Site Recovery to help fetch historical data for audit and executive purposes. To view the appropriate report with the required information, select the required report, and then select one or more workspace subscriptions, Log Analytics workspaces, and other fields in the report.

The following table describes the types of available reports:

| Report | Solution | Description | Scope | Type |
| --- | --- | --- | --- | --- |
| **Backup Reports** | Azure Backup | Gain visibility into backup jobs, instances, usage, policies, policy adherence, and optimization. | - Virtual Machine (VM) <br> - SQL in Azure VMs <br> - SAP HANA in Azure VMs <br> - Backup Agent <br> - Backup Server <br> - Data Protection Manager (DPM) <br> - Azure Files <br> SQL database in Azure VM <br> - SAP HANA in Azure VM <br> - Disk<br> - Blob (operational tier) <br> - PostgreSQLSingle Server | Consolidated |
| **Backup Configuration Status** | Azure Backup | Information on whether all your VMs have been configured for backup. | VM | Out-of-Box |
| **Backup Job History** | Azure Backup | Information on your successful and failed backup jobs over a specified duration. | - VM <br> - Backup Agent (MARS) <br> - Backup Server (MABS) <br> - DPM <br> - Azure Database for PostgreSQL Server <br> - Azure Blobs <br> - Azure Disks | Out-of-Box |
| **Backup Schedule and Retention** | Azure Backup | Information on schedule and retention of all your backup items so that you can verify if they meet the business requirements. | - VM <br>- Azure Files | Out-of-Box |
| **User Triggered Operations** | Azure Backup | Information on user triggered operations on Recovery Services vaults over a specified period.  | Recovery Services vault | Out-of-Box |
| **Azure Site Recovery Job History** | Azure Site Recovery | Information on your successful and failed Azure Site Recovery jobs over a specified duration. <br> Currently, only jobs triggered on replicated items and recovery plans are shown in this report. | - VM <br> - VMware to Azure Disaster Recovery <br> - Hyper-V to Azure Disaster Recovery | Out-of-Box |
| **Azure Site Recovery Replication History** | Azure Site Recovery | Information on your replicated items over a specified duration. | - VM <br> - VMware to Azure Disaster Recovery <br> - Hyper-V to Azure Disaster Recovery | Out-of-Box |

>[!Note]
>The email capability is available for Backup Reports (consolidated) only. [Learn more](../backup/backup-reports-email.md).

### Additional reporting features

The reporting solution that Azure Business Continuity Center provides also includes the following capabilities:

- [Customize report](../backup/configure-reports.md?tabs=recovery-services-vaults#customize-azure-backup-reports)

- [Export to Excel](../backup/configure-reports.md?tabs=recovery-services-vaults#export-to-excel)

- [Pin to dashboard](../backup/configure-reports.md?tabs=recovery-services-vaults#pin-to-dashboard)

- [Cross-tenant report](../backup/configure-reports.md?tabs=recovery-services-vaults#cross-tenant-reports)

>[!Note]
>To learn about the expected behaviour of BCDR reports, see the [conventions used in BCDR reports](../backup/configure-reports.md?tabs=recovery-services-vaults#conventions-used-in-backup-reports).

## Next steps

- [Configure Azure Backup reports](../backup/configure-reports.md?tabs=recovery-services-vaults)
- [Configure Azure Site Recovery reports (Preview)](../site-recovery/report-site-recovery.md)
