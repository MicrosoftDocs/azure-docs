--- 
title: Concepts for distributing data and scaling out with Arc enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc-enabled data services
description: Concepts for distributing data with Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 06/02/2021
ms.topic: how-to
---

 
# Concepts for distributing data with Arc enabled PostgreSQL Hyperscale server group

This article explains key concepts that are important to benefit the most from Azure Arc-enabled PostgreSQL Hyperscale.
The articles linked below point to the concepts explained for Azure Database for PostgreSQL Hyperscale (Citus). It is the same technology as Azure Arc-enabled PostgreSQL Hyperscale so the same concepts and perspectives apply.

**What is the difference between them?**
- _Azure Database for PostgreSQL Hyperscale (Citus)_

This is the hyperscale form factor of the Postgres database engine available as database as a service in Azure (PaaS). It is powered by the the Citus extension that enables the Hyperscale experience. In this form factor the service runs in the Microsoft datacenters and is operated by Microsoft.

- _Azure Arc-enabled PostgreSQL Hyperscale_

This is the hyperscale form factor of the Postgres database engine offered available with Azure Arc-enabled Data Service. In this form factor, our customers provide the infrastructure that host the systems and operate them.

The key concepts around Azure Arc-enabled PostgreSQL Hyperscale are summarized below:

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Nodes and tables
It is important to know about a following concepts to benefit the most from Azure Arc-enabled Postgres Hyperscale:
- Specialized Postgres nodes in Azure Arc-enabled PostgreSQL Hyperscale: coordinator and workers
- Types of tables: distributed tables, reference tables and local tables
- Shards

See more information at [Nodes and tables in Azure Database for PostgreSQL – Hyperscale (Citus)](../../postgresql/concepts-hyperscale-nodes.md). 

## Determine the application type
Clearly identifying the type of application you are building is important. Why? 
Because running efficient queries on a Azure Arc-enabled PostgreSQL Hyperscale server group requires that tables be properly distributed across servers. 
The recommended distribution varies by the type of application and its query patterns. There are broadly two kinds of applications that work well on Azure Arc-enabled Postgres Hyperscale:
- Multi-Tenant Applications
- Real-Time Applications

The first step in data modeling is to identify which of them more closely resembles your application.

See details at [Determining application type](../../postgresql/concepts-hyperscale-app-type.md).


## Choose a distribution column
Why choose a distributed column?

This is one of the most important modeling decisions you'll make. Azure Arc-enabled PostgreSQL Hyperscale stores rows in shards based on the value of the rows' distribution column. The correct choice groups related data together on the same physical nodes, which makes queries fast and adds support for all SQL features. 
An incorrect choice makes the system run slowly and won't support all SQL features across nodes. This article gives distribution column tips for the two most common hyperscale scenarios.

See details at [Choose distribution columns](../../postgresql/concepts-hyperscale-choose-distribution-column.md).


## Table colocation

Colocation is about storing related information together on the same nodes. 
Queries can go fast when all the necessary data is available without any network traffic. Colocating related data on different nodes allows queries to run efficiently in parallel on each node.

See details at [Table colocation](../../postgresql/concepts-hyperscale-colocation.md).


## Next steps
- [Read about creating Azure Arc-enabled PostgreSQL Hyperscale](create-postgresql-hyperscale-server-group.md)
- [Read about scaling out Azure Arc-enabled PostgreSQL Hyperscale server groups created in your Arc Data Controller](scale-out-in-postgresql-hyperscale-server-group.md)
- [Read about Azure Arc-enabled Data Services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
- [Read about Azure Arc](https://aka.ms/azurearc)

