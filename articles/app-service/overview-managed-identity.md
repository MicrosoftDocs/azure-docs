---
title: Managed identities
description: Learn how managed identities work in Azure App Service and Azure Functions, how to configure a managed identity and generate a token for a back-end resource.
author: mattchenderson

ms.topic: article
ms.date: 05/27/2020
ms.author: mahender
ms.reviewer: yevbronsh
ms.custom: tracking-python

---

# How to use managed identities for App Service and Azure Functions

This topic shows you how to create a managed identity for App Service and Azure Functions applications and how to use it to access other resources. 

> [!Important] 
> Managed identities for App Service and Azure Functions won't behave as expected if your app is migrated across subscriptions/tenants. The app needs to obtain a new identity, which is done by disabling and re-enabling the feature. See [Removing an identity](#remove) below. Downstream resources also need to have access policies updated to use the new identity.

[!INCLUDE [app-service-managed-identities](../../includes/app-service-managed-identities.md)]

## Add a system-assigned identity

Creating an app with a system-assigned identity requires an additional property to be set on the application.

### Using the Azure portal

To set up a managed identity in the portal, you will first create an application as normal and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.

2. If using a function app, navigate to **Platform features**. For other app types, scroll down to the **Settings** group in the left navigation.

3. Select **Identity**.

4. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Managed identity in App Service](media/app-service-managed-service-identity/system-assigned-managed-identity-in-azure-portal.png)


> [!NOTE] 
> To find the managed identity for your web or slot app in the Azure portal, go to the User settings section under Enterprise applications.


### Using the Azure CLI

To set up a managed identity using the Azure CLI, you will need to use the `az webapp identity assign` command against an existing application. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top-right corner of each code block below.
- [Install the latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.31 or later) if you prefer to use a local CLI console. 

The following steps will walk you through creating a web app and assigning it an identity using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account that's associated with the Azure subscription under which you would like to deploy the application:

    ```azurecli-interactive
    az login
    ```

2. Create a web application using the CLI. For more examples of how to use the CLI with App Service, see [App Service CLI samples](../app-service/samples-cli.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location westus
    az appservice plan create --name myPlan --resource-group myResourceGroup --sku S1
    az webapp create --name myApp --resource-group myResourceGroup --plan myPlan
    ```

3. Run the `identity assign` command to create the identity for this application:

    ```azurecli-interactive
    az webapp identity assign --name myApp --resource-group myResourceGroup
    ```

### Using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following steps will walk you through creating an app and assigning it an identity using Azure PowerShell. The instructions for creating a web app and a function app are different.

#### Using Azure PowerShell for a web app

1. If needed, install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzAccount` to create a connection with Azure.

2. Create a web application using Azure PowerShell. For more examples of how to use Azure PowerShell with App Service, see [App Service PowerShell samples](../app-service/samples-powershell.md):

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name $resourceGroupName -Location $location

    # Create an App Service plan in Free tier.
    New-AzAppServicePlan -Name $webappname -Location $location -ResourceGroupName $resourceGroupName -Tier Free

    # Create a web app.
    New-AzWebApp -Name $webappname -Location $location -AppServicePlan $webappname -ResourceGroupName $resourceGroupName
    ```

3. Run the `Set-AzWebApp -AssignIdentity` command to create the identity for this application:

    ```azurepowershell-interactive
    Set-AzWebApp -AssignIdentity $true -Name $webappname -ResourceGroupName $resourceGroupName 
    ```

#### Using Azure PowerShell for a function app

1. If needed, install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzAccount` to create a connection with Azure.

2. Create a function app using Azure PowerShell. For more examples of how to use Azure PowerShell with Azure Functions, see the [Az.Functions reference](https://docs.microsoft.com/powershell/module/az.functions/?view=azps-4.1.0#functions):

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name $resourceGroupName -Location $location

    # Create a storage account.
    New-AzStorageAccount -Name $storageAccountName -ResourceGroupName $resourceGroupName -SkuName $sku

    # Create a function app with a system-assigned identity.
    New-AzFunctionApp -Name $functionAppName -ResourceGroupName $resourceGroupName -Location $location -StorageAccountName $storageAccountName -Runtime $runtime -IdentityType SystemAssigned
    ```

You can also update an existing function app using `Update-AzFunctionApp` instead.

### Using an Azure Resource Manager template

An Azure Resource Manager template can be used to automate deployment of your Azure resources. To learn more about deploying to App Service and Functions, see [Automating resource deployment in App Service](../app-service/deploy-complex-application-predictably.md) and [Automating resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

Any resource of type `Microsoft.Web/sites` can be created with an identity by including the following property in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In this case, the `type` property would be `SystemAssigned,UserAssigned`

Adding the system-assigned type tells Azure to create and manage the identity for your application.

For example, a web app might look like the following:

```json
{
    "apiVersion": "2016-08-01",
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

When the site is created, it has the following additional properties:

```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<TENANTID>",
    "principalId": "<PRINCIPALID>"
}
```

The tenantId property identifies what Azure AD tenant the identity belongs to. The principalId is a unique identifier for the application's new identity. Within Azure AD, the service principal has the same name that you gave to your App Service or Azure Functions instance.

## Add a user-assigned identity

Creating an app with a user-assigned identity requires that you create the identity and then add its resource identifier to your app config.

### Using the Azure portal

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Create an app in the portal as you normally would. Navigate to it in the portal.

3. If using a function app, navigate to **Platform features**. For other app types, scroll down to the **Settings** group in the left navigation.

4. Select **Identity**.

5. Within the **User assigned** tab, click **Add**.

6. Search for the identity you created earlier and select it. Click **Add**.

    ![Managed identity in App Service](media/app-service-managed-service-identity/user-assigned-managed-identity-in-azure-portal.png)

### Using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following steps will walk you through creating an app and assigning it an identity using Azure PowerShell.

> [!NOTE]
> The current version of the Azure PowerShell commandlets for Azure App Service do not support user-assigned identities. The below instructions are for Azure Functions.

1. If needed, install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzAccount` to create a connection with Azure.

2. Create a function app using Azure PowerShell. For more examples of how to use Azure PowerShell with Azure Functions, see the [Az.Functions reference](https://docs.microsoft.com/powershell/module/az.functions/?view=azps-4.1.0#functions). The below script also makes use of `New-AzUserAssignedIdentity` which must be installed separately as per [Create, list or delete a user-assigned managed identity using Azure PowerShell](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md).

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name $resourceGroupName -Location $location

    # Create a storage account.
    New-AzStorageAccount -Name $storageAccountName -ResourceGroupName $resourceGroupName -SkuName $sku

    # Create a user-assigned identity. This requires installation of the "Az.ManagedServiceIdentity" module.
    $userAssignedIdentity = New-AzUserAssignedIdentity -Name $userAssignedIdentityName -ResourceGroupName $resourceGroupName

    # Create a function app with a user-assigned identity.
    New-AzFunctionApp -Name $functionAppName -ResourceGroupName $resourceGroupName -Location $location -StorageAccountName $storageAccountName -Runtime $runtime -IdentityType UserAssigned -IdentityId $userAssignedIdentity.Id
    ```

You can also update an existing function app using `Update-AzFunctionApp` instead.

### Using an Azure Resource Manager template

An Azure Resource Manager template can be used to automate deployment of your Azure resources. To learn more about deploying to App Service and Functions, see [Automating resource deployment in App Service](../app-service/deploy-complex-application-predictably.md) and [Automating resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

Any resource of type `Microsoft.Web/sites` can be created with an identity by including the following block in the resource definition, replacing `<RESOURCEID>` with the resource ID of the desired identity:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<RESOURCEID>": {}
    }
}
```

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In this case, the `type` property would be `SystemAssigned,UserAssigned`

Adding the user-assigned type tells Azure to use the user-assigned identity specified for your application.

For example, a web app might look like the following:

```json
{
    "apiVersion": "2016-08-01",
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

When the site is created, it has the following additional properties:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<RESOURCEID>": {
            "principalId": "<PRINCIPALID>",
            "clientId": "<CLIENTID>"
        }
    }
}
```

The principalId is a unique identifier for the identity that's used for Azure AD administration. The clientId is a unique identifier for the application's new identity that's used for specifying which identity to use during runtime calls.

## Obtain tokens for Azure resources

An app can use its managed identity to get tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens represent the application accessing the resource, and not any specific user of the application. 

You may need to configure the target resource to allow access from your application. For example, if you request a token to access Key Vault, you need to make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 8 hours. If you update the access policy of a particular target resource and immediately retrieve a token for that resource, you may continue to get a cached token with outdated permissions until that token expires. There's currently no way to force a token refresh.

There is a simple REST protocol for obtaining a token in App Service and Azure Functions. This can be used for all applications and languages. For .NET and Java, the Azure SDK provides an abstraction over this protocol and facilitates a local development experience.

### Using the REST protocol

An app with a managed identity has two environment variables defined:

- IDENTITY_ENDPOINT - the URL to the local token service.
- IDENTITY_HEADER - a header used to help mitigate server-side request forgery (SSRF) attacks. The value is rotated by the platform.

The **IDENTITY_ENDPOINT** is a local URL from which your app can request tokens. To get a token for a resource, make an HTTP GET request to this endpoint, including the following parameters:

> | Parameter name    | In     | Description                                                                                                                                                                                                                                                                                                                                |
> |-------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | resource          | Query  | The Azure AD resource URI of the resource for which a token should be obtained. This could be one of the [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) or any other resource URI.    |
> | api-version       | Query  | The version of the token API to be used. Please use "2019-08-01" or later.                                                                                                                                                                                                                                                                 |
> | X-IDENTITY-HEADER | Header | The value of the IDENTITY_HEADER environment variable. This header is used to help mitigate server-side request forgery (SSRF) attacks.                                                                                                                                                                                                    |
> | client_id         | Query  | (Optional) The client ID of the user-assigned identity to be used. Cannot be used on a request that includes `principal_id`, `mi_res_id`, or `object_id`. If all ID parameters  (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                             |
> | principal_id      | Query  | (Optional) The principal ID of the user-assigned identity to be used. `object_id` is an alias that may be used instead. Cannot be used on a request that includes client_id, mi_res_id, or object_id. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`)  are omitted, the system-assigned identity is used. |
> | mi_res_id         | Query  | (Optional) The Azure resource ID of the user-assigned identity to be used. Cannot be used on a request that includes `principal_id`, `client_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                      |

> [!IMPORTANT]
> If you are attempting to obtain tokens for user-assigned identities, you must include one of the optional properties. Otherwise the token service will attempt to obtain a token for a system-assigned identity, which may or may not exist.

A successful 200 OK response includes a JSON body with the following properties:

> | Property name | Description                                                                                                                                                                                                                                        |
> |---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | access_token  | The requested access token. The calling web service can use this token to authenticate to the receiving web service.                                                                                                                               |
> | client_id     | The client ID of the identity that was used.                                                                                                                                                                                                       |
> | expires_on    | The timespan when the access token expires. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC" (corresponds to the token's `exp` claim).                                                                                |
> | not_before    | The timespan when the access token takes effect, and can be accepted. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC" (corresponds to the token's `nbf` claim).                                                      |
> | resource      | The resource the access token was requested for, which matches the `resource` query string parameter of the request.                                                                                                                               |
> | token_type    | Indicates the token type value. The only type that Azure AD supports is FBearer. For more information about bearer tokens, see [The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt). |

This response is the same as the [response for the Azure AD service-to-service access token request](../active-directory/develop/v1-oauth2-client-creds-grant-flow.md#service-to-service-access-token-response).

> [!NOTE]
> An older version of this protocol, using the "2017-09-01" API version, used the `secret` header instead of `X-IDENTITY-HEADER` and only accepted the `clientid` property for user-assigned. It also returned the `expires_on` in a timestamp format. MSI_ENDPOINT can be used as an alias for IDENTITY_ENDPOINT, and MSI_SECRET can be used as an alias for IDENTITY_HEADER.

### REST protocol examples

An example request might look like the following:

```http
GET /MSI/token?resource=https://vault.azure.net&api-version=2019-08-01 HTTP/1.1
Host: localhost:4141
X-IDENTITY-HEADER: 853b9a84-5bfa-4b22-a3f3-0b9a43d9ad8a
```

And a sample response might look like the following:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "access_token": "eyJ0eXAi…",
    "expires_on": "1586984735",
    "resource": "https://vault.azure.net",
    "token_type": "Bearer",
    "client_id": "5E29463D-71DA-4FE0-8E69-999B57DB23B0"
}
```

### Code examples

# [.NET](#tab/dotnet)

> [!TIP]
> For .NET languages, you can also use [Microsoft.Azure.Services.AppAuthentication](#asal) instead of crafting this request yourself.

```csharp
private readonly HttpClient _client;
// ...
public async Task<HttpResponseMessage> GetToken(string resource)  {
    var request = new HttpRequestMessage(HttpMethod.Get, 
        String.Format("{0}/?resource={1}&api-version=2019-08-01", Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT"), resource));
    request.Headers.Add("X-IDENTITY-HEADER", Environment.GetEnvironmentVariable("IDENTITY_HEADER"));
    return await _client.SendAsync(request);
}
```

# [JavaScript](#tab/javascript)

```javascript
const rp = require('request-promise');
const getToken = function(resource, cb) {
    let options = {
        uri: `${process.env["IDENTITY_ENDPOINT"]}/?resource=${resource}&api-version=2019-08-01`,
        headers: {
            'X-IDENTITY-HEADER': process.env["IDENTITY_HEADER"]
        }
    };
    rp(options)
        .then(cb);
}
```

# [Python](#tab/python)

```python
import os
import requests

identity_endpoint = os.environ["IDENTITY_ENDPOINT"]
identity_header = os.environ["IDENTITY_HEADER"]

def get_bearer_token(resource_uri):
    token_auth_uri = f"{identity_endpoint}?resource={resource_uri}&api-version=2019-08-01"
    head_msi = {'X-IDENTITY-HEADER':identity_header}

    resp = requests.get(token_auth_uri, headers=head_msi)
    access_token = resp.json()['access_token']

    return access_token
```

# [PowerShell](#tab/powershell)

```powershell
$resourceURI = "https://<AAD-resource-URI-for-resource-to-obtain-token>"
$tokenAuthURI = $env:IDENTITY_ENDPOINT + "?resource=$resourceURI&api-version=2019-08-01"
$tokenResponse = Invoke-RestMethod -Method Get -Headers @{"X-IDENTITY-HEADER"="$env:IDENTITY_HEADER"} -Uri $tokenAuthURI
$accessToken = $tokenResponse.access_token
```

---

### <a name="asal"></a>Using the Microsoft.Azure.Services.AppAuthentication library for .NET

For .NET applications and functions, the simplest way to work with a managed identity is through the Microsoft.Azure.Services.AppAuthentication package. This library will also allow you to test your code locally on your development machine, using your user account from Visual Studio, the [Azure CLI](/cli/azure), or Active Directory Integrated Authentication. For more on local development options with this library, see the [Microsoft.Azure.Services.AppAuthentication reference]. This section shows you how to get started with the library in your code.

1. Add references to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) and any other necessary NuGet packages to your application. The below example also uses [Microsoft.Azure.KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault).

2. Add the following code to your application, modifying to target the correct resource. This example shows two ways to work with Azure Key Vault:

    ```csharp
    using Microsoft.Azure.Services.AppAuthentication;
    using Microsoft.Azure.KeyVault;
    // ...
    var azureServiceTokenProvider = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync("https://vault.azure.net");
    // OR
    var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
    ```

To learn more about Microsoft.Azure.Services.AppAuthentication and the operations it exposes, see the [Microsoft.Azure.Services.AppAuthentication reference] and the [App Service and KeyVault with MSI .NET sample](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet).

### Using the Azure SDK for Java

For Java applications and functions, the simplest way to work with a managed identity is through the [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java). This section shows you how to get started with the library in your code.

1. Add a reference to the [Azure SDK library](https://mvnrepository.com/artifact/com.microsoft.azure/azure). For Maven projects, you might add this snippet to the `dependencies` section of the project's POM file:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure</artifactId>
        <version>1.23.0</version>
    </dependency>
    ```

2. Use the `AppServiceMSICredentials` object for authentication. This example shows how this mechanism may be used for working with Azure Key Vault:

    ```java
    import com.microsoft.azure.AzureEnvironment;
    import com.microsoft.azure.management.Azure;
    import com.microsoft.azure.management.keyvault.Vault
    //...
    Azure azure = Azure.authenticate(new AppServiceMSICredentials(AzureEnvironment.AZURE))
            .withSubscription(subscriptionId);
    Vault myKeyVault = azure.vaults().getByResourceGroup(resourceGroup, keyvaultName);

    ```


## <a name="remove"></a>Remove an identity

A system-assigned identity can be removed by disabling the feature using the portal, PowerShell, or CLI in the same way that it was created. User-assigned identities can be removed individually. To remove all identities, set the identity type to "None".

Removing a system-assigned identity in this way will also delete it from Azure AD. System-assigned identities are also automatically removed from Azure AD when the app resource is deleted.

To remove all identities in an [ARM template](#using-an-azure-resource-manager-template):

```json
"identity": {
    "type": "None"
}
```

To remove all identities in Azure PowerShell (Azure Functions only):

```azurepowershell-interactive
# Update an existing function app to have IdentityType "None".
Update-AzFunctionApp -Name $functionAppName -ResourceGroupName $resourceGroupName -IdentityType None
```

> [!NOTE]
> There is also an application setting that can be set, WEBSITE_DISABLE_MSI, which just disables the local token service. However, it leaves the identity in place, and tooling will still show the managed identity as "on" or "enabled." As a result, use of this setting is not recommended.

## Next steps

> [!div class="nextstepaction"]
> [Access SQL Database securely using a managed identity](app-service-web-tutorial-connect-msi.md)

[Microsoft.Azure.Services.AppAuthentication reference]: https://go.microsoft.com/fwlink/p/?linkid=862452
