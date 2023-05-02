---
title: Data-in replication - Azure Database for MySQL - Flexible Server
description: Learn about using Data-in replication to synchronize from an external server into the Azure Database for MySQL Flexible service.
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 05/02/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Replicate data into Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Data-in replication allows you to synchronize data from an external MySQL server into an Azure Database for MySQL flexible server. The external server can be on-premises, in virtual machines, Azure Database for MySQL single server, or a database service hosted by other cloud providers. Data-in replication is based on the binary log (binlog) file position or GTID-based replication. To learn more about binlog replication, see the [MySQL Replication](https://dev.mysql.com/doc/refman/5.7/en/replication-configuration.html).

> [!NOTE]  
> Configuring Data-in replication for zone-redundant high-availability servers is supported only through GTID-based replication

## When to use Data-in replication

The main scenarios to consider about using Data-in replication are:

- **Hybrid Data Synchronization:** With Data-in replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL - Flexible Server. This synchronization helps create hybrid applications. This method is appealing when you have an existing local database server but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in replication to synchronize data between Azure Database for MySQL - Flexible Server and different cloud providers, including virtual machines and database services hosted in those clouds.
- **Migration:** Customers can migrate in Minimal Time using open-source tools such as [MyDumper/MyLoader](https://centminmod.com/mydumper.html) with Data-in replication. A selective cutover of production load from source to destination database is possible with Data-in replication.

For migration scenarios, use the [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/)(DMS).

## Limitations and considerations

### Data not replicated

The [*mysql system database*](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) on the source server isn't replicated. In addition, changes to accounts and permissions on the source server aren't replicated. If you create an account on the source server and this account needs to access the replica server, manually create the same account on the replica server. To understand the tables in the system database, see the [MySQL manual](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html).

### Data-in replication is supported on High Availability (HA) enabled servers

Support for data-in replication for high availability (HA) enabled server is available only through GTID-based replication.

The stored procedure for replication using GTID is available on all HA-enabled servers by the name `mysql.az_replication_with_gtid`.

### Filter

The parameter `replicate_wild_ignore_table` creates a replication filter for tables on the replica server. To modify this parameter from the Azure portal, navigate to Azure Database for MySQL flexible server used as replica and select "Server Parameters" to view/edit the `replicate_wild_ignore_table` parameter.

### Requirements

- The source server version must be at least MySQL version 5.7.
- Our recommendation is to have the same version for source and replica server versions. For example, both must be MySQL version 5.7, or both must be MySQL version 8.0.
- Our recommendation is to have a primary key in each table. If we have a table without a primary key, you might face slowness in replication.
- The source server should use the MySQL InnoDB engine.
- The user must have the right permissions to configure binary logging and create new users on the source server.
- Binary log files on the source server shouldn't be purged before the replica applies those changes. If the source is Azure Database for MySQL, refer to how to configure binlog_expire_logs_seconds for [flexible server](./concepts-server-parameters.md#binlog_expire_logs_seconds) or [Single server](../concepts-server-parameters.md#binlog_expire_logs_seconds)
- If the source server has SSL enabled, ensure the SSL CA certificate provided for the domain has been included in the `mysql.az_replication_change_master` stored procedure. Refer to the following [examples](./how-to-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication) and the `master_ssl_ca` parameter.
- Ensure that the machine hosting the source server allows both inbound and outbound traffic on port 3306.
- Ensure that the source server has a **public IP address**, that DNS is publicly accessible, or that the source server has a fully qualified domain name (FQDN).
- With public access, ensure that the source server has a public IP address, that DNS is publicly accessible, or that the source server has a fully qualified domain name (FQDN).
- With private access, ensure that the source server name can be resolved and is accessible from the VNet where the Azure Database for MySQL instance is running. (For more details, visit [Name resolution for resources in Azure virtual networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)).

## Next steps

- Learn more on how to [set up data-in replication](how-to-data-in-replication.md)
- Learn more about [replicating in Azure with read replicas](concepts-read-replicas.md)
