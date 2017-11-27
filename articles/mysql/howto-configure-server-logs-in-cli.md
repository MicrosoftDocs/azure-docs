---
title: Access server logs in Azure Database for MySQL using Azure CLI | Microsoft Docs
description: This article describes how to access the server logs in Azure Database for MySQL using the Azure CLI command line utility.
services: mysql
author: rachel-msft
ms.author: raagyema
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.devlang: azure-cli
ms.topic: article
ms.date: 10/18/2017
---
# Configure and access server logs using Azure CLI
You can download the Azure Database for MySQL server logs using the Azure CLI, Azure's command-line utility.

## Prerequisites
To step through this how-to guide, you need:
- [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-cli.md)
- The [Azure CLI 2.0](/cli/azure/install-azure-cli) or use the Azure Cloud Shell in the browser.

## Configure logging for Azure Database for MySQL
You can configure the server to access the MySQL slow query log.
1. Turn on logging by setting **slow\_query\_log** parameter to ON.
2. Adjust other parameters like **long\_query\_time** and **log\_slow\_admin\_statements**.

See [How to Configure Server Parameters](howto-configure-server-parameters-using-cli.md) to learn how to set the value of these parameters through the Azure CLI.

For example, the following CLI command turns ON the slow query log, sets the long query time to 10 seconds, and turns OFF the logging of the slow admin statement. Finally, it lists the configuration options for your review.
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server myserver4demo --value ON
az mysql server configuration set --name long_query_time --resource-group myresourcegroup --server myserver4demo --value 10
az mysql server configuration set --name log_slow_admin_statements --resource-group myresourcegroup --server myserver4demo --value OFF
az mysql server configuration list --resource-group myresourcegroup --server myserver4demo
```

## List logs for Azure Database for MySQL server
To list the available log files for your server, run the [az mysql server-logs list](/cli/azure/mysql/server-logs#list) command.

You can list the log files for server **myserver4demo.mysql.database.azure.com** under Resource Group **myresourcegroup**, and direct it to a text file called **log\_files\_list.txt.**
```azurecli-interactive
az mysql server-logs list --resource-group myresourcegroup --server myserver4demo > log_files_list.txt
```
## Download logs from the server
The [az mysql server-logs download](/cli/azure/mysql/server-logs#download) command allows you to download individual log files for your server. 

This example downloads the specific log file for the server **myserver4demo.mysql.database.azure.com** under Resource Group **myresourcegroup** to your local environment.
```azurecli-interactive
az mysql server-logs download --name 20170414-myserver4demo-mysql.log --resource-group myresourcegroup --server myserver4demo
```

## Next Steps
- Learn about [server logs in Azure Database for MySQL](concepts-server-logs.md)
