---
title: 'Manage cluster horizontal scaling (scale out) to match demand in Azure Data Explorer'
description: This article describes steps to scale out and scale in an Azure Data Explorer cluster based on changing demand.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/09/2019
---

# Manage cluster horizontal scaling (scale out) in Azure Data Explorer to accommodate changing demand

Sizing a cluster appropriately is critical to the performance of Azure Data Explorer. A static cluster size can lead to under-utilization or over-utilization, neither of which is ideal. Because demand on a cluster can’t be predicted with absolute accuracy, it's better to *scale* a cluster, adding and removing capacity and CPU resources with changing demand. 

There are two workflows for scaling an Azure Data Explorer cluster: 
* Horizontal scaling, also called scaling in and out.
* [Vertical scaling](manage-cluster-vertical-scaling.md), also called scaling up and down.
This article explains the horizontal scaling workflow.

## Configure horizontal scaling

By using horizontal scaling, you can scale the instance count automatically, based on predefined rules and schedules. To specify the autoscale settings for your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under **Settings**, select **Scale out**. 

2. In the **Scale out** window, select the autoscale method that you want: **Manual scale**, **Optimized autoscale**, or **Custom autoscale**.

### Manual scale

Manual scale is the default setting during cluster creation. The cluster has a static capacity that doesn't change automatically. You select the static capacity by using the **Instance count** bar. The cluster's scaling remains at that setting until you make another change.

   ![Manual scale method](media/manage-cluster-horizontal-scaling/manual-scale-method.png)

### Optimized autoscale (preview)

Optimized autoscale is the recommended autoscale method. This method optimizes cluster performance and costs. If the cluster approaches a state of under-utilization, it will be scaled in. This action lowers costs but keeps performance level. If the cluster approaches a state of over-utilization, it will be scaled out to maintain optimal performance. To configure Optimized autoscale:

1. Select **Optimized autoscale**. 

1. Select a minimum instance count and a maximum instance count. The cluster auto-scaling ranges between those two numbers, based on load.

1. Select **Save**.

   ![Optimized autoscale method](media/manage-cluster-horizontal-scaling/optimized-autoscale-method.png)

Optimized autoscale starts working. Its actions are now visible in the Azure activity log of the cluster.

#### Logic of optimized autoscale 

**Scale out**

When your cluster approaches a state of over-utilization, scale out to maintain optimal performance. Scale out will occur when:
* The number of cluster instances is below the maximum number of instances defined by the user.
* The cache utilization is high for over an hour.
* The CPU is high for over an hour.
* The ingestion utilization is high for over an hour.

> [!NOTE]
> The scale out logic doesn't currently consider the ingestion utilization metric. If this metric is important for your use case, use [custom autoscale](#custom-autoscale).

**Scale in**

When your cluster approaches a state of under-utilization, scale in to lower costs but maintain performance. Multiple metrics are used to verify that it's safe to scale in the cluster. The following rules are evaluated hourly for 6 hours before scale in is performed:
* The number of instances is above 2 and above the minimum number of instances defined.
* To ensure that there's no overloading of resources, the following metrics must be verified before scale in is performed: 
    * Cache utilization isn't high
    * CPU is below average 
    * Ingestion utilization is below average 
    * Streaming ingest utilization (if streaming ingest is used) isn't high
    * Keep alive events are above a defined minimum, processed properly, and on time.
    * No query throttling 
    * Number of failed queries are below a defined minimum.

> [!NOTE]
> The scale in logic currently requires a 7-day evaluation before implementation of optimized scale in. This evaluation takes place once every 24 hours. If a quick change is needed, use [manual scale](#manual-scale).

### Custom autoscale

By using custom autoscale, you can scale your cluster dynamically based on metrics that you specify. The following graphic shows the flow and steps to configure custom autoscale. More details follow the graphic.

1. In the **Autoscale setting name** box, enter a name, such as *Scale-out: cache utilization*. 

   ![Scale rule](media/manage-cluster-horizontal-scaling/custom-autoscale-method.png)

2. For **Scale mode**, select **Scale based on a metric**. This mode provides dynamic scaling. You can also select **Scale to a specific instance count**.

3. Select **+ Add a rule**.

4. In the **Scale rule** section on the right, enter values for each setting.

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

6. In the **Instance limits** section on the left, enter values for each setting.

    | Setting | Description and value |
    | --- | --- |
    | **Minimum** | The number of instances that your cluster won't scale below, regardless of utilization. |
    | **Maximum** | The number of instances that your cluster won't scale above, regardless of utilization. |
    | **Default** | The default number of instances. This setting is used if there are problems with reading the resource metrics. |
    |  |  |

7. Select **Save**.

You've now configured horizontal scaling for your Azure Data Explorer cluster. Add another rule for vertical scaling. If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Next steps

* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
* [Manage cluster vertical scaling](manage-cluster-vertical-scaling.md) for appropriate sizing of a cluster.
