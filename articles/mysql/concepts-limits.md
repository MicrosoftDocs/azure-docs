---
title: Limitations in Azure Database for MySQL
description: This article describes limitations in Azure Database for MySQL, such as number of connection and storage engine options.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 12/6/2018
---
# Limitations in Azure Database for MySQL
The following sections describe capacity, storage engine support, privilege support, data manipulation statement support, and functional limits in the database service. Also see [general limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.6/en/limits.html) applicable to the MySQL database engine.

## Maximum connections
The maximum number of connections per pricing tier and vCores are as follows: 

|**Pricing Tier**|**vCore(s)**| **Max Connections**|
|---|---|---|
|Basic| 1| 50|
|Basic| 2| 100|
|General Purpose| 2| 300|
|General Purpose| 4| 625|
|General Purpose| 8| 1250|
|General Purpose| 16| 2500|
|General Purpose| 32| 5000|
|General Purpose| 64| 10000|
|Memory Optimized| 2| 600|
|Memory Optimized| 4| 1250|
|Memory Optimized| 8| 2500|
|Memory Optimized| 16| 5000|
|Memory Optimized| 32| 10000|

When connections exceed the limit, you may receive the following error:
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
- DEFINER: 
Requires super privileges to create and is restricted. If importing data using a backup, remove the `CREATE DEFINER` commands manually or by using the `--skip-definer` command when performing a mysqldump.

## Data manipulation statement support

### Supported
- `LOAD DATA INFILE` is supported, but the `[LOCAL]` parameter must be specified and directed to a UNC path (Azure storage mounted through SMB).

### Unsupported
- `SELECT ... INTO OUTFILE`

## Functional limitations

### Scale operations
- Dynamic scaling to and from the Basic pricing tiers is currently not supported.
- Decreasing server storage size is not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](./concepts-migrate-dump-restore.md) it to a server that was created with the new engine version.

### Point-in-time-restore
- When using the PITR feature, the new server is created with the same configurations as the server it is based on.
- Restoring a deleted server is not supported.

### VNet service endpoints
- Support for VNet service endpoints is only for General Purpose and Memory Optimized servers.

### Storage size
- Please refer to [pricing tiers](concepts-pricing-tiers.md) for the storage size limits per pricing tier.

## Current known issues
- MySQL server instance displays the wrong server version after connection is established. To get the correct server instance engine version, use the `select version();` command.

## Next steps
- [What’s available in each service tier](concepts-pricing-tiers.md)
- [Supported MySQL database versions](concepts-supported-versions.md)
