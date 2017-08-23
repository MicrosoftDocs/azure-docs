---
title: Saved searches and alerts in OMS solutions | Microsoft Docs
description: Solutions in OMS will typically include saved searches in Log Analytics to analyze data collected by the solution.  They may also define alerts to notify the user or automatically take action in response to a critical issue.  This article describes how to define Log Analytics saved searches and alerts in an ARM template so they can be included in management solutions.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/24/2017
ms.author: bwren

ms.custom: H1Hack27Feb2017

---

# Adding Log Analytics saved searches and alerts to OMS management solution (Preview)

> [!NOTE]
> This is preliminary documentation for creating management solutions in OMS which are currently in preview. Any schema described below is subject to change.   


[Management solutions in OMS](operations-management-suite-solutions.md) will typically include 
[saved searches](../log-analytics/log-analytics-log-searches.md) in Log Analytics to analyze data collected by the solution.  They may also define [alerts](../log-analytics/log-analytics-alerts.md) to notify the user or automatically take action in response to a critical issue.  This article describes how to define Log Analytics saved searches and alerts in a [Resource Management template](../resource-manager-template-walkthrough.md) so they can be included in [management solutions](operations-management-suite-solutions-creating.md).

> [!NOTE]
> The samples in this article use parameters and variables that are either required or common to management solutions  and described in [Creating management solutions in Operations Management Suite (OMS)](operations-management-suite-solutions-creating.md)  

## Prerequisites
This article assumes that you're already familiar with how to [create a management solution](operations-management-suite-solutions-creating.md) and the structure of an [ARM template](../resource-group-authoring-templates.md) and solution file.


## Log Analytics Workspace
All resources in Log Analytics are contained in a [workspace](../log-analytics/log-analytics-manage-access.md).  As described in [OMS workspace and Automation account](operations-management-suite-solutions.md#oms-workspace-and-automation-account) the workspace isn't included in the management solution but must exist before the solution is installed.  If it isn't available, then the solution install will fail.

The name of the workspace is in the name of each Log Analytics resource.  This is done in the solution with the **workspace** parameter as in the following example of a savedsearch resource.

    "name": "[concat(parameters('workspaceName'), '/', variables('SavedSearchId'))]"


## Saved Searches
Include [saved searches](../log-analytics/log-analytics-log-searches.md) in a solution to allow users to query data collected by your solution.  Saved searches will appear under **Favorites** in the OMS portal and **Saved Searches** in the Azure portal .  A saved search is also required for each alert.   

[Log Analytics saved search](../log-analytics/log-analytics-log-searches.md) resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches` and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

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



Each of the properties of a saved search are described in the following table. 

| Property | Description |
|:--- |:--- |
| category | The category for the saved search.  Any saved searches in the same solution will often share a single category so they are grouped together in the console. |
| displayname | Name to display for the saved search in the portal. |
| query | Query to run. |

> [!NOTE]
> You may need to use escape characters in the query if it includes characters that could be interpreted as JSON.  For example, if your query was **Type:AzureActivity OperationName:"Microsoft.Compute/virtualMachines/write"**, it should be written in the solution file as **Type:AzureActivity OperationName:\"Microsoft.Compute/virtualMachines/write\"**.

## Alerts
[Log Analytics alerts](../log-analytics/log-analytics-alerts.md) are created by alert rules that run a saved search on a regular interval.  If the results of the query match specified criteria, an alert record is created and one or more actions are run.  

Alert rules in a management solution are made up of the following three different resources.

- **Saved search.**  Defines the log search that will be run.  Multiple alert rules can share a single saved search.
- **Schedule.**  Defines how often the log search will be run.  Each alert rule will have one and only one schedule.
- **Alert action.**  Each alert rule will have one action resource with a type of **Alert** that defines the details of the alert such as the criteria for when an alert record will be created and the alert's severity.  The action resource will optionally define a mail and runbook response.
- **Webhook action (optional).**  If the alert rule will call a webhook, then it requires an additional action resource with a type of **Webhook**.    

Saved search resources are described above.  The other resources are described below.


### Schedule resource

A saved search can have one or more schedules with each schedule representing a separate alert rule. The schedule defines how often the search is run and the time interval over which the data is retrieved.  Schedule resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches/schedules/` and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 


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


### Actions
There are two types of action resource specified by the **Type** property.  A schedule requires one **Alert** action which defines the details of the alert rule and what actions are taken when an alert is created.  It may also include a **Webhook** action if a webhook should be called from the alert.  

Action resources have a type of `Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions`.  

#### Alert actions

Every schedule will have one **Alert** action.  This defines the details of the alert and optionally notification and remediation actions.  A notification sends an email to one or more addresses.  A remediation starts a runbook in Azure Automation to attempt to remediate the detected issue.

Alert actions have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 



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
			"emailNotification": {
				"recipients": [
					"[variables('Alert').Recipients]"
				],
				"subject": "[variables('Alert').Subject]"
			},
			"remediation": {
				"runbookName": "[variables('Alert').Remedition.RunbookName]",
				"webhookUri": "[variables('Alert').Remedition.WebhookUri]"
			}
		}
	}

The properties for Alert action resources are described in the following tables.

| Element name | Required | Description |
|:--|:--|:--|
| Type | Yes | Type of the action.  This will be **Alert** for alert actions. |
| Name | Yes | Display name for the alert.  This is the name that's displayed in the console for the alert rule. |
| Description | No | Optional description of the alert. |
| Severity | Yes | Severity of the alert record from the following values:<br><br> **Critical**<br>**Warning**<br>**Informational** |


##### Threshold
This section is required.  It defines the properties for the alert threshold.

| Element name | Required | Description |
|:--|:--|:--|
| Operator | Yes | Operator for the comparison from the following values:<br><br>**gt = greater than<br>lt = less than** |
| Value | Yes | The value to compare the results. |


##### MetricsTrigger
This section is optional.  Include it for a metric measurement alert.

> [!NOTE]
> Metric measurement alerts are currently in public preview. 

| Element name | Required | Description |
|:--|:--|:--|
| TriggerCondition | Yes | Specifies whether the threshold is for total number of breaches or consecutive breaches from the following values:<br><br>**Total<br>Consecutive** |
| Operator | Yes | Operator for the comparison from the following values:<br><br>**gt = greater than<br>lt = less than** |
| Value | Yes | Number of the times the criteria must be met to trigger the alert. |

##### Throttling
This section is optional.  Include this section if you want to suppress alerts from the same rule for some amount of time after an alert is created.

| Element name | Required | Description |
|:--|:--|:--|
| DurationInMinutes | Yes if Throttling element included | Number of minutes to suppress alerts after one from the same alert rule is created. |

##### EmailNotification
 This section is optional  Include it if you want the alert to send mail to one or more recipients.

| Element name | Required | Description |
|:--|:--|:--|
| Recipients | Yes | Comma delimited list of email addresses to send notification when an alert is created such as in the following example.<br><br>**[ "recipient1@contoso.com", "recipient2@contoso.com" ]** |
| Subject | Yes | Subject line of the mail. |
| Attachment | No | Attachments are not currently supported.  If this element is included, it should be **None**. |


##### Remediation
This section is optional  Include it if you want a runbook to start in response to the alert. |

| Element name | Required | Description |
|:--|:--|:--|
| RunbookName | Yes | Name of the runbook to start. |
| WebhookUri | Yes | Uri of the webhook for the runbook. |
| Expiry | No | Date and time that the remediation expires. |

#### Webhook actions

Webhook actions start a process by calling a URL and optionally providing a payload to be sent. They are similar to Remediation actions except they are meant for webhooks that may invoke processes other than Azure Automation runbooks. They also provide the additional option of providing a payload to be delivered to the remote process.

If your alert will call a webhook, then it will need an action resource with a type of **Webhook** in addition to the **Alert** action resource.  

    {
      "name": "name": "[concat(parameters('workspaceName'), '/', variables('SavedSearch').Name, '/', variables('Schedule').Name, '/', variables('Webhook').Name)]",
      "type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions/",
      "apiVersion": "[variables('LogAnalyticsApiVersion')]",
      "dependsOn": [
			"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('SavedSearch').Name, '/schedules/', variables('Schedule').Name)]"
      ],
      "properties": {
        "etag": "*",
        "type": "[variables('Alert').Webhook.Type]",
        "name": "[variables('Alert').Webhook.Name]",
        "webhookUri": "[variables('Alert').Webhook.webhookUri]",
        "customPayload": "[variables('Alert').Webhook.CustomPayLoad]"
      }
    }

The properties for Webhook action resources are described in the following tables.

| Element name | Required | Description |
|:--|:--|:--|
| type | Yes | Type of the action.  This will be **Webhook** for webhook actions. |
| name | Yes | Display name for the action.  This is not displayed in the console. |
| wehookUri | Yes | Uri for the webhook. |
| customPayload | No | Custom payload to be sent to the webhook. The format will depend on what the webhook is expecting. |




## Sample

Following is a sample of a solution that include that includes the following resources:

- Saved search
- Schedule
- Alert action
- Webhook action

The sample uses [standard solution parameters](operations-management-suite-solutions-solution-file.md#parameters) variables that would commonly be used in a solution as opposed to hardcoding values in the resource definitions.

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
	      "accountName": {
	        "type": "string",
	        "metadata": {
	          "Description": "Name of Automation account"
	        }
	      },
	      "workspaceregionId": {
	        "type": "string",
	        "metadata": {
	          "Description": "Region of Log Analytics workspace"
	        }
	      },
	      "regionId": {
	        "type": "string",
	        "metadata": {
	          "Description": "Region of Automation account"
	        }
	      },
	      "pricingTier": {
	        "type": "string",
	        "metadata": {
	          "Description": "Pricing tier of both Log Analytics workspace and Azure Automation account"
	        }
	      },
	      "recipients": {
	        "type": "string",
	        "metadata": {
	          "Description": "List of recipients for the email alert separated by semicolon"
	        }
	      }
	    },
	    "variables": {
	      "SolutionName": "MySolution",
	      "SolutionVersion": "1.0",
	      "SolutionPublisher": "Contoso",
	      "ProductName": "SampleSolution",
	
	      "LogAnalyticsApiVersion": "2015-11-01-preview",
	
	      "MySearch": {
	        "displayName": "Error records by hour",
	        "query": "Type=MyRecord_CL | measure avg(Rating_d) by Instance_s interval 60minutes",
	        "category": "Samples",
	        "name": "Samples-Count of data"
	      },
	      "MyAlert": {
	        "Name": "[toLower(concat('myalert-',uniqueString(resourceGroup().id, deployment().name)))]",
	        "DisplayName": "My alert rule",
	        "Description": "Sample alert.  Fires when 3 error records found over hour interval.",
	        "Severity": "Critical",
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
	        "Notification": {
	          "Recipients": [
	            "[parameters('recipients')]"
	          ],
	          "Subject": "Sample alert"
	        },
	        "Remediation": {
	          "RunbookName": "MyRemediationRunbook",
	          "WebhookUri": "https://s1events.azure-automation.net/webhooks?token=TluBFH3GpX4IEAnFoImoAWLTULkjD%2bTS0yscyrr7ogw%3d"
	        },
	        "Webhook": {
	          "Name": "MyWebhook",
	          "Uri": "https://MyService.com/webhook",
	          "Payload": "{\"field1\":\"value1\",\"field2\":\"value2\"}"
	        }
	      }
	    },
	    "resources": [
	      {
	        "name": "[concat(variables('SolutionName'), '[' ,parameters('workspacename'), ']')]",
	        "location": "[parameters('workspaceRegionId')]",
	        "tags": { },
	        "type": "Microsoft.OperationsManagement/solutions",
	        "apiVersion": "[variables('LogAnalyticsApiVersion')]",
	        "dependsOn": [
	          "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches', parameters('workspacename'), variables('MySearch').Name)]",
	          "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name)]",
	          "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Name)]",
	          "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Webhook.Name)]"
	        ],
	        "properties": {
	          "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspacename'))]",
	          "referencedResources": [
	          ],
	          "containedResources": [
	            "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches', parameters('workspacename'), variables('MySearch').Name)]",
	            "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name)]",
	            "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Name)]",
	            "[resourceId('Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions', parameters('workspacename'), variables('MySearch').Name, variables('MyAlert').Schedule.Name, variables('MyAlert').Webhook.Name)]"
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
	        "apiVersion": "[variables('LogAnalyticsApiVersion')]",
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
	        "apiVersion": "[variables('LogAnalyticsApiVersion')]",
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
	        "name": "[concat(parameters('workspaceName'), '/', variables('MySearch').Name, '/',  variables('MyAlert').Schedule.Name, '/',  variables('MyAlert').Name)]",
	        "type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions",
	        "apiVersion": "[variables('LogAnalyticsApiVersion')]",
	        "dependsOn": [
	          "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/',  variables('MySearch').Name, '/schedules/', variables('MyAlert').Schedule.Name)]"
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
	          "EmailNotification": {
	            "Recipients": "[variables('MyAlert').Notification.Recipients]",
	            "Subject": "[variables('MyAlert').Notification.Subject]",
	            "Attachment": "None"
	          },
	          "Remediation": {
	            "RunbookName": "[variables('MyAlert').Remediation.RunbookName]",
	            "WebhookUri": "[variables('MyAlert').Remediation.WebhookUri]"
	          }
	        }
	      },
	      {
	        "name": "[concat(parameters('workspaceName'), '/', variables('MySearch').Name, '/', variables('MyAlert').Schedule.Name, '/', variables('MyAlert').Webhook.Name)]",
	        "type": "Microsoft.OperationalInsights/workspaces/savedSearches/schedules/actions",
	        "apiVersion": "[variables('LogAnalyticsApiVersion')]",
	        "dependsOn": [
	          "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('MySearch').Name, '/schedules/', variables('MyAlert').Schedule.Name)]",
	          "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/savedSearches/', variables('MySearch').Name, '/schedules/', variables('MyAlert').Schedule.Name, '/actions/',variables('MyAlert').Name)]"
	        ],
	        "properties": {
	          "etag": "*",
	          "Type": "Webhook",
	          "Name": "[variables('MyAlert').Webhook.Name]",
	          "WebhookUri": "[variables('MyAlert').Webhook.Uri]",
	          "CustomPayload": "[variables('MyAlert').Webhook.Payload]"
	        }
	      }
	    ]
	}


The following parameter file provides samples values for this solution.

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
			"recipients": {
				"value": "recipient1@contoso.com;recipient2@contoso.com"
			}
		}
	}


## Next steps
* [Add views](operations-management-suite-solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](operations-management-suite-solutions-resources-automation.md) to your management solution.

