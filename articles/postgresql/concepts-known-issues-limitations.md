---
title: Known issues and limitations - Azure Database for PostgreSQL - Single Server and Flexible Server (Preview)
description: Lists the known issues that customers should be aware of.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/02/2021
---
# Azure Database for PostgreSQL - Known issues and limitations

This page provides a list of known issues in Azure Database for PostgreSQL that could impact your application. It also lists any mitigation and recommendations to workaround the issue.

## Intelligent Performance - Query Store

Applicable to Azure Database for PostgreSQL - Single Server.

| Applicable | Cause | Remediation|
| ----- | ------ | ---- | 
| PostgreSQL 9.6, 10, 11 | Turning on the server parameter `pg_qs.replace_parameter_placeholders` might lead to a server shutdown in some rare scenarios. | Through Azure Portal, Server Parameters section, turn the parameter `pg_qs.replace_parameter_placeholders` value to `OFF` and save.   | 


## Next steps
- See Query Store [best practices](./concepts-query-store-best-practices.md)
