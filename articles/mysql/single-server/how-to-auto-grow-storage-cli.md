---
title: Auto grow storage - Azure CLI - Azure Database for MySQL
description: This article describes how you can enable auto grow storage using the Azure CLI in Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
author: SudheeshGH
ms.author: sunaray
ms.custom: devx-track-azurecli
ms.date: 06/20/2022
---

# Auto-grow Azure Database for MySQL storage using the Azure CLI

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article describes how you can configure an Azure Database for MySQL server storage to grow without impacting the workload.

The server [reaching the storage limit](./concepts-pricing-tiers.md#reaching-the-storage-limit), is set to read-only. If storage auto grow is enabled then for servers with less than 100 GB provisioned storage, the provisioned storage size is increased by 5 GB as soon as the free storage is below the greater of 1 GB or 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 10GB of the provisioned storage size. Maximum storage limits as specified [here](./concepts-pricing-tiers.md#storage) apply.

## Prerequisites

To complete this how-to guide:

- You need an [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Enable MySQL server storage auto-grow

Enable server auto-grow storage on an existing server with the following command:

```azurecli-interactive
az mysql server update --name mydemoserver --resource-group myresourcegroup --auto-grow Enabled
```

Enable server auto-grow storage while creating a new server with the following command:

```azurecli-interactive
az mysql server create --resource-group myresourcegroup --name mydemoserver  --auto-grow Enabled --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 --version 5.7
```

## Next steps

Learn about [how to create alerts on metrics](how-to-alert-on-metric.md).
