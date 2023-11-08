---
title: Transport Layer Security (TLS) overview
description: Learn about Transport Layer Security (TLS) on App Service.
keywords: app service, azure app service, tls, transport layer security, support, web app, troubleshooting, 
ms.topic: article
ms.date: 11/06/2023
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
---
# Azure App Service TLS overview

## What does TLS do in App Service?

Transport Layer Security (TLS) is a widely adopted security protocol designed to secure connections and communications between servers and clients. App Service allows customers to use TLS/SSL certificates to secure incoming requests to their web apps. App Service currently supports different set of TLS features for customers to secure their web apps. 

## What TLS options are available in App Service?

For incoming requests to your web app, App Service supports TLS versions 1.0, 1.1, and 1.2. [In the next few months, App Service will begin supporting TLS version 1.3](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/upcoming-tls-1-3-on-azure-app-service-for-web-apps-functions-and/ba-p/3974138).  

### Minimum TLS Version and SCM Minimum TLS Version 

App Service also allows you to set minimum TLS version for incoming requests to your web app and to SCM site. By default, the minimum TLS version for incoming requests to your web app and to SCM would be set to 1.2 on both portal and API. 

## TLS 1.0 and 1.1 

TLS 1.0 and 1.1 are considered legacy protocols and are no longer considered secure. It's generally recommended for customers to use TLS 1.2 as the minimum TLS version, which is also the default.  

To ensure backward compatibility for TLS 1.0 and TLS 1.1, App Service will continue to support TLS 1.0 and 1.1 for incoming requests to your web app. However, since the default minimum TLS version is set to TLS 1.2, you need to update the minimum TLS version configurations on your web app to either TLS 1.0 or 1.1 so the requests won't be rejected. 

> [!IMPORTANT]
> Incoming requests to web apps and incoming requests to Azure are treated differently. App Service will continue to support TLS 1.0 and 1.1 for incoming requests to the web apps. For incoming requests directly to Azure, for example through ARM or API, it's not recommended to use TLS 1.0 or 1.1.
>

## Next steps
* [Secure a custom DNS name with a TLS/SSL binding](configure-ssl-bindings.md)