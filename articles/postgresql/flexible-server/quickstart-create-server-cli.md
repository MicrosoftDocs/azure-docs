---
title: 'Quickstart: Create a server - Azure CLI - Azure Database for PostgreSQL - Flexible Server'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for PostgreSQL Flexible Server in an Azure resource group.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 11/30/2021
ms.custom: mvc, devx-track-azurecli, mode-api
---

# Quickstart: Create an Azure Database for PostgreSQL Flexible Server using Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create an Azure Database for PostgreSQL Flexible Server in five minutes. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.



## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **id** property in the output, which refers to the **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account#az-account-set) command. Use the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create a flexible server

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) using the `az group create` command and then create your PostgreSQL flexible server inside this resource group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

Create a flexible server with the `az postgres flexible-server create` command. A server can contain multiple databases. The following command creates a server in the resource group you just created:

```azurecli
az postgres flexible-server create --name mydemoserver --resource-group myresourcegroup
```

Since the default connectivity method is *Public access (allowed IP addresses)*, the command will prompt you for your own IP address to initialize the list of allowed addresses.

The server created has the following attributes: 
- The same location as your resource group
- Auto-generated admin username and admin password (which you should save in a secure place)
- A default database named "flexibleserverdb"
- Service defaults for remaining server configurations: compute tier (General Purpose), compute size/SKU (`Standard_D2s_v3` - 2 vCore, 8 GB RAM), backup retention period (7 days), and PostgreSQL version (13)

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you selected *Private access (VNet Integration)* during creation, then you cannot change it to *Public access (allowed IP addresses)* after creation. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking.md).

If you'd like to change any defaults, please refer to the Azure CLI reference for [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create).

> [!NOTE]
> Connections to Azure Database for PostgreSQL communicate over port 5432. If you try to connect from within a corporate network, outbound traffic over port 5432 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 5432.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az postgres flexible-server show --name mydemoserver --resource-group myresourcegroup
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**. You should have saved the password in the previous step.

```json
{
  "administratorLogin": "myadmin",
  "availabilityZone": "3",
  "backup": {
    "backupRetentionDays": 7,
    "earliestRestoreDate": "2022-10-20T18:03:50.989428+00:00",
    "geoRedundantBackup": "Disabled"
  },
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.postgres.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforPostgreSQL/flexibleServers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "network": {
    "delegatedSubnetResourceId": null,
    "privateDnsZoneArmResourceId": null,
    "publicNetworkAccess": "Enabled"
  },
  "resourceGroup": "myresourcegroup",
  "sku": {
    "name": "Standard_D2s_v3",
    "tier": "GeneralPurpose"
  },
  "state": "Ready",
  "storage": {
    "storageSizeGb": 128
  },
  "tags": null,
  "type": "Microsoft.DBforPostgreSQL/flexibleServers",
  "version": "13"
}
```

## Connect using PostgreSQL command-line client

First, install the **[psql](https://www.postgresql.org/download/)** command-line tool.

With psql, connect to the "flexibleserverdb" database using the below command. Replace values with the auto-generated domain name and username. 

```bash
psql -h mydemoserver.postgres.database.azure.com -U myadmin flexibleserverdb
```

>[!Note]
> If you get an error `The parameter PrivateDnsZoneArguments is required, and must be provided by customer`, this means you may be running an older version of Azure CLI. Please [upgrade Azure CLI](/cli/azure/update-azure-cli) and retry the operation.

## Clean up resources

If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command:

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete only the newly created server, you can run the `az postgres flexible-server delete` command.

```azurecli-interactive
az postgres flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

> [!div class="nextstepaction"]
>[Deploy a Django app with App Service and PostgreSQL](tutorial-django-app-service-postgres.md)
