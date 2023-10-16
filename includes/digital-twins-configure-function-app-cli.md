---
author: baanders
description: include file describing how to configure an Azure function to work with Azure Digital Twins - CLI instructions
ms.service: digital-twins
ms.topic: include
ms.date: 6/16/2022
ms.author: baanders
---

Run the following commands in [Azure Cloud Shell](https://shell.azure.com) or a [local Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [digital-twins-permissions-required.md](digital-twins-permissions-required.md)]

#### Assign an access role

The Azure function requires a bearer token to be passed to it. To make sure the bearer token is passed, grant the function app the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance, which will give the function app permission to perform data plane activities on the instance.

1. Use the following command to create a [system-managed identity](../articles/active-directory/managed-identities-azure-resources/overview.md) for your function (if the function already has one, this command will print its details). Take note of the `principalId` field in the output. You'll use this ID to refer to the function so that you can grant it permissions in the next step.

    ```azurecli-interactive	
    az functionapp identity assign --resource-group <your-resource-group> --name <your-function-app-name>	
    ```

1. Use the `principalId` value in the following command to give the function the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

#### Configure application settings

Next, make the URL of your Azure Digital Twins instance accessible to your function by setting an [environment variable](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#use-application-settings) for it.

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your instance's host name. To see the host name, along with all the properties of your instance, run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

The following command sets an environment variable for your instance's URL that your function will use whenever it needs to access the instance.

```azurecli-interactive	
az functionapp config appsettings set --resource-group <your-resource-group> --name <your-function-app-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```