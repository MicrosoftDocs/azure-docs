---
title: Azure Database for PostgreSQL - Flexible Server API Release notes
description: API Release notes of Azure Database for PostgreSQL - Flexible Server.
author: arianapadilla
ms.author: arianap
ms.custom: references_regions, build-2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.date: 06/06/2023
---

# API Release notes - Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This page provides latest news and updates regarding the recommended API versions to be used. **The API versions that are not listed here might be supported, but will be retired soon.** The documentation for the latest Stable API version is available [here](/rest/api/postgresql/).

## API Releases

> [!NOTE]
> Every Stable and Preview API version is cummulative. This means that it includes the previous features in addition to the features included under the Comments column.

| API Version | Stable/Preview | Comments |
| --- | --- | --- |
| 2023-03-01-preview | Preview | New GA version features (2022-12-01) +<br>Geo + CMK<br>Storage auto growth<br>IOPS scaling<br>New location capability api<br>Azure Defender<br>Server Logs<br>Migrations<br> |
| [2022-12-01](/rest/api/postgresql/) | Stable (GA) | Earlier GA features +<br>AAD<br>CMK<br>Backups<br>Administrators<br>Replicas<br>GeoRestore<br>MVU<br> |
| 2022-05-01-preview | Preview | CheckMigrationNameAvailability<br>Migrations<br> |
| 2021-06-01 | Stable (GA) | Earlier GA features +<br>Server CRUD<br>CheckNameAvailability<br>Configurations (Server parameters)<br>Database<br>Firewall rules<br>Private<br>DNS zone suffix<br>PITR<br>Server Restart<br>Server Start<br>Server Stop<br>Maintenance window<br>Virtual network subnet usage<br> |


## Contacts

For any questions or suggestions you might have on Azure Database for PostgreSQL flexible server, send an email to the Azure Database for PostgreSQL Team ([@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). Please note that this email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).

## Next steps

Now that you've read our API Release Notes on Azure Database for PostgreSQL flexible server, you're ready to create your first server: [Create an Azure Database for PostgreSQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md)
