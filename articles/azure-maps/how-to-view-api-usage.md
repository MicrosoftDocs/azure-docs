---
title: How to view the Azure Maps API usage | Microsoft Docs 
description: Learn how to view the metrics for your Azure Maps API calls in the portal.
author: dsk-2015
ms.author: dkshir
ms.date: 08/03/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# How to view the Azure Maps API usage
This article shows you how to view the API usage metrics for your Azure Maps account in the [portal](portal.azure.com). The metrics are shown in a convenient graph format along your prefered time duration. 

## View metric snapshot 

You can see some common metrics on the **Overview** page of your Maps account. It currently shows *Total Requests*, *Total Errors*, and *Availability* over a selectable time duration. 

![Azure Maps Metrics Overview](media/how-to-view-api-usage/portal-overview.png)

Continue to the next section if you need to customize these graphs for your particular analysis.


## Navigate to your Azure Maps account 

1. Login to your Azure subscription in the [portal](portal.azure.com). 

2. Click the **All resources** menu item on the left hand side and navigate to your *Azure Maps Account*.

3. Once your Maps account is open, click on the **Metrics** menu on the left.

4. On the **Metrics** pane, choose between one of the following:
    a. **Availability** which shows the *Average* of API availability over a period of time, or 
    b. **Usage** which shows how the usage *Count* for your account. 

    ![Azure Maps Metrics pane](media/how-to-view-api-usage/portal-metrics.png)

5. Once you have selected the metrics, you may select the *Time range* by selecting on the **Last 12 hours (Automatic)** which is the default value. You may also select the *Time granularity*, as well as choose to show the time as *local* or *GMT* in the same drop-down. Click **Apply**.

    ![Azure Maps Metrics Time range](media/how-to-view-api-usage/time-range.png)
 
6. Once you add your metric, you can then **Add filter** from amongst the properties relevant to that metric, and then select the value of the property that you want to see the graph for. 

    ![Azure Maps Metrics Filter](media/how-to-view-api-usage/filter.png)

7. You may also **Apply splitting** for your metric based on your selected metric property. This allows the graph to be split into multiple graphs, one each for each value of that property. For example, see this graph. Note the color of each graph corresponds to the property value shown at the bottom of the graph.

    ![Azure Maps Metrics Splitting](media/how-to-view-api-usage/splitting.png)
 
8. You may also observe multiple metrics on the same graph, simply by clicking on the **Add metric** button on top.


