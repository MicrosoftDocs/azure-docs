---
title: 'Tutorial: Create Azure Database for MySQL Flexible Server (Preview) and Azure App Service Web App in same virtual network'
description: Quickstart guide to create Azure Database for MySQL Flexible Server (Preview) with Web App in a virtual network
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 03/18/2021
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Create an Azure Database for MySQL - Flexible Server (Preview) with App Services Web App in virtual network

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This tutorial shows you how create a Azure App Service Web App with  MySQL Flexible Server (Preview) inside a [Virtual network](../../virtual-network/virtual-networks-overview.md).

In this tutorial you will learn how to:
>[!div class="checklist"]
> * Create a MySQL flexible server in a virtual network
> * Create a subnet to delegate to App Service
> * Create a web app
> * Add the web app to the virtual network
> * Connect to Postgres from the web app 

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to login to your account using the [az login](/cli/azure/reference-index#az_login) command. Note the **id** property from the command output for the corresponding subscription name.

```azurecli
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account) command. Substitute the **subscription ID** property from the **az login** output for your subscription into the subscription ID placeholder.

```azurecli
az account set --subscription <subscription ID>
```

## Create an Azure Database for MySQL Flexible Server

Create a private flexible server inside a virtual network (VNET) using the following command:
```azurecli
az mysql flexible-server create --resource-group myresourcegroup --location westus2
```
Copy the connection string and the name of the newly created virtual network. This command performs the following actions, which may take a few minutes:

- Create the resource group if it doesn't already exist.
- Generates a server name if it is not provided.
- Create a new virtual network for your new MySQL server. Make a note of virtual network name and subnet name created for your server since you need to add the web app to the same virtual network.
- Creates admin username , password for your server if not provided.
- Creates an empty database called **flexibleserverdb**

> [!NOTE]
> Make a note of your password that will be generate for you if not provided. If you forget the password you would have to reset the password using ``` az mysql flexible-server update``` command

## Create Subnet for App Service Endpoint
We now need to have subnet that is delegated to App Service Web App endpoint. Run the following command to create a new subnet in the same virtual network as the database server was created. 

```azurecli
az network vnet subnet create -g myresourcegroup --vnet-name VNETName --name webappsubnetName  --address-prefixes 10.0.1.0/24  --delegations Microsoft.Web/serverFarms --service-endpoints Microsoft.Web
```
Make a note of the virtual network name and subnet name after this command as would need it to add VNET integration rule for the web app after it is created. 

## Create a web app

In this section, you create app host in App Service app and connect this app to the MySQL database. Make sure you're in the repository root of your application code in the terminal.

Create an App Service app (the host process) with the az webapp up command

```azurecli
az webapp up --resource-group myresourcegroup --location westus2 --plan testappserviceplan --sku P2V2 --name mywebapp
```

> [!NOTE]
> - For the --location argument, use the same location as you did for the database in the previous section.
> - Replace _&lt;app-name>_ with a unique name across all Azure (the server endpoint is https://\<app-name>.azurewebsites.net). Allowed characters for <app-name> are A-Z, 0-9, and -. A good pattern is to use a combination of your company name and an app identifier.
> - App Service Basic tier does not support VNET integration. Please use Standard or Premium. 

This command performs the following actions, which may take a few minutes:

- Create the resource group if it doesn't already exist. (In this command you use the same resource group in which you created the database earlier.)
- Create the App Service plan ```testappserviceplan``` in the Basic pricing tier (B1), if it doesn't exist. --plan and --sku are optional.
- Create the App Service app if it doesn't exist.
- Enable default logging for the app, if not already enabled.
- Upload the repository using ZIP deployment with build automation enabled.

## Add the web app to the virtual network

Use **az webapp vnet-integration** command to add a regional virtual network integration to a webapp. Replace _&lt;vnet-name>_ and _&lt;subnet-name_ with the virtual network and subnet name that the flexible server is using.

```azurecli
az webapp vnet-integration add -g myresourcegroup -n  mywebapp --vnet VNETName --subnet webappsubnetName
```

## Configure environment variables to connect the database

With the code now deployed to App Service, the next step is to connect the app to the flexible server in Azure. The app code expects to find database information in a number of environment variables. To set environment variables in App Service, you create "app settings" with the ```az webapp config appsettings``` set command.

```azurecli
az webapp config appsettings set --settings DBHOST="<mysql-server-name>.mysql.database.azure.com" DBNAME="flexibleserverdb" DBUSER="<username>" DBPASS="<password>"
```

- Replace _&lt;mysql-server-name>_, _&lt;username>_, and _&lt;password>_ for the newly created flexible server command.
- Replace _&lt;username>_ and _&lt;password>_ with the credentials that the command also generated for you.
- The resource group and app name are drawn from the cached values in the .azure/config file.
- The command creates settings named DBHOST, DBNAME, DBUSER, and DBPASS. If your application code is using different name for the database information then use those names for the app settings as mentioned in the code.

## Clean up resources

Clean up all resources you created in the tutorial using the following command. This command deletes all the resources in this resource group.

```azurecli
az group delete -n myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](../../app-service/app-service-web-tutorial-custom-domain.md)
