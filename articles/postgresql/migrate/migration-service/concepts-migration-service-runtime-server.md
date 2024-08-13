---
title: "Migration Runtime Server in Azure Database for PostgreSQL"
description: "This article discusses concepts about Migration Runtime Server with the migration service in Azure Database for PostgreSQL."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: conceptual
---

# Migration Runtime Server with the migration service in Azure Database for PostgreSQL

Migration Runtime Server is a specialized feature in the [migration service in Azure Database for PostgreSQL](concepts-migration-service-postgresql.md) that acts as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server. It's used to facilitate the migration of databases from a source environment that's only accessible via a private network.

Migration Runtime Server is helpful in scenarios where both the source PostgreSQL instances and the target Azure Database for PostgreSQL - Flexible Server instance are configured to communicate over private endpoints or private IPs. This arrangement ensures that the migration occurs within a secure and isolated network space. Migration Runtime Server handles the data transfer. It connects to the source PostgreSQL instance to retrieve data and then push it to the target server.

Migration Runtime Server is distinct from the target server and is configured to handle the data transfer process, ensuring a secure and efficient migration path.

:::image type="content" source="media/concepts-migration-service-runtime-server/private-endpoint-scenario.png" alt-text="Screenshot that shows Migration Runtime Server.":::

## Supported migration scenarios with the Migration Runtime Server

Migration Runtime Server is essential for transferring data between different source PostgreSQL instances and the Azure Database for PostgreSQL - Flexible Server instance. It's necessary in the following scenarios:

- When the source is an Azure Database for PostgreSQL - Single Server configured with a private endpoint and the target is an Azure Database for PostgreSQL - Flexible Server with a private endpoint.
- For sources such as on-premises databases, Azure virtual machines, or AWS instances that are only accessible via private networks and the target Azure Database for PostgreSQL - Flexible Server instance with a private endpoint.

## How do you use the Migration Runtime Server feature?

To use the Migration Runtime Server feature within the migration service in Azure Database for PostgreSQL, you have two migration options:

- Use the Azure portal during setup.
- Specify the `migrationRuntimeResourceId` parameter in the JSON properties file during the migration create command in the Azure CLI.

Here's how to do it in both methods.

### Use the Azure portal

1. Sign in to the Azure portal and access the migration service (from the target server) in the Azure Database for PostgreSQL instance.
1. Begin a new migration workflow within the service.
1. When you reach the **Select runtime server** tab, select **Yes** to use Migration Runtime Server.
1. Select your Azure subscription and resource group. Select the location of the virtual network-integrated Azure Database for PostgreSQL - Flexible Server instance.
1. Select the appropriate Azure Database for PostgreSQL - Flexible Server instance to serve as your Migration Runtime Server instance.

   :::image type="content" source="media/concepts-migration-service-runtime-server/select-runtime-server.png" alt-text="Screenshot that shows selecting Migration Runtime Server.":::

### Use the Azure CLI

1. Open your command-line interface.
1. Ensure that you have the Azure CLI installed and that you're signed in to your Azure account by using `az sign-in`.
1. The version should be at least 2.62.0 or above to use the Migration Runtime Server option.
1. The `az postgres flexible-server migration create` command requires a JSON file path as part of the `--properties` parameter, which contains configuration details for the migration. Provide the `migrationRuntimeResourceId` parameter in the JSON properties file.

## Migration Runtime Server essentials

- **Minimal configuration**: Despite being created from Azure Database for PostgreSQL - Flexible Server, Migration Runtime Server solely facilitates migration without the need for high availability, backups, version specificity, or advanced storage features.
- **Performance and sizing**: Migration Runtime Server must be appropriately scaled to manage the workload. We recommend that you select an SKU equivalent to or greater than that of the target server.
- **Networking**: Ensure that Migration Runtime Server is appropriately integrated into the virtual network and that network security allows for secure communication with both the source and target servers. For more information, see [Network guide for migration service](how-to-network-setup-migration-service.md).
- **Post-migration cleanup**: After the migration is finished, Migration Runtime Server should be decommissioned to avoid unnecessary costs. Before deletion, ensure that all data was successfully migrated and that the server is no longer needed.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
