---
title: Limitations - Azure Database for MySQL - Flexible Server
description: This article describes Limitations in Azure Database for MySQL - Flexible Server, such as number of connection and storage engine options.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 03/29/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Limitations in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes limitations in the Azure Database for MySQL - Flexible Server service. [General limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.7/en/limits.html) in the MySQL database engine are also applicable. If you'd like to learn about resource limitations (compute, memory, storage), see the [compute and storage](concepts-service-tiers-storage.md article.

## Server parameters

> [!NOTE]  
> * If you are looking for min/max values for server parameters like `max_connections` and `innodb_buffer_pool_size`, this information has moved to the server parameters concepts [server parameters](./concepts-server-parameters.md) article.
> * lower_case_table_names value can only be set to 1 in Azure Database for MySQL - Flexible Server

Azure Database for MySQL supports tuning the values of server parameters. Some parameters' min and max values (ex. `max_connections`, `join_buffer_size`, `query_cache_size`) are determined by the compute tier and before you compute the size of the server. Refer to [server parameters](./concepts-server-parameters.md) for more information about these limits.

## Storage engines

MySQL supports many storage engines. On Azure Database for MySQL - Flexible Server, the following is the list of supported and unsupported storage engines:

### Supported

- [InnoDB](https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html)
- [MEMORY](https://dev.mysql.com/doc/refman/5.7/en/memory-storage-engine.html)

### Unsupported

- [MyISAM](https://dev.mysql.com/doc/refman/5.7/en/myisam-storage-engine.html)
- [BLACKHOLE](https://dev.mysql.com/doc/refman/5.7/en/blackhole-storage-engine.html)
- [ARCHIVE](https://dev.mysql.com/doc/refman/5.7/en/archive-storage-engine.html)
- [FEDERATED](https://dev.mysql.com/doc/refman/5.7/en/federated-storage-engine.html)

## Privileges & data manipulation support

Many server parameters and settings can inadvertently degrade server performance or negate the ACID properties of the MySQL server. This service doesn't expose multiple roles to maintain the service integrity and SLA at a product level.

The MySQL service doesn't allow direct access to the underlying file system. Some data manipulation commands aren't supported.

### Unsupported

The following are unsupported:
- DBA role: Restricted. Alternatively, you can use the administrator user (created during the new server creation), which allows you to perform most of DDL and DML statements.
- SUPER privilege: Similarly, [SUPER privilege](https://dev.mysql.com/doc/refman/5.7/en/privileges-provided.html#priv_super) is restricted.
- DEFINER: Requires super privileges to create and is restricted. If importing data using a backup, manually remove the `CREATE DEFINER` commands or use the `--skip-definer` command when performing a mysqldump.
- System databases: The [mysql system database](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) is read-only and used to support various PaaS functionalities. You can't make changes to the `mysql` system database.
- `SELECT ... INTO OUTFILE`: Not supported in the service.
- [BACKUP_ADMIN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_backup-admin) privilege: Granting BACKUP_ADMIN privilege isn't supported for taking backups using any [utility tools](../migrate/how-to-decide-on-right-migration-tools.md).

### Supported

- `LOAD DATA INFILE` is supported, but the `[LOCAL]` parameter must be specified and directed to a UNC path (Azure storage mounted through SMB). Additionally, if you're using MySQL client version >= 8.0, you need to include `-–local-infile=1` parameter in your connection string.

## Functional limitations

### Zone redundant HA

- This configuration can only be set during server create.
- Not supported in the Burstable compute tier.

### Network

- Connectivity method can't be changed after creating the server. If the server is created with *Private access (VNet Integration)*, it can't be changed to *Public access (allowed IP addresses)* after creation, and vice versa

### Stop/start operation

- Not supported with read replica configurations (both source and replicas).

### Scale operations

- Decreasing server storage provisioned isn't supported.

### Server version upgrades

- Automated migration between major database engine versions isn't supported. If you want to upgrade the major version, take a [dump and restore](../concepts-migrate-dump-restore.md) to a server created with the new engine version.

### Restore a server

- With point-in-time restore, new servers are created with the same compute and storage configurations as the source server it's based on. The newly restored server's compute can be scaled down after the server is created.

## Feature comparisons

Not all features available in Azure Database for MySQL - Single Server are available in Flexible Server.

For the complete list of feature comparisons between a single server and a flexible server, refer to [choosing the right MySQL Server option in Azure documentation](../select-right-deployment-type.md#compare-the-mysql-deployment-options-in-azure).

## Next steps

- Learn [choose the right MySQL Server option in Azure documentation](../select-right-deployment-type.md)
- Understand [what's available for compute and storage options in flexible server](concepts-service-tiers-storage.md)
- Learn about [Supported MySQL Versions](concepts-supported-versions.md)
- Quickstart: [Use the Azure portal to create an Azure Database for MySQL - Flexible Server](quickstart-create-server-portal.md)
