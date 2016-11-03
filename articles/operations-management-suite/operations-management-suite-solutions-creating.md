---
title: Creating management solutions in Operations Management Suite (OMS) | Microsoft Docs
description: Management solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how you can create management solutions to be used in your own environment or made available to your customers.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/27/2016
ms.author: bwren

---
# Creating management solutions in Operations Management Suite (OMS) (Preview)
> [!NOTE]
> This is preliminary documentation for creating management solutions in OMS which are currently in preview. Any schema described below is subject to change.  
> 
> 

Management solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on creating your own management solutions that you can use in your own environment or make available to customers through the community.

## Planning your management solution
Management solutions in OMS include multiple resources supporting a particular management scenario.  When planning your solution, you should focus on the scenario that you're trying to achieve and all required resources to support it.  Each solution should be self contained and define each resource that it requires, even if one or more resources are also defined by other solutions.  When a management solution is installed, each resource is created unless it already exists, and you can define what happens to resources when a solution is removed.  

For example, a management solution might include an [Azure Automation runbook](../automation/automation-intro.md) that collects data to the Log Analytics repository using a [schedule](../automation/automation-schedules.md) and a [view](../log-analytics/log-analytics-view-designer.md) that provides various visualizations of the collected data.  The same schedule might be used by another solution.  As the management solution author, you would define all three resources but specify that the runbook and view should be automatically removed when the solution is removed.    You would also define the schedule but specify that it should remain in place if the solution were removed in case it was still in use by the other solution.

## Management solution files
Management solutions are implemented as [Resource Management templates](../resource-manager-template-walkthrough.md).  The main task in learning how to author management solutions is learning how to [author a template](../resource-group-authoring-templates.md).  This article provides unique details of templates used for solutions and how to define typical solution resources.

The basic structure of a management solution file is the same as a [Resource Manager Template](../resource-group-authoring-templates.md#template-format) which is as follows.  Each of the following sections describes the top level elements and and their contents in a solution.  

    {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "",
       "parameters": {  },
       "variables": {  },
       "resources": [  ],
       "outputs": {  }
    }

## Parameters
[Parameters](../resource-group-authoring-templates.md#parameters) are values that you require from the user when they install the management solution.  There are standard parameters that all solutions will have, and you can add additional parameters as required for your particular solution.  How users will provide parameter values when they install your solution will depend on the particular parameter and how the solution is being installed.

When a user installs your management solution through the [Azure Marketplace](operations-management-suite-solutions.md#finding-and-installing-solutions) or [Azure QuickStart templates](operations-management-suite-solutions.md#finding-and-installing-solutions) they are prompted to select an [OMS workspace and Automation account](operations-management-suite-solutions-creating.md#oms-workspace-and-automation-account).  These are used to populate the values of each of the standard parameters.  The user is not prompted to directly provide values for the standard parameters, but they are prompted to provide values for any additional parameters.

When the user installs your solution [another method](operations-management-suite-solutions.md#finding-and-installing-solutions), they must provide a value for all standard parameters and all additional parameters.

A sample parameter is shown below.

    "Daily Start Time": {
        "type": "string",
        "metadata": {
            "description": "Enter time for starting VMs by resource group.",
            "control": "datetime",
            "category": "Schedule"
        }

The following table describes the attributes of a parameter.

| Attribute | Description |
|:--- |:--- |
| type |Data type for the parameter. The input control displayed for the user depends on the data type.<br><br>bool - Drop down box<br>string - Text box<br>int - Text box<br>securestring - Password field<br> |
| category |Optional category for the parameter.  Parameters in the same category are grouped together. |
| control |Additional functionality for string parameters.<br><br>datetime - Datetime control is displayed.<br>guid - Guid value is automatically generated, and the parameter is not displayed. |
| description |Optional description for the parameter.  Displayed in an information balloon next to the parameter. |

### Standard parameters
The following table lists the standard parameters for all management solutions.  These values are populated for the user instead of prompting for them when your solution is installed from the Azure Marketplace or Quickstart templates.  The user must provide values for them if the solution is installed with another method.

> [!NOTE]
> The user interface in the Azure Marketplace and Quickstart templates is expecting the parameter names in the table.  If you use different parameter names then the user will be prompted for them, and they will not be automatically populated.
> 
> 

| Parameter | Type | Description |
|:--- |:--- |:--- |
| accountName |string |Azure Automation account name. |
| pricingTier |string |Pricing tier of both Log Analytics workspace and Azure Automation account. |
| regionId |string |Region of the Azure Automation account. |
| solutionName |string |Name of the solution. |
| workspaceName |string |Log Analytics workspace name. |
| workspaceRegionId |string |Region of the Log Analytics workspace. |

### Sample
Following is a sample parameter entity for a solution.  This includes all of the standard  parameters and two additional parameters in the same category.

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
        "jobIdGuid": {
        "type": "string",
            "metadata": {
                "description": "GUID for a runbook job",
                "control": "guid",
                "category": "Schedule"
            }
        },
        "startTime": {
            "type": "string",
            "metadata": {
                "description": "Time for starting the runbook.",
                "control": "datetime",
                "category": "Schedule"
            }
        }


You refer to parameter values in other elements of the solution with the syntax **parameters('parameter name')**.  For example, to access the workspace name, you would use **parameters('workspaceName')** 

## Variables
The **Variables** element includes values that you will use in the rest of the management solution.  These values are not exposed to the user installing the solution.  They are intended to provide the author with a single location where they can manage values that may be used multiple times throughout the solution. You should put any values specific to your solution in variables as opposed to hardcoding them in the **resources** element.  This makes the code more readable and allows you to easily change these values in later versions.

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
The **resources** element defines the different resources included in your management solution.  This will be the largest and most complex portion of the template.  Resources are defined with the following structure.  

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
The **dependsOn** elements specifies a [dependency](../resource-group-define-dependencies.md) on another resource.  When the solution is installed, a resource is not created until all of its dependencies have been created.  For example, your solution might [start a runbook](operations-management-suite-solutions-resources-automation.md#runbooks) when it's installed using a [job resource](operations-management-suite-solutions-resources-automation.md#automation-jobs).  The job resource would be dependent on the runbook resource to make sure that the runbook is created before the job is created.

### OMS workspace and Automation account
Management solutions require an [OMS workspace](../log-analytics/log-analytics-manage-access.md) to contain views and an [Automation account](../automation/automation-security-overview.md#automation-account-overview) to contain runbooks and related resources.  These must be available before the resources in the solution are created and should not be defined in the solution itself.  The user will [specify a workspace and account](operations-management-suite-solutions.md#oms-workspace-and-automation-account) when they deploy your solution, but as the author you should consider the following points.

## Solution resource
Each solution requires a resource entry in the **resources** element that defines the solution itself.  This will have a type of **Microsoft.OperationsManagement/solutions**.  Following is an example of a solution resource.  Its different elements are described in the sections below.

    "name": "[concat(variables('SolutionName'), '[ ' ,parameters('workspacename'), ' ]')]",
    "location": "[parameters('workspaceRegionId')]",
    "tags": { },
    "type": "Microsoft.OperationsManagement/solutions",
    "apiVersion": "[variables('LogAnalyticsApiVersion')]",
    "dependsOn": [
        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('RunbookName'))]",
        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/schedules/', variables('ScheduleName'))]",
        "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/views/', variables('ViewName'))]"
    ]
    "properties": {
        "workspaceResourceId": "[concat(resourceGroup().id, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]",
        "referencedResources": [
            "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/schedules/', variables('ScheduleName'))]"
        ],
        "containedResources": [
            "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('RunbookName'))]",
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'), '/views/', variables('ViewName'))]"
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

    [concat(variables('SolutionName'), ' [' ,parameters('workspaceName'), ']')]

This would resolve to a name like the following.

    My Solution Name [MyWorkspace]


### Dependencies
The solution resource must have a [dependency](../resource-group-define-dependencies.md) on every other resource in the solution since they need to exist before the solution can be created.  You do this by adding an entry for each resource in the **dependsOn** element.

### Properties
The solution resource has the properties in the following table.  This includes the resources referenced and contained by the solution which defines how the resource is managed after the solution is installed.  Each resource in the solution should be listed in either the **referencedResources** or the **containedResources** property.

| Property | Description |
|:--- |:--- |
| workspaceResourceId |ID of the OMS workspace in the form *<Resource Group ID>/providers/Microsoft.OperationalInsights/workspaces/\<Workspace Name\>*. |
| referencedResources |List of resources in the solution that should not be removed when the solution is removed. |
| containedResources |List of resources in the solution that should be removed when the solution is removed. |

The example  above is for a solution with a runbook, a schedule, and view.  The schedule and runbook are *referenced* in the  **properties**  element so they are not removed when the solution is removed.  The view is *contained* so it is removed when the solution is removed.

### Plan
The **plan** entity of the solution resource has the properties in the following table. 

| Property | Description |
|:--- |:--- |
| name |Name of the solution. |
| version |Version of the solution as determined by the author. |
| product |Unique string to identify the solution. |
| publisher |Publisher of the solution. |

## Other resources
You can get the details and samples of resources that are common to management solutions in the following articles.

* [Views and dashboards](operations-management-suite-solutions-resources-views.md)
* [Automation resources](operations-management-suite-solutions-resources-automation.md)

## Testing a management solution
Prior to deploying your management solution, it is recommended that you test it using [Test-AzureRmResourceGroupDeployment](../resource-group-template-deploy.md#deploy-with-powershell).  This will validate your solution file and help you identify any problems before attempting to deploy it.

## Next steps
* Learn the details of [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).
* Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
* View the details for [adding views to a management solution](operations-management-suite-solutions-resources-views.md).
* View the details for [adding Automation resources to a management solution](operations-management-suite-solutions-resources-automation.md).

