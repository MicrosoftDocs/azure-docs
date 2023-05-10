---
title: Restore Azure Database for PostgreSQL - Flexible Server with Azure CLI 
description: This article describes how to perform restore operations in Azure Database for PostgreSQL through the Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 11/30/2021
---

# Point-in-time restore of an Azure Database for PostgreSQL - Flexible Server with Azure CLI


[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]


This article provides step-by-step procedure to perform point-in-time recoveries in flexible server using backups.

## Prerequisites
- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a PostgreQL Flexible Server if you haven't already created one using the ```az postgres flexible-server create``` command.

    ```azurecli
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Restore a server from backup to a new server

You can run the following command to restore a server to an earliest existing backup.

**Usage**
```azurecli
az postgres flexible-server restore --restore-time
                                 --source-server
                                 [--ids]
                                 [--location]
                                 [--name]
                                 [--no-wait]
                                 [--resource-group]
                                 [--subscription]
```

**Example:**
Restore a server from this ```2021-03-03T13:10:00Z``` backup snapshot.

```azurecli
az postgres flexible-server restore \
--name mydemoserver-restored \
--resource-group myresourcegroup \
--restore-time "2021-05-05T13:10:00Z" \
--source-server mydemoserver
```

Time taken to restore will depend on the size of the data stored in the server.

## Geo-Restore a server from geo-backup to a new server

You can run the following command to restore a server to an earliest existing backup.

**Usage**
```azurecli
az postgres flexible-server geo-restore --source-server
                                 --location
                                 [--name]
                                 [--no-wait]
                                 [--resource-group]
                                 [--subscription]
                                 
```
**Example:** To perform a geo-restore of a source server 'mydemoserver' which is located in region East US to a new server 'mydemoserver-restored' in it’s geo-paired location West US with the same network setting you can run following command.

```azurecli
az postgres flexible-server geo-restore \
--name mydemoserver-restored \
--resource-group myresourcegroup \
--location "West US" \
--source-server mydemoserver
```

## Perform post-restore tasks
After the restore is completed, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server
- Ensure appropriate VNet rules are in place for users to connect. These rules aren't copied over from the original server.
- Ensure appropriate logins and database level permissions are in place
- Configure alerts as appropriate for the newly restore server

## Next steps
* Learn about [business continuity](concepts-business-continuity.md)
* Learn about [backup & recovery](concepts-backup-restore.md)  
