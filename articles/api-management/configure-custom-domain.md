---
title: Configure custom domain name for Azure API Management instance
titleSuffix: Azure API Management
description: How to configure a custom domain name and choose certificates for the endpoints of your Azure API Management instance.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 01/13/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# Configure a custom domain name for your Azure API Management instance

When you create an Azure API Management service instance in the Azure cloud, Azure assigns it a `azure-api.net` subdomain (for example, `apim-service-name.azure-api.net`). You can also expose your API Management endpoints using your own custom domain name, such as **`contoso.com`**. This article shows you how to map an existing custom DNS name to endpoints exposed by an API Management instance.

> [!IMPORTANT]
> API Management only accepts requests with [host header](https://tools.ietf.org/html/rfc2616#section-14.23) values matching:
>
>* The Gateway's default domain name
>* Any of the Gateway's configured custom domain names

## Prerequisites

-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
-   A custom domain name that is owned by you or your organization. This article does not provide instructions on how to procure a custom domain name.
-   Optionally, a valid certificate with a public and private key (.PFX). The subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over TLS). 

    See [Domain certificate options](#domain-certificate-options).

- DNS records hosted on a DNS server to map the custom domain name to the default domain name of your API Management instance. This topic does not provide instructions on how to host the DNS records. 

    For more information about required records, see [DNS configuration](#dns-configuration), later in this article. 
 
## Endpoints for custom domains

There are several API Management endpoints to which you can assign a custom domain name. Currently, the following endpoints are available:

| Endpoint | Default |
| -------- | ----------- |
| **Gateway** | Default is: `<apim-service-name>.azure-api.net`. Gateway is the only endpoint available for configuration in the Consumption tier.<br/><br/>The default Gateway endpoint configuration remains available after a custom Gateway domain is added. |
| **Developer portal** | Default is: `<apim-service-name>.developer.azure-api.net` |
| **Management** | Default is: `<apim-service-name>.management.azure-api.net` |
| **Configuration API (v2)** | Default is: `<apim-service-name>.configuration.azure-api.net` |
| **SCM** | Default is: `<apim-service-name>.scm.azure-api.net` |

### Considerations

* You can update any of the endpoints supported in your service tier. Typically, customers update **Gateway** (this URL is used to call the APIs exposed through API Management) and **Developer portal** (the developer portal URL).
* The default **Gateway** endpoint remains available after you configure a custom Gateway domain name and cannot be deleted. For other API Management endpoints (such as **Developer portal**) that you configure with a custom domain name, the default endpoint is no longer available.
* Only API Management instance owners can use **Management** and **SCM** endpoints internally. These endpoints are less frequently assigned a custom domain name.
* The **Premium** and **Developer** tiers support setting multiple hostnames for the **Gateway** endpoint.
* Wildcard domain names, like `*.contoso.com`, are supported in all tiers except the Consumption tier. A specific subdomain certificate (for example, api.contoso.com) would take precedence over a wildcard certificate (*.contoso.com) for requests to api.contoso.com.

## Domain certificate options

API Management supports custom TLS certificates or certificates imported from Azure Key Vault. You can also enable a free, managed certificate.

> [!WARNING]
> If you require certificate pinning, please use a custom domain name and either a custom or Key Vault certificate, not the default certificate or the free, managed certificate. We don't recommend taking a hard dependency on a certificate that you don't manage.

# [Custom](#tab/custom)

If you already have a private certificate from a third-party provider, you can upload it to your API Management instance. It must meet the following requirements. (If you enable the free certificate managed by API Management, it already meets these requirements.)

* Exported as a PFX file, encrypted using triple DES, and optionally password protected.
* Contains private key at least 2048 bits long
* Contains all intermediate certificates and the root certificate in the certificate chain.

# [Key Vault](#tab/key-vault)

We recommend using Azure Key Vault to [manage your certificates](../key-vault/certificates/about-certificates.md) and setting them to `autorenew`.

If you use Azure Key Vault to manage a custom domain TLS certificate, make sure the certificate is inserted into Key Vault [as a ](/rest/api/keyvault/certificates/create-certificate/create-certificate)_[certificate](/rest/api/keyvault/certificates/create-certificate/create-certificate)_, not a _secret_.

> [!CAUTION]
> When using a key vault certificate in API Management, be careful not to delete the certificate, key vault, or managed identity used to access the key vault.

To fetch a TLS/SSL certificate, API Management must have the list and get secrets permissions on the Azure Key Vault containing the certificate. 
* When you use the Azure portal to import the certificate, all the necessary configuration steps are completed automatically. 
* When you use command-line tools or management API, these permissions must be granted manually, in two steps:
    1. On the **Managed identities** page of your API Management instance, enable a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md). Note the principal ID on that page.
    1.  Assign permissions to the managed identity to access the key vault. Use steps in the following section.
    
    [!INCLUDE [api-management-key-vault-access](../../includes/api-management-key-vault-access.md)]


If the certificate is set to `autorenew` and your API Management tier has an SLA (that is, in all tiers except the Developer tier), API Management will pick up the latest version automatically, without downtime to the service.

For more information, see [Use managed identities in Azure API Management](api-management-howto-use-managed-service-identity.md).    

# [Managed](#tab/managed)

API Management offers a free, managed TLS certificate for your domain, if you don't wish to purchase and manage your own certificate. The certificate is autorenewed automatically.

> [!NOTE]
> The free, managed TLS certificate is available for all API Management service tiers. It is currently in preview.

#### Limitations

* Currently can be used only with the Gateway endpoint of your API Management service
* Not supported with the self-hosted gateway
* Not supported in the following Azure regions: France South and South Africa West
* Currently available only in the Azure cloud
* Does not support root domain names (for example, `contoso.com`). Requires a fully qualified name such as `api.contoso.com`.
* Can only be configured when updating an existing API Management instance, not when creating an instance



---
## Set a custom domain name - portal

Choose the steps according to the [domain certificate](#domain-certificate-options) you want to use.

# [Custom](#tab/custom)

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left navigation, select **Custom domains**.
1. Select **+Add**, or select an existing [endpoint](#endpoints-for-custom-domains) that you want to update.
1. In the window on the right, select the **Type** of endpoint for the custom domain.
1. In the **Hostname** field, specify the name you want to use. For example, `api.contoso.com`.
1. Under **Certificate**, select **Custom**
1. Select **Certificate file** to select and upload a certificate.
1. Upload a valid .PFX file and provide its **Password**, if the certificate is protected with a password.
1. When configuring a Gateway endpoint, select or deselect [other options as necessary](#clients-calling-with-server-name-indication-sni-header), including **Negotiate client certificate** or **Default SSL binding**.
    :::image type="content" source="media/configure-custom-domain/gateway-domain-custom-certificate.png" alt-text="Configure gateway domain with custom certificate":::
1. Select **Add**, or select **Update** for an existing endpoint.
1. Select **Save**.

# [Key Vault](#tab/key-vault)

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left navigation, select **Custom domains**.
1. Select **+Add**, or select an existing [endpoint](#endpoints-for-custom-domains) that you want to update.
1. In the window on the right, select the **Type** of endpoint for the custom domain.
1. In the **Hostname** field, specify the name you want to use. For example, `api.contoso.com`.
1. Under **Certificate**, select **Key Vault** and then **Select**.
    1. Select the **Subscription** from the dropdown list.
    1. Select the **Key vault** from the dropdown list.
    1. Once the certificates have loaded, select the **Certificate** from the dropdown list. Click **Select**.
    1. In **Client identity**, select a system-assigned identity or a user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) enabled in the instance to access the key vault.
1. When configuring a Gateway endpoint, select or deselect [other options as necessary](#clients-calling-with-server-name-indication-sni-header), including **Negotiate client certificate** or **Default SSL binding**.
    :::image type="content" source="media/configure-custom-domain/gateway-domain-key-vault-certificate.png" alt-text="Configure gateway domain with Key Vault certificate":::
1. Select **Add**, or select **Update** for an existing endpoint.
1. Select **Save**.

# [Managed](#tab/managed)

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left navigation, select **Custom domains**.
1. Select **+Add**, or select an existing [endpoint](#endpoints-for-custom-domains) that you want to update.
1. In the window on the right, select the **Type** of endpoint for the custom domain.
1. In the **Hostname** field, specify the name you want to use. For example, `api.contoso.com`.
1. Under **Certificate**, select **Managed** to enable a free certificate managed by API Management. The managed certificate is available in preview for the Gateway endpoint only.
1. Copy the following values and use them to [configure DNS](#dns-configuration):
    * **TXT record**
    * **CNAME record**
1. When configuring a Gateway endpoint, select or deselect [other options as necessary](#clients-calling-with-server-name-indication-sni-header), including **Negotiate client certificate** or **Default SSL binding**.
    :::image type="content" source="media/configure-custom-domain/gateway-domain-free-certifcate.png" alt-text="Configure gateway domain with free certificate":::
1. Select **Add**, or select **Update** for an existing endpoint.
1. Select **Save**.

> [!NOTE]
> The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer tier has downtime, while Basic and higher tiers do not.



---

## DNS configuration

* Configure a CNAME record for your custom domain. 
* When using API Management's free, managed certificate, also configure a TXT record to establish your ownership of the domain.

> [!NOTE]
> The free certificate is issued by DigiCert. For some domains, you must explicitly allow DigiCert as a certificate issuer by creating a [CAA domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value: `0 issue digicert.com`.

### CNAME record

Configure a CNAME record that points from your custom domain name (for example, `api.contoso.com`) to your API Management service hostname (for example, `<apim-service-name>.azure-api.net`). A CNAME record is more stable than an A-record in case the IP address changes. For more information, see [IP addresses of Azure API Management](api-management-howto-ip-addresses.md#changes-to-the-ip-addresses) and the [API Management FAQ](./api-management-faq.yml#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-backend-services-).

> [!NOTE]
> Some domain registrars only allow you to map subdomains when using a CNAME record, such as `www.contoso.com`, and not root names, such as `contoso.com`. For more information on CNAME records, see the documentation provided by your registrar or [IETF Domain Names - Implementation and Specification](https://tools.ietf.org/html/rfc1035).

> [!CAUTION]
> When you use the free, managed certificate and configure a CNAME record with your DNS provider, make sure that it resolves to the default API Management service hostname (`<apim-service-name>.azure-api.net`). Currently, API Management doesn't automatically renew the certificate if the CNAME record doesn't resolve to the default API Management hostname. For example, if you're using the free, managed certificate and you use Cloudflare as your DNS provider, make sure that DNS proxy isn't enabled on the CNAME record. 

### TXT record 

When enabling the free, managed certificate for API Management, also configure a TXT record in your DNS zone to establish your ownership of the domain name. 

* The name of the record is your custom domain name prefixed by `apimuid`. Example: `apimuid.api.contoso.com`.
* The value is a domain ownership identifier provided by your API Management instance.

When you use the portal to configure the free, managed certificate for your custom domain, the name and value of the necessary TXT record are automatically displayed.

You can also get a domain ownership identifier by calling the [Get Domain Ownership Identifier](/rest/api/apimanagement/current-ga/api-management-service/get-domain-ownership-identifier) REST API.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)


