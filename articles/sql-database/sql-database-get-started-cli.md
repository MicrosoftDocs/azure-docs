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
ms.custom: quick start create
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: hero-article
ms.date: 04/04/2017
ms.author: carlrab
---

# Create a single Azure SQL database using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy an Azure SQL database in an [Azure resource group](../azure-resource-manager/resource-group-overview.md) in an [Azure SQL Database logical server](sql-database-features.md).

To complete this quick start, make sure you have installed the latest [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```azurecli
az group create --name myResourceGroup --location westeurope
```
## Create a logical server

Create an [Azure SQL Database logical server](sql-database-features.md) with the [az sql server create](/cli/azure/sql/server#create) command. A logical server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```azurecli
servername=server-$RANDOM
az sql server create --name $servername --resource-group myResourceGroup --location westeurope \
	--admin-user ServerAdmin --admin-password ChangeYourAdminPassword1
```

## Configure a server firewall rule

Create an [Azure SQL Database server-level firewall rule](sql-database-firewall-configure.md) with the [az sql server firewall create](/cli/azure/sql/server/firewall#create) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, is the entire possible range of IP addresses. Replace these predefined values with the values for your external IP address or IP address range. 

```azurecli
az sql server firewall-rule create --resource-group myResourceGroup --server $servername \
	-n AllowYourIp --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

## Create a database in the server with sample data

Create a database with an [S0 performance level](sql-database-service-tiers.md) in the server with the [az sql db create](/cli/azure/sql/db#create) command. The following example creates a database called `mySampleDatabase` and loads the AdventureWorksLT sample data into this database. Replace these predefined values as desired (other quick starts in this collection build upon the values in this quick start).

```azurecli
az sql db create --resource-group myResourceGroup --server $servername \
	--name mySampleDatabase --sample-name AdventureWorksLT --service-objective S0
```

## Clean up resources

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following command to delete all resources created by this quick start.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

- To connect and query using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- To connect using Visual Studio, see [Connect and query with Visual Studio](sql-database-connect-query.md).
- For a technical overview of SQL Database, see [About the SQL Database service](sql-database-technical-overview.md).
