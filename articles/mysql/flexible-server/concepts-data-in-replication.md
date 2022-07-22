---
title: Data-in replication - Azure Database for MySQL Flexible
description: Learn about using Data-in replication to synchronize from an external server into the Azure Database for MySQL Flexible service.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: VandhanaMehta
ms.author: vamehta
ms.date: 06/08/2021
---

# Replicate data into Azure Database for MySQL Flexible  Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Data-in replication allows you to synchronize data from an external MySQL server into the Azure Database for MySQL Flexible service. The external server can be on-premises, in virtual machines, Azure Database for MySQL Single Server, or a database service hosted by other cloud providers. Data-in replication is based on the binary log (binlog) file position-based. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

> [!Note]
> GTID-based replication is currently not supported for Azure Database for MySQL Flexible Servers.<br>
> Configuring Data-in replication for zone-redundant high availability servers is not supported.

## When to use Data-in replication

The main scenarios to consider about using Data-in replication are:

- **Hybrid Data Synchronization:** With Data-in replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL Flexible Server. This synchronization is useful for creating hybrid applications. This method is appealing when you have an existing local database server but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in replication to synchronize data between Azure Database for MySQL Flexible Server and different cloud providers, including virtual machines and database services hosted in those clouds.
- **Migration:** Customers can do Minimal Time migration using open-source tools such as [MyDumper/MyLoader](https://centminmod.com/mydumper.html) with Data-in replication. A selective cutover of production load from source to destination database is possible with Data-in replication.

For migration scenarios, use the [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/)(DMS).

## Limitations and considerations

### Data not replicated

The [*mysql system database*](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) on the source server isn't replicated. In addition, changes to accounts and permissions on the source server aren't replicated. If you create an account on the source server and this account needs to access the replica server, manually create the same account on the replica server. To understand what tables are contained in the system database, see the [MySQL manual](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html).

### Data-in replication not supported on HA enabled servers
It is not supported to configure Data-in replication for servers which have high availability (HA) option enabled. On HA enabled servers, the stored procedures for replication `mysql.az_replication_*` won't be available. 
> [!Tip]
>If you are using HA server as a source server, MySQL native binary log (binlog) file position-based replication would fail, when failover happens on the server. If replica server supports GTID based replication, we should configure GTID based replication.

### Filtering

Modifying the parameter `replicate_wild_ignore_table` used to create replication filter for tables, is currently not supported for Azure Database for MySQL -Flexible server.

### Requirements

- The source server version must be at least MySQL version 5.7.
- Our recommendation is to have the same version for source and replica server versions. For example, both must be MySQL version 5.7 or both must be MySQL version 8.0.
- Our recommendation is to have a primary key in each table. If we have table without primary key, you might face slowness in replication. 
- The source server should use the MySQL InnoDB engine.
- User must have permissions to configure binary logging and create new users on the source server.
- Binary log files on the source server shouldn't be purged before the replica applies those changes. If the source is Azure Database for MySQL refer how to configure binlog_expire_logs_seconds for [Flexible server](./concepts-server-parameters.md#binlog_expire_logs_seconds) or [Single server](../concepts-server-parameters.md#binlog_expire_logs_seconds)
- If the source server has SSL enabled, ensure the SSL CA certificate provided for the domain has been included in the `mysql.az_replication_change_master` stored procedure. Refer to the following [examples](./how-to-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication) and the `master_ssl_ca` parameter.
- Ensure that the machine hosting the source server allows both inbound and outbound traffic on port 3306.
- Ensure that the source server has a **public IP address**, that DNS is publicly accessible, or that the source server has a fully qualified domain name (FQDN).
- In case of public access, ensure that the source server has a public IP address, that DNS is publicly accessible, or that the source server has a fully qualified domain name (FQDN).
- In case of private access ensure that the source server name can be resolved and is accessible from the VNet where the Azure Database for MySQL instance is running.For more details see, [Name resolution for resources in Azure virtual networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)

## Next steps

- Learn how to [set up data-in replication](how-to-data-in-replication.md)
- Learn about [replicating in Azure with read replicas](concepts-read-replicas.md)
