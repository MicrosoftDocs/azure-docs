---
title: Access audit logs - Azure CLI - Azure Database for MariaDB
description: This article describes how to configure and access the audit logs in Azure Database for MariaDB from the Azure CLI.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 4/13/2020
---

# Configure and access audit logs in the Azure CLI

You can configure the [Azure Database for MariaDB audit logs](concepts-audit-logs.md) from the Azure CLI.

> [!IMPORTANT]
> Audit log functionality is currently in preview.

## Prerequisites

To step through this how-to guide, you need:

- [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-portal.md)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> This how-to guide requires that you use Azure CLI version 2.0 or later. To confirm the version, at the Azure CLI command prompt, enter `az --version`. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Configure audit logging

Enable and configure audit logging using the following steps: 

1. Turn on audit logs by setting the **audit_logs_enabled** parameter to "ON". 
    ```azurecli-interactive
    az mariadb server configuration set --name audit_log_enabled --resource-group myresourcegroup --server mydemoserver --value ON
    ```

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_egitvents** parameter.
    ```azurecli-interactive
    az mariadb server configuration set --name audit_log_events --resource-group myresourcegroup --server mydemoserver --value "ADMIN,CONNECTION"
    ```

1. Add any MariaDB users to be excluded from logging by updating the **audit_log_exclude_users** parameter. Specify users by providing their MariaDB user name.
    ```azurecli-interactive
    az mariadb server configuration set --name audit_log_exclude_users --resource-group myresourcegroup --server mydemoserver --value "azure_superuser"
    ```

1. Add any specific MariaDB users to be included for logging by updating the **audit_log_include_users** parameter. Specify users by providing their MariaDB user name.
    ```azurecli-interactive
    az mariadb server configuration set --name audit_log_include_users --resource-group myresourcegroup --server mydemoserver --value "sampleuser"
    ```

## Next steps

- Learn more about [audit logs](concepts-audit-logs.md) in Azure Database for MariaDB
- Learn how to configure audit logs in the [Azure portal](howto-configure-audit-logs-portal.md)