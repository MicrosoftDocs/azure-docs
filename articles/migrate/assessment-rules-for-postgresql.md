---
title: PostgreSQL assessment rules to detect blockers and compatibility issues
description: Helps detect migration blockers and compatibility issues when moving PostgreSQL databases to Azure Database for PostgreSQL Flexible Server, ensuring a smooth and successful cloud transition.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 08/01/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to ensure a smooth migration of PostgreSQL databases to Azure by identifying blockers, compatibility issues, and required configuration changes.
---

# PostgreSQL migration asssessment for Azure: Identify compatibility issues and blockers

The asessment rules help identify compatibility issues and migration blockers when moving PostgreSQL instances to Azure Database for PostgreSQL Flexible Server. These rules evaluate your source environment for resource constraints, feature compatibility, security requirements, and configuration differences. Findings are categorized as Issues (blockers requiring resolution) or Warnings (items needing attention but not blocking migration). This assessment helps ensure a successful migration by highlighting necessary changes to database configurations, applications, and architecture.

## Rules summary


| Rule Name  | Scope  | Category | Link to Details   |
|----------|---------|----------|----------------------|
| Extensions    | Database       | Issue    | #extensions    |
| Collations   | Instance/Database | Issue    | #collations      |
| Language Used  | Database          | Issue    | #language-used   |
| Custom Data Type used  | Database          | Issue    | #custom-data-type  |
| Casts   | Database          | Issue    | #casts  |
| Full Text Search (FTS) and FTS Templates  | Database  | Issue  | #fts-templates  |
| TLS/SSL versions   | Instance     | Warning  | #tls-ssl-versions  |
| Superuser Privileges  | Instance/Database | Warning  | #superuser-privileges  |
| File Read/Write Privileges  | Database   | Warning  | #file-privileges  |
| IPv6 Address   Instance       | Issue    | #ipv6-address  |
| Port Usage   | Instance     | Warning  | #port-usage    |
| OID Usage    | Database        | Issue    | #oid-usage  |
| Tablespaces  | Instance    | Warning  | #tablespaces       |
| PostgreSQL Version < 9.5  | Instance   | Issue    | #postgresql-version-95     |
| Read Replicas Count | Instance | Warning  | #read-replicas  |
| Encodings | Database  | Issue    | #encodings  |
| Region Availability | Instance  | Issue    | #region-availability |

## Detailed rule description

**Extensions {#extensions}**

**Title**: Unsupported PostgreSQL extensions detected in source environment for migration to Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: The source PostgreSQL environment includes extensions that aren't supported in Azure Database for PostgreSQL Flexible Server. Only specific extensions are supported. Unsupported extensions can't be created or loaded in the target environment.

**Recommendation**: Review all extensions installed in your source PostgreSQL instance. Compare them with the list of supported extensions in the Azure Database for PostgreSQL Flexible Server documentation. Remove or disable any unsupported extensions before migration. If an unsupported extension is critical, explore alternative approaches or supported extensions that offer similar functionality.

For more information, see []

**Collations {#collations}**

**Title**: Unsupported collations detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: The source PostgreSQL environment includes collations that aren't supported in Azure Database for PostgreSQL Flexible Server. This includes user-defined and OS-specific collations, which may not be available in the target environment.

**Recommendation**: Identify all custom and OS-specific collations used in your source databases. Remove or replace unsupported collations with supported ones. Azure Database for PostgreSQL Flexible Server does not support user-defined collations. Test your application with the updated collations to ensure sorting and comparison operations behave as expected.

For more information: Contact Azure Support for detailed collation compatibility guidance.

**Language Used {#language-used}**

**Title**: Unsupported procedural languages detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: The source PostgreSQL environment includes collations that aren't supported in Azure Database for PostgreSQL Flexible Server. This includes user-defined and OS-specific collations, which may not be available in the target environment.

**Recommendation**: Identify all custom and OS-specific collations used in your source databases. Remove or replace any unsupported collations with supported ones. Azure Database for PostgreSQL Flexible Server doesn't support user-defined collations. Test your application thoroughly with the updated collations to ensure sorting and comparison operations behave as expected.

For more information: Contact Azure Support for detailed collation compatibility information.

**Language Used {#language-used}**

**Title**: Unsupported procedural languages detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: The source PostgreSQL environment includes one or more procedural languages that aren't supported in Azure Database for PostgreSQL Flexible Server. Only a limited set of procedural languages is supported, such as `plpgsql`.

**Recommendation**: Audit all database functions, stored procedures, and triggers to identify the procedural languages they use. Replace any unsupported languages with supported ones, such as `plpgsql`, before migration. If your application relies on advanced features not available in `plpgsql`, consider moving that logic to the application layer.

For more information, see the PostgreSQL documentation for a list of supported procedural languages.

**Custom Data Type used {#custom-data-type}**

**Title**: Unsupported custom data types detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: The source PostgreSQL environment includes custom data types that aren't supported in Azure Database for PostgreSQL Flexible Server. User-defined data types can't be created in the target environment.

**Recommendation**: Document all custom data types and their usage across your database schema. Remove or replace unsupported types with native PostgreSQL types before migration. If custom types include constraints or validation logic, implement them using CHECK constraints, triggers, or application-level validation.

For more information, see PostgreSQL documentation for supported native data types.

**Casts {#casts}**

**Title**: Custom cast creation requires superuser privileges, which aren't supported in Azure Database for PostgreSQL Flexible Server.

**Category**: Issue

**Description**: Azure Database for PostgreSQL – Flexible Server supports only predefined casts. Custom casts can't be created or modified in the target environment.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server doesn't support custom cast creation. Remove or replace custom casts before migration. Use explicit conversion functions or update application code to handle data type conversions.

For more information, see the PostgreSQL documentation for details on supported type conversions.

**Full Text Search (FTS) and FTS Templates {#fts-templates}**

**Title**: Creating FTS configurations requires superuser privileges.

**Category**: Issue

**Description**: Creating full-text search (FTS) configurations,such as dictionaries, templates, and parsers, requires superuser privileges. Only the default FTS configurations are supported. Custom FTS dictionaries and templates can't be created.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server doesn't support creating or modifying full-text search (FTS) configurations. Use the default FTS configurations, or consider using Azure Cognitive Search for advanced search capabilities.

For more information, see PostgreSQL full-text search documentation.

**TLS/SSL versions {#tls-ssl-versions}**

**Title**: Source PostgreSQL instance uses TLS/SSL versions outside the supported range.

**Category**: Warning

**Description**: Azure Database for PostgreSQL – Flexible Server supports only TLS 1.2 and TLS 1.3. Connections that use versions earlier than TLS 1.2 or later than TLS 1.3 will fail. 

**Recommendation**: Azure Database for PostgreSQL – Flexible Server doesn't support TLS versions earlier than 1.2 or later than 1.3. Update your client configurations to use TLS 1.2 or TLS 1.3, and test all applications to ensure compatibility with the supported TLS versions.

For more information, see []

**Superuser Privileges {#superuser-privileges}**

**Title**: PostgreSQL objects and their associated privileges are owned by a superuser.

**Category**: Warning

**Description**: PostgreSQL objects and their associated privileges are owned by a superuser or granted by one. Actions that require superuser privileges can't be performed. Applications that depend on superuser access will fail.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server doesn't support superuser privileges. Before migration, change the ownership of objects and update privileges to use a non-superuser role. Use Azure's built-in management features to perform administrative tasks.

For more information, see []

**File Read/Write Privileges {#file-privileges}**

**Title**: Source database uses functions or extensions that directly access the file system.

**Category**: Warning

**Description**: Azure Database for PostgreSQL – Flexible Server doesn't allow access to the underlying or external file system. Applications that rely on file system access will fail.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server doesn't support reading from or writing to external or VM-level files. Update your application logic to use alternative approaches, such as storing files in Azure Blob Storage or using database tables instead of file system access.

For more information, see []

**IPv6 Address {#ipv6-address}**

**Title**: Use of IPv6 for database connections.

**Category**: Issue

**Description**: Azure Database for PostgreSQL, Flexible Server doesn't support IPv6. Connections that use IPv6 will fail.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server supports only port 5432 for PostgreSQL and port 6432 for PgBouncer. Update your client configurations, firewalls, and application connection strings to use one of the supported ports.

For more information, see []

**Port Usage {#port-usage}**

**Title**: Database connections use ports other than 5432 or 6432.

**Category**: Warning

**Description**: Azure Database for PostgreSQL – Flexible Server supports only ports 5432 (PostgreSQL) and 6432 (PgBouncer). Connections that use unsupported ports will fail.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server supports only port 5432 for PostgreSQL and port 6432 for PgBouncer. Update your client configurations, firewalls, and application connection strings to use one of the supported ports.

For more information, see []

**OID Usage {#oid-usage}**

**Title**: WITH OIDS clause in CREATE TABLE is not supported.

**Category**: Issue

**Description**: The WITH OIDS clause in CREATE TABLE isn't supported in PostgreSQL 12 and later, which Azure Database for PostgreSQL – Flexible Server is based on. Use of WITH OIDS is deprecated and will cause migration errors. Tables that include WITH OIDS can't be created.

**Recommendation**: Remove the WITH OIDS clause from all table definitions. If you need object identifiers, consider using UUID or SERIAL columns instead. Update any application code that references the OID column to reflect these changes.

For more information, see []

**Tablespaces {#tablespaces}**

**Title**: Use of custom tablespaces detected in the source PostgreSQL instance.

**Category**: Warning

**Description**: Azure Database for PostgreSQL – Flexible Server supports only the default tablespaces. Custom tablespaces aren't supported and won't be migrated.

**Recommendation**: Azure Database for PostgreSQL – Flexible Server supports only default tablespaces. After migration, objects that used custom tablespaces will be placed in the default tablespace. Remove all references to custom tablespaces before migration to avoid errors.

For more information, see []

**PostgreSQL Version < 9.5 {#postgresql-version-95}**

**Title**: PostgreSQL version of source PostgreSQL instance is less than 9.5.

**Category**: Issue

**Description**: Azure Database for PostgreSQL – Flexible Server requires PostgreSQL version 9.5 or later for migration and supports version 11 and later for deployment. Migration from versions earlier than PostgreSQL 9.5 isn't supported.

**Recommendation**: Upgrade the source PostgreSQL database to version 9.5 or later before migrating to Azure Database for PostgreSQL – Flexible Server. While migration utilities support PostgreSQL version 9.5 and later, the target Flexible Server supports PostgreSQL version 11 and later for deployment.

For more information, see []

**Read Replicas Count {#read-replicas}**

**Title**: Use of read replicas detected in the source PostgreSQL instance.

**Category**: Warning

**Description**: Azure Database for PostgreSQL – Flexible Server supports a maximum of five read replicas. Connections beyond this limit aren't supported and will fail.

**Recommendation**: If you need more than five read replicas, redesign your application architecture to work within this limitation. Consider using caching layers or distributing read workloads across multiple services to reduce dependency on read replicas.

For more information, see []

**Encodings {#encodings}**  

**Title**: Custom database encodings aren't supported in Azure Database for PostgreSQL – Flexible Server.

**Category**: Issue

**Description**: Encodings used in the source PostgreSQL database aren't supported in Azure Database for PostgreSQL – Flexible Server. Databases that use unsupported encodings can't be migrated.

**Recommendation**: Convert affected databases to a supported encoding before migration. Encoding conversion may require data transformation and could result in data loss if characters can't be properly mapped. Test thoroughly in a non-production environment to validate the conversion.

For more information, see PostgreSQL encoding documentation.

**Region Availability {#region-availability}**

**Title**: Target deployment region isn't supported in Azure Database for PostgreSQL – Flexible Server.

**Category**: Issue

**Description**: Azure Database for PostgreSQL – Flexible Server is available only in select Azure regions. The region specified in the assessment settings isn't supported for deployment.

**Recommendation**: Change the target region in the assessment settings to a supported Azure region. Review the latest regional availability for Azure Database for PostgreSQL – Flexible Server in the Azure documentation. Consider data residency and compliance requirements when selecting a region.

For more information, see []






