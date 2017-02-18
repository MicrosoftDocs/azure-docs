---
title: Creating management solutions in Operations Management Suite (OMS) | Microsoft Docs
description: Management solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how you can create management solutions to be used in your own environment or made available to your customers.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 1915e204-ba7e-431b-9718-9eb6b4213ad8
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/17/2017
ms.author: bwren

---
# Creating management solutions in Operations Management Suite (OMS) (Preview)
> [!NOTE]
> This is preliminary documentation for creating management solutions in OMS which are currently in preview. Any schema described below is subject to change.  

Management solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on creating your own management solutions that you can use in your own environment or make available to customers through the community.

## Planning your management solution
Management solutions in OMS include multiple resources supporting a particular management scenario.  When planning your solution, you should focus on the scenario that you're trying to achieve and all required resources to support it.  Each solution should be self contained and define each resource that it requires, even if one or more resources are also defined by other solutions.  When a management solution is installed, each resource is created unless it already exists, and you can define what happens to resources when a solution is removed.  

For example, a management solution might include an [Azure Automation runbook](../automation/automation-intro.md) that collects data to the Log Analytics repository using a [schedule](../automation/automation-schedules.md) and a [view](../log-analytics/log-analytics-view-designer.md) that provides various visualizations of the collected data.  The same schedule might be used by another solution.  As the management solution author, you would define all three resources but specify that the runbook and view should be automatically removed when the solution is removed.    You would also define the schedule but specify that it should remain in place if the solution were removed in case it was still in use by the other solution.

## Procedure to define solution

### Determine required data

### Define data collection



## Other resources
You can get the details and samples of resources that are common to management solutions in the following articles.

* [Views and dashboards](operations-management-suite-solutions-resources-views.md)
* [Automation resources](operations-management-suite-solutions-resources-automation.md)

## Testing a management solution
Prior to deploying your management solution, it is recommended that you test it using [Test-AzureRmResourceGroupDeployment](../azure-resource-manager/resource-group-template-deploy.md#deploy).  This will validate your solution file and help you identify any problems before attempting to deploy it.

## Next steps
* [Add saved searches and alerts](operations-management-suite-solutions-resources-searches-alerts.md) to your management solution.
* [Add views](operations-management-suite-solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](operations-management-suite-solutions-resources-automation.md) to your management solution.
* Learn the details of [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).
* Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
