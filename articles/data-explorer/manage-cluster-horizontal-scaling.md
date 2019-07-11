---
title: Scale out an Azure Data Explorer cluster
description: This article describes steps to scale out and scale in an Azure Data Explorer cluster based on changing demand.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/30/2019
---

# Manage cluster horizontal scaling to accommodate changing demand

Sizing a cluster appropriately is critical to the performance of Azure Data Explorer. But demand on a cluster can’t be predicted with absolute accuracy. A static cluster size can lead to underutilization or overutilization, neither of which is ideal.

A better approach is to *scale* a cluster, adding and removing capacity with changing demand. There are two workflows for scaling: 
* Horizontal scaling, also called scaling out and in.
* Vertical scaling, also called scaling up and down.

This article explains the horizontal scaling workflow.

Horizontal scaling allows you to scale the instance count automatically based on predefined rules and schedules. Specify your autoscale settings for your cluster in the Azure portal, as described in this article.

## Steps to configure horizontal scaling

In the Azure portal, go to your Data Explorer cluster resource. Under the **Settings** heading, select **Scale out**. 

Select your desired autoscale method: **Manual scale**, **Optimized autoscale** or **Custom autoscale**.

### Manual scale

Manual scale is the default setting with cluster creation. It means that the cluster have a static cluster capacity that will not change automatically. You can choose the static capacity using the bar and it will not change until next time you will change the cluster's scale out setting.

   ![Manual scale method](media/manage-cluster-horizontal-scaling/manual-scale-method.png)

### Optimized autoscale

Optimized autoscale is the recommended autoscale method. Steps to configure Optimized autoscale:

1. Selected Optimized autoscale option and choose a lower limit and an upper limit to the amount of instances of the cluster, the autoscaling will be done between those limits.
2. Click save.

   ![Optimized autoscale method](media/manage-cluster-horizontal-scaling/optimized-autoscale-method.png)

After clicking save Optimized autoscale mechanism will start to work and it's actions will be visible in the Activity log of the cluster. This autoscale method is optimizing the cluster performance and costs: if the cluster will start to get to a state of underutilization it will be scaled-in which leave performance the same and lower costs, and if the cluster will start to get to a state of overutilization, it will be scaled-out to make sure it's performing well

### Custom autoscale

Custom autoscale method allows you scale your cluster dynamically based on metrics that you specify. The following graphic shows the flow and steps to configure Custom autoscale. More details follow the graphic.

1. In the **Autoscale setting name** box, provide a name, such as *Scale-out: cache utilization*. 

   ![Scale rule](media/manage-cluster-horizontal-scaling/custom-autoscale-method.png)

2. For **Scale mode**, select **Scale based on a metric**. This mode provides dynamic scaling. You can also select **Scale to a specific instance count**.

3. Select **+ Add a rule**.

4. In the **Scale rule** section on the right, provide values for each setting.

    **Criteria**

    | Setting | Description and value |
    | --- | --- |
    | **Time aggregation** | Select an aggregation criteria, such as **Average**. |
    | **Metric name** | Select the metric you want the scale operation to be based on, such as **Cache Utilization**. |
    | **Time grain statistic** | Choose between **Average**, **Minimum**, **Maximum**, and **Sum**. |
    | **Operator** | Choose the appropriate option, such as **Greater than or equal to**. |
    | **Threshold** | Choose an appropriate value. For example, for cache utilization, 80 percent is a good starting point. |
    | **Duration (in minutes)** | Choose an appropriate amount of time for the system to look back when calculating metrics. Start with the default of 10 minutes. |
    |  |  |

    **Action**

    | Setting | Description and value |
    | --- | --- |
    | **Operation** | Choose the appropriate option to scale in or scale out. |
    | **Instance count** | Choose the number of nodes or instances you want to add or remove when a metric condition is met. |
    | **Cool down (minutes)** | Choose an appropriate time interval to wait between scale operations. Start with the default of five minutes. |
    |  |  |

5. Select **Add**.

6. In the **Instance limits** section on the left, provide values for each setting.

    | Setting | Description and value |
    | --- | --- |
    | **Minimum** | The number of instances that your cluster won't scale below, regardless of utilization. |
    | **Maximum** | The number of instances that your cluster won't scale above, regardless of utilization. |
    | **Default** | The default number of instances. This setting is used if there are problems with reading the resource metrics. |
    |  |  |

7. Select **Save**.

You've now configured a scale-out operation for your Azure Data Explorer cluster. Add another rule for a scale-in operation. If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Next steps

* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
* [Manage cluster vertical scaling](manage-cluster-vertical-scaling.md) for appropriate sizing of a cluster.
