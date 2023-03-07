---
title: Capacity of an Azure API Management instance | Microsoft Docs
description: This article explains what the capacity metric is and how to make informed decisions whether to scale an Azure API Management instance.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 07/06/2022
ms.author: danlep
ms.custom: fasttrack-edit
---

# Capacity of an Azure API Management instance

**Capacity** is the most important [Azure Monitor metric](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) for making informed decisions whether to [scale or upgrade](upgrade-and-scale.md) an API Management instance to accommodate more load. Its construction is complex and imposes certain behavior.

This article explains what the **capacity** is and how it behaves. It shows how to access **capacity** metrics in the Azure portal and suggests when to consider scaling or upgrading your API Management instance.

> [!IMPORTANT]
> This article discusses how you can monitor and scale your Azure API Management instance based upon its capacity metric. However, it is equally important to understand what happens when an individual API Management instance has actually *reached* its capacity. Azure API Management will not apply service-level throttling to prevent a physical overload of the instances. When an instance reaches its physical capacity, it will behave similar to any overloaded web server that is unable to process incoming requests: latency will increase, connections will get dropped, timeout errors will occur, and so on. This means that API clients should be prepared to deal with this possibility as they do with any other external service (for example, by applying retry policies).

## Prerequisites

To follow the steps in this article, you must have:

+ An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [availability-capacity.md](../../includes/api-management-availability-capacity.md)]

## What is capacity

![Diagram that explains the Capacity metric.](./media/api-management-capacity/capacity-ingredients.png)

**Capacity** is an indicator of load on an API Management instance. It reflects usage of resources (CPU, memory) and network queue lengths. CPU and memory usage reveals consumption of resources by:

+ API Management data plane services, such as request processing, which can include forwarding requests or running a policy.
+ API Management management plane services, such as management actions applied via the Azure portal or Azure Resource Manager, or load coming from the [developer portal](api-management-howto-developer-portal.md).
+ Selected operating system processes, including processes that involve cost of TLS handshakes on new connections.
+ Platform updates, such as OS updates on the underlying compute resources for the instance.

Total **capacity** is an average of its own values from every [unit](upgrade-and-scale.md) of an API Management instance.

Although the **capacity metric** is designed to surface problems with your API Management instance, there are cases when problems won't be reflected in changes in the **capacity metric**.

## Capacity metric behavior

Because of its construction, in real life **capacity** can be impacted by many variables, for example:

+ connection patterns (new connection on a request versus reusing the existing connection)
+ size of a request and response
+ policies configured on each API or number of clients sending requests.

The more complex operations on the requests are, the higher the **capacity** consumption will be. For example, complex transformation policies consume much more CPU than a simple request forwarding. Slow backend service responses will increase it, too.

> [!IMPORTANT]
> **Capacity** is not a direct measure of the number of requests being processed.

![Capacity metric spikes](./media/api-management-capacity/capacity-spikes.png)

**Capacity** can also spike intermittently or be greater than zero even if no requests are being processed. It happens because of system- or platform-specific actions and should not be taken into consideration when deciding whether to scale an instance.

Low **capacity metric** doesn't necessarily mean that your API Management instance isn't experiencing any problems.
  
## Use the Azure portal to examine capacity
  
![Capacity metric](./media/api-management-capacity/capacity-metric.png)  

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
2. In the left menu, under **Monitoring**, select **Metrics**.
3. Select the **Capacity** metric from the available metrics and leave the default **Avg** aggregation.

    > [!TIP]
    > If you've deployed your instance to multiple locations, you should always look at a **capacity** metric breakdown per location to avoid wrong interpretations.

4. To split the metric by location, from the section at the top, select **Apply splitting** and then select **Location**.
5. Pick a desired timeframe from the top bar of the section.

    You can set a [metric alert](api-management-howto-use-azure-monitor.md#set-up-an-alert-rule) to let you know when something unexpected is happening. For example, get notifications when your API Management instance has exceeded its expected peak capacity for more than 20 minutes.

    >[!TIP]
    > You can configure alerts to let you know when your service is running low on capacity or use Azure Monitor [autoscaling](api-management-howto-autoscale.md) to automatically add an Azure API Management unit. Scaling operation can take around 30 minutes, so you should plan your rules accordingly.  
    > Only scaling the master location is allowed.

## Use capacity for scaling decisions

**Capacity** is the metric for making decisions whether to scale an API Management instance to accommodate more load. The following are general considerations:

+ Look at a long-term trend and average.
+ Ignore sudden spikes that are most likely not related to an increase in load (see [Capacity metric behavior](#capacity-metric-behavior) section for explanation).
+ As a general rule, upgrade or scale your instance when the **capacity** value exceeds **60% - 70%** for a long period of time (for example, 30 minutes). Different values may work better for your service or scenario.
+ If your instance is configured with only 1 unit, upgrade or scale your instance when the **capacity** value exceeds **40%** for a long period. This recommendation is based on the need to reserve capacity for guest OS updates in the underlying service platform.

>[!TIP]  
> If you are able to estimate your traffic beforehand, test your API Management instance on workloads you expect. You can increase the request load on your tenant gradually and monitor the value of the capacity metric that corresponds to your peak load. Follow the steps from the previous section to use Azure portal to understand how much capacity is used at any given time.

## Next steps

- [Upgrade and scale an Azure API Management service instance](upgrade-and-scale.md)
- [Automatically scale an Azure API Management instance](api-management-howto-autoscale.md)
- [Plan and manage costs for API Management](plan-manage-costs.md)