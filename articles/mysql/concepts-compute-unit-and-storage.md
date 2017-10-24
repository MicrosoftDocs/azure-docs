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
ms.date: 10/24/2017
---
# Explaining vCores in Azure Database for MySQL
This article explains the concept of vCores and what happens when your workload reaches the maximum vCores.

## What are vCores?
vCores is a virtual core that represents the logical CPU available for your server offered with an option to choose between Gen4 and Gen5 hardware. For servers created using Gen4 vCores, they are based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors. For servers created using Gen5 vCores, each vCore is a hyperthread from Intel E5-2673 v4 (Broadwell) 2.3 GHz processors.

The amount of memory per Compute Unit is optimized for the General Purpose and Memory Optimized pricing tiers. Doubling the vCores by increasing the performance level equates to doubling the set of resource available to that single Azure Database for MySQL.

For example, a General Purpose 8 vCores provides 4x more CPU throughput and memory than a General Purpose 2 vCores configuration. However, while General Purpose 2 vCores provide the same CPU throughput compared to Basic 2 vCores, the amount of memory that is pre-configured in General Purpose pricing tier is double the amount of memory configured for Basic pricing tier. Similarly with the same vCore selection, memory is doubled again in the Memory Optimized tier comparing to the General Purpose tier. Therefore, Memory Optimized tier provides better workload performance and lower transaction latency than General Purpose and General Purpose outperformances Basic with the same vCores selected.

## How can I determine the number of vCores needed for my workload?
If you are looking to migrate an existing MySQL server running on-premises or on a virtual machine, you can determine the number of vCores by estimating how many cores of processing throughput your workload needs. 

If your existing on-premises or virtual machine server is currently utilizing 4 cores (without counting CPU hyperthread), start by configuring 8 vCores for your Azure Database for MySQL server. vCores can be dynamically scaled up or down depending on your workload needs with virtually no application downtime. 

Monitor the Metrics graph in the Azure portal or write Azure CLI commands -to measure vCores. Relevant metrics to monitor are the Compute Unit percentage and Compute Unit limit. 

>[!IMPORTANT]
> If you find storage IOPS are not fully utilized to the maximum, consider monitoring the vCores utilization as well. Raising the vCores may allow for higher IO throughput by lessening the performance bottleneck due to limited CPU or memory.

## What happens when I hit my maximum vCores?
Performance levels are calibrated and governed to provide resources to run your database workload up to the max limits for the selected pricing tier and performance level. 

If your workload reaches the maximum limits in either the vCores or provisioned IOPS limits, you can continue to utilize the resources at the maximum allowed level, but your queries are likely to see increased latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries time out. 

If your workload reaches the maximum limits on number of connections, explicit errors are raised. For more information on resources limits, see [Limitations in Azure Database for MySQL](concepts-limits.md).

## Next steps
For more information on pricing tiers, see [Azure Database for MySQL pricing tiers](./concepts-service-tiers.md).
