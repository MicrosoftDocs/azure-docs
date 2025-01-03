---
title: Capacity metrics - Azure API Management | Microsoft Docs
description: This article explains the capacity metrics in Azure API Management and how to make informed decisions about whether to scale an instance.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 10/01/2024
ms.author: danlep
ms.custom: fasttrack-edit
---

# Capacity of an Azure API Management instance

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

API Management provides [Azure Monitor metrics](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) to detect use of system capacity, helping you troubleshoot gateway problems and make informed decisions whether to [scale or upgrade](upgrade-and-scale.md) an API Management instance to accommodate more load. 

This article explains the capacity metrics and how they behave, shows how to access capacity metrics in the Azure portal, and suggests when to consider scaling or upgrading your API Management instance.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

> [!IMPORTANT]
> This article introduces how to monitor and scale your Azure API Management instance based on capacity metrics. However, when an instance *reaches* its capacity, it won't throttle to prevent overload. Instead, it will act like an overloaded web server: increased latency, dropped connections, and timeout errors. API clients should be ready to handle these issues as they do with other external services, for example by using retry policies.

## Prerequisites

To follow the steps in this article, you must have an API Management instance in one of the tiers that supports capacity metrics. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

## Available capacity metrics

Different capacity metrics are available in the [v2 service tiers](v2-service-tiers-overview.md) and classic tiers. 

#### [v2 tiers](#tab/v2-tiers)

In the v2 tiers, the following metrics are available:

* **CPU Percentage of Gateway** - The percentage of CPU capacity used by the gateway units.

* **Memory Percentage of Gateway** - The percentage of memory capacity used by the gateway units.

Available aggregations for these metrics are as follows.

* **Avg** - Average percentage of capacity used across gateway processes in every [unit](upgrade-and-scale.md) of an API Management instance. 
* **Max** - Percentage of capacity in gateway process with the greatest consumption.  

[!INCLUDE [api-management-cpu-memory-capacity](../../includes/api-management-cpu-memory-capacity.md)]

#### [Classic tiers](#tab/classic)

In the Developer, Basic, Standard, and Premium tiers, the **Capacity** metric is available for making decisions about scaling or upgrading an API Management instance. Its construction is complex and imposes certain behavior.

Available aggregations for this metric are as follows.

* **Avg** - Average percentage of capacity used across gateway processes in every [unit](upgrade-and-scale.md) of an API Management instance. 
* **Max** - Percentage of capacity in gateway process with the greatest consumption.  

[!INCLUDE [availability-capacity.md](../../includes/api-management-availability-capacity.md)]

### What the Capacity metric indicates

![Diagram that explains the Capacity metric.](./media/api-management-capacity/capacity-ingredients.png)

**Capacity** is an indicator of load on an API Management instance. It reflects usage of resources (CPU, memory) and network queue lengths. 

[!INCLUDE [api-management-cpu-memory-capacity](../../includes/api-management-cpu-memory-capacity.md)]

---

## Capacity metric behavior

In real life capacity metrics can be impacted by many variables, for example:

+ connection patterns (new connection on a request versus reusing the existing connection)
+ size of a request and response
+ policies configured on each API or number of clients sending requests.

The more complex operations on the requests are, the higher the capacity consumption is. For example, complex transformation policies consume much more CPU than a simple request forwarding. Slow backend service responses increase it, too.

> [!IMPORTANT]
> Capacity metrics are not direct measures of the number of requests being processed.

![Capacity metric spikes](./media/api-management-capacity/capacity-spikes.png)

Capacity metrics can also spike intermittently or be greater than zero even if no requests are being processed. It happens because of system- or platform-specific actions and should not be taken into consideration when deciding whether to scale an instance.

Although capacity metrics are designed to surface problems with your API Management instance, there are cases when problems won't be reflected in changes in these metrics. Additionally, low capacity metrics don't necessarily mean that your API Management instance isn't experiencing any problems.

  
## Use the Azure portal to examine capacity metrics

Access metrics in the portal to understand how much capacity is used over time.

#### [v2 tiers](#tab/v2-tiers) 

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left menu, under **Monitoring**, select **Metrics**.
1. Select the **CPU Percentage of Gateway** or **Memory Percentage of Gateway** metric from the available metrics. Choose the default **Avg** aggregation or select the **Max** aggregation to see the peak usage.
1. Pick a desired timeframe from the top bar of the section.

> [!IMPORTANT]
> Currently, the **Capacity** metric also appears in the portal for instances in v2 tiers. However, it's not supported for use in the v2 tiers and shows a value of 0.

> [!NOTE]
> You can set a [metric alert](api-management-howto-use-azure-monitor.md#set-up-an-alert-rule) to let you know when something unexpected is happening. For example, get notifications when your API Management instance has exceeded its expected peak CPU or Memory usage for more than 20 minutes.
  

#### [Classic tiers](#tab/classic)
  
![Capacity metric](./media/api-management-capacity/capacity-metric.png)  

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left menu, under **Monitoring**, select **Metrics**.
1. Select the **Capacity** metric from the available metrics and leave the default **Avg** aggregation.

    > [!TIP]
    > If you've deployed your instance to multiple locations, you should always look at a **capacity** metric breakdown per location to avoid wrong interpretations.

1. To split the metric by location, from the section at the top, select **Apply splitting** and then select **Location**.
1. Pick a desired timeframe from the top bar of the section.

> [!IMPORTANT]
> Currently, the **CPU Percentage of Gateway** and **Memory Consumption of Gateway** metrics also appear in the portal for instances in classic tiers. However, they're not supported for use in classic tiers and show a value of 0.





> [!NOTE]
> * You can set a [metric alert](api-management-howto-use-azure-monitor.md#set-up-an-alert-rule) to let you know when something unexpected is happening. For example, get notifications when your API Management instance has exceeded its expected peak capacity for more than 20 minutes.
> * You can use Azure Monitor [autoscaling](api-management-howto-autoscale.md) to automatically add an Azure API Management unit. Scaling operation can take around 30 minutes, so you should plan your rules accordingly.  
> * In multi-region deployments, only scaling the primary location is allowed.

---

## Use capacity for scaling decisions

Use capacity metrics for making decisions whether to scale an API Management instance to accommodate more load. The following are general considerations:

+ Look at a long-term trend and average.
+ Ignore sudden spikes that are most likely not related to an increase in load (see [Capacity metric behavior](#capacity-metric-behavior) section for explanation).
+ As a general rule, upgrade or scale your instance when a capacity metric value exceeds **60% - 70%** for a long period of time (for example, 30 minutes). Different values may work better for your service or scenario.
+ If your instance is configured with only 1 unit, upgrade or scale your instance when a capacity metric value exceeds **40%** for a long period. This recommendation is based on the need to reserve capacity for guest OS updates in the underlying service platform.

>[!TIP]  
> If you are able to estimate your traffic beforehand, test your API Management instance on workloads you expect. You can increase the request load on your tenant gradually and monitor the value of the capacity metric that corresponds to your peak load. Follow the steps from the previous section to use Azure portal to understand how much capacity is used at any given time.

## Related content

- [Upgrade and scale an Azure API Management service instance](upgrade-and-scale.md)
- [Automatically scale an Azure API Management instance](api-management-howto-autoscale.md)
- [Plan and manage costs for API Management](plan-manage-costs.md)