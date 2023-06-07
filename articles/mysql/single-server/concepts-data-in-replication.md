---
title: Data-in Replication - Azure Database for MySQL
description: Learn about using Data-in Replication to synchronize from an external server into the Azure Database for MySQL service.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: savjani
ms.author: pariks
ms.date: 06/20/2022
---

# Replicate data into Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Data-in Replication allows you to synchronize data from an external MySQL server into the Azure Database for MySQL service. The external server can be on-premises, in virtual machines, or a database service hosted by other cloud providers. Data-in Replication is based on the binary log (binlog) file position-based or GTID-based replication native to MySQL. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

## When to use Data-in Replication

The main scenarios to consider about using Data-in Replication are:

- **Hybrid Data Synchronization:** With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL. This synchronization is useful for creating hybrid applications. This method is appealing when you have an existing local database server but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in Replication to synchronize data between Azure Database for MySQL and different cloud providers, including virtual machines and database services hosted in those clouds.

For migration scenarios, use the [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/)(DMS).

## Limitations and considerations

### Data not replicated

The [*mysql system database*](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html) on the source server isn't replicated. In addition, changes to accounts and permissions on the source server aren't replicated. If you create an account on the source server and this account needs to access the replica server, manually create the same account on the replica server. To understand what tables are contained in the system database, see the [MySQL manual](https://dev.mysql.com/doc/refman/5.7/en/system-schema.html).

### Filtering

To skip replicating tables from your source server (hosted on-premises, in virtual machines, or a database service hosted by other cloud providers), the `replicate_wild_ignore_table` parameter is supported. Optionally, update this parameter on the replica server hosted in Azure using the [Azure portal](how-to-server-parameters.md) or [Azure CLI](how-to-configure-server-parameters-using-cli.md).

To learn more about this parameter, review the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#option_mysqld_replicate-wild-ignore-table).

## Supported in General Purpose or Memory Optimized tier only

Data-in Replication is only supported in General Purpose and Memory Optimized pricing tiers.

## Private Link support

The private link for Azure database for MySQL support only inbound connections. As data-in replication requires outbound connection from service private link is not supported for the data-in traffic.

>[!NOTE]
>GTID is supported on versions 5.7 and 8.0 and only on servers that support storage up to 16 TB (General purpose storage v2).

### Requirements

- The source server version must be at least MySQL version 5.6.
- The source and replica server versions must be the same. For example, both must be MySQL version 5.6 or both must be MySQL version 5.7.
- Each table must have a primary key.
- The source server should use the MySQL InnoDB engine.
- User must have permissions to configure binary logging and create new users on the source server.
- If the source server has SSL enabled, ensure the SSL CA certificate provided for the domain has been included in the `mysql.az_replication_change_master` or `mysql.az_replication_change_master_with_gtid` stored procedure. Refer to the following [examples](./how-to-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication) and the `master_ssl_ca` parameter.
- Ensure that the source server's IP address has been added to the Azure Database for MySQL replica server's firewall rules. Update firewall rules using the [Azure portal](./how-to-manage-firewall-using-portal.md) or [Azure CLI](./how-to-manage-firewall-using-cli.md).
- Ensure that the machine hosting the source server allows both inbound and outbound traffic on port 3306.
- Ensure that the source server has a **public IP address**, that DNS is publicly accessible, or that the source server has a fully qualified domain name (FQDN).

## Next steps

- Learn how to [set up data-in replication](how-to-data-in-replication.md)
- Learn about [replicating in Azure with read replicas](concepts-read-replicas.md)
- Learn about how to [migrate data with minimal downtime using DMS](how-to-migrate-online.md)
