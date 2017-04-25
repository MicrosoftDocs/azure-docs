---
title: postgresql-howto-migrate-using-dump-and-restore | Microsoft Docs
description: Describes how to extract a PostgreSQL database into a dump file and restore the PostgreSQL database from an archive file created by pg\_dump.
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
You can use [pg\_dump](https://www.postgresql.org/docs/9.3/static/app-pgdump.html) to extract a PostgreSQL database into a dump file and [pg\_restore](https://www.postgresql.org/docs/9.3/static/app-pgrestore.html) to restore the PostgreSQL database from an archive file created by pg\_dump.

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](file:///D:/Orcas/Documentation/postgresql-server/update.me)
- [pg\_dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html) and [pg\_restore](https://www.postgresql.org/docs/9.6/static/app-pgrestore.html) command line utility installed
- [createdb](https://www.postgresql.org/docs/9.6/static/app-createdb.html) command line utility installed

Follow the below steps to backup and restore your PostgreSQL database.

## 1. Create a file using pg\_dump that contains the data to be loaded
To backup an existing PostgreSQL database on-prem or in a VM, run the following command:
```azurecli
pg\_dump -Fc -v –-host=<host> --username=<name>
--dbname=<database name> > **<database>**.dump
```
For e.g. if you have a local server and a database called **testdb** in it
```azurecli
pg\_dump -Fc -v –-host=localhost --username=masterlogin --dbname=testdb
> **testdb**.dump
```
## 2. Create a database on the target Azure PostgreSQL server
You must create a database on the target Azure PostgreSQL server where you want to migrate the data. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.
```azurecli
createdb –host=**<server name>** --port <port>
--username=<user@servername> --password **<new database
name>**
```
For the [Azure Database for PostgreSQL server](file:///D:/Orcas/Documentation/postgresql-server/update.me) we created, 
```azurecli
createdb –host=**mypgserver-20170401.postgres.database.azure.com**
--port 5432 --username=**mylogin@mypgserver** --password **newdb**
```
## 3. Restore the data into the target database using pg\_restore
Once you’ve created the target database, you can use the pg\_restore command and the -d, --dbname parameter to restore the data into the specific newly created database from the dump file.
```azurecli
pg\_restore -v –host=**<server name>** --port <port>
--username=<user@servername> --password --dbname=**<new
database name>** **<database>**.dump
```
In this example, we will restore the data to the newly created database **newdb** on target server **mypgserver-20170401.postgres.database.azure.com** from the dump file generated **testdb.dump**
```azurecli
pg\_restore -v –host=**mypgserver-20170401.postgres.database.azure.com**
--port 5432 --username= **mylogin@mypgserver** --password
--dbname=**newdb** **testdb**.dump
```
## Next steps
- To migrate a PostgreSQL database using import and export, see [How-to Export and Import data into Azure Database for PostgreSQL](howto-export-import/update.me).
- To create PostgreSQL server via Azure CLI, see [Create PostgreSQL server – CLI](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/create-server-cli/update.me).
- To connect and query using pgAdmin GUI tool, see [Connect and query with pgAdmin](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/pgadmin/update.me).
- To connect and query using psql command line utility, see [Connect and query with psql](https://microsoft.sharepoint.com/teams/orcasql/Shared%20Documents/Customer-Facing%20Documentation/Docs/PostgreSQL/psql/update.me).
