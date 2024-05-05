---
title: Download server logs for Azure Database for PostgreSQL flexible server with Azure CLI
description: This article describes how to download server logs by using the Azure CLI.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - devx-track-azurecli
---

# List and download Azure Database for PostgreSQL flexible server logs by using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to list and download Azure Database for PostgreSQL flexible server logs by using the Azure CLI.

## Prerequisites

- You must be running the Azure CLI version 2.39.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
- Sign in to your account by using the [az login](/cli/azure/reference-index#az-login) command. The `id` property refers to the **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account by using the [az account set](/cli/azure/account) command. Make a note of the `id` value from the `az login` output to use as the value for the `subscription` argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscriptions, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## List server logs by using the Azure CLI

After you configure the prerequisites and connect to your required subscription, you can list the server logs from your Azure Database for PostgreSQL flexible server instance by using the following command.

> [!NOTE]
> You can configure your server logs in the same way as just shown by using the [server parameters](./howto-configure-server-parameters-using-portal.md). Set the appropriate values for these parameters. Set `logfiles.download_enable` to ON to enable this feature. Set `logfiles.retention_days` to define retention in days. Initially, server logs occupy data disk space for about an hour before moving to backup storage for the set retention period.

```azurecli
az postgres flexible-server server-logs list --resource-group <myresourcegroup> --server-name <serverlogdemo> --out <table>
```

Here are the details for the preceding command.

|LastModifiedTime     |Name                                     |ResourceGroup|SizeInKb|TypePropertiesType|URL                                                                         |
|-------------------------|---------------------------------------------|---------------|--------|------------------|------------------------------------------------------------------------------------------|
|2024-01-10T13:20:15+00:00|serverlogs/postgresql_2024_01_10_12_00_00.log|myresourcegroup|242     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_12_00_00.log?`|
|2024-01-10T14:20:37+00:00|serverlogs/postgresql_2024_01_10_13_00_00.log|myresourcegroup|237     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_13_00_00.log?`|
|2024-01-10T15:20:58+00:00|serverlogs/postgresql_2024_01_10_14_00_00.log|myresourcegroup|237     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_14_00_00.log?`|
|2024-01-10T16:21:17+00:00|serverlogs/postgresql_2024_01_10_15_00_00.log|myresourcegroup|240     |LOG               |`https://00000000000.blob.core.windows.net/serverlogs/postgresql_2024_01_10_15_00_00.log?`|

The output table here lists `LastModifiedTime`, `Name`, `ResourceGroup`, `SizeInKb`, and `Download Url` of the server logs.

By default, `LastModifiedTime` is set to 72 hours. For listing files older than 72 hours, use the flag `--file-last-written <Time:HH>`.

```azurecli
az postgres flexible-server server-logs list --resource-group <myresourcegroup>  --server-name <serverlogdemo> --out table --file-last-written <144>
```

## Download server logs by using the Azure CLI

The following command downloads the preceding server logs to your current directory.

```azurecli
az postgres flexible-server server-logs download --resource-group <myresourcegroup> --server-name <serverlogdemo>  --name <serverlogs/postgresql_2024_01_10_12_00_00.log>
```

## Next steps

- To enable and disable server logs from the portal, see [Enable, list, and download server logs for Azure Database for PostgreSQL flexible server](./how-to-server-logs-portal.md).
- Learn more about [logging](./concepts-logging.md).
