---
title: 'Design your first Azure Database for PostgreSQL using Azure CLI | Microsoft Docs'
description: This tutorial shows how to Design your first Azure Database for PostgreSQL using Azure CLI.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: postgresql-database
ms.custom: tutorial
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: tutorial
ms.date: 05/10/2017
---
# Design your first Azure Database for PostgreSQL
In this tutorial, you will use the Azure CLI to create a server with a server-level firewall. You will then use [**psql**](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility to create a database, table in the database, load data into that table, query the table, and update data in the table. Finally, you will use the service's automated backups to restore the database to an earlier point-in-time before you added this new table.

[!INCLUDE [sample-cli-install](../../includes/sample-cli-install.md)]

## Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.
```azurecli
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource exists or is billed for. Select a specific subscription ID under your account using [az account set](/cli/azure/account#set) command.
```azurecli
az account set --subscription 00000000-0000-0000-0000-000000000000
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli
az group create --name myresourcegroup --location westus
```

## Create an Azure PostgreSQL server

Create an [Azure PostgreSQL server](overview.md) using the **az postgres server create** command. A server contains a group of databases managed as a group. 

The following example creates a server called `mypgserver-20170401` in your resource group `myresourcegroup` with server admin login `mylogin`. Name of a server maps to DNS name and is thus required to be globally unique. Substitute the `<server_admin_password>` with your own value.
```azurecli
az postgres server create --resource-group myresourcegroup --name mypgserver-20170401  --location westus --admin-user mylogin@mypgserver-20170401 --admin-password <server_admin_password> --performance-tier Basic --compute-units 50 --version 9.6
```

> [!IMPORTANT]
> The server admin login and password that you specify here are required to log in to the server and its databases later in this quick start. Remember or record this information for later use.

By default, **postgres** database gets created under your server. The [postgres](https://www.postgresql.org/docs/9.6/static/app-initdb.html) database is a default database meant for use by users, utilities and third party applications. 


## Configure a server-level firewall rule

Create an Azure PostgreSQL server-level firewall rule with the **az postgres server firewall-rule create** command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. 

You can set a firewall rule that covers an IP range to be able to connect from your network. The following example uses **az postgres server firewall-rule create** to create a firewall rule `AllowAllIps` for an IP address range. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.
```azurecli
az postgres server firewall-rule create --resource-group myresourcegroup --server mypgserver-20170401 --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

> [!NOTE]
> Azure PostgreSQL server communicates over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 5432.
>

## Connect to Azure Database for PostgreSQL using psql 

If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) to connect to a Azure PostgreSQL server. Let’s now use the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility to connect to the Azure Database for PostgreSQL server. Connect to the default database called **postgres** on your PostgreSQL server **mypgserver-20170401.postgres.database.azure.com** using access credentials:
```azurecli
psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --password --dbname=postgres
```

## Create a New Database
Once you’re connected to the server, create a blank database to work with.
```bash
CREATE DATABASE mypgsqldb;
```

At the prompt, run the following command to switch connection to this newly created database:
```bash
\c mypgsqldb
```

## Create tables in the database
Now that you know how to connect to the Azure PostgreSQL database, we can go over how to complete some basic tasks.

First, we can create a table and load it with some data. Let's create a table that tracks inventory information.
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

You can see the newly created table in the list of tabvles now by typing:
```bash
\dt
```

## Load data into the tables
Now that we have a table, we can insert some data into it. At the open command prompt window, run the following query to insert some rows of data
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

You have now two rows of sample data into the table you created earlier.

## Query and update the data in the tables
Execute the following query to retrieve information from the database table. 
```sql
SELECT * FROM inventory;
```

You can also update the data in the tables
```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

The row gets updated accordingly when you retrieve data.
```sql
SELECT * FROM inventory;
```

## Restore a database to a previous point in time
Imagine you have accidentally deleted a table. This is something you cannot easily recover from. Azure Database for PostgreSQL allows you to go back to any point-in-time (in the last up to 7 days (Basic) and 35 days (Standard)) and restore this point-in-time to a new server. You can use this new server to recover your deleted data. The following steps restore the sample server to a point before the table was added.

For the Restore you’ll require the following information:
- Restore point: Select a point-in-time that occurs before the server was changed. Must be greater than or equal to the source database's Oldest backup value.
- Target server: Provide a new server name you want to restore to
- Source server: Provide the name of the server you want to restore from
- Location: You cannot select the region, by default it is same as the source server
- Pricing tier: You cannot change this value when restoring a server. It is same as the source server. 

```azurecli
az postgres server restore --resource-group myResourceGroup --name mypgserver-20170401-restored --restore-point-in-time "2017-04-13 03:10" --source-server-name mypgserver-20170401
```

To restore the server to [restore to a point-in-time](./howto-restore-server-portal.md) before the tables was deleted. Restoring a server to a different point in time creates a duplicate new server as the original server as of the point in time you specify, provided that it is within the retention period for your [service tier](./concepts-service-tiers.md).

## Next Steps
For Azure CLI samples for common tasks, see [Azure Database for PostgreSQL - Azure CLI samples](sample-scripts-azure-cli.md)
