---
title: Transport Layer Security (TLS) overview
description: Learn about Transport Layer Security (TLS) on App Service.
keywords: app service, azure app service, tls, transport layer security, support, web app, troubleshooting, 
ms.topic: article
ms.date: 02/18/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
ms.collection: ce-skilling-ai-copilot
---
# Azure App Service TLS overview

> [!NOTE]
> The [retirement of TLS 1.1 and 1.0 on Azure services](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/) doesn't affect applications running on App Service or Azure Functions.  Applications on either App Service or Azure Functions configured to accept TLS 1.0 or TLS 1.1 for incoming requests **will continue to run unaffected**.

Transport Layer Security (TLS) is a widely adopted security protocol designed to secure connections and communications between servers and clients. App Service allows customers to use TLS/SSL certificates to secure incoming requests to their web apps. App Service currently supports different set of TLS features for customers to secure their web apps. 

> [!TIP]
>
> You can also ask Azure Copilot these questions:
>
> - *What versions of TLS are supported in App Service?*
> - *What are the benefits of using TLS 1.3 over previous versions?*
> - *How can I change the cipher suite order for my App Service Environment?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

## Supported TLS Version on App Service?

For incoming requests to your web app, App Service supports TLS versions 1.0, 1.1, 1.2, and 1.3.  

### Set Minimum TLS Version
Follow these steps to change the Minimum TLS version of your App Service resource:
1. Browse to your app in the [Azure portal](https://portal.azure.com/) 
1. In the left menu, select **configuration** and then select the **General settings** tab. 
1. On __Minimum Inbound TLS Version__, using the dropdown, select your desired version. 
1. Select **Save** to save the changes. 

### Minimum TLS Version with Azure Policy 

You can use Azure Policy to help audit your resources when it comes to minimum TLS version. You can refer to [App Service apps should use the latest TLS version policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b) and change the values to your desired minimum TLS version. For similar policy definitions for other App Service resources, refer to [List of built-in policy definitions - Azure Policy for App Service](../governance/policy/samples/built-in-policies.md#app-service). 

### Minimum TLS Version and SCM Minimum TLS Version 

App Service also allows you to set minimum TLS version for incoming requests to your web app and to SCM site. By default, the minimum TLS version for incoming requests to your web app and to SCM is set to 1.2 on both portal and API. 

### TLS 1.3

TLS 1.3 is the latest and most secure TLS version supported on Azure App Service. It introduces significant security and performance improvements over TLS 1.2 by simplifying cryptographic algorithms, reducing handshake latency, and enhancing encryption.

Key benefits include:
- **Stronger Security**: Removes outdated cipher suites, enforces Perfect Forward Secrecy (PFS), and encrypts more of the handshake process.
- **Faster Handshake**: Reduces round trips, improving connection latency, especially for repeated sessions (0-RTT support).
- **Better Performance**: Uses streamlined encryption algorithms that lower computational overhead and improve efficiency.
- **Enhanced Privacy**: Encrypts handshake messages, reducing metadata exposure and mitigating downgrade attacks.

#### Cipher Suites  
A [Minimum TLS Cipher Suite](#minimum-tls-cipher-suite) setting is available with TLS 1.3. This includes two cipher suites at the top of the cipher suite order:
- TLS_AES_256_GCM_SHA384  
- TLS_AES_128_GCM_SHA256 

Since TLS 1.3 removes legacy cryptographic algorithms, it's recommended for applications that require modern security standards, improved performance, and reduced latency.

### TLS 1.2

TLS 1.2 is the default TLS version for Azure App Service. It provides strong encryption, improved security over older versions, and compliance with industry standards such as PCI DSS. Since TLS 1.2 is the default, no action is required unless you are migrating from an older TLS version. If your app currently uses TLS 1.0 or 1.1, updating to TLS 1.2 is recommended to maintain security, performance, and compliance. Azure App Service supports a predefined set of TLS 1.2 cipher suites to ensure secure communication between clients and your web app. 

### TLS 1.0 and 1.1 

TLS 1.0 and 1.1 are considered legacy protocols and are no longer considered secure. It's recommended for customers to use TLS 1.2 or above as the minimum TLS version. When creating a web app, the default minimum TLS version is TLS 1.2.

To ensure backward compatibility for TLS 1.0 and TLS 1.1, App Service will continue to support TLS 1.0 and 1.1 for incoming requests to your web app. However, since the default minimum TLS version is set to TLS 1.2, you need to update the minimum TLS version configurations on your web app to either TLS 1.0 or 1.1 so the requests won't be rejected. 

> [!IMPORTANT]
> Incoming requests to web apps and incoming requests to Azure are treated differently. App Service will continue to support TLS 1.0 and 1.1 for incoming requests to the web apps. For incoming requests directly to the Azure control plane, for example through ARM or API calls, it's not recommended to use TLS 1.0 or 1.1.
>

## Minimum TLS cipher suite

> [!NOTE]
> Minimum TLS Cipher Suite is supported on Basic SKUs and higher on multitenant App Service.

The minimum TLS cipher suite includes a fixed list of cipher suites with an optimal priority order that you cannot change. Reordering or reprioritizing the cipher suites isn't recommended as it could expose your web apps to weaker encryption. You also cannot add new or different cipher suites to this list. When you select a minimum cipher suite, the system automatically disables all less secure cipher suites for your web app, without allowing you to selectively disable only some weaker cipher suites.

### What are cipher suites and how do they work on App Service? 

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end's OS would pick the most secure cipher suite that is supported by both App Service and the client. However, if the client only supports weak cipher suites, then the front-end's OS would end up picking a weak cipher suite that is supported by them both. If your organization has restrictions on what cipher suites should not be allowed, you may update your web app’s minimum TLS cipher suite property to ensure that the weak cipher suites would be disabled for your web app. 

### App Service Environment (ASE) V3 with cluster setting `FrontEndSSLCipherSuiteOrder`

For App Service Environments with `FrontEndSSLCipherSuiteOrder` cluster setting, you need to update your settings to include two TLS 1.3 cipher suites (TLS_AES_256_GCM_SHA384 and TLS_AES_128_GCM_SHA256). Once updated, restart your front-end for the change to take effect. You must still include the two required cipher suites as mentioned in the docs. 

## End-to-end TLS Encryption

End-to-end (E2E) TLS encryption is available in Premium App Service plans (and legacy Standard App Service plans). Front-end intra-cluster traffic between App Service front-ends and the workers running application workloads can now be encrypted.

## Next steps
* [Secure a custom DNS name with a TLS/SSL binding](configure-ssl-bindings.md)
