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





