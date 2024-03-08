---
title: Access audit logs - Azure CLI - Azure Database for MySQL
description: This article describes how to configure and access the audit logs in Azure Database for MySQL from the Azure CLI.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/20/2022
---

# Configure and access audit logs in the Azure CLI

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

You can configure the [Azure Database for MySQL audit logs](concepts-audit-logs.md) from the Azure CLI.

## Prerequisites

To step through this how-to guide:

- You need an [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md).

[!INCLUDE[azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Configure audit logging

> [!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure audit logging using the following steps:

1. Turn on audit logs by setting the **audit_logs_enabled** parameter to "ON". 
    ```azurecli-interactive
    az mysql server configuration set --name audit_log_enabled --resource-group myresourcegroup --server mydemoserver --value ON
    ```

2. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.
    ```azurecli-interactive
    az mysql server configuration set --name audit_log_events --resource-group myresourcegroup --server mydemoserver --value "ADMIN,CONNECTION"
    ```

3. Add any MySQL users to be excluded from logging by updating the **audit_log_exclude_users** parameter. Specify users by providing their MySQL user name.
    ```azurecli-interactive
    az mysql server configuration set --name audit_log_exclude_users --resource-group myresourcegroup --server mydemoserver --value "azure_superuser"
    ```

4. Add any specific MySQL users to be included for logging by updating the **audit_log_include_users** parameter. Specify users by providing their MySQL user name.

    ```azurecli-interactive
    az mysql server configuration set --name audit_log_include_users --resource-group myresourcegroup --server mydemoserver --value "sampleuser"
    ```

## Next steps
- Learn more about [audit logs](concepts-audit-logs.md) in Azure Database for MySQL
- Learn how to configure audit logs in the [Azure portal](how-to-configure-audit-logs-portal.md)
