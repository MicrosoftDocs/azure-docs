---
title: 'Tutorial: Create Azure Database for PostgreSQL - Flexible Server and Azure App Service Web App in same virtual network'
description: Quickstart guide to create Azure Database for PostgreSQL - Flexible Server with Web App in a virtual network
ms.service: postgresql
ms.subservice: flexible-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 11/30/2021
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Create an Azure Database for PostgreSQL - Flexible Server with App Services Web App in Virtual network

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This tutorial shows you how create a Azure App Service Web app with Azure Database for PostgreSQL - Flexible Server  inside a [Virtual network](../../virtual-network/virtual-networks-overview.md).

In this tutorial you will learn how to:
>[!div class="checklist"]
> * Create a PostgreSQL flexible server in a virtual network
> * Create a web app
> * Add the web app to the virtual network
> * Connect to Postgres from the web app 

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- [Install Azure CLI](/cli/azure/install-azure-cli).version 2.0 or later locally. To see the version installed, run the `az --version` command. 
- Login to your account using the [az login](/cli/azure/authenticate-azure-cli) command. Note the **id** property from the command output for the corresponding subscription name.

  ```azurecli
  az login
  ```
- If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account) command.

  ```azurecli
  az account set --subscription <subscription ID>
  ```

## Create a PostgreSQL Flexible Server in a new virtual network

Create a private flexible server inside a virtual network (VNET) using the following command:

```azurecli
az postgres flexible-server create --resource-group demoresourcegroup --name demoserverpostgres --vnet demoappvnet --location westus2
```
This command performs the following actions, which may take a few minutes:

- Create the resource group if it doesn't already exist.
- Generates a server name if it is not provided.
- Create a new virtual network for your new postgreSQL server and subnet within this virtual network for the database server.
- Creates admin username , password for your server if not provided.
- Creates an empty database called **postgres**

Here is the sample output.

```json
Local context is turned on. Its information is saved in working directory /home/jane. You can run `az local-context off` to turn it off.
Command argument values from local context: --resource-group demoresourcegroup, --location: eastus
Checking the existence of the resource group ''...
Creating Resource group 'demoresourcegroup ' ...
Creating new vnet "demoappvnet" in resource group "demoresourcegroup" ...
Creating new subnet "Subnet095447391" in resource group "demoresourcegroup " and delegating it to "Microsoft.DBforPostgreSQL/flexibleServers"...
Creating PostgreSQL Server 'demoserverpostgres' in group 'demoresourcegroup'...
Your server 'demoserverpostgres' is using sku 'Standard_D2s_v3' (Paid Tier). Please refer to https://aka.ms/postgres-pricing for pricing details
Make a note of your password. If you forget, you would have to resetyour password with 'az postgres flexible-server update -n demoserverpostgres --resource-group demoresourcegroup -p <new-password>'.
{
  "connectionString": "postgresql://generated-username:generated-password@demoserverpostgres.postgres.database.azure.com/postgres?sslmode=require",
  "host": "demoserverpostgres.postgres.database.azure.com",
  "id": "/subscriptions/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/resourceGroups/demoresourcegroup/providers/Microsoft.DBforPostgreSQL/flexibleServers/demoserverpostgres",
  "location": "East US",
  "password": "generated-password",
  "resourceGroup": "demoresourcegroup",
  "skuname": "Standard_D2s_v3",
  "subnetId": "/subscriptions/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/resourceGroups/demoresourcegroup/providers/Microsoft.Network/virtualNetworks/VNET095447391/subnets/Subnet095447391",
  "username": "generated-username",
  "version": "12"
}
```

## Create a Web App
In this section, you create app host in App Service app, connect this app to the Postgres database, then deploy your code to that host. Make sure you're in the repository root of your application code in the terminal. Note Basic Plan does not support VNET integration. Please use Standard or Premium. 

Create an App Service app (the host process) with the az webapp up command

```azurecli
az webapp up --resource-group demoresourcegroup --location westus2 --plan testappserviceplan --sku P2V2 --name mywebapp
```

> [!NOTE]
> - For the _--location_ argument, use the same location as you did for the database in the previous section.
> - Replace \<app-name\> with a unique name across all Azure. Allowed characters for \<app-name\> are A-Z, 0-9, and -. A good pattern is to use a combination of your company name and an app identifier.

This command performs the following actions, which may take a few minutes:

- Create the resource group if it doesn't already exist. (In this command you use the same resource group in which you created the database earlier.)
- Create the App Service app if it doesn't exist.
- Enable default logging for the app, if not already enabled.
- Upload the repository using ZIP deployment with build automation enabled.

### Create Subnet for Web App
Before enabling VNET integration, you need to have subnet that is delegated to App Service Web App. Before creating the subnet, view the database subnet address to avoid using the same address-prefix for web app subnet. 

```azurecli
az network vnet show --resource-group demoresourcegroup -n demoappvnet
```

Run the following command to create a new subnet in the same virtual network as the database server was created. **Update the address-prefix to avoid conflict with the database subnet.**

```azurecli
az network vnet subnet create --resource-group demoresourcegroup --vnet-name demoappvnet --name webappsubnet  --address-prefixes 10.0.1.0/24  --delegations Microsoft.Web/serverFarms
```

## Add the Web App to the virtual network
Use [az webapp vnet-integration](/cli/azure/webapp/vnet-integration) command to add a regional virtual network integration to a webapp. 

```azurecli
az webapp vnet-integration add --resource-group demoresourcegroup -n  mywebapp --vnet demoappvnet --subnet webappsubnet
```

## Configure environment variables to connect the database
With the code now deployed to App Service, the next step is to connect the app to the flexible server in Azure. The app code expects to find database information in a number of environment variables. To set environment variables in App Service, use [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

  
```azurecli
  
az webapp config appsettings set  --name mywebapp --settings DBHOST="<postgres-server-name>.postgres.database.azure.com" DBNAME="postgres" DBUSER="<username>" DBPASS="<password>" 
```
- Replace **postgres-server-name**,**username**,**password** for the newly created flexible server command.
- Replace **\<username\>** and **\<password\>** with the credentials that the command also generated for you.
- The resource group and app name are drawn from the cached values in the .azure/config file.
- The command creates settings named **DBHOST**, **DBNAME**, **DBUSER***, and **DBPASS**. If your application code is using different name for the database information then use those names for the app settings as mentioned in the code.

Configure the web app to allow all outbound connections from within the virtual network.
```azurecli
az webapp config set --name mywebapp --resource-group demoresourcegroup --generic-configurations '{"vnetRouteAllEnabled": true}'
```

## Clean up resources

Clean up all resources you created in the tutorial using the following command. This command deletes all the resources in this resource group.

```azurecli
az group delete -n demoresourcegroup
```

## Next steps
> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](../../app-service/app-service-web-tutorial-custom-domain.md)
