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

Every management solution has unique requirements, and each one can include any set of Azure resources required to perform a particular management function.     

### Determine required data
The first step in designing a solution is determining the data that you require.  This data may already be in the Log Analytics repository, or your solution may need to provide the process to collect it.

#### Data sources
There are a number of ways that data can be collected in the Log Analytics repository as described in [Data sources in Log Analytics](log-analytics-data-sources.md).  These data sources collect data from a variety of different agents and sources.  

Data sources can be [configured with an ARM template](log-analytics-template-workspace-configuration.md) and thus included in a management solution. This should only be done if the configuration is specific to your application though since you risk overwriting existing configurations.

For example, your solution may require Warning and Error events from the Application event log.  If you specify this as a data source in your solution, you risk removing Information events if the user had this configured in their workspace.  If you included all events, then you may be collecting excessive Information events in the user's workspace.

If y



#### Runbook

The most common model of 

If you require data that's not accessible through any of the data sources, then you can use the [HTTP Data Collector API]() allows you to write data to the Log Analytics repository from any client that call all a REST API.  

The most common means of data collection in a management solution is to create a runbook in Azure Automation that collects the required data and uses the Data Collector API to write to the repository. 



### Define data collection





General process: 

- Determine how to get data to Log Analytics (typically done by using fluentd plugins for Linux or the ingestion API more generally)
 - Ingestion API information is here: [https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-data-collector-api](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-data-collector-api) 
 - Linux Open source agent is here, to see how we use fluentd: [https://github.com/Microsoft/OMS-Agent-for-Linux](https://github.com/Microsoft/OMS-Agent-for-Linux)

- Build a dashboard for views, use the export functionality to get the ARM resource representing it
 - https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-view-designer-parts 

- Optionally build any runbooks with Azure Automation
 - Build a solution template containing the dashboard and runbook resources
 - https://docs.microsoft.com/en-us/azure/operations-management-suite/operations-management-suite-solutions-creating 
- Authoring Azure Resource Manager templates: https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/ 
 - Useful tooling: Installing and using VS Code for ARM Templates
- Test and iterate




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
