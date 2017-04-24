---
title: 'Quickstart: Create an Azure Database for MySQL server - Azure CLI | Microsoft Docs'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL server in an Azure resource group.
services: mysql
documentationcenter: 
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh

ms.assetid: 
ms.service: mysql
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: portal
ms.workload:
ms.date: 04/19/2017
ms.custom: quick start connect
---

# Create a MySQL server using Azure CLI
This quickstart describes how to use the Azure CLI to create an Azure Database for MySQL server in an Azure resource group. The Azure CLI is used to create and manage Azure resources from the command line or in scripts.

To complete this quickstart, make sure you have installed the latest [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```
Follow the Command Prompt instructions to open URL https://aka.ms/devicelog in in your browser, and then enter the code generated in the **command prompt**.

![Log in to Azure through Azure CLI](./media/mysql-quickstart-create-mysql-server-database-using-azure-cli/1_az-login.png)

## Create a resource group
Create an [Azure Resource Group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) with [az group create](https://docs.microsoft.com/cli/azure/group#create) command. A Resource Group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named `mycliresource` in the `westus` location.

```azurecli
az group create --name mycliresource --location westus
```

![Create Azure Resource Group from Azure CLI](./media/mysql-quickstart-create-mysql-server-database-using-azure-cli/2_az-group-create.png)

## Create MySQL Server
Create an Azure Database for MySQL server with the az mysql server create command. A running MySQL server can manage multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates a MySQL server located in `westus` in the Resource Group `mycliresource` with name `mycliserver`. The server has an administrator log in named `myadmin` and password `Password01!`. The server is created with **Basic** performance tier and **50** compute units shared between all the databases in the server. You can scale compute and storage up or down depending on your application’s needs.

```azurecli
az mysql server create --resource-group mycliresource --name mycliserver
--location westus --user myadmin --password Password01!
--performance-tier Basic --compute-units 50
```

![Create an Azure Database for MySQL server using Azure CLI](./media/mysql-quickstart-create-mysql-server-database-using-azure-cli/3_az-mysq-server-create.png)

## Configure firewall rule
Create an Azure Database for MySQL server-level firewall rule with the az mysql server firewall-rule create command. A server-level firewall rule allows an external application, such as **mysql** command-line tool or MySQL Workbench to connect to your server through the Azure MySQL service firewall. 

The following example creates a firewall rule for a predefined address range, which in this example is the entire possible range of IP addresses.

```azurecli
az mysql server firewall-rule create --resource-group mycliresource
--server mycliserver --name AllowYourIP --start-ip-address 0.0.0.0
--end-ip-address 255.255.255.255
```

![Create a firewall rule in Azure Database for MySQL using Azure CLI](./media/mysql-quickstart-create-mysql-server-database-using-azure-cli/5_az-mysql-server-firewall-rule-create.png)

## Next steps
-   For a complete list of currently supported Azure CLI 2.0 commands, see [Azure CLI 2.0: Command reference -    az](https://docs.microsoft.com/en-us/cli/azure/).
-   To create a database in your new Azure Database for MySQL server using **mysql** command-line tool, see [Create an Azure Database for MySQL](placeholder.md).
-   To connect and query using **mysql** command-line tool, see [Connect and query with mysql command-line tool](mysql-quickstart-connect-query-using-mysql.md).
-   To connect and query using MySQL Workbench, see [Connect and query with Workbench](mysql-quickstart-connect-query-using-workbench.md).
-   To migrate data from an existing PostgreSQL database, see [Migrate data](placeholder.md).
-   For a technical overview of Azure Database for MySQL, see [About Azure Database for MySQL](placeholder.md).

