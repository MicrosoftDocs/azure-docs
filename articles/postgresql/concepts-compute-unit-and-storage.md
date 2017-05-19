---
title: 'Explaining Azure DB for PostgreSQL Compute Units and Storage Units  | Microsoft Docs'
description: 'Azure DB for PostgreSQL: Explains Compute Unit and Storage Unit and what happens when you hit the maximum Compute Unit or Storage Unit.'
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: article
ms.date: 05/17/2017
---
# Explaining Compute Units and Storage
This article explains the concepts of Compute Units and Storage and explains what happens when your workload reaches the maximum Compute Units or  maximum Storage.

## What are Compute Units?
Compute Units are a measure of CPU processing throughput that is guaranteed to be available to a single Azure Database for PostgreSQL server. A Compute Unit is a blended measure of CPU and memory resources. In general, 50 Compute Units equate to half of a core. 100 Compute Units equate to one core. 2000 Compute Units equate to twenty cores of guaranteed processing throughput available to your server.

The amount of memory per Compute Unit is optimized for the Basic and Standard service tiers. Doubling the Compute Units by increasing the performance level equates to doubling the set of resource available to that single Azure Database for PostgreSQL. 

For example, a Standard 2000 Compute Units provides 20x more CPU throughput and memory than a Standard configured with 100 Compute Units. However, while Standard 100 Compute Units provide the same CPU throughput compared to Basic 100 Compute Units, the amount of memory that is pre-configured in Standard tier is double the amount of memory configured for Basic tier. Therefore, Standard tier provides better workload performance and lower transaction latency than Basic tier with the same Compute Units selected.

>[!IMPORTANT]
>For predictable workload performance throughput and high user concurrency, it is recommended you choose the Standard service tier.

Azure Database for PostgreSQL server provides your business and applications flexibility in scale and cost. You can create one database per server, or use multiple databases within a single server, and dial the performance of the server up or down flexibly to meet your demands.

You can change [service tiers](concepts-service-tiers.md) at any time with virtually no application downtime.

>[!IMPORTANT]
>Currently we support scaling up/down performance levels within a service tier. For example, you can scale up from Standard tier with 100 Compute Units to Standard tier with 400 Compute Units. Similarly, you can scale down from Standard tier with 400 Compute Units to Standard tier with 100 Compute Units. Scaling across the service tiers, for example from Basic tier to Standard tier, is not yet available but will be made available in the future.

## Configuring Storage
The Storage configuration defines the amount of storage capacity available to an Azure Database for PostgreSQL server.  Consider the size of storage needed to host your databases and the performance requirements (IOPS) when selecting the Storage configuration.

Each service tier starts with a fixed amount of included storage as described in the following table.

Additional storage capacity can be added when the server is created, in increments of 125 GB, up to the maximum allowed storage as described in the following table. The additional storage capacity can be configured independently of the Compute Units configuration. The price changes based on the amount of storage selected.

| **Service tier features** | **Basic** | **Standard** |
|---------------------------|-----------|--------------|
| Included Storage | 50 GB | 125 GB |
| Maximum total storage | 1 TB | 1 TB |
| Storage IOPS guarantee | N/A | Yes |
| Maximum storage IOPS | N/A | 3,000 |

Basic tier does not provide any IOPS guarantee. Standard tier provides a provisioned IOPS guarantee, and is fixed to three times the provisioned storage.  For example, in standard tier, selecting 125 GB of storage capacity provides 375 IOPS available to your server. 

Monitor the Metrics graph in the Azure portal or write Azure CLI commands to measure the consumption of storage and IOPS. Relevant metrics to monitor are Storage limit, Storage percentage, Storage used, and IO percent.

>[!IMPORTANT]
> Once provisioned, Storage cannot be dynamically scaled down.

## How can I determine the number of Compute Units needed for my workload?
If you are looking to migrate an existing PostgreSQL server running on-premise or on a virtual machine, you can determine the number of Compute Units by estimating how many cores of processing throughput your workload needs. 

If your existing on-premise or virtual machine server is currently utilizing 4 cores (without counting CPU hyperthread), start by configuring 400 Compute Units in your Azure Database for PostgreSQL server. Compute Units can be dynamically scaled up or down depending on your workload needs with virtually no application downtime. 

Monitor the Metrics graph in the Azure portal or write Azure CLI commands to measure compute units. Relevant metrics to monitor are the Compute Unit percentage and Compute Unit limit.

>[!IMPORTANT]
> If you find storage IOPS are not fully utilized to the maximum, consider monitoring the compute units utilization as well. Raising the Compute Units may allow for higher IO throughput by lessening the performance bottleneck due to limited CPU or memory.

## What happens when I hit my maximum Compute Units or Storage?
Performance levels are calibrated and governed to provide resources to run your database workload up to the max limits for selected service tier/performance level. 

If your workload reaches the maximum limits in either the Compute Units or provisioned IOPS limits, you can continue to utilize the resources at the maximum allowed level, but your queries are likely to see increased latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries time out. 

If your workload reaches the maximum limits on number of connections, explicit errors are raised. See [Limitations in Azure Database for PostgreSQL](concepts-limits.md) for more information on resources limits.

## Next steps
- For more information on Compute Units and Storage, see [Azure Database for PostgreSQL service tiers](./concepts-service-tiers.md).
