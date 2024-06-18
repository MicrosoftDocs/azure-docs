---
title: 'Tutorial: Design an Azure Database for PostgreSQL - Single Server - Azure CLI'
description: This tutorial shows how to create, configure, and query your first Azure Database for PostgreSQL - Single Server using Azure CLI.
ms.service: postgresql
ms.subservice: single-server
ms.topic: tutorial
ms.author: sunila
author: sunilagarwal
ms.devlang: azurecli
ms.custom: mvc, devx-track-azurecli
ms.date: 06/24/2022
---

# Tutorial: Design an Azure Database for PostgreSQL - Single Server using Azure CLI

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

In this tutorial, you use Azure CLI (command-line interface) and other utilities to learn how to:
> [!div class="checklist"]
>
> * Create an Azure Database for PostgreSQL server
> * Configure the server firewall
> * Use [**psql**](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

## Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name.

Change the location as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment. Use the public IP address of the computer you're using to restrict access to the server to only your IP address.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="SetParameterValues":::

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateResourceGroup":::

## Create a server

Create a server with the [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) command.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateServer":::

> [!NOTE]
>
> * The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters. For more information, see [Azure Database for PostgreSQL Naming Rules](../../azure-resource-manager/management/resource-name-rules.md#microsoftdbforpostgresql).
> * The user name for the admin user can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
> * The password must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
> * For information about SKUs, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).

>[!IMPORTANT]
>
> * The default PostgreSQL version on your server is 9.6. To see all the versions supported, see [Supported PostgreSQL major versions](./concepts-supported-versions.md).
> * SSL is enabled by default on your server. For more information on SSL, see [Configure SSL connectivity](./concepts-ssl-connection-security.md).

## Configure a server-based firewall rule

Create a firewall rule with the [az postgres server firewall-rule create](./concepts-firewall-rules.md) command to give your local environment access to connect to the server.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateFirewallRule":::

> [!TIP]
> If you don't know your IP address, go to [WhatIsMyIPAddress.com](https://whatismyipaddress.com/) to get it.

> [!NOTE]
> To avoid connectivity issues, make sure your network's firewall allows port 5432. Azure Database for PostgreSQL servers use that port.

## List server-based firewall rules

To list the existing server firewall rules, run the [az postgres server firewall-rule list](/cli/azure/postgres/server/firewall-rule) command.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="ListFirewallRules":::

The output lists the firewall rules, if any, by default in JSON format. You may use the switch `--output table` for a more readable table format as the output.

## Get the connection information

To connect to your server, provide host information and access credentials.

```azurecli
az postgres server show --resource-group $resourceGroup --name $server
```

Make a note of the **administratorLogin** and **fullyQualifiedDomainName** values.

## Connect to the Azure Database for PostgreSQL server by using psql

The [psql](https://www.postgresql.org/docs/current/static/app-psql.html) client is a popular choice for connecting to PostgreSQL servers. You can connect to your server by using `psql` with [Azure Cloud Shell](../../cloud-shell/overview.md). You can also use `psql` on your local environment if you have it available. An empty database, **postgres**, is automatically created with a new PostgreSQL server. You can use that database to connect with `psql`, as shown in the following code.

```bash
psql --host=<server_name>.postgres.database.azure.com --port=5432 --username=<admin_user>@<server_name> --dbname=postgres
```

> [!TIP]
> If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username with `%40`. For example, the connection string for psql would be:
>
> ```bash
> psql postgresql://<admin_user>%40<server_name>@<server_name>.postgres.database.azure.com:5432/postgres
> ```

## Create a blank database

1. Once you are connected to the server, create a blank database at the prompt:

   ```sql
   CREATE DATABASE mypgsqldb;
   ```

1. At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**:

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

## Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az-vm-extension-set) command - unless you have an ongoing need for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

In this tutorial, you learned how to use Azure CLI (command-line interface) and other utilities to:
> [!div class="checklist"]
>
> * Create an Azure Database for PostgreSQL server
> * Configure the server firewall
> * Use the **psql** utility to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

> [!div class="nextstepaction"]
> [Design your first Azure Database for PostgreSQL using the Azure portal](tutorial-design-database-using-azure-portal.md)
