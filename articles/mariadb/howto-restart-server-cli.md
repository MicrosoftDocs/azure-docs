---
title: Restart Azure Database for MariaDB server using Azure CLI
description: This article describes how you can restart an Azure Database for MariaDB server using the Azure CLI.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 3/28/2019
---

# Restart Azure Database for MariaDB server using the Azure CLI
This topic describes how you can restart an Azure Database for MariaDB server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

The time required to complete a restart depends on the MariaDB recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> This how-to guide requires that you use Azure CLI version 2.0 or later. To confirm the version, at the Azure CLI command prompt, enter `az --version`. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## Restart the server

Restart the server with the following command:

```azurecli-interactive
az mariadb server restart --name mydemoserver --resource-group myresourcegroup
```

## Next steps

Learn about [how to set parameters in Azure Database for MariaDB](howto-configure-server-parameters-cli.md)