---
title: 'Quickstart: Create server - Azure CLI - Azure Database for PostgreSQL - single server'
description: In this quickstart guide, you'll create an Azure Database for PostgreSQL server by using the Azure CLI.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/25/2020
ms.custom: mvc, devx-track-azurecli
---
# Quickstart: Create an Azure Database for PostgreSQL server by using the Azure CLI

This quickstart shows how to use [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create a single Azure Database for PostgreSQL server in five minutes. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

    > [!TIP]
    >  Consider using the simpler [az postgres up](/cli/azure/postgres#az_postgres_up) Azure CLI command that's currently in preview. Try out the [quickstart](./quickstart-create-server-up-azure-cli.md).

- Select the specific subscription ID under your account by using the  [az account set](/cli/azure/account) command.

    - Make a note of the **id** value from the **az login** output to use as the value for the **subscription** argument in the command. 

        ```azurecli
        az account set --subscription <subscription id>
        ```

    - If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscriptions, use [az account list](/cli/azure/account#az_account_list).

## Create an Azure Database for PostgreSQL server

Create an [Azure resource group](../azure-resource-manager/management/overview.md) by using the [az group create](/cli/azure/group#az_group_create) command, and then create your PostgreSQL server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create an [Azure Database for PostgreSQL server](overview.md) by using the [az postgres server create](/cli/azure/postgres/server) command. A server can contain multiple databases.

```azurecli-interactive
az postgres server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 
```
Here are the details for the preceding arguments: 

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Unique name that identifies your Azure Database for PostgreSQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters. For more information, see [Azure Database for PostgreSQL Naming Rules](../azure-resource-manager/management/resource-name-rules.md#microsoftdbforpostgresql).
resource-group | myresourcegroup | Name of the Azure resource group.
location | westus | Azure location for the server.
admin-user | myadmin | Username for the administrator login. It can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
sku-name|GP_Gen5_2| Name of the pricing tier and compute configuration. Follow the convention {pricing tier}_{compute generation}_{vCores} in shorthand. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).

>[!IMPORTANT] 
>- The default PostgreSQL version on your server is 9.6. To see all the versions supported, see [Supported PostgreSQL major versions](./concepts-supported-versions.md).
>- To view all the arguments for **az postgres server create** command, see [this reference document](/cli/azure/postgres/server#az_postgres_server_create).
>- SSL is enabled by default on your server. For more information on SSL, see [Configure SSL connectivity](./concepts-ssl-connection-security.md).

## Configure a server-level firewall rule 
By default, the server that you created is not publicly accessible and is protected with firewall rules. You can configure the firewall rules on your server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your local environment access to connect to the server. 

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Replace the IP address or range of IP addresses that corresponds to where you'll be connecting from. If you don't know your IP address, go to [WhatIsMyIPAddress.com](https://whatismyipaddress.com/) to get it.


```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

> [!NOTE]
> To avoid connectivity issues, make sure your network's firewall allows port 5432. Azure Database for PostgreSQL servers use that port. 

## Get the connection information

To connect to your server, provide host information and access credentials.

```azurecli-interactive
az postgres server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **administratorLogin** and **fullyQualifiedDomainName** values.

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

## Connect to the Azure Database for PostgreSQL server by using psql
The [psql](https://www.postgresql.org/docs/current/static/app-psql.html) client is a popular choice for connecting to PostgreSQL servers. You can connect to your server by using psql with [Azure Cloud Shell](../cloud-shell/overview.md). You can also use psql on your local environment if you have it available. An empty database, **postgres**, is automatically created with a new PostgreSQL server. You can use that database to connect with psql, as shown in the following code. 

   ```bash
 psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
   ```

> [!TIP]
> If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username with `%40`. For example, the connection string for psql would be:
>
> ```
> psql postgresql://myadmin%40mydemoserver@mydemoserver.postgres.database.azure.com:5432/postgres
> ```


## Clean up resources
If you don't need these resources for another quickstart or tutorial, you can delete them by running the following command. 

```azurecli-interactive
az group delete --name myresourcegroup
```

If you just want to delete the one newly created server, you can run the [az postgres server delete](/cli/azure/postgres/server) command.

```azurecli-interactive
az postgres server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using export and import](./howto-migrate-using-export-and-import.md)
