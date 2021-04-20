---
title: Secure API Management backend using client certificate authentication
titleSuffix: Azure API Management
description: Learn how to manage client certificates and secure backend services using client certificate authentication in Azure API Management.
services: api-management
documentationcenter: ''
author: mikebudzynski

ms.service: api-management
ms.topic: article
ms.date: 01/26/2021
ms.author: apimpm
---

# Secure backend services using client certificate authentication in Azure API Management

API Management allows you to secure access to the backend service of an API using client certificates. This guide shows how to manage certificates in an Azure API Management service instance using the Azure portal. It also explains how to configure an API to use a certificate to access a backend service.

You can also manage API Management certificates using the [API Management REST API](/rest/api/apimanagement/2020-06-01-preview/certificate).

## Certificate options

API Management provides two options to manage certificates used to secure access to backend services:

* Reference a certificate managed in [Azure Key Vault](../key-vault/general/overview.md) 
* Add a certificate file directly in API Management

Using key vault certificates is recommended because it helps improve API Management security:

* Certificates stored in key vaults can be reused across services
* Granular [access policies](../key-vault/general/security-overview.md#privileged-access) can be applied to certificates stored in key vaults
* Certificates updated in the key vault are automatically rotated in API Management. After update in the key vault, a certificate in API Management is updated within 4 hours. You can also manually refresh the certificate using the Azure portal or via the management REST API.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* If you have not created an API Management service instance yet, see [Create an API Management service instance][Create an API Management service instance].
* You should have your backend service configured for client certificate authentication. To configure certificate authentication in the Azure App Service, refer to [this article][to configure certificate authentication in Azure WebSites refer to this article]. 
* You need access to the certificate and the password for management in an Azure key vault or upload to the API Management service. The certificate must be in **PFX** format. Self-signed certificates are allowed.

### Prerequisites for key vault integration

1. For steps to create a key vault, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).
1. Enable a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) in the API Management instance.
1. Assign a [key vault access policy](../key-vault/general/assign-access-policy-portal.md) to the managed identity with permissions to get and list certificates from the vault. To add the policy:
    1. In the portal, navigate to your key vault.
    1. Select **Settings > Access policies > + Add Access Policy**.
    1. Select **Certificate permissions**, then select **Get** and **List**.
    1. In **Select principal**, select the resource name of your managed identity. If you're using a system-assigned identity, the principal is the name of your API Management instance.
1. Create or import a certificate to the key vault. See [Quickstart: Set and retrieve a certificate from Azure Key Vault using the Azure portal](../key-vault/certificates/quick-create-portal.md).

[!INCLUDE [api-management-key-vault-network](../../includes/api-management-key-vault-network.md)]

## Add a key vault certificate

See [Prerequisites for key vault integration](#prerequisites-for-key-vault-integration).

> [!CAUTION]
> When using a key vault certificate in API Management, be careful not to delete the certificate, key vault, or managed identity used to access the key vault.

To add a key vault certificate to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **Security**, select **Certificates**.
1. Select **Certificates** > **+ Add**.
1. In **Id**, enter a name of your choice.
1. In **Certificate**, select **Key vault**.
1. Enter the identifier of a key vault certificate, or choose **Select** to select a certificate from a key vault.
    > [!IMPORTANT]
    > If you enter a key vault certificate identifier yourself, ensure that it doesn't have version information. Otherwise, the certificate won't rotate automatically in API Management after an update in the key vault.
1. In **Client identity**, select a system-assigned or an existing user-assigned managed identity. Learn how to [add or modify managed identities in your API Management service](api-management-howto-use-managed-service-identity.md).
    > [!NOTE]
    > The identity needs permissions to get and list certificate from the key vault. If you haven't already configured access to the key vault, API Management prompts you so it can automatically configure the identity with the necessary permissions.
1. Select **Add**.

    :::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-kv.png" alt-text="Add key vault certificate":::

## Upload a certificate

To upload a client certificate to API Management: 

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **Security**, select **Certificates**.
1. Select **Certificates** > **+ Add**.
1. In **Id**, enter a name of your choice.
1. In **Certificate**, select **Custom**.
1. Browse to select the certificate .pfx file, and enter its password.
1. Select **Add**.

    :::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-add.png" alt-text="Upload client certificate":::

After the certificate is uploaded, it shows in the **Certificates** window. If you have many certificates, make a note of the thumbprint of the desired certificate in order to configure an API to use a client certificate for [gateway authentication](#configure-an-api-to-use-client-certificate-for-gateway-authentication).

> [!NOTE]
> To turn off certificate chain validation when using, for example, a self-signed certificate, follow the steps described in [Self-signed certificates](#self-signed-certificates), later in this article.

## Configure an API to use client certificate for gateway authentication

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **APIs**.
1. Select an API from the list. 
2. In the **Design** tab, select the editor icon in the **Backend** section.
3. In **Gateway credentials**, select **Client cert** and select your certificate from the dropdown.
1. Select **Save**.

    :::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-enable-select.png" alt-text="Use client certificate for gateway authentication":::

> [!CAUTION]
> This change is effective immediately, and calls to operations of that API will use the certificate to authenticate on the backend server.

> [!TIP]
> When a certificate is specified for gateway authentication for the backend service of an API, it becomes part of the policy for that API, and can be viewed in the policy editor.

## Self-signed certificates

If you are using self-signed certificates, you will need to disable certificate chain validation for API Management to communicate with the backend system. Otherwise it will return a 500 error code. To configure this, you can use the [`New-AzApiManagementBackend`](/powershell/module/az.apimanagement/new-azapimanagementbackend) (for new backend) or [`Set-AzApiManagementBackend`](/powershell/module/az.apimanagement/set-azapimanagementbackend) (for existing backend) PowerShell cmdlets and set the `-SkipCertificateChainValidation` parameter to `True`.

```powershell
$context = New-AzApiManagementContext -resourcegroup 'ContosoResourceGroup' -servicename 'ContosoAPIMService'
New-AzApiManagementBackend -Context  $context -Url 'https://contoso.com/myapi' -Protocol http -SkipCertificateChainValidation $true
```

## Delete a client certificate

To delete a certificate, select it and then select **Delete** from the context menu (**...**).

:::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-delete-new.png" alt-text="Delete a certificate":::

> [!IMPORTANT]
> If the certificate is referenced by any policies, then a warning screen is displayed. To delete the certificate, you must first remove the certificate from any policies that are configured to use it.

## Next steps

* [How to secure APIs using client certificate authentication in API Management](api-management-howto-mutual-certificates-for-clients.md)
* Learn about [policies in API Management](api-management-howto-policies.md)


[How to add operations to an API]: ./mock-api-responses.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: ../api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-policies.md#caching-policies
[Create an API Management service instance]: get-started-create-service-instance.md

[Azure API Management REST API Certificate entity]: ./api-management-caching-policies.md
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[to configure certificate authentication in Azure WebSites refer to this article]: ../app-service/app-service-web-configure-tls-mutual-auth.md

