---
title: postgresql-howto-migrate-using-export-and-import | Microsoft Docs
description: Describes how extract a PostgreSQL database into a script file and import the data into the target database from that file.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Migrate your PostgreSQL database using dump and restore
You can use [pg\_dump](https://www.postgresql.org/docs/9.3/static/app-pgdump.html) to extract a PostgreSQL database into a script file and [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) to import the data into the target database from that file.

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](file:///D:/Orcas/Documentation/postgresql-server/update.me)
- [pg\_dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html) command line utility installed
- [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility installed

Follow the below steps to export and import your PostgreSQL database.

## 1. Create a file using pg\_dump that contains the data to be loaded
To export your existing PostgreSQL database on-prem or in a VM to a sql script file, run the following command:
```azurecli
pg\_dump -Fc -v –-host=<host> --username=<name>
--dbname=<database name> > **<database>**.sql
```
For e.g. if you have a local server and a database called **testdb** in it
```azurecli
pg\_dump -Fc -v –-host=localhost --username=masterlogin --dbname=testdb
> **testdb**.sql
```

## 2. Create a new database and load the data on target Azure PostgreSQL server
You can use the psql command line and the -d, --dbname parameter to import the data into the specific new database we create and the data we load from the sql file.
```sql
psql -f **<database>**.sql –host=**<server name>** --port
<port> --username=<user@servername> --password
--dbname=**<new database name>**
```
In this example, we will use psql and script file named **testdb.sql** from previous step to create database **newdb** on target server **mypgserver-20170401.postgres.database.azure.com**.
```sql
psql -f **testdb.sql**
–host=**mypgserver-20170401.postgres.database.azure.com** --port 5432
--username= **mylogin@mypgserver** --password --dbname=**newdb**
```

## Next steps
- To migrate a PostgreSQL database using import and export, see [How-to Dump and Restore data into Azure Database for PostgreSQL](howto-dump-restore/update.me).
- To create PostgreSQL server via Azure CLI, see [Create PostgreSQL server – CLI](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/create-server-cli/update.me).
- To connect and query using pgAdmin GUI tool, see [Connect and query with pgAdmin](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/pgadmin/update.me).
- To connect and query using psql command line utility, see [Connect and query with psql](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/psql/update.me).
