---
title: Get started with autoscale in Azure
description: "Learn how to scale your resource web app, cloud service, virtual machine, or Virtual Machine Scale Set in Azure."
ms.author: edbaynash
ms.topic: conceptual
ms.date: 04/10/2023
---
# Get started with autoscale in Azure

Autoscale allows you to automatically scale your applications or resources based on demand. Use Autoscale to provision enough resources to support the demand on your application without over provisioning and incurring unnecessary costs.

This article describes how to configure the autoscale settings for your resources in the Azure portal.

Azure autoscale supports many resource types. For more information about supported resources, see [autoscale supported resources](./autoscale-overview.md#supported-services-for-autoscale).

## Discover the autoscale settings in your subscription
  
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4u7ts]

To discover the resources that you can autoscale, follow these steps.

1. Open the [Azure portal.](https://portal.azure.com)

1. Using the search bar at the top of the page, search for and select *Azure Monitor*

1. Select **Autoscale** to view all the resources for which autoscale is applicable, along with their current autoscale status.

1. Use the filter pane at the top to select resources a specific resource group, resource types, or a specific resource.

   :::image type="content" source="./media/autoscale-get-started/view-resources.png" lightbox="./media/autoscale-get-started/view-resources.png" alt-text="A screenshot showing resources that can use autoscale and their statuses.":::

   The page shows the instance count and the autoscale status for each resource. Autoscale statuses are:
   - **Not configured**: You haven't enabled autoscale yet for this resource.
   - **Enabled**: You've enabled autoscale for this resource.
   - **Disabled**: You've disabled autoscale for this resource.

   You can also reach the scaling page by selecting **Scaling** from the **Settings** menu for each resource.

    :::image type="content" source="./media/autoscale-get-started/scaling-page.png" lightbox="./media/autoscale-get-started/scaling-page.png" alt-text="A screenshot showing a resource overview page with the scaling menu item.":::

## Create your first autoscale setting  

> [!NOTE]
> In addition to the Autoscale instructions in this article, there's new, automatic scaling in Azure App Service. You'll find more on this capability in the [automatic scaling](../../app-service/manage-automatic-scaling.md) article.
>

Follow the steps below to create your first autoscale setting.

1. Open the **Autoscale** pane in Azure Monitor and select a resource that you want to scale. The following steps use an App Service plan associated with a web app. You can [create your first ASP.NET web app in Azure in 5 minutes.](../../app-service/quickstart-dotnetcore.md)
1. The current instance count is 1. Select **Custom autoscale**.

1. Enter a **Name** and **Resource group** or use the default.

1. Select **Scale based on a metric**.
1. Select **Add a rule**. to open a context pane on the right side.

   :::image type="content" source="./media/autoscale-get-started/custom-scale.png" lightbox="./media/autoscale-get-started/custom-scale.png" alt-text="A screenshot showing the Configure tab of the Autoscale Settings page.":::

1. The default rule scales your resource by one instance if the CPU percentage is greater than 70 percent. Keep the default values and select **Add**.

1. You've now created your first scale-out rule. Best practice is to have at least one scale in rule. To add another rule, select **Add a rule**.

1. Set **Operator** to *Less than*.
1. Set **Metric threshold to trigger scale action** to *20*.
1. Set **Operation** to *Decrease count by*.
1. Select **Add**.

    :::image type="content" source="./media/autoscale-get-started/scale-rule.png" lightbox="./media/autoscale-get-started/scale-rule.png"  alt-text="A screenshot showing a scale rule.":::

   You now have a scale setting that scales out and scales in based on CPU usage, but you're still limited to a maximum of one instance.

1. Under **Instance limits** set **Maximum** to *3*

1. Select **Save**.

    :::image type="content" source="./media/autoscale-get-started/instance-limits.png" lightbox="./media/autoscale-get-started/instance-limits.png" alt-text="A screenshot showing the configure tab of the autoscale setting page with configured rules.":::

You have  successfully created your first scale setting to autoscale your web app based on CPU usage. When CPU usage is greater than 70%, an additional instance is added, up to a maximum of 3 instances. When CPU usage is below 20%, an instance is removed up to a minimum of 1 instance. By default there will be 1 instance.

## Scheduled scale conditions

The default scale condition defines the scale rules that are active when no other scale condition is in effect. You can add scale conditions that are active on a given date and time, or that recur on a weekly basis.

### Scale based on a repeating schedule

Set your resource to scale to a single instance on a Sunday.

1. Select **Add a scale condition**.

1. Enter a description for the scale condition.

1. Select **Scale to a specific instance count**. You can also scale based on metrics and thresholds that are specific to this scale condition.
1. Enter *1* in the **Instance count** field.

1. Select **Sunday**
1. Set the **Start time** and **End time** for when the scale condition should be applied. Outside of this time range, the default scale condition applies.
1. Select **Save**

:::image type="content" source="./media/autoscale-get-started/repeating-schedule.png" lightbox="./media/autoscale-get-started/repeating-schedule.png" alt-text="A screenshot showing a scale condition with a repeating schedule.":::

You have now defined a scale condition that reduces the number of instances of your resource to 1 every Sunday.

### Scale differently on specific dates

Set Autoscale to scale differently for specific dates, when you know that there will be an unusual level of demand for the service.

1. Select **Add a scale condition**.

1. Select **Scale based on a metric**.
1. Select **Add a rule** to define your scale-out and scale-in rules. Set the rules to be same as the default condition.
1. Set the **Maximum** instance limit to *10*
1. Set the **Default** instance limit to *3*
1. Enter the  **Start date** and **End date** for when the scale condition should be applied.
1. Select **Save**

:::image type="content" source="./media/autoscale-get-started/specific-date-schedule.png" alt-text="A screenshot showing an scale condition for a specific date.":::

You have now defined a scale condition for a specific day. When CPU usage is greater than 70%, an additional instance is added, up to a maximum of 10  instances to handle anticipated load. When CPU usage is below 20%, an instance is removed up to a minimum of 1 instance. By default, autoscale will scale to 3 instances when this scale condition becomes active.

## Additional settings

### View the history of your resource's scale events

Whenever your resource has any scaling event, it is logged in the activity log. You can view the history of the scale events in the **Run history** tab.

:::image type="content" source="./media/autoscale-get-started/run-history.png" lightbox="./media/autoscale-get-started/run-history.png" alt-text="A screenshot showing the run history tab in autoscale settings.":::

### View the scale settings for your resource

Autoscale is an Azure Resource Manager resource. Like other resources, you can see the resource definition in JSON format. To view the autoscale settings in JSON, select the **JSON** tab.

:::image type="content" source="./media/autoscale-get-started/autoscale-setting-json-tab.png" lightbox="./media/autoscale-get-started/autoscale-setting-json-tab.png" alt-text="A screenshot showing the autoscale settings JSON tab.":::

You can make changes in JSON directly, if necessary. These changes will be reflected after you save them.

### Cool-down period effects

Autoscale uses a cool-down period with is the amount of time to wait after a scale operation before scaling again. For example, if the cooldown  is 10 minutes, Autoscale won't attempt to scale again until 10 minutes after the previous scale action. The cooldown period allows the metrics to stabilize and avoids scaling more than once for the same condition.  For more information, see  [Autoscale evaluation steps](autoscale-understanding-settings.md#autoscale-evaluation).

### Flapping

Flapping refers to a loop condition that causes a series of opposing scale events. Flapping happens when one scale event triggers an opposite scale event. For example, scaling in reduces the number of instances causing the CPU to rise in the remaining instances. This in turn triggers scale out event, which causes CPU usage to drop, repeating the process. For more information, see [Flapping in Autoscale](autoscale-flapping.md) and [Troubleshooting autoscale](autoscale-troubleshoot.md)

## Move autoscale to a different region

This section describes how to move Azure autoscale to another region under the same subscription and resource group. You can use REST API to move autoscale settings.

### Prerequisites

- Ensure that the subscription and resource group are available and the details in both the source and destination regions are identical.
- Ensure that Azure autoscale is available in the [Azure region you want to move to](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&regions=all).

### Move

Use [REST API](/rest/api/monitor/autoscalesettings/createorupdate) to create an autoscale setting in the new environment. The autoscale setting created in the destination region will be a copy of the autoscale setting in the source region.

[Diagnostic settings](../essentials/diagnostic-settings.md) that were created in association with the autoscale setting in the source region can't be moved. You'll need to re-create diagnostic settings in the destination region, after the creation of autoscale settings is completed.

### Learn more about moving resources across Azure regions

To learn more about moving resources between regions and disaster recovery in Azure, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

## Next steps

- [Create an activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert)
- [Create an activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert)
