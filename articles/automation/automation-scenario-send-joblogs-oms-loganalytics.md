<properties
    pageTitle="Send your job status and job streams from Automation to Log Analytics (OMS) | Microsoft Azure"
    description="This article demonstrates how to send job status and runbook job streams to Microsoft Operations Management Suite Log Analytics to deliver additional insight and management."
    services="automation"
    documentationCenter=""
    authors="MGoedtel"
    manager="jwhit"
    editor="tysonn" />
<tags
    ms.service="automation"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="infrastructure-services"
    ms.date="07/18/2016"
    ms.author="magoedte" />

# Azure Automation scenario - Forward job status and job streams from Automation to Log Analytics (OMS)

Automation is now able to support sending runbook job status and job streams to your Microsoft Operations Management Suite (OMS) Log Analytics workspace.  While you can view this information in the Azure portal or with PowerShell by individual job status or all jobs for a particular Automation account, anything advanced to support your operational requirements requires you to create custom PowerShell scripts.  Now with Log Anaytics you can:

- Get insight on your Automation jobs 
- Trigger an email or alert based on your runbook job status (e.g. failed or suspended) 
- Write advanced queries across your job streams 
- Correlate jobs across Automation accounts 
- Visualize your job history over time     

## Prerequisites and deployment considerations

To start sending your Automation logs to Log Analytics, you must have the following:

1. A paid Microsoft Azure subscription to fully use Log Analytics. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) that lets you access any Azure service. Or, you can create a free OMS account at the [Operations Management Suite](http://microsoft.com/oms) website and click **Try for free**.
2. An OMS workspace which is used to store the logs being sent to Log Analytics. 
3. An [Azure Storage account](../storage/storage-create-storage-account.md).  Please note this Storage account must be in the same region as the Automation account.  
4. Azure PowerShell 1.0. For information about this release and how to install it, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).
5. Azure Diagnostic and Log Analytics PowerShell.  For further information about this release and how to install it, see [Azure Diagnostic and Log Analytics](https://www.powershellgallery.com/packages/AzureDiagnosticsAndLogAnalytics/0.1).  
6. Download the PowerShell script **Enable-AzureDiagnostics.ps1** from the PowerShell Gallery <URL to Gallery Item>.  


The script requires the following parameters during execution:

- *AutomationResourceGroup* - the Resource Group your Automation account is located in
- *AutomationAccountName* - the name of your Automation account
- *LogAnalyticsWorkspaceName* - the name of your OMS workspace
- *StorageAccountName* - the name of the storage account that you want to store your Automation logs in
- *StorageResourceGroup* - the name of the Resource Group the storage account is located in


To get the values for *AutomationResourceGroup* and *AutomationAccountName*, in the Azure portal select your Automation account from the **Automation account** blade and select **All settings**.  From the **All settings** blade, under **Account Settings** select **Properties**.  In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-scenario-send-joblogs-oms-loganalytics/automation-account-properties.png).

To get the value for *StorageAccountName* and *StorageResourceGroup*, in the Azure portal navigate to the storage account and on the **Storage accounts** blade note for a standard storage account, the name and resource group it is defined in.<br> ![Azure Storage Accounts](media/automation-scenario-send-joblogs-oms-loganalytics/azure-storage-accounts.png)<br>

>[AZURE.NOTE] Reminder, this Storage account must be in the same region as the Automation account.  


## Setup integration with Log Analytics

1. On your computer, start **Windows PowerShell** from the **Start** screen with elevated user rights.  
2. From the elevated PowerShell command-line shell, navigate to the folder which contains the script you downloaded and execute it changing the values for parameters *–AutomationResourceGroup*, *-AutomationAccountName*, *-LogAnalyticsWorkspaceName*,and *-StorageAccountName*, -*StorageResourceGroup*.

    >[AZURE.NOTE] You will be prompted to authenticate with Azure after you execute the script.  You *must* log in with an account that is a Service administrator and co-admin of the subscription.   
    
        .\Enable-AzureDiagnostics -AutomationResourceGroup <ResourceGroupName> 
        -AutomationAccountName <NameofAutomationAccount> `
        -LogAnalyticsWorkspaceName <NameofOMSWorkspace> `
        -StorageAccountName <NameofStorageAccount> ` 
        -StorageResourceGroup <ResourceGroupName>

3. Once it completes successfully, you will need to 

## Viewing Automation Logs in Log Analytics 

Now that you have started sending your Automation job logs to Log Analytics, let’s see what you can do with these logs inside OMS.   

### Send an email when a runbook job fails or suspends 

One of our top customer asks is for the ability to send an email or a text when something goes wrong with a runbook job.   

To create an alert rule, you start by creating a log search for the runbook job records that should invoke the alert.  The **Alert** button will then be available so you can create and configure the alert rule.

1.	From the OMS Overview page, click **Log Search**.
2.	Create a log search query for your alert by typing in the following in the query field:  `Category=JobLogs (ResultType=Failed || ResultType=Suspended)`.  You can also group by the RunbookName by using: `Category=JobLogs (ResultType=Failed || ResultType=Suspended) | measure Count() by RunbookName_s`.   
  
    If you have set up logs from more than one Automation account or subscription to your workspace, you may also be interested in grouping your alerts by the subscription or Automation account.  Automation account name can be derived from the Resource field in the search of JobLogs.  
3.	Click **Alert** at the top of the page to open the **Add Alert Rule** screen.  For further details on the options to configure the alert, please see [Alerts in Log Analytics](../log-analytics/log-analytics-lerts.md#creating-an-alert-rule).

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
<br> ![OMS Historical Job Status Chart](media/automation-scenario-send-joblogs-oms-loganalytics/historical-job-status-chart.png)<br>

## Summary

By sending your Automation job status and stream data to Log Analytics, you can get insight on your Automation jobs and set up alerts so you no longer need to sign into the portal to monitor job status.  You can also now write advanced queries in Log Analytics to better monitor and investigate your Automation jobs. 

## Next steps

- To learn more about how to construct different search queries and review the Automation job logs with Log Analytics, see [Log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md)
- To understand how to create and retrieve output and error messages from runbooks, see [Runbook output and messages](automation-runbook-output-and-messages.md) 
- To learn more about runbook execution, how to monitor runbook jobs, and other technical details, see [Track a runbook job](automation-runbook-execution.md)