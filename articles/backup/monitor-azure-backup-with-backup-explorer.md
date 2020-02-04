---
title: Monitor your backups with Backup Explorer
description: An article describing how to use Backup Explorer to perform real-time monitoring of backups across vaults, subscriptions, regions and tenants
ms.reviewer: dcurwin
ms.topic: conceptual
ms.date: 02/03/2020
---

# Monitor your backups with Backup Explorer

As organizations back up more and more machines to the cloud, it becomes important to have a central location to view operational information about backups across a large estate, to efficiently monitor backups.

The Backup Explorer Workbook is a built-in Azure Monitor Workbook enabling Backup customers to have a single pane of glass for performing operational monitoring activities related to Backup across the entire backup estate on Azure (spanning tenants, locations, subscriptions, resource groups, and vaults), all from a central place. Broadly, it provides the following capabilities:

* **At scale perspective** - An aggregated view of the backup items, jobs, alerts, policies, and resources not configured for backup across the entire backup estate. 
* **Drill down analysis** – You can choose to get detailed information of each of the entities – the jobs, alerts, policies, and backup items, all from a single place.
* **Actionable interfaces** – Once you identify an issue, you can choose to perform actions by navigating seamlessly to the backup item or the Azure resource.

The above capabilities are provided out-of-the-box by native integration with Azure Resource Graph and Azure Monitor Workbooks.

> [!NOTE]
> * The Backup Explorer is currently available only for Azure VM data.
> * The Backup Explorer is meant to be an operational dashboard for viewing information about your backups over the last 7 days (maximum).
> * Currently, customizing of Backup Explorer template is not supported. Also, we currently do not recommend writing custom automations on Azure Resource Graph data.

## Getting started

You can access the Backup Explorer by navigating to any of your Recovery Services Vaults and clicking on the **Backup Explorer** link in the **Overview** page.

![Vault Quick Link](media/backup-azure-monitor-with-backup-explorer/vault-quick-link.png)

Clicking the link opens up the Backup Explorer which provides an aggregated view across all the vaults and subscriptions that you have access to. If you are using an Azure Lighthouse account, you can view data across all the tenants that you have access to (see more in the section below on cross-tenant views).

![Explorer Landing Page](media/backup-azure-monitor-with-backup-explorer/explorer-landing-page.png)

## Backup Explorer Use Cases

The Backup Explorer is composed of multiple tabs, each tab providing detailed information on a specific kind of backup artifact, for example, backup items, jobs, policies, etc. This section provides a brief overview of each of the tabs. The videos provide sample use cases for each of the tabs, along with a description of the various controls available for the user.

### Summary

The Summary tab enables you to have a quick glance at the overall condition of your backup estate. You can view information such as the number of items being protected, number of items for which protection has not been enabled, how many jobs were successful in the last 24 hours, and so on. 

Each of the other tabs represents a distinct entity – for example: Backup Items, Backup Jobs, Backup Alerts and Backup Policies. You can also view information about machines for which Backup has not been configured. Clicking on any of these tabs will show information specific to that entity.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQYd]

### Backup Items

You can view each of your backup items filtered by subscription, vault, and other parameters. Clicking on the name of a backup item lets you open the Azure blade for that backup item. For example, from the table, you might observe that the last backup failed for item ‘X’. Clicking on ‘X’ opens up the Backup blade for this item, where you can trigger an on-demand backup operation.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQYc]

### Jobs

You can view the details of all the jobs that were triggered over the last seven days, by navigating to the Jobs tab. Here, you can filter by Job Operation, Job Status, and Error Code (in the case of failed jobs).

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nOrh]

### Alerts

You can view details of all the alerts that were fired on your vaults over the last seven days, by clicking on the Alerts tab. Here, you can filter records by the type of the alert (for example, Backup Failure, Restore Failure), the current status of the alert (for example, Active or Resolved) and the alert severity (for example, Critical, Warning, Information). You can also navigate to the Azure VM by clicking on the link to the VM and take the necessary action.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nTxe]

### Policies

Clicking on the Policies tab enables you to view key information on all the backup policies that have been created across your backup estate. You can see how many items are associated with each policy, along with the retention range and backup frequency specified by each policy.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nLKV]

### Backup Not Enabled

It is important for the backup admin of an organization to quickly identify which machines in the organization do not have backup enabled yet, so that backup can be enabled for all the machines that need protection. Clicking on the tab **Backup Not Enabled** helps you in this task.

In this tab, you will see a table containing the list of items that are not protected. If your organization follows the practice of assigning different tags to production machines and test machines, or machines serving different functions, each of which might need a separate backup policy, filtering by tags helps you view information specific to a certain class of machines. Clicking on the name of any item redirects you to the **Configure Backup** blade for that item, where you can choose to back up that item with an appropriate backup policy.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQXZ]

## Exporting to Excel

Clicking on the down arrow button at the top right of any widget (table/chart) exports the contents of that widget as an Excel sheet, as-is with existing filters applied. To export more rows of a table to Excel, you can increase the number of rows displayed on the page by using the **Rows Per Page** dropdown at the top of each tab.

## Pinning to Dashboard

You can click the Pin Icon at the top of each widget to pin that widget to your Azure portal dashboard. This helps you create customized dashboards tailored to display the most important information that you need.

## Cross-Tenant Views

If you are an Azure Lighthouse user with delegated access to subscriptions across multiple tenant environments, you can use the default subscription filter (by clicking on the filter icon in the top right of the Azure portal) to select all the subscriptions you wish to see data for. Doing so will enable the Backup Explorer to aggregate information on all vaults across these subscriptions. Learn more about Azure Lighthouse [here](https://docs.microsoft.com/azure/lighthouse/overview).

## Next Steps

[Learn how to use Azure Monitor for getting insights on your backup data](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor)