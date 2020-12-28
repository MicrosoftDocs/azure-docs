---
title: Understand and resolve Azure SQL blocking problems
titleSuffix: Azure SQL Database 
description: "An overview of Azure SQL database specific topics on blocking and troubleshooting."
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
ms.date: 12/28/2020
---
# Understand and resolve Azure SQL Database blocking problems
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

##Objective

The intention of this article is to provide instruction on first understanding what blocking is in Azure SQL databases and furthermore how to investigate its occurrence. 

In this article, the term connection refers to a single logged-on session of the database. Each connection appears as a Session ID (SPID). Each of these SPIDs is often referred to as a process, although it is not a separate process context in the usual sense. Rather, each SPID consists of the server resources and data structures necessary to service the requests of a single connection from a given client. A single client application may have one or more connections. From the perspective of SQL Server, there is no difference between multiple connections from a single client application on a single client computer and multiple connections from multiple client applications or multiple client computers; they are atomic. One connection can block another connection, regardless of the source client.

> [!NOTE]
> This content is specific to Azure SQL Database. For SQL Server, [see here](https://docs.microsoft.com/en-us/troubleshoot/sql/performance/understand-resolve-blocking).

## What is blocking
 
Blocking is an unavoidable and by-design characteristic of any relational database management system (RDBMS) with lock-based concurrency. As mentioned previously, in SQL Server, blocking occurs when one session holds a lock on a specific resource and a second SPID attempts to acquire a conflicting lock type on the same resource. Typically, the time frame for which the first SPID locks the resource is small. When the owning session releases the lock, the second connection is then free to acquire its own lock on the resource and continue processing. This is normal behavior and may happen many times throughout the course of a day with no noticeable effect on system performance.

The duration and transaction context of a query determine how long its locks are held and, thereby, their impact on other queries. If the query is not executed within a transaction (and no lock hints are used), the locks for SELECT statements will only be held on a resource at the time it is actually being read, not for the duration of the query. For INSERT, UPDATE, and DELETE statements, the locks are held for the duration of the query, both for data consistency and to allow the query to be rolled back if necessary.

For queries executed within a transaction, the duration for which the locks are held are determined by the type of query, the transaction isolation level, and whether lock hints are used in the query. For a description of locking, lock hints, and transaction isolation levels, see the following topics in SQL Server Books Online:

Locking in the Database Engine
Customizing Locking and Row Versioning
Lock Modes
Lock Compatibility
Row Versioning-based Isolation Levels in the Database Engine
Controlling Transactions (Database Engine)

When locking and blocking persists to the point where there is a detrimental effect on system performance, it is due to one of the following reasons:

A SPID holds locks on a set of resources for an extended period of time before releasing them. This type of blocking resolves itself over time but can cause performance degradation.

A SPID holds locks on a set of resources and never releases them. This type of blocking does not resolve itself and prevents access to the affected resources indefinitely.

In the first scenario above, the situation can be very fluid as different SPIDs cause blocking on different resources over time, creating a moving target. For this reason, these situations can be difficult to troubleshoot using SQL Server Management Studio (the go to tool for managing SQL server) and to narrow down the issue to individual queries. In contrast, the second situation results in a consistent state that can be easier to diagnose.

## See Also

- SQL Server running on an Azure virtual machine also can use an asymmetric key from Key Vault. The configuration steps are different from using an asymmetric key in SQL Database and SQL Managed Instance. For more information, see [Extensible key management by using Azure Key Vault (SQL Server)](/sql/relational-databases/security/encryption/extensible-key-management-using-azure-key-vault-sql-server).
- For a general description of TDE, see [Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption).
- To learn more about TDE with BYOK support for Azure SQL Database, Azure SQL Managed Instance and Azure Synapse, see [Transparent data encryption with Bring Your Own Key support](transparent-data-encryption-byok-overview.md).
- To start using TDE with Bring Your Own Key support, see the how-to guide, [Turn on transparent data encryption by using your own key from Key Vault](transparent-data-encryption-byok-configure.md).
- For more information about Key Vault, see [Secure access to a key vault](../../key-vault/general/secure-your-key-vault.md).