---
title: 'Quickstart: Create server - Azure CLI - Azure Database for PostgreSQL - Single Server'
description: Quickstart guide to create an Azure Database for PostgreSQL - Single Server using Azure CLI (command line interface).
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/25/2020
ms.custom: mvc, devx-track-azurecli
---
# Quickstart: Create an Azure Database for PostgreSQL - Single Server using the Azure CLI

> [!TIP]
> Consider using the simpler [az postgres up](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-up) Azure CLI command (currently in preview). Try out the [quickstart](./quickstart-create-server-up-azure-cli.md).

This quickstart shows how to use [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for PostgreSQL server in five minutes.  If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

>[!Note]
>If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). 

## Prerequisites
This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property  which refers to **Subscription ID** for your Azure account. 

```azurecli-interactive
az login
```

Select the specific subscription ID under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli
az account set --subscription <subscription id>
```
## Create an Azure Database for PostgreSQL server

Create an [Azure resource group](../azure-resource-manager/management/overview.md) using the [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create) command and then create your PostgreSQL server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create an [Azure Database for PostgreSQL server](overview.md) using the [az postgres server create](/cli/azure/postgres/server) command. A server can contain multiple databases.

```azurecli-interactive
az postgres server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 
```
Here are the details for arguments above: 

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Choose a unique name that identifies your Azure Database for PostgreSQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
location | westus | The Azure location for the server.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. For more information, see [Azure Database for PostgreSQL](https://azure.microsoft.com/pricing/details/postgresql/server/).

>[!IMPORTANT] 
>- The default PostgreSQL version on your server is 9.6. See all our versions supported [here](https://docs.microsoft.com/azure/postgresql/concepts-supported-versions).
>- To view all the arguments for **az postgres server create** command, see this [reference document](https://docs.microsoft.com/cli/azure/postgres/server?view=azure-cli-latest#az-postgres-server-create)
>- SSL is enabled by default on your server. For more infroamtion on SSL, see [Configure SSL connectivity](./concepts-ssl-connection-security.md)

## Configure a server-level firewall rule 
By default the server created is not publicly accessible and protected with firewall rules. You can configure the firewall rule on your server using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your local environment access to connect to the server. 

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Replace the IP address or range of IP addresses that correspond to where you'll be connecting from.  If you don't know how to look for your IP, go to [https://whatismyipaddress.com/](https://whatismyipaddress.com/) to get your IP address.


```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

> [!NOTE]
>  Please make sure your network's firewall allows the port 5432 which is used by Azure Database for PostgreSQL servers in order to avoid connectivity issues. 

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

## Connect to Azure Database for PostgreSQL server using psql
[**psql**](https://www.postgresql.org/docs/current/static/app-psql.html) is popular client used to connect to PostgreSQL servers. You can connect to your server using **psql** with [Azure Cloud Shell](../cloud-shell/overview.md). Alternatively, you can use psql on your local environment if you have it available. An empty database, 'postgres' is already created with your new PostgreSQL server that you can use to connect with psql as shown below 

   ```bash
 psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
   ```

   > [!TIP]
   > If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username with `%40`. For example the connection string for psql would be,
   > ```
   > psql postgresql://myadmin%40mydemoserver@mydemoserver.postgres.database.azure.com:5432/postgres
   > ```


## Clean up resources
If you don't need these resources for another quickstart/tutorial, you can delete them by running the following command: 

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run [az postgres server delete](/cli/azure/postgres/server) command.
```azurecli-interactive
az postgres server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
> 
> [Deploy a Django web app with PostgreSQL](../app-service/containers/tutorial-python-postgresql-app.md)
>
> [Connect with Node.JS app](./connect-nodejs.md)

