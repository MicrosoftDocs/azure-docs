---
title: Secure API Management Backend Using Client Certificate Authentication
titleSuffix: Azure API Management
description: Learn how to manage client certificates and secure backend services by using client certificate authentication in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/19/2025
ms.author: danlep 
ms.custom:
  - devx-track-azurepowershell
  - engagement-fy23
  - sfi-image-nochange

#customer intent: As an API developer, I want to secure backend services by using client certificate authentication. 
---

# Secure backend services by using client certificate authentication in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]


API Management allows you to secure access to the backend service of an API by using client certificates and mutual TLS authentication. This article shows how to manage certificates in API Management by using the Azure portal. It also explains how to configure an API to use a certificate to access a backend service.

You can also manage API Management certificates by using the [API Management REST API](/rest/api/apimanagement/current-ga/certificate).

## Certificate options

API Management provides two options for managing certificates that are used to secure access to backend services:

* Reference a certificate that's managed in [Azure Key Vault](/azure/key-vault/general/overview). 
* Add a certificate file directly in API Management.

We recommend that you use key vault certificates because doing so improves API Management security:

* Certificates stored in key vaults can be reused across services.
* Granular [access policies](/azure/key-vault/general/security-features#privileged-access) can be applied to certificates stored in key vaults.
* Certificates updated in the key vault are automatically rotated in API Management. After an update in the key vault, a certificate in API Management is updated within four hours. You can also manually refresh the certificate by using the Azure portal or via the management REST API.

## Prerequisites

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

* If you haven't created an API Management instance yet, see [Create an API Management service instance](get-started-create-service-instance.md).
* Configure your backend service client certificate authentication. For information about configuring certificate authentication in Azure App Service, see [Configure TLS mutual authentication in App Service][to configure certificate authentication in Azure WebSites refer to this article]. 
* Ensure that you have access to the certificate and the password for management in an Azure key vault, or a certificate to upload to the API Management service. The certificate must be in PFX format. Self-signed certificates are allowed. 

    If you use a self-signed certificate:
    * Install trusted root and intermediate [CA certificates](api-management-howto-ca-certificates.md) in your API Management instance. 
    
        > [!NOTE]
        > CA certificates for certificate validation aren't supported in the Consumption tier.
    * Disable certificate chain validation. See [Disable certificate chain validation for self-signed certificates](#disable-certificate-chain-validation-for-self-signed-certificates) later in this article.

[!INCLUDE [api-management-client-certificate-key-vault](../../includes/api-management-client-certificate-key-vault.md)]

After the certificate is uploaded, it shows in the **Certificates** window. If you have many certificates, note the thumbprint of the certificate that you just uploaded. You'll need it to configure an API to use the client certificate for [gateway authentication](#configure-an-api-to-use-client-certificate-for-gateway-authentication).


## Configure an API to use client certificate for gateway authentication

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. Under **APIs**, select **APIs**.
1. Select an API from the list. 
1. On the **Design** tab, select the pencil icon in the **Backend** section.
1. In **Gateway credentials**, select **Client cert** and then select your certificate in the **Client certificate** list.
1. Select **Save**.

    :::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-enable-select.png" alt-text="Use client certificate for gateway authentication":::

> [!CAUTION]
> This change is effective immediately. Calls to operations of the API will use the certificate to authenticate on the backend server.

> [!TIP]
> When a certificate is specified for gateway authentication for the backend service of an API, it becomes part of the policy for that API and can be viewed in the policy editor.

## Disable certificate chain validation for self-signed certificates

If you're using self-signed certificates, you need to disable certificate chain validation to enable API Management to communicate with the backend system. Otherwise you'll get a 500 error code. To disable this validation, you can use the [`New-AzApiManagementBackend`](/powershell/module/az.apimanagement/new-azapimanagementbackend) (for a new backend) or [`Set-AzApiManagementBackend`](/powershell/module/az.apimanagement/set-azapimanagementbackend) (for an existing backend) PowerShell cmdlets and set the `-SkipCertificateChainValidation` parameter to `True`:

```powershell
$context = New-AzApiManagementContext -ResourceGroupName 'ContosoResourceGroup' -ServiceName 'ContosoAPIMService'
New-AzApiManagementBackend -Context  $context -Url 'https://contoso.com/myapi' -Protocol http -SkipCertificateChainValidation $true
```

You can also disable certificate chain validation by using the [Backend](/rest/api/apimanagement/current-ga/backend) REST API.

## Delete a client certificate

To delete a certificate, select **Delete** on the ellipsis (**...**) menu:

:::image type="content" source="media/api-management-howto-mutual-certificates/apim-client-cert-delete-new.png" alt-text="Delete a certificate":::

> [!IMPORTANT]
> If the certificate is referenced by any policies, a warning screen appears. To delete the certificate, you must first remove it from any policies that are configured to use it.

## Related content

* [How to secure APIs using client certificate authentication in API Management](api-management-howto-mutual-certificates-for-clients.md)
* [How to add a custom CA certificate in Azure API Management](./api-management-howto-ca-certificates.md)
* [Policies in API Management](api-management-howto-policies.md)


[How to add operations to an API]: ./mock-api-responses.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: ../api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-policies.md#caching
[Create an API Management service instance]: get-started-create-service-instance.md

[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[to configure certificate authentication in Azure WebSites refer to this article]: ../app-service/app-service-web-configure-tls-mutual-auth.md
