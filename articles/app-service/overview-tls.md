---
title: Transport Layer Security (TLS) overview
description: Learn about Transport Layer Security (TLS) on App Service.
keywords: app service, azure app service, tls, transport layer security, support, web app, troubleshooting, 
ms.topic: article
ms.date: 07/24/2024
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
---
# Azure App Service TLS overview

## What does TLS do in App Service?

Transport Layer Security (TLS) is a widely adopted security protocol designed to secure connections and communications between servers and clients. App Service allows customers to use TLS/SSL certificates to secure incoming requests to their web apps. App Service currently supports different set of TLS features for customers to secure their web apps. 

## Supported TLS Version on App Service?

For incoming requests to your web app, App Service supports TLS versions 1.0, 1.1, 1.2, and 1.3.  

### Minimum TLS Version and SCM Minimum TLS Version 

App Service also allows you to set minimum TLS version for incoming requests to your web app and to SCM site. By default, the minimum TLS version for incoming requests to your web app and to SCM would be set to 1.2 on both portal and API. 

### TLS 1.0 and 1.1 

TLS 1.0 and 1.1 are considered legacy protocols and are no longer considered secure. It's generally recommended for customers to use TLS 1.2 or above as the minimum TLS version. When creating a web app, the default minimum TLS version would be TLS 1.2.

To ensure backward compatibility for TLS 1.0 and TLS 1.1, App Service will continue to support TLS 1.0 and 1.1 for incoming requests to your web app. However, since the default minimum TLS version is set to TLS 1.2, you need to update the minimum TLS version configurations on your web app to either TLS 1.0 or 1.1 so the requests won't be rejected. 

> [!IMPORTANT]
> Incoming requests to web apps and incoming requests to Azure are treated differently. App Service will continue to support TLS 1.0 and 1.1 for incoming requests to the web apps. For incoming requests directly to Azure, for example through ARM or API, it's not recommended to use TLS 1.0 or 1.1.
>

### TLS 1.3
With TLS 1.3, a "Minimum TLS Cipher Suite" setting is now available. This includes two cipher suites at the top of the cipher suite order:
- TLS_AES_256_GCM_SHA384  
- TLS_AES_128_GCM_SHA256 

> [!NOTE]
> Minimum TLS Cipher Suite is supported on Premium SKUs and higher on multi-tenant App Service.
>

#### What are cipher suites and how do they work on App Service? 

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end's OS would pick the most secure cipher suite that is supported by both App Service and the client. However, if the client only supports weak cipher suites, then the front-end's OS would end up picking a weak cipher suite that is supported by them both. If your organization has restrictions on what cipher suites should not be allowed, you may update your web app’s minimum TLS cipher suite property to ensure that the weak cipher suites would be disabled for your web app. 

#### App Service Environment (ASE) V3 with Cluster Setting "FrontEndSSLCipherSuiteOrder"

For App Service Environments with "FrontEndSSLCipherSuiteOrder" cluster setting, you need to update your settings to include two TLS 1.3 cipher suites (TLS_AES_256_GCM_SHA384 and TLS_AES_128_GCM_SHA256). Once updated, restart your front-end for the change to take effect. You must still include the two required cipher suites as mentioned in the docs. 

## End-to-end TLS Encryption (preview)

End-to-end (E2E) TLS encryption is available in Standard App Service plans and higher. Front-end intra-cluster traffic between App Service front-ends and the workers running application workloads can now be encrypted. Below is a simple diagram to help you understand how it works. 

INSERT-IMAGE-HERE

## Next steps
* [Secure a custom DNS name with a TLS/SSL binding](configure-ssl-bindings.md)
