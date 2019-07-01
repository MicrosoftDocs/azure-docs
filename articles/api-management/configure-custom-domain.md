---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure a custom domain name for your Azure API Management instance | Microsoft Docs
description: This topic describes how to configure a custom domain name for your Azure API Management instance.
services: api-management
documentationcenter: ''
author: vladvino
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 07/01/2019
ms.author: apimpm
---

# Configure a custom domain name

When you create an Azure API Management service instance, Azure assigns it a subdomain of azure-api.net (for example, `apim-service-name.azure-api.net`). However, you can expose your API Management endpoints using your own custom domain name, such as **contoso.com**. This tutorial shows you how to map an existing custom DNS name to endpoints exposed by an API Management instance.

> [!WARNING]
> Customers who wish to use certificate pinning to improve the security of their applications must use a custom domain name > and certificate which they manage, not the default certificate. Customers that pin the default certificate instead will be > taking a hard dependency on the properties of the certificate they don't control, which is not a recommended practice.

## Prerequisites

To perform the steps described in this article, you must have:

-   An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
-   A custom domain name that is owned by you. The custom domain name you want to use, must be procured separately and hosted on a DNS server. This topic does not give instructions on how to host a custom domain name.
-   You must have a valid certificate with a public and private key (.PFX). Subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over SSL).

## Use the Azure portal to set a custom domain name

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).
1. Select **Custom domains and SSL**.

    There are a number of endpoints to which you can assign a custom domain name. Currently, the following endpoints are available:

    - **Proxy** (default is: `<apim-service-name>.azure-api.net`),
    - **Portal** (default is: `<apim-service-name>.portal.azure-api.net`),
    - **Management** (default is: `<apim-service-name>.management.azure-api.net`),
    - **SCM** (default is: `<apim-service-name>.scm.azure-api.net`).

    > [!NOTE]
    > You can update all of the endpoints or some of them. Commonly, customers update **Proxy** (this URL is used to call the API exposed through API Management) and **Portal** (the developer portal URL). **Management** and **SCM** endpoints are used internally by the API Management instance owners only and thus are less frequently assigned a custom domain name. In most cases only a single custom domain name can be set for a given endpoint. However, the **Premium** tier supports setting multiple host names for the **Proxy** endpoint.

1. Select the endpoint that you want to update.
1. In the window on the right, click **Custom**.

    - In the **Custom domain name**, specify the name you want to use. For example, `api.contoso.com`. Wildcard domain names (for example, \*.domain.com) are also supported.
    - In the **Certificate**, select a certificate from Key Vault. You can also upload a valid .PFX file and provide its **Password**, if the certificate is protected with a password.

    > [!TIP]
    > We recommend using Azure Key Vault for managing certificates and setting them to autorotate.
    > If you use Azure Key Vault to manage the custom domain SSL certificate, make sure the certificate is inserted into Key Vault [as a _certificate_](https://docs.microsoft.com/rest/api/keyvault/CreateCertificate/CreateCertificate), not a _secret_.
    >
    > To fetch an SSL certificate, API Management must have the list an get secrets permissions on the Azure Key Vault containing the certificate. When using Azure portal all the necessary configuration steps will be completed automatically. When using command line tools or management API, these permissions must be granted manually. This is done in two steps. First, use Managed identities page on your API Management instance to make sure that Managed Identity is enabled and make a note of the principal id shown on that page. Second, give permission list and get secrets permissions to this principal id on the Azure Key Vault containing the certificate.
    >
    > If the certificate is set to autorotate, API Management will pick up the latest version automatically without any downtime to the service (if your API Management tier has SLA - i. e. in all tiers except the Developer tier).

1. Click Apply.

    > [!NOTE]
    > The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer SKU has downtime, Basic and higher SKU's do not have downtime.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)
