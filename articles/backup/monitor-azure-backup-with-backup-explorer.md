---
title: Monitor your backups with Backup Explorer
description: This article describes how to use Backup Explorer to perform real-time monitoring of backups across vaults, subscriptions, regions, and tenants.
ms.reviewer: dcurwin
ms.topic: conceptual
ms.date: 02/03/2020
---

# Monitor your backups with Backup Explorer

As organizations back up more and more machines to the cloud, it becomes important to monitor backups efficiently. A good start is to establish a central location for viewing operational information across a large estate.

The Backup Explorer workbook is a built-in Azure Monitor workbook that gives Azure Backup customers such a central location. Backup Explorer provides a single place for performing operational monitoring activities across the entire Backup estate on Azure. It spans tenants, locations, subscriptions, resource groups, and vaults. Broadly, Backup Explorer provides the following capabilities:

* **At-scale perspective**: An aggregated view of the backup items, jobs, alerts, policies, and resources that aren't configured for backup across the entire backup estate. 
* **Drill-down analysis**: You can choose to get detailed information about each of the entities (jobs, alerts, policies, and backup items) all in one place.
* **Actionable interfaces**: After you identify an issue, you can choose to perform certain actions by going seamlessly to the backup item or the Azure resource.

These capabilities are provided out-of-box by native integration with Azure Resource Graph and Azure Monitor workbooks.

> [!NOTE]
> * Backup Explorer is currently available only for Azure virtual machines (VMs) data.
> * Backup Explorer is meant to be an operational dashboard for viewing information about your backups over the most recent 7 days (maximum).
> * Currently, customizing the Backup Explorer template is not supported. Also, we do not recommend writing custom automations on Azure Resource Graph data.

## Get started

You can access Backup Explorer by going to any of your Recovery Services vaults and selecting the **Backup Explorer** link in the **Overview** pane.

![Vault quick link](media/backup-azure-monitor-with-backup-explorer/vault-quick-link.png)

Selecting the link opens Backup Explorer, which provides an aggregated view across all the vaults and subscriptions that you have access to. If you're using an Azure Lighthouse account, you can view data across all the tenants that you have access to. For more information, see the "Cross-tenant views" section at the end of this article.

![Backup Explorer landing page](media/backup-azure-monitor-with-backup-explorer/explorer-landing-page.png)

## Backup Explorer use cases

Backup Explorer is composed of multiple tabs, each tab providing detailed information about a specific kind of backup artifact (for example, backup items, jobs, or policies). This section provides a brief overview of each of the tabs. The videos provide sample use cases for each backup artifact, along with descriptions of the various available controls.

### The Summary tab

The **Summary** tab provides a quick glance at the overall condition of your backup estate. You can view information such as the number of items being protected, the number of items for which protection hasn't been enabled, or how many jobs were successful in the last 24 hours. 

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQYd]

### The Backup Items tab

You can filter and view each of your backup items by subscription, vault, and other characteristics. By selecting the name of a backup item, you can open the Azure pane for that item. For example, from the table, you might observe that the last backup failed for item *X*. Selecting *X* opens up the Backup pane for this item, where you can trigger an on-demand backup operation.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQYc]

### The Jobs tab

By going to the **Jobs** tab, you can view the details of all the jobs that were triggered over the last seven days. Here, you can filter by Job Operation, Job Status, and Error Code (in the case of failed jobs).

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nOrh]

### The Alerts tab

By selecting the **Alerts** tab, you can view details of all alerts that were generated on your vaults over the last seven days. You can filter records by the type of the alert (for example, Backup Failure or Restore Failure), the current status of the alert (for example, Active or Resolved), and the alert severity (for example, Critical, Warning, or Information). You can also select the link to the Azure VM to go to the VM and take the necessary action.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nTxe]

### The Policies tab

By selecting the **Policies** tab, you  can view key information about all the backup policies that have been created across your backup estate. You can see how many items are associated with each policy, along with the retention range and backup frequency that are specified by each policy.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nLKV]

### The Backup Not Enabled tab

It is important for the backup admin of an organization to quickly identify which machines in the organization do not yet have backup enabled, so that it can be enabled for all machines that need protection. To view this information and perform this task, select the **Backup Not Enabled** tab.

The **Backup Not Enabled** pane displays a table with a list of unprotected machines. Your organization might assign different tags to production machines and test machines, or machines serving different functions. Because each class of machines needs a separate backup policy, filtering by tags helps you view information that's specific to each. Selecting the name of any machine redirects you to that machine's **Configure Backup** pane, where you can choose to apply an appropriate backup policy.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4nQXZ]

## Export to Excel

By selecting the down arrow at the top right of any table or chart, you can export its contents as an Excel spreadsheet. The contents are exported as is, with existing filters applied. To export more rows of a table to Excel, you can increase the number of rows displayed on the page by using the **Rows Per Page** drop-down list at the top of each tab.

## Pin to the dashboard

You can select the "pin" icon at the top of each table or chart to pin it to your Azure portal dashboard. Pinning this information helps you create a customized dashboard that's tailored to display the information that's most important to you.

## Cross-tenant views

If you're an Azure Lighthouse user with delegated access to subscriptions across multiple tenant environments, you can use the default subscription filter. By selecting the filter icon at the top right of the Azure portal, you can display all the subscriptions that you want to see data for. By using this feature, you enable Backup Explorer to aggregate information about all vaults across these subscriptions. To learn more, see [What is Azure Lighthouse?](https://docs.microsoft.com/azure/lighthouse/overview).

## Next steps

[Learn how to use Azure Monitor for getting insights on your backup data](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor)