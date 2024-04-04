---
title: Overview of Backup center for Azure Backup and Azure Site Recovery
description: This article provides an overview of Backup center for Azure.
ms.topic: conceptual
ms.date: 12/08/2022
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About Backup center for Azure Backup and Azure Site Recovery

Backup center provides a *single unified management experience* in Azure for enterprises to govern, monitor, operate, and analyze backups at scale. It also provides at-scale monitoring and management capabilities for Azure Site Recovery. So, it's consistent with Azure's native management experiences.

In this article, you'll learn about:

> [!div class="checklist"]
> - Key benefits
> - Supported scenarios
> - Get started
> - Access community resources on Community Hub

## Key benefits

Some of the key benefits of Backup center include:

- **Single pane of glass to manage backups**: Backup center is designed to function well across a large and distributed Azure environment. You can use Backup center to efficiently manage backups spanning multiple workload types, vaults, subscriptions, regions, and [Azure Lighthouse](../lighthouse/overview.md) tenants.
- **Datasource-centric management**: Backup center provides views and filters that are centered on the datasources that you're backing up (for example, VMs and databases). This allows a resource owner or a backup admin to monitor and operate backups of items without needing to focus on which vault an item is backed up to. A key feature of this design is the ability to filter views by datasource-specific properties, such as datasource subscription, datasource resource group, and datasource tags. For example, if your organization follows a practice of assigning different tags to VMs belonging to different departments, you can use Backup center to filter backup information based on the tags of the underlying VMs being backed up without needing to focus on the tag of the vault.
- **Connected experiences**: Backup center provides native integrations to existing Azure services that enable management at scale. For example, Backup center uses the [Azure Policy](../governance/policy/overview.md) experience to help you govern your backups. It also leverages [Azure workbooks](../azure-monitor/visualize/workbooks-overview.md) and [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md) to help you view detailed reports on backups. So, you don't need to learn any new principles to use the varied features that the Backup center offers. You can also [discover community resources from the Backup center](#access-community-resources-on-community-hub).
- **At-scale monitoring capabilities**: Backup center now provides at-scale monitoring capabilities that help you to view replicated items and jobs across all vaults and manage them across subscriptions, resource groups, and regions from a single view for Azure Site Recovery.

## Supported scenarios

Backup center is currently supported for:

- Azure VM backup
- SQL in Azure VM backup
- SAP HANA on Azure VM backup
- Azure Files backup
- Azure Blobs backup
- Azure Managed Disks backup
- Azure Database for PostgreSQL Server backup
- Azure to Azure disaster recovery
- VMware and Physical to Azure disaster recovery

Learn more about [supported and unsupported scenarios](backup-center-support-matrix.md).

## Get started

To get started with using Backup center, search for **Backup center** in the Azure portal and navigate to the **Backup center** dashboard.

:::image type="content" source="./media/backup-center-overview/backup-center-search.png" alt-text="Screenshot showing how to search for Backup center.":::

On the **Overview** blade, two tiles appear – **Jobs** and **Backup instances**.

:::image type="content" source="./media/backup-center-overview/backup-center-overview-widgets.png" alt-text="Screenshot showing the Backup center tiles.":::

On the **Jobs** tile, you get a summarized view of all backup and restore related jobs that were triggered across your backup estate in the last 24 hours.

- You can view information on the number of jobs that have completed, failed, and are in-progress.
- Select any of the numbers in this tile allows you to view more information on jobs for a particular datasource type, operation type, and status.

On the **Jobs** tile, you also get a summarized view of all Azure Site Recovery related jobs that were triggered across your entire replication estate in the last 24 hours.

:::image type="content" source="./media/backup-center-overview/azure-site-recovery-job-backup-center.png" alt-text="Screenshot showing an Azure Site Recovery job on Backup center.":::

On the **Backup Instances** tile, you get a summarized view of all backup instances across your backup estate. For example, you can see the number of backup instances that are in soft-deleted state compared to the number of instances that are still configured for protection.

- Select any of the numbers in this tile allows you to view more information on backup instances for a particular datasource type and protection state.
- You can also view all backup instances whose underlying datasource isn't found (the datasource might be deleted, or you may not have access to the datasource).

On the **Backup Instances** tile, you can also get a summarized view of all replicated items across your entire replication estate.

:::image type="content" source="./media/backup-center-overview/azure-site-recovery-replication-estate-backup-instance.png" alt-text="Screenshot showing a backup instance of a replicated item of Azure Site Recovery on Backup center.":::

Watch the following video to understand the capabilities of Backup center:

> [!VIDEO https://www.youtube.com/embed/pFRMBSXZcUk?t=497]

See the [next steps](#next-steps) to understand the different capabilities that Backup center provides, and how you can use these capabilities to manage your backup estate efficiently.

## Access community resources on Community Hub

You can use Backup center to access various community resources useful for a backup admin or operator.

To access the Community Hub, navigate to the Backup center in the Azure portal and select the **Community** menu item.

:::image type="content" source="./media/backup-center-community/backup-center-community-hub.png" alt-text="Screenshot showing you how to access Community Hub via Backup center.":::

Some of the resources available via the Community Hub are:

- **Microsoft Q&A**: You can use this forum to ask and discover questions about various product features and obtain guidance from the community.

- **Feature Requests**: You can navigate to UserVoice and file feature requests.

- **Samples for automated deployments**: Using the Community Hub, you can discover sample Azure Resource Manager (ARM) templates and Azure Policies that you can use out of the box. You can also find sample PowerShell Scripts, CLI commands, and Microsoft Database Backup scripts.

## Next steps

* [Monitor and Operate backups](backup-center-monitor-operate.md)
* [Govern your backup estate](backup-center-govern-environment.md)
* [Obtain insights on your backups](backup-center-obtain-insights.md)
* [Perform actions using Backup center](backup-center-actions.md)
