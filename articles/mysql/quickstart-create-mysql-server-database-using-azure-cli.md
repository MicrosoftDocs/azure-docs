---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for MySQL'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL server in an Azure resource group.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 01/09/2019
ms.custom: mvc
---

# Quickstart: Create an Azure Database for MySQL server using Azure CLI

> [!TIP]
> Consider using the simpler [az mysql up](/cli/azure/ext/db-up/mysql#ext-db-up-az-mysql-up) Azure CLI command (currently in preview). Try out the [quickstart](./quickstart-create-server-up-azure-cli.md).

This quickstart shows how to use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for MySQL server in five minutes.  If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

>Note : If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

## Prerequisites
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to login to your account using the [az login](/cli/azure/authenticate-azure-cli?view=interactive-log-in) command. Note the **id** property from the command output for the corresponding subscription name.

```azurecli-interactive
az login
```

Select the specific subscription ID under your account using [az account set](/cli/azure/account) command. Substitute the **subscription ID** property from the **az login** output for your subscription into the subscription ID placeholder. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/en-us/cli/azure/account?view=azure-cli-latest#az-account-list)

```azurecli
az account set --subscription <subscription id>
```

## Create an Azure Database for MySQL server
Create an [Azure resource group](../azure-resource-manager/management/overview.md) using the [az group create](/cli/azure/group) command and then create your PostgreSQL server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create an Azure Database for MySQL server with the **[az mysql server create](/cli/azure/mysql/server#az-mysql-server-create)** command. At minimum you need to provide resource group , server name , admin username  , admin password and location where you want to provision your server. 
 
```azurecli-interactive
az mysql server create --resource-group <resourcegroup-name> --name <servername>  --location <location-name> --admin-user <admin-username> --admin-password <server_admin_password> --sku-name <sku-name>
```

Here is an example :
```azurecli
az mysql server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 
```

Here are the details for arguments above : 

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Choose a unique name that identifies your Azure Database for MySQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
location | westus | The Azure location for the server.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
sku-name|GP_Gen5_2|The default sku-name is "GP_Gen5_2" is not provided in the command. Follows the convention {pricing tier}\_{compute generation}\_{vCores} in shorthand. Please see the [pricing tiers](./concepts-pricing-tiers.md) for more infromation.

>[!IMPORTANT] 
>- The default MySQL version on your server is 5.7 . We currently have 5.6 and 8.0 versions also available.
>- To view all the arguments for **az mysql server create** command, see this [reference document](https://docs.microsoft.com/en-us/cli/azure/mysql/server?view=azure-cli-latest#az-mysql-server-create).
>- SSL is enabled by default on your server . For more infroamtion on SSL , see [Configure SSL connectivity](./howto-configure-ssl#step-4-verify-the-ssl-connection.md).

Here is an example that creates a MySQL 5.7 server in West US named `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. This is a **Gen 4** **General Purpose** server with **2 vCores**. Substitute the `<server_admin_password>` with your own value.


## Configure a server-level firewall rule 
By default the server created is not publicly accessible and you need to give permissions to your local machine IP. You can configure the firewall rule on your server using the **[az mysql server firewall-rule create](/cli/azure/mysql/server/firewall-rule#az-mysql-server-firewall-rule-create)** command to give your local machine access to connect to the server. 

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Replace the IP address or range of IP addresses that correspond to where you'll be connecting from. 

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

## Connect to the server using the mysql.exe command-line tool
Connect to your server using the **mysql.exe** command-line tool. Azure Cloud Shell has mysql.exe available to use but you can use a local [mysql.exe](https://dev.mysql.com/downloads/) on your computer.  Run the following command to connect to your server with **mysql.exe**. 

   ```bash
   mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
   ```
> [!TIP]
> For additional commands, see [MySQL 5.7 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.7/en/mysql.html).
> **Manage your database from local machine**
>If using mysql.exe , you can run the You can the above command to connect to your MySQL database server . You can also [Connect with MySQL Workbench](./connect-workbench.md) if that is your tool of choice or you can use mysql.exe command line on your local machine to connect to your server. 

## Clean up resources
If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command: 

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run **[az mysql server delete](/cli/azure/mysql/server#az-mysql-server-delete)** command.
```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../app-service/app-service-web-tutorial-php-mysql.md)
>[Build PHP app on Linux with MySQL](app-service/containers/tutorial-php-mysql-app.md)
>[Build Java based Spring App with MySQL](https://docs.microsoft.com/azure/developer/java/spring-framework/spring-app-service-e2e?tabs=bash)
