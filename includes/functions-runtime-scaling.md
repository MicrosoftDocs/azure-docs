---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/10/2022
ms.author: glenga
---

# [Azure portal](#tab/portal)

In the Azure portal, in your function app, choose **Configuration** and on the **Function runtime settings** tab turn **Runtime scale monitoring** to **On**.

:::image type="content" source="../articles/azure-functions/media/functions-create-vnet/11-enable-runtime-scaling.png" alt-text="Screenshot of Azure portal panel to enable runtime scaling."::: 

# [Azure CLI](#tab/azure-cli)

Use the following Azure CLI command to enable runtime scale monitoring:

```azurecli-interactive
az resource update -g <RESOURCE_GROUP> -n <FUNCTION_APP_NAME>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

---