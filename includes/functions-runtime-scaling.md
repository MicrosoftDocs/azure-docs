---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/10/2022
ms.author: glenga
---

# [Azure portal](#tab/portal)

1. In the Azure portal, in your function app, select **Configuration**.
1. On the **Function runtime settings** tab, for **Runtime Scale Monitoring**, select **On**.

   :::image type="content" source="../articles/azure-functions/media/functions-create-vnet/11-enable-runtime-scaling.png" alt-text="Screenshot of the Azure portal area for enabling runtime scaling.":::

# [Azure CLI](#tab/azure-cli)

Use the following Azure CLI command to enable runtime scale monitoring:

```azurecli-interactive
az resource update -g <RESOURCE_GROUP> -n <FUNCTION_APP_NAME>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

---
