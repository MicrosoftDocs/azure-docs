---
title: Saved searches in management solutions | Microsoft Docs
description: Management solutions typically include saved searches in Log Analytics to analyze data collected by the solution. This article describes how to define Log Analytics saved searches in a Resource Manager template so they can be included in management solutions.
services: monitoring
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.service: monitoring
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/27/2019
ms.author: bwren
ms.custom: H1Hack27Feb2017
---

# Adding Log Analytics saved searches to management solution (Preview)

> [!IMPORTANT]
> A previous version of this article included details on creating an alert using a Resource Manager template. This information is out of date now that [Log Analytics alerts have been extended to Azure Monitor](../platform/alerts-extend.md). For details on creating a log alert with a Resource Manager template, see [Managing log alerts using Azure Resource Template](../platform/alerts-log.md#managing-log-alerts-using-azure-resource-template).

> [!NOTE]
> This is preliminary documentation for creating management solutions which are currently in preview. Any schema described below is subject to change.

This article describes how to define Log Analytics saved searches in a [Resource Management template](../../azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal.md) so they can be included in [management solutions](solutions-creating.md).

> [!NOTE]
> The samples in this article use parameters and variables that are either required or common to management solutions and described in [Design and build a management solution in Azure](solutions-creating.md)

## Prerequisites
This article assumes that you're already familiar with how to [create a management solution](solutions-creating.md) and the structure of a [Resource Manager template](../../azure-resource-manager/resource-group-authoring-templates.md) and solution file.


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


## Next steps
* [Add views](solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](solutions-resources-automation.md) to your management solution.
