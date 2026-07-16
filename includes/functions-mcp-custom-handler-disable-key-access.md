---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/12/2026
ms.author: glenga
---

To disable host-based authentication in your MCP server, add a setting named `AzureFunctionsJobHost__customHandler__http__DefaultAuthorizationLevel` with a value of `anonymous` to your application settings. You can add this setting in the portal or use the following Azure CLI command:

```azurecli
az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --settings "AzureFunctionsJobHost__customHandler__http__DefaultAuthorizationLevel=anonymous"
```

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group.

>[!TIP]  
>This setting is equivalent to setting `http.DefaultAuthorizationLevel` to `anonymous` in the custom handler section of the `host.json` file. That approach requires you to republish your server project. 
