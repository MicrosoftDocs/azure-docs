---
title: Auto scale Azure SignalR Service
description: Learn how to autoscale Azure SignalR Service.
author: zackliu
ms.service: signalr
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 02/11/2022
ms.author: chenyl
---

# Automatically scale units of an Azure SignalR Service

Autoscale allows you to define conditions that will automatically scale the number of Azure SignalR units to optimize performance and cost to demand for your application. This article shows you how to set up a few example autoscale conditions in Azure SignalR Service.

> [!IMPORTANT]
> This article applies to only the **Premium** tier of Azure SignalR Service.

For example, you can implement the following scaling scenarios using autoscale: 

- Increase units when the Connection Quota Utilization above 70%.
- Decrease units when the Connection Quota Utilization below 20%. 
- Create a schedule to add more units during peak hours and reduce units during off hours.

Azure SignalR Service autoscaling is based on [Azure Monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md). Azure SignalR adds its own [service metrics](concept-metrics.md), however, most of the user interface is shared and common to other [Azure services that support autoscaling](../azure-monitor/autoscale/autoscale-overview.md#supported-services-for-autoscale).

The [Next steps](#next-steps) section at the end of this article has a list of Azure Monitor autoscale articles to help you better understand how autoscaling works with Azure SignalR.

All of the following examples can also be done from Azure Monitor **Settings > Autoscale** page.

## Custom autoscale settings

Open the autoscale settings page:

1. Go to the [Azure portal](https://portal.azure.com)

1. Open the **SignalR** service page
1. From the menu on the left, under **Settings**choose **Scale out**.
1. Select the **Configure** tab. If you have a Premium tier SignalR instance, you will see two options for **Choose how to scale your resource**:
   - **Manual scale**, which lets you to manually change the number of units
   - **Custom autoscale**, which lets you to create autoscale conditions based on metrics/time

1. Choose **Custom autoscale**. Use this page to manage the autoscale conditions for your Azure SignalR service.

### Default scale condition

When you open custom autoscale settings for the first time, you'll see the **Default** scale condition already created for you. This scale condition is executed when none of the other scale conditions match the criteria set for them. You can't delete the **Default** condition, but you can rename it, change the rules, and change the action taken by autoscale. 

You can't set the default condition to autoscale on a specific days or date range. The default condition only supports scaling to a unit range. To scale according to a schedule, you'll need to add a new scale condition.

Autoscale does not take effect until you save the default condition for the first time after selecting **Custom autoscale**. 



## Add or change a scale condition

There are two options for how to scale your Auzre SignalR resource:

- **Scale based on a metric** - Scale within unit limits based on a dynamic metric. One or more scale rules are defined to set the criteria used to evaluate the metric. 
- **Scale to specfic units** - Scale to a specific number of units based on a date range or recurring schedule


### Scale based on a metric
The following procedure shows you how to add a condition to automatically increase units (scale out) when the Connection Quota Utilization is greater than 70% and decrease units (scale in) when the Connection Quota Utilization is less than 20%. Increments or decrements are done between available units.

1. On the **Scale out** page, select **Custom autoscale** for the **Choose how to scale your resource** option. 
1. Select **Scale based on a metric** for **Scale mode**. 
1. Select **+ Add a rule**. 

    :::image type="content" source="./media/signalr-howto-scale-autoscale/default-autoscale.png" alt-text="Default - scale based on a metric":::    

1. On the **Scale rule** page, follow these steps:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **Connection Quota Utilization**. 
    1. Select an operator and threshold values. In this example, they're **Greater than** and **70** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Increase**. 
    1. Then, select **Add**
    
        :::image type="content" source="./media/signalr-howto-scale-autoscale/default-scale-out.png" alt-text="Default - scale out if Connection Quota Utilization is greater than 70%":::       

1. Select **+ Add a rule** again, and follow these steps on the **Scale rule** page:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **Connection Quota Utilization**. 
    1. Select an operator and threshold values. In this example, they're **Less than** and **20** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Decrease**. 
    1. Then, select **Add** 

        :::image type="content" source="./media/signalr-howto-scale-autoscale/default-scale-in.png" alt-text="Default - scale in if Connection Quota Utilization is less than 20%":::       

1. Set the **minimum** and **maximum** and **default** number of units.

1. Select **Save** on the toolbar to save the autoscale setting. 

### Scale to units
Follow these steps to configure the rule to scale to a specific units. Again, the default condition is applied when none of the other scale conditions match. 

1. On the **Scale out** page, select **Custom autoscale** for the **Choose how to scale your resource** option. 
1. Select **Scale to a specific units** for **Scale mode**. 
1. For **Units**, select the number of default units. 

    :::image type="content" source="./media/signalr-howto-scale-autoscale/default-specific-units.png" alt-text="Default - scale to specific units":::       

## Custom autoscale - Additional conditions
The previous section shows you how to add a default condition for the autoscale setting. This section shows you how to add more conditions to the autoscale setting. For these additional non-default conditions, you can set a schedule based on specific days of a week or a date range. 

### Scale based on a metric
1. On the **Scale out** page, select **Custom autoscale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/signalr-howto-scale-autoscale/additional-add-condition.png" alt-text="Custom - add a scale condition link":::    
1. Confirm that the **Scale based on a metric** option is selected. 
1. Select **+ Add a rule** to add a rule to increase units when the **Connection Quota Utilization** goes above 70%. Follow steps from the [default condition](#custom-autoscale---default-condition) section. 
5. Set the **minimum** and **maximum** and **default** number of units.
6. You can also set a **schedule** on a custom condition (but not on the default condition). You can either specify start and end dates for the condition (or) select specific days (Monday, Tuesday, and so on.) of a week. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** (as shown in the following image) for the condition to be in effect. 
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply. 

## Next steps
<!-- TODO gm 04/12/22 -->