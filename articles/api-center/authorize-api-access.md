---
title: Authorize API access in Azure API Center
description: How to configure access to APIs in the Azure API Center inventory using API keys or OAuth authorization.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 04/23/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to ... TBD t
---

# Authorize access to APIs in your API Center

> [!NOTE]
> This feature is currently in preview.

## Scenario overvivew


<!-- Check if these prereqs are sufficient/necessary -->
[!INCLUDE [api-center-portal-prerequisites](includes/api-center-portal-prerequisites.md)]

* To test APIs, enable the [API Center portal](set-up-api-center-portal.md) in your API center.

* Register a test API in your API center. For more information, see [Tutorial: Register APIs in your API inventory](register-apis.md).

* Configure an environment and a deployment for the API. For more information, see [Tutorial: dConfigure environments and deployments](configure-environments-deployments.md).

## Configure authorization

Configure an authorization in your API center. API users or client apps can use this authorization to authenticate requests to the API.

* An authorization can either be an API key or an OAuth 2.0 authorization code flow.

* You can associate the authorization with one or more APIs or API versions. 

* The authorization can be used in the API Center portal to test the API.



### API key authorization

#### Store secret in Azure Key Vault

To store the API key securely, use Azure Key Vault. You can create a new key vault or use an existing one, using the Azure portal, Azure tools, or Azure SDKs. Your key vault should use the Azure role-based access control (RBAC) permission model.

* For steps to create a Key Vault, see [Create a Key Vault](/azure/key-vault/general/quick-create-portal).

* To store a secret in the Key Vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

    Note the *secret identifier* of the secret. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>` (without version information). You will need this value when you configure the API key authorization in your API center.

<!-- Should we use the version of the secret in the URI? -->


#### Enable a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access Azure resources. Depending on your needs, enable either a system-assigned or one or more user-assigned managed identities. 

The following examples show how to enable a system-assigned managed identity by using the Azure portal. At a high level, configuration steps are similar for a user-assigned managed identity. 


1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

#### Assign the Key Vault Secrets User role to the managed identity

Assign your API center's managed identity the **Key Vault Secrets User** role in your key vault. The following steps use the [portal](../../role-based-access-control/role-assignments-portal-managed-identity.yml).

1. In the [portal](https://azure.microsoft.com), navigate to your key vault.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page, select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign**.


#### Configure API key authorization in portal

1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. In the left menu, under **Assets**, select **Authorization (preview)** > **+ Add configuration**.
1. In the **Add authorization** page, set the values as follows:
    1. Enter a **Title** (name) and optional **Description** for the authorization.
    1. In **Security scheme**, select **API Key**.
    1. In **API key location**, select how the key is presented in API requests. Available values are **Header** (request header) and **Query** (query parameter).
    1. In **API key parameter name**, enter the name of the HTTP header or query parameter that contains the API key. For example, `x-api-key`.
    1. In **API key Key Vault secret reference**, enter the URI of the secret in your key vault that contains the API key. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>.
    1. In **Key vault secret**, enter the URI of the secret in your key vault that contains the API key. This is a URI of the form `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`.
    1. Select **Create**.


### OAuth 2.0 authorization


#### Create an OAuth 2.0 app




#### Configure authorization in portal

TBD



## Associate authorization with API

You associate an authorization with an API version.

1. In the [portal](https://azure.microsoft.com), navigate to your key API center.
1. In the left menu, under **Assets**, select **APIs**.
1. Select an API that you want to associate the authorization with.
1. In the left menu, under **Details**, select **Versions**.
1. Select the API version that you want to associate the authorization with.
1. In the left menu, under **Details**, select **Manage Access (preview)** > **+ Add authentication**.
1. In the **Add authentication** page, select an available **Authentication configuration** that you want to associate with the API version.
1. Select **Create**.


## Test API with authorization in API Center portal
You can test an API with the authorization in the API Center portal. 
<!--
### API visibility

API visibility settings control which APIs are discoverable (visible) to API Center portal users. The API Center portal uses the data plane API to retrieve and display APIs, and by default retrieves all APIs in your API center.

To make only specific APIs visible, go to the **API visibility** tab in the API Center portal settings. Here, add filter conditions for APIs based on built-in or custom API [metadata](metadata.md) properties. For instance, you can choose to display APIs only of certain types (like REST or GraphQL) or based on certain specification formats (such as OpenAPI). Additionally, you can select values of custom metadata properties that categorize your APIs.

:::image type="content" source="media/set-up-api-center-portal/add-visibility-condition.png" alt-text="Screenshot of adding API visibility conditions in the portal.":::

## Enable sign-in to portal by Microsoft Entra users and groups 

[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]

[!INCLUDE [api-center-portal-compare-apim-dev-portal](includes/api-center-portal-compare-apim-dev-portal.md)]

-->

## Related content

* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)