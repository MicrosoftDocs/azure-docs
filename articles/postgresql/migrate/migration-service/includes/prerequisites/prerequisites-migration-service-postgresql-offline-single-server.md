---
title: "Prerequisites for the migration service in Azure Database for PostgreSQL (offline)"
description: Providing the prerequisites of the migration service in Azure Database for PostgreSQL
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

### Prerequisites (offline)

Before you start your migration with migration service in Azure Database for PostgreSQL, fulfilling the following prerequisites, which apply to offline migration scenarios is essential.

### Verify the source version

Source PostgreSQL version should be `>= 9.5`. If the source PostgreSQL version is less than `9.5`, upgrade the source PostgreSQL version to `9.5` or higher before migration.

### Target setup

- Azure Database for PostgreSQL must be set up in Azure before migration.

- The SKU chosen for the Azure Database for PostgreSQL should correspond with the specifications of the source database to ensure compatibility and adequate performance.

- For detailed instructions on creating a new Azure Database for PostgreSQL, refer to the following link: [Quickstart: Create server](/azure/postgresql/flexible-server/).

### Network setup

Network setup is crucial for the migration service to function correctly. Ensure that the source PostgreSQL server can communicate with the target Azure Database for PostgreSQL server. The following network configurations are essential for a successful migration.

For information about network setup, visit [Network guide for migration service](../../how-to-network-setup-migration-service.md).

### Extensions

Extensions are extra features that can be added to PostgreSQL to enhance its functionality. Extensions are supported in Azure Database for PostgreSQL but must be enabled manually. To enable extensions, follow these steps:

- Use the select command in the source to list all the extensions that are being used - `select extname,extversion from pg_extension;`

- Search for azure.extensions server parameter on the Server parameter page on your Azure Database for PostgreSQL. Enable the extensions found in the source within PostgreSQL.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

  :::image type="content" source="../../media/concepts-prerequisites-migration-service/extensions-enable-flexible-server.png" alt-text="Screenshot of extensions.":::

- Check if the list contains any of the following extensions:
    - PG_CRON
    - PG_HINT_PLAN
    - PG_PARTMAN_BGW
    - PG_PREWARM
    - PG_STAT_STATEMENTS
    - PG_AUDIT
    - PGLOGICAL
    - WAL2JSON

If yes, search the server parameters page for the shared_preload_libraries parameter. This parameter indicates the set of extension libraries that are preloaded at the server restart.

### Server parameters

These parameters aren't automatically migrated to the target environment and must be manually configured.

- Match server parameter values from the source PostgreSQL database to the Azure Database for PostgreSQL by accessing the "Server parameters" section in the Azure portal and manually updating the values accordingly.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

### Disable high availability (reliability) and read replicas in the target

- Disabling high availability (reliability) and reading replicas in the target environment is essential. These features should be enabled only after the migration has been completed.

- By following these guidelines, you can help ensure a smooth migration process without the added variables introduced by HA and Read Replicas. Once the migration is complete and the database is stable, you can proceed to enable these features to enhance the availability and scalability of your database environment in Azure.
