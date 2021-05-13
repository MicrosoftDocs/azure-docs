---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for PostgreSQL - Flexible Server'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for PostgreSQL Flexible Server in an Azure resource group.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 9/22/2020
ms.custom: mvc, devx-track-azurecli
---

# Quickstart: Create an Azure Database for PostgreSQL Flexible Server using Azure CLI

This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for PostgreSQL Flexible Server in five minutes. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

> [!IMPORTANT] 
> Azure Database for PostgreSQL Flexible Server is currently in preview.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](/cli/azure/reference-index#az_login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account#az_account_set) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az_account_list).

```azurecli
az account set --subscription <subscription id>
```

## Create a flexible server

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) using the `az group create` command and then create your PostgreSQL flexible server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create a flexible server with the `az postgres flexible-server create` command. A server can contain multiple databases. The following command creates a server using service defaults and values from your Azure CLI's [local context](/cli/azure/local-context): 

```azurecli
az postgres flexible-server create
```

The server created has the below attributes: 
- Auto-generated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group 
- Service defaults for remaining server configurations: compute tier (General Purpose), compute size/SKU (D2s_v3 - 2 vCore, 8 GB RAM), backup retention period (7 days), and PostgreSQL version (12)
- The default connectivity method is Private access (VNet Integration) with an auto-generated virtual network and subnet

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you selected *Private access (VNet Integration)* during create then you cannot change to *Public access (allowed IP addresses)* after create. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking.md).

If you'd like to change any defaults, please refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters. 

> [!NOTE]
> Connections to Azure Database for PostgreSQL communicate over port 5432. If you try to connect from within a corporate network, outbound traffic over port 5432 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 5432.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az postgres flexible-server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.

<!--FIXME-->
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.postgres.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforPostgreSQL/flexibleServers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 2,
    "name": "Standard_D2s_v3",
    "size": null,
    "tier": "GeneralPurpose"
  },
  "publicAccess": "Enabled",
  "storageProfile": {
    "backupRetentionDays": 7,
    "geoRedundantBackup": "Disabled",
    "storageMb": 131072
  },
  "tags": null,
  "type": "Microsoft.DBforPostgreSQL/flexibleServers",
  "userVisibleState": "Ready",
  "version": "12"
}
```

## Connect using PostgreSQL command-line client

As the flexible server was created with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the virtual network created. 

Once your VM is created, you can SSH into the machine and install the **[psql](https://www.postgresql.org/download/)** command-line tool.

With psql, connect using the below command. Replace values with your actual server name and password. 

```bash
psql -h mydemoserver.postgres.database.azure.com -u mydemouser -p
```

## Clean up resources

If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command:

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run the `az postgres flexible-server delete` command.

```azurecli-interactive
az postgres flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

> [!div class="nextstepaction"]
>[Deploy a Django app with App Service and PostgreSQL](tutorial-django-app-service-postgres.md)
