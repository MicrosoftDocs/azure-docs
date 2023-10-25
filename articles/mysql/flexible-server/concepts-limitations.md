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

This article describes limitations in the Azure Database for MySQL - Flexible Server service. [General limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.7/en/limits.html) in the MySQL database engine are also applicable. If you'd like to learn about resource limitations (compute, memory, storage), see the [compute and storage](concepts-service-tiers-storage.md) article.

## Server parameters

> [!NOTE]  
> * If you are looking for min/max values for server parameters like `max_connections` and `innodb_buffer_pool_size`, this information has moved to the server parameters concepts [server parameters](./concepts-server-parameters.md) article.
> * lower_case_table_names value can only be set to 1 in Azure Database for MySQL - Flexible Server

Azure Database for MySQL supports tuning the values of server parameters. Some parameters' min and max values (ex. `max_connections`, `join_buffer_size`, `query_cache_size`) are determined by the compute tier and before you compute the size of the server. Refer to [server parameters](./concepts-server-parameters.md) for more information about these limits.

### Generated Invisible Primary Keys
For MySQL version 8.0 and above, [Generated Invisible Primary Keys](https://dev.mysql.com/doc/refman/8.0/en/create-table-gipks.html)(GIPK) is enabled by default for all the Azure Database for MySQL Flexible Servers. MySQL 8.0+ servers adds the invisible column *my_row_id* to the tables and a primary key on that column, where the InnoDB table is created without an explicit primary key. For this reason, you can't create a table having a column named *my_row_id* unless the table creation statement also specifies an explicit primary key,[Learn more](https://dev.mysql.com/doc/refman/8.0/en/create-table-gipks.html).
By default, GIPKs are shown in the output of [SHOW CREATE TABLE](https://dev.mysql.com/doc/refman/8.0/en/show-create-table.html), [SHOW COLUMNS](https://dev.mysql.com/doc/refman/8.0/en/show-columns.html), and [SHOW INDEX](https://dev.mysql.com/doc/refman/8.0/en/show-index.html), and are visible in the Information Schema [COLUMNS](https://dev.mysql.com/doc/refman/8.0/en/information-schema-columns-table.html) and [STATISTICS](https://dev.mysql.com/doc/refman/8.0/en/information-schema-statistics-table.html) tables.
For more details on GIPK and its use cases with [Data-in-Replication](./concepts-data-in-replication.md) in Azure Database for MySQL Flexible Server, refer [GIPK with Data-in-Replication](./concepts-data-in-replication.md#generated-invisible-primary-key). 

#### Steps to disable GIPK

- You can update the value of server parameter [sql_generate_invisible_primary_key](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_generate_invisible_primary_key) to 'OFF' by following steps mentioned on how to update any server parameter from [Azure portal](./how-to-configure-server-parameters-portal.md#configure-server-parameters) or by using [Azure CLI](./how-to-configure-server-parameters-cli.md#modify-a-server-parameter-value). 

- Or you can connect to your Azure Database for MySQL Flexible Servers and run the below command.

```sql
mysql> SET sql_generate_invisible_primary_key=OFF;
```

### lower_case_table_names

For MySQL version 5.7, default value is 1 in Azure Database for MySQL - Flexible Server. It is important to note that while it is possible to change the supported value to 2, reverting from 2 back to 1 is not permitted is not allowed.  Please contact our [support team](https://azure.microsoft.com/support/create-ticket/) for assistance in changing the default value. 
For [MySQl version 8.0+](https://dev.mysql.com/doc/refman/8.0/en/identifier-case-sensitivity.html) lower_case_table_names can only be configured when initializing the server. [Learn more](https://dev.mysql.com/doc/refman/8.0/en/identifier-case-sensitivity.html). Changing the lower_case_table_names setting after the server is initialized is prohibited. For MySQL version 8.0, default value is 1 in Azure Database for MySQL - Flexible Server. Supported value for MySQL version 8.0 are 1 and 2 Azure Database for MySQL - Flexible Server. Please contact our [support team](https://azure.microsoft.com/support/create-ticket/) for assistance in changing the default value during server creation.

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
- Below [static privileges](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#privileges-provided-static) are restricted.
    - [SUPER privilege](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super)
    - [FILE privilege](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_file)
    - [CREATE TABLESPACE](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-tablespace)
    - [SHUTDOWN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_shutdown)
- [BACKUP_ADMIN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_backup-admin) privilege: Granting BACKUP_ADMIN privilege isn't supported for taking backups using any [utility tools](../migrate/how-to-decide-on-right-migration-tools.md). Refer [Supported](././concepts-limitations.md#supported-1) section for list of supported [dynamic privileges](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#privileges-provided-dynamic).
- DEFINER: Requires super privileges to create and is restricted. If importing data using a backup, manually remove the `CREATE DEFINER` commands or use the `--skip-definer` command when performing a [mysqlpump](https://dev.mysql.com/doc/refman/5.7/en/mysqlpump.html).
- System databases: The [mysql system database](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) is read-only and used to support various PaaS functionalities. You can't make changes to the `mysql` system database.
- `SELECT ... INTO OUTFILE`: Not supported in the service.

### Supported

- `LOAD DATA INFILE` is supported, but the `[LOCAL]` parameter must be specified and directed to a UNC path (Azure storage mounted through SMB). Additionally, if you're using MySQL client version >= 8.0, you need to include `-–local-infile=1` parameter in your connection string.
- For version MySQL 8.0  and above, below mentioned [dynamic privileges](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#privileges-provided-dynamic) are only supported.
    - [REPLICATION_APPLIER](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_replication-applier)
    - [ROLE_ADMIN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_role-admin)
    - [SESSION_VARIABLES_ADMIN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_session-variables-admin)
    - [SHOW ROUTINE](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_show-routine) 
    - [XA_RECOVER_ADMIN](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_xa-recover-admin)

## Functional limitations

### Zone redundant HA

- This configuration can only be set during server create.
- Not supported in the Burstable compute tier.

### Network

- Connectivity method can't be changed after creating the server. If the server is created with *Private access (virtual network Integration)*, it can't be changed to *Public access (allowed IP addresses)* after creation, and vice versa

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


