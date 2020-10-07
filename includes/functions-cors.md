---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---

Azure Functions supports cross-origin resource sharing (CORS). CORS is configured [in the portal](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#cors) and through the [Azure CLI](/cli/azure/functionapp/cors). The CORS allowed origins list applies at the function app level. With CORS enabled, responses include the `Access-Control-Allow-Origin` header. For more information, see [Cross-origin resource sharing](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#cors). 