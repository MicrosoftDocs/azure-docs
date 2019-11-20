---
title: Using diagnostics settings for Recovery Services Vaults
description: 'An article describing how to use the old and new diagnostics events for Azure Backup'
ms.topic: conceptual
ms.date: 10/30/2019
---

# Using Diagnostics Settings for Recovery Services Vaults

Azure Backup sends diagnostics events that can be collected and used for the purposes of analysis, alerting and reporting. 

You can configure diagnostics settings for a Recovery Services Vault via the Azure portal, by navigating to the vault and clicking the **Diagnostic Settings** menu item. Clicking on **+ Add Diagnostic Setting** lets you send one or more diagnostics events to a Storage Account, Event Hub, or a Log Analytics (LA) Workspace.

![Diagnostics Settings Blade](./media/backup-azure-diagnostics-events/diagnostics-settings-blade.png)

## Diagnostics Events Available for Azure Backup Users

Azure Backup provides the following diagnostic events, each of which provides detailed data on a specific set of backup-related artifacts:
* CoreAzureBackup
* AddonAzureBackupAlerts
* AddonAzureBackupProtectedInstance
* AddonAzureBackupJobs
* AddonAzureBackupPolicy
* AddonAzureBackupStorage 

[Data Model for Azure Backup Diagnostics Events](https://aka.ms/diagnosticsdatamodel)

Data for these events can be sent to either a storage account, LA workspace, or an Event Hub. If you are sending this data to an LA Workspace, you need to select the **Resource Specific** toggle in the **Diagnostics Setting** screen (see more information in the sections below).

## Using Diagnostics Settings with Log Analytics (LA)

Aligning with the Azure Log Analytics roadmap, Azure Backup now allows you to send vault diagnostics data to dedicated LA tables for Backup. These are referred to as [Resource Specific tables](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-workspace#resource-specific).

To send your vault diagnostics data to LA:
1.	Navigate to your vault and click on **Diagnostic Settings**. Click **+ Add Diagnostic Setting**.
2.	Give a name to the Diagnostics setting.
3.	Check the box **Send to Log Analytics** and select a Log Analytics Workspace.
4.	Select **Resource Specific** in the toggle and check the following six events - **CoreAzureBackup**, **AddonAzureBackupAlerts**, **AddonAzureBackupProtectedInstance**, **AddonAzureBackupJobs**, **AddonAzureBackupPolicy**, and **AddonAzureBackupStorage**.
5.	Click on **Save**.

![Resource Specific mode](./media/backup-azure-diagnostics-events/resource-specific-blade.png)

Once data flows into the LA Workspace, dedicated tables for each of these events are created in your workspace. You can query any of these tables directly and also perform joins or unions between these tables if necessary.

> [!IMPORTANT]
> The above six events, namely, CoreAzureBackup, AddonAzureBackupAlerts, AddonAzureBackupProtectedInstance, AddonAzureBackupJobs, AddonAzureBackupPolicy, and AddonAzureBackupStorage, are supported **only** in Resource Specific Mode. **Please note that if you try to send data for these six events in Azure Diagnostics Mode, no data will flow to the LA Workspace.**

## Legacy Event

Traditionally, all backup-related diagnostics data for a vault has been contained in a single event called ‘AzureBackupReport’. The six events described above are, in essence, a decomposition of all the data contained in AzureBackupReport. 

Currently, we continue to support the AzureBackupReport event for backward-compatibility, in cases where users have existing custom queries on this event, for example, custom log alerts, custom visualizations etc. However, we recommend choosing the new events for all new diagnostics settings on the vault since this makes the data much easier to work with in log queries, provides better discoverability of schemas and their structure, improves performance across both ingestion latency and query times. Support for using the Azure Diagnostics mode will eventually be phased out and hence choosing the new events may help you to avoid complex migrations at a later date.

You may choose to create separate diagnostics settings for AzureBackupReport and the six new events, until you have migrated all of your custom queries to use data from the new tables. The below image shows an example of a vault having two diagnostic settings. The first setting, named **Setting1** sends data of AzureBackupReport event to an LA Workspace in AzureDiagnostics mode. The second setting, named **Setting2** sends data of the six new Azure Backup events to an LA Workspace in Resource Specific mode.

![Two Settings](./media/backup-azure-diagnostics-events/two-settings-example.png)

> [!IMPORTANT]
> The AzureBackupReport event is supported **only** in Azure Diagnostics Mode. **Please note that if you try to send data for this event in Resource Specific Mode, no data will flow to the LA Workspace.**

> [!NOTE]
> The toggle for Azure Diagnostics / Resource Specific appears only if the user checks **Send to Log Analytics**. To send data to a Storage Account or an Event Hub, a user can simply select the required destination and check any of the desired events, without any additional inputs. Again, it is recommended not to choose the legacy event AzureBackupReport, going forward.

## Users sending Azure Site Recovery Events to Log Analytics (LA)

Azure Backup and Azure Site Recovery Events are sent from the same Recovery Services Vault. As Azure Site Recovery is currently not onboarded onto Resource Specific tables, users wanting to send Azure Site Recovery Events to LA are directed to use Azure Diagnostics Mode **only** (see image below). **Choosing Resource Specific Mode for the Azure Site Recovery Events will prevent the required data from being sent to the LA Workspace**.

![Site Recovery Events](./media/backup-azure-diagnostics-events/site-recovery-settings.png)

To summarize the above nuances:

* If you already have LA diagnostics set up with Azure Diagnostics and have written custom queries on top of it, keep that setting **intact**, until you migrate your queries to use data from the new events.
* If you also want to onboard onto new tables (as recommended), create a **new** diagnostics setting, choose **Resource Specific** and select the six new events as specified above.
* If you are currently sending Azure Site Recovery Events to LA, **do not** choose Resource Specific mode for these events, otherwise data for these events will not flow into your LA Workspace. Instead, create an **additional diagnostic setting**, select **Azure Diagnostics**, and choose the relevant Azure Site Recovery events.

The below image shows an example of a user having three diagnostic settings for a vault. The first setting, named **Setting1** sends data from AzureBackupReport event to an LA Workspace in AzureDiagnostics mode. The second setting, named **Setting2** sends data from the six new Azure Backup events to an LA Workspace in Resource Specific mode. The third setting, named **Setting3**, sends data from the Azure Site Recovery events to an LA Workspace in Azure Diagnostics Mode.

![Three Settings](./media/backup-azure-diagnostics-events/three-settings-example.png)

## Next steps

[Learn the Log Analytics Data Model for the Diagnostics Events](https://aka.ms/diagnosticsdatamodel)
