---
title: Major version upgrade - Azure CLI
description: This article describes how to perform a major version upgrade in Azure Database for PostgreSQL - Flexible Server through the Azure CLI.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
---

#  Major version upgrade of Azure Database for PostgreSQL - Flexible Server with Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides step-by-step procedure to perform a major version upgrade in Azure Database for PostgreSQL flexible server using Azure CLI.

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

- Create an Azure Database for PostgreSQL flexible server instance if you haven't already created one using the `az postgres flexible-server create` command.

    ```azurecli
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Perform Major Version Upgrade

You can run the following command to perform major version upgrade on an existing server.

> [!NOTE]  
> Major Version Upgrade action is irreversible. Please perform a point-in-time recovery (PITR) of your production server and test the upgrade in the non-production environment.


**Upgrade the major version of a flexible server.**
```azurecli
az postgres flexible-server upgrade --version {16, 15, 14, 13, 12}
                                    [--ids]
                                    [--name] [-n]
                                    [--resource-group] [-g]
                                    [--subscription]
                                    [--version] [-v]
                                    [--yes] [-y]
                                    
```

### Example

**Upgrade server 'testsvr' to PostgreSQL major version 16**

```azurecli
az postgres flexible-server upgrade -g testgroup -n testsvr -v 16 -y

```

## Next steps
* Learn about [Major Version Upgrade](concepts-major-version-upgrade.md)
* Learn about [backup & recovery](concepts-backup-restore.md)  
