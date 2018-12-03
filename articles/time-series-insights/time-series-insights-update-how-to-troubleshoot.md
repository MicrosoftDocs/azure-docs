---
title: How to diagnose and troubleshoot the Azure Time Series Insights (preview) | Microsoft Docs
description: Understanding how to diagnose and troubleshoot with the Azure Time Series Insights (preview) 
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/03/2018
---

# How to diagnose and troubleshoot

This article summarizes several common problems you might encounter working with your Azure Time Series Insights (TSI) environment. The article also describes potential causes and solutions for each.

## Problem: I can’t find my environment in the Time Series Insights (preview) explorer

This may occur if you don’t have permissions to access the TSI environment. Users will need “reader” level access role to view their TSI environment. You may verify the current access levels and grant additional access by visiting the Data Access Policies section on the TSI resource in [Azure Portal](https://portal.azure.com/).

  ![environment][1]

## Problem: No data is seen in the Time Series Insights (preview) explorer

There are several common reasons why you might not see your data in the [Azure TSI (preview) Explorer](https://insights.timeseries.azure.com/preview):

1. Your event source may not be receiving data.

    Verify that your event source (Event Hub or IoT Hub) is receiving data from your tags / instances. You can do so by navigating to the overview page of your resource in the Azure portal.

    ![dashboard-insights][2]

1. Your event source data is not in JSON format

    Azure TSI supports only JSON data. For JSON samples, see [Supported JSON shapes](./how-to-shape-query-json.md).

1. Your event source key is missing a required permission

    * For an IoT Hub, you need to provide the key that has service connect permission.

    ![configuration][3]

    * As shown in the preceding image, either of the policies *iothubowner* and service would work, because both have service connect permission.
    * For an event hub, you need to provide the key that has Listen permission.
  
    ![permissions][4]

    * As shown in the preceding image, either of the policies **read** and **manage** would work, because both have **Listen** permission.

1. Your consumer group provided is not exclusive to TSI

    During registration of an IoT Hub or Event Hub, you specify the consumer group that should be used for reading the data. That consumer group must not be shared. If the consumer group is shared, the underlying Event Hub automatically disconnects one of the readers randomly. Provide a unique consumer group for TSI to read from.

1. Your Time Series ID property specified at the time of provisioning is incorrect, missing, or null

    This may occur if the **Time Series ID** property is configured incorrectly at the time of provisioning the environment. Please see the [Best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md). At this time, you cannot update an existing Time Series Insights update environment to use a different **Time Series ID**.

## Problem: Some data is shown, but some is missing

1. You may be sending data without the Time Series ID

    This error may occur when you’re sending events without the Time Series ID field in the payload. See [Supported JSON shapes](./how-to-shape-query-json.md) for more information.

1. This may occur because your environment is being throttled.

    > [!NOTE]
    > At this time, Azure TSI supports a maximum ingestion rate of 6 MBps.

## Problem: My event source's timestamp property name setting doesn't work

Ensure that the name and value conform to the following rules:

* The **Timestamp** property name is case-sensitive.
* The **Timestamp** property value that's coming from your event source, as a JSON string, should have the format `yyyy-MM-ddTHH:mm:ss.FFFFFFFK`. An example of such a string is `“2008-04-12T12:53Z”`.

The easiest way to ensure that your timestamp property name is captured and working properly is to use the TSI explorer. Within the TSI explorer, use the chart to select a period of time after you provided the timestamp property name. Right-click the selection and choose the **explore events** option. The first column header should be your **Timestamp** property name and it should have a `($ts)` next to the word `Timestamp`, rather than:

* `(abc)`, which would indicate TSI is reading the data values as strings
* Calendar icon, which would indicate TSI is reading the data value as datetime
* `#`, which would indicate TSI is reading the data values as an integer

If the **Timestamp** property isn’t explicitly specified, we will leverage an event’s IoT Hub or Event Hub **Enqueued Time** as the default timestamp.

## Problem: I can’t edit or view my Time Series Model

1. You may be accessing a Time Series Insights S1 or S2 environment

   Time Series Models are supported only in `PAYG` environments. See this article for more information on accessing your S1/S2 environment from the Time Series Insights Update explorer.

   ![access][5]

1. You may not have permissions to view and edit the model

   Users need “contributor” level access to edit & view their Time Series Model. You may verify the current access levels and grant additional access by visiting the Data Access Policies section on your Time Series Insights resource in Azure Portal.

## Problem: All my instances in Time Series Insights (preview) explorer don’t have a parent

This may occur if your environment doesn’t have a **Time Series Model** Hierarchy defined. See this article for more information on [How to work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

  ![tsm][6]

## Next steps

Read [How to work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

Read [Supported JSON shapes](./how-to-shape-query-json.md).

<!-- Images -->
[1]: media/v2-update-diagnose-and-troubleshoot/environment.png
[2]: media/v2-update-diagnose-and-troubleshoot/dashboard-insights.png
[3]: media/v2-update-diagnose-and-troubleshoot/configuration.png
[4]: media/v2-update-diagnose-and-troubleshoot/permissions.png
[5]: media/v2-update-diagnose-and-troubleshoot/access.png
[6]: media/v2-update-diagnose-and-troubleshoot/tsm.png