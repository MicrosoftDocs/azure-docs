---
title: Monitor and operate backups using Backup Center
description: This article explains how to monitor and operate backups at scale using Backup Center
ms.topic: conceptual
ms.date: 09/01/2020
---

# Monitor and operate backups using Backup Center

As a backup admin, you can use Backup Center as a single pane of glass to monitor your jobs and backup inventory on a day-to-day basis. You can also use Backup Center to perform your regular operations, such as responding to on-demand backup requests, restoring backups, creating backup policies, and so on.

## Supported scenarios

* Backup Center is currently supported for Azure VM backup and Azure Database for PostgreSQL Server backup.
* Refer to the [support matrix](backup-center-support-matrix.md) for a detailed list of supported and unsupported scenarios.

## Backup instances

Backup Center allows for easy search and discoverability of backup instances across your backup estate.

Selecting the **Backup Instances** tab in Backup Center lets you view details of all the backup instances that you have access to.

 You can view the following information about each of your backup instances:

* Datasource subscription
* Datasource resource group
* Latest recovery point
* Vault associated with the backup instance
* Protection status

 You can also filter the list of backup instances on the following parameters:

* Datasource subscription
* Datasource resource group
* Datasource location
* Datasource type
* Vault
* Protection status
* Datasource tags

Right-clicking on any of the items in the grid lets you perform actions on the given backup instance, such as navigating to the resource, triggering on-demand backups and restores, or stopping backup.

![Backup Center - Instances](./media/backup-center-monitor-operate/backup-center-instances.png)

## Backup jobs

Backup Center allows you to view detailed information on all jobs that were created in your backup estate and take appropriate action for failing jobs.

Selecting the **Backup jobs** menu item in Backup Center provides a view of all your jobs. Each job contains the following information:

* Backup instance associated with the job
* Datasource subscription
* Datasource resource group
* Datasource location
* Job operation
* Job status
* Job start time
* Job duration

Selecting an item in the grid allows you to view more details about the given job. Right-clicking on an item helps you navigate to the resource to take necessary action.

![Backup Center - Jobs](./media/backup-center-monitor-operate/backup-center-jobs.png)

Using the **Backup jobs** tab, you can view jobs up to the last seven days. To view older jobs, use [Backup Reports](backup-center-obtain-insights.md).

## Vaults

Selecting the **Vaults** menu item in Backup Center allows you to see a list of all [Recovery Services vaults](backup-azure-recovery-services-vault-overview.md) and [Backup vaults](backup-vault-overview.md) that you have access to. You can filter the list with the following parameters:

* Vault subscription
* Vault resource group
* Vault name
* Datasource type associated with the policy

Selecting any item in the list allows you to navigate to a given vault.

![Backup Center - Vaults](./media/backup-center-monitor-operate/backup-center-vaults.png)

## Backup policies

Backup Center allows you to view and edit key information for any of your backup policies.

Selecting the **Backup Policies** menu item allows you to view all the policies that you've created across your backup estate. You can filter the list by vault subscription, resource group, datasource type, and vault. Right-clicking on an item in the grid lets you view associated items for that policy, edit the policy, or even delete it if necessary.

![Backup Center - Policies](./media/backup-center-monitor-operate/backup-center-policies.png)

## Next steps

* [Govern your backup estate](backup-center-govern-environment.md)
* [Perform actions using Backup Center](backup-center-actions.md)
* [Obtain insights on your backups](backup-center-obtain-insights.md)
