---
title: Create an Azure Time Series Insights environment | Microsoft Docs
description: This article describes how to use the Azure portal to create a new Time Series Insights environment. 
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.workload: big-data
ms.topic: conceptual 
ms.date: 11/15/2017
---

# Create a new Time Series Insights environment in the Azure portal
This article describes how to create a new Time Series Insights environment using the Azure portal.

Time Series Insights allows you to get started visualizing and querying data flowing into Azure IoT Hubs and Event Hubs in minutes, enabling you to query large volumes of time series data in seconds.  It was designed for the internet-of-things (IoT) scale and can handle terabytes of data.

## Steps to create the environment
Follow these steps to create an environment:

1.	Sign in to the [Azure portal](https://portal.azure.com).

2.	Select the **+ New** button.

3.	Select the **Internet of Things** category, and select **Time Series Insights**.

   ![Create the Time Series Insights environment](media/time-series-insights-get-started/1-new-tsi.png)

4.	On the **Time Series Insights** page, select **Create**.

5. Fill in the required parameters. The following table explains each parameter:
   
   ![Create the Time Series Insights resource group](media/time-series-insights-get-started/2-create-tsi.png)
   
   Setting|Suggested value|Description
   ---|---|---
   Environment name | A unique name | This name represents the environment in [time series explorer](https://insights.timeseries.azure.com)
   Subscription | Your subscription | If you have multiple subscriptions, choose the subscription that contains your event source preferably. Time Series Insights can auto-detect Azure IoT Hub and Event Hub resources existing in the same subscription.
   Resource group | Create a new or use existing | A resource group is a collection of Azure resources used together. You can choose an existing resource group, for example the one that contains your Event Hub or IoT Hub. Or you can make a new one if this resource is not related to the other resources.
   Location | Nearest your event source | Preferably, choose the same data center location that contains your event source data, in effort to avoid added cross-region and cross-zone bandwidth costs and added latency when moving data out of the region.
   Pricing tier | S1 | Choose the throughput needed. For lowest costs and starter capacity, select S1.
   Capacity | 1 | Capacity is the multiplier applies to the ingress rate, storage capacity, and cost associated with the selected SKU.  You can change capacity of an environment after creation. For lowest costs, select a capacity of 1. 
  
6. Check **Pin to dashboard** to best easily access your Time Series Environment in the future.

   ![Create the Time Series Insights pin to dashboard](media/time-series-insights-get-started/3-pin-create.png)

7. Select **Create** to begin the provisioning process. It may take a couple of minutes.

8. To monitor the deployment process, select the **Notifications** symbol (bell icon).

   ![Watch the notifications](media/time-series-insights-get-started/4-notifications.png)

When the deployment succeeds, you can select **Go to resource** to configure other properties, set security with data access policies, add event sources, and other actions.

## Next steps
* [Define data access policies](time-series-insights-data-access.md) to secure your environment.
* [Add an Event Hub event source](time-series-insights-how-to-add-an-event-source-eventhub.md) to your Azure Time Series Insights environment. 
* [Send events](time-series-insights-send-events.md) to the event source.
* View your environment in [Time Series Insights explorer](https://insights.timeseries.azure.com).
