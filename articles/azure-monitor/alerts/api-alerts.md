---
title: Legacy Log Analytics Alert REST API
description: The Log Analytics Alert REST API allows you to create and manage alerts in Log Analytics. This article provides details about the API and examples for performing different operations.
ms.topic: conceptual
ms.date: 06/20/2023
ms.reviewer: nolavime

---

# Legacy Log Analytics alerts REST API

This article describes how to manage alert rules using the legacy API.

> [!IMPORTANT]
> As [announced](https://azure.microsoft.com/updates/switch-api-preference-log-alerts/), the Log Analytics alert API will be retired on October 1, 2025. You must transition to using the Scheduled Query Rules API for log alerts by that date.
> Log Analytics workspaces created after June 1, 2019 use the [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules) to manage alert rules. [Switch to the current API](./alerts-log-api-switch.md) in older workspaces to take advantage of Azure Monitor scheduledQueryRules [benefits](./alerts-log-api-switch.md#benefits). 

The Log Analytics Alert REST API allows you to create and manage alerts in Log Analytics. This article provides details about the API and several examples for performing different operations.

The Log Analytics Search REST API is RESTful and can be accessed via the Azure Resource Manager REST API. In this article, you'll find examples where the API is accessed from a PowerShell command line by using [ARMClient](https://github.com/projectkudu/ARMClient). This open-source command-line tool simplifies invoking the Azure Resource Manager API.

The use of ARMClient and PowerShell is one of many options you can use to access the Log Analytics Search API. With these tools, you can utilize the RESTful Azure Resource Manager API to make calls to Log Analytics workspaces and perform search commands within them. The API outputs search results in JSON format so that you can use the search results in many different ways programmatically.

## Prerequisites

Currently, alerts can only be created with a saved search in Log Analytics. For more information, see the [Log Search REST API](../logs/log-query-overview.md).

## Schedules

A saved search can have one or more schedules. The schedule defines how often the search is run and the time interval over which the criteria are identified. Schedules have the properties described in the following table:

| Property | Description |
|:--- |:--- |
| `Interval` |How often the search is run. Measured in minutes. |
| `QueryTimeSpan` |The time interval over which the criteria are evaluated. Must be equal to or greater than `Interval`. Measured in minutes. |
| `Version` |The API version being used. Currently, this setting should always be `1`. |

For example, consider an event query with an `Interval` of 15 minutes and a `Timespan` of 30 minutes. In this case, the query would be run every 15 minutes. An alert would be triggered if the criteria continued to resolve to `true` over a 30-minute span.

### Retrieve schedules

Use the Get method to retrieve all schedules for a saved search.

```powershell
armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules?api-version=2015-03-20
```

Use the Get method with a schedule ID to retrieve a particular schedule for a saved search.

```powershell
armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20
```

The following sample response is for a schedule:

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

### Create a schedule

Use the Put method with a unique schedule ID to create a new schedule. Two schedules can't have the same ID even if they're associated with different saved searches. When you create a schedule in the Log Analytics console, a GUID is created for the schedule ID.

> [!NOTE]
> The name for all saved searches, schedules, and actions created with the Log Analytics API must be in lowercase.

```powershell
$scheduleJson = "{'properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Enabled':'true' } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson
```

### Edit a schedule

Use the Put method with an existing schedule ID for the same saved search to modify that schedule. In the following example, the schedule is disabled. The body of the request must include the *etag* of the schedule.

```powershell
$scheduleJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A49.8074679Z'\""','properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Enabled':'false' } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson
```

### Delete schedules

Use the Delete method with a schedule ID to delete a schedule.

```powershell
armclient delete /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20
```

## Actions

A schedule can have multiple actions. An action might define one or more processes to perform, such as sending an email or starting a runbook. An action also might define a threshold that determines when the results of a search match some criteria. Some actions will define both so that the processes are performed when the threshold is met.

All actions have the properties described in the following table. Different types of alerts have other different properties, which are described in the following table:

| Property | Description |
|:--- |:--- |
| `Type` |Type of the action. Currently, the possible values are `Alert` and `Webhook`. |
| `Name` |Display name for the alert. |
| `Version` |The API version being used. Currently, this setting should always be `1`. |

### Retrieve actions

Use the Get method to retrieve all actions for a schedule.

```powershell
armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules/{Schedule ID}/actions?api-version=2015-03-20
```

Use the Get method with the action ID to retrieve a particular action for a schedule.

```powershell
armclient get /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/actions/{Action ID}?api-version=2015-03-20
```

### Create or edit actions

Use the Put method with an action ID that's unique to the schedule to create a new action. When you create an action in the Log Analytics console, a GUID is for the action ID.

> [!NOTE]
> The name for all saved searches, schedules, and actions created with the Log Analytics API must be in lowercase.

Use the Put method with an existing action ID for the same saved search to modify that schedule. The body of the request must include the etag of the schedule.

The request format for creating a new action varies by action type, so these examples are provided in the following sections.

### Delete actions

Use the Delete method with the action ID to delete an action.

```powershell
armclient delete /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/Actions/{Action ID}?api-version=2015-03-20
```

### Alert actions

A schedule should have one and only one Alert action. Alert actions have one or more of the sections described in the following table:

| Section | Description | Usage |
|:--- |:--- |:--- |
| Threshold |Criteria for when the action is run.| Required for every alert, before or after they're extended to Azure. |
| Severity |Label used to classify the alert when triggered.| Required for every alert, before or after they're extended to Azure. |
| Suppress |Option to stop notifications from alerts. | Optional for every alert, before or after they're extended to Azure. |
| Action groups |IDs of Azure `ActionGroup` where actions required are specified, like emails, SMSs, voice calls, webhooks, automation runbooks, and ITSM Connectors.| Required after alerts are extended to Azure.|
| Customize actions|Modify the standard output for select actions from `ActionGroup`.| Optional for every alert and can be used after alerts are extended to Azure. |

### Thresholds

An Alert action should have one and only one threshold. When the results of a saved search match the threshold in an action associated with that search, any other processes in that action are run. An action can also contain only a threshold so that it can be used with actions of other types that don't contain thresholds.

Thresholds have the properties described in the following table:

| Property | Description |
|:--- |:--- |
| `Operator` |Operator for the threshold comparison. <br> gt = Greater than <br> lt = Less than |
| `Value` |Value for the threshold. |

For example, consider an event query with an `Interval` of 15 minutes, a `Timespan` of 30 minutes, and a `Threshold` of greater than 10. In this case, the query would be run every 15 minutes. An alert would be triggered if it returned 10 events that were created over a 30-minute span.

The following sample response is for an action with only a `Threshold`:

```json
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
```

Use the Put method with a unique action ID to create a new threshold action for a schedule.

```powershell
$thresholdJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson
```

Use the Put method with an existing action ID to modify a threshold action for a schedule. The body of the request must include the etag of the action.

```powershell
$thresholdJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson
```

#### Severity

Log Analytics allows you to classify your alerts into categories for easier management and triage. The Alerts severity levels are `informational`, `warning`, and `critical`. These categories are mapped to the normalized severity scale of Azure Alerts as shown in the following table:

|Log Analytics severity level  |Azure Alerts severity level  |
|---------|---------|
|`critical` |Sev 0|
|`warning` |Sev 1|
|`informational` | Sev 2|

The following sample response is for an action with only `Threshold` and `Severity`:

```json
"etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
"properties": {
   "Type": "Alert",
   "Name": "My threshold action",
   "Threshold": {
      "Operator": "gt",
      "Value": 10
   },
   "Severity": "critical",
   "Version": 1
}
```

Use the Put method with a unique action ID to create a new action for a schedule with `Severity`.

```powershell
$thresholdWithSevJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdWithSevJson
```

Use the Put method with an existing action ID to modify a severity action for a schedule. The body of the request must include the etag of the action.

```powershell
$thresholdWithSevJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdWithSevJson
```

#### Suppress

Log Analytics-based query alerts fire every time the threshold is met or exceeded. Based on the logic implied in the query, an alert might get fired for a series of intervals. The result is that notifications are sent constantly. To prevent such a scenario, you can set the `Suppress` option that instructs Log Analytics to wait for a stipulated amount of time before notification is fired the second time for the alert rule.

For example, if `Suppress` is set for 30 minutes, the alert will fire the first time and send notifications configured. It will then wait for 30 minutes before notification for the alert rule is again used. In the interim period, the alert rule will continue to run. Only notification is suppressed by Log Analytics for a specified time regardless of how many times the alert rule fired in this period.

The `Suppress` property of a Log Analytics alert rule is specified by using the `Throttling` value. The suppression period is specified by using the `DurationInMinutes` value.

The following sample response is for an action with only `Threshold`, `Severity`, and `Suppress` properties.

```json
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
   "Version": 1
}
```

Use the Put method with a unique action ID to create a new action for a schedule with `Severity`.

```powershell
$AlertSuppressJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Throttling': { 'DurationInMinutes': 30 },'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myalert?api-version=2015-03-20 $AlertSuppressJson
```

Use the Put method with an existing action ID to modify a severity action for a schedule. The body of the request must include the etag of the action.

```powershell
$AlertSuppressJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1','Severity': 'critical', 'Type':'Alert', 'Throttling': { 'DurationInMinutes': 30 },'Threshold': { 'Operator': 'gt', 'Value': 10 } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myalert?api-version=2015-03-20 $AlertSuppressJson
```

#### Action groups

All alerts in Azure use action group as the default mechanism for handling actions. With an action group, you can specify your actions once and then associate the action group to multiple alerts across Azure without the need to declare the same actions repeatedly. Action groups support multiple actions like email, SMS, voice call, ITSM connection, automation runbook, and webhook URI.

For users who have extended their alerts into Azure, a schedule should now have action group details passed along with `Threshold` to be able to create an alert. E-mail details, webhook URLs, runbook automation details, and other actions need to be defined inside an action group first before you create an alert. You can create an [action group from Azure Monitor](./action-groups.md) in the Azure portal or use the [Action Group API](/rest/api/monitor/actiongroups).

To associate an action group to an alert, specify the unique Azure Resource Manager ID of the action group in the alert definition. The following sample illustrates the use:

```json
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
}
```

Use the Put method with a unique action ID to associate an already existing action group for a schedule. The following sample illustrates the use:

```powershell
$AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']} } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

Use the Put method with an existing action ID to modify an action group associated for a schedule. The body of the request must include the etag of the action.

```powershell
$AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': { 'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'] } } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

#### Customize actions

By default, actions follow standard templates and format for notifications. But you can customize some actions, even if they're controlled by action groups. Currently, customization is possible for `EmailSubject` and `WebhookPayload`.

##### Customize EmailSubject for an action group

By default, the email subject for alerts is Alert Notification `<AlertName>` for `<WorkspaceName>`. But the subject can be customized so that you can specify words or tags to allow you to easily employ filter rules in your Inbox. The customized email header details need to be sent along with `ActionGroup` details, as in the following sample:

```json
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
}
```

Use the Put method with a unique action ID to associate an existing action group with customization for a schedule. The following sample illustrates the use:

```powershell
$AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'], 'CustomEmailSubject': 'Azure Alert fired'} } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

Use the Put method with an existing action ID to modify an action group associated for a schedule. The body of the request must include the etag of the action.

```powershell
$AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']}, 'CustomEmailSubject': 'Azure Alert fired' } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

##### Customize WebhookPayload for an action group

By default, the webhook sent via an action group for Log Analytics has a fixed structure. But you can customize the JSON payload by using specific variables supported to meet requirements of the webhook endpoint. For more information, see [Webhook action for log alert rules](./alerts-log-webhook.md).

The customized webhook details must be sent along with `ActionGroup` details. They'll be applied to all webhook URIs specified inside the action group. The following sample illustrates the use:

```json
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
```

Use the Put method with a unique action ID to associate an existing action group with customization for a schedule. The following sample illustrates the use:

```powershell
$AzNsJson = "{'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup'], 'CustomEmailSubject': 'Azure Alert fired','CustomWebhookPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}'} } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

Use the Put method with an existing action ID to modify an action group associated for a schedule. The body of the request must include the etag of the action.

```powershell
$AzNsJson = "{'etag': 'datetime'2017-12-13T10%3A52%3A21.1697364Z'\"', 'properties': { 'Name': 'test-alert', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 12 },'Severity': 'critical', 'AzNsNotification': {'GroupIds': ['subscriptions/1234a45-123d-4321-12aa-123b12a5678/resourcegroups/my-resource-group/providers/microsoft.insights/actiongroups/test-actiongroup']}, 'CustomEmailSubject': 'Azure Alert fired','CustomWebhookPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}' } }"
armclient put /subscriptions/{Subscription ID}/resourceGroups/{Resource Group Name}/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myAzNsaction?api-version=2015-03-20 $AzNsJson
```

## Next steps

* Use the [REST API to perform log searches](../logs/log-query-overview.md) in Log Analytics.
* Learn about [log alerts in Azure Monitor](./alerts-unified-log.md).
* Learn how to [create, edit, or manage log alert rules in Azure Monitor](./alerts-log.md).
