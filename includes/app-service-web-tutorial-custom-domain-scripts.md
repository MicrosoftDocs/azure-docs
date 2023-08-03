---
title: "include file"
description: "include file"
services: app-service
author: msangapu-msft
ms.service: app-service
ms.topic: "include"
ms.date: 12/14/2021
ms.author: msangapu
ms.custom: include file
---

You can automate management of custom domains with scripts by using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

# [Azure CLI](#tab/azurecli)
The following command adds a configured custom DNS name to an App Service app.

```azurecli 
az webapp config hostname add \
    --webapp-name <app-name> \
    --resource-group <resource_group_name> \
    --hostname <fully_qualified_domain_name>
``` 

For more information, see [Map a custom domain to a web app](../articles/app-service/scripts/cli-configure-custom-domain.md).

# [PowerShell](#tab/powershell)

The following command adds a configured custom DNS name to an App Service app.

```powershell  
Set-AzWebApp `
    -Name <app-name> `
    -ResourceGroupName <resource_group_name> ` 
    -HostNames @("<fully_qualified_domain_name>","<app-name>.azurewebsites.net")
```

For more information, see [Assign a custom domain to a web app](../articles/app-service/scripts/powershell-configure-custom-domain.md).

-----
