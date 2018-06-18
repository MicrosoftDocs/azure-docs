---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Capacity of an Azure API Management instance | Microsoft Docs
description: This article explains what the capacity metric is and how to make informed decisions whether to scale an Azure API Management instance.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 06/18/2018
ms.author: apimpm
---

# Capacity of an Azure API Management instance

**Capacity** is the single, most important metric for making informed decisions whether to scale an API Management instance to accommodate more load. Its construction is complex and imposes certain behavior.

This article explains what the **capacity** is and how it behaves. It shows how to access **capacity** metrics in the Azure portal and suggests when to consider scaling or upgrading your API Management instance.

## Prerequisites

To follow the steps from this article, you must have:

+ An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ An APIM instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

## What is capacity

![Capacity metric](./media/api-management-capacity/capacity-ingredients.png)

**Capacity** is an indicator of load on an APIM instance. It reflects resources usage (CPU, memory) and network queue lengths. CPU and memory usage reveals resources consumption by APIM services (for example request forwarding or management actions) and selected OS processes. Total **capacity** is an average of its own values from every unit of an API Management instance.

> [!IMPORTANT]
> **Capacity** is not a direct measure of the number of requests being processed.

## Capacity metric behavior

In real life, because of its construction, **capacity** can be impacted by many variables, including connection patterns, size of a request and response, policies configured on each API or number of clients sending requests.

The more complex requests' operations are, the higher the **capacity** consumption will be. Longer request and response processing times will increase it too.

![Capacity metric spikes](./media/api-management-capacity/capacity-spikes.png)

**Capacity** can also spike intermittently or be greater than zero even if there are no requests being processed. It happens because of system- or platform-specific actions and should not be taken into consideration when deciding whether to scale an instance.
  
## Use the Azure Portal to examine capacity
  
![Capacity metric](./media/api-management-capacity/capacity-metric.png)  

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **Metrics (preview)**.
3. Select **Capacity** metric from available metrics and pick a timeframe.

    You can set a metric alert to let you know when something unexpected is happening. For example, your APIM instance has exceeded its expected peak capacity for over 10 minutes.

    >[!TIP]
    > You can configure alerts to let you know when your service is running low on capacity or call into a logic app that automatically scale by adding a unit.

## Use capacity for scaling decisions

**Capacity** is the metric for making decisions whether to scale an API Management instance to accommodate more load. Consider:

+ Looking at a long-term trend and average.
+ Ignoring sudden spikes that are most likely not related to any increase in load (see "Capacity metric behavior" section for explanation).
+ Upgrading or scaling your instance, when **capacity**'s value exceeds 60% or 70% for a longer period of time (for example 30 minutes). Different values may work better for your service or scenario.

>[!TIP]  
> If you are able to estimate your traffic beforehand, test your APIM instance on workloads you expect. You can increase the request load on your tenant gradually and monitor what value of the capacity metric corresponds to your peak load. Follow the steps from the previous section to use Azure portal to understand how much capacity is used at any given time.

## Next steps

[How to scale or upgrade an Azure API Management service instance](upgrade-and-scale.md)