---
title: Online migration to Azure Database for PostgreSQL | Microsoft Docs
description: Describes how to perform an online migration by extracting a PostgreSQL database into a dump file, restoring the PostgreSQL database from an archive file created by pg_dump in Azure Database for PostgreSQL, and setting up initial load and continuous data sync from the source database to the target database by using Attunity Replicate for Microsoft Migrations.
services: postgresql
author: HJToland3
ms.author: jtoland
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 1/03/2018
---

# Online migration to Azure Database for PostgreSQL
You can migrate your existing PostgreSQL database to Azure Database for PostgreSQL by using Attunity Replicate for Microsoft Migrations, a co-sponsored, joint offering from Attunity and Microsoft that is provided along with the Azure Database Migration Service at no additional cost to Microsoft customers. Attunity Replicate for Microsoft Migrations also enables minimum downtime in database migration, and the source database continues to be operational during the migration process.

Attunity Replicate is a data replication tool that enables data sync between a variety of sources and targets, propagating the schema creation script and data associated with each database table. Attunity Replicate does not propagate any other artifacts (such as SP, triggers, functions, etc.) or convert, for example, PL/SQL code hosted in such artifacts, to T-SQL.

> [!NOTE]
> While Attunity Replicate supports a broad set of migration scenarios, Attunity Replicate for Microsoft Migrations is focused on support for a specific a subset of source/target pairs.

An overview of the process for performing an online migration includes:

1. **Migrate the PostgreSQL source schema** to Azure Database for PostgreSQL by using [pg_dump](https://www.postgresql.org/docs/9.3/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/9.3/static/app-pgrestore.html) with the -n parameter.

2. **Set up initial load and continuous data sync from the source database to the target database** by using Attunity Replicate for Microsoft Migrations. Doing so minimizes the time that the source database needs to be set as read-only while you prepare to switch your applications to the target PostgreSQL database on Azure.

For more information about the Attunity Replicate for Microsoft Migrations offering, view the following resources:
 - The Attunity Replicate for Microsoft Migrations [web page](https://aka.ms/attunity-replicate).
 - [Download](http://discover.attunity.com/download-replicate-microsoft-lp6657.html) Attunity Replicate for Microsoft Migrations.
 - For step-by-step guidance on using Attunity to migrate from PostgreSQL to Azure Database for PostgreSQL, refer to the [Database Migration Guide](https://datamigration.microsoft.com/scenario/postgresql-to-azurepostgresql).