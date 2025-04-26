---
title: Configure API access in Azure API Center
description: Learn how to configure access to APIs in the Azure API Center inventory using API keys or OAuth 2.0 authorization. Users authorized for access can test APIs in the API Center portal.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 04/25/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to store API authorization information in my API center and enable authorized users to test APIs in the API Center portal.
---

# Authorize access to APIs in your API center

You can configure settings to authorize access to APIs in your API center. These settings:

* Enable API authentication using API keys or OAuth 2.0 authorization
* Associate specific authentication methods with specific API versions in your inventory
* Manage authentication to API versions by designated users or groups through access policies
* Enable authorized users to test APIs directly in the API Center portal

> [!NOTE]
> This feature is currently in preview.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Register at least API in your API center. For more information, see [Tutorial: Register APIs in your API inventory](register-apis.md).

* Configure an environment and a deployment for the API. For more information, see [Tutorial: Add environments and deployments for APIs](configure-environments-deployments.md).

* Set up the API Center portal. For more information, see [Set up API Center portal](set-up-api-center-portal.md).

* (For OAuth 2.0 authorization using Microsoft Entra ID) Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription. 


## Option 1: Configure settings for API key authentication

For an API that supports API key authentication, follow these steps to configure settings in your API center. The API key must be stored in Azure Key Vault, and access to the key vault is through your API center's managed identity.

### 1. Store secret in Azure Key Vault

To store the API key securely, use Azure Key Vault. You can create a new key vault or use an existing one, using the Azure portal, Azure tools, or Azure SDKs. Your key vault should use the Azure role-based access control (RBAC) permission model.

* For steps to create a key vault, see [Create a Key Vault](/azure/key-vault/general/quick-create-portal).

* To store the API key as a secret in the key vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

    > [!NOTE]
    > The *secret identifier* of the secret appears on the secret's details page. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>/<version>`. You need this value when you add the API key configuration in your API center.

### 2. Enable a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access the key vault. Depending on your needs, enable either a system-assigned or one or more user-assigned managed identities. 

The following example shows how to enable a system-assigned managed identity by using the Azure portal. At a high level, configuration steps are similar for a user-assigned managed identity. 


1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

### 3. Assign the Key Vault Secrets User role to the managed identity

Assign your API center's managed identity the **Key Vault Secrets User** role in your key vault. The following steps use the Azure portal.

1. In the [portal](https://azure.microsoft.com), navigate to your key vault.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, in **Assign access to**, select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page, select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign** twice.


### 4. Add API key configuration in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add authorization** page, set the values as follows:
    1. Enter a **Title** (name) and optional **Description** for the configuration.
    1. In **Security scheme**, select **API Key**.
    1. In **API key location**, select how the key is presented in API requests. Available values are **Header** (request header) and **Query** (query parameter).
    1. In **API key parameter name**, enter the name of the HTTP header or query parameter that contains the API key. For example, `x-api-key`.
    1. In **API key Key Vault secret reference**, enter the URI of the secret in your key vault that contains the API key. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>/<version>`.
    1. Select **Create**.


## Option 2: Configure settings for OAuth 2.0 authorization

For an API that supports OAuth 2.0 authorization, follow these steps to configure authentication settings in your API center. You can configure settings for one or both of the following OAuth 2.0 authorization flows:

* **Authorization code flow with PKCE (Proof Key for Code Exchange)** - This flow is recommended for authenticating users in mobile and web applications such as the API Center portal.
* **Client credentials flow** - This flow is recommended for machine-to-machine applications that don't require a specific user's permissions to access data, such as background services or daemons.


### 1. Create an OAuth 2.0 app

For OAuth 2.0 authorization, create an app registration in an identity provider, such as the Microsoft Entra tenant associated with your Azure subscription. The exact steps depend on the identity provider you use. 

The following example shows how to create an app registration in Microsoft Entra ID.


1. Sign in to the [Azure portal](https://portal.azure.com) with an account with sufficient permissions in the tenant.
1. Navigate to **Microsoft Entra ID** > **+ New registration**.     
1. In the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name for the app.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. Select **Register**.
1. In the left menu, under **Manage**, select **Certificates & secrets**, and then select **+ New client secret**.    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You will need it in the following section.
1. Optionally, add API scopes in your app registration. For more information, see [Configure an application to expose a web API](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).
    
In the following section, you will need the following values from the app registration:

* The **Application (client) ID** from the app registration's **Overview** page, and the **Client secret** you copied previously. 
* The following endpoint URLs on the app registration's **Overview** > **Endpoints** page:
    * **OAuth2.0 authorization endpoint (v2)** - the authorization endpoint for Microsoft Entra ID 
    * **OAuth 2.0 token endpoint (v2)** - the token URL endpoint for Microsoft Entra ID
*  Any API scopes configured in the app registration.

### 2. Add OAuth 2.0 authorization in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add authorization** page, set the values as follows:
    1. Enter a **Title** (name) and optional **Description** for the authorization.
    1. In **Security scheme**, select **OAuth2**.
    1. In **Client ID**, enter the client ID of the app that you created in the previous section.
    1. In **Client secret**, enter the client secret of the app that you created in the previous section.
    1. In **Authorization URL**, enter the OAuth 2.0 authorization endpoint for the identity provider. 
    1. In **Token URL**, enter the OAuth 2.0 token endpoint for the identity provider.
    1. In **OAuth2 flow**, select one or both of the OAuth 2.0 flows that you want to use. Available values are **Authorization code (PKCE)** and **Client credentials**.
    1. In **Scopes**, optionally enter one or more API scopes that your API supports, separated by " ". Example: `User.Read`
    1. Select **Create**.

## Add authentication configuration to an API version

After configuring settings for an API key or an OAuth 2.0 flow, add the API key or OAuth 2.0 configuration to an API version in your inventory. 

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Assets**, select **APIs**.
1. Select an API that you want to associate the authorization with.
1. In the left menu, under **Details**, select **Versions**.
1. Select the API version that you want to add the authentication configuration to.
1. In the left menu, under **Details**, select **Manage Access (preview)** > **+ Add authentication**.
1. In the **Add authentication** page, select an available **Authentication configuration** that you want to associate with the API version.
1. Select **Create**.

> [!NOTE]
> You can add multiple authentication configurations to an API version. For example, you can add both API key and OAuth 2.0 configurations to the same API version. Similarly, you can add the same configurations to multiple API versions.

## Manage access by specific users or groups

You can manage access to an API version's authentication configuration by specific users or groups in your organization. You do this by configuring an access policy that assigns users or groups the **API Center Credential Access Reader** role, scoped to specific authentication configurations in the API version. This is useful, for example, if you want to allow only specific users to test an API in the API Center portal.

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. Navigate to an API version to which you've added an authentication configuration (see previous section).
1. In the left menu, under **Details**, select **Manage Access (preview)**.
1. Select the **Edit access policies** dropdown at the end of the row for the authentication configuration whose access you want to manage.
1. In the **Manage access** page, select **+ Add > Users** or **+ Add > Groups**.
1. Search for and select the users (or groups) that you want to add. You can select multiple items.
1. Click **Select**. 

> [!TIP]
> You can also remove users or groups from the access policy. In the **Manage access** page, select **Delete** in the context (...) menu for the user or group.

## Test API in API Center portal


You can use the API Center portal to test an API that you configured for authentication and user access. 

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