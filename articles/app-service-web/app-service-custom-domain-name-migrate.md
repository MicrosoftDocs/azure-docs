---
title: Migrate an active custom domain to Azure App Service | Microsoft Docs
description: Learn how to migrate a custom domain that is already assigned to a live site to your app in Azure App Service without any downtime.
services: app-service
documentationcenter: ''
author: cephalin
manager: erikre
editor: jimbe
tags: top-support-issue

ms.assetid: 10da5b8a-1823-41a3-a2ff-a0717c2b5c2d
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2017
ms.author: cephalin

---
# Migrate an active custom domain to Azure App Service

This article shows you how to migrate an active custom domain to [Azure App Service](../app-service/app-service-value-prop-what-is.md) without any downtime.

When you migrate a live site and its domain name to App Service, that domain name is already serving live traffic, and you don't want any downtime in DNS resolution during
the migration process. In this case, you need to preemptively bind the domain name to your Azure app for domain verification.

## Prerequisites

This article assumes that you already know how to [manually map a custom domain to App Service](app-service-web-tutorial-custom-domain.md).

## Bind the domain name preemptively

When you bind a custom domain preemptively, you accomplish both of the following before making any changes to
your DNS records:

- Verify domain ownership
- Enable the domain name for your app

When you finally change the DNS record to point to your App Service app, clients are redirected from your old site
to your App Service app without any downtime in DNS resolution.

Follow the steps below:

1. First, create a verification TXT record with your DNS registry by following the steps at [Create the DNS record(s)](app-service-web-tutorial-custom-domain.md).
Your additional TXT record takes on the convention that maps from &lt;*subdomain*>.&lt;*rootdomain*> to &lt;*appname*>.azurewebsites.net.
See the following table for examples:  

    <table cellspacing="0" border="1">
    <tr>
    <th>FQDN example</th>
    <th>TXT Host</th>
    <th>TXT Value</th>
    </tr>
    <tr>
    <td>contoso.com (root)</td>
    <td>awverify.contoso.com</td>
    <td>&lt;<i>appname</i>>.azurewebsites.net</td>
    </tr>
    <tr>
    <td>www.contoso.com (sub)</td>
    <td>awverify.www.contoso.com</td>
    <td>&lt;<i>appname</i>>.azurewebsites.net</td>
    </tr>
    <tr>
    <td>\*.contoso.com (wildcard)</td>
    <td>awverify.\*.contoso.com</td>
    <td>&lt;<i>appname</i>>.azurewebsites.net</td>
    </tr>
    </table>

2. Then, add your custom domain name to your Azure app by following the steps at [Enable the custom domain name for your app](app-service-web-tutorial-custom-domain.md#enable-a).

    Your custom domain is now enabled in your Azure app. The only thing left to do is to update the DNS record with your domain registrar.

3. Finally, update your domain's DNS record to point to your Azure app as is shown in [Create the DNS record(s)](app-service-web-tutorial-custom-domain.md).

    User traffic should be redirected to your Azure app immediately after DNS propagation happens.

## Next steps
Learn how to secure your custom domain name with HTTPS by [buying an SSL certificate in Azure](web-sites-purchase-ssl-web-site.md) or [using an SSL certificate from elsewhere](app-service-web-tutorial-custom-ssl.md).

> [!NOTE]
> If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](https://azure.microsoft.com/try/app-service/), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
>
>

[Get started with Azure DNS](../dns/dns-getstarted-create-dnszone.md)  
[Create DNS records for a web app in a custom domain](../dns/dns-web-sites-custom-domain.md)  
[Delegate Domain to Azure DNS](../dns/dns-domain-delegation.md)
