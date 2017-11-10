---
title: How to add a reference data set to your Azure Time Series Insights environment | Microsoft Docs
description: This article describes how to add a reference data set to your Azure Time Series Insights environment. Reference data is useful to join to your source data to augment the values.
services: time-series-insights
ms.service: time-series-insights
author: venkatgct
ms.author: venkatja
manager: jhubbard
editor: MarkMcGeeAtAquent, jasonwhowell, kfile, MicrosoftDocs/tsidocs
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: article
ms.date: 11/15/2017
---

# Create a reference data set for your Time Series Insights environment using the Azure portal

A Reference Data Set is a collection of items that are augmented with the events from your event source. Time Series Insights ingress engine joins an event from your event source with an item in your reference data set. This augmented event is then available for query. This join is based on the keys defined in your reference data set.

## Steps to add a reference data set to your environment

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click “All resources” in the menu on the left side of the Azure portal.
3. Select your Time Series Insights environment.

    ![Create the Time Series Insights reference data set](media/add-reference-data-set/getstarted-create-reference-data-set-1.png)

4. Select “Reference Data Sets”, click “+ Add.”

    ![Create the Time Series Insights reference data set - details](media/add-reference-data-set/getstarted-create-reference-data-set-2.png)

5. Specify the name of the reference data set.
6. Specify the key name and its type. This name and type are used to pick the correct property from the event in your event source. For instance, if you provide key name as “DeviceId” and type as “String”, then the Time Series Insights ingress engine looks for a property with the name “DeviceId” of type “String” in the incoming event. You can provide more than one key to join with the event. The key name match is case-sensitive.

     ![Create the Time Series Insights reference data set - details](media/add-reference-data-set/getstarted-create-reference-data-set-3.png)

7. Click “Create.”

## Next steps

* [Manage reference data](time-series-insights-manage-reference-data-csharp.md) programmatically.
* For the complete API reference, see [Reference Data API](/rest/api/time-series-insights/time-series-insights-reference-reference-data-api) document.
