---
title: The Azure Time Series Insights update Explorer | Microsoft Docs
description: The Azure Time Series Insights update Explorer
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/21/2018
---

# The Azure Time Series Insights update Explorer

This article describes features and options available within The Azure Time Series Insights (TSI) update Explorer web application.

## Prerequisites

Before you use the Azure Time Series Insights update Explorer, you must:

* Have a Time Series Insights environment provisioned. Learn more about provisioning a Time Series Insights environment here.
* Provide data access to the Time Series Insights environment you created for the account. Access can be supplied to others as well as yourself.
* Add an event source to the Time Series Insights environment to push data to the environment.

## Learn about the Azure Time Series Insights update Explorer

  ![explorer-one][1]

The Azure Time Series Insights update Explorer is broken up into the following seven elements:

1. TSI update navigation bar allows you to switch between analytics and model pages.
1. TSI update  hierarchy tree select specific data elements to be charted.
1. TSI update time series well shows all your currently selected data elements.
1. TSI update chart panel displays your current working chart.
1. TSI update timeline allows you to modify your working time span.
1. TSI update app bar contains your user management options (like current tenant), and allows you to change theme and language settings.

## TSI update environment panel

The environment panel displays all the TSI environments you have access to. This includes a listing of pay-as-you-go environments (Preview) as well as S1/S2 environments (GA). Simply click the TSI environment you want to use.

  ![explorer-two][2]

## Time Series Insights update Navigation Menu

  ![explorer-three][3]

The navigation menu allows you to switch between the TSI applications:

* Analyze – Allows you to chart & perform rich analytics on your modeled or unmodeled time series data.

* Model - Allows you to push new TSI update types, hierarchies, and instances to your TSI model.

## Time Series Insights update Model Authoring

This application gives you the ability to perform CRUD operations on your Time Series Model.  

* TSM type - TSI types enable defining variables or formulas for doing computations, they are associated with a given TSI instance. A type can have one or more variables.
* TSM hierarchy - Hierarchies are systematic organizations of your data. Hierarchies depict the relationships between different entities in your TSI data.
* TSM instance - Instances are the time series themselves. In most cases, this will be the **DeviceID** or **AssetID**, which is the unique identifier of the asset in the environment.

To learn more about the TSM, read [Azure Time Series update Times Series Models](./time-series-insights-update-tsm.md).

## Time Series Insights update Model Search Panel

The model search panel allows you to easily search and navigate your TSM hierarchy to find the specific time series instances you want to display on your chart. When you select your instances, they are not only added to the current chart but are also added to the data well.

  ![explorer-four][4]

## Time Series Insights update well

The well displays instance fields and other metadata associated with selected time series instances. The checkboxes on the right-hand side allow you to hide or display specific instances from the current chart. You can also remove specific data elements from your current data well by clicking the red x control to the right of the element.

  ![explorer-five][5]

You can also pop out the telemetry panel to get a better vertical view of the elements in your data well.

  ![explorer-six][6]

Note: if you see the following icon, the instance does not have any data during the timespan selected.  To fix, you can increase the timespan selected and/or confirm that the instance is pushing data.

  ![explorer-seven][7]

## Time Series Insights update Chart

The chart enables you to display time series instances as lines. You can collapse the environment panel, data model, and time span control panel by clicking the web controls to make the chart larger.

  ![explorer-eight][8]

1. Selected Date range – The currently selected date range for the chart panel, this controls which data elements will be available for visualization.

1. Inner Date range slider tool - Use the two endpoint controls by clicking and dragging them over the desired time span.

1. Time span collapse control - This control collapses and expands the time span panel editor.

1. Y-Axis format control – Click this control to cycle through the available Y-Axis view options. The available Y-Axis view options are:

    * Default  - each line has an individual Y-axis
    * Stacked – this allows you to stack multiple lines on the same Y-axis, with the Y-axis data changing based on the line selected
    * Shared – All Y-axis data displayed together

1. Current data element – The currently selected data element and its associated details.

You can further drill into a specific data slice by left-clicking a data point on the current graph while holding down the mouse and then dragging the selected area to the endpoint of your choice. Right-click the greyed, selected area, and click zoom as shown below. You can also:

  ![explorer-nine][9]

After performing the zoom action, you will now see your selected data set. Click on the Y-axis format control to cycle through the three different Y-axis representations of your TSI data.

  ![explorer-ten][10]

Here you can see an example of a shared Y-axes.

  ![explorer-eleven][11]

## Time Series Insights update Time Editor Panel

When working with TSI you first will select a time span. The selected time span will control the data set that is available for manipulation with the TSI update widgets. The following web controls are available in the TSI update for selecting your working time span.

  ![explorer-twelve][12]

1. **Inner-date range slider tool** - Use the two endpoint controls by clicking and dragging them over the desired time span. This “Inner Date” range will be constrained by the “Outer Date” range slider control referred to below.

1. Increase and decrease date range buttons** - Increase or decrease your time span by clicking either button for the interval you want.

1. **Time span collapse control** - This web control allows you to hide all the controls except for the Inner Date range slider tool.

1. **Outer-date range slider control** - Using the endpoint controls select the Outer Date range which will be available for your "Inner Date" range control.

1. **Quick times date range drop down** - Gives you the ability to quickly switch between preset time span selections such as the last 30 minutes, the last 12 hours, custom range, etc. Changing this value also changes the available interval ranges discussed in the interval size slider tool next.

1. **Interval-size slider tool** - The interval size slider tool enables you to zoom in and out of intervals over the same time span. This provides more precise control of movement between large slices of time that show smooth trends down to slices as small as the millisecond, allowing you to see granular, high-resolution cuts of your data. The slider’s default starting point is set as the most optimal view of the data from your selection; balancing resolution, query speed, and granularity.

1. **Date range to and from web control** - With this web control you can easily click and select your desired date and time ranges. You can also use the control to switch between different Time Zones. After you make the changes you would like to apply to your current work space click the save button.

  ![explorer-thirteen][13]

## Time Series Insights update navigation panel

The TSI update navigation panel provides the following functionality:

  ![explorer-fourteen][14]

### Current session share link control

  ![explorer-fifteen][15]

Click the circled link web control to generate a URL to save or share your current Time Series Insights working session which includes:

* Currently selected time range
* Currently selected interval size
* Currently selected data well

### Tenant section

  ![explorer-sixteen][16]

* Displays your current TSI login account information
* Allows you switch between the available TSI themes.

### Theme selection

The Azure TSI update supports two themes:

* **Light Theme**: This is the default theme shown throughout this document.
* **Dark theme**:  This option renders the explorer into a dark theme as shown below:

  ![explorer-seventeen][17]

Here you can also change between supported languages.

## S1/S2 Environment Controls

### Time Series Insights update Terms Panel

This section just applies to existing S1/S2 environments attempting to use the explorer in the updated UI. You might want to do this to use the GA product and update (Preview) in conjunction with one another. We’ve added some functionality from the existing UI to the updated explorer, but know you can always get the full UI experience for S1/S2 environment in the existing TSI Explorer.  

In lieu of the hierarchy, you will see the TSI terms panel. This is where you define queries in your environment. It gives you the ability to filter your data based using a predicate.

  ![explorer-eighteen][18]

The TSI update Terms Editor Panel takes the following parameters

**Where**: The where clause enables you to quickly filter your events using the set of operands listed below. If you conduct a search by selecting/clicking, the predicate will automatically update based on that search. Supported operand types include:

| Operation	| Supported types	| Notes |
| --- | --- | --- |
| `<`, `>`, `<=`, `>=` |	Double, DateTime, TimeSpan	| |
| `=`, `!=`, `<>`	| String, Bool, Double, DateTime, TimeSpan, NULL	|
| `IN` |	String, Bool, Double, DateTime, TimeSpan, NULL |	All operands should be of the same type or be NULL constant. |
| `HAS` |	String |	Only constant string literals are allowed at right-hand side. Empty string and NULL are not allowed. |

### Examples of Where clauses

  ![explorer-nineteen][19]

**Measure**: This drop down shows all numeric columns (**Doubles**) that you can use as elements for your current chart.

**Split by**: This drop down shows all of the categorical columns (Strings) in your model available, that you can use to group your data by. 
You can add up to five terms to view on the same X-axis. Enter your desired parameters and then use the **Add** button to add a fresh term.

  ![explorer-twenty][20]

You can hide and show elements from the chart panel by clicking on the visible icon as shown below. You can completely remove queries by clicking the red `X` shown below.

  ![explorer-twenty-one][21]

## Next steps

Read the [Azure TSI Update Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about the new [Time Series Models](./time-series-insights-update-tsm.md).

<!-- Images -->
[1]: media/v2-update-explorer/explorer-one.png
[2]: media/v2-update-explorer/explorer-two.png
[3]: media/v2-update-explorer/explorer-three.png
[4]: media/v2-update-explorer/explorer-four.png
[5]: media/v2-update-explorer/explorer-five.png
[6]: media/v2-update-explorer/explorer-six.png
[7]: media/v2-update-explorer/explorer-seven.png
[8]: media/v2-update-explorer/explorer-eight.png
[9]: media/v2-update-explorer/explorer-nine.png
[10]: media/v2-update-explorer/explorer-ten.png
[11]: media/v2-update-explorer/explorer-eleven.png
[12]: media/v2-update-explorer/explorer-twelve.png
[13]: media/v2-update-explorer/explorer-thirteen.png
[14]: media/v2-update-explorer/explorer-fourteen.png
[15]: media/v2-update-explorer/explorer-fifteen.png
[16]: media/v2-update-explorer/explorer-sixteen.png
[17]: media/v2-update-explorer/explorer-seventeen.png
[18]: media/v2-update-explorer/explorer-eighteen.png
[19]: media/v2-update-explorer/explorer-nineteen.png
[20]: media/v2-update-explorer/explorer-twenty.png
[21]: media/v2-update-explorer/explorer-twenty-one.png