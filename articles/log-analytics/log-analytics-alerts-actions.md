---
title: Responses to alerts in Azure Log Analytics | Microsoft Docs
description: Alerts in Log Analytics identify important information in your Azure workspace and can proactively notify you of issues or invoke actions to attempt to correct them.  This article describes how to create an alert rule and details the different actions they can take.
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
ms.date: 04/13/2018
ms.author: bwren

ms.custom: H1Hack27Feb2017

---

# Add actions to alert rules in Log Analytics

> [!NOTE]
> Alerts in Log Analytics are [being extended into Azure](../monitoring-and-diagnostics/monitoring-alerts-extend.md).  Alerts in Azure use [Action Groups](../monitoring-and-diagnostics/monitoring-action-groups.md) to define their actions instead of the information in this article.


When an [alert is created in Log Analytics](log-analytics-alerts.md), you have the option of [configuring the alert rule](log-analytics-alerts.md) to perform one or more actions.  This article describes the different actions that are available and details on configuring each kind.

| Action | Description |
|:--|:--|
| [Email](#email-actions) |	Send an e-mail with the details of the alert to one or more recipients. |
| [Webhook](#webhook-actions) | Invoke an external process through a single HTTP POST request. |
| [Runbook](#runbook-actions) | Start a runbook in Azure Automation. |


## Email actions
Email actions send an e-mail with the details of the alert to one or more recipients.  You can specify the subject of the mail, but its content is a standard format constructed by Log Analytics.  It includes summary information such as the name of the alert in addition to details of up to ten records returned by the log search.  It also includes a link to a log search in Log Analytics that returns the entire set of records from that query.   The sender of the mail is *Microsoft Operations Management Suite Team &lt;noreply@oms.microsoft.com&gt;*. 

Email actions require the properties in the following table.

| Property | Description |
|:--- |:--- |
| Subject |Subject in the email.  You cannot modify the body of the mail. |
| Recipients |Addresses of all e-mail recipients.  If you specify more than one address, then separate the addresses with a semicolon (;). |


## Webhook actions

Webhook actions allow you to invoke an external process through a single HTTP POST request.  The service being called should support webhooks and determine how it uses any payload it receives.  You could also call a REST API that doesn't specifically support webhooks as long as the request is in a format that the API understands.  Examples of using a webhook in response to an alert are sending a message in [Slack](http://slack.com) or creating an incident in [PagerDuty](http://pagerduty.com/).  A complete walkthrough of creating an alert rule with a webhook to call Slack is available at [Webhooks in Log Analytics alerts](log-analytics-alerts-webhooks.md).

Webhook actions require the properties in the following table.

| Property | Description |
|:--- |:--- |
| Webhook URL |The URL of the webhook. |
| Custom JSON payload |Custom payload to send with the webhook.  See below for details. |


Webhooks include a URL and a payload formatted in JSON that is the data sent to the external service.  By default, the payload includes the values in the following table.  You can choose to replace this payload with a custom one of your own.  In that case you can use the variables in the table for each of the parameters to include their value in your custom payload.


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
| WorkspaceID |#workspaceid |ID of your Log Analytics workspace. |

For example, you might specify the following custom payload that includes a single parameter called *text*.  The service that this webhook calls would be expecting this parameter.

    {
        "text":"#alertrulename fired with #searchresultcount over threshold of #thresholdvalue."
    }

This example payload would resolve to something like the following when sent to the webhook.

    {
        "text":"My Alert Rule fired with 18 records over threshold of 10 ."
    }

To include search results in a custom payload, add the following line as a top-level property in the json payload.  

    "IncludeSearchResults":true

For example, to create a custom payload that includes just the alert name and the search results, you could use the following. 

    {
       "alertname":"#alertrulename",
       "IncludeSearchResults":true
    }


You can walk through a complete example of creating an alert rule with a webhook to start an external service at [Create an alert webhook action in Log Analytics to send message to Slack](log-analytics-alerts-webhooks.md).


## Runbook actions
Runbook actions start a runbook in Azure Automation.  In order to use this type of action, you must have the [Automation solution](log-analytics-add-solutions.md) installed and configured in your Log Analytics workspace.  You can select from the runbooks in the automation account that you configured in the Automation solution.

Runbook actions require the properties in the following table.

| Property | Description |
|:--- |:---|
| Runbook | Runbook that you want to start when an alert is created. |
| Run on | Specify **Azure** to run the runbook in the cloud.  Specify **Hybrid worker** to run the runbook on an agent with [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md ) installed.  |

Runbook actions start the runbook using a [webhook](../automation/automation-webhooks.md).  When you create the alert rule, it automatically creates a new webhook for the runbook with the name **OMS Alert Remediation** followed by a GUID.  

You cannot directly populate any parameters of the runbook, but the [$WebhookData parameter](../automation/automation-webhooks.md) includes the details of the alert, including the results of the log search that created it.  The runbook needs to define **$WebhookData** as a parameter for it to access the properties of the alert.  The alert data is available in json format in a single property called **SearchResult** (for runbook actions and webhook actions with standard payload) or **SearchResults** (webhook actions with custom payload including **IncludeSearchResults":true**) in the **RequestBody** property of **$WebhookData**.  This has with the properties in the following table.

>[!NOTE]
> If your workspace has been upgraded to the [new Log Analytics query language](log-analytics-log-search-upgrade.md), then the runbook payload has changed.  Details of the format are in [Azure Log Analytics REST API](https://aka.ms/loganalyticsapiresponse).  You can see an example in [Samples](#sample-payload) below.  

| Node | Description |
|:--- |:--- |
| id |Path and GUID of the search. |
| __metadata |Information about the alert including the number of records and status of the search results. |
| value |Separate entry for each record in the search results.  The details of the entry match the properties and values of the record. |

For example, the following runbooks would extract the records returned by the log search  and assign different properties based on the type of each record.  Note that the runbook starts by converting **RequestBody** from json so that it can be worked with as an object in PowerShell.

>[!NOTE]
> This runbook uses **SearchResult** which is the property that contains results for runbook actions and webhook actions with standard payload.  If the runbook were called from a webhook response using a custom payload, you would need to change this property to **SearchResults**.

    param ( 
        [object]$WebhookData
    )

    $RequestBody = ConvertFrom-JSON -InputObject $WebhookData.RequestBody

    # Get all metadata properties    
    $AlertRuleName = $RequestBody.AlertRuleName
    $AlertThresholdOperator = $RequestBody.AlertThresholdOperator
    $AlertThresholdValue = $RequestBody.AlertThresholdValue
    $AlertDescription = $RequestBody.Description
    $LinktoSearchResults =$RequestBody.LinkToSearchResults
    $ResultCount =$RequestBody.ResultCount
    $Severity = $RequestBody.Severity
    $SearchQuery = $RequestBody.SearchQuery
    $WorkspaceID = $RequestBody.WorkspaceId
    $SearchWindowStartTime = $RequestBody.SearchIntervalStartTimeUtc
    $SearchWindowEndTime = $RequestBody.SearchIntervalEndtimeUtc
    $SearchWindowInterval = $RequestBody.SearchIntervalInSeconds

    # Get detailed search results
    if($RequestBody.SearchResult -ne $null)
    {
        $SearchResultRows    = $RequestBody.SearchResult.tables[0].rows 
        $SearchResultColumns = $RequestBody.SearchResult.tables[0].columns;

        foreach ($SearchResultRow in $SearchResultRows)
        {   
            $Column = 0
            $Record = New-Object –TypeName PSObject 
        
            foreach ($SearchResultColumn in $SearchResultColumns)
            {
                $Name = $SearchResultColumn.name
                $ColumnValue = $SearchResultRow[$Column]
                $Record | Add-Member –MemberType NoteProperty –Name $name –Value $ColumnValue -Force
                        
                $Column++
            }

            # Include code to work with the record. 
            # For example $Record.Computer to get the computer property from the record.
            
        }
    }



## Sample payload
This section shows sample payload for webhook and runbook actions.

### Webhook actions
This example uses **SearchResult** which is the property that contains results for webhook actions with standard payload.  If the webhook used a custom payload that includes search results, this property would be **SearchResults**.

Following is a sample payload for a webhook action.

    {
    "WorkspaceId": "workspaceID",
    "AlertRuleName": "WebhookAlert",
    "SearchQuery": "Usage",
    "SearchResult": {
        "tables": [
        {
            "name": "PrimaryResult",
            "columns": [
            {
                "name": "TenantId",
                "type": "string"
            },
            {
                "name": "Computer",
                "type": "string"
            },
            {
                "name": "TimeGenerated",
                "type": "datetime"
            },
            {
                "name": "SourceSystem",
                "type": "string"
            },
            {
                "name": "StartTime",
                "type": "datetime"
            },
            {
                "name": "EndTime",
                "type": "datetime"
            },
            {
                "name": "ResourceUri",
                "type": "string"
            },
            {
                "name": "LinkedResourceUri",
                "type": "string"
            },
            {
                "name": "DataType",
                "type": "string"
            },
            {
                "name": "Solution",
                "type": "string"
            },
            {
                "name": "BatchesWithinSla",
                "type": "long"
            },
            {
                "name": "BatchesOutsideSla",
                "type": "long"
            },
            {
                "name": "BatchesCapped",
                "type": "long"
            },
            {
                "name": "TotalBatches",
                "type": "long"
            },
            {
                "name": "AvgLatencyInSeconds",
                "type": "real"
            },
            {
                "name": "Quantity",
                "type": "real"
            },
            {
                "name": "QuantityUnit",
                "type": "string"
            },
            {
                "name": "IsBillable",
                "type": "bool"
            },
            {
                "name": "MeterId",
                "type": "string"
            },
            {
                "name": "LinkedMeterId",
                "type": "string"
            },
            {
                "name": "Type",
                "type": "string"
            }
            ],
            "rows": [
            [
                "workspaceID",
                "-",
                "2017-09-26T13:59:59Z",
                "OMS",
                "2017-09-26T13:00:00Z",
                "2017-09-26T13:59:59Z",
                "/subscriptions/SubscriptionID/resourcegroups/ResourceGroupName/providers/microsoft.operationalinsights/workspaces/workspace-workspaceID",
                null,
                "Operation",
                "LogManagement",
                8,
                0,
                0,
                8,
                0,
                0.002502,
                "MBytes",
                false,
                "a4e29a95-5b4c-408b-80e3-113f9410566e",
                "00000000-0000-0000-0000-000000000000",
                "Usage"
            ]
            ]
        }
        ]
    },
    "SearchIntervalStartTimeUtc": "2017-09-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2017-09-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 1,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://workspaceID.portal.mms.microsoft.com/#Workspace/search/index?_timeInterval.intervalEnd=2017-09-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": null,
    "Severity": "Low"
    }


### Runbooks

Following is a sample payload for a runbook action.

    {
    "WorkspaceId": "workspaceID",
    "AlertRuleName": "AutomationAlert",
    "SearchQuery": "Usage",
    "SearchResult": {
        "tables": [
        {
            "name": "PrimaryResult",
            "columns": [
            {
                "name": "TenantId",
                "type": "string"
            },
            {
                "name": "Computer",
                "type": "string"
            },
            {
                "name": "TimeGenerated",
                "type": "datetime"
            },
            {
                "name": "SourceSystem",
                "type": "string"
            },
            {
                "name": "StartTime",
                "type": "datetime"
            },
            {
                "name": "EndTime",
                "type": "datetime"
            },
            {
                "name": "ResourceUri",
                "type": "string"
            },
            {
                "name": "LinkedResourceUri",
                "type": "string"
            },
            {
                "name": "DataType",
                "type": "string"
            },
            {
                "name": "Solution",
                "type": "string"
            },
            {
                "name": "BatchesWithinSla",
                "type": "long"
            },
            {
                "name": "BatchesOutsideSla",
                "type": "long"
            },
            {
                "name": "BatchesCapped",
                "type": "long"
            },
            {
                "name": "TotalBatches",
                "type": "long"
            },
            {
                "name": "AvgLatencyInSeconds",
                "type": "real"
            },
            {
                "name": "Quantity",
                "type": "real"
            },
            {
                "name": "QuantityUnit",
                "type": "string"
            },
            {
                "name": "IsBillable",
                "type": "bool"
            },
            {
                "name": "MeterId",
                "type": "string"
            },
            {
                "name": "LinkedMeterId",
                "type": "string"
            },
            {
                "name": "Type",
                "type": "string"
            }
            ],
            "rows": [
            [
                "861bd466-5400-44be-9552-5ba40823c3aa",
                "-",
                "2017-09-26T13:59:59Z",
                "OMS",
                "2017-09-26T13:00:00Z",
                "2017-09-26T13:59:59Z",
            "/subscriptions/SubscriptionID/resourcegroups/ResourceGroupName/providers/microsoft.operationalinsights/workspaces/workspace-861bd466-5400-44be-9552-5ba40823c3aa",
                null,
                "Operation",
                "LogManagement",
                8,
                0,
                0,
                8,
                0,
                0.002502,
                "MBytes",
                false,
                "a4e29a95-5b4c-408b-80e3-113f9410566e",
                "00000000-0000-0000-0000-000000000000",
                "Usage"
            ]
            ]
        }
        ]
    },
    "SearchIntervalStartTimeUtc": "2017-09-26T08:10:40Z",
    "SearchIntervalEndtimeUtc": "2017-09-26T09:10:40Z",
    "AlertThresholdOperator": "Greater Than",
    "AlertThresholdValue": 0,
    "ResultCount": 1,
    "SearchIntervalInSeconds": 3600,
    "LinkToSearchResults": "https://workspaceID.portal.mms.microsoft.com/#Workspace/search/index?_timeInterval.intervalEnd=2017-09-26T09%3a10%3a40.0000000Z&_timeInterval.intervalDuration=3600&q=Usage",
    "Description": null,
    "Severity": "Critical"
    }



## Next steps
- Complete a walkthrough for [configuring a webook](log-analytics-alerts-webhooks.md) with an alert rule.  
- Learn how to write [runbooks in Azure Automation](https://azure.microsoft.com/documentation/services/automation) to remediate problems identified by alerts.
