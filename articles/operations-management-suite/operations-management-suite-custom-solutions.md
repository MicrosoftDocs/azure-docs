<properties
   pageTitle="Custom solutions in Operations Management Suite (OMS) | Microsoft Azure"
   description="Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how you can create custom solutions to be used in your own environment or made available to customers through the Azure Marketplace."
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
   ms.date="09/19/2016"
   ms.author="bwren" />

# Custom solutions with Operations Management Suite (OMS)

Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  You can create custom solutions to be used in your own environment or made available to customers through the Azure Marketplace.

## Planning your custom solution
Solutions in OMS include multiple resources supporting a particular monitoring scenario.  When planning your solution, you should focus on the management scenario that you're trying to achieve and ensure that it includes all required resources to support that scenario.  

Multiple solutions may share resources, but one solution should not rely another to first to be installed.  Instead, each solution should both define the common resource.  When the first solution is installed, the resource will be created.  When the next solution is installed, it will use the resource that's already in place.  

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

The **parameters** element defines values that you require from the user when they install the solution.  This should include anything specific to their workspace such as the workspace name and region.  You may also require other values for the user to configure different options for the solution.    

Following is an example of a **parameters** element with typical parameters used in solutions.

	"parameters": {
		"WorkspaceName": {
			"type": "string"
		},
		"AutomationAccountName": {
			"type": "string"
		},
		"WorkspaceRegionId": {
			"type": "string"
		},
		"RegionId": {
			"type": "string"
		},
		"PricingTier": {
			"type": "string"
		}
	}

You refer to parameter values in other elements of the solution with the syntax **parameters('parameter name')**.  For example, to access the workspace name, you would use **parameters('WorkspaceName')** 

### Variables

The **Variables** element includes values that you will use in other elements.  These values are not exposed to the user installing the solution.  They are intended to provide the author with a single location where they can manage values that may be used multiple times throughout the solution. 

Following is an example of a **variables** element with typical parameters used in solutions.

	"variables": { 
		"SolutionVersion": "1.1", 
		"SolutionPublisher": "Contoso", 
		"SolutionName": "My Solution"
	},

You refer to variable values through the solution with the syntax **variables('variable name')**.  For example, to access the SolutionName variable, you would use **variables('SolutionName')** 


## Resources

The **Resources** element defines the different resources included in your solution.  This will be the largest and most complex portion of the template.

Resources are defined with the following structure.  All types of resources will have the same structure, but the values defined in the **proeprties** element will be different for different types.

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

The sections that follow provide details on the Solution resources and other resources that are common to solutions.

### Solution resource
Each solution requires a resource entry that defines the solution itself.  This will have a type of **Microsoft.OperationsManagement/solutions**.

      "name": "[concat(variables('SolutionName'), '(' ,parameters('workspacename'), ')')]",
      "location": "[parameters('workspaceRegionId')]",
      "tags": { },
      "type": "Microsoft.OperationsManagement/solutions",
      "apiVersion": "[variables('LogAnalyticsApiVersion')]",

The solution resource should have a [dependency](../resource-group-define-dependencies.md) on every other resource in the solution.  That ensures that all resources are created before the solution is created.  You do this by adding an entry for each resource in the **dependsOn** element.

For example, a solution with a runbook, a schedule, and view would have a **dependsOn** element like the following.

	"dependsOn": [
		"[concat('Microsoft.Automation/automationAccounts/', parameters('AutomationAccountName'), '/runbooks/', variables('MyRunbookName'))]",
		"[concat('Microsoft.Automation/automationAccounts/', parameters('AutomationAccountName'), '/schedules/', variables('StartRunbookScheduleName'))]",
		"[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'), '/views/', variables('MyViewName'))]"
	]

The solution resource has the properties in the following table.  This includes the resources referenced and contained by the solution which defines how the resource is managed after the solution is installed.  Each resource in the solution should be listed in either the **referencedResources** or the **containedResources** property.

| Property | Description |
|:--|:--|
| workspaceResourceId | ID of the OMS workspace in the form *<Resource Group ID>/providers/Microsoft.OperationalInsights/workspaces/<Workspace Name>*. |
| referencedResources   | List of resources in the solution that should not be removed when the solution is removed. |
| containedResources   | List of resources in the solution that should be removed when the solution is removed. |


>[AZURE.NOTE]In the preview implementation of custom solutions, you must add a lock resource for each resource in the solution in addition to the entry in **referencedResources** and **containedResources** properties.  Lock resources are described in the next section. 

### Lock resources
In the preview implementation of custom solutions, you must add a lock resource for each resource in the solution in addition to the entry in **referencedResources** and **containedResources**. 

The type for the lock resource is the type of the resource it's locking appeneded with **/providers/locks**.  It should also have a **dependsOn** element for the resource it's locking.  It has a single property defined in the following table.

| Property | Description |
|:--|:--|
| level | Specifies the level of locking. <br><br>CannotDelete - The resource can be edited and is not removed when the solution is removed.  Should be used for  resources in **referencedResources** property of the solution.<br>ReadOnly - The resource cannot be edited and is removed when the solution is removed.  Should be used for  resources in **containedResources** property of the solution.|



For example, the lock resources for a contained view and a reference schedule would look like the following.

	"name": "[concat(parameters('accountName'), '/', variables('StartByResourceGroupRunbookName'), '/Microsoft.Authorization/', variables('SolutionName'), '(' ,parameters('workspacename'), ')')]",
	"type": "Microsoft.Automation/automationAccounts/runbooks/providers/locks",
	"apiVersion": "[variables('AuthorizationApiVersion')]",
	"dependsOn": [
		"[concat('Microsoft.Automation/automationAccounts/', parameters('AutomationAccountName'), '/runbooks/', variables('MyRunbookName'))]"
	],
	"properties": {
		"level": "ReadOnly"
	},
    {
      "name": "[concat(parameters('accountName'), '/', variables('StartRunbookScheduleName'), '/Microsoft.Authorization/', variables('SolutionName'), '(' ,parameters('Workspacename'), ')')]",
      "type": "Microsoft.Automation/automationAccounts/schedules/providers/locks",
      "apiVersion": "[variables('AuthorizationApiVersion')]",
      "dependsOn": [
        "[concat('Microsoft.Automation/automationAccounts/', parameters('AutomationAccountName'), '/schedules/', variables('StartRunbookScheduleName'))]"
      ],
      "properties": {
        "level": "CannotDelete"
      }
    }



### Common resources

Because custom solutions are implemented as Resource Manager templates, they can include any resource in Azure.  Since solutions are intended for management scenarios in OMS though, they will typically contain primarily OMS resources.  The following sections describe how to add resources that are commonly used in custom solutions.  

#### Views
Many solutions will include one or more views to visualize data collected by the solution.  To include a view in a solution, you create a **resource** entry for it with its detailed configuration in JSON.  This is typically complex and not something that a typical solution author would be able to create from scratch.  The most common method is to create the view using the [View Designer](../log-analytics/log-analytics-view-designer.md) and then [export it to a file](log-analytics-view-designer.md#).  The exported file will be in JSON format that can be pasted into the solution file.  

The exported file will have the same root elements as the solution file.  You will need to copy the following sections from the exported view file to your solution file.

- The **parameters** element will include parameters that are used by the properties of the view.  Copy the contents of this section into the **parameters** element of your solution file.  If you have multiple views in your solution, then you will only need to copy the **parameters** element once since all views created by the View Designer use the same set of parameters.

- The **resources** section will have a single resource with a type of **Microsoft.OperationalInsights/workspaces**.  This will have its own **resources** element with a type of **views**.  You need to copy the contents of this element into the **resources** element of your solution.  If you have multiple views in your solution, then you should only have one **Microsoft.OperationalInsights/workspaces** resource.  Include the **views** resource for each view in the **resources** element of this resource.



#### Automation runbooks and assets
Runbooks in Azure Automation are often used in solutions to automate processes such as collecting and processing monitoring data.  In addition to runbooks, Automation accounts includes assets such as variables and schedules that support the runbooks used in the solution.


##### Runbooks
Azure Automation runbooks have a type of **Microsoft.Automation/automationAccounts/runbooks** and have the properties in the following table.

| Property | Description |
|:--|:--|
| runbookType | Specifies the types of the runbook. <br><br> Script - PowerShell script <br>PowerShell - PowerShell workflow <br> Graph - Graphical runbook  |
| logProgress | Specifies whether [progress records](../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| logVerbose  | Specifies whether [verbose records](../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| description | Optional description for the runbook. |
| publishContentLink | Specifies the content of the runbook. <br><br>uri - Uri to the content of the runbook.  This will be a .ps1 file for PowerShell and Script runbooks, and an exported graphical runbook file for a Graph runbook.  <br> version - Version of the runbook for your own tracking. |

An example of a runbook resource is below.

      "name": "[concat(parameters('accountName'), '/', variables('SolutionCleanUpRunbookName'))]",
      "type": "Microsoft.Automation/automationAccounts/runbooks",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "location": "[parameters('regionId')]",
      "tags": { },
      "properties": {
        "runbookType": "PowerShell",
        "logProgress": "true",
        "logVerbose": "true",
        "description": "",
        "publishContentLink": {
          "uri": "    "SolutionCleanUpRunbookURL": "https://solutionrpstorage.blob.core.windows.net/solution/CleanSolution-MS-Mgmt-VM.ps1",
          "version": "1.0.0.0"
        }
      }
    }

##### Schedules
Azure Automation variables have a type of **Microsoft.Automation/automationAccounts/schedules** and have the properties in the following table.

| Property | Description |
|:--|:--|
| description | Optional description for the variable. |
| startTime   | Specifies the start time of a schedule as a DateTime object. A string can be provided if it can be converted to a valid DateTime. |
| isEnabled   | Specifies whether the schedule is enabled. |
| interval    | |
| frequency   | |

An example of a schedule resource is below.

      "name": "[concat(parameters('accountName'), '/', variables('StartRunbookScheduleName'))]",
      "type": "microsoft.automation/automationAccounts/schedules",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "dependsOn": [
        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/jobs/', parameters('SolutionCleanupJobIDGuid'))]"
      ],
      "tags": { },
      "properties": {
        "description": "Schedule for StartByResourceGroup runbook",
        "startTime": "[parameters('StartRunbookScheduleStartTimeValue')]",
        "isEnabled": "true",
        "interval": "[variables('StartRunbookScheduleInterval')]",
        "frequency": "[variables('StartRunbookScheduleFrequency')]"
      }
    }

##### Variables
Azure Automation variables have a type of **Microsoft.Automation/automationAccounts/variables** and have the properties in the following table.

| Property | Description |
|:--|:--|
| description | Optional description for the variable. |
| isEncrypted | Specifies whether the variable should be encrypted. |
| type        | Data type for the variable. |
| value       | Value for the variable. |

An example of a variable resource is below.

	"name": "[concat(parameters('accountName'), '/', variables('StartTargetResourceGroupsAssetName')) ]",
	"type": "microsoft.automation/automationAccounts/variables",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"tags": { },
	"properties": {
		"description": "",
		"isEncrypted": "true",
		"type": "String",
		"value": "[concat('\"', parameters('TargetResourceGroupsAssetValue'), '\"')]"
	}



## Deploying a custom solution
Since custom solutions are implemented as Resource Manager templates in Azure, they cannot be deployed from the OMS console.  Resources in the solution such as views will be available in the OMS console after the solution has been added to the workspace.  

There are three methods for deploying a custom solution.

- Since a custom solution is implemented as a Resource Manager template, you can use any of the standard methods for [deploying a template](../resource-group-template-deploy-portal.md).
- Submit your solution to [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) to make it available to the community.  The QuickStart templates are stored in a [GitHub](http://github.com) repository, and you can get instructions  from the [Azure Resource Manager QuickStart Templates Contribution Guide](https://github.com/Azure/azure-quickstart-templates/tree/master/1-CONTRIBUTION-GUIDE).
- Get your solution certified and [submit it to the Azure Marketplace](https://azure.microsoft.com/marketplace/programs/certified/).  This will allow customers to install the solution from the [Azure Marketplace](http://azure.microsoft.com/marketplace/) in the Azure portal.


## Next steps

- Learn more about the [Azure Marketplace](https://azure.microsoft.com/marketplace/programs/certified/) to make your solution available to customers.