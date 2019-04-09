---
title: Configure DNS names for apps that use Traffic Manager - Azure App Service
description: Use a custom domain name for an a web app in Azure App Service that includes Traffic Manager for load balancing.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.assetid: 0f96c0e7-0901-489b-a95a-e3b66ca0a1c2
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/17/2016
ms.author: cephalin
ms.custom: seodec18

---
# Configuring a custom domain name for a web app in Azure App Service using Traffic Manager
[!INCLUDE [web-selector](../../includes/websites-custom-domain-selector.md)]

[!INCLUDE [intro](../../includes/custom-dns-web-site-intro-traffic-manager.md)]

This article provides generic instructions for using a custom domain name with an [App Service](overview.md) app that is integrated with [Traffic Manager](../traffic-manager/traffic-manager-overview.md) for load balancing.

[!INCLUDE [tmwebsitefooter](../../includes/custom-dns-web-site-traffic-manager-notes.md)]

[!INCLUDE [introfooter](../../includes/custom-dns-web-site-intro-notes.md)]

<a name="understanding-records"></a>

## Understanding DNS records
[!INCLUDE [understandingdns](../../includes/custom-dns-web-site-understanding-dns-traffic-manager.md)]

<a name="bkmk_configsharedmode"></a>

## Configure your web apps for standard mode
[!INCLUDE [modes](../../includes/custom-dns-web-site-modes-traffic-manager.md)]

<a name="bkmk_configurecname"></a>

## Add a DNS record for your custom domain
> [!NOTE]
> If you have purchased domain through Azure App Service Web Apps then skip following steps and refer to the final step of [Buy Domain for Web Apps](manage-custom-dns-buy-domain.md) article.
> 
> 

To associate your custom domain with a web app in Azure App Service, you must add a new entry in the DNS table for your custom domain. You do this by using the management tools from your domain provider.

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

While the specifics of each domain provider vary, you map *from* your custom domain name (such as **contoso.com**) *to* the Traffic Manager domain name (**contoso.trafficmanager.net**) that is integrated with your web app.

> [!NOTE]
> If a record is already in use and you need to preemptively bind your apps to it, you can create an additional CNAME record. For example, to preemptively bind **www\.contoso.com** to your web app, create a CNAME record from **awverify.www** to **contoso.trafficmanager.net**. You can then add "www\.contoso.com" to your Web App without changing the "www" CNAME record. For more information, see [Create DNS records for a web app in a custom domain][CREATEDNS].

Once you have finished adding or modifying DNS records at your domain provider, save the changes.

<a name="enabledomain"></a>

## Enable Traffic Manager
[!INCLUDE [modes](../../includes/custom-dns-web-site-enable-on-traffic-manager.md)]

## Next steps
For more information, see the [Node.js Developer Center](https://azure.microsoft.com/develop/nodejs/).

<!-- URL List -->

[CREATEDNS]: ../dns/dns-web-sites-custom-domain.md
