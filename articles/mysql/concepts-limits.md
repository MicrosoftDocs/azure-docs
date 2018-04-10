---
title: Limitations in Azure Database for MySQL
description: This article describes limitations in Azure Database for MySQL, such as number of connection and storage engine options.
services: mysql
author: kamathsun
ms.author: sukamat
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 03/20/2018
---
# Limitations in Azure Database for MySQL
The following sections describe capacity, storage engine support, privilege support, data manipulation statement support, and functional limits in the database service. Also see [general limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.6/en/limits.html) applicable to the MySQL database engine.

## Service tier maximums
Azure Database for MySQL has multiple service tiers to choose from when creating a server. For more information, see [Azure Database for MySQL pricing tiers](concepts-pricing-tiers.md).  

There is a maximum number of connections, Compute Units, and storage in each service tier, as follows: 

|**Pricing Tier**| **Compute Generation**|**vCore(s)**| **Max Connections**|
|---|---|---|---|
|Basic| Gen 4| 1| 50|
|Basic| Gen 4| 2| 100|
|Basic| Gen 5| 1| 50|
|Basic| Gen 5| 2| 100|
|General Purpose| Gen 4| 2| 300|
|General Purpose| Gen 4| 4| 625|
|General Purpose| Gen 4| 8| 1250|
|General Purpose| Gen 4| 16| 2500|
|General Purpose| Gen 4| 32| 5000|
|General Purpose| Gen 5| 2| 300|
|General Purpose| Gen 5| 4| 625|
|General Purpose| Gen 5| 8| 1250|
|General Purpose| Gen 5| 16| 2500|
|General Purpose| Gen 5| 32| 5000|
|Memory Optimized| Gen 5| 2| 600|
|Memory Optimized| Gen 5| 4| 1250|
|Memory Optimized| Gen 5| 8| 2500|
|Memory Optimized| Gen 5| 16| 5000|

When too many connections are reached, you may receive the following error:
> ERROR 1040 (08004): Too many connections

## Storage engine support

### Supported
- [InnoDB](https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html)
- [MEMORY](https://dev.mysql.com/doc/refman/5.7/en/memory-storage-engine.html)

### Unsupported
- [MyISAM](https://dev.mysql.com/doc/refman/5.7/en/myisam-storage-engine.html)
- [BLACKHOLE](https://dev.mysql.com/doc/refman/5.7/en/blackhole-storage-engine.html)
- [ARCHIVE](https://dev.mysql.com/doc/refman/5.7/en/archive-storage-engine.html)
- [FEDERATED](https://dev.mysql.com/doc/refman/5.7/en/federated-storage-engine.html)

## Privilege support

### Unsupported
- DBA role: 
Many server parameters and settings can inadvertently degrade server performance or negate ACID properties of the DBMS. As such, to maintain the service integrity and SLA at a product level, this service does not expose the DBA role. The default user account, which is constructed when a new database instance is created, allows that user to perform most of DDL and DML statements in the managed database instance. 
- SUPER privilege: 
Similarly [SUPER privilege](https://dev.mysql.com/doc/refman/5.7/en/privileges-provided.html#priv_super) is also restricted.

## Data manipulation statement support

### Supported
- LOAD DATA INFILE - Supported, but it must specify the [LOCAL] parameter that is directed to a UNC path (Azure storage mounted through XSMB).

### Unsupported
- SELECT ... INTO OUTFILE

## Functional limitations

### Scale operations
- Dynamic scaling of servers across pricing tiers is currently not supported. That is, switching between Basic, General Purpose, and Memory Optimized pricing tiers.
- Decreasing server storage size is not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported.

### Point-in-time-restore
- Restoring to different service tier and/or Compute Units and Storage size is not allowed.
- Restoring a deleted server is not supported.

## Functional limitations

### Subscription management
- Dynamically moving pre-created servers across subscription and resource group is currently not supported.

## Current known issues
- MySQL server instance displays the wrong server version after connection is established. To get the correct server instance versioning, use select version(); command at the MySQL prompt.

## Next steps
- [What’s available in each service tier](concepts-pricing-tiers.md)
- [Supported MySQL database versions](concepts-supported-versions.md)
