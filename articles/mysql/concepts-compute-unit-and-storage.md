---
title: Explaining Azure Database for MySQL Compute Units and Storage Units  | Microsoft Docs
description: Explains Compute Unit and Storage Unit and what happens when you hit the maximum Compute Unit or Storage Unit.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: mysql - database
ms.tgt_pltfrm: portal
ms.topic: article
ms.date: 05/10/2017
---
# Explaining Compute Unit and Storage Unit
This article explains the concepts of Compute Unit and Storage Unit and what happens when you hit the maximum Compute Unit or Storage Unit.

## What are Compute Units?
Compute Units are a measure of CPU processing throughput guaranteed to be available to a single Azure Database for MySQL server. A Compute Unit is a blended measure of CPU and memory resources. In general, 50 Compute Units equate to half-core, 100 Compute Units equate to one core, and 2000 Compute Units equate to twenty cores of guaranteed processing throughput available to your server.

The amount of memory per Compute Unit is optimized for the Basic, Standard and Premium service tiers. Doubling the Compute Units by increasing the performance level equates to doubling the set of resource available to that single Azure Database for MySQL

For example, a Standard 2000 Compute Units provides 20x more CPU throughput and memory than a Standard configured with 100 Compute Units. However, while Standard 100 Compute Units provide the same CPU throughput compared to Basic 100 Compute Units, the amount of memory that is pre-configured in Standard tier is double the amount of memory configured for Basic tier and therefore provides better workload performance and transaction latency.

>[!IMPORTANT]
>For predictable workload performance throughput and high user concurrency, it is strongly recommended you choose the Standard service tier.

You can change [service tiers](./concepts-service-tiers.md) at any time with virtually no application downtime. For many businesses and apps, being able to create one to many databases within each single Azure Database for MySQL server, and dialing the performance up or down on demand provides the needed flexibility to manage costs.

>[!IMPORTANT]
>Currently we support scaling up/down performance levels within a service tier. For example, you can scale up from Standard 100 Compute Units to Standard 400 Compute Units. Similarly, you can scale down from Standard 400 Compute Units to Standard 100 Compute Units. The feature to be able to scale up or down across service tiers, for example between Basic and Standard tier will be available in the future.

## What are Storage Units?
Storage Units are a measure of provisioned storage capacity that is guaranteed to be available to a single Azure Database for MySQL server. Each service tier has a fixed amount of provisioned storage which is included in the price of the service tier selected.

Optionally, the storage units can be scaled independently of Compute Units, in increments of 125 GB, up to the maximum allowed storage as described in the table below.

| **Service tier features** | **Basic** | **Standard** | **Premium\*** |
|---------------------------|-----------|--------------|---------------|
| Included Storage Units | 50 GB | 125 GB | 250 GB |
| Maximum total storage | 1050 GB | 10000 GB | 4000 GB |
| Storage IOPS guarantee | N/A | Yes | Yes |
| Maximum storage IOPS | N/A | 30,000 | 40,000 |

Standard and Premium service tiers also provide provisioned IOPS guarantee. The amount of available provisioned IOPS depends on the service tier and the storage capacity configured. For servers deployed in Standard tier, the IOPS is fixed at 3 times the provisioned storage. 

For example, if you have 125 GB of provisioned storage, there is 375 provisioned IOPS available to your server. Premium tier provides very low latency and high IOPS storage. For servers deployed in Premium tier, the provisioned low latency IOPS can scale between five and ten times the provisioned storage.

>[!IMPORTANT]
>If your workload is bottlenecked by configured Compute Units, you may not be able to fully realize available provisioned IOPS. It is recommended that you monitor Compute Units and consider scaling Compute Units if you are not able to fully exploit the available provisioned IOPS.

Scaling Storage Units by incrementing provisioned storage equates to proportionally increasing the provisioned IOPS for Standard and Premium tiers.

>[!IMPORTANT]
>Basic tier does not provide IOPS guarantee.

## How can I determine the number of Compute Units needed for my workload?
If you are looking to migrate an existing on-premises or MySQL running on a virtual machine, you can determine the number of Compute Units by estimating how many cores of processing throughput your workload needs. 

If the on-premise or virtual machine is currently utilizing 4 cores (without counting CPU hyperthread), you can start by configuring 400 Compute Units for Azure Database for MySQL. Compute Units can be scaled up or down depending on your workload needs dynamically with virtually no application downtime. You can also monitor the consumption of Compute Units via Portal or CLI to right-size the resources for the MySQL server.

## How can I determine the number of Storage Units needed for my workload?
You can estimate the amount of Storage Units required by first determining the amount of storage capacity you need. Basic, Standard and Premium tier come with included Storage that is built into the SKU.

The second important factor is determining the IOPS required. Basic tier provides variable IOPS without a guarantee. Standard tier scales at a fixed ratio of three IOPS per GB of provisioned storage and provides IOPS guarantee. You can also monitor the consumption of provisioned IOPS via Portal or CLI to determine usage.

>[!IMPORTANT]
>Storage Units once provisioned cannot be dynamically scaled down.

## What happens when I hit my maximum Compute Units and/or Storage Units?
Performance levels are calibrated and governed to provide the needed resources to run your database workload up to the max limits allowed for your selected service tier/performance level.

If your workload is hitting the limits in one of Compute Units/provisioned IOPS limits, you continue to receive the resources at the maximum allowed level, but you are likely to see increased latencies for your queries. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries start timing out.

If you are hitting limits of maximum connections allowed, you see explicit errors. See [Azure Database for MySQL resource limits](https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits) for more information on limit on resources. <Need to write about the behavior if a user reaches the storage capacity limits>

## Next steps
[Azure Database for MySQL service tiers](./concepts-service-tiers.md) 
