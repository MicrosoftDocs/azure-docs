---
title: Access audit logs - Azure CLI - Azure Database for MariaDB
description: This article describes how to configure and access the audit logs in Azure Database for MariaDB from the Azure CLI.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/24/2022
ms.custom: 
- devx-track-azurecli
- kr2b-contr-experiment
---

# Configure and access Azure Database for MariaDB audit logs in the Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

You can configure the [Azure Database for MariaDB audit logs](concepts-audit-logs.md) from the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this guide:

- You need an [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-portal.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Configure audit logging

>[!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure audit logging using the following steps:

1. Turn on audit logs by setting the **audit_logs_enabled** parameter to "ON".

    ```azurecli-interactive
    az mariadb server configuration set --name audit_log_enabled --resource-group myresourcegroup --server mydemoserver --value ON
    ```

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.

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
