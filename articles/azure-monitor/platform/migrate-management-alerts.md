---
title: Migrate Azure alerts on management events to Activity Log alerts
description: Alerts on management events will be removed on October 1. Prepare by migrating existing alerts.
author: rboucher
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 08/14/2017
ms.author: robb
ms.subservice: alerts
---
# Migrate Azure alerts on management events to Activity Log alerts

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

> [!WARNING]
> Alerts on management events will be turned off on or after October 1,2017. Use the directions below to understand if you have these alerts and migrate them if so.

## What is changing

Azure Monitor (formerly Azure Insights) offered a capability to create an alert that triggered off of management events and generated notifications to a webhook URL or email addresses. You may have created one of these alerts any of these ways:
* In the Azure portal for certain resource types, under Monitoring -> Alerts -> Add Alert, where “Alert on” is set to “Events”
* By running the Add-AzLogAlertRule PowerShell cmdlet
* By directly using [the alert REST API](https://docs.microsoft.com/rest/api/monitor/alertrules) with odata.type = “ManagementEventRuleCondition” and dataSource.odata.type = “RuleManagementEventDataSource”
 
The following PowerShell script returns a list of all alerts on management events that you have in your subscription, as well as the conditions set on each alert.

```powershell
Connect-AzAccount
$alerts = $null
foreach ($rg in Get-AzResourceGroup ) {
  $alerts += Get-AzAlertRule -ResourceGroup $rg.ResourceGroupName
}
foreach ($alert in $alerts) {
  if($alert.Properties.Condition.DataSource.GetType().Name.Equals("RuleManagementEventDataSource")) {
    "Alert Name: " + $alert.Name
    "Alert Resource ID: " + $alert.Id
    "Alert conditions:"
    $alert.Properties.Condition.DataSource
    "---------------------------------"
  }
} 
```

If you have no alerts on management events, the PowerShell cmdlet above will output a series of warning messages like this one:

`WARNING: The output of this cmdlet will be flattened, i.e. elimination of the properties field, in a future release to improve the user experience.`

These warning messages can be ignored. If you do have alerts on management events, the output of this PowerShell cmdlet will look like this:

```
Alert Name: webhookEvent1
Alert Resource ID: /subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/microsoft.insights/alertrules/webhookEvent1
Alert conditions:

EventName            : 
EventSource          : 
Level                : 
OperationName        : microsoft.web/sites/start/action
ResourceGroupName    : 
ResourceProviderName : 
Status               : succeeded
SubStatus            : 
Claims               : Microsoft.Azure.Management.Monitor.Management.Models.RuleManagementEventClaimsDataSource
ResourceUri          : /subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/Microsoft.Web/sites/samplealertapp

---------------------------------
Alert Name: someclilogalert
Alert Resource ID: /subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/microsoft.insights/alertrules/someclilogalert
Alert conditions:

EventName            : 
EventSource          : 
Level                : 
OperationName        : Start
ResourceGroupName    : 
ResourceProviderName : 
Status               : 
SubStatus            : 
Claims               : Microsoft.Azure.Management.Monitor.Management.Models.RuleManagementEventClaimsDataSource
ResourceUri          : /subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/Microsoft.Compute/virtualMachines/Seaofclouds

---------------------------------
```

Each alert is separated by a dashed line and details include the resource ID of the alert and the specific rule being monitored.

This functionality has been transitioned to [Azure Monitor Activity Log Alerts](../../azure-monitor/platform/activity-log-alerts.md). These new alerts enable you to set a condition on Activity Log events and receive a notification when a new event matches the condition. They also offer several improvements from alerts on management events:
* You can reuse your group of notification recipients (“actions”) across many alerts using [Action Groups](../../azure-monitor/platform/action-groups.md), reducing the complexity of changing who should receive an alert.
* You can receive a notification directly on your phone using SMS with Action Groups.
* You can [create Activity Log Alerts with Resource Manager templates](../../azure-monitor/platform/alerts-activity-log.md).
* You can create conditions with greater flexibility and complexity to meet your specific needs.
* Notifications are delivered more quickly.
 
## How to migrate
 
To create a new Activity Log Alert, you can either:
* Follow [our guide on how to create an alert in the Azure portal](../../azure-monitor/platform/activity-log-alerts.md)
* Learn how to [create an alert using a Resource Manager template](../../azure-monitor/platform/alerts-activity-log.md)
 
Alerts on management events that you have previously created will not be automatically migrated to Activity Log Alerts. You need to use the preceding PowerShell script to list the alerts on management events that you currently have configured and manually recreate them as Activity Log Alerts. This must be done before October 1, after which alerts on management events will no longer be visible in your Azure subscription. Other types of Azure alerts, including Azure Monitor metric alerts, Application Insights alerts, and Log Search alerts are unaffected by this change. If you have any questions, post in the comments below.


## Next steps

* Learn more about [Activity Log](../../azure-monitor/platform/activity-logs-overview.md)
* Configure [Activity Log Alerts via Azure portal](../../azure-monitor/platform/activity-log-alerts.md)
* Configure [Activity Log Alerts via Resource Manager](../../azure-monitor/platform/alerts-activity-log.md)
* Review the [activity log alert webhook schema](../../azure-monitor/platform/activity-log-alerts-webhook.md)
* Learn more about [Service Notifications](../../azure-monitor/platform/service-notifications.md)
* Learn more about [Action Groups](../../azure-monitor/platform/action-groups.md)

