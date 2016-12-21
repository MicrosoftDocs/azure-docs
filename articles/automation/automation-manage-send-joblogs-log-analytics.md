---
title: Forward job status and job streams from Automation to Log Analytics (OMS) | Microsoft Docs
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
ms.date: 12/21/2016
ms.author: magoedte

---
# Forward job status and job streams from Automation to Log Analytics (OMS)
Automation can send runbook job status and job streams to your Microsoft Operations Management Suite (OMS) Log Analytics workspace.  While you can view this information in the Azure portal or with PowerShell by individual job status or all jobs for a particular Automation account, anything advanced to support your operational requirements requires you to create custom PowerShell scripts.  Now with Log Analytics you can:

* Get insight on your Automation jobs
* Trigger an email or alert based on your runbook job status (e.g. failed or suspended)
* Write advanced queries across your job streams
* Correlate jobs across Automation accounts
* Visualize your job history over time     

## Prerequisites and deployment considerations
To start sending your Automation logs to Log Analytics, you must have the following:

1. An OMS subscription. For more information, see [Get started with Log Analytics](../log-analytics/log-analytics-get-started.md). 2. The November 2016 or later release of Azure PowerShell (v2.3.0)

To find the values for *AutomationAccountName*, in the Azure portal select your Automation account from the **Automation account** blade and select **All settings**.  From the **All settings** blade, under **Account Settings** select **Properties**.  In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-manage-send-joblogs-log-analytics/automation-account-properties.png).

## Set up integration with Log Analytics
1. On your computer, start **Windows PowerShell** from the **Start** screen.  
2. Copy and the following PowerShell, edit the value for the `$workspaceId` and `$automationAccountId` then run it.

```powershell
# if you are not connected to Azure run the next command to login
Login-AzureRmAccount

# if you have one Log Analytics workspace you can use the following command to get the resource id of the workspace
$workspaceId = (Get-AzureRmOperationalInsightsWorkspace).ResourceId

$automationAccountId = "/SUBSCRIPTIONS/ec11ca60-1234-491e-5678-0ea07feae25c/RESOURCEGROUPS/DEMO/PROVIDERS/MICROSOFT.AUTOMATION/ACCOUNTS/DEMO" 

Set-AzureRmDiagnosticSetting -ResourceId $automationAccountId  -WorkspaceId $workspaceId -Enabled $true

```

After running this script, you should see records in Log Analytics about 10 minutes after new diagnostic data is logged.

To see the logs, run the following query:
`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION"`

### Verify configuration
To confirm that your Automation account is sending logs to your Log Analytics workspace, perform the following steps in PowerShell.  

```powershell
# if you are not connected to Azure run the next command to login
Login-AzureRmAccount

# if you have one Log Analytics workspace you can use the following command to get the resource id of the workspace
$workspaceId = (Get-AzureRmOperationalInsightsWorkspace).ResourceId

$automationAccountId = "/SUBSCRIPTIONS/ec11ca60-1234-491e-5678-0ea07feae25c/RESOURCEGROUPS/DEMO/PROVIDERS/MICROSOFT.AUTOMATION/ACCOUNTS/DEMO" 

Get-AzureRmDiagnosticSetting -ResourceId $automationAccountId

```

## Log Analytics records
Automation creates two types of records in the OMS repository. 

### Job Logs
| Property | Description |
| --- | --- |
| Time |Date and time when the runbook job executed. |
| resourceId |Specifies the resource type in Azure.  For Automation, the value is the Automation account associated with the runbook. |
| operationName |Specifies the type of operation performed in Azure.  For Automation, the value is Job. |
| resultType |The status of the runbook job.  Possible values are:<br>- Started<br>- Stopped<br>- Suspended<br>- Failed<br>- Succeeded |
| resultDescription |Describes the runbook job result state.  Possible values are:<br>- Job is started<br>- Job Failed<br>- Job Completed |
| CorrelationId |GUID that is the Correlation Id of the runbook job. |
| Category |Classification of the type of data.  For Automation, the value is JobLogs. |
| RunbookName |The name of the runbook. |
| JobId |GUID that is the Id of the runbook job. |
| Caller |Who initiated the operation.  Possible values are either an email address or system for scheduled jobs. |

### Job Streams
| Property | Description |
| --- | --- |
| Time |Date and time when the runbook job executed. |
| resourceId |Specifies the resource type in Azure.  For Automation, the value is the Automation account associated with the runbook. |
| operationName |Specifies the type of operation performed in Azure.  For Automation, the value is Job. |
| resultType |The status of the runbook job.  Possible values are:<br>- InProgress |
| resultDescription |Includes the output stream from the runbook. |
| CorrelationId |GUID that is the Correlation Id of the runbook job. |
| Category |Classification of the type of data.  For Automation, the value is JobStreams. |
| RunbookName |The name of the runbook. |
| JobId |GUID that is the Id of the runbook job. |
| Caller |Who initiated the operation.  Possible values are either an email address or system for scheduled jobs. |
| StreamType |The type of job stream. Possible values are:<br>-Progress<br>- Output<br>- Warning<br>- Error<br>- Debug<br>- Verbose |

## Viewing Automation Logs in Log Analytics
Now that you have started sending your Automation job logs to Log Analytics, let’s see what you can do with these logs inside OMS.

To see the logs, run the following query:
`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION"`

### Send an email when a runbook job fails or suspends
One of our top customer asks is for the ability to send an email or a text when something goes wrong with a runbook job.   

To create an alert rule, you start by creating a log search for the runbook job records that should invoke the alert.  The **Alert** button will then be available so you can create and configure the alert rule.

1. From the OMS Overview page, click **Log Search**.
2. Create a log search query for your alert by typing in the following in the query field:  `Category=JobLogs (ResultType=Failed || ResultType=Suspended)`.  You can also group by the RunbookName by using: `Category=JobLogs (ResultType=Failed || ResultType=Suspended) | measure Count() by RunbookName_s`.   

   If you have set up logs from more than one Automation account or subscription to your workspace, you may also be interested in grouping your alerts by the subscription or Automation account.  Automation account name can be derived from the Resource field in the search of JobLogs.  
3. Click **Alert** at the top of the page to open the **Add Alert Rule** screen.  For further details on the options to configure the alert, please see [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md#creating-an-alert-rule).

### Find all jobs that have completed with errors
In addition to alerting based off of failures, you probably would like to know when a runbook job has had a non-terminating error (PowerShell produces an error stream, but non-terminating errors do not cause your job to suspend or fail).    

1. In the OMS portal, click **Log Search**.
2. In the query field, type `Category=JobStreams StreamType_s=Error | measure count() by JobId_g` and then click **Search**.

### View job streams for a job
When you are debugging a job, you may also want to look into the job streams.  The query below shows all the streams for a single job with GUID  2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0:   

`Category=JobStreams JobId_g="2ebd22ea-e05e-4eb9-9d76-d73cbd4356e0" | sort TimeGenerated | select ResultDescription`

### View historical job status
Finally, you may want to visualize your job history over time.  You can use this query to search for the status of your jobs over time.

`Category=JobLogs NOT(ResultType="started") | measure Count() by ResultType interval 1day`  
<br> ![OMS Historical Job Status Chart](media/automation-manage-send-joblogs-log-analytics/historical-job-status-chart.png)<br>

## Summary
By sending your Automation job status and stream data to Log Analytics, you can get better insight into the status of your Automation jobs by setting up alerts to notify you when there is an issue, and custom dashboards using advanced queries to visualize your runbook results, runbook job status, and other related key indicators or metrics.  This will help provide greater operational visibility and address incidents quicker.  

## Next steps
* To learn more about how to construct different search queries and review the Automation job logs with Log Analytics, see [Log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md)
* To understand how to create and retrieve output and error messages from runbooks, see [Runbook output and messages](automation-runbook-output-and-messages.md)
* To learn more about runbook execution, how to monitor runbook jobs, and other technical details, see [Track a runbook job](automation-runbook-execution.md)
* To learn more about OMS Log Analytics and data collection sources, see [Collecting Azure storage data in Log Analytics overview](../log-analytics/log-analytics-azure-storage.md)
