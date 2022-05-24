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
Autoscale allows you to have the right unit count to handle the load on your application. It allows you to add resources to handle increases in load and also save money by removing resources that are sitting idle. See [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md) to learn more about the Autoscale feature of Azure Monitor. 

> [!IMPORTANT]
> This article applies to only the **Premium** tier of Azure SignalR Service. 

By using the Autoscale feature for Azure SignalR Service, you can specify a minimum and maximum number of units and add or remove units automatically based on a set of rules. 

For example, you can implement the following scaling scenarios using the Autoscale feature. 

- Increase units when the Connection Quota Utilization above 70%. 
- Decrease units when the Connection Quota Utilization below 20%. 
- Use more units during business hours and fewer during off hours.

This article shows you how you can automatically scale units in the Azure portal. 


## Autoscale setting page
First, follow these steps to navigate to the **Scale out** page for your Azure SignalR Service.

1. In your browser, open the [Azure portal](https://portal.azure.com).

2. In your SignalR Service page, from the left menu, select **Scale out**.

3. Make sure the resource is in Premium Tier and you will see a **Custom autoscale** setting.


## Custom autoscale - Default condition
You can configure automatic scaling of units by using conditions. This scale condition is executed when none of the other scale conditions match. You can set the default condition in one of the following ways:

- Scale based on a metric
- Scale to specific units

You can't set a schedule to autoscale on a specific days or date range for a default condition. This scale condition is executed when none of the other scale conditions with schedules match. 

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
        
### Scale to specific number of units
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
