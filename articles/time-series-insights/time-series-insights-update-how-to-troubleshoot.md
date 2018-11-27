---
title: How to diagnose and troubleshoot the Azure Time Series Insights update | Microsoft Docs
description: Understanding how to diagnose and troubleshoot with the Azure Time Series Insights update
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/27/2018
---

# How to diagnose and troubleshoot

This article summarizes several common problems you might encounter working with your Azure Time Series Insights (TSI) environment. The article also describes potential causes and solutions for each.

## Problem: No data is seen in the Time Series Insights update Explorer

There are several common reasons why you might not see your data in the Azure TSI Explorer:

1. Your event source may not be receiving data.

    Verify that your event source (Event Hub or IoT Hub) is receiving data from your tags / instances. You can do so by navigating to the overview page of your resource in the Azure portal.

    ![dashboard-insights][1]

1. Your event source data is not in JSON format

    Azure TSI supports only JSON data. For JSON samples, see [Supported JSON shapes](./how-to-shape-query-json.md).

1. Your event source key is missing a required permission

    ![configuration][2]

    * For an IoT Hub, you need to provide the key that has service connect permission.
    * As shown in the preceding image, either of the policies *iothubowner* and service would work, because both have service connect permission.
    * For an event hub, you need to provide the key that has Listen permission.
    * As shown in the preceding image, either of the policies read and manage would work, because both have Listen permission.

    ![permissions][3]

1. Your consumer group provided is not exclusive to TSI

    During registration of am IoT Hub or an event hub, you specify the consumer group that should be used for reading the data. This consumer group must not be shared. If the consumer group is shared, the underlying event hub automatically disconnects one of the readers randomly. Provide a unique consumer group for TSI to read from.

## Problem: Some data is shown, but some is missing

This may occur because your environment is being throttled. At this time, we support a maximum ingestion rate of 6 MBps.

## Problem: My event source's timestamp property name setting doesn't work

Ensure that the name and value conform to the following rules:

* The **Timestamp** property name is case-sensitive.
* The **Timestamp** property value that's coming from your event source, as a JSON string, should have the format `yyyy-MM-ddTHH:mm:ss.FFFFFFFK`. An example of such a string is `“2008-04-12T12:53Z”`.

The easiest way to ensure that your timestamp property name is captured and working properly is to use the TSI explorer. Within the TSI explorer, use the chart to select a period of time after you provided the timestamp property name. Right-click the selection and choose the **explore events** option. The first column header should be your **Timestamp** property name and it should have a `($ts)` next to the word `Timestamp`, rather than:

* `(abc)`, which would indicate TSI is reading the data values as strings
* Calendar icon, which would indicate TSI is reading the data value as datetime
* `#`, which would indicate TSI is reading the data values as an integer

## Problem: My Time Series ID property is incorrect, missing, or null

This may occur if the **Time Series ID** property is configured incorrectly at the time of provisioning the environment. Please see this article for best practices on choosing a **Time Series ID**. At this time, you cannot update an existing TSI update environment to use a different **Time Series ID**.

## Problem: All my instances in Time Series Insights Update explorer don’t have a parent

This may occur if your environment doesn’t have a **Time Series Model** Hierarchy defined. See this article for more information on [How to work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

## Next steps

* Read [How to work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

* Read [Supported JSON shapes](./how-to-shape-query-json.md).

<!-- Images -->
[1]: media/v2-update-diagnose-and-troubleshoot/dashboard-insights.png
[2]: media/v2-update-diagnose-and-troubleshoot/configuration.png
[3]: media/v2-update-diagnose-and-troubleshoot/permissions.png