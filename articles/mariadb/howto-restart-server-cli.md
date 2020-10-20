---
title: Restart server - Azure CLI - Azure Database for MariaDB
description: This article describes how you can restart an Azure Database for MariaDB server using the Azure CLI.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: how-to
ms.date: 3/18/2020 
ms.custom: devx-track-azurecli
---

# Restart Azure Database for MariaDB server using the Azure CLI
This topic describes how you can restart an Azure Database for MariaDB server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

The time required to complete a restart depends on the MariaDB recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - You need an [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md)

 - This article requires version 2.0 or later of the Azure CLI. Run [az version](/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).


## Restart the server

Restart the server with the following command:

```azurecli-interactive
az mariadb server restart --name mydemoserver --resource-group myresourcegroup
```

## Next steps

Learn about [how to set parameters in Azure Database for MariaDB](howto-configure-server-parameters-cli.md)
