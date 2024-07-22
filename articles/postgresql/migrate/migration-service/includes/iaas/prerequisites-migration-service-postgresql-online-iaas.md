---
title: "Prerequisites using the migration service from an Azure VM or an on-premises PostgreSQL server (online)"
description: Providing the online prerequisites for the migration service in Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: include
---

Before starting the migration with the Azure Database for PostgreSQL migration service, it is important to fulfill the following prerequisites, specifically designed for online migration scenarios.

- [Verify the source version](#verify-the-source-version)
- [Install test_decoding - Source Setup](#install-test_decoding---source-setup)
- [Configure target setup](#configure-target-setup)
- [Enable CDC as a source](#enable-cdc-as-a-source)
- [Configure network setup](#configure-network-setup)
- [Enable extensions](#enable-extensions)
- [Check server parameters](#check-server-parameters)
- [Check users and roles](#check-users-and-roles)

### Verify the source version

The source PostgreSQL server version must be 9.5 or later.

If the source PostgreSQL version is less than 9.5, upgrade it to 9.5 or higher before you start the migration.

### Install test_decoding - Source Setup

- **test_decoding** receives WAL through the logical decoding mechanism and decodes it into text representations of the operations performed.

- For more information about the test-decoding plugin, see the [PostgreSQL documentation](https://www.postgresql.org/docs/16/test-decoding.html)

### Configure target setup

- Before migrating, Azure Database for PostgreSQL – Flexible server must be created.
- SKU provisioned for Azure Database for PostgreSQL – Flexible server should match with the source.
- To create a new Azure Database for PostgreSQL, visit [Create an Azure Database for PostgreSQL](../../../../flexible-server/quickstart-create-server-portal.md)

### Enable CDC as a source

- `test_decoding` logical decoding plugin captures the changed records from the source.
- In the source PostgreSQL instance, set the following parameters and values in the postgresql.conf configuration file:
    - `Set wal_level = logical`
    - `Set max_replication_slots` to a value greater than 1, the value should be greater than the number of databases selected for migration.
    - `Set max_wal_senders` to a value greater than 1, should be set to at least the same as max_replication_slots, plus the number of senders already used by your instance.
    - The `wal_sender_timeout` parameter ends replication connections that are inactive longer than the specified number of milliseconds. The default for an on-premises PostgreSQL database is 60000 milliseconds (60 seconds). Setting the value to 0 (zero) disables the timeout mechanism and is a valid setting for migration.

To prevent the Online migration from running out of space, ensure that you have sufficient tablespace space using a provisioned managed disk. To achieve this, disable the server parameter `azure.enable_temp_tablespaces_on_local_ssd` on the Flexible Server for the duration of the migration, and restore it to the original state after the migration.

### Configure network setup

Network setup is crucial for the migration service to function correctly. Ensure that the source PostgreSQL server can communicate with the target Azure Database for PostgreSQL server. The following network configurations are essential for a successful migration.

For information about network setup, visit [Network guide for migration service](../../how-to-network-setup-migration-service.md).

- **Additional networking considerations:**

pg_hba.conf Configuration: To facilitate connectivity between the source and target PostgreSQL instances, it's essential to verify and potentially modify the pg_hba.conf file. This file includes client authentication and must be configured to allow the target PostgreSQL to connect to the source. Changes to the pg_hba.conf file typically require a restart of the source PostgreSQL instance to take effect.

The pg_hba.conf file is located in the data directory of the PostgreSQL installation. This file should be checked and configured if the source database is an on-premises PostgreSQL server or a PostgreSQL server hosted on an Azure VM. 

### Enable extensions

[!INCLUDE [prerequisites-migration-service-extensions](../prerequisites/prerequisites-migration-service-extensions.md)]

### Check server parameters

- You need to manually configure the server parameter values in the Azure Database for PostgreSQL – Flexible server based on the server parameter values configured in the source.

### Check users and roles

- The users and different roles must be migrated manually to the Azure Database for PostgreSQL – Flexible server. For migrating users and roles, you can use `pg_dumpall --globals-only -U <<username> -f <<filename>>.sql`.
- Azure Database for PostgreSQL – The flexible server doesn't support any superuser; users having roles of superuser need to be removed before migration.

