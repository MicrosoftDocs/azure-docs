---
title: Managed identity in Container Apps
description: Using Managed identity in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptualAQ
ms.date: 02/08/2022
ms.author: v-bcatherine

---

# Managed Identities in Azure Container Apps Preview

A managed identity from Azure Active Directory (Azure AD) allows your container app to access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in Azure AD, see [Managed identities for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md).

Your container app can be granted two types of identities:

> [!NOTE]
> Is the system assigned identity deleted when the app revision deactivated.?

- A **system-assigned identity** is tied to your container app and is deleted when your container app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your container app. A container app can have multiple user-assigned identities. 

## Why use a managed identity?

You can use a managed identity in a running container app to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container app. To authenicate with services hat don't support AD authentication, you can store secrets in an Azure key vault and use the managed identity to access the key vault to retrieve credentials. For more information about using a managed identity, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

## Limitations

There are a few limitations that will be addressed in future releases.

- You can't use a managed identity to pull an image from Azure Container Registry when creating a container app. The identity is only available within a running container.
- Currently, you can't use managed identity in scaling rules.  To access resources that require a connection string or key, such as  storage resources, you will still need to include the connection string or key in the`secretref` of the scaling rule.

## How to configure managed identities

There are different ways to configure managed identities.  

* Add managed identities to your ARM template.
* Add and delete managed identities via the Azure portal.
* Add and delete managed identities via the Azure CLI.

> [!NOTE] 
>What happens to the container when an identity is added or deleted to a running app.  Will this cause a restart of the container app?


## Add a system-assigned identity

# [Azure portal](#tab/portal)

1. In the left navigation of your container app's page, scroll down to the **Settings** group.

1. Select **Identity**.

1. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Screenshot that shows where to switch Status to On and then select Save.](../app-service/media/app-service-managed-service-identity/system-assigned-managed-identity-in-azure-portal.png)


> [!NOTE] 
> To find the managed identity for your container app in the Azure portal, under **???**, look in the **???** section. 


# [Azure CLI](#tab/cli)

Run the `az containerapp identity assign` command to create a system-assigned identity:

```azurecli
az containerapp identity assign --name myApp --resource-group myResourceGroup
```

# [Azure PowerShell](#tab/ps)

```powershell
az containerapp identity assign --name myApp --resource-group myResourceGroup
```

# [ARM template](#tab/arm)

An Azure Resource Manager template can be used to automate deployment of your Azure resources. 


> [!NOTE]
> ??? what is appropriate here???
> Need an ARM template

Any resource of type `Microsoft.Web/sites` can be created with an identity by including the following property in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

Adding the system-assigned type tells Azure to create and manage the identity for your application.

For example, a web app's template might look like the following JSON:

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

The tenantId property identifies what Azure AD tenant the identity belongs to. The principalId is a unique identifier for the application's new identity. Within Azure AD, the service principal has the same name that you gave to your container app.

If you need to reference these properties in a later stage in the template, you can do so via the [`reference()` template function](../azure-resource-manager/templates/template-functions-resource.md#reference) with the `'Full'` flag, as in this example:

```json
{
    "tenantId": "[reference(resourceId('Microsoft.Web/sites', variables('appName')), '2018-02-01', 'Full').identity.tenantId]",
    "objectId": "[reference(resourceId('Microsoft.Web/sites', variables('appName')), '2018-02-01', 'Full').identity.principalId]",
}
```

-----

## Add a user-assigned identity

Creating an app with a user-assigned identity requires that you create the identity and then add its resource identifier to your app config.

# [Azure portal](#tab/portal)

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

1. In the left navigation for your container app's page, scroll down to the **Settings** group.

1. Select **Identity**.

1. Within the **User assigned** tab, click **Add**.

1. Search for the identity you created earlier and select it. Click **Add**.

    ![Managed identity in App Service](../app-service/media/app-service-managed-service-identity/user-assigned-managed-identity-in-azure-portal.png)

# [Azure CLI](#tab/cli)

1. Create a user-assigned identity.

    ```azurecli
    az identity create --resource-group <group-name> --name <identity-name>
    ```

1. Run the `az containerapps identity assign` command to assign the identity to the app.

    ```azurecli
    az containerapp identity assign --resource-group <group-name> --name <app-name> --identities <identity-name>
    ```

# [Azure PowerShell](#tab/ps)

1. Create a user-assigned identity.

    ```powershell
    Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease
    $userAssignedIdentity = New-AzUserAssignedIdentity -Name $userAssignedIdentityName -ResourceGroupName <group-name>
    ```

1. Run the `az containerapp identity assign` command to assign the identity:

  ```powershell
    az containerapp identity assign --resource-group <group-name> --name <app-name> --identities <identity-name>
    ```

# [ARM template](#tab/arm)

An Azure Resource Manager template can be used to automate deployment of your Azure resources. 

??? What would be appropriate for Container Apps???

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
> A container app can have both system-assigned and user-assigned identities at the same time. In this case, the `type` property would be `SystemAssigned,UserAssigned`

Adding the user-assigned type tells Azure to use the user-assigned identity specified for your application.

For example, a web app's template might look like the following JSON:

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

-----

## Configure target resource

> [!NOTE]
> ??? does any of this apply ???

You may need to configure the target resource to allow access from your app. For example, if you [request a token](#connect-to-azure-services-in-app-code) to access Key Vault, you must also add an access policy that includes the managed identity of your app or function. Otherwise, your calls to Key Vault will be rejected, even if you use a valid token. The same is true for Azure SQL Database. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 24 hours. If you update the access policy of a particular target resource and immediately retrieve a token for that resource, you may continue to get a cached token with outdated permissions until that token expires. There's currently no way to force a token refresh.

## Connect to Azure services in app code

With its managed identity, an app can obtain tokens for Azure resources that are protected by Azure Active Directory, such as Azure SQL Database, Azure Key Vault, and Azure Storage. These tokens represent the application accessing the resource, and not any specific user of the application. 

> [!NOTE]
> ???  Do we do this ???

Container Apps provides an internally accessible [REST endpoint](#rest-endpoint-reference) for token retrieval. The REST endpoint can be accessed from within the app with a standard HTTP GET, which can be implemented with a generic HTTP client in every language. For .NET, JavaScript, Java, and Python, the Azure Identity client library provides an abstraction over this REST endpoint and simplifies the development experience. Connecting to other Azure services is as simple as adding a credential object to the service-specific client.

# [HTTP GET](#tab/http)

A raw HTTP GET request looks like the following example:

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

This response is the same as the [response for the Azure AD service-to-service access token request](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md#service-to-service-access-token-response). To access Key Vault, you will then add the value of `access_token` to a client connection with the vault.

# [.NET](#tab/dotnet)

> [!NOTE]
> When connecting to Azure SQL data sources with [Entity Framework Core](/ef/core/), consider [using Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication), which provides special connection strings for managed identity connectivity.

For .NET apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme?). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/dotnet/api/overview/azure/identity-readme#getting-started)
- [Access Azure service with a system-assigned identity](/dotnet/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/dotnet/api/overview/azure/identity-readme#specifying-a-user-assigned-managed-identity-with-the-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

# [JavaScript](#tab/javascript)

For Node.js apps and JavaScript functions, the simplest way to work with a managed identity is through the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme?). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/javascript/api/overview/azure/identity-readme#install-the-package)
- [Access Azure service with a system-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

For more code examples of the Azure Identity client library for JavaScript, see [Azure Identity examples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md).

# [Python](#tab/python)

For Python apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/python/api/overview/azure/identity-readme#getting-started)
- [Access Azure service with a system-assigned identity](/python/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/python/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/python/api/overview/azure/identity-readme#defaultazurecredential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

# [Java](#tab/java)

For Java apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for Java](/java/api/overview/azure/identity-readme). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/java/api/overview/azure/identity-readme#include-the-package)
- [Access Azure service with a system-assigned identity](/java/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/java/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

For more code examples of the Azure Identity client library for Java, see [Azure Identity Examples](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-Identity-Examples).

# [PowerShell](#tab/powershell)

Use the following script to retrieve a token from the local endpoint by specifying a resource URI of an Azure service:

```powershell
$resourceURI = "https://<AAD-resource-URI-for-resource-to-obtain-token>"
$tokenAuthURI = $env:IDENTITY_ENDPOINT + "?resource=$resourceURI&api-version=2019-08-01"
$tokenResponse = Invoke-RestMethod -Method Get -Headers @{"X-IDENTITY-HEADER"="$env:IDENTITY_HEADER"} -Uri $tokenAuthURI
$accessToken = $tokenResponse.access_token
```

-----
## Remove a managed identity

When you remove a system-assigned identity, it's deleted from Azure Active Directory. System-assigned identities are also automatically removed from Azure Active Directory when you delete the container app resource itself.

# [Azure portal](#tab/portal)

1. In the left navigation of your app's page, scroll down to the **Settings** group.

1. Select **Identity**. Then follow the steps based on the identity type:

    - **System-assigned identity**: Within the **System assigned** tab, switch **Status** to **Off**. Click **Save**.
    - **User-assigned identity**: Click the **User assigned** tab, select the checkbox for the identity, and click **Remove**. Click **Yes** to confirm.

# [Azure CLI](#tab/cli)

To remove the system-assigned identity:

```azurecli
az containerapp identity remove --name <app-name> --resource-group <group-name>
```

To remove one or more user-assigned identities:

```azurecli
az containerapp identity remove --name <app-name> --resource-group <group-name> --identities <identity-name1>,<identity-name2>,...
```

You can also remove the system assigned identity by specifying `[system]` in `--identities`.

# [Azure PowerShell](#tab/ps)

```powershell
some command
```

# [ARM template](#tab/arm)

To remove all identities in an ARM template:

```json
"identity": {
    "type": "None"
}
```

-----

## Next steps

