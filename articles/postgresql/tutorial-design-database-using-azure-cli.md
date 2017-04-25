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

## Step 1 - Log in to the Azure portal
Log in to your Azure subscription with the **az login** command and follow the on-screen directions.
```azurecli
az login
```

## Step 2 - Create an Azure PostgreSQL server
An Azure PostgreSQL server is created with a defined set of [compute and storage resources](./placeholder.md). The server is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

### Create a resource group
Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named **myResourceGroup** in the **westus** location.
```azurecli
az group create --name myResourceGroup --location westus
```

### Create a new PostgreSQL server
Create an Azure PostgreSQL server with the [**az postgres server create**](./placeholder.md) command. A running PostgreSQL server can manage many databases. Typically, a separate database is used for each project or for each user.

The following example creates a randomly named PostgreSQL server located in **westus** in the resource group **myResourceGroup**. The server has an administrator login named **ServerAdmin** and password **ChangeYourAdminPassword1**. The server is created with the **Basic** performance tier and **50 compute units** shared between all the databases in the server. You can scale compute and storage up or down depending on your application’s needs.

Replace these pre-defined values as desired.
```azurecli
az postgres server create --resource-group myResourceGroup --name mypgserver-20170401 --location westus --user ServerAdmin --password ChangeYourAdminPassword1 --performance-tier Basic --compute-units 50
```

It takes a few minutes to create a new Azure PostgreSQL server, with a default database 'postgres' under it.

## Step 3 - Create a server-level firewall rule
Create an Azure PostgreSQL server-level firewall rule with the [**az postgres server firewall-rule create**](./placeholder.md) command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, is the entire possible range of IP addresses.

Replace these predefined values with the values for your external IP address or IP address range.

```azurecli
az postgres server firewall-rule create --resource-group myResourceGroup --server $servername --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

## Step 4 - Connect to Azure Database for PostgreSQL using psql 
When we created our PostgreSQL server, the default 'postgres' database also gets created. Let’s now use the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility to connect to the Azure Database for PostgreSQL server. Connect to the default database called **postgres** on your PostgreSQL server **mypgserver-20170401.postgres.database.azure.com** using access credentials:
```azurecli
psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --password --dbname=postgres
```

## Step 5 - Create a New Database
Once you’re connected to the server, create a blank database to work with.
```sql
postgres=> CREATE DATABASE mypgsqldb;
```

At the prompt, run the following command to switch connection to this newly created database:
```sql
postgres=> \c mypgsqldb
```

## Step 6 - Create tables in the database
Now that you know how to connect to the Azure PostgreSQL database, we can go over how to complete some basic tasks.
First, we can create a table and load it with some data. Let's create a table that describes playground equipment.
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

You can see the new table by typing:
```sql
mypgsqldb=> \d
```

## Step 7 - Load data into the tables
Now that we have a table, we can insert some data into it. At the open command prompt window, run the following query to insert some rows of data
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

You have now two rows of sample data into the table you created earlier.

## Step 8 - Query and update the data in the tables
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

## Step 9 - Restore a database to a previous point in time
Imagine you have accidentally deleted a table. This is something you cannot easily recover from. Azure Database for PostgreSQL allows you to go back to any point in time in the last up to 35 days and restore this point in time to a new server. You can use this new server to recover your deleted data. The following steps restore the sample server to a point before the table was added.

For the Restore you’ll require the following information:
- Restore point: Select a point-in-time that occurs before the server was changed. Must be greater than or equal to the source database's Oldest backup value.
- Target server: Provide a new server name you want to restore to
- Source server: Provide the name of the server you want to restore from
- Location: You cannot select the region, by default it is same as the source server
- Pricing tier: You cannot change this value when restoring a server. It is same as the source server. 

```azurecli
az postgres server restore --resource-group myResourceGroup --name mypgserver-20170401-restored --restore-point-in-time "2017-04-13 03:10" --source-server-name mypgserver-20170401
```

To restore the server to [restore to a point in time](./howto-restore-server-portal.md) before the tables was deleted. Restoring a server to a different point in time creates a duplicate new server as the original server as of the point in time you specify, provided that it is within the retention period for your [service tier](./concepts-service-tiers.md).

## Next Steps
For Azure CLI samples for common tasks, see [Azure Database for PostgreSQL - Azure CLI samples](sample-scripts-azure-cli.md)
