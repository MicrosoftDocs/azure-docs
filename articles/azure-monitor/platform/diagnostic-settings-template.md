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
[Diagnostic settings](diagnostic-settings.md) in Azure Monitor specify where to send [Platform logs](platform-logs-overview.md) that are collected by Azure resources and the Azure platform they depend on. This article provides details and examples for using an [Azure Resource Manager template](../../azure-resource-manager/resource-group-authoring-templates.md) to create and configure diagnostic settings to collect platform logs to different destinations. 

You can deploy these templates with a variety of methods including PowerShell and CLI. See [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md) and 
[Deploy resources with Resource Manager templates and Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md) for details.

> [!NOTE]
> Since you can't [create a diagnostic setting](diagnostic-settings.md) for the Azure Activity log using PowerShell or CLI like diagnostic settings for other Azure resources, create a Resource Manager template for the Activity log using the information in this article and deploy the template using PowerShell or CLI.


## Template structure
Resource Manager templates have two sections, parameters and resources. Parameters are values that you define when you deploy the template. Resources use values provided by parameters and provides the definition of the resources being configured.

### Parameters
Following are parameter definitions for each of the possible [destinations](diagnostic-settings.md#destinations) for a diagnostic setting. You can remove parameters for destinations that your diagnostic setting doesn't use.
   
```json
"settingName": {
  "type": "string",
  "metadata": {
    "description": "Name for the diagnostic setting resource. Eg. 'archiveToStorage' or 'forSecurityTeam'."
  }
},
"storageAccountName": {
  "type": "string",
  "metadata": {
    "description": "Name of the Storage Account in which platform logs should be saved."
  }
},
"resourceName": {
  "type": "string",
  "metadata": {
    "description": "Name of the resource you are creating the diagnostic setting for."
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
},
"workspaceId":{
  "type": "string",
  "metadata": {
    "description": "Azure Resource ID of the Log Analytics workspace to which logs will be sent."
  }
}
```

### Resources
In the resources array of the resource for which you want to create the diagnostic setting, add a resource of type `[resource namespace]/providers/diagnosticSettings`. The properties section follows the format described in [Diagnostic Settings - Create Or Update](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings/createorupdate). Provide a `category` in the `logs` section for each of the categories valid for the resource that you want to collect. Add the `metrics` property to collect resource metrics to the same destinations if the [resource supports metrics](metrics-supported.md). An example is shown below.

```json
"resources": [
  {
    "type": "[concat(parameters('resourceName'),'/diagnosticSettings')]",
    "name": "[concat(parameters('resourceName'),'/microsoft.insights/', parameters('settingName'))]",
    "dependsOn": [
      "[/*resource Id for which resource logs will be enabled>*/]"
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
          "category": "/* category name */",
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
### Activity log
For the Azure Activity log, add a resource of type `Microsoft.Insights/diagnosticSettings"` using the same format as other resources. The available categories are listed in [Categories in the Activity Log](activity-log-view.md#categories-in-the-activity-log).


```json
"resources": [
  {
    "type": "Microsoft.Insights/diagnosticSettings",
    "name": "[parameters('settingName')]",
    "apiVersion": "2017-05-01-preview",
    "location": "global",
    "properties": {
      "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
      "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
      "eventHubName": "[parameters('eventHubName')]",
      "workspaceId": "[parameters('workspaceId')]",
      "logs": [
        {
          "category": "/* category name */",
          "enabled": true
        }
      ]
    }
  }
]
```

## Example - Azure resource
Following is a complete example that creates a Logic App and creates a diagnostic setting that enables streaming of resource logs to an event hub, a storage account, and a Log Analytics workspace.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "logicAppName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Logic App that will be created."
      }
    },
    "testUri": {
      "type": "string",
      "defaultValue": "https://azure.microsoft.com/status/feed/"
    },
    "settingName": {
      "type": "string",
      "metadata": {
        "description": "Name of the setting. Name for the diagnostic setting resource. Eg. 'archiveToStorage' or 'forSecurityTeam'."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Storage Account in which resource logs should be saved."
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
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "Log Analytics workspace ID for the Log Analytics workspace to which logs will be sent."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "microsoft.logic/workflows/providers/diagnosticsettings",
      "name": "[concat(parameters('logicAppName'),'/microsoft.insights/', parameters('settingName'))]",
      "apiVersion": "2016-06-01",
      "location": "[resourceGroup().location]",
      "properties": {
        "definition": {
          "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "testURI": {
              "type": "string",
              "defaultValue": "[parameters('testUri')]"
            }
          },
          "triggers": {
            "recurrence": {
              "type": "recurrence",
              "recurrence": {
                "frequency": "Hour",
                "interval": 1
              }
            }
          },
          "actions": {
            "http": {
              "type": "Http",
              "inputs": {
                "method": "GET",
                "uri": "@parameters('testUri')"
              },
              "runAfter": {}
            }
          },
          "outputs": {}
        },
        "parameters": {}
      },
      "resources": [
        {
          "type": "providers/diagnosticSettings",
          "name": "[concat('Microsoft.Insights/', parameters('settingName'))]",
          "dependsOn": [
            "[resourceId('Microsoft.Logic/workflows', parameters('logicAppName'))]"
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
                "category": "WorkflowRuntime",
                "enabled": true
              }
            ],
            "metrics": [
              {
                "timeGrain": "PT1M",
                "enabled": true
              }
            ]
          }
        }
      ],
      "dependsOn": []
    }
  ]
}

```

## Example - Activity log
Following is an example that creates a diagnostic setting that enables streaming of all categories of the Azure Activity log in the current subscription to an event hub, a storage account, and a Log Analytics workspace.

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
				"description": "The resourceID of the Log Analytics workspace"
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
