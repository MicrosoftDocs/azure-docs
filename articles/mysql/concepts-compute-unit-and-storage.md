---
title: 'Explaining vCores in Azure Database for MySQL | Microsoft Docs'
description: 'Azure DB for MySQL: This article explains the concepts of vCores and what happens when your workload reaches the maximum vCores.'
services: mysql
author: seanli1988
ms.author: seal
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 10/10/2017
---
# Explaining vCores in Azure Database for MySQL
This article explains the concept of vCores and what happens when your workload reaches the maximum vCores.

## What are vCores?
vCores are a measure of CPU processing throughput that is guaranteed to be available to a single Azure Database for MySQL server. A Compute Unit is a blended measure of CPU and memory resources. In general, 1 vCore equate to 1 core. 16 vCores equate to sixteen cores of guaranteed processing throughput available to your server.

The amount of memory per Compute Unit is optimized for the Basic and Standard pricing tiers. Doubling the vCores by increasing the performance level equates to doubling the set of resource available to that single Azure Database for MySQL.

For example, a Standard 800 vCores provides 8x more CPU throughput and memory than a Standard 100 vCores configuration. However, while Standard 100 vCores provide the same CPU throughput compared to Basic 100 vCores, the amount of memory that is pre-configured in Standard pricing tier is double the amount of memory configured for Basic pricing tier and doubled again in the Memory Optimized tier. Therefore, Memory Optimized tier provides better workload performance and lower transaction latency than Standard and Standard outperformances Basic with the same vCores selected.

## How can I determine the number of vCores needed for my workload?
If you are looking to migrate an existing MySQL server running on-premises or on a virtual machine, you can determine the number of vCores by estimating how many cores of processing throughput your workload needs. 

If your existing on-premises or virtual machine server is currently utilizing 4 cores (without counting CPU hyperthread), start by configuring 4 vCores for your Azure Database for MySQL server. vCores can be dynamically scaled up or down depending on your workload needs with virtually no application downtime. 

Monitor the Metrics graph in the Azure portal or write Azure CLI commands -to measure vCores. Relevant metrics to monitor are the Compute Unit percentage and Compute Unit limit.

>[!IMPORTANT]
> If you find storage IOPS are not fully utilized to the maximum, consider monitoring the vCores utilization as well. Raising the vCores may allow for higher IO throughput by lessening the performance bottleneck due to limited CPU or memory.

## What happens when I hit my maximum vCores?
Performance levels are calibrated and governed to provide resources to run your database workload up to the max limits for the selected pricing tier and performance level. 

If your workload reaches the maximum limits in either the vCores or provisioned IOPS limits, you can continue to utilize the resources at the maximum allowed level, but your queries are likely to see increased latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries time out. 

If your workload reaches the maximum limits on number of connections, explicit errors are raised. For more information on resources limits, see [Limitations in Azure Database for MySQL](concepts-limits.md).

## Next steps
For more information on pricing tiers, see [Azure Database for MySQL pricing tiers](./concepts-service-tiers.md).
