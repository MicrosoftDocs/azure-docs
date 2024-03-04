---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/04/2023
ms.author: glenga
---

## <a name="local-settings"></a>Work with app settings locally

When running in a function app in Azure, settings required by your functions are [stored securely in app settings](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings). During local development, these settings are instead added to the `Values` collection in the local.settings.json file. The local.settings.json file also stores settings used by local development tools. 

Items in the `Values` collection in your project's local.settings.json file are intended to mirror items in your function app's [application settings](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings) in Azure.     