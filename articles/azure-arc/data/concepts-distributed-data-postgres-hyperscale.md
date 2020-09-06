--- 
title: Concepts for distributing data with Arc enabled PostgreSQL Hyperscale server group
description: Concepts for distributing data with Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

 
# Concepts for distributing data with Arc enabled PostgreSQL Hyperscale server group

This article explains key concepts that are important to benefit the most from Azure Arc enabled Postgres Hyperscale.
The articles linked below point to the concepts explained for Azure Database for Postgres Hyperscale (Citus). It is the same technology as Azure Arc enabled Postgres Hyperscale so the same concepts and perspectives apply.
**What is the difference between the two"?**
- Azure SQL Database for Postgres Hyperscale (Citus)
This is the hyperscale form factor of the Postgres database engine available as database as a service in Azure (PaaS). It is powered by the the Citus extension that enables the Hyperscale experience.
In this form factor the service runs in the Microsoft datacenters and is operated by Microsoft.
- Azure Arc enabled Postgres Hyperscale
This is the hyperscale form factor of the Postgres database engine offered avilable with Azure Arc enabled Data Service. In this form factor, our customers provide the infrastructure that host the systems and operate them.

The key concepts around Azure Arc enabled Postgres Hyperscale are:
### [Nodes and tables](https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-nodes)
In this article you'll read about:
- specialized Postgres nodes in Azure Arc enabled Postgres Hyperscale: coordinator and workers
- types of tables: distributed tables, reference tables and local tables
- shards 

### [Determining an application type](https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-app-type)
In this article how to clearly identify the type of application you are building. Why is it important?
Running efficient queries on a Azure Arc enabled Postgres Hyperscale server group requires that tables be properly distributed across servers. 
The recommended distribution varies by the type of application and its query patterns.
There are broadly two kinds of applications that work well on Azure Arc enabled Postgres Hyperscale. 
The first step in data modeling is to identify which of them more closely resembles your application. Read on [here]().

### [Choosing a distribution column](https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-choose-distribution-column)
In this article you'll read about choosing each table's distribution column. Why?
This is one of the most important modeling decisions you'll make. Azure Arc enabled PostgreSQL Hyperscale stores rows in shards based on the value of the rows' distribution column.
The correct choice groups related data together on the same physical nodes, which makes queries fast and adds support for all SQL features. 
An incorrect choice makes the system run slowly and won't support all SQL features across nodes.
This article gives distribution column tips for the two most common hyperscale scenarios.

### Table colocation


## Next steps:
- [Read about deploying Azure Arc enabled Postgres Hyperscale](create-postgresql-hyperscale-server-group.md)
- [Read about scaling out Azure Arc enabled Postgres Hyperscale server groups deployed in your Arc Data Controller](scale-out-postgresql-hyperscale-server-group.md)
- [Read about Azure Arc enabled Data Services]()
- [Read about Azure Arc]()
