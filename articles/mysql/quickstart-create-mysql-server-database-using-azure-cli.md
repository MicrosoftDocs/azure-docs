---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for MySQL'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL server in an Azure resource group.
author: savjani
ms.author: pariks
ms.service: mysql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 07/15/2020
ms.custom: mvc, devx-track-azurecli
---

# Quickstart: Create an Azure Database for MySQL server using Azure CLI

> [!TIP]
> Consider using the simpler [az mysql up](/cli/azure/ext/db-up/mysql#ext-db-up-az-mysql-up) Azure CLI command (currently in preview). Try out the [quickstart](./quickstart-create-server-up-azure-cli.md).

This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for MySQL server in five minutes. 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

 - Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az_account_list).

   ```azurecli
   az account set --subscription <subscription id>
   ```

## Create an Azure Database for MySQL server
Create an [Azure resource group](../azure-resource-manager/management/overview.md) using the [az group create](/cli/azure/group) command and then create your MySQL server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create an Azure Database for MySQL server with the [az mysql server create](/cli/azure/mysql/server#az_mysql_server_create) command. A server can contain multiple databases.

```azurecli
az mysql server create --resource-group myresourcegroup --name mydemoserver --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 
```

Here are the details for arguments above : 

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your Azure Database for MySQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
location | westus | The Azure location for the server.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. See the [pricing tiers](./concepts-pricing-tiers.md) for more information.

>[!IMPORTANT] 
>- The default MySQL version on your server is 5.7 . We currently have 5.6 and 8.0 versions also available.
>- To view all the arguments for **az mysql server create** command, see this [reference document](/cli/azure/mysql/server#az_mysql_server_create).
>- SSL is enabled by default on your server . For more infroamtion on SSL, see [Configure SSL connectivity](howto-configure-ssl.md)

## Configure a server-level firewall rule 
By default the new server created is protected with firewall rules and not accessible publicly. You can configure the firewall rule on your server using the [az mysql server firewall-rule create](/cli/azure/mysql/server/firewall-rule) command. This will allow you to connect to the server locally.

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Replace the IP address you will be connecting from. You can use an range of IP addresses if needed. Don't know how to look for your IP, then go to [https://whatismyipaddress.com/](https://whatismyipaddress.com/) to get your IP address.

```azurecli-interactive
az mysql server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az mysql server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
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

## Connect to Azure Database for MySQL server using mysql command-line client
You can connect to your server using a popular client tool, **[mysql.exe](https://dev.mysql.com/downloads/)** command-line tool with [Azure Cloud Shell](../cloud-shell/overview.md). Alternatively, you can use mysql command line on your local environment.
```bash
 mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
```

## Clean up resources
If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command: 

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run [az mysql server delete](/cli/azure/mysql/server#az_mysql_server_delete) command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../app-service/tutorial-php-mysql-app.md)