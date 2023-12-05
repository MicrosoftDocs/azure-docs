---
title:  Major Version Upgrade of a flexible server - Azure CLI 
description: This article describes how to perform major version upgrade in Azure Database for PostgreSQL through Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.author: kabharati
author: rajsell
ms.reviewer: ""
ms.topic: how-to
ms.date: 02/13/2023
---

#  Major Version Upgrade of a flexible server - Flexible Server with Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides step-by-step procedure to perform Major Version Upgrade in flexible server using Azure CLI.

## Prerequisites
- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.

    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a PostgreQL Flexible Server if you haven't already created one using the ```az postgres flexible-server create``` command.

    ```azurecli
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Perform Major Version Upgrade

You can run the following command to perform major version upgrade on an existing server.

> [!NOTE]  
> Major Version Upgrade action is irreversible. Please perform a point-in-time recovery (PITR) of your production server and test the upgrade in the non-production environment.


**Usage**
```azurecli
az postgres flexible-server upgrade --source-server
                                 [--resource-group]
                                 [--postgres-version]
```

**Example:**
Upgrade a server from this PG 11 to PG 14

```azurecli
az postgres server upgrade -g myresource-group -n myservername -v mypgversion

```

## Next steps
* Learn about [Major Version Upgrade](concepts-major-version-upgrade.md)
* Learn about [backup & recovery](concepts-backup-restore.md)  
