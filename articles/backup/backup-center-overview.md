---
title: Overview of Backup Center
description: This article provides an overview of Backup Center for Azure.
ms.topic: conceptual
ms.date: 09/30/2020
---

# Overview of Backup Center

Backup Center provides a **single unified management experience** in Azure for enterprises to govern, monitor, operate, and analyze backups at scale. As such, it's consistent with Azure’s native management experiences.

Some of the key benefits of Backup Center include:

* **Single pane of glass to manage backups** – Backup Center is designed to function well across a large and distributed Azure environment. You can use Backup Center to efficiently manage backups spanning multiple workload types, vaults, subscriptions, regions, and [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/overview) tenants.
* **Datasource-centric management** – Backup Center provides views and filters that are centered on the datasources that you're backing up (for example, VMs and databases). This allows a resource owner or a backup admin to monitor and operate backups of items without needing to focus on which vault an item is backed up to. A key feature of this design is the ability to filter views by datasource-specific properties, such as datasource subscription, datasource resource group, and datasource tags. For example, if your organization follows a practice of assigning different tags to VMs belonging to different departments, you can use Backup Center to filter backup information based on the tags of the underlying VMs being backed up without needing to focus on the tag of the vault.
* **Connected experiences** – Backup Center provides native integrations to existing Azure services that enable management at scale. For example, Backup Center uses the [Azure Policy](https://docs.microsoft.com/azure/governance/policy/overview) experience to help you govern your backups. It also leverages [Azure workbooks](https://docs.microsoft.com/azure/azure-monitor/platform/workbooks-overview) and [Azure Monitor Logs](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs) to help you view detailed reports on backups. So you don't need to learn any new principles to use the varied features that Backup Center offers.

## Supported scenarios

* Backup Center is currently supported for Azure VM backup and Azure Database for PostgreSQL Server backup.
* Refer to the [support matrix](backup-center-support-matrix.md) for a detailed list of supported and unsupported scenarios.

## Get started

To get started with using Backup Center, search for **Backup Center** in the Azure portal and navigate to the **Backup Center (Preview)** dashboard.

![Backup Center Search](./media/backup-center-overview/backup-center-search.png)

The first screen that you see is the **Overview**. It contains two tiles – **Jobs** and **Backup instances**.

![Backup Center tiles](./media/backup-center-overview/backup-center-overview-widgets.png)

In the **Jobs** tile, you get a summarized view of all backup and restore related jobs that were triggered across your backup estate in the last 24 hours. You can view information on the number of jobs that have completed, failed, and are in-progress. Selecting any of the numbers in this tile allows you to view more information on jobs for a particular datasource type, operation type, and status.

In the **Backup Instances** tile, you get a summarized view of all backup instances across your backup estate. For example, you can see the number of backup instances that are in soft-deleted state compared to the number of instances that are still configured for protection. Selecting any of the numbers in this tile allows you to view more information on backup instances for a particular datasource type and protection state.

Watch the following video to understand the capabilities of Backup Center:

> [!VIDEO https://www.youtube.com/embed/pFRMBSXZcUk?t=497]

Follow the [next steps](#next-steps) to understand the different capabilities that Backup Center provides, and how you can use these capabilities to manage your backup estate efficiently.

## Next steps

* [Monitor and Operate backups](backup-center-monitor-operate.md)
* [Govern your backup estate](backup-center-govern-environment.md)
* [Obtain insights on your backups](backup-center-obtain-insights.md)
* [Perform actions using Backup Center](backup-center-actions.md)
