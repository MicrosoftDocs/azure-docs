---
title: "Prerequisites for the migration service in Azure Database for PostgreSQL (online)"
description: Providing the prerequisites of the migration service in Azure Database for PostgreSQL
author: hariramt
ms.author: hariramt
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: include
---

### Prerequisites (online)

Before you start your migration with migration service in Azure Database for PostgreSQL, fulfilling the following prerequisites, which apply to offline migration scenarios is essential.

### Verify the source version

Source PostgreSQL version should be `>= 9.5`. If the source PostgreSQL version is less than `9.5`, upgrade the source PostgreSQL version to `9.5` or higher before migration.

### Set up online migration parameters

For Online migration, the replication support should be set to Logical under replication settings of the source PostgreSQL server. In addition, the server parameters `max_wal_senders` and `max_replication_slots` values should be more than the number of Databases that need to be migrated. The parameters can be set in the Azure portal under **Settings->Server Parameters** or configured in the command line using the following commands:

- ALTER SYSTEM SET wal_level = logical;
- ALTER SYSTEM SET max_wal_senders = `number of databases to migrate` + 1;
- ALTER SYSTEM SET max_replication_slots = `number of databases to migrate` + 1;

Ensure that there are no **long running transactions**. Long running transactions don't allow creation of replication slots. The creation of a replication slot will succeed if all long running transactions are committed or rolled-back. You'll need to restart the source PostgreSQL server after completing all the Online migration prerequisites.

> [!NOTE]
> For online migration with Azure Database for PostgreSQL single server, the Azure replication support is set to logical under the replication settings of the single server page in the Azure portal.

To prevent the Online migration from running out of storage to store the logs, ensure that you have sufficient tablespace space using a provisioned managed disk. To achieve this, disable the server parameter `azure.enable_temp_tablespaces_on_local_ssd` on the Flexible Server for the duration of the migration, and restore it to the original state after the migration.

### Set up target

- Azure Database for PostgreSQL must be set up in Azure before migration.

- The SKU chosen for the Azure Database for PostgreSQL should correspond with the specifications of the source database to ensure compatibility and adequate performance.

- For detailed instructions on creating a new Azure Database for PostgreSQL, refer to the following link: [Quickstart: Create server](/azure/postgresql/flexible-server/).

- The server parameter `max_replication_slots` should be more than the number of Databases that need to be migrated. It can be set in the Azure portal under **Settings->Server Parameters** or configured in the command line using the following command:

- ALTER SYSTEM SET max_replication_slots = `number of databases to migrate` + 1;

### Set up Network

Network setup is crucial for the migration service to function correctly. Ensure that the source PostgreSQL server can communicate with the target Azure Database for PostgreSQL server. The following network configurations are essential for a successful migration.

For information about network setup, visit [Network guide for migration service](../../how-to-network-setup-migration-service.md).

### Enable extensions

[!INCLUDE [prerequisites-migration-service-extensions](../prerequisites/prerequisites-migration-service-extensions.md)]

### Server parameters

These parameters aren't automatically migrated to the target environment and must be manually configured.

- Match server parameter values from the source PostgreSQL database to the Azure Database for PostgreSQL by accessing the "Server parameters" section in the Azure portal and manually updating the values accordingly.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

### Disable high availability (reliability) and read replicas in the target

- Disabling high availability (reliability) and reading replicas in the target environment is essential. These features should be enabled only after the migration has been completed.

- By following these guidelines, you can help ensure a smooth migration process without the added variables introduced by HA and Read Replicas. Once the migration is complete and the database is stable, you can proceed to enable these features to enhance the availability and scalability of your database environment in Azure.
