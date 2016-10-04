<properties
   pageTitle="Creating custom solutions in Operations Management Suite (OMS) | Microsoft Azure"
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
   ms.date="10/03/2016"
   ms.author="bwren" />

# Creating custom solutions in Operations Management Suite (OMS) (Preview)

>[AZURE.NOTE]This is preliminary documentation for custom solutions in OMS which are currently in preview. Any schema described below is subject to change.  

Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on creating your own custom solutions that you can use in your own environment or make available to customers through the community.

## Planning your custom solution
Solutions in OMS include multiple resources supporting a particular management scenario.  When planning your solution, you should focus on the management scenario that you're trying to achieve and all required resources to support it.  Each solution should be self contained and define each resource that it requires, even if one or more resources are also defined by other solutions.  When a solution is installed, each resource is created unless it already exists, and you can define what happens to resources when a solution is removed.  

For example, a solution might include an [Azure Automation runbook](../automation/automation-intro.md) that collects data to the Log Analytics repository using a [schedule](../automation/automation-schedules.md) and a [custom view](../log-analytics/log-analytics-view-designer.md) that provides various visualizations of the collected data.  The same schedule might be used by another solution.  As the solution author, you would define all three resources but specify that the runbook and view should be automatically removed when the solution is removed.    You would also define the schedule but specify that it should remain in place if the solution were removed in case it was still in use by the other solution.

## Custom solution files
Custom solutions in Operations Management Suite (OMS) are implemented as [Resource Management templates](../resource-manager-template-walkthrough.md).  The main task in learning how to author custom solutions is learning how to [author a template](../resource-group-authoring-templates.md).  This article provides unique details of templates used for custom solutions and how to define typical solution resources.

The basic structure of a solution file is the same as a [Resource Manager Template](resource-group-authoring-templates.md#template-format) which is as follows.  Each of the following sections describes the top level elements and and their contents in a custom solution.  

    {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "",
       "parameters": {  },
       "variables": {  },
       "resources": [  ],
       "outputs": {  }
    }

## Parameters

[Parameters](../resource-group-authoring-templates.md#parameters) are values that you require from the user when they install the solution.  There are standard parameters that all solutions will have, and you can add additional parameters as required for your particular solution.  How users will provide parameter values when they install your solution will depend on the particular parameter and how the solution is being installed.

When a user installs your solution through the Azure Marketplace:

- The user is prompted to select an [OMS workspace and Automation account](operations-management-suite-custom-solutions.md#oms-workspace-and-automation-account).  These are used to define the values of each of the required parameters.  The user is not prompted to directly provide values for the required parameters.
- GUIDs are automatically generated for GUID parameters.  The user is not prompted for any GUID parameters.
- The user is prompted to provide values for any additional parameters.

When the user installs your solution from [Azure QuickStart templates](https://azure.microsoft.com/documentation/templates/) or another method:

- The user must provide a value for all required parameters.
- The user must generate a GUID and provide this value for all GUID parameters.
- The user must provide a value for all additional parameters.

### Required parameters
The following table lists the required parameters for all solutions.  These values are populated for the user when they install your solution from the Azure Marketplace.  The user must provide values for them if the solution is installed with another method.

| Parameter | Type | Description |
|:--|:--|:--|
| workspaceName     | string | Log Analytics workspace name. |
| accountName       | string |  Azure Automation account name. |
| workspaceRegionId | string | Region of the Log Analytics workspace. |
| regionId          | string | Region of the Azure Automation account. |
| pricingTier       | string | Pricing tier of both Log Analytics workspace and Azure Automation account. |


### GUID parameters
GUID parameters are required for [job resources](operations-management-suite-custom-solutions-resources-automation.md#automation-jobs). These parameters should have a type of **string** but have a **control** value of **guid** in their **metadata**.  GUIDs are automatically generated for these parameters when the user installs your solution from the Azure Marketplace.  The user must generate GUIDs and provide these values for each GUID parameter if the solution is installed with another method.

	"GuidParameter": {
		"type": "string",
		"metadata": {
			"description": "Sample GUID parameter",
			"control": "guid"
		}
	}


### Sample
Following is a sample parameter entity for a solution.  This includes all of the required parameters and a 

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
		"JobIDGuid": {
		"type": "string",
			"metadata": {
				"description": "GUID for a runbook job",
				"control": "guid"
			}
		},
		"AdditionalParameter": {
			"type": "string",
			"metadata": {
				"description": "Additional parameter for solution."
			}
		}
	}


You refer to parameter values in other elements of the solution with the syntax **parameters('parameter name')**.  For example, to access the workspace name, you would use **parameters('workspaceName')** 

## Variables

The **Variables** element includes values that you will use in the rest of the solution.  These values are not exposed to the user installing the solution.  They are intended to provide the author with a single location where they can manage values that may be used multiple times throughout the solution. You should put any values specific to your solution in variables as opposed to hardcoding them in the **resources** element.  This makes your solution more readable and allows you to easily change these values in later versions.

Following is an example of a **variables** element with typical parameters used in solutions.

	"variables": { 
		"SolutionVersion": "1.1", 
		"SolutionPublisher": "Contoso", 
		"SolutionName": "My Solution",
		
		"LogAnalyticsApiVersion": "2015-11-01-preview",
		"AutomationApiVersion": "2015-10-31"
	},

You refer to variable values through the solution with the syntax **variables('variable name')**.  For example, to access the SolutionName variable, you would use **variables('solutionName')** 


## Resources

The **resources** element defines the different resources included in your solution.  This will be the largest and most complex portion of the template.  Resources are defined with the following structure.  

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
			"properties": "<unique-settings-for-the-resource>",
			"resources": [
				"<array-of-child-resources>"
			]
		}
	]

### Dependencies
The **dependsOn** elements specifies a [dependency](../resource-group-define-dependencies.md) on another resource.  When the solution is installed, a resource is not created until all of its dependencies have been created.  For example, your solution might [start a runbook](operations-management-suite-custom-solutions-resources-automation.md) when it's installed using a [job resource](operations-management-suite-custom-solutions-resources-automation.md#automation-jobs).  The job resource would be dependent on the runbook resource to make sure that the runbook is created before the job is created.

## Solution resource
Each solution requires a resource entry in the **resources** element that defines the solution itself.  This will have a type of **Microsoft.OperationsManagement/solutions** and have the following structure.

	"name": "[concat(variables('SolutionName'), '[ ' ,parameters('workspacename'), ' ]')]",
	"location": "[parameters('workspaceRegionId')]",
	"tags": { },
	"type": "Microsoft.OperationsManagement/solutions",
	"apiVersion": "[variables('LogAnalyticsApiVersion')]",
	"dependsOn": [
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('MyRunbookName'))]",
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/schedules/', variables('StartRunbookScheduleName'))]",
		"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/views/', variables('MyViewName'))]"
	]
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
	"plan": {
		"name": "[concat(variables('SolutionName'), '[' ,parameters('workspacename'), ']')]",
		"Version": "[variables('SolutionVersion')]",
		"product": "AzureSQLAnalyticSolution",
		"publisher": "[variables('SolutionPublisher')]",
		"promotionCode": ""
	}

### Solution name
The solution name must be unique in your Azure subscription. The recommended value to use is the following.  This uses a variable called **SolutionName** for the base name and the **workspaceName** parameter to ensure that the name is unique.

	[concat(variables('SolutionName'), '[ ' ,parameters('workspaceName'), ']')]

This would resolve to a name like the following.

	My Solution Name [MyWorkspace]
 

### Dependencies
The solution resource must have a [dependency](../resource-group-define-dependencies.md) on every other resource in the solution since they need to exist before the solution can be created.  You do this by adding an entry for each resource in the **dependsOn** element.


### Properties
The solution resource has the properties in the following table.  This includes the resources referenced and contained by the solution which defines how the resource is managed after the solution is installed.  Each resource in the solution should be listed in either the **referencedResources** or the **containedResources** property.

| Property | Description |
|:--|:--|
| workspaceResourceId | ID of the OMS workspace in the form *<Resource Group ID>/providers/Microsoft.OperationalInsights/workspaces/\<Workspace Name\>*. |
| referencedResources   | List of resources in the solution that should not be removed when the solution is removed. |
| containedResources   | List of resources in the solution that should be removed when the solution is removed. |

The example  above is for a solution with a runbook, a schedule, and view.  The schedule and runbook are *referenced* in the  **properties**  element so they are not removed when the solution is removed.  The view is *contained* so it is removed when the solution is removed.


### Plan
The **plan** entity of the solution resource has the properties in the following table. 

| Property | Description |
|:--|:--|
| name          | Name of the solution. |
| version       | Version of the solution as determined by the author. |
| product       | Unique string to identify the solution. |
| publisher     | Publisher of the solution. |
| promotionCode | |


## Other resources
You can get the details and samples of resources that are common to solutions in the following articles.

- [Custom views](operations-management-suite-custom-solutions-resources-views.md)
- [Automation resources](operations-management-suite-custom-solutions-resources-automation.md)

## Testing a custom solution
Prior to deploying your custom solution, it is recommended that you test it using [Test-AzureRmResourceGroupDeployment](../resource-group-template-deploy.md#deploy-with-powershell).  This will validate your solution file and help you identify any problems before attempting to deploy it.


## Installing a custom solution
Since custom solutions are implemented as Resource Manager templates in Azure, they cannot be deployed from the OMS console like Microsoft solutions.  
There are three methods for deploying a custom solution.

- Since a custom solution is implemented as a Resource Manager template, you can use any of the standard methods for [deploying a template](../resource-group-template-deploy-portal.md).
- Submit your solution to [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) to make it available to the community.  The QuickStart templates are stored in a [GitHub](http://github.com) repository, and you can get instructions  from the [Azure Resource Manager QuickStart Templates Contribution Guide](https://github.com/Azure/azure-quickstart-templates/tree/master/1-CONTRIBUTION-GUIDE).
- If you are already a trusted partner with Microsoft, then you may be able to submit your solution to the [Azure Marketplace](http://azure.microsoft.com/marketplace/).


## Next steps

- Learn the details of [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).
- Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
- View the details for [adding custom views to a solutions](operations-management-suite-custom-solutions-resources-views.md).
- View the details for [adding Automation resources](operations-management-suite-custom-solutions-resources-automation.md)
 