---
title: Management solution in Azure best practices | Microsoft Docs
description: 
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.assetid: 1915e204-ba7e-431b-9718-9eb6b4213ad8
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/27/2017
ms.author: bwren
---
# Best practices for creating management solutions in Azure (Preview)
> [!NOTE]
> This is preliminary documentation for creating management solutions in Azure which are currently in preview. Any schema described below is subject to change.  

This article provides best practices for [creating a management solution file](solutions-solution-file.md) in Azure.  This information will be updated as additional best practices are identified.

## Data sources
- Data sources can be [configured with a Resource Manager template](../../azure-monitor/platform/template-workspace-configuration.md), but they should not be included in a solution file.  The reason is that configuring data sources is not currently idempotent meaning that your solution could overwrite existing configuration in the user's workspace.<br><br>For example, your solution may require Warning and Error events from the Application event log.  If you specify this as a data source in your solution, you risk removing Information events if the user had this configured in their workspace.  If you included all events, then you may be collecting excessive Information events in the user's workspace.

- If your solution requires data from one of the standard data sources, then you should define this as a prerequisite.  State in documentation that the customer must configure the data source on their own.  
- Add a [Data Flow Verification](../../azure-monitor/platform/view-designer-tiles.md) message to any views in your solution to instruct the user on data sources that need to be configured for required data to be collected.  This message is displayed on the tile of the view when required data is not found.


## Runbooks
- Add an [Automation schedule](../../automation/automation-schedules.md) for each runbook in your solution that needs to run on a schedule.
- Include the [IngestionAPI module](https://www.powershellgallery.com/packages/OMSIngestionAPI/1.5) in your solution to be used by runbooks writing data to the Log Analytics repository.  Configure the solution to [reference](solutions-solution-file.md#solution-resource) this resource so that it remains if the solution is removed.  This allows multiple solutions to share the module.
- Use [Automation variables](../../automation/automation-schedules.md) to provide values to the solution that users may want to change later.  Even if the solution is configured to contain the variable, it's value can still be changed.

## Views
- All solutions should include a single view that is displayed in the user's portal.  The view can contain multiple [visualization parts](../../azure-monitor/platform/view-designer-parts.md) to illustrate different sets of data.
- Add a [Data Flow Verification](../../azure-monitor/platform/view-designer-tiles.md) message to any views in your solution to instruct the user on data sources that need to be configured for required data to be collected.
- Configure the solution to [contain](solutions-solution-file.md#solution-resource) the view so that it's removed if the solution is removed.

## Alerts
- Define the recipients list as a parameter in the solution file so the user can define them when they install the solution.
- Configure the solution to [reference](solutions-solution-file.md#solution-resource) alert rules so that user's can change their configuration.  They may want to make changes such as modifying the recipient list, changing the threshold of the alert, or disabling the alert rule. 


## Next steps
* Walk through the basic process of [designing and building a management solution](solutions-creating.md).
* Learn how to [create a solution file](solutions-solution-file.md).
* [Add saved searches and alerts](solutions-resources-searches-alerts.md) to your management solution.
* [Add views](solutions-resources-views.md) to your management solution.
* [Add Automation runbooks and other resources](solutions-resources-automation.md) to your management solution.

