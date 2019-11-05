---
title: Using Diagnostics Settings for Recovery Services Vaults
description: 'An article describing how to use the old and new diagnostics events for Azure Backup'
ms.reviewer: dcurwin
author: adbalaji
manager: sivan
ms.service: backup
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: adbalaji
---

# Using Diagnostics Settings for Recovery Services Vaults

Azure Backup sends diagnostics events that can be collected and used for the purposes of analysis, alerting and reporting. You can configure diagnostics settings for a Recovery Services Vault via the Azure Portal, by navigating to the vault and clicking the **Diagnostic Settings** menu item. Clicking on **+ Add Diagnostic Setting** lets you send one or more diagnostics events to a Storage Account, Event Hub, or a Log Analytics (LA) Workspace.

![Diagnostics Settings Blade](./media/backup-azure-diagnostics-events/diagnostics_settings_blade.PNG)

## Diagnostics Events Available for Azure Backup Users
1)	**AzureBackupReport** – Traditionally, all backup-related diagnostics data for a vault has been contained in a single event called ‘AzureBackupReport’. 

Data for this event can be sent to a storage account, which you can use in conjunction with Power BI Reports ([click here](https://docs.microsoft.com/azure/backup/backup-azure-reports-data-model) to learn the Power BI data model for AzureBackupReport) or any custom solution which uses data from the storage account. It can also be sent to an LA Workspace ([click here](https://docs.microsoft.com/azure/backup/backup-azure-log-analytics-data-model) to learn the Log Analytics data model for AzureBackupReport). It can also be sent to an Event Hub.

2)	**New Events** – Today, Azure Backup supports six new events, which are, in essence, a decomposition of all the data contained in AzureBackupReport.  These new events are - CoreAzureBackup, AddonAzureBackupAlerts, AddonAzureBackupProtectedInstance, AddonAzureBackupJobs, AddonAzureBackupPolicy, and AddonAzureBackupStorage (click here to learn the data model for the new events). Data for these new events can also be sent to either a storage account, LA workspace, or an Event Hub. If you are sending this data to an LA Workspace, you need to select the ‘Resource Specific’ toggle in the Diagnostics Setting screen (see more information in the below sections).

We **recommend choosing the new events** for all new diagnostics settings on the vault since this makes the data much easier to work with in log queries, provides better discoverability of schemas and their structure, improves performance across both ingestion latency and query times. Support for using the Azure Diagnostics mode will eventually be phased out and hence choosing the new events may help you to avoid complex migrations at a later date.

## Using Diagnostics Settings with Log Analytics (LA)

As mentioned in the previous section, Azure Backup allows you to send backup reporting data to an LA Workspace in one of two ways:

1.	**Azure Diagnostics Mode** – This is the traditional mode in which data is sent to LA. All data from any diagnostics setting (including diagnostics information of other resources) is sent to the same table – AzureDiagnostics. Since multiple resource types send data to the same table, its schema is the superset of the schemas of all the different data types being collected.

The AzureBackupReport event is supported **only** in Azure Diagnostics Mode. **Please note that if you try to send AzureBackupReport event data in Resource Specific Mode, no data will flow to the LA Workspace.**

Learn more about Azure Diagnostics mode [here](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-workspace#azure-diagnostics-mode).

2.	**Resource Specific Mode** – Aligning with the Azure Log Analytics roadmap, Azure Backup now allows you to send vault diagnostics data to dedicated LA tables for Backup. These are referred to as Resource Specific tables.

The six new events, namely, CoreAzureBackup, AddonAzureBackupAlerts, AddonAzureBackupProtectedInstance, AddonAzureBackupJobs, AddonAzureBackupPolicy, and AddonAzureBackupStorage, are supported **only** in Resource Specific Mode. **Please note that if you try to send data for these 6 events in Azure Diagnostics Mode, no data will flow to the LA Workspace.**

Learn more about Resource Specific Mode [here](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-workspace#resource-specific)

## How to send Backup Reporting Data to Log Analytics in Azure Diagnostics Mode (old)

1.	Navigate to your vault and click on **Diagnostic Settings** in the menu. Click **+ Add Diagnostic Setting**.
2.	Give a name to the Diagnostics setting.
3.	Check the box **Send to Log Analytics** and select a Log Analytics Workspace.
4.	Select **Azure Diagnostics** in the toggle and check the **AzureBackupReport** event.
5.	Click on **Save**.

![Azure Diagnostics mode](./media/backup-azure-diagnostics-events/azure_diagnostics.PNG)

Once data flows into the LA Workspace, you can write queries on the AzureBackupReport event, using the AzureDiagnostics table in your workspace. [Click here](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor#sample-kusto-queries) to learn how to write queries on AzureDiagnostics.

## How to send Backup Reporting Data to Log Analytics in Resource Specific Mode (new)

1.	Navigate to your vault and click on **Diagnostic Settings**. Click **+ Add Diagnostic Setting**.
2.	Give a name to the Diagnostics setting.
3.	Check the box **Send to Log Analytics** and select a Log Analytics Workspace.
4.	Select **Resource Specific** in the toggle and check the following six events - **CoreAzureBackup**, **AddonAzureBackupAlerts**, **AddonAzureBackupProtectedInstance**, **AddonAzureBackupJobs**, **AddonAzureBackupPolicy**, and **AddonAzureBackupStorage**.
5.	Click on **Save**.

![Resource Specific mode](./media/backup-azure-diagnostics-events/resource_specific.PNG)

Once data flows into the LA Workspace, dedicated tables for each of these events are created in your workspace. You can query any of these tables directly and also perform joins or unions between these tables if necessary.

## Important Points

**Read the following sections carefully** to prevent any potential data loss due to mistakes in configuring diagnostic settings.

### For users using Azure Site Recovery Events

Azure Backup and Azure Site Recovery Events are sent from the same Recovery Services Vault. As Azure Site Recovery is currently not onboarded onto Resource Specific tables, users wanting to send Azure Site Recovery Events to LA are directed to use Azure Diagnostic Mode **only** (see image below). **Choosing Resource Specific Mode for the Azure Site Recovery Events will prevent the required data from being sent to the LA Workspace**.

![Site Recovery Events](./media/backup-azure-diagnostics-events/site_recovery.PNG)

### For Backup users having existing custom queries written on AzureDiagnostics table

For users who have written custom queries on the Azure Diagnostics table, such as custom log alerts on your backup data, or custom visualizations using View Designer or Workbooks, you will have to rewrite these queries for Resource Specific tables if you choose to switch to Resource Specific mode. If you wish to preserve these queries as-is, you will need to have two diagnostic settings for your vaults – **one in Azure Diagnostics Mode and the other in Resource Specific Mode**.

To summarize the above nuances:

* If you already have LA diagnostics set up with Azure Diagnostics and have written custom queries on top of it, keep that setting **intact**.
* If you also want to onboard onto new tables (as recommended), create a **new** diagnostics setting, choose Resource Specific and select the six new events as specified above.
* If you are currently sending Azure Site Recovery Events to LA, **do not** choose Resource Specific mode for these events, otherwise data for these events will not flow into your LA Workspace. Instead, create an **additional diagnostic setting**, select Azure Diagnostics, and choose the relevant Azure Site Recovery events.

## Next steps

[Learn the Log Analytics Data Model for Resource Specific Events](backup-azure-log-analytics-new-data-model)



