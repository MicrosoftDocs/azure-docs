---
title: "Prerequisites using the migration service from AWS RDS PostgreSQL (online)"
description: Providing the online prerequisites for the migration service in Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/07/2024
ms.service: postgresql
ms.topic: include
---

Before starting the migration with the Azure Database for PostgreSQL migration service, it is important to fulfill the following prerequisites, specifically designed for online migration scenarios.

- [Verify the source version](#verify-the-source-version)
- [Install test_decoding - Source Setup](#install-test_decoding---source-setup)
- [Target setup](#target-setup)
- [Enable CDC as a source](#enable-cdc-as-a-source)
- [Network setup](#network-setup)
- [Extensions](#extensions)
- [Users and roles](#users-and-roles)
- [Server parameters](#server-parameters)

### Verify the source version

The source PostgreSQL server version must be 9.5 or later.

If the source PostgreSQL version is less than 9.5, upgrade it to 9.5 or higher before you start the migration.

### Install test_decoding - Source Setup

- **test_decoding** receives WAL through the logical decoding mechanism and decodes it into text representations of the operations performed.
- In Amazon RDS for PostgreSQL, the test_decoding plugin is preinstalled and ready for logical replication. This allows you to easily set up logical replication slots and stream WAL changes, facilitating use cases such as change data capture (CDC) or replication to external systems.
- For more information about the test-decoding plugin, see the [PostgreSQL documentation](https://www.postgresql.org/docs/16/test-decoding.html)

### Target setup

- Before migrating, Azure Database for PostgreSQL – Flexible server must be created.
- SKU provisioned for Azure Database for PostgreSQL – Flexible server should match with the source.
- To create a new Azure Database for PostgreSQL – Flexible server, refer to the link - [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server instance in the Azure portal](..\..\flexible-server\quickstart-create-server-portal.md)

### Enable CDC as a source

- test_decoding logical decoding plugin captures the changed records from the source.
- In the source, PostgreSQL instance, modify the following parameters by creating a new parameter group:
    - Set `rds.logical_replication = 1`
    - Set `max_replication_slots` to a value greater than one; the value should be greater than the number of databases selected for migration.
    - Set `max_wal_senders` to a value greater than one. It should be at least the same as `max_replication_slots`, plus the number of senders already used on your instance.
    - The `wal_sender_timeout` parameter ends inactive replication connections longer than the specified number of milliseconds. The default for an AWS RDS for PostgreSQL instance is `30000 milliseconds (30 seconds)`. Setting the value to 0 (zero) disables the timeout mechanism and is a valid setting for migration.

### Network setup

Networking is required to establish a successful connectivity between the source and target.

- You need to set up Express route/ IP Sec VPN/ VPN tunneling while connecting your source from AWS RDS to Azure.
- For detailed information on the networking setup required when using the migration service in Azure Database for PostgreSQL, refer to the following Microsoft documentation - [Network guide for migration service in Azure Database for PostgreSQL](how-to-network-setup-migration-service.md)

### Extensions

- Use the select command in the source to list all the extensions that are being used - `select extname, extversion from pg_extension;`
- Search for azure.extensions server parameter on the Server parameter page on your Azure Database for PostgreSQL – Flexible server. Enable the extensions found in the source within the PostgreSQL flexible server.

:::image type="content" source="media/tutorial-migration-service-aws-onlineaz-flexible-server-enable-extensions.png" alt-text="Screenshot of Enable extensions.":::

- Check if the list contains any of the following extensions -
    - PG_CRON
    - PG_HINT_PLAN
    - PG_PARTMAN_BGW
    - PG_PREWARM
    - PG_STAT_STATEMENTS
    - PG_AUDIT
    - PGLOGICAL
    - WAL2JSON
If yes, search the server parameters page for the shared_preload_libraries parameter. This parameter indicates the set of extension libraries that are preloaded at the server restart.

:::image type="content" source="media/tutorial-migration-service-aws-onlin/eaz-flexible-server-shared_preload-extensions.png" alt-text="Screenshot of shared Preload libraries.":::

### Users and roles

- The users and different roles must be migrated manually to the Azure Database for PostgreSQL – Flexible server. For migrating users and roles, you can use `pg_dumpall --globals-only -U <<username> -f <<filename>>.sql`.
- Azure Database for PostgreSQL – The flexible server doesn't support any superuser; users having roles of superuser need to be removed before migration.

### Server parameters

- You need to manually configure the server parameter values in the Azure Database for PostgreSQL – Flexible server based on the server parameter values configured in the source.
