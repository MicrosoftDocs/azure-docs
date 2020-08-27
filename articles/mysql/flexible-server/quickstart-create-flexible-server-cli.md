---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for MySQL - Flexible Server'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL Flexible Server in an Azure resource group.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 08/21/2020
ms.custom: mvc
---

# Quickstart: Create an Azure Database for MySQL Flexible Server using Azure CLI

This quickstart shows how to use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for MySQL Flexible Server in five minutes. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

> [!IMPORTANT] 
> Azure Database for MySQL Flexible Server is currently in public preview

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create a flexible server

Create an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) using the `az group create` command and then create your MySQL flexible server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create a flexible server with the `az mysql flexible-server create` command. A server can contain multiple databases. The following command to create a server using service defaults and values from values from your Azure CLI's [local context](https://docs.microsoft.com/cli/azure/local-context?view=azure-cli-latest). The server is created with an auto-generated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group. Additionally, service defaults will be selected for remaining server configurations such as tier (Burstable), SKU (B1MS) and backup retention period (7 days). The default connectivity method is Private access (VNet Integration) with an auto-generated virtual network and subnet.  

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you selected *Private access (VNet Integration)* during create then you cannot change to *Public access (allowed IP addresses)* after create. We highly recommend creating a server with Private access to securely access your server using VNet Integration. <!--Learn more about Private access in the [concepts article](./concepts-networking.md).-->

```azurecli
az mysql flexible-server create
```

If you'd like to change any defaults, you can specify server configurations yourself using the following Azure CLI parameters:

**Azure CLI Parameter** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your flexible server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
location | westus | The Azure location for the server.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
tier|Burstable|The compute tier of the server. Either "Burstable", "GeneralPurpose", or "MemoryOptimized".
sku-name|Standard_B1ms|Enter the compute configuration. Follows the convention Standard_{VM name} in shorthand. See the compute and storage<!--[compute and storage](./concepts-compute-storage.md)--> for more information.

Refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters. 

>[!IMPORTANT]
> The default MySQL version on your server is 5.7

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az mysql flexible-server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.

<!--FIXME-->
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMySQL/flexibleServers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 1,
    "name": "Standard_B1ms",
    "size": null,
    "tier": "Burstable"
  },
  "publicAccess": "Enabled",
  "storageProfile": {
    "backupRetentionDays": 7,
    "geoRedundantBackup": "Disabled",
    "storageMb": 5120
  },
  "tags": null,
  "type": "Microsoft.DBforMySQL/flexibleServers",
  "userVisibleState": "Ready",
  "version": "5.7"
}
```

## Connect to Azure Database for MySQL server using mysql command-line client

As the flexible server was created with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the virtual network created. 

Below is a sample of how to create an Ubuntu Linux virtual machine that is added to the same virtual network and subnet as the flexible server created.  

`az vm create --name <yourvirtualmachinename> --vnet-name <created with your flexible server> --subnet-name <created with your flexible server> --image UbuntuLTS --admin-username <yourVMusername> --admin-password <your VM password>`


You can connect to your server using a popular client tool, **[mysql.exe](https://dev.mysql.com/downloads/)** command-line tool with [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). Alternatively, you can use mysql command line on your local environment.

<!-- need to decide how to connect based on connectivity method. If private access, requires a resource within the VNet to connect. May be more complicated for a quickstart? -->

```bash
 mysql -h mydemoserver.mysql.database.azure.com -u myadmin -p
```

## Clean up resources

If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command:

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run the `az mysql server delete` command.

```azurecli-interactive
az mysql flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../../app-service/app-service-web-tutorial-php-mysql.md)
>[Build PHP app on Linux with MySQL](../../app-service/containers/tutorial-php-mysql-app.md)
>[Build Java based Spring App with MySQL](https://docs.microsoft.com/azure/developer/java/spring-framework/spring-app-service-e2e?tabs=bash)
