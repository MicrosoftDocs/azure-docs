---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/04/2023
ms.author: glenga
---

## <a name="local-settings"></a>Work with app settings locally

When running in a function app in Azure, settings required by your functions are [stored securely in app settings](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings). During local development, these settings are instead added to the `Values` object in the local.settings.json file. The local.settings.json file also stores settings used by local development tools. 

Because the local.settings.json may contain secrets, such as connection strings, you should never store it in a remote repository. Core Tools helps you encrypt this local settings file for improved security. For more information, see [Local settings file](../articles/azure-functions/functions-develop-local.md#local-settings-file).