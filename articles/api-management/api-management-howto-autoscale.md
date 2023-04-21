---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure autoscale of an Azure API Management instance | Microsoft Docs
description: This article describes how to set up autoscale behavior for an Azure API Management instance.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 03/30/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# Automatically scale an Azure API Management instance  

An Azure API Management service instance can scale automatically based on a set of rules. This behavior can be enabled and configured through [Azure Monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md#supported-services-for-autoscale) and is currently supported only in the **Standard** and **Premium** tiers of the Azure API Management service.

The article walks through the process of configuring autoscale and suggests optimal configuration of autoscale rules.

> [!NOTE]
> * In service tiers that support multiple scale units, you can also [manually scale](upgrade-and-scale.md) your API Management instance.
> * An API Management service in the **Consumption** tier scales automatically based on the traffic - without any additional configuration needed.

## Prerequisites

To follow the steps from this article, you must:

+ Have an active Azure subscription.
+ Have an Azure API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Understand the concept of [capacity](api-management-capacity.md) of an API Management instance.
+ Understand [manual scaling](upgrade-and-scale.md) of an API Management instance, including cost consequences.

[!INCLUDE [premium-standard.md](../../includes/api-management-availability-premium-standard.md)]

## Azure API Management autoscale limitations

Certain limitations and consequences of scaling decisions need to be considered before configuring autoscale behavior.

+ The pricing tier of your API Management instance determines the [maximum number of units](upgrade-and-scale.md#upgrade-and-scale) you may scale to. For example, the **Standard tier** can be scaled to 4 units. You can add any number of units to the **Premium** tier.
+ The scaling process takes at least 20 minutes.
+ If the service is locked by another operation, the scaling request will fail and retry automatically.
+ If your service instance is deployed in multiple regions (locations), only units in the **Primary location** can be autoscaled with Azure Monitor autoscale. Units in other locations can only be scaled manually.
+ If your service instance is configured with [availability zones](zone-redundancy.md) in the **Primary location**, be aware of the number of zones when configuring autoscaling. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones. 

## Enable and configure autoscale for an API Management instance

Follow these steps to configure autoscale for an Azure API Management service:

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. In the left menu, select **Scale out (auto-scale)**, and then select **Custom autoscale**.

    :::image type="content" source="media/api-management-howto-autoscale/01.png" alt-text="Screenshot of scale-out options in the portal.":::

1. In the **Default** scale condition, select **Scale based on a metric**, and then select **Add a rule**.

    :::image type="content" source="media/api-management-howto-autoscale/04.png" alt-text="Screenshot of configuring the default scale condition in the portal.":::

1. Define a new scale-out rule.

   For example, a scale-out rule could trigger addition of 1 API Management unit, when the average capacity metric over the previous 30 minutes exceeds 80%. The following table provides configuration for such a rule.

    | Parameter             | Value             | Notes                                                                                                                                                                                                                                                                           |
    |-----------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Metric source         | Current resource  | Define the rule based on the current API Management resource metrics.                                                                                                                                                                                                     |
    | *Criteria*            |                   |                                                                                                                                                                                                                                                                                 |
    | Metric name           | Capacity          | Capacity metric is an API Management metric reflecting usage of resources by an Azure API Management instance.                                                                                                                                                            |
    | Location | Select the primary location of the API Management instance | |
    | Operator              | Greater than      |                                                                                                                                                                                                                                                                                 |
    | Metric threshold             | 80%               | The threshold for the averaged capacity metric.                                                                                                                                                                                                                                 |
    | Duration (in minutes) | 30                | The timespan to average the capacity metric over is specific to usage patterns. The longer the duration, the smoother the reaction will be. Intermittent spikes will have less effect on the scale-out decision. However, it will also delay the scale-out trigger. |
    | Time grain statistic  | Average           | |
    |*Action*              |                   |                                                                                                                                                                                                                                                                                 |
    | Operation             | Increase count by |                                                                                                                                                                                                                                                                                 |
    | Instance count        | 1                 | Scale out the Azure API Management instance by 1 unit.                                                                                                                                                                                                                          |
    | Cool down (minutes)   | 60                | It takes at least 20 minutes for the API Management service to scale out. In most cases, the cool down period of 60 minutes prevents from triggering many scale-outs.                                                                                                  |

1. Select **Add** to save the rule.
1. To add another rule, select **Add a rule**.

    This time, a scale-in rule needs to be defined. It will ensure resources aren't being wasted, when the usage of APIs decreases.

1. Define a new scale-in rule.

    For example, a scale-in rule could trigger a removal of 1 API Management unit when the average capacity metric over the previous 30 minutes has been lower than 35%. The following table provides configuration for such a rule.

    | Parameter             | Value             | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    |-----------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Metric source         | Current resource  | Define the rule based on the current API Management resource metrics.                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | *Criteria*            |                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Time aggregation      | Average           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Metric name           | Capacity          | Same metric as the one used for the scale-out rule.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | Location | Select the primary location of the API Management instance | |
    | Operator              | Less than         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Threshold             | 35%               | As with the scale-out rule, this value heavily depends on the usage patterns of the API Management instance. |
    | Duration (in minutes) | 30                | Same value as the one used for the scale-out rule.      |
    | Time grain statistic | Average                |       |
    | *Action*              |                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Operation             | Decrease count by | Opposite to what was used for the scale-out rule.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | Instance count        | 1                 | Same value as the one used for the scale-out rule.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | Cool down (minutes)   | 90                | Scale-in should be more conservative than a scale-out, so the cool down period should be longer.                                                                                                                                                                                                                                                                                                                                                                                                    |

1. Select **Add** to save the rule.

1. In **Instance limits**, select the **Minimum**, **Maximum**, and **Default** number of API Management units.
   > [!NOTE]
   > API Management has a limit of units an instance can scale out to. The limit depends on the service tier.
    
    :::image type="content" source="media/api-management-howto-autoscale/07.png" alt-text="Screenshot showing how to set instance limits in the portal.":::

1. Select **Save**. Your autoscale has been configured.

## Next steps

- [How to deploy an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md)
- [Optimize and save on your cloud spending](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)