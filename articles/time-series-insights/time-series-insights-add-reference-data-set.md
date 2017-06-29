---
title: Add reference data set to your Azure Time Series Insights environment | Microsoft Docs
description: In this tutorial, you add reference data set to your Time Series Insights environment
keywords:
services: time-series-insights
documentationcenter:
author: venkatgct   
manager: almineev
editor: cgronlun

ms.assetid:
ms.service: time-series-insights
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/29/2017
ms.author: venkatja
---

# Create reference data set for your Time Series Insights environment using the Azure portal

A Reference Data Set is a collection of items that will be augumented with the events from your event source. Time Series Insights ingress engine joins an event from your event source with an item in your reference data set, which is then available for query. This join is based on the keys defined in your reference data set.

## Steps to add a reference data set to your environment

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	Click “All resources” in the menu on the left side of the Azure portal.
3.	Select your Time Series Insights environment.

    ![Create the Time Series Insights reference data set](media/add-reference-data-set/getstarted-create-referencedataset1.png)

4.	Select “Reference Data Sets”, click “+ Add.”

    ![Create the Time Series Insights reference data set - details](media/add-reference-data-set/getstarted-create-referencedataset2.png)

5.	Specify the name of the reference data set.
6.	Specify the key name and its type. This name and type will be used to pick the correct property from the event in your event source. For instance, if your provide key name as “DeviceId” and type as “String”, then the ingress engine looks for a property with the name “DeviceId” (case-sensitive) of type “String” in the incoming event from your event source. You can provide more than one key to join with the event. Note that the property name match is case-sensitive.

     ![Create the Time Series Insights reference data set - details](media/add-reference-data-set/getstarted-create-referencedataset3.png)

9.	Click “Create.”

## Next steps

* [Manage data](time-series-insights-manage-reference-data-csharp.md) within your reference data set programatically.
* [Understand](/rest/api/time-series-insights/time-series-insights-reference-reference-data-api) the Reference Data API.
