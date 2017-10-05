---
title: Filters in Log Analytics views | Microsoft Docs
description: 
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: ''

ms.assetid: ce41dc30-e568-43c1-97fa-81e5997c946a
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2017
ms.author: bwren

---
# Filters in Log Analytics views
A **filter** in a Log Analytics view allows users to filter the data in the view by the value of a particular property.  For example, you could allow the user to filter the view for data only from a particular computer or set of computers.  You can create multiple filters on a single view to allow users to filter by multiple properties.

There are two steps to creating a filter:

- Create the filter specifying a query to populate the values the user can select.
- Modify any queries in the view to filter on the selected values.

## Create the filter

Create a filter from the **Filters** tab when editing a view.  Filters are global for the view and apply to all parts in the view.  

![Filter settings](media/log-analytics-view-designer/filters-settings.png)

The following table describes the settings for a filter.

| Setting | Description |
|:---|:---|
| Field Name | Name for the field used for filtering.  This must match the summarize field in **Query for Values**. |
| Query for Values | Query to run to populate filter dropdown for the user.  This must use either [summarize](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/summarize-operator) or [distinct](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/distinct-operator) to provide unique values for a particular field.  This must match the **Field Name**.  You can use [sort](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/sort-operator) to sort the values in the dropdown. |
| Tag | Name for the field that's used in queries supporting the filter and is also displayed to the user. |

### Examples

The following table includes a few examples of common filters.  

| Field Name | Query for Values | Tag |
|:--|:--|:--|
| Computer   | Heartbeat &#124; distinct Computer &#124; sort by Computer asc | Computers |
| EventLevelName | Event &#124; distinct EventLevelName | Severity |
| SeverityLevel | Syslog &#124; distinct SeverityLevel | Severity |
| SvcChangeType | ConfigurationChange &#124; distinct svcChangeType | ChangeType |


## Modify queries

For a filter to have any effect, you must modify any queries in the view to filter on the selected values.  If you don't modify any queries in the view then the filter will still be available to the user, but it will have no effect.

The syntax for a filter value is `${filter name}`.  For example, if your view has a query for events with a filter called Computers, you could use the following.

    Event | where ${Computers} | summarize count() by EventLevelName

If you added another filter called Severity, you could use the following query.

    Event | where ${Computers} | where ${Severity} | summarize count() by EventLevelName

## Using a filter
When you a open a view, click **Filter** to open the filter pane.  This allows you to select a time range and set the different filters that are available for the view.    Click in the filter's textbox to select one or more values.  The view is automatically updated to filter on the selected value.

If no value is selected for a filter, then that filter isn't applied.  If you remove all of the values for a filter, then that filter will no longer be applied.


![Filter example](media/log-analytics-view-designer/filters-example.png)

