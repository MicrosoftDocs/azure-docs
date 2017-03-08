---
title: 'Azure CLI: Create and query a single SQL database | Microsoft Docs'
description: Learn how to create a SQL Database logical server, server-level firewall rule, and databases using the Azure CLI. 
keywords: sql database tutorial, create a sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: quick start
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: cli
ms.topic: hero-article
ms.date: 03/08/2017
ms.author: carlrab
---

# Create and query a single Azure SQL database with the Azure CLI 2.0

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy an Azure SQL database.

Before you start, make sure that the Azure CLI has been installed. For more information, see [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli). 

## Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named `myResourceGroup` in the `northcentralus` location.

```azurecli
az group create --name myResourceGroup --location northcentralus
```
## Create a logical server

Create a logical server with the [az sql server create](/cli/azure/sql/server#create) command. The following example creates a randomly-named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```azurecli
servername=server-$RANDOM
adminlogin=ServerAdmin
password=ChangeYourAdminPassword1
az sql server create --name $servername --resource-group myResourceGroup --location northcentralus \
	--administrator-login $adminlogin --administrator-login-password $password
```

## Configure a server firewall rule

Create a server-level firewall rule with the [az sql server firewall create](/cli/azure/sql/server/firewall#create) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, and the entire possible range of IP address. Replace these predefined values with the values for your external IP address or IP address range. 

```azurecli
startip=0.0.0.0
endip=255.255.255.255
z sql server firewall create --resource-group myResourceGroup --server-name $servername \
	-n AllowYourIp --start-ip-address $startip --end-ip-address $endip
```

## Create a database in the server

Create a database in the server with the [az sql db create](/cli/azure/sql/db#create) command. The following example creates a database called `mySampleDatabase`. Replace this predefined value as desired.

```azurecli
az sql db create --resource-group myResourceGroup --location northcentralus --server-name $servername \
	--name mySampleDatabase --requested-service-objective-name S0
```

## Clean up resources

To remove all the resources created by this QuickStart, run the following command:

```azurecli
az group delete --name myResourceGroup
```

## Next Steps

- To connect and query using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- To connect using Visual Studio, see [Connect and query with Visual Studio](sql-database-connect-query.md).
- To create a single database in the Azure portal, see [Create a single database in the Azure portal](sql-database-get-started.md).
- To create a single database with Azure PowerShell, see [Create a single database using PowerShell](sql-database-get-started-powershell.md).
- For a getting started with SQL Server authentication tutorial, see [SQL authentication and authorization](sql-database-control-access-sql-authentication-get-started.md).
- If you're ready to start coding, choose your programming language at [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).
- If you want to move your on-premises SQL Server databases to Azure, see [Migrating a database to SQL Database](sql-database-cloud-migrate.md).
- For a technical overview of SQL Database, see [About the SQL Database service](sql-database-technical-overview.md).