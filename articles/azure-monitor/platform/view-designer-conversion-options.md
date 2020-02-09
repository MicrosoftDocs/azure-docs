---
title: Azure Monitor view designer to workbooks conversion options
description: 
author: austonli
ms.author: aul
ms.service: azure-monitor
ms.subservice: visualization
ms.topic: conceptual
ms.date: 02/07/2020

---

# Azure Monitor view designer to workbooks conversion options

View designer has a fixed static style of representation, while workbooks enable freedom to include and modify how the data is represented, below depicts a few examples of how one might transform the views within workbooks.

[View designer vertical](view-designer-conversion-examples.md#vertical)
![Vertical](media/view-designer-conversion-options/view-designer-vertical.png)

[View designer tabbed](view-designer-conversion-examples.md#tabbed)
![Data type distribution tab](media/view-designer-conversion-options/distribution-tab.png)
![Data types over time tab](media/view-designer-conversion-options/over-time-tab.png)

## Overview Tile Conversion
View Designer uses the overview tile feature to represent and summarize the overall state. These are represented in seven tiles, ranging from numbers to charts.

![Gallery](media/view-designer-conversion-options/overview.png)

Within workbooks, users can create similar visualizations and pin them to resemble the original style of overview tiles. 

## View Dashboard Conversion
View Designer tiles typically consist of two sections, a visualization and a list that matches the data from the visualization, for example the **Donut & List** tile.

![Donut](media/view-designer-conversion-options/donut-example.png)

With workbooks, we allow the user to choose to query one or both sections of the view. An example of how this view would be recreated in workbooks is as follows:

![Convert](media/view-designer-conversion-options/convert-donut.png)

Formulating queries in workbooks is a simple two-step process. First, the data is generated from the query, and second, the data is rendered as a visualization. The next set of sections breakdown commonly utilized steps to recreate views within workbooks.

The goal of these next sections is to demonstrate how to recreate direct mappings of view designer views, however, learning the various options enables users to create their own custom views in workbooks.

### [Next Section: Common Steps](view-designer-conversion-steps.md)