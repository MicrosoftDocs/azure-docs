
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

View Designer has a fixed static style of representation, while workbooks enable freedom to include and modify how the data is represented, below depicts a few examples of how one might transform the views within workbooks.

[View Designer - Vertical](./Examples/VDVertical.md)
![Vertical](./Examples/VDVertical.png)

[View Designer - Tabbed](./Examples/VDTabbed.md)
![Data Type Distribution Tab](./Examples/DistributionTab.png)
![Data Types Over Time Tab](./Examples/OverTimeTab.png)

## Overview Tile Conversion
View Designer utilizes the overview tile feature to represent and summarize the overall state. These are represented in seven tiles, ranging from numbers to charts.

![Gallery](media/view-designer-conversion-options/overview.png)

Within Workbooks, users can create similar visualizations and pin them to resemble the original style of overview tiles. 

## View Dashboard Conversion
View Designer tiles typically consist of two sections, a visualization and a list that matches the data from the visualization, for example the Donut & List

![Donut](media/view-designer-conversion-options/donut-example.png)

With Workbooks, we allow the user to choose to query one or both sections of the view. An example of how this view would be recreated in Workbooks is as follows:

![Convert](media/view-designer-conversion-options/convert-donut.png)

In general, formulating queries in Workbooks is a simple two-step process. First, the data is generated from the query, and the second, where the data is rendered as a visualization. The next set of sections breakdown commonly utilized steps to recreate View Designer views within workbooks.
The goal of these next sections is to demonstrate how to re-create 1-1 mappings of View Designer views, however, learning the various options enables users to create their own custom views in Workbooks.

### [Next Section: Common Steps](view-designer-common-steps.md)