---
title: Restart Azure Database for PostgreSQL using PowerShell
description: Learn how to restart an Azure Database for PostgreSQL server using PowerShell.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
ms.custom: kr2b-contr-experiment
---

# Restart an Azure Database for PostgreSQL server using PowerShell

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This topic describes how you can restart an Azure Database for PostgreSQL server. You may need to restart your server for maintenance reasons, which causes a short outage during the operation.

The server restart is blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

> [!NOTE] 
> The time required to complete a restart depends on the PostgreSQL recovery process. To decrease the restart time, we recommend that you minimize the amount of activity on the server prior to the restart. You may also want to increase the checkpoint frequency. As well, you can tune checkpoint related parameter values including `max_wal_size`. It is also recommended to run `CHECKPOINT` command prior to restarting the server.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for PostgreSQL server](quickstart-create-postgresql-server-database-using-azure-powershell.md)

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Restart the server

Enter the following command to restart the server:

```azurepowershell-interactive
Restart-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Database for PostgreSQL server using PowerShell](quickstart-create-postgresql-server-database-using-azure-powershell.md)
