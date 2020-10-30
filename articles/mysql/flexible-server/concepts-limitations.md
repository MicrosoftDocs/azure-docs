---
title: Limitations - Azure Database for MySQL - Flexible Server
description: This article describes Limitations in Azure Database for MySQL - Flexible Server, such as number of connection and storage engine options.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 10/1/2020
---

# Limitations in Azure Database for MySQL - Flexible Server (Preview)

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article describes limitations in the Azure Database for MySQL Flexible Server service. [General limitations](https://dev.mysql.com/doc/mysql-reslimits-excerpt/5.7/en/limits.html) in the MySQL database engine are also applicable. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute and storage](concepts-compute-storage.md) article.

## Server parameters

> [!NOTE]
> If you are looking for min/max values for server parameters like `max_connections` and `innodb_buffer_pool_size`, this information has moved to the server parameters concepts <!-- **[server parameters](./concepts-server-parameters.md)** --> article.

Azure Database for MySQL supports tuning the values of server parameters. The min and max value of some parameters (ex. `max_connections`, `join_buffer_size`, `query_cache_size`) is determined by the compute tier and compute size of the server. Refer to server parameters concepts <!-- [server parameters](./concepts-server-parameters.md)--> for more information about these limits.

Password plugins such as "validate_password" and "caching_sha2_password" are not supported by the service.

## Storage engines

MySQL supports many storage engines. On Azure Database for MySQL Flexible Server, the following storage engines are supported and unsupported:

### Supported
- [InnoDB](https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html)
- [MEMORY](https://dev.mysql.com/doc/refman/5.7/en/memory-storage-engine.html)

### Unsupported
- [MyISAM](https://dev.mysql.com/doc/refman/5.7/en/myisam-storage-engine.html)
- [BLACKHOLE](https://dev.mysql.com/doc/refman/5.7/en/blackhole-storage-engine.html)
- [ARCHIVE](https://dev.mysql.com/doc/refman/5.7/en/archive-storage-engine.html)
- [FEDERATED](https://dev.mysql.com/doc/refman/5.7/en/federated-storage-engine.html)

## Privileges & data manipulation support

Many server parameters and settings can inadvertently degrade server performance or negate ACID properties of the MySQL server. To maintain the service integrity and SLA at a product level, this service does not expose multiple roles. 

The MySQL service does not allow direct access to the underlying file system. Some data manipulation commands are not supported. 

### Unsupported

The following are unsupported:
- DBA role: Restricted. Alternatively, you can use the administrator user (created during new server creation), allows you to perform most of DDL and DML statements. 
- SUPER privilege: Similarly, [SUPER privilege](https://dev.mysql.com/doc/refman/5.7/en/privileges-provided.html#priv_super) is restricted.
- DEFINER: Requires super privileges to create and is restricted. If importing data using a backup, remove the `CREATE DEFINER` commands manually or by using the `--skip-definer` command when performing a mysqldump.
- System databases: The [mysql system database](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) is read-only and used to support various PaaS functionality. You cannot make changes to the `mysql` system database.
- `SELECT ... INTO OUTFILE`: Not supported in the service.

### Supported
- `LOAD DATA INFILE` is supported, but the `[LOCAL]` parameter must be specified and directed to a UNC path (Azure storage mounted through SMB).

## Functional limitations

### Zone redundant HA
- This configuration can only be set during server create.
- Not supported in Burstable compute tier.

### Networking
- Connectivity method cannot be changed after creating the server. If the server is created with *Private access (VNet Integration)*, it cannot be changed to *Public access (allowed IP addresses)* after create, and vice versa
- TLS/SSL is enabled by default and cannot be disabled.
- Minimum TLS version supported on the server is TLS1.2. Refer to [connect using TLS/SSL](./how-to-connect-tls-ssl.md) to learn more.

### Stop/start operation
- Not supported with zone redundant HA configurations (both primary and standby).
- Not supported with read replica configurations (both source and replicas).

### Scale operations
- Decreasing server storage provisioned is not supported.

### Read replicas
- Not supported with zone redundant HA configurations (both primary and standby).

### Server version upgrades
- Automated migration between major database engine versions is not supported. If you would like to upgrade the major version, take a [dump and restore](../concepts-migrate-dump-restore.md) it to a server that was created with the new engine version.

### Restoring a server
- With point-in-time restore, new servers are created with the same compute and storage configurations as the source server it is based on. The newly restored server's compute can be scaled down after the server is created.
- Restoring a deleted server isn't supported.

## Next steps

- Understand [what’s available for compute and storage options](concepts-compute-storage.md)
- Learn about [Supported MySQL Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server using the Azure portal](how-to-restore-server-portal.md)