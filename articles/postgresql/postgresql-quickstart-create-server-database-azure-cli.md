---
title: 'Azure CLI: Create an Azure Database for PostgreSQL server | Microsoft Docs'
description: Quick start guide to create and manage Azure Database for PostgreSQL server using Azure CLI (command line interface). 
keywords: azure cloud postgresql postgres create server CLI
services: postgresql
author: sanagama
ms.author: sanagama
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: postgresql-database
ms.custom: quick start create
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: hero-article
Ms.date: 04/17/2017
---
# Create an Azure PostgreSQL server using the Azure CLI
This quick start describes how to use the Azure CLI to create an Azure Database for PostgreSQL server in an Azure resource group. 

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quick start describes how to use the Azure CLI to create an Azure PostgreSQL server in an [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).

To complete this quick start, make sure you have installed the latest [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) ccount before you begin.

This quick start takes about 5 minutes to complete and uses the Azure CLI to:
-   log-in into your Azure account
-   create a new Azure Resource Group
-   create a new Azure PostgreSQL server in the resource group
-   configure server-level firewall rules

## Prerequisites
Make sure you have the following before you begin:
-   An active Azure account. If you don't have one, you can sign up for    a [free account](https://azure.microsoft.com/free/).
-   Azure CLI installed for your platform. For more information, see [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Log in to Azure
Log in to your Azure subscription with the [az login](https://docs.microsoft.com/en-us/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group
Create an [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) with the [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group.
The following example creates a resource group named myResourceGroup in the westus location.
```azurecli
az group create --name myResourceGroup --location westus
```

## Create a new PostgreSQL server
Create an Azure PostgreSQL server with the **az postgres server create** command. A running PostgreSQL server can manage many databases. Typically, a separate database is used for each project or for each user.

The following example creates a randomly named PostgresSQL server located in westus in the resource group myResourceGroup. The server has an administrator login named ServerAdmin and password ChangeYourAdminPassword1. The server is created with the Basic performance tier and 50 compute units shared between all the databases in the server. You can scale compute and storage up or down depending on your application’s needs.
Replace these pre-defined values as desired.

```azurecli
servername=mypgserver-$RANDOM

az postgres server create --resource-group myResourceGroup --name $servername  --location westus --user ServerAdmin --password ChangeYourAdminPassword1 --performance-tier Basic --compute-units 50
```

It takes a few minutes to create a new Azure PostgreSQL server.

## Configure a server-level firewall rule
Create an Azure PostgreSQL server-level firewall rule with the **az postgres server firewall-rule create** command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, is the entire possible range of IP addresses.

Replace these predefined values with the values for your external IP address or IP address range.

```azurecli
az postgres server firewall-rule create --resource-group myResourceGroup --server $servername --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

## Connect to Azure Database for PostgreSQL using psql
When we created our PostgreSQL server, the default ‘postgres’ database also gets created. Let’s now use the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility to connect to the Azure Database for PostgreSQL server. To connect to your database server, you need to provide host information and access credentials.

```azurecli
az postgres server show --resource-group myResourceGroup --name $servername
```
Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
Run the following psql command to connect to an Azure Database for PostgreSQL server
```azurecli
psql --host=--host=HOSTNAME --port=<port> --username=<user@servername> --password --dbname=<database name>
```
For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mypgserver-20170401.postgres.database.azure.com** using access credentials:
```azurecli
psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --password –dbname postgres
```
## Clean up resources
The **Connect and Query** quick starts in the tutorial collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following command to delete all resources created by this quick start.
```azurecli
az group delete --name myResourceGroup
```
To delete the specific server in Resource Group
```azurecli
az postgres server delete --resource-group myResourceGroup --name $servername
```

## Next steps
-   To create a database in your new Azure PostgreSQL server, see [Create an Azure PostgreSQL database](placeholder.md).
-   To connect and query using psql, see [Connect and query - psql](placeholder.md)
-   To connect and query using PgAdmin, see [Connect and query - PgAdmin](placeholder.md)
-   To migrate data from an existing PostgreSQL database, see [Migrate data](placeholder.md)
-   For a technical overview of Azure PostgreSQL, see [About Azure Database for PostgreSQL service](placeholder.md)
