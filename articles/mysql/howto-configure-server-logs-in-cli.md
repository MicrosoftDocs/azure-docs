---
title: Access server logs in Azure Database for MySQL by using Azure CLI
description: This article describes how to access the server logs in Azure Database for MySQL by using the Azure CLI command-line utility.
services: mysql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.devlang: azure-cli
ms.topic: article
ms.date: 02/28/2018
---
# Configure and access server logs by using Azure CLI
You can download the Azure Database for MySQL server logs by using Azure CLI, the Azure command-line utility.

## Prerequisites
To step through this how-to guide, you need:
- [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-cli.md)
- The [Azure CLI](/cli/azure/install-azure-cli) or Azure Cloud Shell in the browser

## Configure logging for Azure Database for MySQL
You can configure the server to access the MySQL slow query log by taking the following steps:
1. Turn on logging by setting the **slow\_query\_log** parameter to ON.
2. Adjust other parameters, such as **long\_query\_time** and **log\_slow\_admin\_statements**.

To learn how to set the value of these parameters through Azure CLI, see [How to configure server parameters](howto-configure-server-parameters-using-cli.md). 

For example, the following CLI command turns on the slow query log, sets the long query time to 10 seconds, and then turns off the logging of the slow admin statement. Finally, it lists the configuration options for your review.
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver --value ON
az mysql server configuration set --name long_query_time --resource-group myresourcegroup --server mydemoserver --value 10
az mysql server configuration set --name log_slow_admin_statements --resource-group myresourcegroup --server mydemoserver --value OFF
az mysql server configuration list --resource-group myresourcegroup --server mydemoserver
```

## List logs for Azure Database for MySQL server
To list the available log files for your server, run the [az mysql server-logs list](/cli/azure/mysql/server-logs#az-mysql-server-logs-list) command.

You can list the log files for server **mydemoserver.mysql.database.azure.com** under the resource group **myresourcegroup**. Then direct the list of log files to a text file called **log\_files\_list.txt**.
```azurecli-interactive
az mysql server-logs list --resource-group myresourcegroup --server mydemoserver > log_files_list.txt
```
## Download logs from the server
With the [az mysql server-logs download](/cli/azure/mysql/server-logs#az-mysql-server-logs-download) command, you can download individual log files for your server. 

Use the following example to download the specific log file for the server **mydemoserver.mysql.database.azure.com** under the resource group **myresourcegroup** to your local environment.
```azurecli-interactive
az mysql server-logs download --name 20170414-mydemoserver-mysql.log --resource-group myresourcegroup --server mydemoserver
```

## Next steps
- Learn about [server logs in Azure Database for MySQL](concepts-server-logs.md).
