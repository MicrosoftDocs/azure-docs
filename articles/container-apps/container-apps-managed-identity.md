---
title: Managed identities in Azure Container Apps
description: Using managed identities in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/21/2022
ms.author: v-bcatherine

---

# Managed Identities in Azure Container Apps Preview

A managed identity from Azure Active Directory (Azure AD) allows your container app to access other Azure AD-protected resources.  For more about managed identities in Azure AD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your container app can be granted two types of identities:

- A **system-assigned identity** is tied to your container app and is deleted when your container app is deleted/deactivated. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your container app as well as multiple resources. A container app can have multiple user-assigned identities. The identity exist until you delete them.

## Why use a managed identity?

You can use a managed identity in a running container app to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container app. 

With managed identities:

- You don't need to manage credentials.
- You can grant role-based access control to grant permissions.
- User-assigned credentials, you can create, read, update and delete the identities and assign them to multiple resources.
- System-assigned identities are deleted with your container app is deleted.
- User-assigned identities are independent of the life cycle of your container app.

### Common use cases

User-assigned managed identities are ideal for workloads that:

- run on multiple resources and can share a single identity
- need pre-authorization to a secure resource
- frequently recycle resources but permissions should stay constant.


System-assigned identities are best for workloads:

- that are contained within a single resource
- where you need independent identities

## Limitations

There are a few limitations that will be addressed in future releases of Container Apps.

- You can't use a managed identity to pull an image from Azure Container Registry when creating a container app. The identity is only available within a running container.
- Currently, you can't use managed identity in scaling rules.  To access resources that require a connection string or key, such as  storage resources, you will still need to include the connection string or key in the`secretref` of the scaling rule.

## How to configure managed identities

There are different ways to configure managed identities.  

- Add managed identities to your ARM template.
- Add and delete managed identities via the Azure portal.
- Add and delete managed identities via the Azure CLI.

When a managed identity is added, deleted or modified to a running container app the app will not automatically restart and a new revision will not be created.

## Add a system-assigned identity

# [Azure portal](#tab/portal)

1. In the left navigation of your container app's page, scroll down to the **Settings** group.

1. Select **Identity**.

1. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Screenshot that shows where to switch Status to On and then select Save.](../app-service/media/app-service-managed-service-identity/system-assigned-managed-identity-in-azure-portal.png)


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

An Azure Resource Manager template can be used to automate deployment of your Azure container app and resources. Below is an example template for a System-assigned managed identity.

```json

{
    "name": "myapp",
    "type": "Microsoft.App/containerApps",
    "location": "East US 2",  
    "identity": {
        "type": "SystemAssigned"      
    },
    "properties": {
        "managedEnvironmentId": "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.App/managedenvironments/<MyEnvironment>",
        "configuration": {
        },
        "template": {
            "containers": [
                {
                    "image": "myregistry.azurecr.io/mycontainer",
                    "name": "mycontainer"
                }
            ],
            "scale": {
                "minReplicas": 1,
                "maxReplicas": 1
            }
        }
    }
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

Example of an ARM template for User-assigned identity

```json

{
    "name": "myapp",
    "type": "Microsoft.App/containerApps",
    "location": "East US 2",  
    "identity": {
        "type": "SystemAssigned"
    },
    "properties": {
        "managedEnvironmentId": "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.App/managedenvironments/<MyEnvironment>",
        "configuration": {
        },
        "template": {
            "containers": [
                {
                    "image": "myregistry.azurecr.io/mycontainer",
                    "name": "mycontainer"
                }
            ],
            "scale": {
                "minReplicas": 1,
                "maxReplicas": 1
            }
        }
    }
}

```

-----

## Configure target resource

You may need to configure the target resource to allow access from your app. For example, if you [request a token](#connect-to-azure-services-in-app-code) to access Key Vault, you must also add an access policy that includes the managed identity of your app or function. Otherwise, your calls to Key Vault will be rejected, even if you use a valid token. The same is true for Azure SQL Database. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 24 hours. If you update the access policy of a particular target resource and immediately retrieve a token for that resource, you may continue to get a cached token with outdated permissions until that token expires. There's currently no way to force a token refresh.

## Connect to Azure services in app code

With its managed identity, an app can obtain tokens for Azure resources that are protected by Azure Active Directory, such as Azure SQL Database, Azure Key Vault, and Azure Storage. These tokens represent the application accessing the resource, and not any specific user of the application. 

Container Apps provides an internally accessible [REST endpoint](#rest-endpoint-reference) for token retrieval. The REST endpoint can be accessed from within the app with a standard HTTP GET, which can be implemented with a generic HTTP client in every language. For .NET, JavaScript, Java, and Python, the Azure Identity client library provides an abstraction over this REST endpoint and simplifies the development experience. Connecting to other Azure services is as simple as adding a credential object to the service-specific client.

The token service address is provided to all container app containers in an environment variable named IDENTITY_ENDPOINT.

The X-IDENTITY-HEADER in this examples shows a GUID. That GUID is provided to all container app containers in an environment variable named IDENTITY_HEADER, and is unique for each container app. The GUID shown here is just an example. Users should get the GUID value from the environment variable if they are sending a raw HTTP request. If users are using an Azure Identity client library, the client library gets this value automatically.

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
> When connecting to Azure SQL data sources with [Entity Framework Core](/ef/core/), consider [using Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication), which provides special connection strings for managed identity connectivity. For an example, see [Tutorial: Secure Azure SQL Database connection from App Service using a managed identity](tutorial-connect-msi-sql-database.md).

For .NET apps, the simplest way to work with a managed identity is through the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/dotnet/api/overview/azure/identity-readme#getting-started)
- [Access Azure service with a system-assigned identity](/dotnet/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/dotnet/api/overview/azure/identity-readme#specifying-a-user-assigned-managed-identity-with-the-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

# [JavaScript](#tab/javascript)

For Node.js apps, the simplest way to work with a managed identity is through the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme?). See the respective documentation headings of the client library for information:

- [Add Azure Identity client library to your project](/javascript/api/overview/azure/identity-readme#install-the-package)
- [Access Azure service with a system-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential). It's useful for the majority of the scenarios because the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

For more code examples of the Azure Identity client library for JavaScript, see [Azure Identity examples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md).

# [Python](#tab/python)

For Python apps, the simplest way to work with a managed identity is through the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). See the respective documentation headings of the client library for information:

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

For more information on the REST endpoint, see [REST endpoint reference](#rest-endpoint-reference).

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

## REST endpoint reference

> [!NOTE]
> An older version of this endpoint, using the "2017-09-01" API version, used the `secret` header instead of `X-IDENTITY-HEADER` and only accepted the `clientid` property for user-assigned. It also returned the `expires_on` in a timestamp format. `MSI_ENDPOINT` can be used as an alias for `IDENTITY_ENDPOINT`, and `MSI_SECRET` can be used as an alias for `IDENTITY_HEADER`. This version of the protocol is currently required for Linux Consumption hosting plans.

A container app with a managed identity exposes the identity endpoint by defining two environment variables:

- IDENTITY_ENDPOINT - local URL from which your container app can request tokens.
- IDENTITY_HEADER - a header used to help mitigate server-side request forgery (SSRF) attacks. The value is rotated by the platform.

To get a token for a resource, make a HTTP GET request to this endpoint, including the following parameters:

> | Parameter name    | In     | Description                                                                                                                                                                                                                                                                                                                                |
> |-------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | resource          | Query  | The Azure AD resource URI of the resource for which a token should be obtained. This could be one of the [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) or any other resource URI.    |
> | api-version       | Query  | The version of the token API to be used. Use "2019-08-01" or later.                                                                                                                                                                                                                                                                 |
> | X-IDENTITY-HEADER | Header | The value of the IDENTITY_HEADER environment variable. This header is mitigates server-side request forgery (SSRF) attacks.                                                                                                                                                                                                    |
> | client_id         | Query  | (Optional) The client ID of the user-assigned identity to be used. Cannot be used on a request that includes `principal_id`, `mi_res_id`, or `object_id`. If all ID parameters  (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                             |
> | principal_id      | Query  | (Optional) The principal ID of the user-assigned identity to be used. `object_id` is an alias that may be used instead. Cannot be used on a request that includes client_id, mi_res_id, or object_id. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`)  are omitted, the system-assigned identity is used. |
> | mi_res_id         | Query  | (Optional) The Azure resource ID of the user-assigned identity to be used. Cannot be used on a request that includes `principal_id`, `client_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                      |

> [!IMPORTANT]
> If you are attempting to obtain tokens for user-assigned identities, you must include one of the optional properties. Otherwise the token service will attempt to obtain a token for a system-assigned identity, which may or may not exist.

## Next steps

