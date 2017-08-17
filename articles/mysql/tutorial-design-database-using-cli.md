---
title: Design your first Azure Database for MySQL database - Azure CLI | Microsoft Docs
description: This tutorial explains how to create and manage Azure Database for MySQL server and database using Azure CLI 2.0 from the command line.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
ms.service: mysql-database
ms.devlang: azure-cli
ms.topic: article
ms.date: 06/13/2017
ms.custom: mvc
---

# Design your first Azure Database for MySQL database

Azure Database for MySQL is a relational database service in the Microsoft cloud based on MySQL Community Edition database engine. In this tutorial, you use Azure CLI (command-line interface) and other utilities to learn how to:

> [!div class="checklist"]
> * Create an Azure Database for MySQL
> * Configure the server firewall
> * Use [mysql command line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

You may use the Azure Cloud Shell in the browser, or [Install Azure CLI 2.0]( /cli/azure/install-azure-cli) on your own computer to run the code blocks in this tutorial.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

If you have multiple subscriptions, choose the appropriate subscription in which the resource exists or is billed for. Select a specific subscription ID under your account using [az account set](/cli/azure/account#set) command.
```azurecli-interactive
az account set --subscription 00000000-0000-0000-0000-000000000000
```

## Create a resource group
Create an [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) with [az group create](https://docs.microsoft.com/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named `mycliresource` in the `westus` location.

```azurecli-interactive
az group create --name mycliresource --location westus
```

## Create an Azure Database for MySQL server
Create an Azure Database for MySQL server with the az mysql server create command. A server can manage multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates an Azure Database for MySQL server located in `westus` in the resource group `mycliresource` with name `mycliserver`. The server has an administrator log in named `myadmin` and password `Password01!`. The server is created with **Basic** performance tier and **50** compute units shared between all the databases in the server. You can scale compute and storage up or down depending on the application needs.

```azurecli-interactive
az mysql server create --resource-group mycliresource --name mycliserver
--location westus --user myadmin --password Password01!
--performance-tier Basic --compute-units 50
```

## Configure firewall rule
Create an Azure Database for MySQL server-level firewall rule with the az mysql server firewall-rule create command. A server-level firewall rule allows an external application, such as **mysql** command-line tool or MySQL Workbench to connect to your server through the Azure MySQL service firewall. 

The following example creates a firewall rule for a predefined address range. This example shows the entire possible range of IP addresses.

```azurecli-interactive
az mysql server firewall-rule create --resource-group mycliresource --server mycliserver --name AllowYourIP --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

## Get the connection information

To connect to your server, you need to provide host information and access credentials.
```azurecli-interactive
az mysql server show --resource-group mycliresource --name mycliserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
```json
{
  "administratorLogin": "myadmin",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "mycliserver.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mycliresource/providers/Microsoft.DBforMySQL/servers/mycliserver",
  "location": "westus",
  "name": "mycliserver",
  "resourceGroup": "mycliresource",
  "sku": {
    "capacity": 50,
    "family": null,
    "name": "MYSQLS2M50",
    "size": null,
    "tier": "Basic"
  },
  "storageMb": 2048,
  "tags": null,
  "type": "Microsoft.DBforMySQL/servers",
  "userVisibleState": "Ready",
  "version": null
}
```

## Connect to the server using mysql
Use [mysql command line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to establish a connection to your Azure Database for MySQL server. In this example, the command is:
```cmd
mysql -h mycliserver.database.windows.net -u myadmin@mycliserver -p
```

## Create a blank database
Once you’re connected to the server, create a blank database.
```sql
mysql> CREATE DATABASE mysampledb;
```

At the prompt, run the following command to switch the connection to this newly created database:
```sql
mysql> USE mysampledb;
```

## Create tables in the database
Now that you know how to connect to the Azure Database for MySQL database, we can go over how to complete some basic tasks.

First, we can create a table and load it with some data. Let's create a table that stores inventory information.
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

## Load data into the tables
Now that we have a table, we can insert some data into it. At the open command prompt window, run the following query to insert some rows of data.
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

Now you have two rows of sample data into the table you created earlier.

## Query and update the data in the tables
Execute the following query to retrieve information from the database table.
```sql
SELECT * FROM inventory;
```

You can also update the data in the tables.
```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

The row gets updated accordingly when you retrieve data.
```sql
SELECT * FROM inventory;
```

## Restore a database to a previous point in time
Imagine you have accidentally deleted this table. This is something you cannot easily recover from. Azure Database for MySQL allows you to go back to any point in time in the last up to 35 days and restore this point in time to a new server. You can use this new server to recover your deleted data. The following steps restore the sample server to a point before the table was added.

For the Restore you need the following information:

- Restore point: Select a point-in-time that occurs before the server was changed. Must be greater than or equal to the source database's Oldest backup value.
- Target server: Provide a new server name you want to restore to
- Source server: Provide the name of the server you want to restore from
- Location: You cannot select the region, by default it is same as the source server

```azurecli-interactive
az mysql server restore --resource-group mycliresource --name mycliserver-restored --restore-point-in-time "2017-05-4 03:10" --source-server-name mycliserver
```

To restore the server and [restore to a point-in-time](./howto-restore-server-portal.md) before the table was deleted. Restoring a server to a different point in time creates a duplicate new server as the original server as of the point in time you specify, provided that it is within the retention period for your [service tier](./concepts-service-tiers.md).

## Next Steps
In this tutorial you learned to:
> [!div class="checklist"]
> * Create an Azure Database for MySQL
> * Configure the server firewall
> * Use [mysql command line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

> [!div class="nextstepaction"]
> [Azure Database for MySQL - Azure CLI samples](./sample-scripts-azure-cli.md)
