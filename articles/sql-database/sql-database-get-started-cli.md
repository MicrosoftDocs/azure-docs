---
title: 'Azure CLI: Create a SQL database | Microsoft Docs'
description: Learn how to create a SQL Database logical server, server-level firewall rule, and databases using the Azure CLI. 
keywords: sql database tutorial, create a sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: mvc,DBs & servers
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: hero-article
ms.date: 04/17/2017
ms.author: carlrab
---

# Create a single Azure SQL database using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy an Azure SQL database in an [Azure resource group](../azure-resource-manager/resource-group-overview.md) in an [Azure SQL Database logical server](sql-database-features.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Define variables

Define variables for use in the scripts in this quick start.

```azurecli-interactive
# The data center and resource name for your resources
export resourcegroupname = myResourceGroup
export location = westeurope
# The logical server name: Use a random value or replace with your own value (do not capitalize)
export servername = server-$RANDOM
# Set an admin login and password for your database
export adminlogin = ServerAdmin
export password = ChangeYourAdminPassword1
# The ip address range that you want to allow to access your DB
export startip = "0.0.0.0"
export endip = "0.0.0.0"
# The database name
export databasename = mySampleDatabase
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```azurecli-interactive
az group create --name $resourcegroupname --location $location
```
## Create a logical server

Create an [Azure SQL Database logical server](sql-database-features.md) using the [az sql server create](/cli/azure/sql/server#create) command. A logical server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```azurecli-interactive
az sql server create --name $servername --resource-group $resourcegroupname --location $location \
	--admin-user $adminlogin --admin-password $password
```

## Configure a server firewall rule

Create an [Azure SQL Database server-level firewall rule](sql-database-firewall-configure.md) using the [az sql server firewall create](/cli/azure/sql/server/firewall-rule#create) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.  

```azurecli-interactive
az sql server firewall-rule create --resource-group $resourcegroupname --server $servername \
	-n AllowYourIp --start-ip-address $startip --end-ip-address $endip
```

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 1433.
>

## Create a database in the server with sample data

Create a database with an [S0 performance level](sql-database-service-tiers.md) in the server using the [az sql db create](/cli/azure/sql/db#create) command. The following example creates a database called `mySampleDatabase` and loads the AdventureWorksLT sample data into this database. Replace these predefined values as desired (other quick starts in this collection build upon the values in this quick start).

```azurecli-interactive
az sql db create --resource-group $resourcegroupname --server $servername \
	--name $databasename --sample-name AdventureWorksLT --service-objective S0
```

## Clean up resources

Other quick starts in this collection build upon this quick start. 

> [!TIP]
> If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.
>

```azurecli-interactive
az group delete --name $resourcegroupname
```

## Next steps

Now that you have a database, you can connect and query using your favorite tools. Learn more by choosing your tool below:

- [SQL Server Management Studio](sql-database-connect-query-ssms.md)
- [Visual Studio Code](sql-database-connect-query-vscode.md)
- [.NET](sql-database-connect-query-dotnet.md)
- [PHP](sql-database-connect-query-php.md)
- [Node.js](sql-database-connect-query-nodejs.md)
- [Java](sql-database-connect-query-java.md)
- [Python](sql-database-connect-query-python.md)
- [Ruby](sql-database-connect-query-ruby.md)

