---
title: Call an Azure Automation runbook from a Log Analytics alert
description: This article provides an overview of how to invoke an Automation runbook from a Log Analytics alert in Azure.
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 03/16/2018
ms.topic: article
manager: carmonm
---

# Call an Azure Automation runbook from a Log Analytics alert

You can configure an alert in Azure Log Analytics to create an alert record when results match your criteria. That alert can then automatically run an Azure Automation runbook in an attempt to auto-remediate the issue. 

For example, an alert might indicate a prolonged spike in processor utilization. Or it might indicate when an application process that's critical to the functionality of a business application fails. A runbook can then write a corresponding event in the Windows event log.  

There are two options to call a runbook in the alert configuration:

* Use a webhook.
   * This is the only option available if your Log Analytics workspace is not linked to an Automation account.
   * If you already have an Automation account linked to a Log Analytics workspace, this option is still available.  

* Select a runbook directly.
   * This option is available only if the Log Analytics workspace is linked to an Automation account.

## Calling a runbook by using a webhook

You can use a webhook to start a particular runbook in Azure Automation through a single HTTP request. Before you configure the [Log Analytics alert](../log-analytics/log-analytics-alerts.md#alert-rules) to call the runbook by using a webhook as an alert action, you need to [create a webhook](automation-webhooks.md#creating-a-webhook) for the runbook that's called through this method. Remember to record the webhook URL so you can reference it while configuring the alert rule.   

## Calling a runbook directly

You can install and configure the Automation and Control offering in your Log Analytics workspace. While you're configuring the runbook actions option for the alert, you can view all runbooks from the **Select a runbook** drop-down list and select the specific runbook that you want to run in response to the alert. The selected runbook can run in an Azure workspace or on a hybrid runbook worker. 

After you create the alert by using the runbook option, a webhook is created for the runbook. You can see the webhook if you go to the Automation account and open the webhook pane of the selected runbook. 

If you delete the alert, the webhook is not deleted. This is not a problem. The webhook just becomes an orphaned item that you should eventually delete manually, to maintain an organized Automation account.  

## Characteristics of a runbook

Both methods for calling the runbook from the Log Analytics alert have characteristics that you need to understand before you configure your alert rules. 

The alert data is in JSON format in a single property called **SearchResult**. This format is for runbook and webhook actions with a standard payload. For webhook actions with custom payloads (including **IncludeSearchResults:True** in **RequestBody**), the property is **SearchResults**.

You must have a runbook input parameter called **WebhookData** that is an **Object** type. It can be mandatory or optional. The alert passes the search results to the runbook by using this input parameter.

```powershell
param  
    (  
    [Parameter (Mandatory=$true)]  
    [object] $WebhookData  
    )
```
You must also have code to convert **WebhookData** to a PowerShell object.

```powershell
$SearchResult = (ConvertFrom-Json $WebhookData.RequestBody).SearchResult.value
```

**$SearchResult** is an array of objects. Each object contains the fields with values from one search result.


## Example walkthrough

The following example of a graphical runbook demonstrates how this process works. It starts a Windows service.

![Graphical runbook for starting a Windows service](media/automation-invoke-runbook-from-omsla-alert/automation-runbook-restartservice.png)

The runbook has one input parameter of type **Object** that is called **WebhookData**. It includes the webhook data passed from the alert that contains **SearchResult**.

![Runbook input parameters](media/automation-invoke-runbook-from-omsla-alert/automation-runbook-restartservice-inputparameter.png)

For this example, we created two custom fields in Log Analytics: **SvcDisplayName_CF** and **SvcState_CF**. These fields extract the service display name and the state of the service (that is, running or stopped) from the event that's written to the system event log. We then created an alert rule with the following search query, so that we can detect when the Print Spooler service is stopped on the Windows system:

`Type=Event SvcDisplayName_CF="Print Spooler" SvcState_CF="stopped"` 

It can be any service of interest. For this example, we're referencing one of the pre-existing services that are included with the Windows OS. The alert action is configured to execute the runbook used in this example and run on the hybrid runbook worker, which is enabled on the target system.   

The runbook code activity **Get Service Name from LA** converts the JSON-formatted string into an object type and filters on the item **SvcDisplayName_CF**. It extracts the display name of the Windows service and passes this value to the next activity, which verifies that the service is stopped before attempting to restart it. **SvcDisplayName_CF** is a [custom field](../log-analytics/log-analytics-custom-fields.md) that we created in Log Analytics to demonstrate this example.

```powershell
$SearchResult = (ConvertFrom-Json $WebhookData.RequestBody).SearchResult.value
$SearchResult.SvcDisplayName_CF  
```

When the service stops, the alert rule in Log Analytics detects a match, triggers the runbook, and sends the alert context to the runbook. The runbook tries to verify that the service is stopped. If so, the runbook attempts to restart the service, verify that it started correctly, and display the results.     

Alternatively, if you don't have your Automation account linked to your Log Analytics workspace, you can configure the alert rule with a webhook action. The webhook action triggers the runbook. It also configures the runbook to convert the JSON-formatted string and filter on **SearchResult** by following the guidance mentioned earlier.    

>[!NOTE]
> If your workspace has been upgraded to the [new Log Analytics query language](../log-analytics/log-analytics-log-search-upgrade.md), the webhook payload has changed. Details of the format are in the [Azure Log Analytics REST API](https://aka.ms/loganalyticsapiresponse).

## Next steps

* To learn more about alerts in Log Analytics and how to create one, see [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md).

* To understand how to trigger runbooks by using a webhook, see [Azure Automation webhooks](automation-webhooks.md).
