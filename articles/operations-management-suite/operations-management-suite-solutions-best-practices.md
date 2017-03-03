---
title: OMSManagement solution best practices | Microsoft Docs
description: 
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
ms.date: 03/02/2017
ms.author: bwren

ms.custom: H1Hack27Feb2017

---
# Best practices in Operations Management Suite (OMS)  management solutions (Preview)
> [!NOTE]
> This is preliminary documentation for creating management solutions in OMS which are currently in preview. Any schema described below is subject to change.  

This article provides best practices for creating a management solution file in Operations Management Suite (OMS).  

## Data sources
- Data sources can be [configured with a Resource Manager template](../log-analytics/log-analytics-template-workspace-configuration.md), but we do not recommend that you include them in a solution file.  The reason is that configuring data sources is not currently idempotent meaning that your solution could overwrite existing configuration in the user's workspace.<br><br>For example, your solution may require Warning and Error events from the Application event log.  If you specify this as a data source in your solution, you risk removing Information events if the user had this configured in their workspace.  If you included all events, then you may be collecting excessive Information events in the user's workspace.

- If your solution requires data from one of the standard data sources, then you should define this as a prerequisite.  State in documentation that the customer must configure the data source on their own.  
- Add a [Data Flow Verification](../log-analytics/log-analytics-view-designer-tiles.md) message to any views in your solution to instruct the user on data sources that need to be configured for required data to be collected.


## Runbooks
- Create an [Automation schedule](../automation/automation-schedules.md) for each runbook in your solution that needs to run on a schedule.
- Contain runbooks in the solution so they're removed when the solution is removed.
- Include the [IngestionAPI module](../log-analytics/log-analytics-data-collector-api.md) in your runbook to simplify writing data to the Log Analytics repository.  Do not contain this module in the solution so that it remains if the solution is removed.  This allows multiple solutions to share the module.


## Views
- All solutions should include a single view that is displayed in the user's portal.  The view can contain multiple automation parts to illustrate different sets of data.
- Add a [Data Flow Verification](../log-analytics/log-analytics-view-designer-tiles.md) message to any views in your solution to instruct the user on data sources that need to be configured for required data to be collected.

## Alerts
- Define the recipients list as a parameter in the solution file so the user can define them when they install the solution.
- Don't contain the alert rules in the solution to allow the user to change their configuration.  They may want to make changes such as modifying the recipient list, changing the threshold of the alert, or disabling the rule. 


## Next steps
* [Add saved searches and alerts](operations-management-suite-solutions-resources-searches-alerts.md) to your management solution.
* [Add views](operations-management-suite-solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](operations-management-suite-solutions-resources-automation.md) to your management solution.
* Learn the details of [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).
* Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
