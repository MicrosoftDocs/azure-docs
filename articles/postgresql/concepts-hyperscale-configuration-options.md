---
title: Azure Database for PostgreSQL – Hyperscale (Citus) (preview) performance options
description: Options for a Hyperscale (Citus) server group, including node compute, storage, and regions.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 4/26/2019
---

## Compute and storage
 
You can select various compute and storage settings for the worker nodes and
separately for the coordinator node in a Hyperscale (Citus) server group.
Compute resources are provided as vCores, which represent the logical CPU of
the underlying hardware. The storage you provision is the amount of storage
capacity available to the coordinator and worker nodes in your Hyperscale
(Citus) server group. The storage is used for the database files, temporary
files, transaction logs, and the Postgres server logs. The total amount of
storage you provision also defines the I/O capacity available to each worker
and coordinator node.
 
|                                | Worker node      | Coordinator node |
|--------------------------------|------------------|------------------|
| Compute, vCores                | 4, 8, 16, 32     | 4, 8, 16, 32     |
| Compure, memory per vCore, GiB | 8                | 4                |
| Storage size, TiB              | 0.5, 1, 2        | 0.5, 1, 2        |
| Storage type                   | Premium SSD      | Premium SSD      |
| IOPS                           | Up to 3 IOPS/GiB | Up to 3 IOPS/GiB | 


## Regions
Hyperscale (Citus) server groups are available in the following Azure regions:
* East US 2
* South East Asia
* West Europe
* West US 2

## Pricing
For the most up-to-date pricing information, see the service pricing page. To see the cost for the configuration you want, the Azure portal shows the monthly cost on the Configure tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the Azure pricing calculator website, select **Add items**, expand the **Databases** category, and choose **Azure Database for PostgreSQL – Hyperscale (Citus)** to customize the options.
 
## Next steps
Learn how to [create a Hyperscale (Citus) server group in the portal](quickstart-create-hyperscale-portal.md).
