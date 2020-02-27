---
title: Using Log Analytics Alert REST API
description: The Log Analytics Alert REST API allows you to create and manage alerts in Log Analytics, which is part of Log Analytics.  This article provides details of the API and several examples for performing different operations.
ms.subservice: logs
ms.topic: conceptual
ms.date: 07/29/2018

---

# Create and manage alert rules in Log Analytics with REST API 

The Log Analytics Alert REST API allows you to create and manage alerts in Log Analytics.  This article provides details of the API and several examples for performing different operations.

> [!IMPORTANT]
> As [announced earlier](https://azure.microsoft.com/updates/switch-api-preference-log-alerts/), log analytics workspace(s) created after *June 1, 2019* - will be able to manage alert rules using **only** Azure scheduledQueryRules [REST API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/), [Azure Resource Mananger Template](../../azure-monitor/platform/alerts-log.md#managing-log-alerts-using-azure-resource-template) and [PowerShell cmdlet](../../azure-monitor/platform/alerts-log.md#managing-log-alerts-using-powershell). Customers can easily [switch their preferred means of alert rule management](../../azure-monitor/platform/alerts-log-api-switch.md#process-of-switching-from-legacy-log-alerts-api) for older workspaces to leverage Azure Monitor scheduledQueryRules as default and gain many [new benefits](../../azure-monitor/platform/alerts-log-api-switch.md#benefits-of-switching-to-new-azure-api) like the ability to use native PowerShell cmdlets, increased lookback time period in rules, creation of rules in separate resource group or subscription and much more.

The Log Analytics Search REST API is RESTful and can be accessed via the Azure Resource Manager REST API. In this document, you will find examples where the API is accessed from a PowerShell command line using  [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool that simplifies invoking the Azure Resource Manager API. The use of ARMClient and PowerShell is one of many options to access the Log Analytics Search API. With these tools, you can utilize the RESTful Azure Resource Manager API to make calls to Log Analytics workspaces and perform search commands within them. The API will output search results to you in JSON format, allowing you to use the search results in many different ways programmatically.

## Prerequisites
Currently, alerts can only be created with a saved search in Log Analytics.  You can refer to the [Log Search REST API](../../azure-monitor/log-query/log-query-overview.md) for more information.

## Schedules
A saved search can have one or more schedules. The schedule defines how often the search is run and the time interval over which the criteria is identified.
Schedules have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Interval |How often the search is run. Measured in minutes. |
| QueryTimeSpan |The time interval over which the criteria is evaluated. Must be equal to or greater than Interval. Measured in minutes. |
| Version |The API version being used.  Currently, this should always be set to 1. |

For example, consider an event query with an Interval of 15 minutes and a Timespan of 30 minutes. In this case, the query would be run every 15 minutes, and an alert would be triggered if the criteria continued to resolve to true over a 30-minute span.

### Retrieving schedules
Use the Get method to retrieve all schedules for a saved search.

    armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules?api-version=2015-03-20

Use the Get method with a schedule ID to retrieve a particular schedule for a saved search.

    armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20

Following is a sample response for a schedule.

```json
{
    "value": [{
        "id": "subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/sampleRG/providers/Microsoft.OperationalInsights/workspaces/MyWorkspace/savedSearches/0f0f4853-17f8-4ed1-9a03-8e888b0d16ec/schedules/a17b53ef-bd70-4ca4-9ead-83b00f2024a8",
        "etag": "W/\"datetime'2016-02-25T20%3A54%3A49.8074679Z'\"",
        "properties": {
            "Interval": 15,
            "QueryTimeSpan": 15,
            "Enabled": true,
        }
    }]
}
```

### Creating a schedule
Use the Put method with a unique schedule ID to create a new schedule.  Two schedules cannot have the same ID even if they are associated with different saved searches.  When you create a schedule in the Log Analytics console, a GUID is created for the schedule ID.

> [!NOTE]
> The name for all saved searches, schedules, and actions created with the Log Analytics API must be in lowercase.

    $scheduleJson = "{'properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Enabled':'true' } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson

### Editing a schedule
Use the Put method with an existing schedule ID for the same saved search to modify that schedule; in example below the schedule is disabled. The body of the request must include the *etag* of the schedule.

      $scheduleJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A49.8074679Z'\""','properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Enabled':'false' } }"
      armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson


### Deleting schedules
Use the Delete method with a schedule ID to delete a schedule.

    armclient delete /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20


## Actions
A schedule can have multiple actions. An action may define one or more processes to perform such as sending a mail or starting a runbook, or it may define a threshold that determines when the results of a search match some criteria.  Some actions will define both so that the processes are performed when the threshold is met.

All actions have the properties in the following table.  Different types of alerts have different additional properties, which are described below.

| Property | Description |
|:--- |:--- |
| `Type` |Type of the action.  Currently the possible values are Alert and Webhook. |
| `Name` |Display name for the alert. |
| `Version` |The API version being used.  Currently, this should always be set to 1. |

### Retrieving actions

Use the Get method to retrieve all actions for a schedule.

    armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules/{Schedule ID}/actions?api-version=2015-03-20

Use the Get method with the action ID to retrieve a particular action for a schedule.

    armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/actions/{Action ID}?api-version=2015-03-20

### Creating or editing actions
Use the Put method with an action ID that is unique to the schedule to create a new action.  When you create an action in the Log Analytics console, a GUID is for the action ID.

> [!NOTE]
> The name for all saved searches, schedules, and actions created with the Log Analytics API must be in lowercase.

Use the Put method with an existing action ID for the same saved search to modify that schedule.  The body of the request must include the etag of the schedule.

The request format for creating a new action varies by action type so these examples are provided in the sections below.

### Deleting actions

Use the Delete method with the action ID to delete an action.

    armclient delete /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/Actions/{Action ID}?api-version=2015-03-20

### Alert Actions
A Schedule should have one and only one Alert action.  Alert actions have one or more of the sections in the following table.  Each is described in further detail below.

| Section | Description | Usage |
|:--- |:--- |:--- |
| Threshold |Criteria for when the action is run.| Required for every alert, before or after they are extended to Azure. |
| Severity |Label used to classify alert when triggered.| Required for every alert, before or after they are extended to Azure. |
| Suppress |Option to stop notifications from alert. | Optional for every alert, before or after they are extended to Azure. |
| Action Groups |IDs of Azure ActionGroup where actions required are specified, like - E-Mails, SMSs, Voice Calls, Webhooks, Automation Runbooks, ITSM Connectors, etc.| Required once alerts are extended to Azure|
| Customize Actions|Modify the standard output for select actions from ActionGroup| Optional for every alert, can be used after alerts are extended to Azure. |

### Thresholds
An Alert action should have one and only one threshold.  When the results of a saved search match the threshold in an action associated with that search, then any other processes in that action are run.  An action can also contain only a threshold so that it can be used with actions of other types that don’t contain thresholds.

Thresholds have the properties in the following table.

| Property | Description |
|:--- |:--- |
| `Operator` |Operator for the threshold comparison. <br> gt = Greater Than <br> lt = Less Than |
| `Value` |Value for the threshold. |

For example, consider an event query with an Interval of 15 minutes, a Timespan of 30 minutes, and a Threshold of greater than 10. In this case, the query would be run every 15 minutes, and an alert would be triggered if it returned 10 events that were created over a 30-minute span.

Following is a sample response for an action with only a threshold.  

    "etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
    "properties": {
        "Type": "Alert",
        "Name": "My threshold action",
        "Threshold": {
            "Operator": "gt",
            "Value": 10
        },
        "Version": 1
    }

Use the Put method with a unique action ID to create a new threshold action for a schedule.  

    $thresholdJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson

Use the Put method with an existing action ID to modify a threshold action for a schedule.  The body of the request must include the etag of the action.

    $thresholdJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson

#### Severity
Log Analytics allows you to classify your alerts into categories, to allow easier management and triage. The Alert severity defined is: informational, warning, and critical. These are mapped to the normalized severity scale of Azure Alerts as:

|Log Analytics Severity Level  |Azure Alerts Severity Level  |
|---------|---------|
|`critical` |Sev 0|
|`warning` |Sev 1|
|`informational` | Sev 2|

Following is a sample response for an action with only a threshold and severity. 

    "etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
    "properties": {
        "Type": "Alert",
        "Name": "My threshold action",
        "Threshold": {
            "Operator": "gt",
            "Value": 10
        },
        "Severity": "critical",
        "Version": 1    }

Use the Put method with a unique action ID to create a new action for a schedule with severity.  

    $thresholdWithSevJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdWithSevJson

Use the Put method with an existing action ID to modify a severity action for a schedule.  The body of the request must include the etag of the action.

    $thresholdWithSevJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdWithSevJson

#### Suppress
Log Analytics based query alerts will fire every time threshold is met or exceeded. Based on the logic implied in the query, this may result in alert getting fired for a series of intervals and hence notifications also being sent constantly. To prevent such scenario, a user can set Suppress option instructing Log Analytics to wait for a stipulated amount of time before notification is fired the second time for the alert rule. So if suppress is set for 30 minutes; then alert will fire the first time and send notifications configured. But then wait for 30 minutes, before notification for the alert rule is again used. In the interim period, alert rule will continue to run - only notification is suppressed by Log Analytics for specified time, regardless of how many times the alert rule fired in this period.

Suppress property of Log Analytics alert rule is specified using the *Throttling* value and the suppression period using *DurationInMinutes* value.

Following is a sample response for an action with only a threshold, severity, and suppress property

    "etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
    "properties": {
        "Type": "Alert",
        "Name": "My threshold action",
        "Threshold": {
            "Operator": "gt",
            "Value": 10
        },
        "Throttling": {
          "DurationInMinutes": 30
        },
        "Severity": "critical",
        "Version": 1    }

Use the Put method with a unique action ID to create a new action for a schedule with severity.  

    $AlertSuppressJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Throttling': { 'DurationInMinutes': 30 },'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myalert?api-version=2015-03-20 $AlertSuppressJson

Use the Put method with an existing action ID to modify a severity action for a schedule.  The body of the request must include the etag of the action.

    $AlertSuppressJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Throttling': { 'DurationInMinutes': 30 },'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myalert?api-version=2015-03-20 $AlertSuppressJson

#### Action Groups
All alerts in Azure, use Action Group as the default mechanism for handling actions. With Action Group, you can specify your actions once and then associate the action group to multiple alerts - across Azure. Without the need, to repeatedly declare the same actions over and over again. Action Groups support multiple actions - including email, SMS, Voice Call, ITSM Connection, Automation Runbook, Webhook URI and more. 

For users who have extended their alerts into Azure - a schedule should now have Action Group details passed along with threshold, to be able to create an alert. E-mail details, Webhook URLs, Runbook Automation details, and other Actions, need to be defined in side an Action Group first before creating an alert; one can create [Action Group from Azure Monitor](../../azure-monitor/platform/action-groups.md) in Portal or use [Action Group API](https://docs.microsoft.com/rest/api/monitor/actiongroups).

To add association of action group to an alert, specify the unique Azure Resource Manager ID of the action group in the alert definition. A sample illustration is provided below:

     "etag": "W/\"datetime'2017-12-13T10%3A52%3A21.1697364Z'\"",
      "properties": {
        "Type": "Alert",
        "Name": "test-alert",
        "Description": "I need to put a description here",
        "Threshold": {
          "Operator": "gt",
          "Value": 12
        },
        "AzNsNotification": {
          "GroupIds": [
            "/subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup"
          ]
        },
        "Severity": "critical",
        "Version": 1
      },

Use the Put method with a unique action ID to associate already existing Action Group for a schedule.  The following is a sample illustration of usage.

    $AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']} } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson

Use the Put method with an existing action ID to modify an Action Group associated for a schedule.  The body of the request must include the etag of the action.

    $AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': { 'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'] } } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson

#### Customize Actions
By default actions, follow standard template and format for notifications. But user can customize some actions, even if they are controlled by Action Groups. Currently, customization is possible for Email Subject and Webhook Payload.

##### Customize E-Mail Subject for Action Group
By default, the email subject for alerts is: Alert Notification `<AlertName>` for `<WorkspaceName>`. But this can be customized, so that you can specific words or tags - to allow you to easily employ filter rules in your Inbox. 
The customize email header details need to send along with ActionGroup details, as in sample below.

     "etag": "W/\"datetime'2017-12-13T10%3A52%3A21.1697364Z'\"",
      "properties": {
        "Type": "Alert",
        "Name": "test-alert",
        "Description": "I need to put a description here",
        "Threshold": {
          "Operator": "gt",
          "Value": 12
        },
        "AzNsNotification": {
          "GroupIds": [
            "/subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup"
          ],
          "CustomEmailSubject": "Azure Alert fired"
        },
        "Severity": "critical",
        "Version": 1
      },

Use the Put method with a unique action ID to associate already existing Action Group with customization for a schedule.  The following is a sample illustration of usage.

    $AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'], 'CustomEmailSubject': 'Azure Alert fired'} } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson

Use the Put method with an existing action ID to modify an Action Group associated for a schedule.  The body of the request must include the etag of the action.

    $AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']}, 'CustomEmailSubject': 'Azure Alert fired' } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson

##### Customize Webhook Payload for Action Group
By default, the webhook sent via Action Group for log analytics has a fixed structure. But one can customize the JSON payload by using specific variables supported, to meet requirements of the webhook endpoint. For more information, see [Webhook action for log alert rules](../../azure-monitor/platform/alerts-log-webhook.md). 

The customize webhook details need to send along with ActionGroup details and will be applied to all Webhook URI specified inside the action group; as in sample below.

     "etag": "W/\"datetime'2017-12-13T10%3A52%3A21.1697364Z'\"",
      "properties": {
        "Type": "Alert",
        "Name": "test-alert",
        "Description": "I need to put a description here",
        "Threshold": {
          "Operator": "gt",
          "Value": 12
        },
        "AzNsNotification": {
          "GroupIds": [
            "/subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup"
          ],
          "CustomWebhookPayload": "{\"field1\":\"value1\",\"field2\":\"value2\"}",
          "CustomEmailSubject": "Azure Alert fired"
        },
        "Severity": "critical",
        "Version": 1
      },

Use the Put method with a unique action ID to associate already existing Action Group with customization for a schedule.  The following is a sample illustration of usage.

    $AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'], 'CustomEmailSubject': 'Azure Alert fired','CustomWebhookPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}'} } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson

Use the Put method with an existing action ID to modify an Action Group associated for a schedule.  The body of the request must include the etag of the action.

    $AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']}, 'CustomEmailSubject': 'Azure Alert fired','CustomWebhookPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}' } }"
    armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson


## Next steps

* Use the [REST API to perform log searches](../../azure-monitor/log-query/log-query-overview.md) in Log Analytics.
* Learn about [log alerts in Azure monitor](../../azure-monitor/platform/alerts-unified-log.md)
* How to [create, edit or manage log alert rules in Azure monitor](../../azure-monitor/platform/alerts-log.md)

