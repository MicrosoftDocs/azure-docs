---
title: How to choose between manual and autoscale on Azure Cosmos DB
description: Learn how to choose between standard (manual) provisioned throughput and autoscale provisioned throughput for your workload.
author: deborahc
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 04/01/2022
ms.author: dech
---

# How to choose between standard (manual) and autoscale provisioned throughput 
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB supports two types or offers of provisioned throughput: standard (manual) and autoscale. Both throughput types are suitable for mission-critical workloads that require high performance and scale, and are backed by the same Azure Cosmos DB SLAs on throughput, availability, latency, and consistency.

This article describes how to choose between standard (manual) and autoscale provisioned throughput for your workload. 

## Overview of provisioned throughput types
Before diving into the difference between standard (manual) and autoscale, it's important to first understand how provisioned throughput works in Azure Cosmos DB. 

When you use provisioned throughput, you set the throughput, measured in request units per second (RU/s) required for your workload. The service provisions the capacity needed to support the throughput requirements. Database operations against the service, such as reads, writes, and queries consume some amount of request units (RUs). Learn more about [request units](request-units.md).

The following table shows a high-level comparison between standard (manual) and autoscale.

|Description|Standard (manual)|Autoscale|
|-------------|------|-------|
|Best suited for|Workloads with steady or predictable traffic|Workloads with variable or unpredictable traffic. See [use cases of autoscale](provision-throughput-autoscale.md#use-cases-of-autoscale).|
|How it works|You provision a set amount of RU/s `T` that is static over time, unless you manually change them. Each second, you can use up to `T` RU/s throughput. <br/><br/>For example, if you set standard (manual) 400 RU/s, the throughput will stay at 400 RU/s.|You set the highest, or maximum RU/s `Tmax` you don't want the system to exceed. The system automatically scales the throughput `T` such that `0.1* Tmax <= T <= Tmax`. <br/><br/>For example, if you set autoscale maximum RU/s of 4000 RU/s, the system will scale between 400 - 4000 RU/s.|
|When to use it|You want to manually manage your throughput capacity (RU/s) and scale yourself.<br/><br/>You have high, consistent utilization of provisioned RU/s. Of all hours in a month, if you set provisioned RU/s `T` and use the full amount for 66% of the hours or more, it's estimated you'll save with standard (manual) provisioned RU/s.<br/><br/>This is based on a comparison between setting `T` in standard (manual) and the same amount `Tmax` in autoscale. |You want Azure Cosmos DB to manage your throughput capacity (RU/s) and scale, based on usage.<br/><br/>You have RU/s usage that is variable or hard to predict. Of all hours in a month, if you set autoscale max RU/s `Tmax` and use the full amount `Tmax` for 66% of the hours or less, it's estimated you'll save with autoscale.<br/><br/>This is based on a comparison between setting autoscale `Tmax` and the same amount `T` in standard (manual) throughput.|
|Billing model|Billing is done on a per-hour basis for the RU/s provisioned, regardless of how many RUs were consumed.<br/><br/>Example: <li>Provision 400 RU/s</li><li>Hour 1: no requests</li><li>Hour 2: 400 RU/s worth of requests</li><br/><br/>For both hours 1 and 2, you'll be billed 400 RU/s for both hours at the [standard (manual) rates](https://azure.microsoft.com/pricing/details/cosmos-db/).|Billing is done on a per-hour basis, for the highest RU/s the system scaled to in the hour. <br/><br/>Example: <li>Provision autoscale max RU/s of 4000 RU/s (scales between 400 - 4000 RU/s)</li><li>Hour 1: system scaled up to highest value of 3500 RU/s</li><li>Hour 2: system scaled down to minimum of 400 RU/s (always 10% of `Tmax`), due to no usage</li><br/><br/>You will be billed for 3500 RU/s in hour 1, and 400 RU/s in hour 2 at the [autoscale provisioned throughput rates](https://azure.microsoft.com/pricing/details/cosmos-db/). The autoscale rate per RU/s is 1.5 * the standard (manual) rate.
|What happens if you exceed provisioned RU/s|The RU/s remain static at what is provisioned. Any requests that consume beyond the provisioned RUs in a second will be rate-limited, with a response that recommends a time to wait before retrying. You can manually increase or decrease the RU/s if needed.| The system will scale the RU/s up to the autoscale max RU/s. Any requests that consume beyond the autoscale max RU/s in a second will be rate-limited, with a response that recommends a time to wait before retrying.|

## Understand your traffic patterns

### New applications ###

If you are building a new application and do not know your traffic pattern yet, you may want to start at the entry point RU/s (or minimum RU/s) to avoid over-provisioning in the beginning. Or, if you have a small application that doesn't need high scale, you may want to provision just the minimum entry point RU/s to optimize cost. For small applications with a low expected traffic, you can also consider the [serverless](throughput-serverless.md) capacity mode.

Whether you plan to use standard (manual) or autoscale, here's what you should consider:

If you provision standard (manual) RU/s at the entry point of 400 RU/s, you won't be able to consume above 400 RU/s, unless you manually change the throughput. You'll be billed for 400 RU/s at the standard (manual) provisioned throughput rate, per hour.

If you provision autoscale throughput with max RU/s of 4000 RU/s, the resource will scale between 400 to 4000 RU/s. Since the autoscale throughput billing rate per RU/s is 1.5x of the standard (manual) rate, for hours where the system has scaled down to the minimum of 400 RU/s, your bill will be higher than if you provisioned 400 RU/s manually. However, with autoscale, at any time, if your application traffic spikes, you can consume up to 4000 RU/s with no user action required. In general, you should weigh the benefit of being able to consume up to the max RU/s at any time with the 1.5x rate of autoscale.

Use the Azure Cosmos DB [capacity calculator](estimate-ru-with-capacity-planner.md) to estimate your throughput requirements. 

### Existing applications ###

If you have an existing application using standard (manual) provisioned throughput, you can use [Azure Monitor metrics](insights-overview.md) to determine if your traffic pattern is suitable for autoscale. 

First, find the [normalized request unit consumption metric](monitor-normalized-request-units.md#view-the-normalized-request-unit-consumption-metric) of your database or container. Normalized utilization is a measure of how much you are currently using your standard (manual) provisioned throughput. The closer the number is to 100%, the more you are fully using your provisioned RU/s. [Learn more](monitor-normalized-request-units.md#view-the-normalized-request-unit-consumption-metric) about the metric.

Next, determine how the normalized utilization varies over time. Find the highest normalized utilization for each hour. Then, calculate the average normalized utilization across all hours. If you see that your average utilization is less than 66%, consider enabling autoscale on your database or container. In contrast, if the average utilization is greater than 66%, it's recommended to remain on standard (manual) provisioned throughput.

> [!TIP]
> If your account is configured to use multi-region writes and has more than one region, the rate per 100 RU/s is the same for both manual and autoscale. This means that enabling autoscale incurs no additional cost regardless of utilization. As a result, it is always recommended to use autoscale with multi-region writes when you have more than one region, to take advantage of the savings from paying only for the RU/s your application scales to. If you have multi-region writes and one region, use the average utilization to determine if autoscale will result in cost savings. 

#### Examples

Let's take a look at two different example workloads and analyze if they are suitable for manual or autoscale throughput. To illustrate the general approach, we'll analyze three hours of history to determine the cost difference between using manual and autoscale. For production workloads, it's recommended to use 7 to 30 days of history (or longer if available) to establish a pattern of RU/s usage.

> [!NOTE]
> All the examples shown in this doc are based on the price for an Azure Cosmos DB account deployed in a non-government region in the US. The pricing and calculation vary depending on the region you are using, see the Azure Cosmos DB [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for the latest pricing information.

Assumptions:
- Suppose we currently have manual throughput of 30,000 RU/s. 
- Our region is configured with single-region writes, with one region. If we had multiple regions, we would multiply the hourly cost by the number of regions.
- Use public pricing rates for manual ($0.008 USD per 100 RU/s per hour) and autoscale throughput ($0.012 USD per 100 RU/s per hour) in single-region write accounts. See [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for details. 

#### Example 1: Variable workload (autoscale recommended)

First, we look at the normalized RU consumption. This workload has variable traffic, with normalized RU consumption ranging from 6% to 100%. There are occasional spikes to 100% that are hard to predict, but many hours with low utilization. 

:::image type="content" source="media/how-to-choose-offer/variable-workload_use_autoscale.png" alt-text="Workload with variable traffic - normalized RU consumption between 6% and 100% for all hours":::

Let's compare the cost of provisioning 30,000 RU/s manual throughput, versus setting autoscale max RU/s to 30,000 (scales between 3000 - 30,000 RU/s). 

Now, let's analyze the history. Suppose we have the utilization described in the following table. The average utilization across these three hours is 39%. Because the normalized RU consumption averages to less than 66%, we save by using autoscale. 

Note that in hour 1, when there is 6% usage, autoscale will bill RU/s for 10% of the max RU/s, which is the minimum per hour. Though the cost of autoscale may be higher than manual throughput in certain hours, as long as the average utilization is less than 66% across all hours, autoscale will be cheaper overall.

|Time period  | Utilization |Billed autoscale RU/s  |Option 1: Manual 30,000 RU/s  | Option 2: Autoscale between 3000 - 30,000 RU/s |
|---------|---------|---------|---------|---------|
|Hour 1  | 6%  |     3000  |  30,000 * 0.008 / 100 = $2.40        |   3000 * 0.012 / 100 = $0.36      |
|Hour 2  | 100%  |     30,000    |  30,000 * 0.008 / 100 = $2.40       |  30,000 * 0.012 / 100 = $3.60      |
|Hour 3 |  11%  |     3300    |  30,000 * 0.008 / 100 = $2.40       |    3300 * 0.012 / 100 = $0.40     |
|**Total**   |  |        |  $7.20       |    $4.36 (39% savings)    |

#### Example 2: Steady workload (manual throughput recommended)

This workload has steady traffic, with normalized RU consumption ranging from 72% to 100%. With 30,000 RU/s provisioned, this means that we are consuming between 21,600 to 30,000 RU/s.

:::image type="content" source="media/how-to-choose-offer/steady_workload_use_manual_throughput.png" alt-text="Workload with steady traffic - normalized RU consumption between 72% and 100% for all hours":::

Let's compare the cost of provisioning 30,000 RU/s manual throughput, versus setting autoscale max RU/s to 30,000 (scales between 3000 - 30,000 RU/s).

Suppose we have the utilization history as described in the table. Our average utilization across these three hours is 88%. Because the normalized RU consumption averages to greater than 66%, we save by using manual throughput.

In general, if the average utilization across all 730 hours in one month is greater than 66%, then we'll save by using manual throughput. 

| Time period | Utilization |Billed autoscale RU/s  |Option 1: Manual 30,000 RU/s  | Option 2: Autoscale between 3000 - 30,000 RU/s |
|---------|---------|---------|---------|---------|
|Hour 1  | 72%  |     21,600   |  30,000 * 0.008 / 100 = $2.40        |   21600 * 0.012 / 100 = $2.59      |
|Hour 2  | 93%  |     28,000    |  30,000 * 0.008 / 100 = $2.40       |  28,000 * 0.012 / 100 = $3.36       |
|Hour 3 |  100%  |     30,000    |  30,000 * 0.008 / 100 = $2.40       |    30,000 * 0.012 / 100 = $3.60     |
|**Total**   |  |        |  $7.20       |    $9.55     |

> [!TIP]
> With standard (manual) throughput, you can use the normalized utilization metric to estimate the actual RU/s you may use if you switch to autoscale. Multiply the normalized utilization at a point in time by the currently provisioned standard (manual) RU/s. For example, if you have provisioned 5000 RU/s, and the normalized utilization is 90%, the RU/s usage is 0.9 * 5000 = 4500 RU/s. 
If you see that your traffic pattern is variable, but you are over or under provisioned, you may want to enable autoscale and then change the autoscale max RU/s setting accordingly.

#### How to calculate average utilization
Autoscale bills for the highest RU/s scaled to in an hour. When analyzing the normalized RU consumption over time, it is important to use the highest utilization per hour when calculating the average. 

To calculate the average of the highest utilization across all hours:
1. Set the **Aggregation** on the Noramlized RU Consumption metric to **Max**.
1. Select the **Time granularity** to 1 hour.
1. Navigate to **Chart options**.
1. Select the bar chart option. 
1. Under **Share**, select the **Download to Excel** option. From the generated spreadsheet, calculate the average utilization across all hours. 

:::image type="content" source="media/how-to-choose-offer/variable-workload-highest-util-by-hour.png" alt-text="To see normalized RU consumption by hour, 1) Select time granularity to 1 hour; 2) Edit chart settings; 3) Select bar chart option; 4) Under Share, select Download to Excel option to calculate average across all hours. ":::

## Measure and monitor your usage
Over time, after you've chosen the throughput type, you should monitor your application and make adjustments as needed. 

When using autoscale, use Azure Monitor to see the provisioned autoscale max RU/s (**Autoscale Max Throughput**) and the RU/s the system is currently scaled to (**Provisioned Throughput**). Below is an example of a variable or unpredictable workload using autoscale. Note when there isn't any traffic, the system scales the RU/s to the minimum of 10% of the max RU/s, which in this case is 5000 RU/s and 50,000 RU/s, respectively. 

:::image type="content" source="media/how-to-choose-offer/autoscale-metrics-azure-monitor.png" alt-text="Example of workload using autoscale, with autoscale max RU/s of 50,000 RU/s and throughput ranging from 5000 - 50,000 RU/s":::

> [!NOTE]
> When you use standard (manual) provisioned throughput, the **Provisioned Throughput** metric refers to what you as a user have set. When you use autoscale throughput, this metric refers to the RU/s the system is currently scaled to.

## Next steps
* Use [RU calculator](https://cosmos.azure.com/capacitycalculator/) to estimate throughput for new workloads.
* Use [Azure Monitor](monitor.md#view-operation-level-metrics-for-azure-cosmos-db) to monitor your existing workloads.
* Learn how to [provision autoscale throughput on an Azure Cosmos DB database or container](how-to-provision-autoscale-throughput.md).
* Review the [autoscale FAQ](autoscale-faq.yml).
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
