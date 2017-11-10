---
title: Create an Azure Time Series Insights environment | Microsoft Docs
description: This article describes how to use the Azure portal to create a new Time Series Insights environment. 
services: time-series-insights
ms.service: time-series-insights
author: op-ravi
ms.author: omravi
manager: jhubbard
editor: MarkMcGeeAtAquent, jasonwhowell, kfile, MicrosoftDocs/tsidocs
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: article 
ms.date: 11/15/2017
---

# Create a new Time Series Insights environment in the Azure portal
You can use the Azure portal in your web browser to create a new Time Series Insights environment. A Time Series Insights environment is an Azure resource with ingress and storage capacity.

## Steps to create the environment
Follow these steps to create an environment:

1.	Sign in to the [Azure portal](https://portal.azure.com).

2.	Select the **+ Create a resource** button on the upper left of the portal.

3.	Search for **Time Series Insights** in the search box.

  ![Create the Time Series Insights environment](media/get-started/getstarted-create-environment1.png)

4.	Select **Time Series Insights**, then click **Create**.

  ![Create the Time Series Insights resource group](media/get-started/getstarted-create-environment2.png)


   Setting|Suggested value|Description
   ---|---|---
   Environment name | A unique name | This name will represent the environment in [time series explorer](https://insights.timeseries.azure.com)
   Subscription | Your subscription | If you have multiple subscriptions, choose the subscription that contains your event source preferably. Time Series Insights can auto-detect Azure IoT Hub and Event Hub resources existing in the same subscription.
   Resource group | Create a new or use existing | A resource group is a collection of Azure resources used together. You can choose an existing resource group, for example the one which contains your Event Hub or IoT Hub, or make a new one if this project is not related to the other resources.
   Location | Nearest your event source | Preferrably choose the same data center location that contains your event source data, in effort to avoid added cross-region and cross-zone bandwidth costs and added latency when moving data out of the region.
   Pricing tier | S1 | Choose the throughput needed. For lowest costs and starter capacity, select S1.
   Capacity | 1 | Capacity is the multiplier applies to the ingress rate, storage capacity and cost associated with the selected Pricing SKU.  You can change capacity of an environment after creation. For lowest costs, select 1. 
  
5. Check **Pin to dashboard** to best easily access your Time Series Environment in the future.

   ![Create the Time Series Insights pin to dashboard](media/get-started/getstarted-create-environment3.png)
  
6. Select **Create** to begin the provisioning process. It may take a couple of minutes.

7. On the topmost toolbar, select the **Notifications** symbol (bell icon) to monitor the deployment process. 

When the deployment succeeds, you can select **Go to resource** to configure other properties, set security with data access policies, add event sources, add reference data sets, and other actions.

## Next steps
* [Define data access policies](time-series-insights-data-access.md) to access your environment in [Time Series Insights explorer](https://insights.timeseries.azure.com)
* [Create an event source](time-series-insights-add-event-source.md)
* [Send events](time-series-insights-send-events.md) to the event source
