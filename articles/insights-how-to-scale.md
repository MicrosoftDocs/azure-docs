<properties 
	pageTitle="Scale instance count manually or automatically" 
	description="Learn how to scale your services Azure." 
	authors="stepsic-microsoft-com" 
	manager="ronmart" 
	editor="" 
	services="application-insights" 
	documentationCenter=""/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/25/2014" 
	ms.author="stepsic"/>

# Scale instance count manually or automatically

In the portal, you can manually set the instance count of your service, or, you can set parameters to have it automatically scale based on demand. This is typically referred to as *Scale out* or *Scale in*.

Before scaling based on instance count, you should consider that scaling is affected by **Pricing tier** in addition to instance count. Different pricing tiers can have different numbers cores and memory, and so they will have better performance for the same number of instances (which is *Scale up* or *Scale down*). This article specifically covers *Scale in* and *out*.

## Scaling manually

1. In the [portal](https://portal.azure.com/), click **Browse**, then navigate to the resource you want to scale, such as a **App Service plan**.

2. The **Scale** part on **Operations** lens will tell you the status of scaling: **Off** for when you are scaling manually, **On** for when you are scaling by one or more performance metrics.
    ![Scale part](./media/insights-how-to-scale/Insights_UsageLens.png)

3. Clicking on the part will take you to the **Scale** blade. At the top of the scale blade you can see a history of autoscale actions the service.  
    ![Scale blade](./media/insights-how-to-scale/Insights_ScaleBladeDayZero.png)
    
>[AZURE.NOTE] Only actions that are performed by autoscale will show up in this chart. If you manually adjust the instance count, the change will not be reflected in this chart.

4. You can manually adjust the number **Instances** with slider.
5. Click the **Save** command and you'll be scaled to that number of instances almost immediately. 

## Scaling based on a pre-set metric

If you want the number of instances to automatically adjust based on a metric, select the metric you want in the **Scale by** dropdown. For example, for an **App Service plan** you can scale by **CPU Percentage**.

1. When you select a metric you'll get a slider, and/or, text boxes to enter the number of instances you want to scale between:

    ![Scale blade with CPU Percentage](./media/insights-how-to-scale/Insights_ScaleBladeCPU.png) 
    
    Autoscale will never take your service below or above the boundaries that you set, no matter your load.

2. Second, you choose the target range for the metric. For example, if you chose **CPU percentage**, you can set a target for the average CPU across all of the instances in your service. A scale up will happen when the average CPU exceeds the maximum you define, likewise, a scale down will happen whenever the average CPU drops below the minimum.

3. Click the **Save** command. Autoscale will check every few minutes to make sure that you are in the instance range and target for your metric. When your service receives additional traffic,  you will get more instances without doing anything.

## Scale based on other metrics

You can scale based on metrics other than the presets that appear in the **Scale by** dropdown, and can even have a complex set of scale up and scale down rules.

### Scaling based on other performance metrics

1. Choose the **schedule and performance rules** in the **Scale by** dropdown:
![Performance rules](./media/insights-how-to-scale/Insights_PerformanceRules.png)

2. If you previously had autoscale, on you'll see a view of the exact rules that you had.

3. To scale based on another metric click the **Add Rule** row. You can also click one of the existing rows to change from the metric you previously had to the metric you want to scale by.
![Add rule](./media/insights-how-to-scale/Insights_AddRule.png)

4. Now you need to select which metric you want to scale by. 

The Metric Detail blade contains all of the controls that you need to set up your optimal scale profile. At the top, choose the new metric that you want to scale by.

### Scaling with multiple steps

Below the graph of the metric are two sections: **Scale up rules** and **Scale down rules**. Your service will scale up if **any** of the scale up rules are met. Conversely, your service will scale down if **all** of the scale down rules are met.

For each rule you choose:

- Operator - either Greater than or Less than
- Threshold - the number that this metric has to pass to trigger the action
- Duration - the number of minutes that this metric is averaged over
- Value - the size of the scale action
- Cool down - how long this rule should wait after the previous scale action to scale again

![Multiple scale rules](./media/insights-how-to-scale/Insights_MultipleScaleRules.png)

With multiple scale rules, you can be more agressive about scaling up (or down) as performance changes. For example, you can define two scale rules:

1. Scale up by 1 instance if CPU percentage is above 60%
2. Scale up by 3 instances if CPU percentage is above 85%

With this additional rule, if your load exceeds 85% before a scale action, you will get two additional instances instead of one. 
