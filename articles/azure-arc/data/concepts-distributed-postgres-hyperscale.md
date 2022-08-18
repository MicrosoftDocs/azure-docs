---
title: Concepts for distributing data and scaling out with Azure Arc-enabled PostgreSQL server
titleSuffix: Azure Arc-enabled data services
description: Concepts for distributing data with Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql 
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 06/02/2021
ms.topic: how-to
---

# Concepts for distributing data with Azure Arc-enabled PostgreSQL server

This article explains key concepts that are important to benefit the most from Azure Arc-enabled PostgreSQL server.
The articles linked below point to the concepts explained for Azure Database for PostgreSQL server. It is the same technology as Azure Arc-enabled PostgreSQL server so the same concepts and perspectives apply.

**What is the difference between them?**
- _Azure Database for PostgreSQL server_

This is the hyperscale form factor of the Postgres database engine available as database as a service in Azure (PaaS). It is powered by the Citus extension that enables the Hyperscale experience. In this form factor the service runs in the Microsoft datacenters and is operated by Microsoft.

- _Azure Azure Arc-enabled PostgreSQL server_

This is the hyperscale form factor of the Postgres database engine offered available with Azure Arc-enabled Data Service. In this form factor, our customers provide the infrastructure that host the systems and operate them.

The key concepts around Azure Arc-enabled PostgreSQL server are summarized below:

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Nodes and tables
It is important to know about the following concepts to benefit the most from Azure Arc-enabled PostgreSQL server:
- Specialized Postgres nodes in Azure Arc-enabled PostgreSQL server: coordinator and workers
- Types of tables: distributed tables, reference tables and local tables
- Shards

## Determine the application type
Clearly identifying the type of application you are building is important. Why? 
Because running efficient queries on a Azure Arc-enabled PostgreSQL server requires that tables be properly distributed across servers. 
The recommended distribution varies by the type of application and its query patterns. There are broadly two kinds of applications that work well on Azure Arc-enabled PostgreSQL server:
- Multi-Tenant Applications
- Real-Time Applications

The first step in data modeling is to identify which of them more closely resembles your application.

See details at [Determining application type](../../postgresql/hyperscale/howto-app-type.md).


## Choose a distribution column
Why choose a distributed column?

This is one of the most important modeling decisions you'll make. Azure Arc-enabled PostgreSQL server stores rows in shards based on the value of the rows' distribution column. The correct choice groups related data together on the same physical nodes, which makes queries fast and adds support for all SQL features. 
An incorrect choice makes the system run slowly and won't support all SQL features across nodes. This article gives distribution column tips for the two most common hyperscale scenarios.

See details at [Choose distribution columns](../../postgresql/hyperscale/howto-choose-distribution-column.md).


## Table colocation

Colocation is about storing related information together on the same nodes. 
Queries can go fast when all the necessary data is available without any network traffic. Colocating related data on different nodes allows queries to run efficiently in parallel on each node.

See details at [Table colocation](../../postgresql/hyperscale/concepts-colocation.md).


## Next steps
- [Read about creating Azure Arc-enabled PostgreSQL server](create-postgresql-hyperscale-server-group.md)
- [Read about scaling out Azure Arc-enabled PostgreSQL servers created in your Arc Data Controller](scale-out-in-postgresql-hyperscale-server-group.md)
- [Read about Azure Arc-enabled Data Services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
- [Read about Azure Arc](https://aka.ms/azurearc)
