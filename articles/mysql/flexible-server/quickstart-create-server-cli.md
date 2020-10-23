---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for MySQL - Flexible Server'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL Flexible Server in an Azure resource group.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 9/21/2020
ms.custom: mvc
---

# Quickstart: Create an Azure Database for MySQL Flexible Server using Azure CLI

This quickstart shows how to use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for MySQL Flexible Server in five minutes. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

> [!IMPORTANT] 
> Azure Database for MySQL Flexible Server is currently in public preview

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](https://docs.microsoft.com/cli/azure/account#az-account-set) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create a flexible server

Create an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) using the `az group create` command and then create your MySQL flexible server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `eastus2` location.

```azurecli-interactive
az group create --name myresourcegroup --location eastus2
```

Create a flexible server with the `az mysql flexible-server create` command. A server can contain multiple databases. The following command creates a server using service defaults and values from your Azure CLI's [local context](https://docs.microsoft.com/cli/azure/local-context): 

```azurecli
az mysql flexible-server create
```

The server created has the below attributes: 
- Auto-generated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group 
- Service defaults for remaining server configurations: compute tier (Burstable), compute size/SKU (B1MS), backup retention period (7 days), and MySQL version (5.7)
- The default connectivity method is Private access (VNet Integration) with an auto-generated virtual network and subnet

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you selected *Private access (VNet Integration)* during create then you cannot change to *Public access (allowed IP addresses)* after create. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking.md).

If you'd like to change any defaults, please refer to the Azure CLI [reference documentation](/cli/azure/mysql/flexible-server) for the complete list of configurable CLI parameters. 

Below is some sample output: 

```json
Command group 'mysql flexible-server' is in preview. It may be changed/removed in a future release.
Creating Resource Group 'groupXXXXXXXXXX'...
Creating new vnet "serverXXXXXXXXXVNET" in resource group "groupXXXXXXXXXX"...
Creating new subnet "serverXXXXXXXXXSubnet" in resource group "groupXXXXXXXXXX" and delegating it to "Microsoft.DBforMySQL/flexibleServers"...
Creating MySQL Server 'serverXXXXXXXXX' in group 'groupXXXXXXXXXX'...
Your server 'serverXXXXXXXXX' is using sku 'Standard_B1ms' (Paid Tier). Please refer to https://aka.ms/mysql-pricing for pricing details
Creating MySQL database 'flexibleserverdb'...
Make a note of your password. If you forget, you would have to reset your password with 'az mysql flexible-server update -n serverXXXXXXXXX -g groupXXXXXXXXXX -p <new-password>'.
{
  "connectionString": "server=serverXXXXXXXXX.mysql.database.azure.com;database=flexibleserverdb;uid=secureusername;pwd=securepasswordstring",
  "databaseName": "flexibleserverdb",
  "host": "serverXXXXXXXXX.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/groupXXXXXXXXXX/providers/Microsoft.DBforMySQL/flexibleServers/serverXXXXXXXXX",
  "location": "East US 2",
  "password": "securepasswordstring",
  "resourceGroup": "groupXXXXXXXXXX",
  "skuname": "Standard_B1ms",
  "subnetId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/groupXXXXXXXXXX/providers/Microsoft.Network/virtualNetworks/serverXXXXXXXXXVNET/subnets/serverXXXXXXXXXSubnet",
  "username": "secureusername",
  "version": "5.7"
}
```

If you'd like to change any defaults, please refer to the Azure CLI [reference documentation](/cli/azure/mysql/flexible-server) for the complete list of configurable CLI parameters. 

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az mysql flexible-server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**. Below is a sample of the JSON output: 

```json
{
  "administratorLogin": "myadminusername",
  "administratorLoginPassword": null,
  "delegatedSubnetArguments": {
    "subnetArmResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/mydemoserverVNET/subnets/mydemoserverSubnet"
  },
  "fullyQualifiedDomainName": "mydemoserver.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMySQL/flexibleServers/mydemoserver",
  "location": "East US 2",
  "name": "mydemoserver",
  "publicNetworkAccess": "Disabled",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 0,
    "name": "Standard_B1ms",
    "tier": "Burstable"
  },
  "storageProfile": {
    "backupRetentionDays": 7,
    "fileStorageSkuName": "Premium_LRS",
    "storageAutogrow": "Disabled",
    "storageIops": 0,
    "storageMb": 10240
  },
  "tags": null,
  "type": "Microsoft.DBforMySQL/flexibleServers",
  "version": "5.7"
}
```

## Connect using mysql command-line client

As the flexible server was created with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the virtual network created. 

Once your VM is created, you can SSH into the machine and install the popular client tool, **[mysql.exe](https://dev.mysql.com/downloads/)** command-line tool.

With mysql.exe, connect using the below command. Replace values with your actual server name and password. 

```bash
 mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p
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
>[Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)