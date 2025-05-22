---
title: Obtain insights using Backup center
description: Learn how to analyze historical trends and gain deeper insights on your backups with Backup center. 
ms.topic: how-to
ms.date: 12/24/2024
author: jyothisuri
ms.author: jsuri
---

# Obtain Insights using Backup center

[!INCLUDE [backup-center-deprecation.md ](../../includes/backup-center-deprecation.md )]

To analyze historical trends and gaining deeper insights on your backups, Backup Center provides an interface to [Backup Reports](configure-reports.md), which uses [Azure Monitor Logs](/azure/azure-monitor/logs/data-platform-logs) and [Azure Workbooks](/azure/azure-monitor/visualize/workbooks-overview). Backup Reports offers the following capabilities:

- Allocating and forecasting of cloud storage consumed.

- Auditing of backups and restores.

- Identifying key trends at different levels of granularity.

- Gaining visibility and insights into cost optimization opportunities for your backups.

## Supported scenarios

- Backup Reports is currently not supported for workloads that are backed up using Backup vaults.

- Refer to the [support matrix](backup-center-support-matrix.md) for a detailed list of supported and unsupported scenarios.

[!INCLUDE [How to open the Backup center.](../../includes/backup-center-open-console.md)]



### Configure your vaults to send data to a Log Analytics workspace

[Learn how to configure diagnostics settings at scale for your vaults](./configure-reports.md#get-started)

### View Backup Reports in the Backup center portal

Selecting the **Backup Reports** menu item in Backup center opens up the reports. Choose one or more Log Analytics workspaces to view and analyze key information on your backups.

![Backup reports in Backup Center](./media/backup-center-obtain-insights/backup-center-backup-reports.png)

Following are the views available:

1. **Summary** - Use this tab to get a high-level overview of your backup estate. [Learn more](view-reports.md#summary)

2. **Backup Items** - Use this tab to see information and trends on cloud storage consumed at a Backup-item level. [Learn more](view-reports.md#backup-items)

3. **Usage** - Use this tab to view key billing parameters for your backups. [Learn more](view-reports.md#usage)

4. **Jobs** - Use this tab to view long-running trends on jobs, such as the number of failed jobs per day and the top causes of job failure. [Learn more](view-reports.md#jobs)

5. **Policies** - Use this tab to view information on all of your active policies, such as the number of associated items and the total cloud storage consumed by items backed up under a given policy. [Learn more](view-reports.md#policies)

6. **Optimize** - Use this tab to gain visibility into potential cost-optimization opportunities for your backups. [Learn more](view-reports.md#optimize)

7. **Policy adherence** - Use this tab to gain visibility into whether every backup instance has had at least one successful backup per day. [Learn more](view-reports.md#policies)

You can also configure emails for these reports using the [Email Report](backup-reports-email.md) feature.

## Next steps

- [Monitor and Operate backups](backup-center-monitor-operate.md)
- [Govern your backup estate](backup-center-govern-environment.md)
- [Perform actions using Backup center](backup-center-actions.md)