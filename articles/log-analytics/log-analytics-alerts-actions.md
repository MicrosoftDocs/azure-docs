---
title: Responses to alerts in OMS Log Analytics | Microsoft Docs
description: Alerts in Log Analytics identify important information in your OMS repository and can proactively notify you of issues or invoke actions to attempt to correct them.  This article describes how to create an alert rule and details the different actions they can take.
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 6cfd2a46-b6a2-4f79-a67b-08ce488f9a91
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/28/2017
ms.author: bwren

ms.custom: H1Hack27Feb2017

---

# Add actions to alert rules in Log Analytics
When an [alert is created in Log Analytics](log-analytics-alerts.md), you have the option of [configuring the alert rule](log-analytics-alerts.md) to perform one or more actions.  This article describes the different actions that are available and details on configuring each kind.

| Action | Description |
|:--|:--|
| [Email](#email-actions) |	Send an e-mail with the details of the alert to one or more recipients. |
| [Webhook](#webhook-actions) | Invoke an external process through a single HTTP POST request. |
| [Runbook](#runbook-actions) | Start a runbook in Azure Automation. |


## Email actions
Email actions send an e-mail with the details of the alert to one or more recipients.  You can specify the subject of the mail, but it's content is a standard format constructed by Log Analytics.  It includes summary information such as the name of the alert in addition to details of up to ten records returned by the log search.  It also includes a link to a log search in Log Analytics that will return the entire set of records from that query.   The sender of the mail is *Microsoft Operations Management Suite Team &lt;noreply@oms.microsoft.com&gt;*. 

Email actions require the properties in the following table.

| Property | Description |
|:--- |:--- |
| Subject |Subject in the email.  You cannot modify the body of the mail. |
| Recipients |Addresses of all e-mail recipients.  If you specify more than one address, then separate the addresses with a semicolon (;). |


## Webhook actions

Webhook actions allow you to invoke an external process through a single HTTP POST request.  The service being called should support webhooks and determine how it will use any payload it receives.  You could also call a REST API that doesn't specifically support webhooks as long as the request is in a format that the API understands.  Examples of using a webhook in response to an alert are sending a message in [Slack](http://slack.com) or creating an incident in [PagerDuty](http://pagerduty.com/).  A complete walkthrough of creating an alert rule with a webhook to call Slack is available at [Webhooks in Log Analytics alerts](log-analytics-alerts-webhooks.md).

Webhook actions require the properties in the following table.

| Property | Description |
|:--- |:--- |
| Webhook URL |The URL of the webhook. |
| Custom JSON payload |Custom payload to send with the webhook.  See below for details. |


Webhooks include a URL and a payload formatted in JSON that is the data sent to the external service.  By default, the payload will include the values in the following table.  You can choose to replace this payload with a custom one of your own.  In that case you can use the variables in the table for each of the parameters to include their value in your custom payload.

| Parameter | Variable | Description |
|:--- |:--- |:--- |
| AlertRuleName |#alertrulename |Name of the alert rule. |
| AlertThresholdOperator |#thresholdoperator |Threshold operator for the alert rule.  *Greater than* or *Less than*. |
| AlertThresholdValue |#thresholdvalue |Threshold value for the alert rule. |
| LinkToSearchResults |#linktosearchresults |Link to Log Analytics log search that returns the records from the query that created the alert. |
| ResultCount |#searchresultcount |Number of records in the search results. |
| SearchIntervalEndtimeUtc |#searchintervalendtimeutc |End time for the query in UTC format. |
| SearchIntervalInSeconds |#searchinterval |Time window for the alert rule. |
| SearchIntervalStartTimeUtc |#searchintervalstarttimeutc |Start time for the query in UTC format. |
| SearchQuery |#searchquery |Log search query used by the alert rule. |
| SearchResults |See below |Records returned by the query in JSON format.  Limited to the first 5,000 records. |
| WorkspaceID |#workspaceid |ID of your OMS workspace. |

For example, you might specify the following custom payload that includes a single parameter called *text*.  The service that this webhook calls would be expecting this parameter.

    {
        "text":"#alertrulename fired with #searchresultcount over threshold of #thresholdvalue."
    }

This example payload would resolve to something like the following when sent to the webhook.

    {
        "text":"My Alert Rule fired with 18 records over threshold of 10 ."
    }

To include search results in a custom payload, add the following line as a top level property in the json payload.  

    "IncludeSearchResults":true

For example, to create a custom payload that includes just the alert name and the search results, you could use the following. 

    {
       "alertname":"#alertrulename",
       "IncludeSearchResults":true
    }


You can walk through a complete example of creating an alert rule with a webhook to start an external service at [Create an alert webhook action in OMS Log Analytics to send message to Slack](log-analytics-alerts-webhooks.md).

## Runbook actions
Runbook actions start a runbook in Azure Automation.  In order to use this type of action, you must have the [Automation solution](log-analytics-add-solutions.md) installed and configured in your OMS workspace.  You can select from the runbooks in the automation account that you configured in the Automation solution.

Runbook actions require the properties in the following table.

| Property | Description |
|:--- |:---|
| Runbook | Runbook that you want to start when an alert is created. |
| Run on | Specify **Azure** to run the runbook in the cloud.  Specify **Hybrid worker** to run the runbook on an agent with [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md ) installed.  |

Runbook actions start the runbook using a [webhook](../automation/automation-webhooks.md).  When you create the alert rule, it will automatically create a new webhook for the runbook with the name **OMS Alert Remediation** followed by a GUID.  

You cannot directly populate any parameters of the runbook, but the [$WebhookData parameter](../automation/automation-webhooks.md) will include the details of the alert, including the results of the log search that created it.  The runbook will need to define **$WebhookData** as a parameter for it to access the properties of the alert.  The alert data is available in json format in a single property called **SearchResults** in the **RequestBody** property of **$WebhookData**.  This will have with the properties in the following table.

| Node | Description |
|:--- |:--- |
| id |Path and GUID of the search. |
| __metadata |Information about the alert including the number of records and status of the search results. |
| value |Separate entry for each record in the search results.  The details of the entry will match the properties and values of the record. |

For example, the following runbook would extract the records returned by the log search  and assign different properties based on the type of each record.  Note that the runbook starts by converting **RequestBody** from json so that it can be worked with as an object in PowerShell.

    param ( 
        [object]$WebhookData
    )

    $RequestBody = ConvertFrom-JSON -InputObject $WebhookData.RequestBody
    $Records     = $RequestBody.SearchResults.value

    foreach ($Record in $Records)
    {
        $Computer = $Record.Computer

        if ($Record.Type -eq 'Event')
        {
            $EventNo    = $Record.EventID
            $EventLevel = $Record.EventLevelName
            $EventData  = $Record.EventData
        }

        if ($Record.Type -eq 'Perf')
        {
            $Object    = $Record.ObjectName
            $Counter   = $Record.CounterName
            $Instance  = $Record.InstanceName
            $Value     = $Record.CounterValue
        }
    }


## Next steps
- Complete a walkthrough for [configuring a webook](log-analytics-alerts-webhooks.md) with an alert rule.  
- Learn how to write [runbooks in Azure Automation](https://azure.microsoft.com/documentation/services/automation) to remediate problems identified by alerts.