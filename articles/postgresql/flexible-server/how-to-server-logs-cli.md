---
title: Download server logs for Azure Database for PostgreSQL - Flexible Server with Azure CLI
description: This article describes how to download server logs using Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
author: varun-dhawan
ms.author: varundhawan
ms.topic: conceptual
ms.date: 1/16/2024
---

# List and download Azure Database for PostgreSQL - Flexible Server logs by using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to list and download Azure Database for PostgreSQL flexible server logs using Azure CLI.

## Prerequisites

This article requires that you're running the Azure CLI version 2.39.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You need to sign-in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## List server logs using Azure CLI

Once you're configured the prerequisites and connected to your required subscription. You can list the server logs from your Azure Database for PostgreSQL flexible server instance by using the following command.

> [!Note]
> You can configure your server logs in the same way as above using the [Server Parameters](./howto-configure-server-parameters-using-portal.md), setting the appropriate values for these parameters: _logfiles.download_enable_ to ON to enable this feature, and _logfiles.retention_days_ to define retention in days. Initially, server logs occupy data disk space for about an hour before moving to backup storage for the set retention period.

```azurecli
az postgres flexible-server server-logs list --resource-group <myresourcegroup> --server-name <serverlogdemo> --out <table>
```

Here are the details for the above command

|**LastModifiedTime**     |**Name**                                     |**ResourceGroup**|**SizeInKb**|**TypePropertiesType**|**Url**                                                                         |
|-------------------------|---------------------------------------------|---------------|--------|------------------|------------------------------------------------------------------------------------------|
|2024-01-10T13:20:15+00:00|serverlogs/postgresql_2024_01_10_12_00_00.log|myresourcegroup|242     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_12_00_00.log?`|
|2024-01-10T14:20:37+00:00|serverlogs/postgresql_2024_01_10_13_00_00.log|myresourcegroup|237     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_13_00_00.log?`|
|2024-01-10T15:20:58+00:00|serverlogs/postgresql_2024_01_10_14_00_00.log|myresourcegroup|237     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_14_00_00.log?`|
|2024-01-10T16:21:17+00:00|serverlogs/postgresql_2024_01_10_15_00_00.log|myresourcegroup|240     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_15_00_00.log?`|


The output table here lists `LastModifiedTime`, `Name`, `ResourceGroup`, `SizeInKb` and `Download Url` of the Server Logs.

By default `LastModifiedTime` is set to 72 hours, for listing files older than 72 hours, use flag `--file-last-written <Time:HH>`

```azurecli
az postgres flexible-server server-logs list --resource-group <myresourcegroup>  --server-name <serverlogdemo> --out table --file-last-written <144>
```

## Download server logs using Azure CLI

The following command downloads the preceding server logs to your current directory.

```azurecli
az postgres flexible-server server-logs download --resource-group <myresourcegroup> --server-name <serverlogdemo>  --name <serverlogs/postgresql_2024_01_10_12_00_00.log>
```

## Next steps
- To enable and disable Server logs from portal, you can refer to the [article.](./how-to-server-logs-portal.md)
- Learn more about [Logging](./concepts-logging.md)