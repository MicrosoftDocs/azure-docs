---
title: Govern your backup estate using Backup Center
description: Learn how to govern your Azure environment to ensure that all your resources are compliant from a backup perspective with Backup Center.
ms.topic: conceptual
ms.date: 09/01/2020
---

# Govern your backup estate using Backup Center

Backup Center helps you govern your Azure environment to ensure that all your resources are compliant from a backup perspective. Below are some of the governance capabilities of Backup Center:

* View and assign Azure Policies for backup

* View all datasources that haven't been configured for backup.

## Supported scenarios

* Refer to the [support matrix](backup-center-support-matrix.md) for a detailed list of supported and unsupported scenarios.

## Azure Policies for backup

To view all the [Azure Policies](https://docs.microsoft.com/azure/governance/policy/overview) that are available for backup, select the **Azure Policies for Backup** menu item. This will display all the built-in and custom [Azure policy definitions for backup](policy-reference.md) that are available for assignment to your subscriptions and resource groups.

Selecting any of the definitions allows you to [assign the policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage#assign-a-policy) to a scope.

![Select Azure Policy definitions](./media/backup-center-govern-environment/azure-policy-definitions.png)

## Protectable datasources

Selecting the **Protectable Datasources** menu item allows you to view all your datasources that haven't been configured for backup. You can filter the list by datasource subscription, resource group, location, type and tags. Once you've identified a datasource that needs to be backed up, you can right-click on the corresponding grid item and select **Backup** to configure backup for the resource.

![Protectable datasources menu](./media/backup-center-govern-environment/protectable-datasources.png)

## Next steps

* [Monitor and Operate backups](backup-center-monitor-operate.md)
* [Perform actions using Backup Center](backup-center-actions.md)
* [Obtain insights on your backups](backup-center-obtain-insights.md)
