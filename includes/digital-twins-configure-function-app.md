---
author: baanders
description: include file describing how to configure an Azure function to work with Azure Digital Twins
ms.service: digital-twins
ms.topic: include
ms.date: 7/14/2021
ms.author: baanders
---

You can set up security access for the function app by using either the Azure CLI or the Azure portal. Follow the steps for your preferred option.

# [CLI](#tab/cli)

Run these commands in [Azure Cloud Shell](https://shell.azure.com) or a [local Azure CLI installation](/cli/azure/install-azure-cli).
You can use the function app's system-managed identity to give it the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance. The role gives the function app permission in the instance to perform data plane activities. Then make the URL of the instance accessible to your function by setting an environment variable.

### Assign an access role

[!INCLUDE [digital-twins-permissions-required.md](digital-twins-permissions-required.md)]

The Azure function requires a bearer token to be passed to it. If the bearer token isn't passed, the function app can't authenticate with Azure Digital Twins. 

To make sure the bearer token is passed, set up [managed identities](../articles/active-directory/managed-identities-azure-resources/overview.md) permissions so the function app can access Azure Digital Twins. You only need to set up these permissions once for each function app.


1. Use the following command to see the details of the system-managed identity for the function. Take note of the `principalId` field in the output.

    ```azurecli-interactive	
    az functionapp identity show --resource-group <your-resource-group> --name <your-App-Service-function-app-name>	
    ```

    >[!NOTE]
    > If the result is empty instead of showing identity details, create a new system-managed identity for the function by using this command:
    > 
    >```azurecli-interactive	
    >az functionapp identity assign --resource-group <your-resource-group> --name <your-App-Service-function-app-name>	
    >```
    >
    > The output displays details of the identity, including the `principalId` value required for the next step. 

1. Use the `principalId` value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

### Configure application settings

Make the URL of your instance accessible to your function by setting an environment variable for it. For more information about environment variables, see [Manage your function app](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your instance's host name. To see the host name, along with all the properties of your instance, run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set --resource-group <your-resource-group> --name <your-App-Service-function-app-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```

# [Azure portal](#tab/portal)

Complete the following steps in the [Azure portal](https://portal.azure.com/).

### Assign an access role

[!INCLUDE [digital-twins-permissions-required.md](digital-twins-permissions-required.md)]

A system-assigned managed identity enables Azure resources to authenticate to cloud services (for example, Azure Key Vault) without storing credentials in code. After you enable system-assigned managed identity, all necessary permissions can be granted through Azure role-based access control. 

The lifecycle of this type of managed identity is tied to the lifecycle of this resource. Additionally, each resource can have only one system-assigned managed identity.

1. In the [Azure portal](https://portal.azure.com/), search for your function app by typing its name in the search box. Select your app from the results. 

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal. The function app's name is in the portal search bar, and the search result is highlighted.":::

1. On the function app page, in the menu on the left, select __Identity__ to work with a managed identity for the function. On the __System assigned__ page, verify that the __Status__ is set to **On**. If it's not, set it now and then **Save** the change.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/verify-system-managed-identity.png" alt-text="Screenshot of the Azure portal. On the Identity page for the function app, the Status option is set to On." lightbox="../articles/digital-twins/media/how-to-create-azure-function/verify-system-managed-identity.png":::

1. Select __Azure role assignments__.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/add-role-assignment-1.png" alt-text="Screenshot of the Azure portal. On the Azure Function's Identity page, under Permissions, the button Azure role assignments is highlighted." lightbox="../articles/digital-twins/media/how-to-create-azure-function/add-role-assignment-1.png":::

    Select __+ Add role assignment (Preview)__.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/add-role-assignment-2.png" alt-text="Screenshot of the Azure portal. On the Azure role assignments page, the button Add role assignment (Preview) is highlighted." lightbox="../articles/digital-twins/media/how-to-create-azure-function/add-role-assignment-2.png":::

1. On the __Add role assignment (Preview)__ page, select the following values:

    * **Scope**: _Resource group_
    * **Subscription**: Select your Azure subscription.
    * **Resource group**: Select your resource group.
    * **Role**: _Azure Digital Twins Data Owner_

    Save the details by selecting __Save__.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/add-role-assignment-3.png" alt-text="Screenshot of the Azure portal, showing how to add a new role assignment. The dialog shows fields for Scope, Subscription, Resource group, and Role.":::

### Configure application settings

To make the URL of your Azure Digital Twins instance accessible to your function, you can set an environment variable. Application settings are exposed as environment variables to allow access to the Azure Digital Twins instance. For more information about environment variables, see [Manage your function app](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

To set an environment variable with the URL of your instance, first find your instance's host name: 

1. Search for your instance in the [Azure portal](https://portal.azure.com). 
1. In the menu on the left, select __Overview__. 
1. Copy the __Host name__ value.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/instance-host-name.png" alt-text="Screenshot of the Azure portal. On the instance's Overview page, the host name value is highlighted.":::

You can now create an application setting:

1. In the portal search bar, search for your function app and then select it from the results.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal. The function app's name is being searched in the portal search bar. The search result is highlighted.":::

1. On the left, select __Configuration__. Then on the __Application settings__ tab, select __+ New application setting__.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/application-setting.png" alt-text="Screenshot of the Azure portal. On the Configuration tab for the function app, the button to create a New application setting is highlighted.":::

1. In the window that opens, use the host name value you copied to create an application setting.
    * **Name**: ADT_SERVICE_URL
    * **Value**: https://<your-Azure-Digital-Twins-host-name>
    
    Select __OK__ to create an application setting.
    
    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/add-application-setting.png" alt-text="Screenshot of the Azure portal. On the Add/Edit application setting page, the Name and Value fields are filled out. The O K button is highlighted.":::

1. After you create the setting, it should appear on the __Application settings__ tab. Verify that **ADT_SERVICE_URL** appears on the list. Then save the new application setting by selecting __Save__.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/application-setting-save-details.png" alt-text="Screenshot of the Azure portal. On the application settings tab, the new A D T SERVICE URL setting and the Save button are both highlighted.":::

1. Any changes to the application settings require an application restart, so select __Continue__ to restart your application when prompted.

    :::image type="content" source="../articles/digital-twins/media/how-to-create-azure-function/save-application-setting.png" alt-text="Screenshot of the Azure portal. A note states that any changes to application settings will restart your application.":::

---
