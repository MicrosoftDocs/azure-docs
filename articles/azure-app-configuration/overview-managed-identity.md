---
title: Managed identities
description: Learn how managed identities work in Azure App Configuration, how to configure a managed identity and generate a token for a back end resource.
author: jpconnock

ms.topic: article
ms.date: 02/05/2020
ms.author: jeconnoc
ms.reviewer: lcozzens

---

# How to use managed identities for App Service and Azure Functions

> [!Important] 
> Managed identities for Azure App Configuration will not behave as expected if your app is migrated across subscriptions/tenants. The app will need to obtain a new identity, which can be done by disabling and re-enabling the feature. See [Removing an identity](#remove) below. Downstream resources will also need to have access policies updated to use the new identity.

This topic shows you how to create a managed identity for Azure App Configuration applications and how to use it to access other resources. A managed identity from Azure Active Directory (AAD) allows your app to easily access other AAD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in AAD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your application can be granted two types of identities: 
- A **system-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource which can be assigned to your app. An app can have multiple user-assigned identities.

## Adding a system-assigned identity

Creating an app with a system-assigned identity requires an additional property to be set on the application.

### Using the Azure portal

To set up a managed identity in the portal, you will first create an application as normal and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.

2. If using a function app, navigate to **Platform features**. For other app types, scroll down to the **Settings** group in the left navigation.

3. Select **Identity**.

4. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Managed identity in App Service](media/app-service-managed-service-identity/system-assigned-managed-identity-in-azure-portal.png)

### Using the Azure CLI

To set up a managed identity using the Azure CLI, you will need to use the `az azconfig identity assign` command against an existing application. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block below.
- [Install the latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.31 or later) if you prefer to use a local CLI console. 

The following steps will walk you through creating a web app and assigning it an identity using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account that is associated with the Azure subscription under which you would like to deploy the application:

    ```azurecli-interactive
    az login
    ```
2. Create an App Configuration store using the CLI. For more examples of how to use the CLI with Azure App Configuration, see [App Configuration CLI samples](scripts/cli-create-service.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    az appconfig create --name myTestAppConfigStore --location eastus --resource-group myResourceGroup
    ```

3. Run the `identity assign` command to create the identity for this application:

    ```azurecli-interactive
    az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup
    ```

## Adding a user-assigned identity

Creating an app with a user-assigned identity requires that you create the identity and then add its resource identifier to your app config.

### Using the Azure portal

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Create Azure App Configuration resource in the portal as you normally would. Navigate to it in the portal.

3. Scroll down to the **Settings** group in the left navigation.

4. Select **Identity**.

5. Within the **User assigned** tab, click **Add**.

6. Search for the identity you created earlier and select it. Click **Add**.

    ![Managed identity in App Service](media/app-service-managed-service-identity/user-assigned-managed-identity-in-azure-portal.png)

## Obtaining tokens for Azure resources

An app can use its managed identity to get tokens to access other resources protected by AAD, such as Azure Key Vault. These tokens represent the application accessing the resource, and not any specific user of the application.

> [!IMPORTANT]
> You may need to configure the target resource to allow access from your application. For example, if you request a token to access Key Vault, you need to make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

There is a simple REST protocol for obtaining a token in Azure App Configuration. This can be used for all applications and languages. For .NET and Java, the Azure SDK provides an abstraction over this protocol and facilitates a local development experience.

### Using the REST protocol

An app with a managed identity has two environment variables defined:

- MSI_ENDPOINT - the URL to the local token service.
- MSI_SECRET - a header used to help mitigate server-side request forgery (SSRF) attacks. The value is rotated by the platform.

The **MSI_ENDPOINT** is a local URL from which your app can request tokens. To get a token for a resource, make an HTTP GET request to this endpoint, including the following parameters:

> |Parameter name|In|Description|
> |-----|-----|-----|
> |resource|Query|The AAD resource URI of the resource for which a token should be obtained. This could be one of the [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) or any other resource URI.|
> |api-version|Query|The version of the token API to be used. "2017-09-01" is currently the only version supported.|
> |secret|Header|The value of the MSI_SECRET environment variable. This header is used to help mitigate server-side request forgery (SSRF) attacks.|
> |clientid|Query|(Optional unless for user-assigned) The ID of the user-assigned identity to be used. If omitted, the system-assigned identity is used.|

> [!IMPORTANT]
> If you are attempting to obtain tokens for user-assigned identities, you must include the `clientid` property. Otherwise the token service will attempt to obtain a token for a system-assigned identity, which may or may not exist.

A successful 200 OK response includes a JSON body with the following properties:

> |Property name|Description|
> |-------------|----------|
> |access_token|The requested access token. The calling web service can use this token to authenticate to the receiving web service.|
> |expires_on|The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens.|
> |resource|The App ID URI of the receiving web service.|
> |token_type|Indicates the token type value. The only type that Azure AD supports is Bearer. For more information about bearer tokens, see [The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt).|

This response is the same as the [response for the AAD service-to-service access token request](../active-directory/develop/v1-oauth2-client-creds-grant-flow.md#service-to-service-access-token-response).

> [!NOTE]
> Environment variables are set up when the process first starts, so after enabling a managed identity for your application, you may need to restart your application, or redeploy its code, before `MSI_ENDPOINT` and `MSI_SECRET` are available to your code.

### REST protocol examples

An example request might look like the following:

```
GET /MSI/token?resource=https://vault.azure.net&api-version=2017-09-01 HTTP/1.1
Host: localhost:4141
Secret: 853b9a84-5bfa-4b22-a3f3-0b9a43d9ad8a
```

And a sample response might look like the following:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "access_token": "eyJ0eXAi…",
    "expires_on": "09/14/2017 00:00:00 PM +00:00",
    "resource": "https://vault.azure.net",
    "token_type": "Bearer"
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
        String.Format("{0}/?resource={1}&api-version=2017-09-01", Environment.GetEnvironmentVariable("MSI_ENDPOINT"), resource));
    request.Headers.Add("Secret", Environment.GetEnvironmentVariable("MSI_SECRET"));
    return await _client.SendAsync(request);
}
```

# [JavaScript](#tab/javascript)

```javascript
const rp = require('request-promise');
const getToken = function(resource, cb) {
    let options = {
        uri: `${process.env["MSI_ENDPOINT"]}/?resource=${resource}&api-version=2017-09-01`,
        headers: {
            'Secret': process.env["MSI_SECRET"]
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

msi_endpoint = os.environ["MSI_ENDPOINT"]
msi_secret = os.environ["MSI_SECRET"]

def get_bearer_token(resource_uri):
    token_auth_uri = f"{msi_endpoint}?resource={resource_uri}&api-version=2017-09-01"
    head_msi = {'Secret':msi_secret}

    resp = requests.get(token_auth_uri, headers=head_msi)
    access_token = resp.json()['access_token']

    return access_token
```

# [PowerShell](#tab/powershell)

```powershell
$resourceURI = "https://<AAD-resource-URI-for-resource-to-obtain-token>"
$tokenAuthURI = $env:MSI_ENDPOINT + "?resource=$resourceURI&api-version=2017-09-01"
$tokenResponse = Invoke-RestMethod -Method Get -Headers @{"Secret"="$env:MSI_SECRET"} -Uri $tokenAuthURI
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

To learn more about Microsoft.Azure.Services.AppAuthentication and the operations it exposes, see the [Microsoft.Azure.Services.AppAuthentication reference].

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


## <a name="remove"></a>Removing an identity

A system-assigned identity can be removed by disabling the feature using the portal, PowerShell, or CLI in the same way that it was created. User-assigned identities can be removed individually. To remove all identities, in the REST/ARM template protocol, this is done by setting the type to "None":

```json
"identity": {
    "type": "None"
}
```

Removing a system-assigned identity in this way will also delete it from AAD. System-assigned identities are also automatically removed from AAD when the app resource is deleted.

> [!NOTE]
> There is also an application setting that can be set, WEBSITE_DISABLE_MSI, which just disables the local token service. However, it leaves the identity in place, and tooling will still show the managed identity as "on" or "enabled." As a result, use of this setting is not recommended.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)

[Microsoft.Azure.Services.AppAuthentication reference]: https://go.microsoft.com/fwlink/p/?linkid=862452
