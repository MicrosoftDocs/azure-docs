---
title: Forward Azure Automation job data to Azure Monitor logs
description: This article demonstrates how to send job status and runbook job streams to Azure Monitor logs to deliver additional insight and management.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 02/05/2019
ms.topic: conceptual
manager: carmonm
---

# Forward job status and job streams from Automation to Azure Monitor logs

Automation can send runbook job status and job streams to your Log Analytics workspace. This process does not involve workspace linking and is completely independent. Job logs and job streams are visible in the Azure portal, or with PowerShell, for individual jobs and this allows you to perform simple investigations. Now with Azure Monitor logs you can:

* Get insight on your Automation jobs.
* Trigger an email or alert based on your runbook job status (for example, failed or suspended).
* Write advanced queries across your job streams.
* Correlate jobs across Automation accounts.
* Visualize your job history over time.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites and deployment considerations

To start sending your Automation logs to Azure Monitor logs, you need:

* The latest release of [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/).
* A Log Analytics workspace. For more information, see [Get started with Azure Monitor logs](../log-analytics/log-analytics-get-started.md). 
* The ResourceId for your Azure Automation account.

To find the ResourceId for your Azure Automation account:

```powershell-interactive
# Find the ResourceId for the Automation Account
Get-AzResource -ResourceType "Microsoft.Automation/automationAccounts"
```

To find the ResourceId for your Log Analytics workspace, run the following PowerShell:

```powershell-interactive
# Find the ResourceId for the Log Analytics workspace
Get-AzResource -ResourceType "Microsoft.OperationalInsights/workspaces"
```

If you have more than one Automation accounts, or workspaces, in the output of the preceding commands, find the *Name* you need to configure and copy the value for *ResourceId*.

If you need to find the *Name* of your Automation account, in the Azure portal select your Automation account from the **Automation account** blade and select **All settings**. From the **All settings** blade, under **Account Settings** select **Properties**.  In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-manage-send-joblogs-log-analytics/automation-account-properties.png).

## Set up integration with Azure Monitor logs

1. On your computer, start **Windows PowerShell** from the **Start** screen.
2. Run the following PowerShell, and edit the value for the `[your resource id]` and `[resource id of the log analytics workspace]` with the values from the preceding step.

   ```powershell-interactive
   $workspaceId = "[resource id of the log analytics workspace]"
   $automationAccountId = "[resource id of your automation account]"

   Set-AzDiagnosticSetting -ResourceId $automationAccountId -WorkspaceId $workspaceId -Enabled 1
   ```

After running this script, it may take an hour before you start to see records in Azure Monitor logs of new JobLogs or JobStreams being written.

To see the logs, run the following query in log analytics log search:
`AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION"`

### Verify configuration

To confirm that your Automation account is sending logs to your Log Analytics workspace, check that diagnostics are correctly configured on the Automation account by using the following PowerShell:

```powershell-interactive
Get-AzDiagnosticSetting -ResourceId $automationAccountId
```

In the output ensure that:

* Under *Logs*, the value for *Enabled* is *True*.
* The value of *WorkspaceId* is set to the ResourceId of your Log Analytics workspace.

## Azure Monitor log records

Diagnostics from Azure Automation creates two types of records in Azure Monitor logs and are tagged as **AzureDiagnostics**. The following queries use the upgraded query language to Azure Monitor logs. For information on common queries between legacy query language and the new Azure Kusto query language visit [Legacy to new Azure Kusto Query Language cheat sheet](https://docs.loganalytics.io/docs/Learn/References/Legacy-to-new-to-Azure-Log-Analytics-Language)

### Job Logs

| Property | Description |
| --- | --- |
| TimeGenerated |Date and time when the runbook job executed. |
| RunbookName_s |The name of the runbook. |
| Caller_s |Who initiated the operation. Possible values are either an email address or system for scheduled jobs. |
| Tenant_g | GUID that identifies the tenant for the Caller. |
| JobId_g |GUID that is the Id of the runbook job. |
| ResultType |The status of the runbook job. Possible values are:<br>- New<br>- Created<br>- Started<br>- Stopped<br>- Suspended<br>- Failed<br>- Completed |
| Category | Classification of the type of data. For Automation, the value is JobLogs. |
| OperationName | Specifies the type of operation performed in Azure. For Automation, the value is Job. |
| Resource | Name of the Automation account |
| SourceSystem | How Azure Monitor logs collected the data. Always *Azure* for Azure diagnostics. |
| ResultDescription |Describes the runbook job result state. Possible values are:<br>- Job is started<br>- Job Failed<br>- Job Completed |
| CorrelationId |GUID that is the Correlation Id of the runbook job. |
| ResourceId |Specifies the Azure Automation account resource id of the runbook. |
| SubscriptionId | The Azure subscription Id (GUID) for the Automation account. |
| ResourceGroup | Name of the resource group for the Automation account. |
| ResourceProvider | MICROSOFT.AUTOMATION |
| ResourceType | AUTOMATIONACCOUNTS |


### Job Streams
| Property | Description |
| --- | --- |
| TimeGenerated |Date and time when the runbook job executed. |
| RunbookName_s |The name of the runbook. |
| Caller_s |Who initiated the operation. Possible values are either an email address or system for scheduled jobs. |
| StreamType_s |The type of job stream. Possible values are:<br>-Progress<br>- Output<br>- Warning<br>- Error<br>- Debug<br>- Verbose |
| Tenant_g | GUID that identifies the tenant for the Caller. |
| JobId_g |GUID that is the Id of the runbook job. |
| ResultType |The status of the runbook job. Possible values are:<br>- In Progress |
| Category | Classification of the type of data. For Automation, the value is JobStreams. |
| OperationName | Specifies the type of operation performed in Azure. For Automation, the value is Job. |
| Resource | Name of the Automation account |
| SourceSystem | How Azure Monitor logs collected the data. Always *Azure* for Azure diagnostics. |
| ResultDescription |Includes the output stream from the runbook. |
| CorrelationId |GUID that is the Correlation Id of the runbook job. |
| ResourceId |Specifies the Azure Automation account resource id of the runbook. |
| SubscriptionId | The Azure subscription Id (GUID) for the Automation account. |
| ResourceGroup | Name of the resource group for the Automation account. |
| ResourceProvider | MICROSOFT.AUTOMATION |
| ResourceType | AUTOMATIONACCOUNTS |

## Viewing Automation Logs in Azure Monitor logs

Now that you started sending your Automation job logs to Azure Monitor logs, let’s see what you can do with these logs inside Azure Monitor logs.

To see the logs, run the following query:
`AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION"`

### Send an email when a runbook job fails or suspends
One of the top customer asks is for the ability to send an email or a text when something goes wrong with a runbook job.   

To create an alert rule, you start by creating a log search for the runbook job records that should invoke the alert. Click the **Alert** button to create and configure the alert rule.

1. From the Log Analytics workspace Overview page, click **View logs**.
2. Create a log search query for your alert by typing the following search into the query field: `AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION" and Category == "JobLogs" and (ResultType == "Failed" or ResultType == "Suspended")`  You can also group by the RunbookName by using: `AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION" and Category == "JobLogs" and (ResultType == "Failed" or ResultType == "Suspended") | summarize AggregatedValue = count() by RunbookName_s`

   If you set up logs from more than one Automation account or subscription to your workspace, you can group your alerts by subscription and Automation account. Automation account name can be found in the Resource field in the search of JobLogs.
3. To open the **Create rule** screen, click **+ New Alert Rule** at the top of the page. For more information on the options to configure the alert, see [Log alerts in Azure](../azure-monitor/platform/alerts-unified-log.md).

### Find all jobs that have completed with errors
In addition to alerting on failures, you can find when a runbook job has a non-terminating error. In these cases PowerShell produces an error stream, but the non-terminating errors don't cause your job to suspend or fail.    

1. In your Log Analytics workspace, click **Logs**.
2. In the query field, type `AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION" and Category == "JobStreams" and StreamType_s == "Error" | summarize AggregatedValue = count() by JobId_g` and then click the **Search** button.

### View job streams for a job
When you're debugging a job, you may also want to look into the job streams. The following query shows all the streams for a single job with GUID 2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0:   

`AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION" and Category == "JobStreams" and JobId_g == "2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0" | sort by TimeGenerated asc | project ResultDescription`

### View historical job status
Finally, you may want to visualize your job history over time. You can use this query to search for the status of your jobs over time.

`AzureDiagnostics | where ResourceProvider == "MICROSOFT.AUTOMATION" and Category == "JobLogs" and ResultType != "started" | summarize AggregatedValue = count() by ResultType, bin(TimeGenerated, 1h)`  
<br> ![Log Analytics Historical Job Status Chart](media/automation-manage-send-joblogs-log-analytics/historical-job-status-chart.png)<br>

## Remove diagnostic settings

To remove the diagnostic setting from the Automation Account, run the following commands:

```powershell-interactive
$automationAccountId = "[resource id of your automation account]"

Remove-AzDiagnosticSetting -ResourceId $automationAccountId
```

## Summary

By sending your Automation job status and stream data to Azure Monitor logs, you can get better insight into the status of your Automation jobs by:
+ Setting up alerts to notify you when there is an issue.
+ Using custom views and search queries to visualize your runbook results, runbook job status, and other related key indicators or metrics.  

Azure Monitor logs provides greater operational visibility to your Automation jobs and can help address incidents quicker.  

## Next steps
* To learn more about how to construct different search queries and review the Automation job logs with Azure Monitor logs, see [Log searches in Azure Monitor logs](../log-analytics/log-analytics-log-searches.md).
* To understand how to create and retrieve output and error messages from runbooks, see [Runbook output and messages](automation-runbook-output-and-messages.md).
* To learn more about runbook execution, how to monitor runbook jobs, and other technical details, see [Track a runbook job](automation-runbook-execution.md).
* To learn more about Azure Monitor logs and data collection sources, see [Collecting Azure storage data in Azure Monitor logs overview](../azure-monitor/platform/collect-azure-metrics-logs.md).

