---
title: Restart server - Azure PowerShell - Azure Database for PostgreSQL
description: This article describes how you can restart an Azure Database for PostgreSQL server using PowerShell.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/08/2020
---

# Restart Azure Database for PostgreSQL server using PowerShell

This topic describes how you can restart an Azure Database for PostgreSQL server. You may need to restart
your server for maintenance reasons, which causes a short outage during the operation.

The server restart is blocked if the service is busy. For example, the service may be processing a
previously requested operation such as scaling vCores.

The amount of time required to complete a restart depends on the PostgreSQL recovery process. To reduce
the restart time, we recommend you minimize the amount of activity occurring on the server before
the restart.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for PostgreSQL server](quickstart-create-postgresql-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.PostgreSql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.PostgreSql -AllowPrerelease`.
> Once the Az.PostgreSql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Restart the server

Restart the server with the following command:

```azurepowershell-interactive
Restart-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Database for PostgreSQL server using PowerShell](quickstart-create-postgresql-server-database-using-azure-powershell.md)
