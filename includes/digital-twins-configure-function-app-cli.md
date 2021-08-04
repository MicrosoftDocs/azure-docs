---
author: baanders
description: include file describing how to configure an Azure function to work with Azure Digital Twins - CLI instructions
ms.service: digital-twins
ms.topic: include
ms.date: 7/20/2021
ms.author: baanders
---

Run these commands in [Azure Cloud Shell](https://shell.azure.com) or a [local Azure CLI installation](/cli/azure/install-azure-cli).
You can use the function app's system-managed identity to give it the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance. The role gives the function app permission in the instance to perform data plane activities. Then make the URL of the instance accessible to your function by setting an environment variable.

#### Assign an access role

[!INCLUDE [digital-twins-permissions-required.md](digital-twins-permissions-required.md)]

The Azure function requires a bearer token to be passed to it. If the bearer token isn't passed, the function app can't authenticate with Azure Digital Twins. 

To make sure the bearer token is passed, set up [managed identities](../articles/active-directory/managed-identities-azure-resources/overview.md) permissions so the function app can access Azure Digital Twins. You only need to set up these permissions once for each function app.


1. Use the following command to see the details of the system-managed identity for the function. Take note of the `principalId` field in the output.

    ```azurecli-interactive	
    az functionapp identity show --resource-group <your-resource-group> --name <your-function-app-name>	
    ```

    >[!NOTE]
    > If the result is empty instead of showing identity details, create a new system-managed identity for the function by using this command:
    > 
    >```azurecli-interactive	
    >az functionapp identity assign --resource-group <your-resource-group> --name <your-function-app-name>	
    >```
    >
    > The output displays details of the identity, including the `principalId` value required for the next step. 

1. Use the `principalId` value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

#### Configure application settings

Make the URL of your **Azure Digital Twins instance** accessible to your function by setting an environment variable for it. For more information about environment variables, see [Manage your function app](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your instance's host name. To see the host name, along with all the properties of your instance, run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set --resource-group <your-resource-group> --name <your-function-app-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```