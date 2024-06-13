---
title: Restart server - Azure CLI - Azure Database for MariaDB
description: This article describes how you can restart an Azure Database for MariaDB server using the Azure CLI.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/24/2022
---

# Restart Azure Database for MariaDB server using the Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

This topic describes how you can restart an Azure Database for MariaDB server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

The time required to complete a restart depends on the MariaDB recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this how-to guide:

- You need an [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Restart the server

Restart the server with the following command:

```azurecli-interactive
az mariadb server restart --name mydemoserver --resource-group myresourcegroup
```

## Next steps

Learn about [how to set parameters in Azure Database for MariaDB](howto-configure-server-parameters-cli.md)
