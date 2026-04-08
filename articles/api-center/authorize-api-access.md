---
title: Configure API access in Azure API Center
description: Configure access to APIs in your Azure API Center inventory using API keys, OAuth 2.0 authorization, or other HTTP security schemes. Authorized users can test APIs in the API Center portal.

ms.service: azure-api-center
ms.topic: how-to
ms.date: 03/10/2026
 
ms.custom: 
# Customer intent: As an API program manager, I want to store API authorization information in my API center and enable authorized users to test APIs in the API Center portal.
---

# Authorize access to APIs in your API center

Configure settings to authorize access to APIs in your [API center](overview.md). These settings:

* Enable API authentication and authorization using API keys, OAuth 2.0 authorization, or another HTTP security scheme
* Associate authentication configurations with API versions in your inventory
* Manage access to API versions for designated users or groups through access policies
* Enable authorized users to test APIs in the [API Center portal](set-up-api-center-portal.md)

> [!NOTE]
> This feature is currently in preview.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* At least one API registered in your API center. See [Tutorial: Register APIs in your API inventory](./tutorials/register-apis.md).

* An environment and deployment configured for the API. See [Tutorial: Add environments and deployments for APIs](./tutorials/configure-environments-deployments.md).

* The API Center portal set up. See [Set up API Center portal](set-up-api-center-portal.md).

* An Azure key vault to store API keys or OAuth 2.0 client secrets. See [Create a Key Vault](/azure/key-vault/general/quick-create-portal). The key vault must use the Azure role-based access control (RBAC) permission model.

* (For OAuth 2.0 with Microsoft Entra ID) Permissions to create an app registration in a Microsoft Entra tenant associated with your subscription. 


## Option 1: Configure API key authentication

For an API that supports API key authentication, complete the following steps.

### 1. Store API key in Azure Key Vault

To store the API key as a secret in the key vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

Access the key vault using your API center's managed identity. 


#### Enable a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

#### Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]


### 2. Add API key configuration

1. In the [portal](https://azure.microsoft.com), go to your API center.
1. Under **Governance**, select **Authorization (preview)** > **+ Add configuration**.
1. On the **Add configuration** page, set the following values:
    :::image type="content" source="media/authorize-api-access/configure-api-key.png" alt-text="Screenshot of configuring an API key in the portal.":::

    | **Setting**            | **Description**                                                                                                                                               |
    |-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Title**              | Enter a name for the authorization.                                                |
    | **Description**        | Optionally, enter a description for the authorization.                  |
    | **Security scheme**    | Select **API Key**.                                                                                    |
    |**API key location**    | Select how the key is presented in API requests. Available values are **Header** (request header) and **Query** (query parameter).                                                               |
    | **API key parameter name**      | Enter the name of the HTTP header or query parameter that contains the API key. Example: `x-api-key`                                                        |
    | **API key Key Vault secret reference**      | Select **Select** and select the subscription, key vault, and secret that you stored. Example: `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`  |

1. Select **Create**.

After completing this configuration, go to the [Add authentication configuration to an API version](#add-authentication-configuration-to-an-api-version) section to associate the API key configuration with an API version. 

## Option 2: Configure OAuth 2.0 authorization

For an API that supports OAuth 2.0 authorization, complete the following steps. You can configure one or both of the following flows:

* **Authorization code flow with PKCE (Proof Key for Code Exchange)** - Authenticate users in the browser, such as in the API Center portal.
* **Client credentials flow** - For applications that don't require a specific user's permissions.

### 1. Create an OAuth 2.0 app

Create an app registration in an identity provider, such as the Microsoft Entra tenant associated with your subscription. The steps depend on your identity provider.

The following example shows how to create an app registration in Microsoft Entra ID.

1. Sign in to the [Azure portal](https://portal.azure.com) with sufficient permissions in the tenant.
1. Go to **Microsoft Entra ID** > **+ New registration**.     
1. On the **Register an application** page:
    1. In **Name**, enter a meaningful name.
    1. In **Supported account types**, select an appropriate option, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. (For authorization code flow) In **Redirect URI**, select **Single-page application (SPA)** and enter the URI of your API Center portal: `https://<service-name>.portal.<location>.azure-api-center.ms`. Replace `<service-name>` and `<location>` with your API center name and deployment location. Example: `https://myapicenter.portal.eastus.azure-api-center.ms`
    1. Select **Register**.
1. Under **Manage**, select **Certificates & secrets** > **+ New client secret**.    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret **Value** before leaving the page. You need it in the next section.
1. Optionally, add API scopes in your app registration. See [Configure an application to expose a web API](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).
    
When configuring OAuth 2.0 in your API center, you need the following values from the app registration:

* **Application (client) ID** from the **Overview** page, and the **Client secret** you copied.
* The following endpoint URLs from **Overview** > **Endpoints**:
    * **OAuth2.0 authorization endpoint (v2)**
    * **OAuth 2.0 token endpoint (v2)** (also used as the token refresh endpoint)
* Any API scopes you configured.

### 2. Store client secret in Azure Key Vault

To store the client secret in the key vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

Access the key vault using your API center's managed identity. 


#### Enable a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

#### Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]

### 3. Add OAuth 2.0 configuration

1. In the [portal](https://azure.microsoft.com), go to your API center.
1. Under **Governance**, select **Authorization (preview)** > **+ Add configuration**.
1. On the **Add configuration** page, set the following values:

    :::image type="content" source="media/authorize-api-access/configure-oauth.png" lightbox="media/authorize-api-access/configure-oauth.png" alt-text="Screenshot of configuring OAuth 2.0 in the portal.":::


    > [!NOTE]
    > Use values from the app registration you created previously. For Microsoft Entra ID, find the **Client ID** on the app registration **Overview** page, and URL endpoints on **Overview** > **Endpoints**. 

    | **Setting**            | **Description**                                                                                                                                               |
    |-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Title**              | Enter a name for the authorization.                                                                                                 |
    | **Description**        | Optionally, enter a description for the authorization.                                                                                                                   |
    | **Security scheme**    | Select **OAuth2**.                                                                  |
    | **Client ID**          | Enter the client ID (GUID) of the app you created in your identity provider.                                                                                     |
    | **Client secret**      | Select the subscription, key vault, and client secret that you stored.<br/><br/>Example: `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`                                                                               |
    | **Authorization URL**  | Enter the OAuth 2.0 authorization endpoint for the identity provider.<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize`                                                                                      |
    | **Token URL**          | Enter the OAuth 2.0 token endpoint for the identity provider.<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`                                                                                            |
    | **Refresh URL**        | Enter the OAuth 2.0 token refresh endpoint for the identity provider. For most providers, same as the **Token URL**<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`                                                                                                |
    | **OAuth2 flow**        | Select one or both OAuth 2.0 flows: **Authorization code (PKCE)** and **Client credentials**.               |
    | **Scopes**             | Enter one or more API scopes configured for your API, separated by spaces. If no scopes are configured, enter `.default`.                                                   |

1. Select **Create** to save the configuration.

After completing this configuration, go to the [Add authentication configuration to an API version](#add-authentication-configuration-to-an-api-version) section to associate the OAuth 2.0 configuration with an API version.

## Option 3: Configure settings for another HTTP security scheme

For APIs that use another HTTP security scheme, such as Basic authentication or bearer tokens that don't use OAuth 2.0, complete the following steps. You might need to choose this option for legacy APIs. 

In the [portal](https://azure.microsoft.com), go to your API center.
1. Under **Governance**, select **Authorization (preview)** > **+ Add configuration**.
1. On the **Add configuration** page, set the following values:

    | **Setting**            | **Description**                                                                                                                                               |
    |-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Title**              | Enter a name for the authorization.                                                |
    | **Description**        | Optionally, enter a description for the authorization.                  |
    | **Security scheme**    | Select **HTTP**.           |
    | **Authentication scheme**    | Select the authentication scheme used by the API. Examples include the schemes in the following table. |

    | Authentication scheme | Description |
    |---|---|
    | **Basic** | Sends `username:password` as a Base64-encoded string in the `Authorization: Basic <credentials>` header.  |
    | **Bearer** | Sends a token other than an OAuth 2.0 access token in the `Authorization: Bearer <token>` header.  |
    | **Digest** | A challenge-response mechanism where the server sends a nonce; the client responds with a hash of credentials + nonce. |
    | **Custom** | Another mechanism scheme such as a vendor-specific scheme. |

After completing this configuration, go to the next section to [associate the configuration with an API version](#add-authentication-configuration-to-an-api-version).

## Add authentication configuration to an API version

After configuring an authentication scheme, associate the configuration with an API version.

1. In the [portal](https://azure.microsoft.com), go to your API center.
1. Under **Inventory**, select **Assets**.
1. Select the API to associate the configuration with.
1. Under **Details**, select **Versions**, then select the target API version.
1. In the context menu for the API version, select **Manage Access (preview)**.
    :::image type="content" source="media/authorize-api-access/add-authentication-to-version.png" alt-text="Screenshot of associating an authentication configuration with an API version in the portal.":::

1. On the **Manage Access** page, select **+ Add authentication**.
1. Select an available **Authentication configuration**.
1. Select **Create**.

> [!NOTE]
> You can add multiple authentication configurations to an API version (for example, both API key and OAuth 2.0), if supported by the API. You can also add the same configuration to multiple API versions.

## Manage access for specific users or groups

Configure an access policy that assigns users or groups the **API Center Credential Access Reader** role, scoped to specific authentication configurations in an API version. This role allows only designated users to test an API in the API Center portal.

1. In the [portal](https://azure.microsoft.com), go to your API center.
1. Go to an API version with an authentication configuration.
1. Select **Manage Access (preview)**.
1. Select an authentication configuration you want to manage.
1. In the dropdown menu, select **Edit access policies**.
    :::image type="content" source="media/authorize-api-access/edit-access-policies.png" alt-text="Screenshot of adding an access policy in the portal.":::

1. On the **Manage access** page, select **+ Add > Users** or **+ Add > Groups**.
1. Search for and select users or groups. You can select multiple items.
1. Select **Select**. 

> [!TIP]
> To remove users or groups, select **Delete** in the context menu on the **Manage access** page.

## Test the API in API Center portal

Test an API that you configured for authentication and user access.

> [!TIP]
> You can also configure [visibility settings](customize-api-center-portal.md#api-visibility) to control which APIs appear for all signed-in users in the portal.

1. In the [portal](https://azure.microsoft.com), go to your API center.
1. Under **API Center Portal**, select **Portal settings** > **View API Center portal**.
1. Select an API, then select a version with an authentication method configured.
1. Under **Options**, select **View documentation**.
   :::image type="content" source="media/authorize-api-access/view-api-documentation-small.png" lightbox="media/authorize-api-access/view-api-documentation.png" alt-text="Screenshot of API details in API Center portal.":::

1. Select an operation, then select **Try this API**.
1. Review the authentication settings. If you have access, select **Send**.
   :::image type="content" source="media/authorize-api-access/test-api-operation-small.png" lightbox="media/authorize-api-access/test-api-operation.png" alt-text="Screenshot of testing an API in the API Center portal's test console.":::
   
1. A successful operation returns a `200 OK` response code and response body. A failed operation returns an error message.


## Related content

* [Set up API Center portal](set-up-api-center-portal.md)
* [Enable the Azure API Center portal view in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Authentication and authorization to APIs in Azure API Management](../api-management/authentication-authorization-overview.md)