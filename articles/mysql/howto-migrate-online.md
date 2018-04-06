---
title: Minimal-downtime migration to Azure Database for MySQL
description: This article describes how to perform a minimal-downtime migration of a MySQL database to Azure Database for MySQL and how to set up initial load and continuous data sync from the source database to the target database by using Attunity Replicate for Microsoft Migrations.
services: mysql
author: HJToland3
ms.author: jtoland
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 02/28/2018
---

# Minimal-downtime migration to Azure Database for MySQL
You can migrate your existing MySQL database to Azure Database for MySQL by using Attunity Replicate for Microsoft Migrations. Attunity Replicate is a joint offering from Attunity and Microsoft. Along with Azure Database Migration Service, it is included at no additional cost to Microsoft customers. 

Attunity Replicate helps minimize downtime during database migrations, and it keeps the source database operational throughout the process.

Attunity Replicate is a data replication tool that enables data sync between a variety of sources and targets. It propagates the schema creation script and data associated with each database table. Attunity Replicate does not propagate any other artifacts (such as SP, triggers, functions, and so on) or convert, for example, the PL/SQL code that's hosted in such artifacts to T-SQL.

> [!NOTE]
> Although Attunity Replicate supports a broad set of migration scenarios, it focuses on support for a specific subset of source/target pairs.

An overview of the process for performing a minimal-downtime migration includes:

* **Migrating the MySQL source schema** to an Azure Database for MySQL managed database service by using [MySQL Workbench](https://www.mysql.com/products/workbench/).

* **Setting up initial load and continuous data sync from the source database to the target database** by using Attunity Replicate for Microsoft Migrations. Doing so minimizes the time that the source database must be set as read-only as you prepare to switch your applications to the target MySQL database on Azure.

For more information about the Attunity Replicate for Microsoft Migrations offering, see the following resources:
 - Go to the [Attunity Replicate for Microsoft Migrations](https://aka.ms/attunity-replicate) webpage.
 - Download [Attunity Replicate for Microsoft Migrations](http://discover.attunity.com/download-replicate-microsoft-lp6657.html).
 - Go to the [Attunity Replicate Community](https://aka.ms/attunity-community) for a Quick Start Guide, tutorials, and support.
 - For step-by-step guidance on using Attunity Replicate to migrate your MySQL database to Azure Database for MySQL, see the [Database Migration Guide](https://datamigration.microsoft.com/scenario/mysql-to-azuremysql).