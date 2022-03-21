---
title: Managed identity in Azure Container Apps
description: Using Managed identity in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/21/2022
ms.author: v-bcatherine

---

# Managed Identities in Azure Container Apps Preview

A managed identity from Azure Active Directory (Azure AD) allows your container app to access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in Azure AD, see [Managed identities for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md).

Your container app can be granted two types of identities:

- A **system-assigned identity** is tied to your container app and is deleted when your container app is deleted/deactivated. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your container app. A container app can have multiple user-assigned identities.

## Why use a managed identity?

You can use a managed identity in a running container app to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container app. To authenticate with services that don't support AD authentication, you can store secrets in an Azure key vault and use the managed identity to access the key vault to retrieve credentials. For more information about using a managed identity, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

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

