---
title: Saved searches in management solutions | Microsoft Docs
description: Management solutions typically include saved log queries to analyze data collected by the solution. This article describes how to define Log Analytics saved searches in a Resource Manager template.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/29/2019

ms.custom: H1Hack27Feb2017
---

# Adding Log Analytics saved searches and alerts to management solution (Preview)

> [!IMPORTANT]
> As [announced earlier](https://azure.microsoft.com/updates/switch-api-preference-log-alerts/), log analytics workspace(s) created after *June 1, 2019* - will be able to manage alert rules using **only** Azure scheduledQueryRules [REST API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/), [Azure Resource Manager Template](../../azure-monitor/platform/alerts-log.md#managing-log-alerts-using-azure-resource-template) and [PowerShell cmdlet](../../azure-monitor/platform/alerts-log.md#managing-log-alerts-using-powershell). Customers can easily [switch their preferred means of alert rule management](../../azure-monitor/platform/alerts-log-api-switch.md#process-of-switching-from-legacy-log-alerts-api) for older workspaces to leverage Azure Monitor scheduledQueryRules as default and gain many [new benefits](../../azure-monitor/platform/alerts-log-api-switch.md#benefits-of-switching-to-new-azure-api) like the ability to use native PowerShell cmdlets, increased lookback time period in rules, creation of rules in separate resource group or subscription and much more.

> [!NOTE]
> This is preliminary documentation for creating management solutions which are currently in preview. Any schema described below is subject to change.

[Management solutions](solutions.md) will typically include [saved searches](../../azure-monitor/log-query/log-query-overview.md) in Log Analytics to analyze data collected by the solution. They may also define [alerts](../../azure-monitor/platform/alerts-overview.md) to notify the user or automatically take action in response to a critical issue. This article describes how to define Log Analytics saved searches and alerts in a [Resource Management template](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md) so they can be included in [management solutions](solutions-creating.md).

> [!NOTE]
> The samples in this article use parameters and variables that are either required or common to management solutions and described in [Design and build a management solution in Azure](solutions-creating.md)

## Prerequisites
This article assumes that you're already familiar with how to [create a management solution](solutions-creating.md) and the structure of a [Resource Manager template](../../azure-resource-manager/templates/template-syntax.md) and solution file.


## Log Analytics Workspace
All resources in Log Analytics are contained in a [workspace](../../azure-monitor/platform/manage-access.md). As described in [Log Analytics workspace and Automation account](solutions.md#log-analytics-workspace-and-automation-account), the workspace isn't included in the management solution but must exist before the solution is installed. If it isn't available, then the solution install fails.

The name of the workspace is in the name of each Log Analytics resource. This is done in the solution with the **workspace** parameter as in the following example of a SavedSearch resource.

    "name": "[concat(parameters('workspaceName'), '/', variables('SavedSearchId'))]"

## Log Analytics API version
All Log Analytics resources defined in a Resource Manager template have a property **apiVersion** that defines the version of the API the resource should use.

The following table lists the API version for the resource used in this example.

| Resource type | API version | Query |
|:---|:---|:---|
| savedSearches | 2017-03-15-preview | Event &#124; where EventLevelName == "Error"  |


## Saved Searches
Include [saved searches](../../azure-monitor/log-query/log-query-overview.md) in a solution to allow users to query data collected by your solution. Saved searches appear under **Saved Searches** in the Azure portal. A saved search is also required for each alert.

[Log Analytics saved search](../../azure-monitor/log-query/log-query-overview.md) resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches` and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names.

	{
		"name": "[concat(parameters('workspaceName'), '/', variables('SavedSearch').Name)]",
		"type": "Microsoft.OperationalInsights/workspaces/savedSearches",
		"apiVersion": "[variables('LogAnalyticsApiVersion')]",
		"dependsOn": [
		],
		"tags": { },
		"properties": {
			"etag": "*",
			"query": "[variables('SavedSearch').Query]",
			"displayName": "[variables('SavedSearch').DisplayName]",
			"category": "[variables('SavedSearch').Category]"
		}
	}

Each property of a saved search is described in the following table.

| Property | Description |
|:--- |:--- |
| category | The category for the saved search.  Any saved searches in the same solution will often share a single category so they are grouped together in the console. |
| displayname | Name to display for the saved search in the portal. |
| query | Query to run. |

> [!NOTE]
> You may need to use escape characters in the query if it includes characters that could be interpreted as JSON. For example, if your query was **AzureActivity | OperationName:"Microsoft.Compute/virtualMachines/write"**, it should be written in the solution file as **AzureActivity | OperationName:/\"Microsoft.Compute/virtualMachines/write\"**.

## Alerts
[Azure Log alerts](../../azure-monitor/platform/alerts-unified-log.md) are created by Azure Alert rules that run specified log queries at regular intervals. If the results of the query match specified criteria, an alert record is created and one or more actions are run using [Action Groups](../../azure-monitor/platform/action-groups.md).

For users that extend alerts to Azure, actions are now controlled in Azure action groups. When a workspace and its alerts are extended to Azure, you can retrieve or add actions by using the [Action Group - Azure Resource Manager Template](../../azure-monitor/platform/action-groups-create-resource-manager-template.md).
Alert rules in legacy management solution are made up of the following three different resources.

- **Saved search.** Defines the log search that is run. Multiple alert rules can share a single saved search.
- **Schedule.** Defines how often the log search is run. Each alert rule has one and only one schedule.
- **Alert action.** Each alert rule has one action group resource or action resource (legacy) with a type of **Alert** that defines the details of the alert such as the criteria for when an alert record is created and the alert's severity. [Action group](../../azure-monitor/platform/action-groups.md) resource can have a list of configured actions to take when alert is fired - such as voice call, SMS, email, webhook, ITSM tool, automation runbook, logic app, etc.

Saved search resources are described above. The other resources are described below.

### Schedule resource

A saved search can have one or more schedules with each schedule representing a separate alert rule. The schedule defines how often the search is run and the time interval over which the data is retrieved. Schedule resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches/schedules/` and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names.

	{
		"name": "[concat(parameters('workspaceName'), '/', variables('SavedSearch').Name, '/', variables('Schedule').Name)]",
		"type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/",
		"apiVersion": "[variables('LogAnalyticsApiVersion')]",
		"dependsOn": [
			"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('SavedSearch').Name)]"
		],
		"properties": {
			"etag": "*",
			"interval": "[variables('Schedule').Interval]",
			"queryTimeSpan": "[variables('Schedule').TimeSpan]",
			"enabled": "[variables('Schedule').Enabled]"
		}
	}
The properties for schedule resources are described in the following table.

| Element name | Required | Description |
|:--|:--|:--|
| enabled       | Yes | Specifies whether the alert is enabled when it's created. |
| interval      | Yes | How often the query runs in minutes. |
| queryTimeSpan | Yes | Length of time in minutes over which to evaluate results. |

The schedule resource should depend on the saved search so that it's created before the schedule.
> [!NOTE]
> Schedule Name must be unique in a given workspace; two schedules cannot have the same ID even if they are associated with different saved searches. Also name for all saved searches, schedules, and actions created with the Log Analytics API must be in lowercase.

### Actions
A schedule can have multiple actions. An action may define one or more processes to perform such as sending a mail or starting a runbook, or it may define a threshold that determines when the results of a search match some criteria. Some actions will define both so that the processes are performed when the threshold is met.
Actions can be defined using [action group] resource or action resource.

There are two types of action resource specified by the **Type** property. A schedule requires one **Alert** action, which defines the details of the alert rule and what actions are taken when an alert is created. Action resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions`.

Alert actions have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names.

```json
{
	"name": "[concat(parameters('workspaceName'), '/', variables('SavedSearch').Name, '/', variables('Schedule').Name, '/', variables('Alert').Name)]",
	"type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions",
	"apiVersion": "[variables('LogAnalyticsApiVersion')]",
	"dependsOn": [
		"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('SavedSearch').Name, '/schedules/', variables('Schedule').Name)]"
	],
	"properties": {
		"etag": "*",
		"type": "Alert",
		"name": "[variables('Alert').Name]",
		"description": "[variables('Alert').Description]",
		"severity": "[variables('Alert').Severity]",
		"threshold": {
			"operator": "[variables('Alert').Threshold.Operator]",
			"value": "[variables('Alert').Threshold.Value]",
			"metricsTrigger": {
				"triggerCondition": "[variables('Alert').Threshold.Trigger.Condition]",
				"operator": "[variables('Alert').Trigger.Operator]",
				"value": "[variables('Alert').Trigger.Value]"
			},
		},
		"AzNsNotification": {
			"GroupIds": "[variables('MyAlert').AzNsNotification.GroupIds]",
			"CustomEmailSubject": "[variables('MyAlert').AzNsNotification.CustomEmailSubject]",
			"CustomWebhookPayload": "[variables('MyAlert').AzNsNotification.CustomWebhookPayload]"
		}
	}
}
```

The properties for Alert action resources are described in the following tables.

| Element name | Required | Description |
|:--|:--|:--|
| `type` | Yes | Type of the action.  This is **Alert** for alert actions. |
| `name` | Yes | Display name for the alert.  This is the name that's displayed in the console for the alert rule. |
| `description` | No | Optional description of the alert. |
| `severity` | Yes | Severity of the alert record from the following values:<br><br> **critical**<br>**warning**<br>**informational**

#### Threshold
This section is required. It defines the properties for the alert threshold.

| Element name | Required | Description |
|:--|:--|:--|
| `Operator` | Yes | Operator for the comparison from the following values:<br><br>**gt = greater than<br>lt = less than** |
| `Value` | Yes | The value to compare the results. |

##### MetricsTrigger
This section is optional. Include it for a metric measurement alert.

| Element name | Required | Description |
|:--|:--|:--|
| `TriggerCondition` | Yes | Specifies whether the threshold is for total number of breaches or consecutive breaches from the following values:<br><br>**Total<br>Consecutive** |
| `Operator` | Yes | Operator for the comparison from the following values:<br><br>**gt = greater than<br>lt = less than** |
| `Value` | Yes | Number of the times the criteria must be met to trigger the alert. |


#### Throttling
This section is optional. Include this section if you want to suppress alerts from the same rule for some amount of time after an alert is created.

| Element name | Required | Description |
|:--|:--|:--|
| DurationInMinutes | Yes if Throttling element included | Number of minutes to suppress alerts after one from the same alert rule is created. |

#### Azure action group
All alerts in Azure, use Action Group as the default mechanism for handling actions. With Action Group, you can specify your actions once and then associate the action group to multiple alerts - across Azure. Without the need, to repeatedly declare the same actions over and over again. Action Groups support multiple actions - including email, SMS, Voice Call, ITSM Connection, Automation Runbook, Webhook URI and more.

For user's who have extended their alerts into Azure - a schedule should now have Action Group details passed along with threshold, to be able to create an alert. E-mail details, Webhook URLs, Runbook Automation details, and other Actions, need to be defined in side an Action Group first before creating an alert; one can create [Action Group from Azure Monitor](../../azure-monitor/platform/action-groups.md) in Portal or use [Action Group - Resource Template](../../azure-monitor/platform/action-groups-create-resource-manager-template.md).

| Element name | Required | Description |
|:--|:--|:--|
| AzNsNotification | Yes | The resource ID of the Azure action group to be associated with alert for taking necessary actions when alert criteria is met. |
| CustomEmailSubject | No | Custom subject line of the mail sent to all addresses specified in associated action group. |
| CustomWebhookPayload | No | Customized payload to be sent to all webhook endpoints defined in associated action group. The format depends on what the webhook is expecting and should be a valid serialized JSON. |

## Sample

Following is a sample of a solution that includes the following resources:

- Saved search
- Schedule
- Action group

The sample uses [standard solution parameters]( solutions-solution-file.md#parameters) variables that would commonly be used in a solution as opposed to hardcoding values in the resource definitions.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0",
    "parameters": {
        "workspaceName": {
            "type": "string",
            "metadata": {
                "Description": "Name of Log Analytics workspace"
            }
        },
        "workspaceregionId": {
            "type": "string",
            "metadata": {
                "Description": "Region of Log Analytics workspace"
            }
        },
        "actiongroup": {
            "type": "string",
            "metadata": {
                "Description": "List of action groups for alert actions separated by semicolon"
            }
        }
    },
    "variables": {
        "SolutionName": "MySolution",
        "SolutionVersion": "1.0",
        "SolutionPublisher": "Contoso",
        "ProductName": "SampleSolution",
        "LogAnalyticsApiVersion-Search": "2017-03-15-preview",
        "LogAnalyticsApiVersion-Solution": "2015-11-01-preview",
        "MySearch": {
            "displayName": "Error records by hour",
            "query": "MyRecord_CL | summarize AggregatedValue = avg(Rating_d) by Instance_s, bin(TimeGenerated, 60m)",
            "category": "Samples",
            "name": "Samples-Count of data"
        },
        "MyAlert": {
            "Name": "[toLower(concat('myalert-',uniqueString(resourceGroup().id, deployment().name)))]",
            "DisplayName": "My alert rule",
            "Description": "Sample alert. Fires when 3 error records found over hour interval.",
            "Severity": "critical",
            "ThresholdOperator": "gt",
            "ThresholdValue": 3,
            "Schedule": {
                "Name": "[toLower(concat('myschedule-',uniqueString(resourceGroup().id, deployment().name)))]",
                "Interval": 15,
                "TimeSpan": 60
            },
            "MetricsTrigger": {
                "TriggerCondition": "Consecutive",
                "Operator": "gt",
                "Value": 3
            },
            "ThrottleMinutes": 60,
            "AzNsNotification": {
                "GroupIds": [
                    "[parameters('actiongroup')]"
                ],
                "CustomEmailSubject": "Sample alert"
            }
        }
    },
    "resources": [
        {
            "name": "[concat(variables('SolutionName'), '[' ,parameters('workspacename'), ']')]",
            "location": "[parameters('workspaceRegionId')]",
            "tags": { },
            "type": "Microsoft.OperationsManagement/solutions",
            "apiVersion": "[variables('LogAnalyticsApiVersion-Solution')]",
            "dependsOn": [
                "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches', parameters('workspacename'), variables('MySearch').Name)]",
                "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name)]",
                "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Name)]"
            ],
            "properties": {
                "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspacename'))]",
                "referencedResources": [
                ],
                "containedResources": [
                    "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches', parameters('workspacename'), variables('MySearch').Name)]",
                    "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name)]",
                    "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Name)]"
                ]
            },
            "plan": {
                "name": "[concat(variables('SolutionName'), '[' ,parameters('workspaceName'), ']')]",
                "Version": "[variables('SolutionVersion')]",
                "product": "[variables('ProductName')]",
                "publisher": "[variables('SolutionPublisher')]",
                "promotionCode": ""
            }
        },
        {
            "name": "[concat(parameters('workspaceName'), '/', variables('MySearch').Name)]",
            "type": "Microsoft.OperationalInsights/workspaces/savedSearches",
            "apiVersion": "[variables('LogAnalyticsApiVersion-Search')]",
            "dependsOn": [ ],
            "tags": { },
            "properties": {
                "etag": "*",
                "query": "[variables('MySearch').query]",
                "displayName": "[variables('MySearch').displayName]",
                "category": "[variables('MySearch').category]"
            }
        },
        {
            "name": "[concat(parameters('workspaceName'), '/', variables('MySearch').Name, '/', variables('MyAlert').Schedule.Name)]",
            "type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/",
            "apiVersion": "[variables('LogAnalyticsApiVersion-Search')]",
            "dependsOn": [
                "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('MySearch').Name)]"
            ],
            "properties": {
                "etag": "*",
                "interval": "[variables('MyAlert').Schedule.Interval]",
                "queryTimeSpan": "[variables('MyAlert').Schedule.TimeSpan]",
                "enabled": true
            }
        },
        {
            "name": "[concat(parameters('workspaceName'), '/', variables('MySearch').Name, '/', variables('MyAlert').Schedule.Name, '/', variables('MyAlert').Name)]",
            "type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions",
            "apiVersion": "[variables('LogAnalyticsApiVersion-Search')]",
            "dependsOn": [
                "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('MySearch').Name, '/schedules/', variables('MyAlert').Schedule.Name)]"
            ],
            "properties": {
                "etag": "*",
                "Type": "Alert",
                "Name": "[variables('MyAlert').DisplayName]",
                "Description": "[variables('MyAlert').Description]",
                "Severity": "[variables('MyAlert').Severity]",
                "Threshold": {
                    "Operator": "[variables('MyAlert').ThresholdOperator]",
                    "Value": "[variables('MyAlert').ThresholdValue]",
                    "MetricsTrigger": {
                        "TriggerCondition": "[variables('MyAlert').MetricsTrigger.TriggerCondition]",
                        "Operator": "[variables('MyAlert').MetricsTrigger.Operator]",
                        "Value": "[variables('MyAlert').MetricsTrigger.Value]"
                    }
                },
                "Throttling": {
                    "DurationInMinutes": "[variables('MyAlert').ThrottleMinutes]"
                },
                "AzNsNotification": {
                    "GroupIds": "[variables('MyAlert').AzNsNotification.GroupIds]",
                    "CustomEmailSubject": "[variables('MyAlert').AzNsNotification.CustomEmailSubject]"
                }
            }
        }
    ]
}
```

The following parameter file provides samples values for this solution.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"workspacename": {
			"value": "myWorkspace"
		},
		"accountName": {
			"value": "myAccount"
		},
		"workspaceregionId": {
			"value": "East US"
		},
		"regionId": {
			"value": "East US 2"
		},
		"pricingTier": {
			"value": "Free"
		},
		"actiongroup": {
			"value": "/subscriptions/3b540246-808d-4331-99aa-917b808a9166/resourcegroups/myTestGroup/providers/microsoft.insights/actiongroups/sample"
		}
	}
}
```

## Next steps
* [Add views](solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](solutions-resources-automation.md) to your management solution.
