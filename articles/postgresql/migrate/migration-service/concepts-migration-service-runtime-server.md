---
title: "Introduction of migration runtime server in Migration service in Azure Database for PostgreSQL"
description: "Concepts about the migration runtime server in migration service Azure Database for PostgreSQL"
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: conceptual
---

# Migration Runtime Server with the migration service in Azure Database for PostgreSQL Preview

The Migration Runtime Server is a specialized feature within the [migration service in Azure Database for PostgreSQL](concepts-migration-service-postgresql.md), designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

The migration runtime server is helpful in scenarios where both the source PostgreSQL instances and the target Azure Database for PostgreSQL Flexible Server are configured to communicate over private endpoints or private IPs, ensuring that the migration occurs within a secure and isolated network space. The Migration Runtime Server handles the data transfer, connecting to the source PostgreSQL instance to retrieve data and then pushing it to the target server.

The migration runtime server is distinct from the target server and is configured to handle the data transfer process, ensuring a secure and efficient migration path.

:::image type="content" source="media/concepts-migration-service-runtime-server/private-endpoint-scenario.png" alt-text="Screenshot of migration runtime server.":::

## Supported migration scenarios with the Migration Runtime Server

The migration runtime server is essential for transferring data between different source PostgreSQL instances and the Azure Database for PostgreSQL - Flexible Server. It's necessary in the following scenarios:

- When the source is an Azure Database for PostgreSQL—Single Server configured with a private endpoint and the target is an Azure Database for PostgreSQL—Flexible Server with a private endpoint.
- For sources such as on-premises databases, Azure VMs, or AWS instances that are only accessible via private networks, and the target Azure Database for PostgreSQL - Flexible Server with a private endpoint.

## How do you use the Migration Runtime Server feature?

To use the Migration Runtime Server feature within the migration service in Azure Database for PostgreSQL, follow these steps in the Azure portal:

- Sign in to the Azure portal and access the migration service (from the target server) in the Azure Database for PostgreSQL instance.
- Begin a new migration workflow within the service.
- When you reach the "Select runtime server" tab, use the Migration Runtime Server by selecting "Yes."
Choose your Azure subscription and resource group and the location of the VNet-integrated Azure Database for PostgreSQL—Flexible server.
- Select the appropriate Azure Database for PostgreSQL Flexible Server to serve as your Migration Runtime Server.

:::image type="content" source="media/concepts-migration-service-runtime-server/select-runtime-server.png" alt-text="Screenshot of selecting migration runtime server.":::

## Migration Runtime Server essentials

- **Minimal Configuration**—Despite being created from an Azure Database for PostgreSQL Flexible Server, the migration runtime server solely facilitates migration without the need for HA, backups, version specificity, or advanced storage features.
- **Performance and Sizing**—The migration runtime server must be appropriately scaled to manage the workload, and it's recommended that you select an SKU equivalent to or greater than that of the target server.
- **Networking** Ensure that the migration runtime server is appropriately integrated into the Virtual Network (virtual network) and that network security allows for secure communication with both the source and target servers. For more information visit [Network guide for migration service](how-to-network-setup-migration-service.md).
- **Cleanup Post-Migration**—After the migration is complete, the migration runtime server should be decommissioned to avoid unnecessary costs. Before deletion, ensure all data has been successfully migrated and that the server is no longer needed.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
