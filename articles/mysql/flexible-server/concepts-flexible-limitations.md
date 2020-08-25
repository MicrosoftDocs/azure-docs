---
title: Limits - Azure Database for MySQL - Flexible Server
description: This article describes limits in Azure Database for MySQL - Flexible Server, such as number of connection and storage engine options.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 8/24/2020
---

# Limits in Azure Database for MySQL - Flexible Server

> [!IMPORTANT] 
> Azure Database for MySQL Flexible Server is currently in public preview

This article describes capacity, storage engine support, privilege support, data manipulation statement support, and functional limits in Azure Database for MySQL Flexible Servers. [General limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.7/en/limits.html) in the MySQL database engine are also applicable. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute and storage](concepts-flexible-compute-storage.md) article.

## Server parameters

> [!NOTE]
> If you are looking for min/max values for server parameters like `max_connections` and `innodb_buffer_pool_size`, this information has moved to the server parameters concepts <!-- **[server parameters](./concepts-server-parameters.md)** --> article.

Azure Database for MySQL supports tuning the values of server parameters. The min and max value of some parameters (ex. `max_connections`, `join_buffer_size`, `query_cache_size`) is determined by the pricing tier and vCores of the server. Refer to server parameters concepts <!-- [server parameters](./concepts-server-parameters.md)--> for more information about these limits.

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
- System databases:
In Azure Database for MySQL, the [mysql system database](https://dev.mysql.com/doc/refman/8.0/en/system-schema.html) is read-only as it is used to support various PaaS service functionality. Please note that you cannot change anything in the `mysql` system database.

## Data manipulation statement support

### Supported
- `LOAD DATA INFILE` is supported, but the `[LOCAL]` parameter must be specified and directed to a UNC path (Azure storage mounted through SMB).

### Unsupported
- `SELECT ... INTO OUTFILE`

## Functional limitations

### Stop/start operation

- Stop/start for servers with Zone-Redundant HA is currently not supported

### Scale operations

- Decreasing server storage size is currently not supported.

### Server version upgrades

- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a dump and restore <!--  [dump and restore](./howto-migrate-using-dump-and-restore.md)--> it to a server that was created with the new engine version.

### Restoring a server

- When using the Point-in-time-Restore feature, the new server is created with the same compute and storage configurations as the server it is based on.
- Restoring a deleted server is not supported.

## Next steps

- Understand [what’s available for compute and storage options](concepts-flexible-compute-storage.md)
<!-- - Learn about [Supported MySQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for MySQL using the Azure portal](howto-restore-server-portal.md)-->