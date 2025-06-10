---
title: Managed Identities
description: Learn how managed identities work in Azure App Service and Azure Functions and how to configure a managed identity and generate a token for a back-end resource.
ms.topic: how-to
ms.date: 03/27/2025
ms.reviewer: yevbronsh,mahender
author: cephalin
ms.author: cephalin
ms.custom: devx-track-csharp, devx-track-azurepowershell, devx-track-azurecli, AppServiceConnectivity, ai-video-demo
ai-usage: ai-assisted
#customer intent: As an App developer, I want to understand how to manager system-assigned and user-assigned identities for apps in Azure App Service.
---

# Use managed identities for App Service and Azure Functions

This article shows you how to create a managed identity for Azure App Service and Azure Functions applications, and how to use it to access other resources.

[!INCLUDE [app-service-managed-identities](../../includes/app-service-managed-identities.md)]

The managed identity configuration is specific to the slot. To configure a managed identity for a deployment slot in the portal, go to the slot first. To find the managed identity for your web app or deployment slot in your Microsoft Entra tenant from the Azure portal, search for it directly from the **Overview** page of your tenant.

> [!NOTE]
> Managed identities aren't available for [apps deployed in Azure Arc](overview-arc-integration.md).
>
> Because [managed identities don't support cross-directory scenarios](../active-directory/managed-identities-azure-resources/managed-identities-faq.md#can-i-use-a-managed-identity-to-access-a-resource-in-a-different-directorytenant), they don't behave as expected if your app is migrated across subscriptions or tenants. To re-create the managed identities after such a move, see [Will managed identities be re-created automatically if I move a subscription to another directory?](../active-directory/managed-identities-azure-resources/managed-identities-faq.md#will-managed-identities-be-recreated-automatically-if-i-move-a-subscription-to-another-directory). Downstream resources also need to have access policies updated to use the new identity.

## Prerequisites

To perform the steps in this article, you must have a minimum set of permissions over your Azure resources. The specific permissions that you need vary based on your scenario. The following table summarizes the most common scenarios:

| Scenario | Required permission | Example built-in roles |
|:-|:-|:-|
| [Create a system-assigned identity](#add-a-system-assigned-identity) | `Microsoft.Web/sites/write` over the app, or `Microsoft.Web/sites/slots/write` over the slot | [Website Contributor] |
| [Create a user-assigned identity][create-user-assigned] | `Microsoft.ManagedIdentity/userAssignedIdentities/write` over the resource group in which to create the identity | [Managed Identity Contributor] |
| [Assign a user-assigned identity to your app](#add-a-user-assigned-identity) | `Microsoft.Web/sites/write` over the app, `Microsoft.Web/sites/slots/write` over the slot, or <br/>`Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action` over the identity | [Website Contributor] and [Managed Identity Operator] |
| [Create Azure role assignments][role-assignment] | `Microsoft.Authorization/roleAssignments/write` over the target resource scope | [Role Based Access Control Administrator] or [User Access Administrator] |

## Add a system-assigned identity

To enable a system-assigned managed identity, use the following instructions.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your app's page.

1. On the left menu, select **Settings** > **Identity**.

1. On the **System assigned** tab, switch **Status** to **On**. Then select **Save**.

# [Azure CLI](#tab/cli)

Run the `az webapp identity assign` command:

```azurecli-interactive
az webapp identity assign --resource-group <group-name> --name <app-name> 
```

# [Azure PowerShell](#tab/ps)

#### For App Service

Run the `Set-AzWebApp -AssignIdentity` command:

```azurepowershell-interactive
Set-AzWebApp -AssignIdentity $true -ResourceGroupName <group-name>  -Name <app-name>
```

#### For Functions

Run the `Update-AzFunctionApp -IdentityType` command:

```azurepowershell-interactive
Update-AzFunctionApp -ResourceGroupName <group-name> -Name <function-app-name>  -IdentityType SystemAssigned
```

# [ARM template](#tab/arm)

You can use an Azure Resource Manager template to automate deployment of your Azure resources. To learn more, see [Automate resource deployment in App Service](../app-service/deploy-complex-application-predictably.md) and [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

You can create any resource of type `Microsoft.Web/sites` with an identity by including the following property in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

Adding the system-assigned type tells Azure to create and manage the identity for your application.

For example, a web app's template might look like the following JSON:

```json
{
    "apiVersion": "2022-03-01",
    "type": "Microsoft.Web/sites",
    "name": "[variables('appName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "SystemAssigned"
    },
    "properties": {
        "name": "[variables('appName')]",
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "hostingEnvironment": "",
        "clientAffinityEnabled": false,
        "alwaysOn": true
    },
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
    ]
}
```

When the site is created, it includes the following properties:

```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<tenant-id>",
    "principalId": "<principal-id>"
}
```

The `tenantId` property identifies what Microsoft Entra tenant the identity belongs to. The `principalId` property is a unique identifier for the application's new identity. In Microsoft Entra ID, the service principal has the same name that you gave to your App Service or Azure Functions instance.

If you need to refer to these properties in a later stage in the template, use the [`reference()` template function](../azure-resource-manager/templates/template-functions-resource.md#reference) with the `'Full'` option, as in this example:

```json
{
    "tenantId": "[reference(resourceId('Microsoft.Web/sites', variables('appName')), '2018-02-01', 'Full').identity.tenantId]",
    "objectId": "[reference(resourceId('Microsoft.Web/sites', variables('appName')), '2018-02-01', 'Full').identity.principalId]",
}
```

-----

## Add a user-assigned identity

To create an app with a user-assigned identity, create the identity and then add its resource identifier to your app configuration.

# [Azure portal](#tab/portal)

1. Create a user-assigned managed identity resource according to [these instructions][create-user-assigned].

1. On the left menu for your app's page, select **Settings** > **Identity**.

1. Select **User assigned**, then select **Add**.

1. Search for the identity that you created earlier, select it, and then select **Add**.

After you finish these steps, the app restarts.

# [Azure CLI](#tab/cli)

1. Create a user-assigned identity:

    ```azurepowershell-interactive
    az identity create --resource-group <group-name> --name <identity-name>
    ```

1. Run the `az webapp identity assign` command to assign the identity to the app:

    ```azurepowershell-interactive
    az webapp identity assign --resource-group <group-name> --name <app-name> --identities <identity-id>
    ```

# [Azure PowerShell](#tab/ps)

#### For App Service 

Adding a user-assigned identity in App Service by using Azure PowerShell is currently not supported.

#### For Functions

1. Create a user-assigned identity:

    ```azurepowershell-interactive
    Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease
    $userAssignedIdentity = New-AzUserAssignedIdentity -Name <identity-name> -ResourceGroupName <group-name> -Location <region>
    ```

1. Run the `Update-AzFunctionApp -IdentityType UserAssigned -IdentityId` command to assign the identity in Functions:

    ```azurepowershell-interactive
    Update-AzFunctionApp -Name <app-name> -ResourceGroupName <group-name> -IdentityType UserAssigned -IdentityId $userAssignedIdentity.Id
    ```

# [ARM template](#tab/arm)

You can use an Azure Resource Manager template to automate deployment of your Azure resources. To learn more, see [Automate resource deployment in App Service](../app-service/deploy-complex-application-predictably.md) and [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

You can create any resource of type `Microsoft.Web/sites` with an identity by including the following block in the resource definition. Replace `<resource-id>` with the resource ID of the desired identity.

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<resource-id>": {}
    }
}
```

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In that case, the `type` property is `SystemAssigned,UserAssigned`.

Adding the user-assigned type tells Azure to use the user-assigned identity that you specified for your application.

For example, a web app's template might look like the following JSON:

```json
{
    "apiVersion": "2022-03-01",
    "type": "Microsoft.Web/sites",
    "name": "[variables('appName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName'))]": {}
        }
    },
    "properties": {
        "name": "[variables('appName')]",
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "hostingEnvironment": "",
        "clientAffinityEnabled": false,
        "alwaysOn": true
    },
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName'))]"
    ]
}
```

When the site is created, it includes the following properties:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<resource-id>": {
            "principalId": "<principal-id>",
            "clientId": "<client-id>"
        }
    }
}
```

The `principalId` property is a unique identifier for the identity that's used for Microsoft Entra administration. The `clientId` property is a unique identifier for the application's new identity. You use it to specify which identity to use during runtime calls.

-----

## <a name = "configure-target-resource"></a> Configure the target resource

You need to configure the target resource to allow access from your app. For most Azure services, you configure the target resource by [creating a role assignment][role-assignment].

Some services use mechanisms other than Azure role-based access control. To understand how to configure access by using an identity, refer to the documentation for each target resource. To learn more about which resources support Microsoft Entra tokens, see [Azure services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

For example, if you [request a token](#connect-to-azure-services-in-app-code) to access a secret in Azure Key Vault, you must also create a role assignment that allows the managed identity to work with secrets in the target vault. Otherwise, Key Vault rejects your calls even if you use a valid token. The same is true for Azure SQL Database and other services.

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 24 hours. It can take several hours for changes to a managed identity's group or role membership to take effect. It's currently not possible to force a managed identity's token to be refreshed before its expiration. If you change a managed identity's group or role membership to add or remove permissions, you might need to wait several hours for the Azure resource that's using the identity to have the correct access.
>
> For alternatives to groups or role memberships, see [Limitation of using managed identities for authorization](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations#limitation-of-using-managed-identities-for-authorization).

## Connect to Azure services in app code

With its managed identity, an app can get tokens for Azure resources that Microsoft Entra ID helps protect, such as Azure SQL Database, Azure Key Vault, and Azure Storage. These tokens represent the application that accesses the resource, and not any specific user of the application.

App Service and Azure Functions provide an internally accessible [REST endpoint](#rest-endpoint-reference) for token retrieval. You can access the REST endpoint from within the app by using a standard HTTP `GET` request. You can implement the request with a generic HTTP client in every language.

For .NET, JavaScript, Java, and Python, the Azure Identity client library provides an abstraction over this REST endpoint and simplifies the development experience. Connecting to other Azure services is as simple as adding a credential object to the service-specific client.

# [HTTP GET](#tab/http)

A raw HTTP `GET` request uses the [two supplied environment variables](#rest-endpoint-reference) and looks like the following example:

```http
GET /MSI/token?resource=https://vault.azure.net&api-version=2019-08-01 HTTP/1.1
Host: <ip-address-:-port-in-IDENTITY_ENDPOINT>
X-IDENTITY-HEADER: <value-of-IDENTITY_HEADER>
```

A sample response might look like the following example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "access_token": "eyJ0eXAi…",
    "expires_on": "1586984735",
    "resource": "https://vault.azure.net",
    "token_type": "Bearer",
    "client_id": "00001111-aaaa-2222-bbbb-3333cccc4444"
}
```

This response is the same as the [response for the Microsoft Entra service-to-service access token request](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#successful-response). To access Key Vault, add the value of `access_token` to a client connection with the vault.

# [.NET](#tab/dotnet)

> [!NOTE]
> When you connect to Azure SQL data sources by using [Entity Framework Core](/ef/core/), consider using [Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication). That namespace provides special connection strings for managed identity connectivity. For an example, see [Tutorial: Secure an Azure SQL Database connection from App Service by using a managed identity](tutorial-connect-msi-sql-database.md).

For .NET apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme?). For more information, see [Tutorial: Connect to Azure databases from App Service without secrets by using a managed identity](tutorial-connect-msi-azure-database.md).

For more information, see the respective documentation headings of the client library:

- [Add the Azure Identity client library to your project](/dotnet/api/overview/azure/identity-readme#getting-started)
- [Access an Azure service by using a system-assigned identity](/dotnet/api/overview/azure/identity-readme#authenticate-with-defaultazurecredential)
- [Access an Azure service by using a user-assigned identity](/dotnet/api/overview/azure/identity-readme#specify-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential). The same pattern works in Azure with managed identities and on your local machine without managed identities.

# [JavaScript](#tab/javascript)

For Node.js apps and JavaScript functions, the simplest way to work with a managed identity is through the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme?). For more information, see [Tutorial: Connect to Azure databases from App Service without secrets by using a managed identity](tutorial-connect-msi-azure-database.md).

For more information, see the respective documentation headings of the client library:

- [Add an Azure Identity client library to your project](/javascript/api/overview/azure/identity-readme#install-the-package)
- [Access an Azure service by using a system-assigned identity](/javascript/api/overview/azure/identity-readme#authenticate-with-defaultazurecredential)
- [Access an Azure service by using a user-assigned identity](/javascript/api/overview/azure/identity-readme#specify-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential). The same pattern works in Azure with managed identities and on your local machine without managed identities.

For more code examples of the Azure Identity client library for JavaScript, see [Azure Identity examples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md).

# [Python](#tab/python)

For Python apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). For more information, see [Tutorial: Connect to Azure databases from App Service without secrets by using a managed identity](tutorial-connect-msi-azure-database.md).

For more information, see the respective documentation headings of the client library:

- [Add an Azure Identity client library to your project](/python/api/overview/azure/identity-readme#getting-started)
- [Access an Azure service by using a system-assigned identity](/python/api/overview/azure/identity-readme#authenticate-with-defaultazurecredential)
- [Access an Azure service by using a user-assigned identity](/python/api/overview/azure/identity-readme#authenticate-with-a-user-assigned-managed-identity)

The linked examples use [DefaultAzureCredential](/python/api/overview/azure/identity-readme#defaultazurecredential). The same pattern works in Azure with managed identities and on your local machine without managed identities.

# [Java](#tab/java)

For Java apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for Java](/java/api/overview/azure/identity-readme). For more information, see [Tutorial: Connect to Azure databases from App Service without secrets by using a managed identity](tutorial-connect-msi-azure-database.md).

For more information, see the respective documentation headings of the client library:

- [Add an Azure Identity client library to your project](/java/api/overview/azure/identity-readme#include-the-package)
- [Access an Azure service by using a system-assigned identity](/java/api/overview/azure/identity-readme#authenticate-with-defaultazurecredential)
- [Access an Azure service by using a user-assigned identity](/java/api/overview/azure/identity-readme#authenticate-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential). The same pattern works in Azure with managed identities and on your local machine without managed identities.

For more code examples of the Azure Identity client library for Java, see [Azure Identity examples](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-Identity-Examples).

# [PowerShell](#tab/powershell)

Use the following script to retrieve a token from the local endpoint by specifying a resource URI of an Azure service:

```powershell
$resourceURI = "https://<Entra-resource-URI-for-resource-to-obtain-token>"
$tokenAuthURI = $env:IDENTITY_ENDPOINT + "?resource=$resourceURI&api-version=2019-08-01"
$tokenResponse = Invoke-RestMethod -Method Get -Headers @{"X-IDENTITY-HEADER"="$env:IDENTITY_HEADER"} -Uri $tokenAuthURI
$accessToken = $tokenResponse.access_token
```

-----

For more information on the REST endpoint, see [REST endpoint reference](#rest-endpoint-reference) later in this article.

## <a name="remove"></a>Remove an identity

When you remove a system-assigned identity, it's deleted from Microsoft Entra ID. System-assigned identities are also automatically removed from Microsoft Entra ID when you delete the app resource itself.

# [Azure portal](#tab/portal)

1. On the left menu for your app's page, select **Settings** > **Identity**.

1. Follow the steps based on the identity type:

   - For a system-assigned identity: On the **System assigned** tab, switch **Status** to **Off**. Then select **Save**.
   - For a user-assigned identity: Select the **User assigned** tab, select the checkbox for the identity, and then select **Remove**. Select **Yes** to confirm.

# [Azure CLI](#tab/cli)

To remove the system-assigned identity, use this command:

```azurecli-interactive
az webapp identity remove --resource-group <group-name> --name <app-name>
```

To remove one or more user-assigned identities, use this command:

```azurecli-interactive
az webapp identity remove --resource-group <group-name> --name <app-name> --identities <identity-id1> <identity-id2> ...
```

You can also remove the system-assigned identity by specifying `[system]` in `--identities`.

# [Azure PowerShell](#tab/ps)

#### For App Service

To remove a system-assigned identity for App Service, run the `Set-AzWebApp -AssignIdentity` command:

```azurepowershell-interactive
Set-AzWebApp -AssignIdentity $false -Name <app-name> -ResourceGroupName <group-name> 
```

#### For Functions

To remove all identities in Azure PowerShell (Azure Functions only), run this command:

```azurepowershell-interactive
# Update an existing function app to have IdentityType "None".
Update-AzFunctionApp -Name <function-app-name> -ResourceGroupName <group-name> -IdentityType None
```

# [ARM template](#tab/arm)

To remove all identities in an ARM template, use this code:

```json
"identity": {
    "type": "None"
}
```

-----

> [!NOTE]
> You can also set an application setting that disables only the local token service: `WEBSITE_DISABLE_MSI`. However, it leaves the identity in place. Tooling still shows the managed identity as on or enabled. As a result, we don't recommend that you use this setting.

## REST endpoint reference

An app with a managed identity makes this endpoint available by defining two environment variables:

- `IDENTITY_ENDPOINT`: The URL to the local token service.
- `IDENTITY_HEADER`: A header that can help mitigate server-side request forgery (SSRF) attacks. The platform rotates the value.

The `IDENTITY_ENDPOINT` variable is a local URL from which your app can request tokens. To get a token for a resource, make an HTTP `GET` request to this endpoint. Include the following parameters:

> | Parameter name      | In     | Description |
> |:--------------------|:-------|:------------|
> | `resource`          | Query  | The Microsoft Entra resource URI of the resource for which a token should be obtained. This resource could be one of the [Azure services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) or any other resource URI.    |
> | `api-version`       | Query  | The version of the token API to be used. Use `2019-08-01`.   |
> | `X-IDENTITY-HEADER` | Header | The value of the `IDENTITY_HEADER` environment variable. This header is used to help mitigate SSRF attacks. |
> | `client_id`         | Query  | (Optional) The client ID of the user-assigned identity to be used. It can't be used on a request that includes `principal_id`, `mi_res_id`, or `object_id`. If all ID parameters  (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used. |
> | `principal_id`      | Query  | (Optional) The principal ID of the user-assigned identity to be used. The `object_id` parameter is an alias that can be used instead. It can't be used on a request that includes `client_id`, `mi_res_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`)  are omitted, the system-assigned identity is used. |
> | `mi_res_id`         | Query  | (Optional) The Azure resource ID of the user-assigned identity to be used. It can't be used on a request that includes `principal_id`, `client_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used. |

> [!IMPORTANT]
> If you're trying to get tokens for user-assigned identities, include one of the optional properties. Otherwise, the token service tries to get a token for a system-assigned identity, which might or might not exist.

## Related content

Consider the following tutorials:

- [Connect to SQL Database from .NET App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md)
- [Access Azure services from a .NET web app](scenario-secure-app-access-storage.md)
- [Access Microsoft Graph from a secured .NET app as the app](scenario-secure-app-access-microsoft-graph-as-app.md)
- [Secure Cognitive Service connection from .NET App Service using Key Vault](tutorial-connect-msi-key-vault.md)

[create-user-assigned]: /entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity
[role-assignment]: ../role-based-access-control/role-assignments-steps.md
[Managed Identity Contributor]: ../role-based-access-control/built-in-roles/identity.md#managed-identity-contributor
[Managed Identity Operator]: ../role-based-access-control/built-in-roles/identity.md#managed-identity-operator
[Website Contributor]: ../role-based-access-control/built-in-roles/web-and-mobile.md#website-contributor
[Role Based Access Control Administrator]: ../role-based-access-control/built-in-roles/privileged.md#role-based-access-control-administrator
[User Access Administrator]: ../role-based-access-control/built-in-roles/privileged.md#user-access-administrator
