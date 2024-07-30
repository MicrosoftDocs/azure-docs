---
title: "Prerequisites using the migration service from AWS RDS PostgreSQL (online)"
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
- In Amazon RDS for PostgreSQL, the test_decoding plugin is preinstalled and ready for logical replication. This allows you to easily set up logical replication slots and stream WAL changes, facilitating use cases such as change data capture (CDC) or replication to external systems.
- For more information about the test-decoding plugin, see the [PostgreSQL documentation](https://www.postgresql.org/docs/16/test-decoding.html)

### Configure target setup

- Before migrating, Azure Database for PostgreSQL – Flexible server must be created.
- SKU provisioned for Azure Database for PostgreSQL – Flexible server should match with the source.
- To create a new Azure Database for PostgreSQL, visit [Create an Azure Database for PostgreSQL](../../../../flexible-server/quickstart-create-server-portal.md)

### Enable CDC as a source

- `test_decoding` logical decoding plugin captures the changed records from the source.
- In the source, PostgreSQL instance, modify the following parameters by creating a new parameter group:
    - Set `rds.logical_replication = 1`
    - Set `max_replication_slots` to a value greater than one; the value should be greater than the number of databases selected for migration.
    - Set `max_wal_senders` to a value greater than one. It should be at least the same as `max_replication_slots`, plus the number of senders already used on your instance.
    - The `wal_sender_timeout` parameter ends inactive replication connections longer than the specified number of milliseconds. The default for an AWS RDS for PostgreSQL instance is `30000 milliseconds (30 seconds)`. Setting the value to 0 (zero) disables the timeout mechanism and is a valid setting for migration.

- In the target Flexible Server, to prevent the Online migration from running out of storage to store the logs, ensure that you have sufficient tablespace space using a provisioned managed disk. To achieve this, disable the server parameter `azure.enable_temp_tablespaces_on_local_ssd` for the duration of the migration, and restore it to the original state after the migration.


### Configure network setup

Network setup is crucial for the migration service to function correctly. Ensure that the source PostgreSQL server can communicate with the target Azure Database for PostgreSQL server. The following network configurations are essential for a successful migration.

For information about network setup, visit [Network guide for migration service](../../how-to-network-setup-migration-service.md).

### Enable extensions

[!INCLUDE [prerequisites-migration-service-extensions](../prerequisites/prerequisites-migration-service-extensions.md)]

### Check server parameters

These parameters aren't automatically migrated to the target environment and must be manually configured.

- Match server parameter values from the source PostgreSQL database to the Azure Database for PostgreSQL by accessing the "Server parameters" section in the Azure portal and manually updating the values accordingly.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

### Check users and roles

When migrating to Azure Database for PostgreSQL, it's essential to address the migration of users and roles separately, as they require manual intervention:

- **Manual Migration of Users and Roles**: Users and their associated roles must be manually migrated to the Azure   Database for PostgreSQL. To facilitate this process, you can use the `pg_dumpall` utility with the `--globals-only` flag to export global objects such as roles and user accounts. Execute the following command, replacing `<<username>>` with the actual username and `<<filename>>` with your desired output file name:

  ```sql
  pg_dumpall --globals-only -U <<username>> -f <<filename>>.sql
  ```

- **Restriction on Superuser Roles**: Azure Database for PostgreSQL doesn't support superuser roles. Therefore, users with superuser privileges must have those privileges removed before migration. Ensure that you adjust the permissions and roles accordingly.

By following these steps, you can ensure that user accounts and roles are correctly migrated to the Azure Database for PostgreSQL without encountering issues related to superuser restrictions.

### Disable high availability (reliability) and read replicas in the target

- Disabling high availability (reliability) and reading replicas in the target environment is essential. These features should be enabled only after the migration has been completed.

- By following these guidelines, you can help ensure a smooth migration process without the added variables introduced by HA and Read Replicas. Once the migration is complete and the database is stable, you can proceed to enable these features to enhance the availability and scalability of your database environment in Azure.
