---
title: Calling an Azure Automation Runbook from a Log Analytics Alert | Microsoft Docs
description: This article provides an overview of how to invoke an Automation runbook from a Microsoft OMS Log Analytics alert.
services: automation
documentationcenter: ''
author: eslesar
manager: jwhit
editor: ''

ms.assetid:
ms.service: automation
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/31/2017
ms.author: magoedte
---

# Calling an Azure Automation runbook from an OMS Log Analytics alert

If an alert is configured in Log Analytics to create an alert record when results match criteria, such as a prolonged spike in processor utilization or an application process critical to the functionality of a business application fails and writes a corresponding event in the Windows event log, that alert can automatically run an Automation runbook in an attempt to auto-remediate the issue.  

There are two options to call a runbook in the alert configuration, such as:

1. Using a Webhook.
   * It is the only option available if your OMS workspace is not linked to an Automation account.
   * If you already have an Automation account linked to an OMS workspace, this option is still available.  

2. Select a runbook directly.
   * This option is available only 
   *  the OMS workspace is linked to an Automation account.  

## Calling a runbook using a webhook

A webhook allows you to start a particular runbook in Azure Automation through a single HTTP request.  Before configuring the [Log Analytics alert](../log-analytics/log-analytics-alerts.md#alert-rules) to call the runbook using a webhook as an alert action, you need to first create a webhook for the runbook that is called using this method.  Perform the steps in the [create a webhook](automation-webhooks.md#creating-a-webhook) article, and remember to record the webhook URL so you can reference it while configuring the alert rule.   

## Calling a runbook directly

If you have the Automation & Control offering installed and configured in your OMS workspace, while configuring the Runbook actions option for the alert, you can view all runbooks from the **Select a runbook** drop-down list and select the specific runbook you want to run in response to the alert.  The selected runbook can run in a workspace in the Azure cloud or on a hybrid runbook worker.  After the alert is created using the runbook option, a webhook is created for the runbook.  You can see the webhook if you go to the Automation account and navigate to the webhook pane of the selected runbook.  If you delete the alert, the webhook is not deleted, but the user can delete the webhook manually.  It is not a problem if the webhook is not deleted, it is just an orphaned item that you eventually need to delete to maintain an organized Automation account.  

## Characteristics of a runbook (for both options)

Both methods for calling the runbook from the Log Analytics alert have different behavior characteristics that need to be understood before you configure your alert rules.  

* You must have a runbook input parameter called **WebhookData** that is **Object** type.  It can be mandatory or optional.  The alert passes the search results to the runbook using this input parameter.

        param  
	     (  
	      [Parameter (Mandatory=$true)]  
	      [object] $WebhookData  
         )

*  You must have code to convert the WebhookData to a PowerShell object.

	`$SearchResults = (ConvertFrom-Json $WebhookData.RequestBody).SearchResults.value`

	*$SearchResults* is an array of objects; each object contains the fields with values from one search result

### WebhookData inconsistencies between the webhook option and runbook option

* When configuring an alert to call a Webhook, enter a webhook URL you created for a runbook, and click the **Test Webhook** button.  The resulting WebhookData sent to the runbook does not contain either *.SearchResult* or *.SearchResults*.

*  After you save that alert, the alert triggers and calls the webhook and the WebhookData sent to the runbook contains *.SearchResult*.
* If you create an alert, and configure it to call a runbook (which also creates a webhook), when the alert triggers it sends WebhookData to the runbook containing *.SearchResults*.

Thus in the code example above, you need to get *.SearchResult* if the alert calls a webhook, and get *.SearchResults* if the alert calls a runbook directly.

## Example walkthrough

We demonstrate how this works by using the following example graphical runbook, which starts a Windows service.<br><br> ![Start Windows Service Graphical Runbook](media/automation-invoke-runbook-from-omsla-alert/automation-runbook-restartservice.png)<br>

The runbook has one input parameter of type **Object** that is called **WebhookData** and includes the webhook data passed from the alert containing *.SearchResults*.<br><br> ![Runbook input parameters](media/automation-invoke-runbook-from-omsla-alert/automation-runbook-restartservice-inputparameter.png)<br>

For this example, in Log Analytics we created two custom fields, *SvcDisplayName_CF* and *SvcState_CF*, to extract the service display name and the state of the service (i.e. running or stopped) from the event written to the System event log.  We then create an alert rule with the following search query: `Type=Event SvcDisplayName_CF="Print Spooler" SvcState_CF="stopped"` so that we can detect when the Print Spooler service is stopped on the Windows system.  It can be any service of interest, but for this example we are referencing one of the pre-existing services that are included with the Windows OS.  The alert action is configured to execute our runbook used in this example and run on the Hybrid Runbook Worker, which is enabled on the target system.   

The runbook code activity **Get Service Name from LA** converts the JSON-formatted string into an object type and filter on the item *SvcDisplayName_CF* to extract the display name of the Windows service and pass this onto the next activity which verifies the service is stopped before attempting to restart it.  *SvcDisplayName_CF* is a [custom field](../log-analytics/log-analytics-custom-fields.md) created in Log Analytics to demonstrate this example.

    $SearchResults = (ConvertFrom-Json $WebhookData.RequestBody).SearchResults.value
    $SearchResults.SvcDisplayName_CF  

When the service stops, the alert rule in Log Analytics detects a match and trigger the runbook and send the alert context to the runbook. The runbook takes action to verify the service is stopped, and if so attempt to restart the service and verify it started correctly and output the results.     

Alternatively if you don't have your Automation account linked to your OMS workspace, you would configure the alert rule with a webhook action to trigger the runbook and configure the runbook to convert the JSON-formatted string and filter on *.SearchResult* following the guidance mentioned earlier.    

## Next steps

* To learn more about alerts in Log Analytics and how to create one, see [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md).

* To understand how to trigger runbooks using a webhook, see [Azure Automation webhooks](automation-webhooks.md).
