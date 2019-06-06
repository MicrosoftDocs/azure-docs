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
ms.date: 05/29/2019
ms.author: apimpm
---

# Configure a custom domain name 

When you create an API Management (APIM) instance, Azure assigns it to a subdomain of azure-api.net (for example, `apim-service-name.azure-api.net`). However, you can expose your APIM endpoints using your own domain name, such as **contoso.com**. This tutorial shows you how to map an existing custom DNS name to endpoints exposed by an Azure API Management instance.

> [!WARNING]
> Customers who wish to use certificate pinning to improve the security of their applications must use a custom domain name > and certificate which they manage, not the default certificate. Customers that pin the default certificate instead will be > taking a hard dependency on the properties of the certificate they don't control, which is not a recommended practice.

## Prerequisites

To perform the steps described in this article, you must have:

+ An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ An APIM instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
+ A custom domain name that is owned by you. The custom domain name you want to use, must be procured separately and hosted on a DNS server. This topic does not give instructions on how to host a custom domain name.
+ You must have a valid certificate with a public and private key (.PFX). Subject or subject alternative name (SAN) has to match the domain name (this enables APIM to securely expose URLs over SSL).

## Use the Azure portal to set a custom domain name

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
1. Select **Custom domains and SSL**.
    
    There are a number of endpoints to which you can assign a custom domain name. Currently, the following endpoints are available: 
   + **Proxy** (default is: `<apim-service-name>.azure-api.net`), 
   + **Portal** (default is: `<apim-service-name>.portal.azure-api.net`),     
   + **Management** (default is: `<apim-service-name>.management.azure-api.net`), 
   + **SCM** (default is: `<apim-service-name>.scm.azure-api.net`).

     >[!NOTE]
     > You can update all of the endpoints or some of them. Commonly, customers update **Proxy** (this URL is used to call the API exposed through API Management) and **Portal** (the developer portal URL). **Management** and **SCM** endpoints are used internally by APIM customers and thus are less frequently assigned a custom domain name.

1. Select the endpoint that you want to update. 
1. In the window on the right, click **Custom**.

   + In the **Custom domain name**, specify the name you want to use. For example, `api.contoso.com`. Wildcard domain names (for example, *.domain.com) are also supported.
   + In the **Certificate**, select a certificate from Key Vault. You can also upload a valid .PFX file and provide its **Password**, if the certificate is protected with a password.

     > [!TIP]
     > If you use Azure Key Vault to manage the custom domain SSL certificate, make sure the certificate is inserted into Key Vault [as a *certificate*](https://docs.microsoft.com/rest/api/keyvault/CreateCertificate/CreateCertificate), not a *secret*. If the certificate is set to autorotate, API Management will pick up the latest version automatically.

1. Click Apply.

    >[!NOTE]
    >The process of assigning the certificate may take 15 minutes or more depending on size of deployment. Developer SKU has downtime, Basic and higher SKU's do not have downtime.

[!INCLUDE [api-management-custom-domain](../../includes/api-management-custom-domain.md)]

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)
