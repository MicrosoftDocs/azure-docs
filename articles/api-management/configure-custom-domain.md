---
title: Configure custom domain name for Azure API Management instance
titleSuffix: Azure API Management
description: How to configure a custom domain name for the endpoints of your Azure API Management instance.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 12/08/2021
ms.author: danlep
---

# Configure a custom domain name for your Azure API Management instance

When you create an Azure API Management service instance in the Azure cloud, Azure assigns it a `azure-api.net` subdomain (for example, `apim-service-name.azure-api.net`). You can also expose your API Management endpoints using your own custom domain name, such as **`contoso.com`**. This article shows you how to map an existing custom DNS name to endpoints exposed by an API Management instance.

> [!IMPORTANT]
> API Management accepts only requests with [host header](https://tools.ietf.org/html/rfc2616#section-14.23) values matching:
>
>* The default domain name
>* Any of the configured custom domain names

## Prerequisites

-   An active Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
-   A custom domain name that is owned by you or your organization. This topic does not provide instructions on how to procure a custom domain name.
-   Optionally, a valid certificate with a public and private key (.PFX). The subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over TLS). 

    See [Domain certificate options](#domain-certificate-options).

- DNS records hosted on a DNS server to map the custom domain name to the default domain name of your API Management instance. This topic does not provide instructions on how to host the DNS records. 

    For more information about required records, see [DNS configuration ](#dns-configuration), later in this article. 
 
## Endpoints for custom domains

There are several API Management service endpoints to which you can assign a custom domain name. Currently, the following endpoints are available:

| Endpoint | Default |
| -------- | ----------- |
| **Gateway** | Default is: `<apim-service-name>.azure-api.net`. Gateway is the only endpoint available for configuration in the Consumption tier.<br/><br/>The default Gateway endpoint configuration remains available after a custom Gateway domain is added. |
| **Developer portal (legacy)** | Default is: `<apim-service-name>.portal.azure-api.net` |
| **Developer portal** | Default is: `<apim-service-name>.developer.azure-api.net` |
| **Management** | Default is: `<apim-service-name>.management.azure-api.net` |
| **SCM** | Default is: `<apim-service-name>.scm.azure-api.net` |

### Considerations
* You can update any of the endpoints supported in your service tier. Typically, customers update **Gateway** (this URL is used to call the API exposed through API Management) and **Developer portal** (the developer portal URL).
* Only API Management instance owners can use **Management** and **SCM** endpoints internally. These endpoints are less frequently assigned a custom domain name.
* The **Premium** and **Developer** tiers support setting multiple hostnames for the **Gateway** endpoint.
* Wildcard domain names, like `*.contoso.com`, are supported in all tiers except the Consumption tier.

## Domain certificate options

The following table lists the options you have for adding domain certificates in API Management:

|Option|Description|
|-|-|
| Upload a [custom certificate](#custom-certificate) | If you already have a private certificate from a third-party provider, you can upload it to your API Management instance.  |
| Import a [certificate from Key Vault](#key-vault-certificate) | Useful if you use [Azure Key Vault](../key-vault/index.yml) to manage your PKCS12 certificates. |
| Enable a free [managed TLS certificate](#managed-tls-certificate) (preview) | A certificate that's free of charge and easy to use if you just need to secure your Gateway domain in your API Management service. |

> [!WARNING]
> If you wish to improve the security of your applications with certificate pinning, you should use a custom domain name and certificate that you manage, not the default certificate or the free managed certificate. We don't recommend taking a hard dependency on a certificate that you don't manage.

### Custom certificate

If you choose to upload or import a private certificate to API Management, your certificate must meet the following requirements. If you use a free certificate managed by API Management, it already meets these requirements.

* Exported as a PFX file, encrypted using triple DES, and optionally password protected.
* Contains private key at least 2048 bits long
* Contains all intermediate certificates and the root certificate in the certificate chain.

### Key vault certificate

When using [Azure Key Vault for managing certificates](../key-vault/certificates/about-certificates.md), set them to `autorenew`.

If you use Azure Key Vault to manage a custom domain TLS/SSL certificate, make sure the certificate is inserted into Key Vault [as a _certificate_](/rest/api/keyvault/createcertificate/createcertificate), not a _secret_.

To fetch a TLS/SSL certificate, API Management must have the list and get secrets permissions on the Azure Key Vault containing the certificate. 
* When using the Azure portal to import the certificate, all the necessary configuration steps are completed automatically. 
* When using command line tools or management API, these permissions must be granted manually, in two steps:
    1. On the **Managed identities** page of your API Management instance, enable a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md). Note the principal Id on that page. 
    1. Give the list and get secrets permissions to this principal Id on the Azure Key Vault containing the certificate.

If the certificate is set to `autorenew` and your API Management tier has an SLA (i.e., in all tiers except the Developer tier), API Management will pick up the latest version automatically, without downtime to the service.

### Managed TLS certificate

API Management offers a free, managed TLS certificate for your domain, if you don't wish to purchase and manage your own certificate. The certificate is autorenewed automatically.

> [!NOTE]
> The free, managed TLS certificate is available for all API Management service tiers. It is currently in preview.

#### Limitations

* Currently can be used only with the Gateway endpoint of your API Management service
* Not supported in the following Azure regions: France South and South Africa West
* Currently available only in the Azure cloud
* Does not support root domain names (for example, `contoso.com`). Requires a fully qualified name such as `api.contoso.com`.

## Set a custom domain name - portal

Choose the steps according to the type of domain certificate you want to use.

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

# [Key vault](#tab/key-vault)

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. In the left navigation, select **Custom domains**.
1. Select **+Add**, or select an existing [endpoint](#endpoints-for-custom-domains) that you want to update.
1. In the window on the right, select the **Type** of endpoint for the custom domain.
1. In the **Hostname** field, specify the name you want to use. For example, `api.contoso.com`.
1. Under **Certificate**, select **Key Vault** > **Select**.
    1. Select the **Subscription** from the dropdown list.
    1. Select the **Key vault** from the dropdown list.
    1. Once the certificates have loaded, select the **Certificate** from the dropdown list.
    1. Click **Select**.
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
1. Under **Certificate**, select **Managed** if you want to use a free certificate managed by API Management. THe managed certificate is available in preview for the Gateway endpoint only. 

    The **DNS TXT record value** you must  [configure in DNS](#dns-configuration) is displayed. Copy this value.
1. When configuring a Gateway endpoint, select or deselect [other options as necessary](#clients-calling-with-server-name-indication-sni-header), including **Negotiate client certificate** or **Default SSL binding**.
:::image type="content" source="media/configure-custom-domain/gateway-domain-free-certifcate.png" alt-text="Configure gateway domain with free certificate":::

1. Select **Add**, or select **Update** for an existing endpoint.
1. Select **Save**.
---
    
> [!NOTE]
> The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer tier has downtime, while Basic and higher tiers do not.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## DNS configuration

Configure a CNAME record for your custom domain. 

When using the API Management's free, managed certificate, also configure a TXT record.

### CNAME record

Configure a CNAME record that points from your custom domain name (for example, `api.contoso.com`) to your API Management service hostname (for example, `<apim-service-name>.azure-api.net`). A CNAME record is more stable than an A-record in case the IP address changes. For more information, see [IP addresses of Azure API Management](api-management-howto-ip-addresses.md#changes-to-the-ip-addresses) and the [API Management FAQ](./api-management-faq.yml#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-back-end-services-).

> [!NOTE]
> Some domain registrars only allow you to map subdomains when using a CNAME record, such as `www.contoso.com`, and not root names, such as `contoso.com`. For more information on CNAME records, see the documentation provided by your registrar or [IETF Domain Names - Implementation and Specification](https://tools.ietf.org/html/rfc1035).

### TXT record 

When enabling the free, managed certificate for API Management, also configure a TXT record in your DNS zone. 

1. Get a domain ownership identifier by calling the [Get Domain Ownership Identifier](/rest/api/apimanagement/current-ga/api-management-service/get-domain-ownership-identifier) REST API.

    This identifier is also displayed in the portal when you select to configure a managed certificate for your Gateway endpoint. 
1. Create a TXT record with the name of your custom domain prefixed by `apimuid`. Example name: `apimuid.api.contoso.com`.
1. Assign the domain ownership identifier as the TXT record's value.

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)