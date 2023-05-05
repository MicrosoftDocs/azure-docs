---
title: 'Monitoring - List and Download Server logs using Azure CLI'
description: This article describes how to download and list server logs using Azure CLI.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.date: 08/05/2022
---
# List and Download Server logs using Azure CLI

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article shows you how to list and download server flexible server using Azure CLI.

## Prerequisites

This article requires that you're running the Azure CLI version 2.39.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to sign-in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## List Server logs using Azure CLI

Once you're configured the prerequisites and connected to your required subscription.
You can list the server logs from your flexible server by below command.


```azurecli
az mysql flexible-server server-logs list --resource-group <myresourcegroup> --server-name <serverlogdemo> --out <table>
```

Here are the details for the above command

LastModifiedTime | Name  | ResourceGroup | SizeInKb  | TypePropertiesType  | Url
---|---|---|---|---|---|
2022-08-01T11:09:48+00:00 | mysql-slow-serverlogdemo-2022073111.log  | myresourcegroup | 10947 | slowlog | `https://00000000000.file.core.windows.net/0000000serverlog/slowlogs/mysql-slow-serverlogdemo-2022073111.log?`
2022-08-02T11:10:00+00:00 | mysql-slow-serverlogdemo-2022080111.log  | myresourcegroup | 10927 | slowlog | `https://00000000000.file.core.windows.net/0000000serverlog/slowlogs/mysql-slow-serverlogdemo-2022080111.log?`
2022-08-03T11:10:12+00:00   | mysql-slow-serverlogdemo-2022080211.log  | myresourcegroup | 10936 | slowlog | `https://00000000000.file.core.windows.net/0000000serverlog/slowlogs/mysql-slow-serverlogdemo-2022080211.log?`
2022-08-03T11:12:00+00:00 | mysql-slow-serverlogdemo-2022080311.log  | myresourcegroup | 8920 | slowlog | `https://00000000000.file.core.windows.net/0000000serverlog/slowlogs/mysql-slow-serverlogdemo-2022080311.log?`


Above list shows LastModifiedTime, Name, ResourceGroup, SizeInKb and Download Url of the Server Logs available.
Default LastModifiedTime is set to 72 hours, for listing files older than 72 hours, use flag `--file-last-written <Time:HH>`

```azurecli
az mysql flexible-server server-logs list --resource-group <myresourcegroup>  --server-name <serverlogdemo> --out table --file-last-written <144>
```

## Downloading Server logs using Azure CLI

Below command will download the mentioned server logs to your current directory.

```azurecli
az mysql flexible-server server-logs download --resource-group <myresourcegroup> --server-name <serverlogdemo>  --name <mysql-slow-serverlogdemo-2022073111.log>
```

## Next Steps
- To enable and disable Server logs from portal, you can refer to the [article.](./how-to-server-logs-portal.md)
- Learn more about [Configure slow logs using Azure CLI](./tutorial-query-performance-insights.md#configure-slow-query-logs-by-using-the-azure-cli)
