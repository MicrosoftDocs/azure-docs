---
title: "Migration service - known issues and limitations"
description: Providing the limitations of the migration service in Azure Database for PostgreSQL
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.topic: conceptual
---

# Known issues and limitations - migration service in Azure Database for PostgreSQL Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This article describes the known issues and limitations associated with the migrations service in Azure Database for PostgreSQL.

## Common limitations

Here are common limitations that apply to migration scenarios:

- You can have only one active migration or validation to your Flexible server.

- The migration service doesn't migrate users and roles.

- The migration service shows the number of tables copied from source to target. You must manually check the data and PostgreSQL objects on the target server post-migration.

- The migration service only migrates user databases, not system databases such as template_0 and template_1.

- The migration service doesn't support moving POSTGIS, TIMESCALEDB, POSTGIS_TOPOLOGY, POSTGIS_TIGER_GEOCODER, PG_PARTMAN extensions from source to target.

- You can't move extensions not supported by the Azure Database for PostgreSQL – Flexible server. The supported extensions are in [Extensions - Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-extensions).

- User-defined collations can't be migrated into Azure Database for PostgreSQL – flexible server.

- You can't migrate to an older version. For instance, you can't migrate from PostgreSQL 15 to Azure Database for PostgreSQL version 14.

- The migration service only works with preferred or required SSLMODE values.

- The migration service doesn't support superuser privileges and objects.

- The following PostgreSQL objects can't be migrated into the PostgreSQL flexible server target:
    - Create casts
    - Creation of FTS parsers and FTS templates
    - Users with superuser roles
    - Create TYPE

- The migration service doesn't support migration at the object level, that is, at the table level or schema level.

- The migration service is unable to perform migration when the source database is Azure Database for PostgreSQL single server with no public access or is an on-premises/AWS using a private IP, and the target Azure Database for PostgreSQL Flexible Server is accessible only through a private endpoint.

- Migration to burstable SKUs is not supported; databases must first be migrated to a non-burstable SKU and then scaled down if needed.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
