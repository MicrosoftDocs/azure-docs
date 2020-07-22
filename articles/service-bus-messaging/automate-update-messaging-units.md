---
title: Azure Service Bus - Automatically update messaging units 
description: This article shows you how you can use an Azure Monitor to automatically update messaging units of a Service Bus namespace.
ms.topic: how-to
ms.date: 07/22/2020
---

# Automatically update messaging units of an Azure Service Bus namespace 
Autoscale is a built-in feature that helps applications perform their best when demand changes. You can choose to scale your resource manually to a specific instance count, or via a custom autoscale policy that scales based on metric(s) thresholds, or scheduled instance count, which scales during designated time windows. Autoscale enables your resource to be performant and cost effective by adding and removing instances based on demand. Learn more about [Azure Autoscale](../azure-monitor/platform/autoscale-get-started.md). This article shows you how you can automatically scale a Service Bus namespace (update [messaging units](service-bus-premium-messaging.md)). 

For example, you may want to implement the following scaling scenarios:

- Increase messaging units for a Service Bus namespace when the CPU usage of the namespace goes above 75%. 
- Decrease messaging units for a Service Bus namespace when the CPU usage of the namespace goes above 25%. 
- Use more messaging units during business hours and fewer during off hours. 

> [!IMPORTANT]
> This article applies to only the **premium** tier of Azure Service Bus. 

## Navigate to autoscale setting page
1. Sign into [Azure portal](https://portal.azure.com). 
2. In the search bar, type **Monitor**, select **Monitor** from the drop-down list, and press **ENTER**. 

    :::image type="content" source="./media/automate-update-messaging-units/select-monitor.png" alt-text="Search for and select Monitor service":::
3. On the **Azure Monitor** page, select **Autoscale** under **Settings** on the left menu, and follow these steps:
    1. Select an **Azure subscription**. 
    1. Select the **resource group** that has the Service Bus premium namespace. 
    1. Select **Service Bus Namespaces** for **Resource type**. 
    1. Select your premium namespace for **Resource**.
    1. Then, from the list, select your **premium namespace**. You see the **Autoscale setting** page for the namespace. 
    
        :::image type="content" source="./media/automate-update-messaging-units/select-premium-namespace.png" alt-text="Select your premium namespace":::       

## Manual scale 
1. On the **Autoscale setting** page, select **Manual scale** if it isn't already selected. 
1. For **Messaging units** setting, select the number of messaging units from the drop-down list.
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/automate-update-messaging-units/manual-scale.png" alt-text="Manually scale messaging units":::       


## Custom autoscale - Default condition
You can configure automatic scaling of messaging units by using conditions. This scale condition is executed when none of the other scale conditions match. You can set a default autoscale rule in one of the following ways:

- Scale based on a metric (such as CPU or memory usage)
- Scale to specific messaging units

You can't set a schedule to autoscale on a specific days or date range for a default custom autoscale. This scale condition is executed when none of the other scale conditions with schedules match. 

### Scale based on a metric
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. 
1. Select **Scale based on a metric** for **Scale mode**. 
1. Select **+ Add a rule**. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-add-rule-link.png" alt-text="Default - scale based on a metric":::    
1. On the **Scale rule** page, follow these steps:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they are **Greater than** and **75** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Increase**. 
    1. Then, select **Add**
    
        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-75.png" alt-text="Default - scale out if CPU usage is greater than 75%":::       

        > [!NOTE]
        > The autoscale feature increases the messaging units for the namespace if the overall CPU usage goes above 75% in this example. Increments are done from 1 to 2, 2 to 4, and 4 to 8. 
1. Select **+ Add a rule** again, and follow these steps on the **Scale rule** page:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they are **Less than** and **25** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Decrease**. 
    1. Then, select **Add** 

        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-25.png" alt-text="Default - scale out if CPU usage is greater than 75%":::       

        > [!NOTE]
        > The autoscale feature decreases the messaging units for the namespace if the overall CPU usage goes above 75% in this example. Decrements are done from 8 to 4, 4 to 2, and 2 to 1. 
1. Set the **minimum** and **maximum** and **default** number of messaging units.

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-based.png" alt-text="Default rule based on a metric":::
1. Select **Save** on the toolbar to save the autoscale setting. 
        
### Scale to specific messaging units
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. 
1. Select **Scale to specific messaging units** for **Scale mode**. 
1. For **Messaging units**, select the number of default messaging units. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-messaging-units.png" alt-text="Default - scale to specific messaging units":::       

## Custom autoscale - non-default conditions
The previous section shows you how to add a default condition for the autoscale setting. This section shows you how to add more conditions to the autoscale setting. On non-default conditions, you can set a schedule based on specific days of a week or a date range. 

### Scale based on a metric
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
1. Confirm that the **Scale based on a metric** option is selected. 
1. Select **+ Add a rule** to add a rule to increase messaging units when the overall CPU usage goes above 75%. Follow steps from the **default condition** section. 
5. Set the **minimum** and **maximum** and **default** number of messaging units.
6. You can also set a **schedule** on a custom condition (but not on the default condition). You can either specify start and end dates for the condition (or) select specific days (Monday, Tuesday, etc.) of a week. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** (as shown in the following image) for the condition to be in effect. 

       :::image type="content" source="./media/automate-update-messaging-units/custom-min-max-default.png" alt-text="Minimum, maximum, and default values for number of messaging units":::
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply. 

        :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days.png" alt-text="Repeat specific days":::
  
### scale to specific messaging units
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
2. Select **scale to specific messaging units** option for **Scale mode**. 
1. Select the number of **messaging units** from the drop-down list. 
6. For the **schedule**, specify either start and end dates for the condition (or) select specific days (Monday, Tuesday, etc.) of a week and times. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** for the condition to be in effect. 
    
    :::image type="content" source="./media/automate-update-messaging-units/scale-specific-messaging-units-start-end-dates.png" alt-text="scale to specific messaging units - start and end dates":::        
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply.
    
    :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days-2.png" alt-text="scale to specific messaging units - repeat specific days":::
         

## Next steps
To learn about messaging units, see the [Premium messaging](service-bus-premium-messaging.md)

