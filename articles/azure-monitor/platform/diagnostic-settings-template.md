---
title: Create diagnostic setting in Azure using Resource Manager template
description: Create diagnostic settings using a Resource Manager template to forward Azure platform logs to Azure Monitor Logs, Azure storage, or Azure Event Hubs.
author: bwren
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 12/13/2019
ms.author: bwren
ms.subservice: ""
---

# Create diagnostic setting in Azure using a Resource Manager template
[Diagnostic settings](diagnostic-settings.md) in Azure Monitor specify where to send [Platform logs](platform-logs-overview.md) that are collected by Azure resources and the Azure platform they depend on. This article provides details and examples for using an [Azure Resource Manager template](../../azure-resource-manager/templates/template-syntax.md) to create and configure diagnostic settings to collect platform logs to different destinations.

> [!NOTE]
> Since you can't [create a diagnostic setting](diagnostic-settings.md) for the Azure Activity log using PowerShell or CLI like diagnostic settings for other Azure resources, create a Resource Manager template for the Activity log using the information in this article and deploy the template using PowerShell or CLI.

## Deployment methods
You can deploy Resource Manager templates using any valid method including PowerShell and CLI. Diagnostic settings for Activity log must deploy to a subscription using `az deployment create` for CLI or `New-AzDeployment` for PowerShell. Diagnostic settings for resource logs must deploy to a resource group using `az group deployment create` for CLI or `New-AzResourceGroupDeployment` for PowerShell.

See [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md) and
[Deploy resources with Resource Manager templates and Azure CLI](../../azure-resource-manager/templates/deploy-cli.md) for details. 





## Resource logs
For resource logs, add a resource of type `<resource namespace>/providers/diagnosticSettings` to the template. The properties section follows the format described in [Diagnostic Settings - Create Or Update](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings/createorupdate). Provide a `category` in the `logs` section for each of the categories valid for the resource that you want to collect. Add the `metrics` property to collect resource metrics to the same destinations if the [resource supports metrics](metrics-supported.md).

Following is a template that collects a resource log category for a particular resource to a Log Analytics workspace, storage account, and event hub.

```json
"resources": [
  {
    "type": "/<resource namespace>/providers/diagnosticSettings",
    "name": "[concat(parameters('resourceName'),'/microsoft.insights/', parameters('settingName'))]",
    "dependsOn": [
      "[<resource Id for which resource logs will be enabled>]"
    ],
    "apiVersion": "2017-05-01-preview",
    "properties": {
      "name": "[parameters('settingName')]",
      "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
      "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
      "eventHubName": "[parameters('eventHubName')]",
      "workspaceId": "[parameters('workspaceId')]",
      "logs": [
        {
          "category": "<category name>",
          "enabled": true
        }
      ],
      "metrics": [
        {
          "category": "AllMetrics",
          "enabled": true
        }
      ]
    }
  }
]
```



### Example
Following is an example that creates a diagnostic setting for an autoscale setting that enables streaming of resource logs to an event hub, a storage account, and a Log Analytics workspace.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"autoscaleSettingName": {
			"type": "string",
			"metadata": {
				"description": "The name of the autoscale setting"
			}
    	},
		"settingName": {
			"type": "string",
			"metadata": {
				"description": "The name of the diagnostic setting"
			}
		},
		"workspaceId": {
			"type": "string",
			"metadata": {
				"description": "ResourceIDl of the Log Analytics workspace in which resource logs should be saved."
			}
		},
		"storageAccountId": {
			"type": "string",
			"metadata": {
			  "description": "ResourceID of the Storage Account in which resource logs should be saved."
			}
		},
		"eventHubAuthorizationRuleId": {
			"type": "string",
			"metadata": {
			  "description": "Resource ID of the event hub authorization rule for the Event Hubs namespace in which the event hub should be created or streamed to."
			}
		},
		"eventHubName": {
			"type": "string",
			"metadata": {
				"description": "Optional. Name of the event hub within the namespace to which logs are streamed. Without this, an event hub is created for each log category."
			}
		}
	},
	"variables": {},
	"resources": [
    {
      "type": "microsoft.insights/autoscalesettings/providers/diagnosticSettings",
      "apiVersion": "2017-05-01-preview",
      "name": "[concat(parameters('autoscaleSettingName'),'/microsoft.insights/', parameters('settingName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Insights/autoscalesettings', parameters('autoscaleSettingName'))]"
      ],
      "properties": {
		"workspaceId": "[parameters('workspaceId')]",
		"storageAccountId": "[parameters('storageAccountId')]",
		"eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
		  {
			"category": "AutoscaleScaleActions",
		 	"enabled": true
		  },
		  {
		    "category": "AutoscaleEvaluations",
		    "enabled": true
		  }
        ]
      }
    }
  ]
}
```

## Activity log
For the Azure Activity log, add a resource of type `Microsoft.Insights/diagnosticSettings`. The available categories are listed in [Categories in the Activity Log](activity-log-view.md#categories-in-the-activity-log). Following is a template that collects all Activity log categories to a Log Analytics workspace, storage account, and event hub.


```json
{
	"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"settingName": {
			"type": "string",
			"metadata": {
				"description": "The name of the diagnostic setting"
			}
		},
		"workspaceId": {
			"type": "string",
			"metadata": {
				"description": "ResourceID of the Log Analytics workspace in which resource logs should be saved."
			}
		},
		"storageAccountId": {
			"type": "string",
			"metadata": {
			  "description": "ResourceID of the Storage Account in which resource logs should be saved."
			}
		},
		"eventHubAuthorizationRuleId": {
			"type": "string",
			"metadata": {
			  "description": "Resource ID of the event hub authorization rule for the Event Hubs namespace in which the event hub should be created or streamed to."
			}
		},
		"eventHubName": {
			"type": "string",
			"metadata": {
				"description": "Optional. Name of the event hub within the namespace to which logs are streamed. Without this, an event hub is created for each log category."
			}
		}
	},
	"variables": {},
	"resources": [
		{
			"type": "Microsoft.Insights/diagnosticSettings",
			"apiVersion": "2017-05-01-preview",
			"name": "[parameters('settingName')]",
			"location": "global",
			"properties": {
				"workspaceId": "[parameters('workspaceId')]",
				"storageAccountId": "[parameters('storageAccountId')]",
				"eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
				"eventHubName": "[parameters('eventHubName')]",
				"logs": [
					{
						"category": "Administrative",
						"enabled": true
					},
					{
						"category": "Security",
						"enabled": true
					},
					{
						"category": "ServiceHealth",
						"enabled": true
					},
					{
						"category": "Alert",
						"enabled": true
					},
					{
						"category": "Recommendation",
						"enabled": true
					},
					{
						"category": "Policy",
						"enabled": true
					},
					{
						"category": "Autoscale",
						"enabled": true
					},
					{
						"category": "ResourceHealth",
						"enabled": true
					}
				]
			}
		}
	]
}
```


## Next steps
* Read more about [platform logs in Azure](platform-logs-overview.md).
* Learn about [diagnostic settings](diagnostic-settings.md).
