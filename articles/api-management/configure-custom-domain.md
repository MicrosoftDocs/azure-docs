---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure custom domain name for Azure API Management instance
titleSuffix: Azure API Management
description: This topic describes how to configure a custom domain name for your Azure API Management instance.
services: api-management
documentationcenter: ''
author: dlepow
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 08/24/2021
ms.author: danlep
---

# Configure a custom domain name for your Azure API Management instance

When you create an Azure API Management service instance, Azure assigns it a `azure-api.net` subdomain (for example, `apim-service-name.azure-api.net`). You can also expose your API Management endpoints using your own custom domain name, such as **`contoso.com`**. This tutorial shows you how to map an existing custom DNS name to endpoints exposed by an API Management instance.

> [!IMPORTANT]
> API Management accepts only requests with [host header](https://tools.ietf.org/html/rfc2616#section-14.23) values matching:
>
>* The default domain name
>* Any of the configured custom domain names

> [!WARNING]
> If you wish to improve the security of your applications with certificate pinning, you must use a custom domain name and certificate that you manage, not the default certificate. Pinning the default certificate takes a hard dependency on the properties of the certificate you don't manage, which we do not recommend.

## Prerequisites

-   An active Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
-   A custom domain name that is owned by you or your organization. This topic does not provide instructions on how to procure a custom domain name.
-   A [CNAME-record hosted on a DNS server](#dns-configuration) that maps the custom domain name to the default domain name of your API Management instance. This topic does not provide instructions on how to host a CNAME-record.
-   A valid certificate with a public and private key (.PFX). Subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over TLS).

## Use the Azure portal to set a custom domain name

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. Select **Custom domains**.

    There are a number of endpoints to which you can assign a custom domain name. Currently, the following endpoints are available:

    | Endpoint | Default |
    | -------- | ----------- |
    | **Gateway** | Default is: `<apim-service-name>.azure-api.net`. Gateway is the only endpoint available for configuration in the Consumption tier. |
    | **Developer portal (legacy)** | Default is: `<apim-service-name>.portal.azure-api.net` |
    | **Developer portal** | Default is: `<apim-service-name>.developer.azure-api.net` |
    | **Management** | Default is: `<apim-service-name>.management.azure-api.net` |
    | **SCM** | Default is: `<apim-service-name>.scm.azure-api.net` |

    > [!NOTE]
    > You can update any of the endpoints. Typically, customers update **Gateway** (this URL is used to call the API exposed through API Management) and **Portal** (the developer portal URL).
    > 
    > Only API Management instance owners can use **Management** and **SCM** endpoints internally. These endpoints are less frequently assigned a custom domain name.
    >
    > The **Premium** and **Developer** tiers support setting multiple host names for the **Gateway** endpoint.

1. Select **+Add**, or select an existing endpoint that you want to update.
1. In the window on the right, select the **Type** of endpoint for the custom domain.
1. In the **Hostname** field, specify the name you want to use. For example, `api.contoso.com`.
1. Under **Certificate**, select either **Key Vault** or **Custom**.
    - **Key Vault**
        - Click **Select**.
        - Select the **Subscription** from the dropdown list.
        - Select the **Key vault** from the dropdown list.
        - Once the certificates have loaded, select the **Certificate** from the dropdown list.
        - Click **Select**.
    - **Custom**
        - Select the **Certificate file** field to select and upload a certificate.
        - Upload a valid .PFX file and provide its **Password**, if the certificate is protected with a password.
1. When configuring a Gateway endpoint, select or deselect [other options as necessary](#clients-calling-with-server-name-indication-sni-header), like **Negotiate client certificate** or **Default SSL binding**.
1. Select **Update**.

    > [!NOTE]
    > Wildcard domain names, like `*.contoso.com`, are supported in all tiers except the Consumption tier.

    > [!TIP]
    > We recommend using [Azure Key Vault for managing certificates](../key-vault/certificates/about-certificates.md) and setting them to `autorenew`.
    >
    > If you use Azure Key Vault to manage the custom domain TLS/SSL certificate, make sure the certificate is inserted into Key Vault [as a _certificate_](/rest/api/keyvault/createcertificate/createcertificate), not a _secret_.
    >
    > To fetch a TLS/SSL certificate, API Management must have the list and get secrets permissions on the Azure Key Vault containing the certificate. 
    >
    >* When using Azure portal, all the necessary configuration steps will be completed automatically. 
    >* When using command line tools or management API, these permissions must be granted manually, in two steps:
    >    * Using the **Managed identities** page on your API Management instance, ensure that Managed Identity is enabled and note the principal id on that page. 
    >    * Give the permission list and get secrets permissions to this principal id on the Azure Key Vault containing the certificate.
    >
    > If the certificate is set to `autorenew` and your API Management tier has SLA (i. e. in all tiers except the Developer tier), API Management will pick up the latest version automatically, without any downtime to the service.

1. Click Apply.

    > [!NOTE]
    > The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer SKU has downtime, while Basic and higher SKUs do not.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## DNS configuration

When configuring DNS for your custom domain name, you can either:

-   Configure a CNAME-record that points to the endpoint of your configured custom domain name, or
-   Configure an A-record that points to your API Management gateway IP address.

While CNAME-records (or alias records) and A-records both allow you to associate a domain name with a specific server or service, they work differently. 

### CNAME or Alias record
A CNAME-record maps a *specific* domain (such as `contoso.com` or www\.contoso.com) to a canonical domain name. Once created, the CNAME creates an alias for the domain. The CNAME entry will resolve to the IP address of your custom domain service automatically, so if the IP address changes, you do not have to take any action.

> [!NOTE]
> Some domain registrars only allow you to map subdomains when using a CNAME-record, such as www\.contoso.com, and not root names, such as contoso.com. For more information on CNAME-records, see the documentation provided by your registrar, [the Wikipedia entry on CNAME-record](https://en.wikipedia.org/wiki/CNAME_record), or the [IETF Domain Names - Implementation and Specification](https://tools.ietf.org/html/rfc1035) document.

### A-record
An A-record maps a domain, such as `contoso.com` or **www\.contoso.com**, *or a wildcard domain*, such as **\*.contoso.com**, to an IP address. Since an A-record is mapped to a static IP address, it cannot automatically resolve changes to the IP address. We recommend using the more stable CNAME-record instead of an A-record.

> [!NOTE]
> Although the API Management instance IP address is static, it may change in a few scenarios. When choosing DNS configuration method, we recommend using a CNAME-record when configuring custom domain, as it is more stable than an A-record in case the IP changes. Read more in the [the IP documentation article](api-management-howto-ip-addresses.md#changes-to-the-ip-addresses) and the [API Management FAQ](./api-management-faq.yml#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-back-end-services-).

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)