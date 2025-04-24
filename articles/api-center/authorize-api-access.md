---
title: Configure API access in Azure API Center
description: Learn how to configure access to APIs in the Azure API Center inventory using API keys or OAuth 2.0 authorization. Users authorized for access can test APIs in the API Center portal.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 04/23/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to ... TBD 
---

# Authorize access to APIs in your API Center inventory

<!-- Is this a governance or inventory feature -->

You can configure settings to authorize users to access APIs in your API center inventory.

* Add settings to the API center for authentication using API keys or OAuth 2.0 authorization.
* Associate specific authentication settings with specific API versions in your inventory.
* Restrict use of API authentication methods to designated users or groups using access policies.
* Enable authorized users to test APIs directly in the API Center portal.

> [!NOTE]
> This feature is currently in preview.

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](../set-up-api-center.md).

* Register at least API in your API center. For more information, see [Tutorial: Register APIs in your API inventory](register-apis.md).

* Configure an environment and a deployment for the API. For more information, see [Tutorial: Add environments and deployments for APIs](configure-environments-deployments.md).

* Set up the API Center portal. For more information, see [Set up API Center portal](set-up-api-center-portal.md).

* (To configure settings for OAuth 2.0 authorization using Microsoft Entra ID) Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription. 


## Configure settings for API key authentication

Follow these steps to configure settings for API key authentication. The API key is stored in Azure Key Vault, and the API center uses a managed identity to access the key vault.

### Store secret in Azure Key Vault

To store the API key securely, use Azure Key Vault. You can create a new key vault or use an existing one, using the Azure portal, Azure tools, or Azure SDKs. Your key vault should use the Azure role-based access control (RBAC) permission model.

* For steps to create a Key Vault, see [Create a Key Vault](/azure/key-vault/general/quick-create-portal).

* To store a secret in the Key Vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

    Note the *secret identifier* of the secret. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>/<version>`. You will need this value when you configure the API key authorization in your API center.

<!-- Should we use the version of the secret in the URI? -->


### Enable a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access Azure resources. Depending on your needs, enable either a system-assigned or one or more user-assigned managed identities. 

The following examples show how to enable a system-assigned managed identity by using the Azure portal. At a high level, configuration steps are similar for a user-assigned managed identity. 


1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

### Assign the Key Vault Secrets User role to the managed identity

Assign your API center's managed identity the **Key Vault Secrets User** role in your key vault. The following steps use the [portal](../role-based-access-control/role-assignments-portal-managed-identity.yml).

1. In the [portal](https://azure.microsoft.com), navigate to your key vault.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page, select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign**.


### Add API key configuration in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. In the left menu, under **Assets**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add authorization** page, set the values as follows:
    1. Enter a **Title** (name) and optional **Description** for the authorization.
    1. In **Security scheme**, select **API Key**.
    1. In **API key location**, select how the key is presented in API requests. Available values are **Header** (request header) and **Query** (query parameter).
    1. In **API key parameter name**, enter the name of the HTTP header or query parameter that contains the API key. For example, `x-api-key`.
    1. In **API key Key Vault secret reference**, enter the URI of the secret in your key vault that contains the API key. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>/<version>`.
    1. Select **Create**.


## Configure settings for OAuth 2.0 authorization

<!-- Which identity providers are supported? Just Entra? -->


You can configure one or both of the following OAuth 2.0 authorization flows:

* Authorization code flow with PKCE (Proof Key for Code Exchange) - This flow is recommended for public clients, such as mobile apps or single-page applications (SPAs).
* Client credentials flow - This flow is recommended for confidential clients, such as web apps or web APIs.


### Create an OAuth 2.0 app

For OAuth 2.0 authorization, create an app registration in an identity provider, such as the Microsoft Entra tenant associated with your Azure subscription. This app registration is used to authenticate users and authorize access to your APIs. The exact steps depend on the identity provider you use. The following example shows how to create an app registration in the Microsoft Entra tenant associated with your Azure subscription.



Minimally you need to configure:

* A client secret for the app registration.
* Any required scopes for the API.
* A redirect URI for the app registration, when using the authorization code flow.


1. Sign in to the [Azure portal](https://portal.azure.com) with an account with sufficient permissions in the tenant.
1. Navigate to **Microsoft Entra ID** > **+ New registration**.     
1. On the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name for the app.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. Set the **Redirect URI** to **SPA**, and set the URI. Enter the URI of your API Center portal deployment, in the following form: https://<service-name>.portal.<location>.azure-api-center.ms. 
    1. Select **Register**.
1. On the left menu, under **Manage**, select **Certificates & secrets**, and then select **+ New client secret**.    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You will need it in the following section.

In the following section, you will need the following values:

* The **Application (client) ID** and **Directory (tenant) ID** values from the app registration's **Overview** page. 
* The following endpoints on the app registration's **Overview** > **Endpoints** page:
    * **OAuth2.0 authorization endpoint (v2)** - the authorization endpoint for Microsoft Entra ID 
    * **OAuth 2.0tToken endpoint** - the token URL for Microsoft Entra ID.

### Add OAuth 2.0 authorization in your API center

1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. In the left menu, under **Assets**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add authorization** page, set the values as follows:
    1. Enter a **Title** (name) and optional **Description** for the authorization.
    1. In **Security scheme**, select **OAuth2**.
    1. In **Client ID**, enter the client ID of the app that you created in the previous section.
    1. In **Client secret**, enter the client secret of the app that you created in the previous section.
    1. In **Authorization URL**, enter the OAuth 2.0 authorization endpoint configured in the app in the previous section. 
    1. In **Token URL**, enter the OAuth 2.0 token endpoint configured in the app in the previous section.
    1. In **OAuth2 flow**, select one or both of the OAuth 2.0 flows that you want to use. Available values are **Authorization code (PKCE)** and **Client credentials**.
    1. In **Scopes**, optionally enter one or more API scopes that your API supports. Example: `User.Read`
    1. Select **Create**.

## Add authentication settings to an API version

After configuring settings for an API key or an OAuth 2.0 flow, add the API key or OAuth 2.0 authentication to an API versions in your inventory.

1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. In the left menu, under **Assets**, select **APIs**.
1. Select an API that you want to associate the authorization with.
1. In the left menu, under **Details**, select **Versions**.
1. Select the API version that you want to add the authentication settings to.
1. In the left menu, under **Details**, select **Manage Access (preview)** > **+ Add authentication**.
1. In the **Add authentication** page, select an available **Authentication configuration** that you want to associate with the API version.
1. Select **Create**.

> [!NOTE]
> You can add multiple authentication settings to an API version. For example, you can add both API key and OAuth 2.0 authentication settings to the same API version. Similarly, you can add the same authentication settings to multiple API versions.

## Limit access to specific users or groups

You can limit access to the authentication settings associated with an API to specific users or groups in your organization. You do this by configuring an access policy that assigns users or groups the **API Center Credential Access Reader** role, scoped to specific authentication settings in the API. This is useful if you want to allow only specific users to test an API in the API Center portal.


1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. Navigate to an API version to which you've added authentication settings (see previous section).
1. In the left menu, under **Details**, select **Manage Access (preview)**.
1. Select the **Edit access policies** dropdown at the end of the row for the authentication settings you want to limit access to.
1. In the **Manage access** page, select **+ Add > Users** or **+ Add > Groups**.
1. Search for and select the users (or groups) that you want to add. You can select multiple items.
1. Click **Select**. 

> [!TIP]
> You can also remove users or groups from the access policy. In the **Manage access** page, select **Delete** in the context (...) menu  for the user or group.

## Test API in API Center portal


You can test an API with the authorization in the API Center portal. 

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **API Center Portal**, select **Portal settings**.
1. Select **View API Center portal**.
1. In the API Center portal, select an API that you want to test. Ensure that the API has authentication and access settings associated with it.
1. Select an operation in the API, and select **Try this API**.
1. In the window that opens, review the authentication settings. If you have access to the API, select **Test** to try the API.

## Related content

* [Set up API Center portal](set-up-api-center-portal.md)
* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)