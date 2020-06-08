---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure custom domain name for Azure API Management instance
titleSuffix: Azure API Management
description: This topic describes how to configure a custom domain name for your Azure API Management instance.
services: api-management
documentationcenter: ''
author: vladvino
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 01/13/2020
ms.author: apimpm
---

# Configure a custom domain name

When you create an Azure API Management service instance, Azure assigns it a subdomain of `azure-api.net` (for example, `apim-service-name.azure-api.net`). However, you can expose your API Management endpoints using your own custom domain name, such as **contoso.com**. This tutorial shows you how to map an existing custom DNS name to endpoints exposed by an API Management instance.

> [!IMPORTANT]
> API Management accepts only requests with [host header](https://tools.ietf.org/html/rfc2616#section-14.23) values matching the default domain name or any of the configured custom domain names.

> [!WARNING]
> Customers who wish to use certificate pinning to improve the security of their applications must use a custom domain name and certificate which they manage, not the default certificate. Customers that pin the default certificate instead will be taking a hard dependency on the properties of the certificate they don't control, which is not a recommended practice.

## Prerequisites

To perform the steps described in this article, you must have:

-   An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
-   A custom domain name that is owned by you or your organization. This topic does not provide instructions on how to procure a custom domain name.
-   A CNAME record hosted on a DNS server that maps the custom domain name to the default domain name of your API Management instance. This topic does not provide instructions on how to host a CNAME record.
-   You must have a valid certificate with a public and private key (.PFX). Subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over TLS).

## Use the Azure portal to set a custom domain name

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. Select **Custom domains**.

    There are a number of endpoints to which you can assign a custom domain name. Currently, the following endpoints are available:

    - **Gateway** (default is: `<apim-service-name>.azure-api.net`),
    - **Portal** (default is: `<apim-service-name>.portal.azure-api.net`),
    - **Management** (default is: `<apim-service-name>.management.azure-api.net`),
    - **SCM** (default is: `<apim-service-name>.scm.azure-api.net`),
    - **NewPortal** (default is: `<apim-service-name>.developer.azure-api.net`).

    > [!NOTE]
    > Only the **Gateway** endpoint is available for configuration in the Consumption tier.
    > You can update all of the endpoints or some of them. Commonly, customers update **Gateway** (this URL is used to call the API exposed through API Management) and **Portal** (the developer portal URL).
    > **Management** and **SCM** endpoints are used internally by the API Management instance owners only and thus are less frequently assigned a custom domain name.
    > The **Premium** tier supports setting multiple host names for the **Gateway** endpoint.

1. Select the endpoint that you want to update.
1. In the window on the right, click **Custom**.

    - In the **Custom domain name**, specify the name you want to use. For example, `api.contoso.com`.
    - In the **Certificate**, select a certificate from Key Vault. You can also upload a valid .PFX file and provide its **Password**, if the certificate is protected with a password.

    > [!NOTE]
    > Wildcard domain names, e.g. `*.contoso.com` are supported in all tiers except the Consumption tier.

    > [!TIP]
    > We recommend using [Azure Key Vault for managing certificates](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates) and setting them to autorenew.
    > If you use Azure Key Vault to manage the custom domain TLS/SSL certificate, make sure the certificate is inserted into Key Vault [as a _certificate_](https://docs.microsoft.com/rest/api/keyvault/CreateCertificate/CreateCertificate), not a _secret_.
    >
    > To fetch a TLS/SSL certificate, API Management must have the list and get secrets permissions on the Azure Key Vault containing the certificate. When using Azure portal all the necessary configuration steps will be completed automatically. When using command line tools or management API, these permissions must be granted manually. This is done in two steps. First, use Managed identities page on your API Management instance to make sure that Managed Identity is enabled and make a note of the principal id shown on that page. Second, give permission list and get secrets permissions to this principal id on the Azure Key Vault containing the certificate.
    >
    > If the certificate is set to autorenew, API Management will pick up the latest version automatically without any downtime to the service (if your API Management tier has SLA - i. e. in all tiers except the Developer tier).

1. Click Apply.

    > [!NOTE]
    > The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer SKU has downtime, Basic and higher SKUs do not have downtime.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## DNS configuration

When configuring DNS for your custom domain name, you have two options:

-   Configure a CNAME-record that points to the endpoint of your configured custom domain name.
-   Configure an A-record that points to your API Management gateway IP address.

> [!NOTE]
> Although the API Managment instance IP address is static, it may change in a few scenarios. Because of this it's recommended to use CNAME when configuring custom domain. Take that into consideration when choosing DNS configuration method. Read more in the [the IP documentation article](api-management-howto-ip-addresses.md#changes-to-the-ip-addresses) and the [API Management FAQ](api-management-faq.md#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-back-end-services).

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)
