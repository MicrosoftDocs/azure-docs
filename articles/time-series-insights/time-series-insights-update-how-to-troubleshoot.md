---
title: 'Diagnose and troubleshoot the Azure Time Series Insights Preview | Microsoft Docs'
description: Understand how to diagnose and troubleshoot with the Azure Time Series Insights Preview.
author: ashannon7
ms.author: dpalled
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 04/30/2019
ms.custom: seodec18
---

# Diagnose and troubleshoot

This article summarizes several common problems you might encounter when you work with your Azure Time Series Insights Preview environment. The article also describes potential causes and solutions for each problem.

## Problem: I can’t find my environment in the Preview explorer

This problem might occur if you don’t have permissions to access the Time Series Insights environment. Users need a reader-level access role to view their Time Series Insights environment. To verify the current access levels and grant additional access, visit the Data Access Policies section on the Time Series Insights resource in the [Azure portal](https://portal.azure.com/).

  [![Environment](media/v2-update-diagnose-and-troubleshoot/environment.png)](media/v2-update-diagnose-and-troubleshoot/environment.png#lightbox)

## Problem: no data is seen in the Preview explorer

There are several common reasons why you might not see your data in the [Azure Time Series Insights Preview explorer](https://insights.timeseries.azure.com/preview).

- Your event source might not be receiving data.

    Verify that your event source, which is an event hub or an IoT hub, is receiving data from your tags or instances. To verify, go to the overview page of your resource in the Azure portal.

    [![Dashboard-insights](media/v2-update-diagnose-and-troubleshoot/dashboard-insights.png)](media/v2-update-diagnose-and-troubleshoot/dashboard-insights.png#lightbox)

- Your event source data isn't in JSON format.

    Time Series Insights supports only JSON data. For JSON samples, see [Supported JSON shapes](./how-to-shape-query-json.md).

- Your event source key is missing a required permission.

  * For an IoT hub, you need to provide the key that has **service connect** permission.

    [![Configuration](media/v2-update-diagnose-and-troubleshoot/configuration.png)](media/v2-update-diagnose-and-troubleshoot/configuration.png#lightbox)

  * As shown in the preceding image, both of the policies **iothubowner** and **service** work because they have **service connect** permission.
  * For an event hub, you need to provide the key that has **Listen** permission.
  
    [![Permissions](media/v2-update-diagnose-and-troubleshoot/permissions.png)](media/v2-update-diagnose-and-troubleshoot/permissions.png#lightbox)

  * As shown in the preceding image, both of the **read** and **manage** policies work because they have **Listen** permission.

- Your consumer group provided isn't exclusive to Time Series Insights.

    During registration of an IoT hub or event hub, you specify the consumer group that's used to read the data. Don't share that consumer group. If the consumer group is shared, the underlying event hub automatically disconnects one of the readers at random. Provide a unique consumer group for Time Series Insights to read from.

- Your Time Series ID property specified at the time of provisioning is incorrect, missing, or null.

    This problem might occur if the Time Series ID property is configured incorrectly at the time of provisioning the environment. For more information, see [Best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md). At this time, you can't update an existing Time Series Insights environment to use a different Time Series ID.

## Problem: some data shows, but some is missing

You might be sending data without the Time Series ID.

- This problem might occur when you send events without the Time Series ID field in the payload. For more information, see [Supported JSON shapes](./how-to-shape-query-json.md).

- This problem might occur because your environment is being throttled.

    > [!NOTE]
    > At this time, Time Series Insights supports a maximum ingestion rate of 6 Mbps.

## Problem: my event source's Timestamp property name doesn't work

Ensure that the name and value conform to the following rules:

* The Timestamp property name is case sensitive.
* The Timestamp property value that comes from your event source, as a JSON string, has the format `yyyy-MM-ddTHH:mm:ss.FFFFFFFK`. An example of such a string is `“2008-04-12T12:53Z”`.

The easiest way to ensure that your Timestamp property name is captured and working properly is to use the Time Series Insights Preview explorer. Within the Time Series Insights Preview explorer, use the chart to select a period of time after you provided the Timestamp property name. Right-click the selection, and select the **explore events** option. The first column header is your Timestamp property name. It should have `($ts)` next to the word `Timestamp`, rather than:

* `(abc)`, which indicates that Time Series Insights reads the data values as strings.
* Calendar icon, which indicates that Time Series Insights reads the data value as datetime.
* `#`, which indicates that Time Series Insights reads the data values as an integer.

If the Timestamp property isn’t explicitly specified, an event’s IoT hub or event hub Enqueued Time is used as the default time stamp.

## Problem: I can’t view or edit my Time Series Model

- You might be accessing a Time Series Insights S1 or S2 environment.

   Time Series Models are supported only in PAYG environments. For more information on how to access your S1/S2 environment from the Time Series Insights Preview explorer, see [Visualize data in the explorer](./time-series-insights-update-explorer.md).

   [![Access](media/v2-update-diagnose-and-troubleshoot/access.png)](media/v2-update-diagnose-and-troubleshoot/access.png#lightbox)

- You might not have permissions to view and edit the model.

   Users need contributor-level access to edit and view their Time Series Model. To verify the current access levels and grant additional access, visit the Data Access Policies section on your Time Series Insights resource in the Azure portal.

## Problem: all my instances in the Preview explorer lack a parent

This problem might occur if your environment doesn’t have a Time Series Model hierarchy defined. For more information, see [Work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

  [![Time Series Models](media/v2-update-diagnose-and-troubleshoot/tsm.png)](media/v2-update-diagnose-and-troubleshoot/tsm.png#lightbox)

## Next steps

- Read [Work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

- Learn about [supported JSON shapes](./how-to-shape-query-json.md).
