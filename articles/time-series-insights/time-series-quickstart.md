---
title: Azure Time Series Insights quickstart | Microsoft Docs
description: Get started with Azure Time Series Insights
keywords:  
services: tsi
documentationcenter:
author: v-mamcge
manager: jhubbard
editor: 

ms.assetid:
ms.service: tsi
ms.devlang: na
ms.topic: quick start connect
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/08/2017
ms.author: v-mamcge
---

# Azure Time Series Insights

Azure Time Series Insights is a fully managed analytics, storage, and visualization service that makes it simple to explore and analyze billions of IoT events simultaneously.  
It gives you a global view of your data, letting you quickly validate your IoT solution and avoid costly downtime to mission-critical devices by helping you discover hidden trends, 
spot anomalies, and conduct root-cause analyses in near real-time.  If you are building an application that needs to store or query time series data, you can develop using the 
Time Series Insights REST APIs.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Tutorial

For a tutorial that highlights the key features of Time Series Insights, see [https://insights.timeseries.azure.com/demo](https://insights.timeseries.azure.com/demo). 

1. In the Time Series Insights quick tour page, click **Next** to begin the quick tour.

   ![Click Next](media/quickstart/quickstart1.png)

2. The **Time selection panel** is displayed. Use this panel to select a time frame to visualize.

   ![Time selection panel](media/quickstart/quickstart2.png)

3. Click and drag in the region, then click the **Search** button.
 
   ![Select a time frame](media/quickstart/quickstart3.png) 

   Time Series Insights displays a chart visualization for the time frame you specified. You can do a lot of things with the line chart, including filtering, pinning, sorting, and stacking. 

   To return to the **Time selection panel**, click the down arrow as shown:

    ![Chart](media/quickstart/quickstart4.png)

4. Click **Add** in the **Terms panel** to add a new search term.

   ![Add item](media/quickstart/quickstart5.png)

5. In the chart, you can select a region, right-click the region, and select **Explore Events**.
 
   ![Explore Events](media/quickstart/quickstart6.png)

   A grid of your raw data is displayed from the region you are exploring:

   ![Grid view](media/quickstart/quickstart7.png)

6. You can edit your terms to change the values in the chart, or add another term to cross-correlate different types of values:

   ![Add a term](media/quickstart/quickstart8.png)

7. Enter a filter term in the **Filter series...** box for ad-hoc series filtering. For the tutorial, enter **Station5** to cross-correlate temperature and pressure for that station.
 
   ![Filter series](media/quickstart/quickstart9.png)

After you finish the quick start, you can experiment with the sample data set to create different visualizations. 

## Next steps

- [Plan your environment](time-series-insights-environment-planning.md)
- [Create an environment](time-series-insights-get-started.md)