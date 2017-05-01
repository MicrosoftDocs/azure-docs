---
title: Migrate a database using Import and Export in Azure Database for PostgreSQL | Microsoft Docs
description: Describes how extract a PostgreSQL database into a script file and import the data into the target database from that file.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.topic: article
ms.date: 05/10/2017
---
# Migrate your PostgreSQL database using export and import
You can use [pg_dump](https://www.postgresql.org/docs/9.3/static/app-pgdump.html) to extract a PostgreSQL database into a script file and [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) to import the data into the target database from that file.

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md)
- [pg_dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html) command line utility installed
- [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility installed

Follow these steps to export and import your PostgreSQL database:
## 1. Create a file using pg_dump that contains the data to be loaded
To export your existing PostgreSQL database on-prem or in a VM to a sql script file, run the following command:
```dos
pg_dump -Fc -v –-host=<host> --username=<name> --dbname=<database name> > <filename>.sql
```
For example, if you have a local server and a database called **testdb** in it
```dos
pg_dump -Fc -v –-host=localhost --username=masterlogin --dbname=testdb > testdb.sql
```
## 2. Create a new database and load the data on target Azure PostgreSQL server
You can use the psql command line and the -d, --dbname parameter to import the data into the specific new database we create and the data we load from the sql file.
```dos
psql -f <filename>.sql –host=<server name> --port <port> --username=<user@servername> --password --dbname=<new database name>
```
In this example, we will use psql and script file named **testdb.sql** from previous step to create database **newdb** on target server **mypgserver-20170401.postgres.database.azure.com**.
```dos
psql -f testdb.sql –host=mypgserver-20170401.postgres.database.azure.com --port 5432 --username=mylogin@mypgserver --password --dbname=newdb
```
## Next steps
- To migrate a PostgreSQL database using dump and restore, see [Migrate your PostgreSQL database using dump and restore](howto-migrate-using-dump-and-restore.md)