---
title: Known issues and limitations - Azure Database for PostgreSQL - Single Server and Flexible Server (Preview)
description: Lists the known issues that customers should be aware of.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 02/05/2020
---
# Azure Database for PostgreSQL - Known issues and limitations

This page provides a list of known issues in Azure Database for PostgreSQL that could impact your application. It also lists any mitigation and recommendations to workaround the issue.

## Intelligent Performance - Query Store

Applicable to Azure Database for PostgreSQL - Single Server.

| Applicable | Cause | Remediation|
| ----- | ------ | ---- | 
| PostgreSQL 9.6, 10, 11 | Turning on the server parameter `pg_qs.replace_parameter_placeholders` might lead to a server shutdown in some rare scenarios. | Through Azure Portal, Server Parameters section, turn the parameter `pg_qs.replace_parameter_placeholders` value to `OFF` and save.   | 

## Server Parameters

Applicable to Azure Database for PostgreSQL - Single Server and Flexible Server

| Applicable | Cause | Remediation| 
| ----- | ------ | ---- | 
| PostgreSQL 9.6, 10, 11 | Changing the server parameter `max_locks_per_transaction` to a higher value than what is [recommended](https://www.postgresql.org/docs/11/kernel-resources.html) could lead to server unable to come up after a restart. | Leave it to the default value (32 or 64) or change to a reasonable value per PostgreSQL [documentation](https://www.postgresql.org/docs/11/kernel-resources.html). <br> <br> From the service side, this is being worked on to limit the high value based on the SKU.  | 

## Next steps
- See Query Store [best practices](./concepts-query-store-best-practices.md)
