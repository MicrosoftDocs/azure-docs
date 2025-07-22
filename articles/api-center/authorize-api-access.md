---
title: Configure API access in Azure API Center
description: Learn how to configure access to APIs in the Azure API Center inventory using API keys or OAuth 2.0 authorization. Users authorized for access can test APIs in the API Center portal.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 06/02/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to store API authorization information in my API center and enable authorized users to test APIs in the API Center portal.
---

# Authorize access to APIs in your API center

You can configure settings to authorize access to APIs in your [API center](overview.md). These settings:

* Enable API authentication using either API keys or OAuth 2.0 authorization
* Associate specific authentication methods with specific API versions in your inventory
* Manage authentication to API versions by designated users or groups through access policies
* Enable authorized users to test APIs directly in the [API Center portal](set-up-api-center-portal.md)

> [!NOTE]
> This feature is currently in preview.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Register at least one API in your API center. For more information, see [Tutorial: Register APIs in your API inventory](register-apis.md).

* Configure an environment and a deployment for the API. For more information, see [Tutorial: Add environments and deployments for APIs](configure-environments-deployments.md).

* Set up the API Center portal. For more information, see [Set up API Center portal](set-up-api-center-portal.md).

* An Azure key vault to store API keys or OAuth 2.0 client secrets. For steps to create a key vault, see [Create a Key Vault](/azure/key-vault/general/quick-create-portal). The key vault should use the Azure role-based access control (RBAC) permission model.

* (For OAuth 2.0 authorization using Microsoft Entra ID) Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription. 


## Option 1: Configure settings for API key authentication

For an API that supports API key authentication, follow these steps to configure settings in your API center. 

### 1. Store API key in Azure Key Vault

To manage the API key securely, store it in Azure Key Vault, and access the key vault using your API center's managed identity. 

[!INCLUDE [store-secret-key-vault](includes/store-secret-key-vault.md)]


### 2.  Add API key configuration in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Governance**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add configuration** page, set the values as follows:
    :::image type="content" source="media/authorize-api-access/configure-api-key.png" alt-text="Screenshot of configuring an API key in the portal.":::

    | **Setting**            | **Description**                                                                                                                                               |
    |-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Title**              | Enter a name for the authorization.                                                |
    | **Description**        | Optionally, enter a description for the authorization.                  |
    | **Security scheme**    | Select **API Key**.                                                                                    |
    |**API key location**    | Select how the key is presented in API requests. Available values are **Header** (request header) and **Query** (query parameter).                                                               |
    | **API key parameter name**      | Enter the name of the HTTP header or query parameter that contains the API key. Example: `x-api-key`                                                        |
    | **API key Key Vault secret reference**      | Click **Select** and select the subscription, key vault, and secret that you stored. Example: `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`  |

1. Select **Create**.

## Option 2: Configure settings for OAuth 2.0 authorization

For an API that supports OAuth 2.0 authorization, follow these steps to configure authentication settings in your API center. You can configure settings for one or both of the following OAuth 2.0 authorization flows:

* **Authorization code flow with PKCE (Proof Key for Code Exchange)** - This flow is recommended for authenticating users in the browser, such as in the API Center portal.
* **Client credentials flow** - This flow is recommended for applications that don't require a specific user's permissions to access data.


### 1. Create an OAuth 2.0 app

For OAuth 2.0 authorization, create an app registration in an identity provider, such as the Microsoft Entra tenant associated with your Azure subscription. The exact creation steps depend on the identity provider you use. 

The following example shows how to create an app registration in Microsoft Entra ID.

1. Sign in to the [Azure portal](https://portal.azure.com) with an account with sufficient permissions in the tenant.
1. Navigate to **Microsoft Entra ID** > **+ New registration**.     
1. In the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name for the app.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. (For authorization code flow) In **Redirect URI**, select **Single-page application (SPA)** and set the URI. Enter the URI of your API Center portal deployment, in the following form: `https://<service-name>.portal.<location>.azure-api-center.ms.` Replace `<service name>` and `<location>` with the name of your API center and the location where it's deployed, Example: `https://myapicenter.portal.eastus.azure-api-center.ms`
    1. Select **Register**.
1. In the left menu, under **Manage**, select **Certificates & secrets**, and then select **+ New client secret**.    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You will need it in the following section.
1. Optionally, add API scopes in your app registration. For more information, see [Configure an application to expose a web API](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).
    
When you configure OAuth 2.0 authorization in your API center, you will need the following values from the app registration:

* The **Application (client) ID** from the app registration's **Overview** page, and the **Client secret** you copied previously. 
* The following endpoint URLs on the app registration's **Overview** > **Endpoints** page:
    * **OAuth2.0 authorization endpoint (v2)** - the authorization endpoint for Microsoft Entra ID 
    * **OAuth 2.0 token endpoint (v2)** - the token endpoint and token refresh endpoint for Microsoft Entra ID
*  Any API scopes configured in the app registration.

### 2. Store client secret in Azure Key Vault

To manage the secret securely, store it in Azure Key Vault, and access the key vault using your API center's managed identity. 

[!INCLUDE [store-secret-key-vault](includes/store-secret-key-vault.md)]

### 3. Add OAuth 2.0 authorization in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Governance**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add configuration** page, set the values as follows:

    :::image type="content" source="media/authorize-api-access/configure-oauth.png" lightbox="media/authorize-api-access/configure-oauth.png" alt-text="Screenshot of configuring OAuth 2.0 in the portal.":::


    > [!NOTE]
    > Configure settings based on the app registration you created previously in your identity provider. If you're using Microsoft Entra ID, find the **Client ID** on the **Overview** page of the app registration, and find the URL endpoints on the **Overview** > **Endpoints** page. 

    | **Setting**            | **Description**                                                                                                                                               |
    |-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Title**              | Enter a name for the authorization.                                                                                                 |
    | **Description**        | Optionally, enter a description for the authorization.                                                                                                                   |
    | **Security scheme**    | Select **OAuth2**.                                                                  |
    | **Client ID**          | Enter the client ID (GUID) of the app that you created in your identity provider.                                                                                     |
    | **Client secret**      | Click **Select** and select the subscription, key vault, and client secret that you stored.<br/><br/>Example: `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`                                                                               |
    | **Authorization URL**  | Enter the OAuth 2.0 authorization endpoint for the identity provider.<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize`                                                                                      |
    | **Token URL**          | Enter the OAuth 2.0 token endpoint for the identity provider.<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`                                                                                            |
    | **Refresh URL**        | Enter the OAuth 2.0 token refresh endpoint for the identity provider. For most providers, same as the **Token URL**<br/><br/>Example for Microsoft Entra ID: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`                                                                                                |
    | **OAuth2 flow**        | Select one or both of the OAuth 2.0 flows that you want to use. Available values are **Authorization code (PKCE)** and **Client credentials**.               |
    | **Scopes**             | Enter one or more API scopes configured for your API, separated by spaces. If no scopes are configured, enter `.default`.                                                   |

1. Select **Create** to save the configuration.

## Add authentication configuration to an API version

After configuring settings for an API key or an OAuth 2.0 flow, add the API key or OAuth 2.0 configuration to an API version in your API center. 

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Assets**, select **APIs**.
1. Select an API that you want to associate the authorization configuration with.
1. In the left menu, under **Details**, select **Versions**.
1. Select the API version that you want to add the authentication configuration to.
1. In the left menu, under **Details**, select **Manage Access (preview)** > **+ Add authentication**.
1. In the **Add authentication** page, select an available **Authentication configuration** that you want to associate.
1. Select **Create**.

> [!NOTE]
> You can add multiple authentication configurations to an API version. For example, you can add both API key and OAuth 2.0 configurations to the same API version, if supported by the API. Similarly, you can add the same configurations to multiple API versions.

## Manage access by specific users or groups

You can manage access by specific users or groups in your organization to an API version's authentication configuration. You do this by configuring an access policy that assigns users or groups the **API Center Credential Access Reader** role, scoped to specific authentication configurations in the API version. This is useful, for example, if you want to allow only specific users to test an API in the API Center portal using an API key or OAuth 2.0 flow.

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. Navigate to an API version to which you've added an authentication configuration (see previous section).
1. In the left menu, under **Details**, select **Manage Access (preview)**.
1. Select the **Edit access policies** dropdown at the end of the row for the authentication configuration whose access you want to manage.
    :::image type="content" source="media/authorize-api-access/edit-access-policies.png" alt-text="Screenshot of adding an access policy in the portal.":::

1. In the **Manage access** page, select **+ Add > Users** or **+ Add > Groups**.
1. Search for and select the users (or groups) that you want to add. You can select multiple items.
1. Click **Select**. 

> [!TIP]
> You can also remove users or groups from the access policy. In the **Manage access** page, select **Delete** in the context (...) menu for the user or group.

## Test API in API Center portal


You can use the API Center portal to test an API that you configured for authentication and user access. 

> [!TIP]
> In addition to enabling specific users to test specific APIs in the API Center portal, you can configure [visibility settings](set-up-api-center-portal.md#api-visibility) for APIs. Visibility settings in the portal control the APIs that appear for all signed-in users.

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **API Center Portal**, select **Portal settings**.
1. Select **View API Center portal**.
1. In the API Center portal, select an API that you want to test. 
1. Select a version of the API that has an authentication method configured.
1. Under **Options**, select **View documentation**.
   :::image type="content" source="media/authorize-api-access/view-api-documentation-small.png" lightbox="media/authorize-api-access/view-api-documentation.png" alt-text="Screenshot of API details in API Center portal.":::

1. Select an operation in the API, and select **Try this API**.
1. In the window that opens, review the authentication settings. If you have access to the API, select **Send** to try the API.
   :::image type="content" source="media/authorize-api-access/test-api-operation-small.png" lightbox="media/authorize-api-access/test-api-operation.png" alt-text="Screenshot of testing an API in the API Center portal's test console.":::
   
1. If the operation is successful, you see the `200 OK` response code and the response body. If the operation fails, you see an error message.


## Related content

* [Set up API Center portal](set-up-api-center-portal.md)
* [Enable the Azure API Center portal view in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Authentication and authorization to APIs in Azure API Management](../api-management/authentication-authorization-overview.md)