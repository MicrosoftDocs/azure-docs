---
title: Quick Start: Create an Azure Database for MySQL server using Azure CLI | Microsoft Docs
description: This quick start describes how to use the Azure CLI to create an Azure MySQL server in an Azure Resource Group.
services: mysql
documentationcenter: 
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: mysql-database
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: portal
ms.workload:
ms.date: 04/19/2017
ms.custom: quick start create
---
# Create an Azure Database for MySQL server using Azure CLI
This quick start describes how to use the Azure CLI to create an Azure MySQL server in an Azure Resource Group. The Azure CLI is used to create and manage Azure resources from the command line or in scripts.
This quick start takes about 5 minutes to complete and uses the Azure CLI to:
- log-in to your Azure account
- create a new Azure Resource Group
- create a new Azure MySQL server in the Resource Group
- configure server-level firewall rules

## Step 1 - Login to Azure
Login with Azure CLI 2.0. In **Windows Command Prompt**, type az login. Follow the Command Prompt instructions to open URL <https://aka.ms/devicelogin> in your browser, then enter the code that **Command Prompt** generated.

**TIPS**: follow instructions to [install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-clihttps:/docs.microsoft.com/en-us/cli/azure/install-azure-cli). Since version 1.0, we have improved and updated it to provide a great native command-line experience for managing Azure resources. In order for Windows Command Prompt to be able to call out Azure CLI, please make sure the folder that contains az.bat has been added into your path environment variable.

![Login into Azure using Azure CLI](./media/mysql-quickstart-connect-query-using-workbench/1_az-login.png)

## Step 2 - Create a Resource Group
Create an [Azure Resource Group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) with az group create command. A Resource Group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named **mycliresource** in the **westus** location.
```azurecli
az group create --name mycliresource --location westus
```
![Create a Resource Group in Azure using Azure CLI](./media/mysql-quickstart-connect-query-using-workbench/2_az-group-create.png)

## Step 3 - Create MySQL Server
Create an Azure MySQL server with the az mysql server create command. A running MySQL server can manage multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates a MySQL server located in **westus** in the Resource Group **mycliresource** with name **mycliserver**. The server has an administrator login named **myadmin** and password **Password01!**. The server is created with **Basic** performance tier and **50** compute units shared between all the databases in the server. You can scale compute and storage up or down depending on your application’s needs.
```azurecli
az mysql server create --resource-group mycliresource --name mycliserver
--location westus --user myadmin --password Password01!
--performance-tier Basic --compute-units 50
```
![Create an Azure Database for MySQL server using Azure CLI](./media/mysql-quickstart-connect-query-using-workbench/3_az-mysq-server-create.png)

## Step 4 - Configure Firewall Rule
Create an Azure MySQL server-level firewall rule with the az mysql server firewall-rule create command. A server-level firewall rule allows an external application, such as mysql.exe or MySQL Workbench to connect to your server through the Azure MySQL service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, is the entire possible range of IP addresses.


```azurecli
az mysql server firewall-rule create --resource-group mycliresource
--server mycliserver --name AllowYourIP --start-ip-address 0.0.0.0
--end-ip-address 255.255.255.255
```

![Create a firewall rule in Azure Database for MySQL using Azure CLI](./media/mysql-quickstart-connect-query-using-workbench/5_az-mysql-server-firewall-rule-create.png)

## Next steps
- For a complete list of currently supported Azure CLI 2.0 commands, see [Azure CLI 2.0: Command reference - az](https://docs.microsoft.com/en-us/cli/azure/).
- To create a database in your new Azure MySQL server using mysql.exe, see Create an Azure MySQL database.
- To connect and query using mysql.exe, see Connect and query - mysql.exe.
- To connect and query using MySQL Workbench, see Connect and query - Workbench.
- To migrate data from an existing PostgreSQL database, see Migrate data.
- For a technical overview of Azure Database for MySQL, see About Azure Database for MySQL.
