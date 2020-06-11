---
title: Access slow query logs - Azure CLI  - Azure Database for MariaDB
description: This article describes how to access the slow logs in Azure Database for MariaDB by using the Azure CLI command-line utility.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 4/13/2020
---
# Configure and access slow query logs by using Azure CLI
You can download the Azure Database for MariaDB slow query logs by using Azure CLI, the Azure command-line utility.

## Prerequisites
To step through this how-to guide, you need:
- [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md)
- The [Azure CLI](/cli/azure/install-azure-cli) or Azure Cloud Shell in the browser

## Configure logging
You can configure the server to access the MySQL slow query log by taking the following steps:
1. Turn on slow query logging by setting the **slow\_query\_log** parameter to ON.
2. Select where to output the logs to using **log\_output**. To send logs to both local storage and Azure Monitor Diagnostic Logs, select **File**. To send logs only to Azure Monitor Logs, select **None**
3. Adjust other parameters, such as **long\_query\_time** and **log\_slow\_admin\_statements**.

To learn how to set the value of these parameters through Azure CLI, see [How to configure server parameters](howto-configure-server-parameters-cli.md).

For example, the following CLI command turns on the slow query log, sets the long query time to 10 seconds, and then turns off the logging of the slow admin statement. Finally, it lists the configuration options for your review.
```azurecli-interactive
az mariadb server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver --value ON
az mariadb server configuration set --name log_output --resource-group myresourcegroup --server mydemoserver --value FILE
az mariadb server configuration set --name long_query_time --resource-group myresourcegroup --server mydemoserver --value 10
az mariadb server configuration set --name log_slow_admin_statements --resource-group myresourcegroup --server mydemoserver --value OFF
az mariadb server configuration list --resource-group myresourcegroup --server mydemoserver
```

## List logs for Azure Database for MariaDB server
If **log_output** is configured to "File", you can access logs directly from the server's local storage. To list the available slow query log files for your server, run the [az mariadb server-logs list](/cli/azure/mariadb/server-logs#az-mariadb-server-logs-list) command.

You can list the log files for server **mydemoserver.mariadb.database.azure.com** under the resource group **myresourcegroup**. Then direct the list of log files to a text file called **log\_files\_list.txt**.
```azurecli-interactive
az mariadb server-logs list --resource-group myresourcegroup --server mydemoserver > log_files_list.txt
```
## Download logs from the server
If **log_output** is configured to "File", you can download individual log files from your server with the [az mariadb server-logs download](/cli/azure/mariadb/server-logs#az-mariadb-server-logs-download) command.

Use the following example to download the specific log file for the server **mydemoserver.mariadb.database.azure.com** under the resource group **myresourcegroup** to your local environment.
```azurecli-interactive
az mariadb server-logs download --name mysql-slow-mydemoserver-2018110800.log --resource-group myresourcegroup --server mydemoserver
```

## Next steps
- Learn about [slow query logs in Azure Database for MariaDB](concepts-server-logs.md).
