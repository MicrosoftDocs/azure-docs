---
title: Per-region and per-partition autoscale (preview)
titleSuffix: Azure Cosmos DB
description: Configure autoscale in Azure Cosmos DB for uneven workload patterns by customizing autoscale for specific regions or partitions.
author: tarabhatiamsft
ms.author: tarabhatia
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 04/01/2022
# CustomerIntent: As a database adminstrator, I want to fine tune autoscaler for specific regions or partitions so that I can balance an uneven workload.
---

# Per-region and per-partition autoscale (preview)

By default, Azure Cosmos DB autoscale scales workloads based on the most active region and partition. For nonuniform workloads that have different workload patterns across regions and partitions, this scaling can cause unnecessary scale-ups. With this improvement to autoscale, the per region and per partition autoscale feature now allows your workloads’ regions and partitions to scale independently based on usage.

> [!IMPORTANT]
> This feature is only available for Azure Cosmos DB accounts created after **November 15, 2023**.

This feature is recommended for autoscale workloads that are nonuniform across regions and partitions. This feature allows you to save costs if you often experience hot partitions and/or have multiple regions. When enabled, this feature applies to all autoscale resources in the account.

## Use cases

- Database workloads that have a highly trafficked primary region and a secondary passive region for disaster recovery.
  - By enabling autoscale per region and partition, you can now save on costs as the secondary region independently and automatically scales down while idle. The secondary regions also automatically scales-up as it becomes active and while handling write replication from the primary region.
- Multi-region database workloads.
  - These workloads often observe uneven distribution of requests across regions due to natural traffic growth and dips throughout the day. For example, a database might be active during business hours across globally distributed time zones.

## Example

For example, if we have a collection with **1000** RU/s and **2** partitions, each partition can go up to **500** RU/s. For one hour of activity, the utilization would look like this:

| Region | Partition | Throughput | Utilization | Notes |
| --- | --- | --- | --- | --- |
| Write | P1 | <= 500 RU/s | 100% | 500 RU/s consisting of 50 RU/s used for write operations and 450 RU/s for read operations. |
| Write | P2 | <= 200 RU/s | 40% | 200 RU/s consisting of all read operations. |
| Read | P1 | <= 150 RU/s | 30% | 150 RU/s consisting of 50 RU/s used for writes replicated from the write region. 100 RU/s are used for read operations in this region. |
| Read | P2 | <= 50 RU/s | 10% | |

Because all partitions are scaled uniformly based on the hottest partition, both the write and read regions are scaled to 1000 RU/s, making the total RU/s as much as **2000 RU/s**.

With per-partition or per-region scaling, you can optimize your throughput. The total consumption would be **900 RU/s** as each partition or region's throughput is scaled independently and measured per hour using the same scenario.

## Get started

This feature is available for new Azure Cosmos DB accounts. To enable this feature, follow these steps:

1. Navigate to your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com).
1. Navigate to the **Features** page.
1. Locate and enable the **Per Region and Per Partition Autoscale** feature.

    :::image type="content" source="media/autoscale-per-partition-region/enable-feature.png" lightbox="media/autoscale-per-partition-region/enable-feature.png" alt-text="Screenshot of the 'Per Region and Per Partition Autoscale' feature in the Azure portal.":::

> [!IMPORTANT]
> The feature is enabled at the account level, so all containers within the account will automatically have this capability applied. The feature is available for both shared throughput databases and containers with dedicated throughput. Provisioned throughput accounts must switch over to autoscale and then enable this feature, if interested.

## Metrics

Use Azure Monitor to analyze how the new autoscaling is being applied across partitions and regions. Filter to your desired database account and container, then filter or split by the `PhysicalPartitionID` metric. This metric shows all partitions across their various regions.

Then, use `NormalizedRUConsumption' to see which partitions are scaling indpendently and which regions are scaling independently if applicable. You can use the 'ProvisionedThroughput' metric to see what throughput value is getting emmitted to our billing service.

## Requirements/Limitations

Accounts must be created after 11/15/2023 to enable this feature. Support for multi-region write accounts is planned, but not yet supported. 
