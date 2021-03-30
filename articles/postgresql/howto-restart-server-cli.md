---
title: Restart server - Azure CLI - Azure Database for PostgreSQL - Single Server
description: This article describes how you can restart an Azure Database for PostgreSQL - Single Server using the Azure CLI
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: how-to
ms.date: 5/6/2019 
ms.custom: devx-track-azurecli
---

# Restart Azure Database for PostgreSQL - Single Server using the Azure CLI
This topic describes how you can restart an Azure Database for PostgreSQL server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.
 
> [!NOTE] 
> The time required to complete a restart depends on the PostgreSQL recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart. You may also want to increase the checkpoint frequency. You can also tune checkpoint related parameter values including `max_wal_size`. It is also recommended to run `CHECKPOINT` command prior to restarting the server.

## Prerequisites
To complete this how-to guide:
- Create an [Azure Database for PostgreSQL server](quickstart-create-server-up-azure-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Restart the server

Restart the server with the following command:

```azurecli-interactive
az postgres server restart --name mydemoserver --resource-group myresourcegroup
```

## Next steps

Learn about [how to set parameters in Azure Database for PostgreSQL](howto-configure-server-parameters-using-cli.md)
