---
title: "Migration service - Known issues and limitations"
description: This article provides the limitations and known issues of the migration service in Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: conceptual
---

# Known issues and limitations for the migration service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article describes the known issues and limitations associated with the migrations service in Azure Database for PostgreSQL.

## Common limitations

Here are common limitations that apply to migration scenarios:

- You can have only one active migration or validation to your flexible server.
- The migration service only supports migration for users and roles when the source is Azure Database for PostgreSQL - Single Server.
- The migration service shows the number of tables copied from source to target. You must manually check the data and PostgreSQL objects on the target server post-migration.
- The migration service migrates only user databases, not system databases, such as template_0 and template_1.
- The migration service doesn't support moving TIMESCALEDB, POSTGIS_TOPOLOGY, POSTGIS_TIGER_GEOCODER, or PG_PARTMAN extensions from source to target.
- You can't move extensions not supported by Azure Database for PostgreSQL - Flexible Server. The supported extensions are listed in [Extensions - Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-extensions).
- User-defined collations can't be migrated into Azure Database for PostgreSQL - Flexible Server.
- You can't migrate to an older version. For instance, you can't migrate from Azure Database for PostgreSQL version 15 to version 14.
- The migration service only works with preferred or required SSLMODE values.
- The migration service doesn't support superuser privileges and objects.
- Azure Database for PostgreSQL - Flexible Server doesn't support the creation of custom tablespaces because of superuser privilege restrictions. During migration, data from custom tablespaces in the source PostgreSQL instance is migrated into the default tablespaces of the target Azure Database for PostgreSQL - Flexible Server instance.

- The following PostgreSQL objects can't be migrated into the PostgreSQL flexible server target:

    - Create casts
    - Creation of FTS parsers and FTS templates
    - Users with superuser roles
    - Create TYPE

- The migration service doesn't support migration at the object level, that is, at the table level or schema level.
- Migration to burstable SKUs isn't supported. Databases must first be migrated to a nonburstable SKU and then scaled down if needed.
- The Migration Runtime Server is designed to operate with the default DNS servers/private DNS zones, for example, `privatelink.postgres.database.azure.com`. Custom DNS names/DNS servers aren't supported by the migration service when you use the Migration Runtime Server feature. When you're configuring private endpoints for both the source and target databases, it's imperative to use the default private DNS zone provided by Azure for the private link service. The use of custom DNS configurations isn't yet supported and might lead to connectivity issues during the migration process.

## Limitations migrating from Azure Database for PostgreSQL - Single Server

- Microsoft Entra ID users present on your source server aren't migrated to the target server. To mitigate this limitation, see [Manage Microsoft Entra roles](../../flexible-server/how-to-manage-azure-ad-users.md) to manually create all Microsoft Entra users on your target server before you trigger a migration. If Microsoft Entra users aren't created on the target server, migration fails.
- If the target flexible server uses the SCRAM-SHA-256 password encryption method, connection to a flexible server using the users/roles on a single server fails because the passwords are encrypted by using the md5 algorithm. To mitigate this limitation, choose the option `MD5` for the `password_encryption` server parameter on your flexible server.
- Online migration makes use of [pgcopydb follow](https://pgcopydb.readthedocs.io/en/latest/ref/pgcopydb_follow.html), and some of the [logical decoding restrictions](https://pgcopydb.readthedocs.io/en/latest/ref/pgcopydb_follow.html#pgcopydb-follow) apply.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
