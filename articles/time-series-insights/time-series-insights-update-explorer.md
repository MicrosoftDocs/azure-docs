---
title: The Azure Time Series Insights V2 Update Explorer | Microsoft Docs
description: The Azure Time Series Insights V2 Update Explorer
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/21/2018
---

# The Azure Time Series Insights V2 Update Explorer

This article describes features and options available within The Azure Time Series Insights V2 Update Explorer web application.

## Prerequisites

Before you use The Azure Time Series Insights V2 Update Explorer, you must:

* Have a Time Series Insights environment provisioned. Learn more about provisioning a Time Series Insights environment here.
* Provide data access to the Time Series Insights environment you created for the account. Access can be supplied to others as well as yourself.
* Add an event source to the Time Series Insights environment to push data to the environment.

## Learn About The Azure Time Series Insights V2 Update Explorer

  ![tsi-update-explorer][1]

Time Series Insights Update explorer is broken up into the following seven elements:

1. Time Series Insights Update environment pane - displays all your Time Series Insights environments.
1. Time Series Insights Update navigation bar - allows you to switch between analytics and model pages.
1. Time Series Insights Update hierarchy tree - select specific data elements to be charted.
1. Time Series Insights Update time series well - shows all your currently selected data elements.
1. Time Series Insights Update chart panel - your current working chart.
1. Time Series Insights Update timeline - this allows you to modify your working time span.
1. Time Series Insights Update app bar – contains your user management options (like current tenant), and allows you to change theme and language settings.
1. Time Series Insights Update Environment Panel

    The environment panel displays all the Time Series Insights environments you have access to. This includes a listing of Pay as you go environments (Preview) as well as S1/S2 environments (GA). Simply click the Time Series Insights environment you want to use to immediately be taken there.

      ![tsi-update-nav][2]

      ![tsi-update-menu][3]

     ![tsi-update-menu][4]

## Time Series Insights Update Navigation Menu

  ![tsi-update-seven][5]

  ![tsi-update-eight][6]

The navigation menu allows you to switch between the Time Series Insights applications:

* Analyze – Allows you to chart & perform rich analytics on your modeled or unmodeled time series data.

* Model - Allows you to push new Time Series Insights update types, hierarchies, and instances to your Time Series Insights model.

## Time Series Insights Update Model Authoring

This application gives you the ability to perform CRUD operations on your Time Series Model.  

* TSM type - Time Series Insights types enable defining variables or formulas for doing computations, they are associated with a given Time Series Insights instance. A type can have one or more variables.
* TSM hierarchy - Hierarchies are systematic organizations of your data. Hierarchies depict the relationships between different entities in your Time Series Insights data.
* TSM instance - Instances are the time series themselves. In most cases, this will be the DeviceID or AssetID, which is the unique identifier of the asset in the environment.

To learn more about the TSM please see this article.

## Time Series Insights Update Model Search Panel

The model search panel allows you to easily search and navigate your TSM hierarchy to find the specific time series instances you want to display on your chart. When you select your instances, they are not only added to the current chart but are also added to the data well.

  ![tsi-update-seven][7]

  ![tsi-update-eight][8]

## Time Series Insights Update Well

The well displays instance fields and other metadata associated with selected time series instances. The checkboxes on the right-hand side allow you to hide or display specific instances from the current chart. You can also remove specific data elements from your current data well by clicking the red x control to the right of the element.

  ![tsi-update-nine][9]

You can also pop out the telemetry panel to get a better vertical view of the elements in your data well.

  ![tsi-update-ten][10]

Note – if you see the following icon, the instance does not have any data during the timespan selected.  To fix, you can increase the timespan selected and/or confirm that the instance is pushing data.

  ![tsi-update-eleven][11]

## Time Series Insights Update Chart

The chart enables you to display time series instances as lines.  You can collapse the environment panel, data model, and time span control panel by clicking the web controls to make the chart larger.

  ![tsi-update-twelve][12]

1. Selected Date range – The currently selected date range for the chart panel, this controls which data elements will be available for visualization.

1. Inner Date range slider tool - Use the two endpoint controls by clicking and dragging them over the desired time span.

1. Time span collapse control - This control collapses and expands the time span panel editor.

1. Y-Axis format control – Click this control to cycle through the available Y-Axis view options. The available Y-Axis view options are:

    * Default  - each line has an individual Y-axis
    * Stacked – this allows you to stack multiple lines on the same Y-axis, with the Y-axis data changing based on the line selected
    * Shared – All Y-axis data displayed together
1. Current data element – The currently selected data element and its associated details.

You can further drill into a specific data slice by left-clicking a data point on the current graph while holding down the mouse and then dragging the selected area to the endpoint of your choice. Right-click the greyed, selected area, and click zoom as shown below. You can also

  ![tsi-update-thirteen][13]
 
After performing the zoom action, you will now see your selected data set. Click on the Y-axis format control to cycle through the three different Y-axis representations of your Time Series Insights data.

  ![tsi-update-fourteen][14]

Here you can see an example of a shared Y-axes.

  ![tsi-update-fifteen][15]

## Time Series Insights Update Time Editor Panel
 
When working with Time Series Insights you first will select a time span. The selected time span will control the data set that is available for manipulation with the Time Series Insights update widgets. The following web controls are available in the Time Series Insights update for selecting your working time span.

  ![tsi-update-sixteen][16]
 
1. **Inner-date range slider tool** - Use the two endpoint controls by clicking and dragging them over the desired time span. This “Inner Date” range will be constrained by the “Outer Date” range slider control referred to below.

1. Increase and decrease date range buttons** - Increase or decrease your time span by clicking either button for the interval you want

1. **Time span collapse control** - This web control allows you to hide all the controls except for the Inner Date range slider tool.

1. **Outer-date range slider control** - Using the endpoint controls select the Outer Date range which will be available for your Inner Date range control.

1. **Quick times date range drop down** - Gives you the ability to quickly switch between preset time span selections such as the last 30 minutes, the last 12 hours, Custom range, etc. Changing this value also changes the available interval ranges discussed in the Interval size slider tool next.

1. **Interval-size slider tool** - The Interval size slider tool enables you to zoom in and out of intervals over the same time span. This provides more precise control of movement between large slices of time that show smooth trends down to slices as small as the millisecond, allowing you to see granular, high-resolution cuts of your data. The slider’s default starting point is set as the most optimal view of the data from your selection; balancing resolution, query speed, and granularity.

1. **Date range to and from web control** - With this web control you can easily click and select your desired date and time ranges. You can also use the control to switch between different Time Zones. After you make the changes you would like to apply to your current work space click the save button.

  ![tsi-update-seventeen][17]

## Time Series Insights Update navigation panel

The Time Series Insights update navigation Panel provides the following functionality:

  ![tsi-update-nineteen][19]

### Current session share link control

  ![tsi-update-twenty][20]

Click the circled link web control to generate a URL to save or share your current Time Series Insights working session which includes:

* Currently selected time range
* Currently selected interval size
* Currently selected data well

### Tenant Section

  ![tsi-update-twentyone][21]

* Displays your current Time Series Insights login account information
* Allows you switch between the available Time Series Insights themes.

### Theme selection

The Azure Time Series Insights V2 Update supports two themes:

* **Light Theme**: This is the default theme shown throughout this document.
* **Dark theme**:  This option renders the explorer into a dark theme as shown below:

  ![tsi-update-twentytwo][22]

Here you can also change between supported languages.

## S1/S2 Environment Controls

### Time Series Insights Update Terms Panel
 
This section just applies to existing S1/S2 environments attempting to use the explorer in the updated UI.  You might want to do this to use the GA product and Update (Preview) in conjunction with one another.  We’ve added some functionality from the existing UI to the updated explorer, but know you can always get the full UI experience for S1/S2 environment in the existing Time Series Insights explorer.  

In lieu of the hierarchy, you will see the Time Series Insights terms panel.  This is where you define queries in your environment. It gives you the ability to filter your data based using a predicate. 

  ![tsi-update-twentythree][23]
 
The Time Series Insights update Terms Editor Panel takes the following parameters

**Where**: The where clause enables you to quickly filter your events using the set of operands listed below. If you conduct a search by selecting/clicking, the predicate will automatically update based on that search. Supported operand types include:

| Operation	| Supported types	| Notes |
| --- | --- | --- |
| <, >, <=, >= |	Double, DateTime, TimeSpan	| |
| =, !=, <>	| String, Bool, Double, DateTime, TimeSpan, NULL	|
| IN |	String, Bool, Double, DateTime, TimeSpan, NULL |	All operands should be of the same type or be NULL constant. |
| HAS |	String |	Only constant string literals are allowed at right-hand side. Empty string and NULL are not allowed. |

### Examples of Where clauses

  ![tsi-update-twentyfour][24]

**Measure**: This drop down shows all numeric columns (Doubles) that you can use as elements for your current chart.

**Split by**: This drop down shows all of the categorical columns (Strings) in your model available, that you can use to group your data by. 
You can add up to five terms to view on the same X-axis. Enter your desired parameters and then use the **Add** button to add a fresh term.

  ![tsi-update-twentyfive][25]

You can hide and show elements from the chart panel by clicking on the visible icon as shown below. You can completely remove queries by clicking the red x shown below.

  ![tsi-update-twentysix][26]

## Next steps

Read the [Azure TSI Update Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about the new [Time Series Model](./time-series-insights-update-tsm.md).

<!-- Images -->
[1]: media/v2-update-explorer/tsi-update-one.png
[2]: media/v2-update-explorer/tsi-update-two.png
[3]: media/v2-update-explorer/tsi-update-three.png
[4]: media/v2-update-explorer/tsi-update-four.png
[5]: media/v2-update-explorer/tsi-update-five.png
[6]: media/v2-update-explorer/tsi-update-six.png
[7]: media/v2-update-explorer/tsi-update-seven.png
[8]: media/v2-update-explorer/tsi-update-eight.png
[9]: media/v2-update-explorer/tsi-update-nine.png
[10]: media/v2-update-explorer/tsi-update-ten.png
[11]: media/v2-update-explorer/tsi-update-eleven.png
[12]: media/v2-update-explorer/tsi-update-twelve.png
[13]: media/v2-update-explorer/tsi-update-thirteen.png
[14]: media/v2-update-explorer/tsi-update-fourteen.png
[15]: media/v2-update-explorer/tsi-update-fifteen.png
[16]: media/v2-update-explorer/tsi-update-sixteen.png
[17]: media/v2-update-explorer/tsi-update-seventeen.png
[18]: media/v2-update-explorer/tsi-update-eighteen.png
[19]: media/v2-update-explorer/tsi-update-nineteen.png
[20]: media/v2-update-explorer/tsi-update-twenty.png
[21]: media/v2-update-explorer/tsi-update-twentyone.png
[22]: media/v2-update-explorer/tsi-update-twentytwo.png
[23]: media/v2-update-explorer/tsi-update-twentythree.png
[24]: media/v2-update-explorer/tsi-update-twentyfour.png
[25]: media/v2-update-explorer/tsi-update-twentyfive.png
[26]: media/v2-update-explorer/tsi-update-twentysix.png