---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 01/21/2025
ms.author: danlep
ms.custom: Include file
---

## Delete an integration

While an API source is integrated, you can't delete synchronized APIs from your API center. If you need to, you can delete the integration. When you delete an integration:

* The synchronized APIs in your API center inventory are deleted
* The environment and deployments associated with the API source are deleted

You can delete an integration using the portal or the Azure CLI. 

#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments** > **Integrations (preview)**.
1. Select the integration, and then select **Delete** (trash can icon). 

#### [Azure CLI](#tab/cli)

Run the [az apic integration delete](/cli/azure/apic/integration#az-apic-integration-delete) (preview) command to delete an integration. Provide the names of the resource group, API center, and integration.

```azurecli
az apic integration delete \
    --resource-group <resource-group-name> \
    --service-name <api-center-name> \
    --integration-name <integration-name> \
```
---