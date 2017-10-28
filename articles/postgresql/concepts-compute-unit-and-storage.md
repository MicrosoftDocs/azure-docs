---
title: 'Explaining Compute Units in Azure Database for PostgreSQL | Microsoft Docs'
description: 'Azure DB for PostgreSQL: This article explains the concepts of Compute Units and what happens when your workload reaches the maximum Compute Units.'
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.topic: article
ms.date: 05/23/2017
---
# Explaining Compute Units in Azure Database for PostgreSQL
This article explains the concept of Compute Units and what happens when your workload reaches the maximum Compute Units.

## What are Compute Units?
Compute Units are a measure of CPU processing throughput that is guaranteed to be available to a single Azure Database for PostgreSQL server. A Compute Unit is a blended measure of CPU and memory resources. In general, 50 Compute Units equate to half of a core. 100 Compute Units equate to one core. 2000 Compute Units equate to twenty cores of guaranteed processing throughput available to your server.

The amount of memory per Compute Unit is optimized for the Basic and Standard pricing tiers. Doubling the Compute Units by increasing the performance level equates to doubling the set of resource available to that single Azure Database for PostgreSQL.

For example, a Standard 800 Compute Units provides 8x more CPU throughput and memory than a Standard 100 Compute Units configuration. However, while Standard 100 Compute Units provide the same CPU throughput compared to Basic 100 Compute Units, the amount of memory that is pre-configured in Standard pricing tier is double the amount of memory configured for Basic pricing tier. Therefore, Standard pricing tier provides better workload performance and lower transaction latency than Basic pricing tier with the same Compute Units selected.

## How can I determine the number of Compute Units needed for my workload?
If you are looking to migrate an existing PostgreSQL server running on-premise or on a virtual machine, you can determine the number of Compute Units by estimating how many cores of processing throughput your workload needs. 

If your existing on-premise or virtual machine server is currently utilizing 4 cores (without counting CPU hyperthread), start by configuring 400 Compute Units for your Azure Database for PostgreSQL server. Compute Units can be dynamically scaled up or down depending on your workload needs with virtually no application downtime. 

Monitor the Metrics graph in the Azure portal or write Azure CLI commands -to measure compute units. Relevant metrics to monitor are the Compute Unit percentage and Compute Unit limit.

>[!IMPORTANT]
> If you find storage IOPS are not fully utilized to the maximum, consider monitoring the compute units utilization as well. Raising the Compute Units may allow for higher IO throughput by lessening the performance bottleneck due to limited CPU or memory.

## What happens when I hit my maximum Compute Units?
Performance levels are calibrated and governed to provide resources to run your database workload up to the max limits for the selected pricing tier and performance level. 

If your workload reaches the maximum limits in either the Compute Units or provisioned IOPS limits, you can continue to utilize the resources at the maximum allowed level, but your queries are likely to see increased latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries time out. 

If your workload reaches the maximum limits on number of connections, explicit errors are raised. For more information on resources limits, see [Limitations in Azure Database for PostgreSQL](concepts-limits.md).

## Next steps
For more information on pricing tiers, see [Azure Database for PostgreSQL pricing tiers](./concepts-service-tiers.md).
