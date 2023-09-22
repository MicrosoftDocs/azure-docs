---
title: Data-in replication - Azure Database for MariaDB
description: Learn about using data-in replication to synchronize from an external server into the Azure Database for MariaDB service.
ms.service: mariadb
author: VandhanaMehta
ms.author: vamehta
ms.topic: conceptual
ms.date: 06/24/2022
---

# Replicate data into Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Data-in Replication allows you to synchronize data from a MariaDB server running on-premises, in virtual machines, or database services hosted by other cloud providers into the Azure Database for MariaDB service. Data-in Replication is based on the binary log (binlog) file position-based replication native to MariaDB. To learn more about binlog replication, see the [binlog replication overview](https://mariadb.com/kb/en/library/replication-overview/).

## When to use Data-in Replication

The main scenarios to consider using Data-in Replication are:

- **Hybrid Data Synchronization:** With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MariaDB. This synchronization is useful for creating hybrid applications. This method is appealing when you have an existing local database server, but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in Replication to synchronize data between Azure Database for MariaDB and different cloud providers, including virtual machines and database services hosted in those clouds.

## Limitations and considerations

### Data not replicated

The [*mysql system database*](https://mariadb.com/kb/en/library/the-mysql-database-tables/) on the source server is not replicated. Changes to accounts and permissions on the source server are not replicated. If you create an account on the source server and this account needs to access the replica server, then manually create the same account on the replica server side. To understand what tables are contained in the system database, see the [MariaDB documentation](https://mariadb.com/kb/en/library/the-mysql-database-tables/).

### Requirements

- The source server version must be at least MariaDB version 10.2.
- The source and replica server versions must be the same. For example, both must be MariaDB version 10.2.
- Each table must have a primary key.
- Source server should use the InnoDB engine.
- User must have permissions to configure binary logging and create new users on the source server.
- If the source server has SSL enabled, ensure the SSL CA certificate provided for the domain has been included in the `mariadb.az_replication_change_master` stored procedure. Refer to the following [examples](howto-data-in-replication.md#link-the-source-and-replica-servers-to-start-data-in-replication) and the `master_ssl_ca` parameter.
- Ensure the source server's IP address has been added to the Azure Database for MariaDB replica server's firewall rules. Update firewall rules using the [Azure portal](howto-manage-firewall-portal.md) or [Azure CLI](howto-manage-firewall-cli.md).
- Ensure the machine hosting the source server allows both inbound and outbound traffic on port 3306.
- Ensure the the source server has a **public IP address**, the DNS is publicly accessible, or has a fully qualified domain name (FQDN).

### Other

- Data-in replication is only supported in General Purpose and Memory Optimized pricing tiers.

## Next steps

- Learn how to [set up data-in replication](howto-data-in-replication.md).
