---
title: View Azure Maps API usage metrics
titleSuffix: Microsoft Azure Maps
description: Discover how to monitor Azure Maps API usage metrics, including total requests, total errors, and availability. Learn how to filter data and break down results for better insights.
author: sinnypan
ms.author: sipa
ms.date: 03/31/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: general
---

# View Azure Maps API usage metrics

This article guides you on how to view API usage metrics for your Azure Maps account in the [Azure portal]. The metrics are displayed in an easy-to-read graph format over a customizable time period.

## View metric snapshot

The **Overview** page of your Maps account displays key metrics such as *Total Requests*, *Total Errors*, and *Availability* over a selectable time period.

![Azure Maps usage metrics overview](media/how-to-view-api-usage/portal-overview.png)

Proceed to the next section to customize these graphs for your specific analysis needs.

## View detailed metrics

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select the **All resources** menu item on the left-hand side and navigate to your *Azure Maps Account*.

3. Once your Maps account is open, select the **Metrics** menu on the left.

4. In the **Metrics** pane, choose one of the following options:

   1. **Availability** - displays the Average API availability over a specified time period.
   2. **Usage** - displays the usage count for your account.

      ![Azure Maps usage metrics pane](media/how-to-view-api-usage/portal-metrics.png)

5. The default time range is **Last 24 hours (Automatic)**. To change this, select the default value to open the _Time Range_ pop-up, which displays all available settings. You can change the *Time granularity* and show the time as *local* or *GMT*. Once the desired options are chosen, select **Apply**.

    ![Azure Maps metrics time range](media/how-to-view-api-usage/time-range.png)

    > [!NOTE]
    > Metrics are stored for 93 days, but you can only query up to 30 days' worth of data at a time. If you encounter a blank chart or partial metric data, ensure the start and end dates in the time picker don't exceed a 30-day interval. Once you've selected a 30-day interval, you can pan the chart to view other metrics. For more information, see [Troubleshooting metrics charts](/azure/azure-monitor/essentials/data-platform-metrics).

6. After adding your metric, you can apply a filter based on the properties relevant to that metric. Then, choose the value of the property you want to display on the graph.

    ![Azure Maps usage metrics Filter](media/how-to-view-api-usage/filter.png)

7. You can also **Apply splitting** for your metric based on your selected metric property. This feature allows the graph to be divided into multiple graphs, each representing a different value of that property. In the following example, the color of each graph corresponds to the property value displayed at the bottom.

    ![Azure Maps usage metrics splitting](media/how-to-view-api-usage/splitting.png)

8. You can also view multiple metrics on the same graph by selecting the **Add metric** button.

## Next steps

Discover more about the Azure Maps APIs you wish to monitor:

> [!div class="nextstepaction"]
> [Azure Maps Web SDK How-To]

> [!div class="nextstepaction"]
> [Azure Maps REST API documentation]

[Azure portal]: https://portal.azure.com
[Azure Maps Web SDK How-To]: how-to-use-map-control.md
[Azure Maps REST API documentation]: /rest/api/maps
