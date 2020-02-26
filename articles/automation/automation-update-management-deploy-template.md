---
title: Use Azure Resource Manager templates to onboard Update Management | Microsoft Docs
description: You can use an Azure Resource Manager template to onboard the Azure Automation Update Management solution.
ms.service:  automation
ms.subservice: update-management
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 02/26/2020

---

# Onboard Update Management solution using Azure Resource Manager template

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can use [Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md) to enable the Azure Automation Update Management solution in your resource group. This article provides a template sample that automates the following:

* Creation of a Azure Monitor Log Analytics workspace
* Creation of an Azure Automation account
* Links the Automation account to the Log Analytics workspace
* Onboards the Azure Automation Update Management solution

## API versions

The following table lists the API version for the resources used in this example.

| Resource | Resource type | API version |
|:---|:---|:---|
| Workspace | workspaces | 2017-03-15-preview |
| Automation account | 2015-10-31 | 
| Solution | solutions | 2015-11-01-preview |

## Create and deploy template

1. Copy and paste the following JSON syntax into your file:

    ```json
    {
	  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
		"workspaceName": {
			"type": "string",
			"metadata": {
				"description": "Workspace name"
			}
		},
		"pricingTier": {
			"type": "string",
			"allowedValues": [
				"PerGB2018",
				"Free",
				"Standalone",
				"PerNode",
				"Standard",
				"Premium"
			],
			"defaultValue": "pergb2018",
			"metadata": {
				"description": "Pricing tier: perGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers."
			}
		},
		"dataRetention": {
			"type": "int",
			"defaultValue": 30,
			"minValue": 7,
			"maxValue": 730,
			"metadata": {
				"description": "Number of days of retention. Workspaces in the legacy Free pricing tier can only have 7 days."
		}
	  },
	  "immediatePurgeDataOn30Days": {
		"type": "bool",
		"defaultValue": "[bool('false')]",
		"metadata": {
			"description": "If set to true when changing retention to 30 days, older data will be immediately deleted. Use this with extreme caution. This only applies when retention is being set to 30 days."
		}
	  },
	  "location": {
		"type": "string",
		"allowedValues": [
			"australiacentral",
			"australiaeast",
			"australiasoutheast",
			"brazilsouth",
			"canadacentral",
			"centralindia",
			"centralus",
			"eastasia",
			"eastus",
			"eastus2",
			"francecentral",
			"japaneast",
			"koreacentral",
			"northcentralus",
			"northeurope",
			"southafricanorth",
			"southcentralus",
			"southeastasia",
			"uksouth",
			"ukwest",
			"westcentralus",
			"westeurope",
			"westus",
			"westus2"
		],
		"metadata": {
			"description": "Specifies the location in which to create the workspace."
		 }
		},
		"automationAccountName": {
		  "defaultValue": "",
		  "type": "string",
		  "metadata": {
			"description": "Automation Account name"
			}
		}
	},
	"variables": {
		"Updates": {
			"Name": "[Concat('Updates', '(', parameters('workspaceName'), ')')]",
			"GalleryName": "Updates"
		},
	"resources": [{
		"apiVersion": "2017-03-15-preview",
		"type": "Microsoft.OperationalInsights/workspaces",
		"name": "[parameters('workspaceName')]",
		"location": "[parameters('location')]",
		"properties": {
			"retentionInDays": "[parameters('dataRetention')]",
			"features": {
				"immediatePurgeDataOn30Days": "[parameters('immediatePurgeDataOn30Days')]"
			},
			"sku": {
				"name": "[parameters('pricingTier')]"
			}
		},
		"resources": [{
			"apiVersion": "2015-11-01-preview",
			"location": "[parameters('location')]",
			"name": "[variables('Updates').Name]",
			"type": "Microsoft.OperationsManagement/solutions",
			"id": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationsManagement/solutions/', variables('Updates').Name)]",
			"dependsOn": [
					"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
					],
			"properties": {
				"workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
					},
					"plan": {
						"name": "[variables('Updates').Name]",
						"publisher": "Microsoft",
						"product": "[Concat('OMSGallery/', variables('Updates').GalleryName)]",
						"promotionCode": ""
					}
			},
			{
		     "apiVersion": "2015-10-31",
			 "type": "Microsoft.Automation/automationAccounts",
			 "name": "[parameters('automationAccountName')]",
		    "location": "[resourceGroup().location]",
			"properties": {
				"sku": {
					"name": "Basic"
				}
			}
			},
			{
			"apiVersion": "2015-11-01-preview",
			"type": "Microsoft.OperationalInsights/workspaces/linkedServices",
			"name": "[concat(parameters('workspaceName'), '/' , 'Automation')]",
			"location": "[resourceGroup().location]",
			"dependsOn": [
				"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]",
				"[concat('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))]"
			],
			"properties": {
				"resourceId": "[resourceId('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))]"
			}
		}
	   ]
	  }]
	 }
    }
    ```
2. Edit the template to meet your requirements. 

3. Save this file as deployUMSolutiontemplate.json to a local folder.

4. You are ready to deploy this template. You use either PowerShell or the command line. 