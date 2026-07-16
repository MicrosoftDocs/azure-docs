---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/12/2026
ms.author: glenga
---

To disable host-based authentication in your MCP server, add a setting named `AzureFunctionsJobHost__extensions__mcp__system__webhookAuthorizationLevel` with a value of `Anonymous` to your application settings. You can add this setting in the portal or use the following Azure CLI command:

```azurecli
az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --settings "AzureFunctionsJobHost__extensions__mcp__system__webhookAuthorizationLevel=Anonymous"
```

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group.

>[!TIP]  
>This setting is equivalent to setting `system.webhookAuthorizationLevel` to `Anonymous` in the MCP Extension section of the `host.json` file. However, that method requires you to republish your server project. 