---
title: 'Tutorial: Design an Azure Database for PostgreSQL - Single Server - Azure CLI'
description: This tutorial shows how to create, configure, and query your first Azure Database for PostgreSQL - Single Server using Azure CLI.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: mvc
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 06/25/2019
---

# Tutorial: Design an Azure Database for PostgreSQL - Single Server using Azure CLI 
In this tutorial, you use Azure CLI (command-line interface) and other utilities to learn how to:
> [!div class="checklist"]
> * Create an Azure Database for PostgreSQL server
> * Configure the server firewall
> * Use [**psql**](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

You may use the Azure Cloud Shell in the browser, or [install Azure CLI]( /cli/azure/install-azure-cli) on your own computer to run the commands in this tutorial.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

If you have multiple subscriptions, choose the appropriate subscription in which the resource exists or is billed for. Select a specific subscription ID under your account using [az account set](/cli/azure/account) command.
```azurecli-interactive
az account set --subscription 00000000-0000-0000-0000-000000000000
```

## Create a resource group
Create an [Azure resource group](../azure-resource-manager/management/overview.md) using the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli-interactive
az group create --name myresourcegroup --location westus
```

## Create an Azure Database for PostgreSQL server
Create an [Azure Database for PostgreSQL server](overview.md) using the [az postgres server create](/cli/azure/postgres/server) command. A server contains a group of databases managed as a group. 

The following example creates a server called `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. The name of a server maps to DNS name and is thus required to be globally unique in Azure. Substitute the `<server_admin_password>` with your own value. It is a General Purpose, Gen 5 server with 2 vCores.
```azurecli-interactive
az postgres server create --resource-group myresourcegroup --name mydemoserver --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 --version 9.6
```
The sku-name parameter value follows the convention {pricing tier}\_{compute generation}\_{vCores} as in the examples below:
+ `--sku-name B_Gen5_2` maps to Basic, Gen 5, and 2 vCores.
+ `--sku-name GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
+ `--sku-name MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

Please see the [pricing tiers](./concepts-pricing-tiers.md) documentation to understand the valid values per region and per tier.

> [!IMPORTANT]
> The server admin login and password that you specify here are required to log in to the server and its databases later in this quickstart. Remember or record this information for later use.

By default, **postgres** database gets created under your server. The [postgres](https://www.postgresql.org/docs/9.6/static/app-initdb.html) database is a default database meant for use by users, utilities, and third-party applications. 


## Configure a server-level firewall rule

Create an Azure PostgreSQL server-level firewall rule with the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. 

You can set a firewall rule that covers an IP range to be able to connect from your network. The following example uses [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) to create a firewall rule `AllowMyIP` that allows connection from a single IP address.

```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

To restrict access to your Azure PostgreSQL server to only your network, you can set the firewall rule to only cover your corporate network IP address range.

> [!NOTE]
> Azure PostgreSQL server communicates over port 5432. When connecting from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. Have your IT department open port 5432 to connect to your Azure SQL Database server.
>

## Get the connection information

To connect to your server, you need to provide host information and access credentials.
```azurecli-interactive
az postgres server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **administratorLogin** and **fullyQualifiedDomainName**.
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.postgres.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforPostgreSQL/servers/mydemoserver",
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
  "type": "Microsoft.DBforPostgreSQL/servers",
  "userVisibleState": "Ready",
  "version": "9.6"

}
```

## Connect to Azure Database for PostgreSQL database using psql
If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html), or the Azure Cloud Console to connect to an Azure PostgreSQL server. Let's now use the psql command-line utility to connect to the Azure Database for PostgreSQL server.

1. Run the following psql command to connect to an Azure Database for PostgreSQL database:
   ```
   psql --host=<servername> --port=<port> --username=<user@servername> --dbname=<dbname>
   ```

   For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter the `<server_admin_password>` you chose when prompted for password.
  
   ```
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
   ```

   > [!TIP]
   > If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username with `%40`. For example the connection string for psql would be,
   > ```
   > psql postgresql://myadmin%40mydemoserver@mydemoserver.postgres.database.azure.com:5432/postgres
   > ```

2. Once you are connected to the server, create a blank database at the prompt:
   ```sql
   CREATE DATABASE mypgsqldb;
   ```

3. At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**:
   ```sql
   \c mypgsqldb
   ```

## Create tables in the database
Now that you know how to connect to the Azure Database for PostgreSQL, you can complete some basic tasks:

First, create a table and load it with some data. For example, create a table that tracks inventory information:
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

You can see the newly created table in the list of tables now by typing:
```sql
\dt
```

## Load data into the table
Now that there is a table created, insert some data into it. At the open command prompt window, run the following query to insert some rows of data:
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

You have now added two rows of sample data into the table you created earlier.

## Query and update the data in the tables
Execute the following query to retrieve information from the inventory table: 
```sql
SELECT * FROM inventory;
```

You can also update the data in the inventory table:
```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

You can see the updated values when you retrieve the data:
```sql
SELECT * FROM inventory;
```

## Restore a database to a previous point in time
Imagine you have accidentally deleted a table. This is something you cannot easily recover from. Azure Database for PostgreSQL allows you to go back to any point-in-time for which your server has backups (determined by the backup retention period you configured) and restore this point-in-time to a new server. You can use this new server to recover your deleted data. 

The following command restores the sample server to a point before the table was added:
```azurecli-interactive
az postgres server restore --resource-group myresourcegroup --name mydemoserver-restored --restore-point-in-time 2017-04-13T13:59:00Z --source-server mydemoserver
```

The `az postgres server restore` command needs the following parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group in which the source server exists.  |
| name | mydemoserver-restored | The name of the new server that is created by the restore command. |
| restore-point-in-time | 2017-04-13T13:59:00Z | Select a point-in-time to restore to. This date and time must be within the source server's backup retention period. Use ISO8601 date and time format. For example, you may use your own local timezone, such as `2017-04-13T05:59:00-08:00`, or use UTC Zulu format `2017-04-13T13:59:00Z`. |
| source-server | mydemoserver | The name or ID of the source server to restore from. |

Restoring a server to a point-in-time creates a new server, copied as the original server as of the point in time you specify. The location and pricing tier values for the restored server are the same as the source server.

The command is synchronous, and will return after the server is restored. Once the restore finishes, locate the new server that was created. Verify the data was restored as expected.


## Next steps
In this tutorial, you learned how to use Azure CLI (command-line interface) and other utilities to:
> [!div class="checklist"]
> * Create an Azure Database for PostgreSQL server
> * Configure the server firewall
> * Use [**psql**](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

Next, learn how to use the Azure portal to do similar tasks, review this tutorial: [Design your first Azure Database for PostgreSQL using the Azure portal](tutorial-design-database-using-azure-portal.md)
