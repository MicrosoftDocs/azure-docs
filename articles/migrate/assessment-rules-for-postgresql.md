---
title: PostgreSQL Assessment Rules to Detect Blockers and Compatibility Issues
description: Helps detect migration blockers and compatibility issues when moving PostgreSQL databases to Azure Database for PostgreSQL Flexible Server, ensuring a smooth and successful cloud transition.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 09/19/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to ensure a smooth migration of PostgreSQL databases to Azure by identifying blockers, compatibility issues, and required configuration changes.
---

# PostgreSQL migration assessment for Azure: Identify compatibility issues and blockers (preview)

The assessment rules help identify compatibility issues and migration blockers when you move PostgreSQL instances to Azure Database for PostgreSQL flexible server. You can evaluate the source environment for resource limits, feature support, security settings, and configuration gaps. This evaluation categorizes the findings as Issues (blockers you must fix) or Warnings (items you should address), and recommend changes needed for the database, application, and architecture to ensure a successful migration.

## Migration assessment rules summary

These rules help identify issues and warnings when migrating PostgreSQL to Azure Database for PostgreSQL flexible server.

| Rule Name  | Scope  | Category | Link to Details   |
|----------|---------|----------|----------------------|
| Extensions    | Database       | Issue    | [Unsupported PostgreSQL extensions detected](#extensions).    |
| Collations   | Instance/Database | Issue    | [Unsupported collations detected in the source PostgreSQL](#collations).     |
| Language Used  | Database          | Issue    | [Unsupported procedural languages detected ](#language-used).   |
| Custom data type used  | Database          | Issue    | [Unsupported custom data types found](#custom-data-type-used)  |
| Casts   | Database          | Issue    | [Custom cast creation requires superuser privileges](#casts). |
| Full text search (FTS) and FTS Templates  | Database  | Issue  | [Creating FTS configurations requires superuser privileges](#full-text-search-fts-and-fts-templates)  |
| TLS/SSL versions   | Instance     | Warning  | [Unsupported TLS/SSL versions detected in source](#tlsssl-versions). |
| Superuser privileges  | Instance/Database | Warning  | [Unsupported: PostgreSQL objects owned by superuser](#superuser-privileges).  |
| File read/write privileges  | Database   | Warning  | [Unsupported: Source uses functions/extensions with file system access](#file-readwrite-privileges)  |
| IPv6 address          | Instance    | Issue |[Use of IPv6 for database connections](#ipv6-address). |
| Port usage   | Instance     | Warning  | [Database connections use ports other than 5432 or 6432](#port-usage)   |
| OID usage    | Database        | Issue    | [WITH OIDS clause in CREATE TABLE is not supported](#oid-usage). |
| Tablespaces  | Instance    | Warning  | [Custom tablespaces detected in source PostgreSQL](#tablespaces). |
| PostgreSQL Version < 9.5  | Instance   | Issue    | [ Source PostgreSQL version is below 9.5](#postgresql-version--95). |
| Read replicas count | Instance | Warning  | [Read replicas detected in source PostgreSQL](#read-replicas-count).  |
| Encodings | Database  | Issue    | [Custom database encodings not allowed on Azure flexible server](#encodings).  |
| Region availability | Instance  | Issue    | [Target region not available for Azure flexible server](#region-availability). |
| SKU sizing | Instance  | Warning    | [SKU recommendation based on VM-level configuration](#sku-sizing). |
| Database assessment | Database/Instance | Warning | [Comprehensive database readiness assessment requires PostgreSQL credentials](#database-assessment). |

## Detailed rule description

### Extensions

- **Title**: Unsupported PostgreSQL extensions detected in source environment for migration to Azure Database for PostgreSQL flexible server.

- **Category**: Issue

- **Description**: The source PostgreSQL environment includes extensions that aren't supported in Azure Database for PostgreSQL flexible server. Only specific extensions are supported. Unsupported extensions can't be created or loaded in the target environment.

**Recommendation**: Review all extensions installed in your source PostgreSQL instance. Compare them with the list of supported extensions in the Azure Database for PostgreSQL flexible server documentation. Remove or disable any unsupported extensions before migration. If an unsupported extension is critical, explore alternative approaches or supported extensions that offer similar functionality.

- See about the available extensions and modules for the [Azure Database for the PostgreSQL service](/azure/postgresql/extensions/concepts-extensions-versions).

### Collations

- **Title**: Unsupported collations detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL flexible server.

- **Category**: Issue

- **Description**: The source PostgreSQL environment includes collations that aren't supported in Azure Database for PostgreSQL flexible server. This includes user-defined and OS-specific collations, which may not be available in the target environment.

**Recommendation**: Identify all custom and OS-specific collations used in your source databases. Remove or replace unsupported collations with supported ones. Azure Database for PostgreSQL flexible server does not support user-defined collations. Evaluate your application with the updated collations to ensure sorting and comparison operations behave as expected.

- Contact Azure Support for detailed collation compatibility guidance.

### Language used

- **Title**: Unsupported procedural languages detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL flexible server.

- **Category**: Issue

- **Description**: The source PostgreSQL environment includes collations that aren't supported in Azure Database for PostgreSQL flexible server. This includes user-defined and OS-specific collations, which may not be available in the target environment.

**Recommendation**: Identify all custom and OS-specific collations used in your source databases. Remove or replace any unsupported collations with supported ones. Azure Database for PostgreSQL flexible server doesn't support user-defined collations. Evaluate your application thoroughly with the updated collations to ensure sorting and comparison operations behave as expected.

- Contact Azure Support for detailed collation compatibility information.

### Custom data type used 

- **Title**: Unsupported custom data types detected in the source PostgreSQL environment for migration to Azure Database for PostgreSQL flexible server.

- **Category**: Issue

- **Description**: The source PostgreSQL environment includes custom data types that aren't supported in Azure Database for PostgreSQL flexible server. User-defined data types can't be created in the target environment.

**Recommendation**: Document all custom data types and their usage across your database schema. Remove or replace unsupported types with native PostgreSQL types before migration. If custom types include constraints or validation logic, implement them using CHECK constraints, triggers, or application-level validation.

### Casts 

- **Title**: Custom cast creation requires superuser privileges, which aren't supported in Azure Database for PostgreSQL flexible server.

- **Category**: Issue

- **Description**: Azure Database for PostgreSQL – flexible server supports only predefined casts. Custom casts can't be created or modified in the target environment.

**Recommendation**: Azure Database for PostgreSQL – flexible server doesn't support custom cast creation. Remove or replace custom casts before migration. Use explicit conversion functions or update application code to handle data type conversions.

- Learn about PostgreSQL documentation for more details on supported type conversions.

### Full Text Search (FTS) and FTS Templates

- **Title**: Creating FTS configurations requires superuser privileges.

- **Category**: Issue

- **Description**: Creating full-text search (FTS) configurations, such as dictionaries, templates, and parsers, requires superuser privileges. Only the default FTS configurations are supported. Custom FTS dictionaries and templates can't be created.

**Recommendation**: Azure Database for PostgreSQL – flexible server doesn't support creating or modifying full-text search (FTS) configurations. Use the default FTS configurations or consider using Azure Cognitive Search for advanced search capabilities.


### TLS/SSL versions

- **Title**: Source PostgreSQL instance uses TLS/SSL versions outside the supported range.

- **Category**: Warning

- **Description**: Azure Database for PostgreSQL – flexible server supports only TLS 1.2 and TLS 1.3. Connections that use versions earlier than TLS 1.2 or later than TLS 1.3 will fail. 

**Recommendation**: Azure Database for PostgreSQL – flexible server doesn't support TLS versions earlier than 1.2 or later than 1.3. Update your client configurations to use TLS 1.2 or TLS 1.3 and test all applications to ensure compatibility with the supported TLS versions.

- Learn about [SSL/TLS connectivity in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-networking-ssl-tls).

### Superuser privileges

- **Title**: PostgreSQL objects and their associated privileges are owned by a superuser.

- **Category**: Warning

- **Description**: PostgreSQL objects and their associated privileges are owned by a superuser or granted by one. Actions that require superuser privileges can't be performed. Applications that depend on superuser access will fail.

**Recommendation**: Azure Database for PostgreSQL – flexible server doesn't support superuser privileges. Before migration, change the ownership of objects and update privileges to use a non-superuser role. Use Azure's built-in management features to perform administrative tasks.

- Learn about [Server concepts in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-servers).

### File read/write privileges

- **Title**: Source database uses functions or extensions that directly access the file system.

- **Category**: Warning

- **Description**: Azure Database for PostgreSQL – flexible server doesn't allow access to the underlying or external file system. Applications that rely on file system access will fail.

**Recommendation**: Azure Database for PostgreSQL – flexible server doesn't support reading from or writing to external or VM-level files. Update your application logic to use alternative approaches, such as storing files in Azure Blob Storage or using database tables instead of file system access.

- Learn about [Using pg_azure_storage extension](/azure/postgresql/flexible-server/concepts-storage-extension?tabs=portal-01%2Cportal-02%2Cportal-03%2Cportal-04%2Cportal-05).

### IPv6 address

- **Title**: Use of IPv6 for database connections.

- **Category**: Issue

- **Description**: Azure Database for PostgreSQL, flexible server doesn't support IPv6. Connections that use IPv6 will fail.

**Recommendation**: Azure Database for PostgreSQL – flexible server supports only port 5432 for PostgreSQL and port 6432 for PgBouncer. Update your client configurations, firewalls, and application connection strings to use one of the supported ports.

- Learn about [Firewall rules in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-firewall-rules)

### Port usage

- **Title**: Database connections use ports other than 5432 or 6432.

- **Category**: Warning

- **Description**: Azure Database for PostgreSQL – flexible server supports only ports 5432 (PostgreSQL) and 6432 (PgBouncer). Connections that use unsupported ports will fail.

**Recommendation**: Azure Database for PostgreSQL – flexible server supports only port 5432 for PostgreSQL and port 6432 for PgBouncer. Update your client configurations, firewalls, and application connection strings to use one of the supported ports.

- Learn about [connection settings in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/server-parameters-table-connections-and-authentication-connection-settings?pivots=postgresql-17).

### OID usage 

- **Title**: WITH OIDS clause in CREATE TABLE is not supported.

- **Category**: Issue

- **Description**: The WITH OIDS clause in CREATE TABLE isn't supported in PostgreSQL 12 and later, which Azure Database for PostgreSQL – flexible server is based on. Use of WITH OIDS is deprecated and will cause migration errors. Tables that include WITH OIDS can't be created.

**Recommendation**: Remove the WITH OIDS clause from all table definitions. If you need object identifiers, consider using UUID or SERIAL columns instead. Update any application code that references the OID column to reflect these changes.

- Learn about [PostgreSQL 12.0 release notes](https://www.postgresql.org/docs/release/12.0/).

### Tablespaces

- **Title**: Use of custom tablespaces detected in the source PostgreSQL instance.

- **Category**: Warning

- **Description**: Azure Database for PostgreSQL – flexible server supports only the default tablespaces. Custom tablespaces aren't supported and won't be migrated.

**Recommendation**: Azure Database for PostgreSQL – flexible server supports only default tablespaces. After migration, objects that used custom tablespaces will be placed in the default tablespace. Remove all references to custom tablespaces before migration to avoid errors.

- Learn about [Known issues in migration service](/azure/postgresql/migrate/migration-service/concepts-known-issues-migration-service).

### PostgreSQL version < 9.5 

- **Title**: PostgreSQL version of source PostgreSQL instance is less than 9.5.

- **Category**: Issue

- **Description**: Azure Database for PostgreSQL – flexible server requires PostgreSQL version 9.5 or later for migration and supports version 11 and later for deployment. Migration from versions earlier than PostgreSQL 9.5 isn't supported.

**Recommendation**: Upgrade the source PostgreSQL database to version 9.5 or later before migrating to Azure Database for PostgreSQL – flexible server. While migration utilities support PostgreSQL version 9.5 and later, the target flexible server supports PostgreSQL version 11 and later for deployment.

- Learn about [PostgreSQL migration service overview](/azure/postgresql/migrate/migration-service/overview-migration-service-postgresql).

### Read replicas count

- **Title**: Use of read replicas detected in the source PostgreSQL instance.

- **Category**: Warning

- **Description**: Azure Database for PostgreSQL – flexible server supports a maximum of five read replicas. Connections beyond this limit aren't supported and will fail.

**Recommendation**: If you need more than five read replicas, redesign your application architecture to work within this limitation. Consider using caching layers or distributing read workloads across multiple services to reduce dependency on read replicas.

- Learn about [Read replicas in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-read-replicas)

### Encodings

- **Title**: Custom database encodings aren't supported in Azure Database for PostgreSQL – flexible server.

- **Category**: Issue

**Description**: Encodings used in the source PostgreSQL database aren't supported in Azure Database for PostgreSQL – flexible server. Databases that use unsupported encodings can't be migrated.

**Recommendation**: Convert affected databases to a supported encoding before migration. Encoding conversion may require data transformation and could result in data loss if characters can't be properly mapped. Test thoroughly in a non-production environment to validate the conversion.

### Region availability 

- **Title**: Target deployment region isn't supported in Azure Database for PostgreSQL – flexible server.

- **Category**: Issue

- **Description**: Azure Database for PostgreSQL – flexible server is available only in select Azure regions. The region specified in the assessment settings isn't supported for deployment.

**Recommendation**: Change the target region in the assessment settings to a supported Azure region. Review the latest regional availability for Azure Database for PostgreSQL – flexible server in the Azure documentation. Consider data residency and compliance requirements when selecting a region.

- Learn about [Azure regions for PostgreSQL flexible server](/azure/postgresql/flexible-server/overview#azure-regions).

### SKU sizing

- **Title**:  SKU recommendation is based on VM-level configuration due to limited database access.

- **Category**: Warning

- **Description**: SKU sizing is based on virtual machine-level data. For accurate sizing, PostgreSQL credentials with adequate permissions are required. Without database-level metrics, the SKU recommendation might not be optimal.

**Recommendation**: To ensure accurate sizing, provide PostgreSQL credentials with adequate permissions or unblock discovery. Then, recalculate assessments 24 hours after providing the credentials. This helps optimize resource allocation and improve cost efficiency for your Azure Database for PostgreSQL flexible server deployment.

### Database assessment

- **Title**: A comprehensive database readiness assessment requires PostgreSQL credentials with sufficient permissions for a complete evaluation.

- **Category**: Warning

- **Description**: Database-level assessment rules can't be validated without PostgreSQL credentials. To proceed, either perform manual validation or enable deep discovery. The following rules couldn't be evaluated due to insufficient database access: Extensions, Collations, Languages, Data Types, Connections, Casts, Full-Text Search (FTS), TLS/SSL, Privileges, File Access, IPv6, OID, Tablespaces, Replicas, and Encodings.

**Recommendation**: To ensure a comprehensive readiness assessment for migrating to Azure Database for PostgreSQL flexible server, either manually validate the unassessed rules using the provided documentation links or provide PostgreSQL credentials with adequate permissions. Then, recalculate the assessments to enable automated validation.

## Related content

- [PostgreSQL workloads for Migration to Azure](tutorial-assess-postgresql.md).
- [Review PostgreSQL assessment results](tutorial-review-postgresql-report.md).





