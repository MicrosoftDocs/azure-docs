---
title: Configure audit logs with Azure CLI - Azure Database for MySQL - Flexible Server
description: This article describes how to configure and access the audit logs in Azure Database for MySQL Flexible Server from the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 03/30/2021
---

# Configure and access audit logs for Azure Database for MySQL - Flexible Server using the Azure CLI

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

The article shows you how to configure [audit logs](concepts-audit-logs.md) for your MySQL flexible server using Azure CLI.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Login to Azure account using [az login](/cli/azure/reference-index#az_login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a MySQL Flexible Server if you have not already created one using the ```az mysql flexible-server create``` command.

    ```azurecli
    az mysql flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Configure audit logging

>[!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure audit logging.

```azurecli
# Enable audit logs

az mysql flexible-server parameter set \
--name audit_log_enabled \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value ON
```

## Next steps
- Learn more about [Audit logs](concepts-audit-logs.md)
