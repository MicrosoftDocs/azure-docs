---
title: Azure Database for PostgreSQL - Flexible Server Release notes
description: Release notes of Azure Database for PostgreSQL - Flexible Server.
author: sr-msft
ms.author: srranga
ms.custom: mvc
ms.service: postgresql
ms.topic: overview
ms.date: 05/25/2021
---

# Release notes - Azure Database for PostgreSQL - Flexible Server

This page provides latest news and updates regarding feature additions, engine versions support, extensions, and any other announcements relevant for Flexible Server - PostgreSQL.

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

## Release: May 25, 2021

* Support for [PostgreSQL major version 13](./concepts-supported-versions.md).
* Support for extensions including pg_partman, pg_cron, and pgaudit. See the [extensions page](./concepts-extensions.md) for versions supported with each major version.
* Several bug fixes, stability, and performance improvements.

## Release: April 26, 2021

* Support for [latest PostgreSQL minors](./concepts-supported-versions.md) 12.6 and 11.11 with new server creates.
* Support for Virtual Network (VNET) [private DNS zone](./concepts-networking.md#private-access-vnet-integration).
* Support to choose the Availability zone during Point-in-time recovery operation.
* Support for new [regions](./overview.md#azure-regions) including Australia East, Canada Central, and France Central.
* Support for [built-in PgBouncer](./concepts-pgbouncer.md) connection pooler. 
* Support for [pglogical](https://github.com/2ndQuadrant/pglogical) extension version 2.3.2.
* [Intelligent performance](concepts-query-store.md) in public preview.
* Several bug fixes, stability and performance improvements.

## Contacts

For any questions or suggestions you might have on Azure Database for PostgreSQL flexible server, send an email to the Azure Database for PostgreSQL Team ([@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). Please note that this email address is not a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).
  

## Next steps

Now that you've read an introduction to Azure Database for PostgreSQL flexible server deployment mode, you're ready to create your first server: [Create an Azure Database for PostgreSQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md)