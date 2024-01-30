---
title: Known issues and limitations for Azure Database for PostgreSQL - Single Server and Flexible Server
description: Lists the known issues that customers should be aware of.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/24/2022
---

# Azure Database for PostgreSQL - Known issues and limitations

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This page provides a list of known issues in Azure Database for PostgreSQL that could impact your application. It also lists any mitigation and recommendations to work around the issue.

## Intelligent Performance - Query Store

Applicable to Azure Database for PostgreSQL - Single Server.

| Applicable | Cause | Remediation|
| ----- | ------ | ---- | 
| PostgreSQL 9.6, 10, 11 | Turning on the server parameter `pg_qs.replace_parameter_placeholders` might lead to a server shutdown in some rare scenarios. | Through Azure Portal, Server Parameters section, turn the parameter `pg_qs.replace_parameter_placeholders` value to `OFF` and save.   |

## Next steps

- See Query Store [best practices](./concepts-query-store-best-practices.md)
