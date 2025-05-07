---
title: "include file"
description: "include file"
services: app-service
author: msangapu-msft
ms.service: azure-app-service
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
$subscriptionId = "<subscription_ID>"
$resourceGroup = "<resource_group>"
$appName = "<app_name>"
$hostname = "<fully_qualified_domain_name>"
$apiVersion = "2024-04-01"
 
$restApiPath = "/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.Web/sites/{2}/hostNameBindings/{3}?api-version={4}" `
    -f $subscriptionId, $resourceGroup, $appName, $hostname, $apiVersion
 
Invoke-AzRestMethod -Method PUT -Path $restApiPath
```

For more information, see [Assign a custom domain to a web app](../articles/app-service/scripts/powershell-configure-custom-domain.md).

-----


