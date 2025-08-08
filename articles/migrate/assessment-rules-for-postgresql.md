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

**Description**: Azure Database for PostgreSQL Flexible Server supports only predefined casts. Custom casts can't be created or modified in the target environment.

**Recommendation**: Azure Database for PostgreSQL Flexible Server doesn't support custom cast creation. Remove or replace custom casts before migration. Use explicit conversion functions or update application code to handle data type conversions.

For more information, see the PostgreSQL documentation for details on supported type conversions.