---
title: Auto-failover group overview
description: De-duplicating content between SQL Database and SQL Managed Instance, in this case using an include for an overview of the auto-failover group feature. 
ms.topic: include
author: MashaMSFT
ms.author: mathoma
ms.reviewer: kendralittle, emlisa, mlandzic
ms.date: 03/01/2022
---

The auto-failover groups feature allows you to manage the replication and failover of a group of databases on a server or all user databases in a managed instance to another Azure region. It is a declarative abstraction on top of the [active geo-replication](../database/active-geo-replication-overview.md) feature, designed to simplify deployment and management of geo-replicated databases at scale. 

**Automatic failover**

You can initiate a geo-failover manually or you can delegate it to the Azure service based on a user-defined policy. The latter option allows you to automatically recover multiple related databases in a secondary region after a catastrophic failure or other unplanned event that results in full or partial loss of the SQL Database or SQL Managed Instance availability in the primary region. Typically, these are outages that cannot be automatically mitigated by the built-in high availability infrastructure. Examples of geo-failover triggers include natural disasters, or incidents caused by a tenant or control ring being down due to an OS kernel memory leak on compute nodes. For more information, see [Azure SQL high availability](../database/high-availability-sla.md).

**Offload read-only workloads**

To reduce traffic to your primary databases, you can also use the secondary databases in a failover group to offload read-only workloads. Use the read-only listener to direct read-only traffic to a readable secondary database. 

**Endpoint redirection** 

Auto-failover groups provide read-write and read-only listener end-points that remain unchanged during geo-failovers. This means you do not have to change the connection string for your application after a geo-failover, because connections are automatically routed to the current primary. Whether you use manual or automatic failover activation, a geo-failover switches all secondary databases in the group to the primary role. After the geo-failover is completed, the DNS record is automatically updated to redirect the endpoints to the new region. For geo-failover RPO and RTO, see [Overview of Business Continuity](../database/business-continuity-high-availability-disaster-recover-hadr-overview.md).

**Recovering an application**

To achieve full business continuity, adding regional database redundancy is only part of the solution. Recovering an application (service) end-to-end after a catastrophic failure requires recovery of all components that constitute the service and any dependent services. Examples of these components include the client software (for example, a browser with a custom JavaScript), web front ends, storage, and DNS. It is critical that all components are resilient to the same failures and become available within the recovery time objective (RTO) of your application. Therefore, you need to identify all dependent services and understand the guarantees and capabilities they provide. Then, you must take adequate steps to ensure that your service functions during the failover of the services on which it depends. 