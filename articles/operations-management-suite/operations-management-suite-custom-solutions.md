<properties
   pageTitle="Custom solutions in Operations Management Suite (OMS) | Microsoft Azure"
   description="Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how you can create custom solutions to be used in your own environment or made available to your customers."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/23/2016"
   ms.author="bwren" />

# Custom solutions in Operations Management Suite (OMS) (Preview)

>[AZURE.NOTE]This is preliminary documentation for custom solutions in OMS which are currently in preview. The schema described below is subject to change.    

Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  You can create custom solutions to be used in your own environment or made available to customers through the community.

## Planning your custom solution
Solutions in OMS include multiple resources supporting a particular management scenario.  When planning your solution, you should focus on the management scenario that you're trying to achieve and all required resources to support it.  

Each solution should be self contained and define each resource that it requires, even if one or more resources are also defined by other solutions.  When a solution is installed, each resource is created unless it already exists, and you can define what happens to resources when a solution is removed.  

For example, a solution might include an [Azure Automation runbook](../automation/automation-intro.md) that collects data to the Log Analytics repository using a [schedule](../automation/automation-schedules.md) and a [custom view](../log-analytics/log-analytics-view-designer.md) that provides various visualizations of the collected data.  The same schedule might be used by another solution.  As the solution author, you would define all three resources but specify that the runbook and view should be automatically removed when the solution is removed.    You would also define the schedule but specify that it should remain in place if the solution were removed in case it was still in use by the other solution.


## Creating a new custom solution
Custom solutions in OMS are implemented as [Resource Management templates](../resource-manager-template-walkthrough.md).  The main task in learning how to author custom solutions is learning how to [author a template](../resource-group-authoring-templates.md).  This section and the sections that follow provide unique details of templates used for custom solutions and how to define typical solution resources.

The basic structure of a Resource Manager Template is as follows.  Each of the following sections describes the top level elements and and their contents in a custom solution.  

    {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "",
       "parameters": {  },
       "variables": {  },
       "resources": [  ],
       "outputs": {  }
    }

### Parameters

The **parameters** element defines values that you require from the user when they install the solution.  The standard set of parameters below is required for every solution.  You can add other parameters as required for your particular solution.    


	"parameters": {
		"workspaceName": {
			"type": "string",
			"metadata": {
				"description": "A valid Log Analytics workspace name"
			}
		},
        "accountName": {
           	"type": "string",
           	"metadata": {
           	    "description": "A valid Azure Automation account name"
           	}
        },
        "workspaceRegionId": {
           	"type": "string",
           	"metadata": {
           	    "description": "Region of the Log Analytics workspace"
			}
		},
		"regionId": {
			"type": "string",
			"metadata": {
				"description": "Region of the Azure Automation account"
			}
		},
		"pricingTier": {
			"type": "string",
			"metadata": {
				"description": "Pricing tier of both Log Analytics workspace and Azure Automation account"
			}
		},
	}




You refer to parameter values in other elements of the solution with the syntax **parameters('parameter name')**.  For example, to access the workspace name, you would use **parameters('WorkspaceName')** 

### Variables

The **Variables** element includes values that you will use in other elements.  These values are not exposed to the user installing the solution.  They are intended to provide the author with a single location where they can manage values that may be used multiple times throughout the solution. 

Following is an example of a **variables** element with typical parameters used in solutions.

	"variables": { 
		"SolutionVersion": "1.1", 
		"SolutionPublisher": "Contoso", 
		"SolutionName": "My Solution",
		"LogAnalyticsApiVersion": ""
	},

You refer to variable values through the solution with the syntax **variables('variable name')**.  For example, to access the SolutionName variable, you would use **variables('SolutionName')** 


### Resources

The **resources** element defines the different resources included in your solution.  This will be the largest and most complex portion of the template.

Resources are defined with the following structure.  All types of resources will have the same structure, but the values defined in the **properties** element will be different for different types.

	"resources": [
		{
			"name": "<name-of-the-resource>",			
			"apiVersion": "<api-version-of-resource>",
			"type": "<resource-provider-namespace/resource-type-name>",		
			"location": "<location-of-resource>",
			"tags": "<name-value-pairs-for-resource-tagging>",
			"comments": "<your-reference-notes>",
			"dependsOn": [
				"<array-of-related-resource-names>"
			],
			"properties": "<settings-for-the-resource>",
			"resources": [
				"<array-of-child-resources>"
			]
		}
	]

You can get the details and samples of resources that are common to solutions in **Common resources in OMS solutions (Coming soon)**.

#### Solution resource
Each solution requires a resource entry in the **resources** element that defines the solution itself.  This will have a type of **Microsoft.OperationsManagement/solutions** and have the following structure.

      "name": "[concat(variables('SolutionName'), '(' ,parameters('workspaceName'), ')')]",
      "location": "[parameters('workspaceRegionId')]",
      "tags": { },
      "type": "Microsoft.OperationsManagement/solutions",
      "apiVersion": "[variables('LogAnalyticsApiVersion')]",

The solution resource should have a [dependency](../resource-group-define-dependencies.md) on every other resource in the solution.  That ensures that all resources are created before the solution is created.  You do this by adding an entry for each resource in the **dependsOn** element.

For example, a solution with a runbook, a schedule, and view would have a **dependsOn** element like the following.

	"dependsOn": [
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('MyRunbookName'))]",
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/schedules/', variables('StartRunbookScheduleName'))]",
		"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/views/', variables('MyViewName'))]"
	]

The solution resource has the properties in the following table.  This includes the resources referenced and contained by the solution which defines how the resource is managed after the solution is installed.  Each resource in the solution should be listed in either the **referencedResources** or the **containedResources** property.

| Property | Description |
|:--|:--|
| workspaceResourceId | ID of the OMS workspace in the form *<Resource Group ID>/providers/Microsoft.OperationalInsights/workspaces/<Workspace Name>*. |
| referencedResources   | List of resources in the solution that should not be removed when the solution is removed. |
| containedResources   | List of resources in the solution that should be removed when the solution is removed. |

For example, a solution with a runbook, a schedule, and view would have a **properties** element like the following.  The schedule and runbook are *referenced* so they are not removed when the solution is removed.  The view is *contained* so it is removed when the solution is removed.

      "properties": {
        "workspaceResourceId": "[concat(resourceGroup().id, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspacename'))]",
        "referencedResources": [
          "[concat(resourceGroup().id, '/providers/Microsoft.Automation/automationAccounts/', parameters('accountName'), '/schedules/', variables('StartRunbookScheduleName'))]",
          "[concat(resourceGroup().id, '/providers/Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('MyRunbookName'))]"
        ],
        "containedResources": [
          "[concat(resourceGroup().id, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspacename'), '/views/', variables('MyViewName'))]"
        ]
      },

## Testing a custom solution
Prior to deploying your custom solution, it is recommended that you test it using [Test-AzureRmResourceGroupDeployment](../resource-group-template-deploy.md#deploy-with-powershell).  This will validate your solution file and help you identify any problems before attempting to deploy it.


## Deploying a custom solution
Since custom solutions are implemented as Resource Manager templates in Azure, they cannot be deployed from the OMS console.  Resources in the solution such as views will be available in the OMS console after the solution has been added to the workspace.  

There are three methods for deploying a custom solution.

- Since a custom solution is implemented as a Resource Manager template, you can use any of the standard methods for [deploying a template](../resource-group-template-deploy-portal.md).
- Submit your solution to [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) to make it available to the community.  The QuickStart templates are stored in a [GitHub](http://github.com) repository, and you can get instructions  from the [Azure Resource Manager QuickStart Templates Contribution Guide](https://github.com/Azure/azure-quickstart-templates/tree/master/1-CONTRIBUTION-GUIDE).
- If you are already a trusted partner with Microsoft, then you may be able to submit your solution to the [Azure Marketplace](http://azure.microsoft.com/marketplace/).


## Next steps

- Learn the details of [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).
- Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
- View the details for common resources used in OMS solutions (Coming soon).
 