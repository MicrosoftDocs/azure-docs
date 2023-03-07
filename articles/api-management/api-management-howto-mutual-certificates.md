---
title: Secure API Management backend using client certificate authentication
titleSuffix: Azure API Management
description: Learn how to manage client certificates and secure backend services using client certificate authentication in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 01/12/2023
ms.author: danlep 
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Secure backend services using client certificate authentication in Azure API Management

API Management allows you to secure access to the backend service of an API using client certificates and mutual TLS authentication. This guide shows how to manage certificates in an Azure API Management service instance using the Azure portal. It also explains how to configure an API to use a certificate to access a backend service.

You can also manage API Management certificates using the [API Management REST API](/rest/api/apimanagement/current-ga/certificate).

## Certificate options

API Management provides two options to manage certificates used to secure access to backend services:

* Reference a certificate managed in [Azure Key Vault](../key-vault/general/overview.md) 
* Add a certificate file directly in API Management

Using key vault certificates is recommended because it helps improve API Management security:

* Certificates stored in key vaults can be reused across services
* Granular [access policies](../key-vault/general/security-features.md#privileged-access) can be applied to certificates stored in key vaults
* Certificates updated in the key vault are automatically rotated in API Management. After update in the key vault, a certificate in API Management is updated within 4 hours. You can also manually refresh the certificate using the Azure portal or via the management REST API.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* If you have not created an API Management service instance yet, see [Create an API Management service instance](get-started-create-service-instance.md).
* You should have your backend service configured for client certificate authentication. To configure certificate authentication in the Azure App Service, refer to [this article][to configure certificate authentication in Azure WebSites refer to this article]. 
* You need access to the certificate and the password for management in an Azure key vault or upload to the API Management service. The certificate must be in **PFX** format. Self-signed certificates are allowed. 

    If you use a self-signed certificate:
    * Install trusted root and intermediate [CA certificates](api-management-howto-ca-certificates.md) in your API Management instance. 
    
        > [!NOTE]
        > CA certificates for certificate validation are not supported in the Consumption tier.
    * [Disable certificate chain validation](#disable-certificate-chain-validation-for-self-signed-certificates)

[!INCLUDE [api-management-client-certificate-key-vault](../../includes/api-management-client-certificate-key-vault.md)]

After the certificate is uploaded, it shows in the **Certificates** window. If you have many certificates, make a note of the thumbprint of the desired certificate in order to configure an API to use a client certificate for [gateway authentication](#configure-an-api-to-use-client-certificate-for-gateway-authentication).


## Configure an API to use client certificate for gateway authentication

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **APIs**.
1. Select an API from the list. 
1. In the **Design** tab, select the editor icon in the **Backend** section.
1. In **Gateway credentials**, select **Client cert** and select your certificate from the dropdown.
1. Select **Save**.

    :::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-enable-select.png" alt-text="Use client certificate for gateway authentication":::

> [!CAUTION]
> This change is effective immediately, and calls to operations of that API will use the certificate to authenticate on the backend server.

> [!TIP]
> When a certificate is specified for gateway authentication for the backend service of an API, it becomes part of the policy for that API, and can be viewed in the policy editor.

## Disable certificate chain validation for self-signed certificates

If you are using self-signed certificates, you will need to disable certificate chain validation for API Management to communicate with the backend system. Otherwise it will return a 500 error code. To configure this, you can use the [`New-AzApiManagementBackend`](/powershell/module/az.apimanagement/new-azapimanagementbackend) (for new backend) or [`Set-AzApiManagementBackend`](/powershell/module/az.apimanagement/set-azapimanagementbackend) (for existing backend) PowerShell cmdlets and set the `-SkipCertificateChainValidation` parameter to `True`.

```powershell
$context = New-AzApiManagementContext -resourcegroup 'ContosoResourceGroup' -servicename 'ContosoAPIMService'
New-AzApiManagementBackend -Context  $context -Url 'https://contoso.com/myapi' -Protocol http -SkipCertificateChainValidation $true
```

You can also disable certificate chain validation by using the [Backend](/rest/api/apimanagement/current-ga/backend) REST API.

## Delete a client certificate

To delete a certificate, select it and then select **Delete** from the context menu (**...**).

:::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-delete-new.png" alt-text="Delete a certificate":::

> [!IMPORTANT]
> If the certificate is referenced by any policies, then a warning screen is displayed. To delete the certificate, you must first remove the certificate from any policies that are configured to use it.

## Next steps

* [How to secure APIs using client certificate authentication in API Management](api-management-howto-mutual-certificates-for-clients.md)
* [How to add a custom CA certificate in Azure API Management](./api-management-howto-ca-certificates.md)
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
