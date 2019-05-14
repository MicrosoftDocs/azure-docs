---
title: 'Tutorial: Design an Azure Database for MySQL using Azure CLI'
description: This tutorial explains how to create and manage Azure Database for MySQL server and database using Azure CLI from the command line.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 04/29/2019
ms.custom: mvc
---

# Tutorial: Design an Azure Database for MySQL using Azure CLI

Azure Database for MySQL is a relational database service in the Microsoft cloud based on MySQL Community Edition database engine. In this tutorial, you use Azure CLI (command-line interface) and other utilities to learn how to:

> [!div class="checklist"]
> * Create an Azure Database for MySQL
> * Configure the server firewall
> * Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

You may use the Azure Cloud Shell in the browser, or [Install Azure CLI]( /cli/azure/install-azure-cli) on your own computer to run the code blocks in this tutorial.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

If you have multiple subscriptions, choose the appropriate subscription in which the resource exists or is billed for. Select a specific subscription ID under your account using [az account set](/cli/azure/account#az-account-set) command.
```azurecli-interactive
az account set --subscription 00000000-0000-0000-0000-000000000000
```

## Create a resource group
Create an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) with [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

## Create an Azure Database for MySQL server
Create an Azure Database for MySQL server with the az mysql server create command. A server can manage multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates an Azure Database for MySQL server located in `westus` in the resource group `myresourcegroup` with name `mydemoserver`. The server has an administrator user named `myadmin`. It is a General Purpose, Gen 5 server with 2 vCores. Substitute the `<server_admin_password>` with your own value.

```azurecli-interactive
az mysql server create --resource-group myresourcegroup --name mydemoserver --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 --version 5.7
```
The sku-name parameter value follows the convention {pricing tier}\_{compute generation}\_{vCores} as in the examples below:
+ `--sku-name B_Gen5_2` maps to Basic, Gen 5, and 2 vCores.
+ `--sku-name GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
+ `--sku-name MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

Please see the [pricing tiers](./concepts-pricing-tiers.md) documentation to understand the valid values per region and per tier.

> [!IMPORTANT]
> The server admin login and password that you specify here are required to log in to the server and its databases later in this quickstart. Remember or record this information for later use.


## Configure firewall rule
Create an Azure Database for MySQL server-level firewall rule with the az mysql server firewall-rule create command. A server-level firewall rule allows an external application, such as **mysql** command-line tool or MySQL Workbench to connect to your server through the Azure MySQL service firewall. 

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Substitute in the IP address or range of IP addresses that correspond to where you'll be connecting from. 

```azurecli-interactive
az mysql server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

## Get the connection information

To connect to your server, you need to provide host information and access credentials.
```azurecli-interactive
az mysql server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
```json
{
  "administratorLogin": "myadmin",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "mydemoserver.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMySQL/servers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
 "sku": {
    "capacity": 2,
    "family": "Gen5",
    "name": "GP_Gen5_2",
    "size": null,
    "tier": "GeneralPurpose"
  },
  "sslEnforcement": "Enabled",
  "storageProfile": {
    "backupRetentionDays": 7,
    "geoRedundantBackup": "Disabled",
    "storageMb": 5120
  },
  "tags": null,
  "type": "Microsoft.DBforMySQL/servers",
  "userVisibleState": "Ready",
  "version": "5.7"
}
```

## Connect to the server using mysql
Use the [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to establish a connection to your Azure Database for MySQL server. In this example, the command is:
```cmd
mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
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
Now that you know how to connect to the Azure Database for MySQL database, complete some basic tasks.

First, create a table and load it with some data. Let's create a table that stores inventory information.
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

## Load data into the tables
Now that you have a table, insert some data into it. At the open command prompt window, run the following query to insert some rows of data.
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

For the restore, you need the following information:

- Restore point: Select a point-in-time that occurs before the server was changed. Must be greater than or equal to the source database's Oldest backup value.
- Target server: Provide a new server name you want to restore to
- Source server: Provide the name of the server you want to restore from
- Location: You cannot select the region, by default it is same as the source server

```azurecli-interactive
az mysql server restore --resource-group myresourcegroup --name mydemoserver-restored --restore-point-in-time "2017-05-4 03:10" --source-server-name mydemoserver
```

The `az mysql server restore` command needs the following parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group in which the source server exists.  |
| name | mydemoserver-restored | The name of the new server that is created by the restore command. |
| restore-point-in-time | 2017-04-13T13:59:00Z | Select a point-in-time to restore to. This date and time must be within the source server's backup retention period. Use ISO8601 date and time format. For example, you may use your own local timezone, such as `2017-04-13T05:59:00-08:00`, or use UTC Zulu format `2017-04-13T13:59:00Z`. |
| source-server | mydemoserver | The name or ID of the source server to restore from. |

Restoring a server to a point-in-time creates a new server, copied as the original server as of the point in time you specify. The location and pricing tier values for the restored server are the same as the source server.

The command is synchronous, and will return after the server is restored. Once the restore finishes, locate the new server that was created. Verify the data was restored as expected.

## Next steps
In this tutorial you learned to:
> [!div class="checklist"]
> * Create an Azure Database for MySQL server
> * Configure the server firewall
> * Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

> [!div class="nextstepaction"]
> [Azure Database for MySQL - Azure CLI samples](./sample-scripts-azure-cli.md)
