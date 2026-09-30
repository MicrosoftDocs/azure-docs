---
title: Tutorial - Set up and view reports in Resiliency
description: This tutorial describes how to set up and view reports in Resiliency.
ms.topic: tutorial
ms.date: 11/19/2025
ms.service: resiliency
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---


# Tutorial: Configure and view reports

This tutorial describes how to set up and view reports in the Resiliency in Azure.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

Resiliency in Azure provides a reporting solution for backup and disaster recovery administrators to gain insights into long-term data related to Azure Backup and Azure Site Recovery. This solution includes:

- Allocating and analyzing of cloud storage consumed.
- Auditing backups and restores.
- Identifying key trends at different levels of detail.

The Reporting solution in the Resiliency in Azure uses [Azure Monitor logs and Azure workbooks](/azure/azure-monitor/logs/log-analytics-tutorial). These resources enable you to gain insights into your estate that is protected with either Azure Backup or Azure Site Recovery.

## Configure reports

To set up reporting for backup and site recovery, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. [Set up a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

   Set up one or more Log Analytics workspaces to store your backup reporting data. The location and subscription of this Log Analytics workspace can be different from where your vaults are located or subscribed. 

3. To view data for a longer time span, [modify the retention period of the Log Analytics workspace](/azure/azure-monitor/logs/data-retention-configure?tabs=portal-3%2Cportal-1%2Cportal-2). The data in a Log Analytics workspace is kept for *30 days* by default.

4. [Configure diagnostics settings for your vault](/azure/azure-monitor/essentials/diagnostic-settings).

   Azure Resource Manager resources, like Recovery Services vaults, record information about backup and site recovery jobs as diagnostics data.

    You can also configure diagnostics settings for your resiliency estate using the steps for [Azure Backup](../backup/backup-azure-diagnostic-events.md?tabs=recovery-services-vaults) and [Azure Site Recovery](../site-recovery/report-site-recovery.md#configure-diagnostics-settings-for-your-vaults).

>[!Note]
>After diagnostics configuration, it takes up to *24 hours* for the initial data push to complete. Once the data migrates to the Log Analytics workspace, the data in the reports might take some time to appear because the data for the current day isn't available in the reports.
>
> Learn more about the [conventions](../site-recovery/report-site-recovery.md#conventions-used-in-site-recovery-reports).

## View reports in the Resiliency in Azure

We recommend that you start viewing the reports two days after you configure your vaults to send data to Log Analytics.

To view your reports after setting up your vault (to transfer data to Log Analytics workspace), follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to **Resiliency** > **Monitoring+Reporting** > **Reports**.

     :::image type="content" source="./media/tutorial-reporting-for-data-insights/view-report-dashboard.png" alt-text="Screenshot shows the Reports dashboard in Resiliency." lightbox="./media/tutorial-reporting-for-data-insights/view-report-dashboard.png":::

Resiliency in Azure provides various reports for Azure Backup and Azure Site Recovery to help fetch historical data for audit and executive purposes. 


Choose the required report type for [Azure Backup](../backup/view-reports.md#view-reports-in-the-azure-portal) and [Azure Site Recovery](../site-recovery/report-site-recovery.md#view-reports-in-business-continuity-center). 

### Other reporting features

The reporting solution that Resiliency in Azure provides also includes the following capabilities:

- [Report customization](../backup/view-reports.md#customize-azure-backup-reports)

- [Export to Excel](../backup/view-reports.md#export-to-excel)

- [Pin to dashboard](../backup/view-reports.md#pin-to-dashboard)

- [Cross-tenant report](../backup/view-reports.md#cross-tenant-reports)

>[!Note]
>To learn about the expected behaviour of resiliency reports, see the [conventions used in resiliency reports](../backup/configure-reports.md?tabs=recovery-services-vaults#conventions-used-in-backup-reports).

## Next steps

- [Configure Azure Backup reports](../backup/configure-reports.md?tabs=recovery-services-vaults)
- [Configure Azure Site Recovery reports (Preview)](../site-recovery/report-site-recovery.md)
