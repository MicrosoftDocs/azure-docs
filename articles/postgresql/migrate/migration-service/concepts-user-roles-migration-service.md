---
title: "Migration service - Migration of users/roles, ownerships, and privileges"
description: Migration of users/roles, ownerships, and privileges along with schema and data
author: shriramm
ms.author: shriramm
ms.reviewer: maghan
ms.date: 03/13/2024
ms.service: postgresql
ms.topic: conceptual
---

# Migration of user roles, ownerships, and privileges for the migrations service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

> [!IMPORTANT]  
> The migration of user roles, ownerships, and privileges feature is available only for the Azure Database for PostgreSQL Single server as the source. This feature is currently disabled for PostgreSQL version 16 servers.

The service automatically provides the following built-in capabilities for the Azure Database for PostgreSQL single server as the source and data migration.

- Migration of user roles on your source server to the target server.
- Migration of ownership of all the database objects on your source server to the target server.
- Migration of permissions of database objects on your source server, such as GRANTS/REVOKES, to the target server.

## Limitations

For a list of limitations, visit [known issues and limitations](concepts-known-issues-migration-service.md#limitations-migrating-from-azure-database-for-postgresql-single-server).

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
