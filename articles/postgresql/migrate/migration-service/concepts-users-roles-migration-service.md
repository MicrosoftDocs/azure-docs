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

#  Migration of user roles, ownerships, and privileges for the migrations service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

> [!IMPORTANT]  
> The migration of users/roles, ownerships and privileges feature is currently available only for Azure database for PostgreSQL Single server as the source. This functionality is enabled by default for flexible servers in all Azure public regions and gov clouds. It will be enabled for flexible servers in China regions soon. Also, please note that this feature is currently disabled for PostgreSQL version 16 servers, and support for it will be introduced in the near future.

For Azure database for PostgreSQL Single server as the source, along with data migration, the service automatically provides the following built-in capabilities.

- Migration of user roles present on your source server to the target server.
- Migration of ownership of all the database objects on your source server to the target server.
- Migration of permissions of database objects on your source server such as GRANTS/REVOKES to the target server.

## Limitations

For a list of limitations visit, [known issues and limitations](concepts-known-issues-migration-service.md#limitations-migrating-from-azure-database-for-postgresql-single-server).

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
