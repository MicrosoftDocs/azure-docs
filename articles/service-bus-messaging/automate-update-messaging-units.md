---
title: Azure Service Bus - Automatically update messaging units 
description: This article shows you how you can use automatically update messaging units of a Service Bus namespace.
ms.topic: how-to
ms.date: 09/15/2020
---

# Automatically update messaging units of an Azure Service Bus namespace 
Autoscale allows you to have the right amount of resources running to handle the load on your application. It allows you to add resources to handle increases in load and also save money by removing resources that are sitting idle. See [Overview of autoscale in Microsoft Azure](../azure-monitor/platform/autoscale-overview.md) to learn more about the Autoscale feature of Azure Monitor. 

Service Bus Premium Messaging provides resource isolation at the CPU and memory level so that each customer workload runs in isolation. This resource container is called a **messaging unit**. To learn more about messaging units, see [Service Bus Premium Messaging](service-bus-premium-messaging.md). 

By using the Autoscale feature for Service Bus premium namespaces, you can specify a minimum and maximum number of [messaging units](service-bus-premium-messaging.md) and add or remove messaging units automatically based on a set of rules. 

For example, you can implement the following scaling scenarios for Service Bus namespaces using the Autoscale feature. 

- Increase messaging units for a Service Bus namespace when the CPU usage of the namespace goes above 75%. 
- Decrease messaging units for a Service Bus namespace when the CPU usage of the namespace goes below 25%. 
- Use more messaging units during business hours and fewer during off hours. 

This article shows you how you can automatically scale a Service Bus namespace (update [messaging units](service-bus-premium-messaging.md)) in the Azure portal. 

> [!IMPORTANT]
> This article applies to only the **premium** tier of Azure Service Bus. 

## Autoscale setting page
First, follow these steps to navigate to the **Autoscale settings** page for your Service Bus namespace.

1. Sign into [Azure portal](https://portal.azure.com). 
2. In the search bar, type **Service Bus**, select **Service Bus** from the drop-down list, and press **ENTER**. 
1. Select your **premium namespace** from the list of namespaces. 
1. Switch to the **Scale** page. 

    :::image type="content" source="./media/automate-update-messaging-units/scale-page.png" alt-text="Service Bus Namespace - Scale page":::

## Manual scale 
This setting allows you to set a fixed number of messaging units for the namespace. 

1. On the **Autoscale setting** page, select **Manual scale** if it isn't already selected. 
1. For **Messaging units** setting, select the number of messaging units from the drop-down list.
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/automate-update-messaging-units/manual-scale.png" alt-text="Manually scale messaging units":::       


## Custom autoscale - Default condition
You can configure automatic scaling of messaging units by using conditions. This scale condition is executed when none of the other scale conditions match. You can set the default condition in one of the following ways:

- Scale based on a metric (such as CPU or memory usage)
- Scale to specific number of messaging units

You can't set a schedule to autoscale on a specific days or date range for a default condition. This scale condition is executed when none of the other scale conditions with schedules match. 

### Scale based on a metric
The following procedure shows you how to add a condition to automatically increase messaging units (scale out) when the CPU usage is greater than 75% and decrease messaging units (scale in) when the CPU usage is less than 25%. Increments are done from 1 to 2, 2 to 4, and 4 to 8. Similarly, decrements are done from 8 to 4, 4 to 2, and 2 to 1. 

1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. Select the **pencil** icon to edit the text. 
1. Select **Scale based on a metric** for **Scale mode**. 
1. Select **+ Add a rule**. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-add-rule-link.png" alt-text="Default - scale based on a metric":::    
1. On the **Scale rule** page, follow these steps:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they're **Greater than** and **75** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Increase**. 
    1. Then, select **Add**
    
        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-75.png" alt-text="Default - scale out if CPU usage is greater than 75%":::       

        > [!NOTE]
        > The autoscale feature increases the messaging units for the namespace if the overall CPU usage goes above 75% in this example. Increments are done from 1 to 2, 2 to 4, and 4 to 8. 
1. Select **+ Add a rule** again, and follow these steps on the **Scale rule** page:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they're **Less than** and **25** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Decrease**. 
    1. Then, select **Add** 

        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-25.png" alt-text="Default - scale in if CPU usage is less than 25%":::       

        > [!NOTE]
        > The autoscale feature decreases the messaging units for the namespace if the overall CPU usage goes below 25% in this example. Decrements are done from 8 to 4, 4 to 2, and 2 to 1. 
1. Set the **minimum** and **maximum** and **default** number of messaging units.

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-based.png" alt-text="Default rule based on a metric":::
1. Select **Save** on the toolbar to save the autoscale setting. 
        
### Scale to specific number of messaging units
Follow these steps to configure the rule to scale the namespace to use specific number of messaging units. Again, the default condition is applied when none of the other scale conditions match. 

1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. 
1. Select **Scale to specific messaging units** for **Scale mode**. 
1. For **Messaging units**, select the number of default messaging units. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-messaging-units.png" alt-text="Default - scale to specific messaging units":::       

## Custom autoscale - additional conditions
The previous section shows you how to add a default condition for the autoscale setting. This section shows you how to add more conditions to the autoscale setting. For these additional non-default conditions, you can set a schedule based on specific days of a week or a date range. 

### Scale based on a metric
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
1. Confirm that the **Scale based on a metric** option is selected. 
1. Select **+ Add a rule** to add a rule to increase messaging units when the overall CPU usage goes above 75%. Follow steps from the [default condition](#custom-autoscale---default-condition) section. 
5. Set the **minimum** and **maximum** and **default** number of messaging units.
6. You can also set a **schedule** on a custom condition (but not on the default condition). You can either specify start and end dates for the condition (or) select specific days (Monday, Tuesday, and so on.) of a week. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** (as shown in the following image) for the condition to be in effect. 

       :::image type="content" source="./media/automate-update-messaging-units/custom-min-max-default.png" alt-text="Minimum, maximum, and default values for number of messaging units":::
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply. 

        :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days.png" alt-text="Repeat specific days":::
  
### Scale to specific number of messaging units
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
2. Select **scale to specific messaging units** option for **Scale mode**. 
1. Select the number of **messaging units** from the drop-down list. 
6. For the **schedule**, specify either start and end dates for the condition (or) select specific days (Monday, Tuesday, and so on.) of a week and times. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** for the condition to be in effect. 
    
    :::image type="content" source="./media/automate-update-messaging-units/scale-specific-messaging-units-start-end-dates.png" alt-text="scale to specific messaging units - start and end dates":::        
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply.
    
    :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days-2.png" alt-text="scale to specific messaging units - repeat specific days":::

> [!IMPORTANT]
> To learn more about how autoscale settings work, especially how it picks a profile or condition and evaluates multiple rules, see [Understand Autoscale settings](../azure-monitor/platform/autoscale-understanding-settings.md).          

## Next steps
To learn about messaging units, see the [Premium messaging](service-bus-premium-messaging.md)

