---
title: Forward Azure Automation job data to OMS Log Analytics | Microsoft Docs
description: This article demonstrates how to send job status and runbook job streams to Microsoft Operations Management Suite Log Analytics to deliver additional insight and management.
services: automation
documentationcenter: ''
author: MGoedtel
manager: jwhit
editor: tysonn

ms.assetid: c12724c6-01a9-4b55-80ae-d8b7b99bd436
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/03/2017
ms.author: magoedte

---
# Forward job status and job streams from Automation to Log Analytics (OMS)
Automation can send runbook job status and job streams to your Microsoft Operations Management Suite (OMS) Log Analytics workspace.  Job logs and job streams are visible in the Azure portal, or with PowerShell, for individual jobs and this allows you to perform simple investigations. Now with Log Analytics you can:

* Get insight on your Automation jobs
* Trigger an email or alert based on your runbook job status (for example, failed or suspended)
* Write advanced queries across your job streams
* Correlate jobs across Automation accounts
* Visualize your job history over time     

## Prerequisites and deployment considerations
To start sending your Automation logs to Log Analytics, you need:

1. The November 2016 or later release of [Azure PowerShell](/powershell/azure/overview) (v2.3.0).
2. A Log Analytics workspace. For more information, see [Get started with Log Analytics](../log-analytics/log-analytics-get-started.md).
3. The ResourceId for your Azure Automation account

To find the ResourceId for your Azure Automation account and Log Analytics workspace, run the following PowerShell:

```powershell
# Find the ResourceId for the Automation Account
Find-AzureRmResource -ResourceType "Microsoft.Automation/automationAccounts"

# Find the ResourceId for the Log Analytics workspace
Find-AzureRmResource -ResourceType "Microsoft.OperationalInsights/workspaces"
```

If you have multiple Automation accounts, or workspaces, in the output of the preceding commands, find the *Name* you need to configure and copy the value for *ResourceId*.

If you need to find the *Name* of your Automation account, in the Azure portal select your Automation account from the **Automation account** blade and select **All settings**.  From the **All settings** blade, under **Account Settings** select **Properties**.  In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-manage-send-joblogs-log-analytics/automation-account-properties.png).

## Set up integration with Log Analytics
1. On your computer, start **Windows PowerShell** from the **Start** screen.  
2. Copy and paste the following PowerShell, and edit the value for the `$workspaceId` and `$automationAccountId`.  For the `-Environment` parameter, valid values are *AzureCloud* or *AzureUSGovernment* depending on the cloud environment you are working in.     

```powershell
[cmdletBinding()]
	Param
	(
		[Parameter(Mandatory=$True)]
        [ValidateSet("AzureCloud","AzureUSGovernment")]
        [string]$Environment="AzureCloud"
	)

#Check to see which cloud environment to sign into.
Switch ($Environment)
   {
       "AzureCloud" {Login-AzureRmAccount}
       "AzureUSGovernment" {Login-AzureRmAccount -EnvironmentName AzureUSGovernment}
   }

# if you have one Log Analytics workspace you can use the following command to get the resource id of the workspace
$workspaceId = (Get-AzureRmOperationalInsightsWorkspace).ResourceId

$automationAccountId = "/SUBSCRIPTIONS/ec11ca60-1234-491e-5678-0ea07feae25c/RESOURCEGROUPS/DEMO/PROVIDERS/MICROSOFT.AUTOMATION/ACCOUNTS/DEMO"

Set-AzureRmDiagnosticSetting -ResourceId $automationAccountId -WorkspaceId $workspaceId -Enabled $true

```

After running this script, you will see records in Log Analytics within 10 minutes of new JobLogs or JobStreams being written.

To see the logs, run the following query:
`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION"`

### Verify configuration
To confirm that your Automation account is sending logs to your Log Analytics workspace, check that diagnostics are set correctly on the Automation account using the following PowerShell:

```powershell
[cmdletBinding()]
	Param
	(
		[Parameter(Mandatory=$True)]
        [ValidateSet("AzureCloud","AzureUSGovernment")]
        [string]$Environment="AzureCloud"
	)

#Check to see which cloud environment to sign into.
Switch ($Environment)
   {
       "AzureCloud" {Login-AzureRmAccount}
       "AzureUSGovernment" {Login-AzureRmAccount -EnvironmentName AzureUSGovernment}
   }
# if you have one Log Analytics workspace you can use the following command to get the resource id of the workspace
$workspaceId = (Get-AzureRmOperationalInsightsWorkspace).ResourceId

$automationAccountId = "/SUBSCRIPTIONS/ec11ca60-1234-491e-5678-0ea07feae25c/RESOURCEGROUPS/DEMO/PROVIDERS/MICROSOFT.AUTOMATION/ACCOUNTS/DEMO"

Get-AzureRmDiagnosticSetting -ResourceId $automationAccountId
```

In the output ensure that:
+ Under *Logs*, the value for *Enabled* is *True*
+ The value of *WorkspaceId* is set to the ResourceId of your Log Analytics workspace


## Log Analytics records
Diagnostics from Azure Automation creates two types of records in Log Analytics.

### Job Logs
| Property | Description |
| --- | --- |
| TimeGenerated |Date and time when the runbook job executed. |
| RunbookName_s |The name of the runbook. |
| Caller_s |Who initiated the operation.  Possible values are either an email address or system for scheduled jobs. |
| Tenant_g | GUID that identifies the tenant for the Caller. |
| JobId_g |GUID that is the Id of the runbook job. |
| ResultType |The status of the runbook job.  Possible values are:<br>- Started<br>- Stopped<br>- Suspended<br>- Failed<br>- Completed |
| Category | Classification of the type of data.  For Automation, the value is JobLogs. |
| OperationName | Specifies the type of operation performed in Azure.  For Automation, the value is Job. |
| Resource | Name of the Automation account |
| SourceSystem | How Log Analytics collected the data. Always *Azure* for Azure diagnostics. |
| ResultDescription |Describes the runbook job result state.  Possible values are:<br>- Job is started<br>- Job Failed<br>- Job Completed |
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
| Caller_s |Who initiated the operation.  Possible values are either an email address or system for scheduled jobs. |
| StreamType_s |The type of job stream. Possible values are:<br>-Progress<br>- Output<br>- Warning<br>- Error<br>- Debug<br>- Verbose |
| Tenant_g | GUID that identifies the tenant for the Caller. |
| JobId_g |GUID that is the Id of the runbook job. |
| ResultType |The status of the runbook job.  Possible values are:<br>- In Progress |
| Category | Classification of the type of data.  For Automation, the value is JobStreams. |
| OperationName | Specifies the type of operation performed in Azure.  For Automation, the value is Job. |
| Resource | Name of the Automation account |
| SourceSystem | How Log Analytics collected the data. Always *Azure* for Azure diagnostics. |
| ResultDescription |Includes the output stream from the runbook. |
| CorrelationId |GUID that is the Correlation Id of the runbook job. |
| ResourceId |Specifies the Azure Automation account resource id of the runbook. |
| SubscriptionId | The Azure subscription Id (GUID) for the Automation account. |
| ResourceGroup | Name of the resource group for the Automation account. |
| ResourceProvider | MICROSOFT.AUTOMATION |
| ResourceType | AUTOMATIONACCOUNTS |

## Viewing Automation Logs in Log Analytics
Now that you have started sending your Automation job logs to Log Analytics, let’s see what you can do with these logs inside Log Analytics.

To see the logs, run the following query:
`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION"`

### Send an email when a runbook job fails or suspends
One of our top customer asks is for the ability to send an email or a text when something goes wrong with a runbook job.   

To create an alert rule, you start by creating a log search for the runbook job records that should invoke the alert.  Click the **Alert** button to create and configure the alert rule.

1. From the Log Analytics Overview page, click **Log Search**.
2. Create a log search query for your alert by typing the following search into the query field:  `Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=JobLogs (ResultType=Failed OR ResultType=Suspended)`  You can also group by the RunbookName by using: `Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=JobLogs (ResultType=Failed OR ResultType=Suspended) | measure Count() by RunbookName_s`   

   If you have set up logs from more than one Automation account or subscription to your workspace, you can group your alerts by subscription and Automation account.  Automation account name can be derived from the Resource field in the search of JobLogs.  
3. To open the **Add Alert Rule** screen, click **Alert** at the top of the page. For further details on the options to configure the alert, see [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md#alert-rules).

### Find all jobs that have completed with errors
In addition to alerting on failures, you can find when a runbook job has a non-terminating error. In these cases PowerShell produces an error stream, but the non-terminating errors do not cause your job to suspend or fail.    

1. In your Log Analytics workspace, click **Log Search**.
2. In the query field, type `Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=JobStreams StreamType_s=Error | measure count() by JobId_g` and then click **Search**.

### View job streams for a job
When you are debugging a job, you may also want to look into the job streams.  The following query shows all the streams for a single job with GUID 2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0:   

`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=JobStreams JobId_g="2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0" | sort TimeGenerated | select ResultDescription`

### View historical job status
Finally, you may want to visualize your job history over time.  You can use this query to search for the status of your jobs over time.

`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=JobLogs NOT(ResultType="started") | measure Count() by ResultType interval 1hour`  
<br> ![OMS Historical Job Status Chart](media/automation-manage-send-joblogs-log-analytics/historical-job-status-chart.png)<br>

## Summary
By sending your Automation job status and stream data to Log Analytics, you can get better insight into the status of your Automation jobs by:
+ Setting up alerts to notify you when there is an issue
+ Using custom views and search queries to visualize your runbook results, runbook job status, and other related key indicators or metrics.  

Log Analytics provides greater operational visibility to your Automation jobs and can help address incidents quicker.  

## Next steps
* To learn more about how to construct different search queries and review the Automation job logs with Log Analytics, see [Log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md)
* To understand how to create and retrieve output and error messages from runbooks, see [Runbook output and messages](automation-runbook-output-and-messages.md)
* To learn more about runbook execution, how to monitor runbook jobs, and other technical details, see [Track a runbook job](automation-runbook-execution.md)
* To learn more about OMS Log Analytics and data collection sources, see [Collecting Azure storage data in Log Analytics overview](../log-analytics/log-analytics-azure-storage.md)
