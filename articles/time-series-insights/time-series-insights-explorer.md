---
title: 'Explore data using the Azure Time Series Insights explorer | Microsoft Docs'
description: This article describes how to use the Azure Time Series Insights explorer in your web browser to quickly see a global view of your big data and validate your IoT environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: dpalled
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 05/07/2019
ms.custom: seodec18
---

# Azure Time Series Insights explorer

This article describes the features and options in General Availability for the Azure Time Series Insights [explorer web app](https://insights.timeseries.azure.com/). The Time Series Insights explorer demonstrates the powerful data visualization capabilities provided by the service and can be accessed within your own environment.

Azure Time Series Insights is a fully managed analytics, storage, and visualization service that makes it simple to explore and analyze billions of IoT events simultaneously. It gives you a global view of your data, which lets you quickly validate your IoT solution and avoid costly downtime to mission-critical devices. You can discover hidden trends, spot anomalies, and conduct root-cause analyses in near real time. The Time Series Insights explorer is currently in public preview.

> [!TIP]
> For a guided tour through the demonstration environment, read the [Azure Time Series Insights Quickstart](time-series-quickstart.md).

## Video

### Learn about querying data using the Time Series Insights explorer. </br>

> [!VIDEO https://www.youtube.com/embed/SHFPZvrR71s]

>[!NOTE]
>See the preceding video <a href="https://www.youtube.com/watch?v=6ehNf6AJkFo">"Getting started with TSI using an Azure IoT Solution Accelerator"</a>.

## Prerequisites

Before you can use Time Series Insights explorer, you must:

- Create a Time Series Insights environment. For more information, see [How to get started with Time Series Insights](./time-series-insights-get-started.md).
- [Provide access](time-series-insights-data-access.md) to your account in the environment.
- Add an [IoT Hub](time-series-insights-how-to-add-an-event-source-iothub.md) or [Event Hub](time-series-insights-how-to-add-an-event-source-eventhub.md) event source to it.

## Explore and query data

Within minutes of connecting your event source to your Time Series Insights environment, you can explore and query your time series data.

1. To start, open the [Time Series Insights explorer](https://insights.timeseries.azure.com/) in your web browser, and select an environment on the left side of the window. All environments that you have access to are listed in alphabetical order.

1. Once you select an environment, either use the **FROM** and **TO** configurations at the top, or click and drag over your desired time span.  Click the magnifying glass at the top right, or right-click over the selected timespan and select **Search**.  

1. You can also refresh availability automatically every minute, by selecting the **Auto On** button. The **Auto-On** button only applies to the availability chart, not the content of the main visualization.

1. Notice, the Azure cloud icon takes you to your environment in the Azure portal.

   [![Time Series Insights environment](media/time-series-insights-explorer/explorer1.png)](media/time-series-insights-explorer/explorer1.png#lightbox)

1. Next, you see a chart that shows a count of all events during the selected timespan.  Here you have a number of controls:

    **Terms Editor Panel**:  The term space is where you query your environment.  It’s found on the left-hand side of the screen:
      - **Measure**:  This drop down shows all numeric columns (**Doubles**)
      - **Split By**: This drop down shows categorical columns (**Strings**)
      - You can enable step interpolation, show minimum and maximum, and adjust the Y-axis from the control panel next to measure.  Additionally, you can adjust whether data shown is a count, average, or sum of the data.
      - You can add up to five terms to view on the same X-axis.  Use the **copy-down** button to add an additional term or click the **Add** button to add a fresh term.

        [![Terms Editor panel](media/time-series-insights-explorer/explorer2.png)](media/time-series-insights-explorer/explorer2.png#lightbox)

      - **Predicate**:  The predicate enables you to quickly filter your events using the set of operands listed below. If you conduct a search by selecting/clicking, the predicate will automatically update based on that search. Supported operand types include:

         |Operation  |Supported types  |Notes  |
         |---------|---------|---------|
         |`<`, `>`, `<=`, `>=`     |  Double, DateTime, TimeSpan       |         |
         |`=`, `!=`, `<>`     | String, Bool, Double, DateTime, TimeSpan, NULL        |         |
         |IN     | String, Bool, Double, DateTime, TimeSpan, NULL        |  All operands should be of the same type or be NULL constant.        |
         |HAS     | String        |  Only constant string literals are allowed at right-hand side. Empty string and NULL are not allowed.       |

      - **Examples of queries**

         [![Example queries](media/time-series-insights-explorer/explorer9.png)](media/time-series-insights-explorer/explorer9.png#lightbox)

1. The **Interval Size** slider tool enables you to zoom in and out of intervals over the same timespan.  This provides more precise control of movement between large slices of time that show smooth trends down to slices as small as the millisecond, allowing you to see granular, high-resolution cuts of your data. The slider’s default starting point is set as the most optimal view of the data from your selection; balancing resolution, query speed, and granularity.

1. The **Time brush** tool makes it easy to navigate from one time span to another, putting intuitive UX front and center for seamless movement between time ranges.

1. The **Save** command lets you save your current query and enable it for sharing with other users of the environment. Using **Open**, you can see all of your saved queries and any shared queries of other users in environments you have access to.

   [![Queries](media/time-series-insights-explorer/explorer3.png)](media/time-series-insights-explorer/explorer3.png#lightbox)

## Visualize data

1. The **Perspective View** tool provides a simultaneous view of up to four unique queries. You can find the perspective view button in the upper right corner of the chart.  

   [![Perspective view](media/time-series-insights-explorer/explorer4.png)](media/time-series-insights-explorer/explorer4.png#lightbox)

1. The **Chart** lets you visually explore your data. Chart tools include:

    - **Select/click**, which enables a selection of a specific timespan or of a single data series.  
    - Within a time span selection, you can zoom or explore events.  
    - Within a data series, you can split the series by another column, add the series as a new term, show only the selected series, exclude the selected series, ping that series, or explore events from the selected series.
    - In the filter area to the left of the chart, you can see all displayed data series and reorder by value or name, view all data series, or any pinned or unpinned series.  You can also select a single data series and split the series by another column, add the series as a new term, show only the selected series, exclude the selected series, pin that series, or explore events from the selected series.
    - When viewing multiple terms simultaneously, you can stack, unstack, see additional data about a data series, and use the same Y-axis across all terms with the buttons in the top right-hand corner of the chart.

    [![Chart tool](media/time-series-insights-explorer/explorer5.png)](media/time-series-insights-explorer/explorer5.png#lightbox)

1. The **heatmap** can be used to quickly spot unique or anomalous data series in a given query. Only one search term can be visualized as a heatmap.

    [![Heatmap](media/time-series-insights-explorer/explorer6.png)](media/time-series-insights-explorer/explorer6.png#lightbox)

1. **Events**:  When you choose explore events when selecting or right-clicking above, the events panel is made available.  Here, you can see all of your raw events and export your events as JSON or CSV files. Time Series Insights stores all raw data.

    [![Events](media/time-series-insights-explorer/explorer7.png)](media/time-series-insights-explorer/explorer7.png#lightbox)

1. Click the **STATS** tab after exploring events to expose patterns and column stats.  

    - **Patterns**: this feature proactively surfaces the most statistically significant patterns in a selected data region. This relieves you from having to look at thousands of events to understand what patterns most warrant time and energy. Further, Time Series Insights enables you to jump directly into these statistically significant patterns to continue conducting an analysis. This feature is also helpful for post-mortem investigations into historical data.

    - **Column Stats**:  Column stats provide charting and tables that break down data from each column of the selected data series over the selected time span.  

      [![STATS](media/time-series-insights-explorer/explorer8.png)](media/time-series-insights-explorer/explorer8.png#lightbox)

Now you have seen the various features and options available within the Time Series Insights explorer web app.

## Next steps

- Learn about [diagnosing and solving problems](time-series-insights-diagnose-and-solve-problems.md) in your Time Series Insights environment.

- Take the guided [Azure Time Series Insights Quickstart](time-series-quickstart.md) tour.
